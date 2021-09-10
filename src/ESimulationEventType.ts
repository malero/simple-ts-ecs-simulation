
export enum ESimulationEventType {
    CONNECTION,
    DISCONNECTION,
    INPUT,
    CREATE_ENTITY,
    DESTROY_ENTITY
}

export type TSimulationEventType = ESimulationEventType | number;
