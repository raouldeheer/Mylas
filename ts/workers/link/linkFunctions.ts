/* eslint-disable */
import { expose, proxy } from "./link";
import { throwMarker } from "./types";
import {
    Endpoint, Message,
    MessageType, WireValue,
} from "./protocol";
import {
    fromWireValue, toWireValue,
    transfer,
} from "./transferHandlers";

export {
    processArguments, requestResponseMessage,
    isMessagePort, getReturnValue,
    myFlat,
}

function processArguments(argumentList: any[]):
    [WireValue[], Transferable[]] {
    const processed = argumentList.map(toWireValue);
    return [processed.map((v) => v[0]), myFlat(processed.map((v) => v[1]))];
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

function myFlat<T>(arr: (T | T[])[]): T[] {
    return Array.prototype.concat.apply([], arr);
}

function isMessagePort(endpoint: Endpoint): endpoint is MessagePort {
    return endpoint.constructor.name === "MessagePort";
}

function getReturnValue(
    obj: any, path: string[],
    type: MessageType, ev: MessageEvent<any>,
    argumentList: any
): unknown {
    try {
        const parent = path.slice(0, -1).reduce(
            (obj, prop) => obj[prop], obj);
        const rawValue = path.reduce(
            (obj, prop) => obj[prop], obj);
        switch (type) {
            case MessageType.GET:
                return rawValue;
            case MessageType.SET:
                parent[path.slice(-1)[0]!] =
                    fromWireValue(ev.data.value);
                return true;
            case MessageType.APPLY:
                return rawValue.apply(parent, argumentList);
            case MessageType.CONSTRUCT:
                const value = new rawValue(...argumentList);
                return proxy(value);
            case MessageType.ENDPOINT:
                const { port1, port2 } = new MessageChannel();
                expose(obj, port2);
                return transfer(port1, [port1]);
            case MessageType.RELEASE:
                return undefined;
        }
    } catch (value) {
        return { value, [throwMarker]: 0 };
    }
}