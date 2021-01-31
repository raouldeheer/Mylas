/* eslint-disable */
import {
    Endpoint,
    expose,
    releaseProxy,
    wrap,
} from "./link";
import {
    Message,
    MessageType,
    WireValue,
    Remote,
    createEndpoint,
    WireValueType,
    ProxyMarked,
    proxyMarker,
    throwMarker,
} from "./protocol";

export function closeEndPoint(endpoint: Endpoint) {
    if (isMessagePort(endpoint)) endpoint.close();
}

export function createProxy<T>(
    ep: Endpoint,
    path: (string | number | symbol)[] = [],
    target: object = function () { }
): Remote<T> {
    let isProxyReleased = false;
    const proxy = new Proxy(target, {
        get(_target, prop) {
            throwIfProxyReleased(isProxyReleased);
            if (prop === releaseProxy)
                return () => {
                    return requestResponseMessage(ep, {
                        type: MessageType.RELEASE,
                        path: path.map((p) => p.toString()),
                    }).then(() => {
                        closeEndPoint(ep);
                        isProxyReleased = true;
                    });
                };
            if (prop === "then") {
                if (path.length === 0) return { then: () => proxy };
                const r = requestResponseMessage(ep, {
                    type: MessageType.GET,
                    path: path.map((p) => p.toString()),
                }).then(fromWireValue);
                return r.then.bind(r);
            }
            return createProxy(ep, [...path, prop]);
        },
        set(_target, prop, rawValue) {
            throwIfProxyReleased(isProxyReleased);
            const [value, transferables] = toWireValue(rawValue);
            return requestResponseMessage(ep, {
                type: MessageType.SET,
                path: [...path, prop].map((p) => p.toString()),
                value,
            }, transferables).then(fromWireValue) as any;
        },
        apply(_target, _thisArg, rawArgumentList) {
            throwIfProxyReleased(isProxyReleased);
            const last = path[path.length - 1];
            if ((last as any) === createEndpoint)
                return requestResponseMessage(ep, {
                    type: MessageType.ENDPOINT,
                }).then(fromWireValue);
            if (last === "bind") return createProxy(ep, path.slice(0, -1));
            const [argumentList, transferables] = processArguments(rawArgumentList);
            return requestResponseMessage(ep, {
                type: MessageType.APPLY,
                path: path.map((p) => p.toString()),
                argumentList,
            }, transferables).then(fromWireValue);
        },
        construct(_target, rawArgumentList) {
            throwIfProxyReleased(isProxyReleased);
            const [argumentList, transferables] = processArguments(rawArgumentList);
            return requestResponseMessage(ep, {
                type: MessageType.CONSTRUCT,
                path: path.map((p) => p.toString()),
                argumentList,
            }, transferables).then(fromWireValue);
        },
    });
    return proxy as any;
}

function throwIfProxyReleased(isReleased: boolean) {
    if (isReleased) {
        throw new Error("Proxy has been released and is not useable");
    }
}
function processArguments(argumentList: any[]):
    [WireValue[], Transferable[]] {
    const processed = argumentList.map(toWireValue);
    return [processed.map((v) => v[0]), myFlat(processed.map((v) => v[1]))];
}
function myFlat<T>(arr: (T | T[])[]): T[] {
    return Array.prototype.concat.apply([], arr);
}
function requestResponseMessage(
    ep: Endpoint,
    msg: Message,
    transfers?: Transferable[]
): Promise<WireValue> {
    return new Promise((resolve) => {
        const id = new Array(4)
            .fill(0)
            .map(() => Math.floor(
                Math.random() * Number.MAX_SAFE_INTEGER).toString(16))
            .join("-");
        ep.addEventListener("message", function l(ev: MessageEvent) {
            if (!ev.data || !ev.data.id || ev.data.id !== id) {
                return;
            }
            ep.removeEventListener("message", l as any);
            resolve(ev.data);
        } as any);
        if (ep.start) {
            ep.start();
        }
        ep.postMessage({ id, ...msg }, transfers);
    });
}
function isMessagePort(endpoint: Endpoint): endpoint is MessagePort {
    return endpoint.constructor.name === "MessagePort";
}

const transferCache = new WeakMap<any, Transferable[]>();

export function transfer(obj: any, transfers: Transferable[]) {
    transferCache.set(obj, transfers);
    return obj;
}

export function toWireValue(value: any): [WireValue, Transferable[]] {
    for (const [name, handler] of transferHandlers) {
        if (handler.canHandle(value)) {
            const [serializedValue, transferables] = handler.serialize(value);
            return [
                {
                    type: WireValueType.HANDLER,
                    name,
                    value: serializedValue,
                },
                transferables,
            ];
        }
    }
    return [
        {
            type: WireValueType.RAW,
            value,
        },
        transferCache.get(value) || [],
    ];
}

export function fromWireValue(value: WireValue): any {
    switch (value.type) {
        case WireValueType.HANDLER:
            return transferHandlers.get(value.name)!.deserialize(value.value);
        case WireValueType.RAW:
            return value.value;
    }
}

interface TransferHandler<T, S> {
    canHandle(value: unknown): value is T;
    serialize(value: T): [S, Transferable[]];
    deserialize(value: S): T;
}
interface ThrownValue {
    [throwMarker]: unknown;
    value: unknown;
}
type SerializedThrownValue =
    | { isError: true; value: Error }
    | { isError: false; value: unknown };

const isObject = (val: unknown): val is object =>
    (typeof val === "object" && val !== null) || typeof val === "function";

const proxyTransferHandler: TransferHandler<object, MessagePort> = {
    canHandle: (val): val is ProxyMarked =>
        isObject(val) && (val as ProxyMarked)[proxyMarker],
    serialize(obj) {
        const { port1, port2 } = new MessageChannel();
        expose(obj, port1);
        return [port2, [port2]];
    },
    deserialize(port) {
        port.start();
        return wrap(port);
    },
};

const throwTransferHandler: TransferHandler<
    ThrownValue,
    SerializedThrownValue
> = {
    canHandle: (value): value is ThrownValue =>
        isObject(value) && throwMarker in value,
    serialize({ value }) {
        let serialized: SerializedThrownValue;
        if (value instanceof Error) {
            serialized = {
                isError: true,
                value: {
                    message: value.message,
                    name: value.name,
                    stack: value.stack,
                },
            };
        } else {
            serialized = { isError: false, value };
        }
        return [serialized, []];
    },
    deserialize(serialized) {
        if (serialized.isError) {
            throw Object.assign(
                new Error(serialized.value.message),
                serialized.value
            );
        }
        throw serialized.value;
    },
};

const transferHandlers = new Map<
    string,
    TransferHandler<unknown, unknown>
>([
    ["proxy", proxyTransferHandler],
    ["throw", throwTransferHandler],
]);

export function nodeEndpoint(nep: any): Endpoint {
    const listeners = new WeakMap();
    return {
        postMessage: nep.postMessage.bind(nep),
        addEventListener: (_, eh) => {
            const l = (data: unknown) => {
                if ("handleEvent" in eh) {
                    eh.handleEvent({ data } as MessageEvent);
                } else {
                    eh({ data } as MessageEvent);
                }
            };
            nep.on("message", l);
            listeners.set(eh, l);
        },
        removeEventListener: (_, eh) => {
            const l = listeners.get(eh);
            if (!l) {
                return;
            }
            nep.off("message", l);
            listeners.delete(eh);
        },
        start: nep.start && nep.start.bind(nep),
    };
}