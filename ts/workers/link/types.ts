/* eslint-disable */
export const proxyMarker = Symbol("link.proxy");
export const createEndpoint = Symbol("link.endpoint");
export const release = Symbol("link.releaseProxy");
export const throwMarker = Symbol("link.thrown");
export {
    Endpoint, PM as ProxyMarked, WireValue,
    Message, RM as Remote, WireValueType, MessageType
}
interface Endpoint {
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
    postMessage(message: any, transfer?: Transferable[]): void;
    start?: () => void;
}
interface PM { [proxyMarker]: true; }
interface PMT {
    [createEndpoint]: () => Promise<MessagePort>;
    [release]: () => void;
}

type WireValue = { id?: string; type: WireValueType.RAW; value: {}; }
    | { id?: string; type: WireValueType.HANDLER; name: string; value: unknown; };
type Message = { id?: string; type: MessageType.GET; path: string[]; }
    | { id?: string; type: MessageType.SET; path: string[]; value: WireValue; }
    | { id?: string; type: MessageType.APPLY; path: string[]; argumentList: WireValue[]; }
    | { id?: string; type: MessageType.CONSTRUCT; path: string[]; argumentList: WireValue[]; }
    | { id?: string; type: MessageType.ENDPOINT; }
    | { id?: string; type: MessageType.RELEASE; path: string[]; };
type RM<T> = { [P in keyof T]: RP<T[P]> } &
    (T extends (...args: infer TAR) => infer TRN
        ? (...args: { [I in keyof TAR]: UPOC<TAR[I]> }
        ) => PMIFY<POC<UPMIFY<TRN>>>
        : unknown) &
    (T extends { new(...args: infer TAR): infer TIN }
        ? {
            new(...args: {
                [I in keyof TAR]: UPOC<TAR[I]>;
            }): PMIFY<RM<TIN>>;
        } : unknown) & PMT;
type PMIFY<T> = T extends Promise<unknown> ? T : Promise<T>;
type UPMIFY<P> = P extends Promise<infer T> ? T : P;
type MP<T> = Promise<T> | T;
type RP<T> = T extends Function | PM ? RM<T> : PMIFY<T>;
type POC<T> = T extends PM ? RM<T> : T;
type UPOC<T> = T extends { [P in keyof PM]: RP<PM[P]> } ? Local<T> : T;
type Local<T> = Omit<{ [P in keyof T]: T[P] extends Function | PM ? Local<T[P]> : UPMIFY<T[P]> }, keyof PMT> &
    (T extends (...args: infer TAR) => infer TRN
        ? (...args: { [I in keyof TAR]: POC<TAR[I]> }
        ) => MP<UPOC<UPMIFY<TRN>>>
        : unknown) &
    (T extends { new(...args: infer TAR): infer TIN } ? {
        new(...args: { [I in keyof TAR]: POC<TAR[I]>;
        }): MP<Local<UPMIFY<TIN>>>;
    } : unknown);

enum WireValueType { RAW, PROXY, THROW, HANDLER };
enum MessageType { GET, SET, APPLY, CONSTRUCT, ENDPOINT, RELEASE };