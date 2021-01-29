import {
    expose,
    wrap,
} from "./link";
import {
    ProxyMarked,
    proxyMarker,
    throwMarker,
} from "./types";

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

export const transferHandlers = new Map<
    string,
    TransferHandler<unknown, unknown>
>([
    ["proxy", proxyTransferHandler],
    ["throw", throwTransferHandler],
]);