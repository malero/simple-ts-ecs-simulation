import {TSimulationEventType} from "./ESimulationEventType";
import {Model} from "simple-ts-models";
import {ModelData} from "simple-ts-models/dist/ModelAbstract";

export class SimulationEventDefinition extends Model {
    public static readonly eventRegistry: {[key: string]: SimulationEventDefinition} = {};

    public static instantiate(t: TSimulationEventType, data: ModelData) {
        const cls: any = SimulationEventDefinition.eventRegistry[t];
        if (!cls)
            return null;
        return new cls(data);
    }

    public static clean(t: TSimulationEventType, data: ModelData) {
        const obj = SimulationEventDefinition.instantiate(t, data);
        const errors = obj.validate();
        if (errors.length > 0)
            throw new Error("Failed to validate");
        return obj.getData();
    }

    public static register(t: TSimulationEventType, setup: (() => void) | null = null) {
        return function(target: any, _key: string | null = null) {
            SimulationEventDefinition.eventRegistry[t] = target;
        }
    }
}
