import { IEvent } from "./IEvent";
import { TSimulationEventType } from "./ESimulationEventType";
import { ModelData } from "simple-ts-models/dist/ModelAbstract";
export declare class Frame {
    readonly keyFrame: number;
    readonly frame: number;
    protected snapshots: ModelData;
    protected events: IEvent[];
    constructor(keyFrame: number, frame: number);
    get isKeyFrame(): boolean;
    addEvent(bundle: IEvent): void;
    addSnapshot(entityId: string, snapshot: ModelData): void;
    updateSnapshot(entityId: string, data: ModelData): void;
    getSnapshot(entityId: string): any;
    getEventsFor(uid: string, type: TSimulationEventType): IEvent[];
}
