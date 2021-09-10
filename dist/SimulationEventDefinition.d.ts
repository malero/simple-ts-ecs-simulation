import { TSimulationEventType } from "./ESimulationEventType";
import { Model } from "simple-ts-models";
import { ModelData } from "simple-ts-models/dist/ModelAbstract";
export declare class SimulationEventDefinition extends Model {
    static readonly eventRegistry: {
        [key: string]: SimulationEventDefinition;
    };
    static instantiate(t: TSimulationEventType, data: ModelData): any;
    static clean(t: TSimulationEventType, data: ModelData): any;
    static register(t: TSimulationEventType, setup?: (() => void) | null): (target: any, _key?: string | null) => void;
}
