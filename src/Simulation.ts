import {EventDispatcher} from "simple-ts-event-dispatcher";
import {ESimulationEventType} from "./ESimulationEventType";
import {Frame} from "./Frame";
import {IEvent, TEventData} from "./IEvent";
import {Entity} from "./ECS/Entity";
import {System} from "./ECS/System";
import {EAuthority, EEventAction} from "./constants";
import {uuid} from "./utils";
import {SimulationEventDefinition} from "./SimulationEventDefinition";


export class Simulation extends EventDispatcher {
    public static readonly EchoedEvents: ESimulationEventType[] = [
        ESimulationEventType.INPUT,
    ];

    public static readonly FrameTime: number = 50;
    public static readonly KeyFrameEvery: number = 500 / Simulation.FrameTime;
    protected _keyFrame: number = 0;
    protected _frame: number = -1;
    protected _timeLast: number;
    protected tickTimeout: any;
    protected currentFrame: Frame | null = null;
    protected frameHashMap: {[key: string]: Frame} = {};
    protected readonly queuedEvents: IEvent[] = [];
    protected offset: number = 0;

    protected entities: {[key: string]: Entity};
    protected systems: System[];

    constructor(keyFrame: number = 0, frame: number = 0, public readonly authority = false) {
        super();
        this._keyFrame = keyFrame;
        this._frame = frame;
        this.entities = {};
        this.systems = [];
        this._timeLast = new Date().getTime();
        this.tick();
    }

    public addSystem(system: System) {
        this.systems.push(system);
    }

    public addEntity(entity: Entity) {
        if (!this.entities[entity.uid]) {
            this.entities[entity.uid] = entity;
            this.trigger('entityAdded', entity);
        }
    }

    public getEntity(uid: string): Entity {
        return this.entities[uid];
    }

    public removeEntity(entity: Entity) {
        if (this.entities[entity.uid]) {
            delete this.entities[entity.uid];
            this.trigger('entityRemoved', entity);
        }
    }

    protected tick() {
        const now = (new Date()).getTime();
        const nextFrame = this.getNextFrame();
        this._frame = nextFrame.frame;
        this._keyFrame = nextFrame.keyFrame;
        const isKeyframe = nextFrame.isKeyFrame;

        this.currentFrame = this.getFrame(this._keyFrame, this._frame, true);
        if (nextFrame.isKeyFrame)
            this.trigger('keyFrame', this.keyFrame);
        else
            this.trigger('frame', this.frame);

        for (let i = this.queuedEvents.length - 1; i >= 0; i--) {
            const e = this.queuedEvents[i];
            if (e.keyFrame === this.currentFrame.keyFrame && e.frame === this.currentFrame.frame) {
                this.currentFrame.addEvent(e);
                this.queuedEvents.splice(i, 1);
            }
        }

        for (const system of this.systems) {
            system.tickFrame(this.currentFrame, this);
            for (const entityId in this.entities) {
                const entity = this.entities[entityId];
                system.tickEntity(this.currentFrame, this, entity);
            }
        }

        if (isKeyframe) {
            for (const entityId in this.entities) {
                const entity = this.entities[entityId];
                this.currentFrame.addSnapshot(entityId, entity.getSnapshot());
            }
        }

        const postExecuteTime = (new Date()).getTime()
        const frameTime = postExecuteTime - now;
        const offsetSign = Math.sign(this.offset);
        const offset = Math.abs(this.offset) > Simulation.FrameTime ? Simulation.FrameTime * offsetSign : this.offset;
        let tickQueue = Simulation.FrameTime - frameTime + offset;
        this.offset -= offset;

        this._timeLast = now;
        if (tickQueue <= 0) { // behind simulation authority
            this.tick();
        } else { // ahead or on time
            this.tickTimeout = setTimeout(this.tick.bind(this), tickQueue);
        }
    }

    public replayEntityFromKeyframe(keyFrame: number, entityId: TEventData) {
        if (!keyFrame || !entityId) {
            return;
        }
        const frame = this.getFrame(keyFrame, 0, true);
        const entity = this.entities[entityId as string];
        const snapshot = frame.getSnapshot(entityId as string);
        if (entity && snapshot)
            entity.setSnapshot(snapshot);
        else
            return false; // Can't replay if we don't have a snapshot

        const numFrames: number | null = this.getFrameDifference(this._keyFrame, this._frame, keyFrame, 0);
        const index: number = this.getFrameIndex(frame.keyFrame, frame.frame);
        const lastIndex = index + (numFrames || 0);
        for (let i = index; i <= lastIndex; i++) {
            const _frame = this.getFrame(Math.floor(i / Simulation.KeyFrameEvery), i % Simulation.KeyFrameEvery, true);
            for (const system of this.systems) {
                system.tickReplay(_frame, this, entityId as string);
                if (entity)
                    system.tickEntity(frame, this, entity);
            }
        }
    }

    public getNextFrame() {
        if (this._frame + 1 >= Simulation.KeyFrameEvery) {
            return {
                frame: 0,
                keyFrame: this._keyFrame + 1,
                isKeyFrame: true
            }
        } else {
            return {
                frame: this._frame + 1,
                keyFrame: this._keyFrame,
                isKeyFrame: false
            }
        }
    }

    public addOffset(offset: number) {
        this.offset += offset;
    }

    public frameAdvance(frames: number = 1) {
        const kfs = Math.floor(frames / Simulation.KeyFrameEvery);
        return {
            keyFrame: this._keyFrame + kfs,
            frame: this._frame + frames - 10 * kfs
        };
    }

    public createEvent(bundle: IEvent) {
        const uid = uuid();
        const nextFrame = this.getNextFrame();
        bundle.keyFrame = nextFrame.keyFrame;
        bundle.frame = nextFrame.frame; // Process event on next frame
        bundle.action = EEventAction.CREATE;

        if (this.authority) {
            bundle['server_uid'] = uid;
        } else {
            bundle['client_uid'] = uid;
        }

        this.trigger("event", bundle);
        this.addEventToFrame(bundle);
    }

    public addExternalEvent(bundle: IEvent) {
        if (this.authority) {
            try {
                bundle.data = SimulationEventDefinition.clean(bundle.type, bundle.data);
            } catch (e) {
                console.log('bad data', bundle);
                return;
            }

            bundle.data.entity_id = bundle.socket_id;
            bundle["server_uid"] = uuid();

            if (Simulation.EchoedEvents.indexOf(bundle.type) > -1) {
                bundle['authority'] = EAuthority.SERVER;
                bundle['action'] = EEventAction.ECHO;
                this.trigger("event", bundle);
            }
        }

        this.addEventToFrame(bundle);
    }

    protected addEventToFrame(bundle: IEvent) {
        const frame = this.getFrame(bundle.keyFrame, bundle.frame, true);
        const frameDiff: number | null = this.getFrameDifference(this._keyFrame, this._frame, bundle.keyFrame, bundle.frame);

        if (this.authority && frameDiff !== null && frameDiff > Simulation.KeyFrameEvery * 3) {
            console.log('invalidating event', bundle);
            this.invalidateEvent(bundle);
            return;
        }

        frame.addEvent(bundle);

        if (frameDiff === null || frameDiff > -1) {
            this.replayEntityFromKeyframe(bundle.keyFrame - 1, bundle.data.entity_id);
        }
    }

    protected invalidateEvent(bundle: IEvent) {
        bundle.action = EEventAction.PURGE;
        this.trigger('event', bundle);
    }

    public getFrameIndex(keyFrame: number, frame: number): number {
        return keyFrame * Simulation.KeyFrameEvery + frame;
    }

    public getFrame(keyFrame: number, frame: number, create: boolean = false) {
        const hash: string = this.getFrameHash(keyFrame, frame);
        let _frame = this.frameHashMap[hash];
        if (create && !_frame) {
            this.frameHashMap[hash] = new Frame(keyFrame, frame);
            return this.frameHashMap[hash];
        } else {
            return _frame;
        }
    }

    public getFrameHash(keyFrame: number, frame: number): string {
        return `${keyFrame}_${frame}`;
    }

    public getFrameDifference(keyFrame0: number, frame0: number, keyFrame1: number, frame1: number): number | null {
        if (!keyFrame0 || !keyFrame1)
            return null;

        const frame1Index = this.getFrameIndex(keyFrame0, frame0);
        const frame2Index = this.getFrameIndex(keyFrame1, frame1);
        return frame1Index - frame2Index;
    }

    public get keyFrame(): number {
        return this._keyFrame;
    }

    public get frame(): number {
        return this._frame;
    }

    public getEntitiesByType(type: any): Entity[] {
        const entities = [];
        for (const uid in this.entities) {
            if (this.entities[uid] instanceof type)
                entities.push(this.entities[uid]);

        }
        return entities;
    }
}
