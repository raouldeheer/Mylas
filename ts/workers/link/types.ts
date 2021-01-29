export const proxyMarker = Symbol("Comlink.proxy");
export const createEndpoint = Symbol("Comlink.endpoint");
export const releaseProxy = Symbol("Comlink.releaseProxy");
export const throwMarker = Symbol("Comlink.thrown");

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