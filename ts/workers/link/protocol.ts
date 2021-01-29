/* eslint-disable */
export interface EventSource {
    addEventListener(
        type: string,
        listener: EventListenerOrEventListenerObject,
        options?: {}
    ): void;
    removeEventListener(
        type: string,
        listener: EventListenerOrEventListenerObject,
        options?: {}
    ): void;
}

export interface PostMessageWithOrigin {
    postMessage(
        message: any,
        targetOrigin: string,
        transfer?: Transferable[]
    ): void;
}

export interface Endpoint extends EventSource {
    postMessage(message: any, transfer?: Transferable[]): void;
    start?: () => void;
}

export const enum WireValueType {
    RAW,
    PROXY,
    THROW,
    HANDLER,
}

export interface RawWireValue {
    id?: string;
    type: WireValueType.RAW;
    value: {};
}

export interface HandlerWireValue {
    id?: string;
    type: WireValueType.HANDLER;
    name: string;
    value: unknown;
}

export type WireValue = RawWireValue | HandlerWireValue;

export type MessageID = string;

export const enum MessageType {
    GET,
    SET,
    APPLY,
    CONSTRUCT,
    ENDPOINT,
    RELEASE,
}

export interface GetMessage {
    id?: MessageID;
    type: MessageType.GET;
    path: string[];
}

export interface SetMessage {
    id?: MessageID;
    type: MessageType.SET;
    path: string[];
    value: WireValue;
}

export interface ApplyMessage {
    id?: MessageID;
    type: MessageType.APPLY;
    path: string[];
    argumentList: WireValue[];
}

export interface ConstructMessage {
    id?: MessageID;
    type: MessageType.CONSTRUCT;
    path: string[];
    argumentList: WireValue[];
}

export interface EndpointMessage {
    id?: MessageID;
    type: MessageType.ENDPOINT;
}

export interface ReleaseMessage {
    id?: MessageID;
    type: MessageType.RELEASE;
    path: string[];
}

export type Message =
    | GetMessage
    | SetMessage
    | ApplyMessage
    | ConstructMessage
    | EndpointMessage
    | ReleaseMessage;
