import { Component } from "./Component";
import { TEventData } from "../IEvent";
import { ModelData } from "simple-ts-models/dist/ModelAbstract";
export declare class Entity {
    readonly uid: string;
    private readonly components;
    constructor(uid: string);
    addComponent(component: Component): void;
    getComponent<T extends Component>(type: any): T | null;
    getSnapshot(): {
        [key: string]: TEventData;
    };
    setSnapshot(snapshot: ModelData): void;
}
