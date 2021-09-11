import {Component} from "./Component";
import {TEventData} from "../IEvent";
import {ModelData} from "simple-ts-models/dist/ModelAbstract";
import {uuid} from "../utils";

export class Entity {
    public static readonly entityRegistry: {[key: string]: any} = {};
    public readonly entityType: string | null = null;
    public readonly uid: string;
    private readonly components: Component[] = [];

    constructor(uid: string, entityType: string, data: ModelData) {
        this.uid = uid;
        this.entityType = entityType;
        const defaultData = this.getDefaultData();
        for (const k in defaultData) {
            data[k] = defaultData[k];
        }
        this.addComponents(data);
    }

    getDefaultData(): ModelData {
        return {}
    }

    addComponents(data: ModelData) {}

    addComponent(component: Component) {
        this.components.push(component);
    }

    getComponent<T extends Component>(type: any): T | null {
        for (const c of this.components) {
            if (c instanceof type)
                return c as T;
        }

        return null;
    }

    getSnapshot() {
        const snapshot: {[key: string]: TEventData} = {};
        for (const c of this.components) {
            const data = c.getData();
            for (const key in data) {
                snapshot[key] = data[key];
            }
        }
        return snapshot;
    }

    setSnapshot(snapshot: ModelData): void {
        for (const c of this.components) {
            c.setData(snapshot);
        }
    }

    public static register(name: string, setup: (() => void) | null = null) {
        return function(target: any, _key: string | null = null) {
            Entity.entityRegistry[name] = target;
        }
    }

    public static constructEntity<T extends Entity = Entity>(name: string, data: ModelData, uid: string | null = null): T {
        if (uid === null)
            uid = uuid();

        const cls = Entity.entityRegistry[name];
        return new cls(uid, name, data);
    }
}
