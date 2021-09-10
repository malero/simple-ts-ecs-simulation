import { TSimulationEventType } from "./ESimulationEventType";
import { EAuthority, EEventAction } from "./constants";
export declare type TEventData = number | string | boolean | null;
export interface IEvent {
    type: TSimulationEventType;
    data: {
        [key: string]: TEventData;
    };
    frame: number;
    keyFrame: number;
    action: EEventAction;
    authority: EAuthority;
    server_uid: string;
    client_uid: string;
    socket_id: string;
}
