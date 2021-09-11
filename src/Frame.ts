import {IEvent} from "./IEvent";
import {TSimulationEventType} from "./ESimulationEventType";
import {ModelData} from "simple-ts-models/dist/ModelAbstract";


export class Frame {
    protected snapshots: ModelData = {};
    protected events: IEvent[];

    constructor(
        public readonly keyFrame: number,
        public readonly frame: number
    ) {
        this.events = [];
    }

    public get isKeyFrame(): boolean {
        return this.frame === 0;
    }

    addEvent(bundle: IEvent) {
        this.events.push(bundle);
    }

    addSnapshot(entityId: string, snapshot: ModelData) {
        this.snapshots[entityId] = snapshot;
    }

    updateSnapshot(entityId: string, data: ModelData) {
        const snapshot = this.snapshots[entityId];
        if (snapshot) {
            for (const key in data) {
                snapshot[key] = data[key];
            }
        }
    }

    getSnapshot(entityId: string) {
        return this.snapshots[entityId];
    }

    getEventsFor(uid: string, type: TSimulationEventType) {
        const events = [];
        for (const e of this.events) {
            //console.log('finding events', e.type, '===', type, e.data.entity_id, '===', uid);
            if (e.type === type && e.data.entity_id === uid)
                events.push(e);
        }
        return events;
    }
}
