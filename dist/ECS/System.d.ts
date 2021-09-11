import { Simulation } from "../Simulation";
import { Entity } from "./Entity";
import { Frame } from "../Frame";
export declare abstract class System {
    abstract tickFrame(frame: Frame, simulation: Simulation): void;
    abstract tickReplay(frame: Frame, simulation: Simulation, entityId: string): void;
    abstract tickEntity(frame: Frame, simulation: Simulation, entity: Entity): void;
}
