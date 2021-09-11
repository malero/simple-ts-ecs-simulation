import { Component } from "./Component";
import { TEventData } from "../IEvent";
import { ModelData } from "simple-ts-models/dist/ModelAbstract";
export declare class Entity {
    static readonly entityRegistry: {
        [key: string]: any;
    };
    readonly entityType: string | null;
    readonly uid: string;
    private readonly components;
    constructor(uid: string, entityType: string);
    addComponent(component: Component): void;
    getComponent<T extends Component>(type: any): T | null;
    getSnapshot(): {
        [key: string]: TEventData;
    };
    setSnapshot(snapshot: ModelData): void;
    static register(name: string, setup?: (() => void) | null): (target: any, _key?: string | null) => void;
    static constructEntity<T extends Entity = Entity>(name: string, uid?: string | null): T;
}
