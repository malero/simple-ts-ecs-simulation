import {Simulation} from "../Simulation";
import {Entity} from "./Entity";
import {Frame} from "../Frame";

export abstract class System {
    public abstract tickFrame(frame: Frame, simulation: Simulation): void;
    public abstract tickReplay(frame: Frame, simulation: Simulation, entityId: string): void;
    public abstract tickEntity(entity: Entity): void;
}
