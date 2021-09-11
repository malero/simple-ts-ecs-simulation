import { EventDispatcher } from "simple-ts-event-dispatcher";
import { ESimulationEventType } from "./ESimulationEventType";
import { Frame } from "./Frame";
import { IEvent, TEventData } from "./IEvent";
import { Entity } from "./ECS/Entity";
import { System } from "./ECS/System";
export declare class Simulation extends EventDispatcher {
    readonly authority: boolean;
    static readonly EchoedEvents: ESimulationEventType[];
    static readonly FrameTime: number;
    static readonly KeyFrameEvery: number;
    protected _keyFrame: number;
    protected _frame: number;
    protected _timeLast: number;
    protected tickTimeout: any;
    protected currentFrame: Frame | null;
    protected frameHashMap: {
        [key: string]: Frame;
    };
    protected readonly queuedEvents: IEvent[];
    protected offset: number;
    readonly entities: {
        [key: string]: Entity;
    };
    protected systems: System[];
    constructor(keyFrame?: number, frame?: number, authority?: boolean);
    addSystem(system: System): void;
    protected tick(): void;
    replayEntityFromKeyframe(keyFrame: number, entityId: TEventData): void;
    getNextFrame(): {
        frame: number;
        keyFrame: number;
        isKeyFrame: boolean;
    };
    addOffset(offset: number): void;
    frameAdvance(frames?: number): {
        keyFrame: number;
        frame: number;
    };
    createEvent(bundle: IEvent): void;
    addExternalEvent(bundle: IEvent): void;
    protected addEventToFrame(bundle: IEvent): void;
    protected invalidateEvent(bundle: IEvent): void;
    getFrameIndex(keyFrame: number, frame: number): number;
    getFrame(keyFrame: number, frame: number, create?: boolean): Frame;
    getFrameHash(keyFrame: number, frame: number): string;
    getFrameDifference(keyFrame0: number, frame0: number, keyFrame1: number, frame1: number): number | null;
    get keyFrame(): number;
    get frame(): number;
    getEntitiesByType(type: any): Entity[];
}
