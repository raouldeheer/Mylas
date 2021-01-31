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

export const proxyMarker = Symbol("WorkerLink.proxy");
export const createEndpoint = Symbol("WorkerLink.endpoint");
export const releaseProxy = Symbol("WorkerLink.releaseProxy");
export const throwMarker = Symbol("WorkerLink.thrown");

export interface ProxyMarked {
    [proxyMarker]: true;
}

export type Remote<T> =
    RemoteObject<T> &
    (T extends (...args: infer TArguments) => infer TReturn
        ? (
            ...args: { [I in keyof TArguments]: UnproxyOrClone<TArguments[I]> }
        ) => Promisify<ProxyOrClone<Unpromisify<TReturn>>>
        : unknown) &
    (T extends { new(...args: infer TArguments): infer TInstance }
        ? {
            new(
                ...args: {
                    [I in keyof TArguments]: UnproxyOrClone<TArguments[I]>;
                }
            ): Promisify<Remote<TInstance>>;
        }
        : unknown) &
    ProxyMethods;

type Promisify<T> = T extends Promise<unknown> ? T : Promise<T>;

type Unpromisify<P> = P extends Promise<infer T> ? T : P;

type MaybePromise<T> = Promise<T> | T;

type RemoteProperty<T> =
    T extends Function | ProxyMarked ? Remote<T> : Promisify<T>;

type LocalProperty<T> = T extends Function | ProxyMarked
    ? Local<T>
    : Unpromisify<T>;

type ProxyOrClone<T> = T extends ProxyMarked ? Remote<T> : T;

type UnproxyOrClone<T> = T extends RemoteObject<ProxyMarked>
    ? Local<T>
    : T;

type RemoteObject<T> = { [P in keyof T]: RemoteProperty<T[P]> };

type LocalObject<T> = { [P in keyof T]: LocalProperty<T[P]> };

interface ProxyMethods {
    [createEndpoint]: () => Promise<MessagePort>;
    [releaseProxy]: () => void;
}

type Local<T> =
    Omit<LocalObject<T>, keyof ProxyMethods> &
    (T extends (...args: infer TArguments) => infer TReturn
        ? (
            ...args: { [I in keyof TArguments]: ProxyOrClone<TArguments[I]> }
        ) => MaybePromise<UnproxyOrClone<Unpromisify<TReturn>>>
        : unknown) &
    (T extends { new(...args: infer TArguments): infer TInstance } ? {
        new(
            ...args: {
                [I in keyof TArguments]: ProxyOrClone<TArguments[I]>;
            }
        ): MaybePromise<Local<Unpromisify<TInstance>>>;
    } : unknown);