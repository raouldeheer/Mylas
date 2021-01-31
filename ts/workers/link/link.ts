/* eslint-disable */
import { Worker } from "worker_threads";
import {
    closeEndPoint, createProxy, NEP,
    fromWireValue, toWireValue, transfer,
} from "./proxy";
import {
    proxyMarker, Remote, throwMarker,
    release, Message, MessageType, Endpoint,
} from "./types";
export {
    Endpoint, release,
    expose, wrap,
    exposeNode, makeWorker,
};

function exposeNode(obj: any, pp: any) { expose(obj, NEP(pp)) }

function makeWorker<T>(filename: string): Remote<T> {
    return wrap<T>(NEP(new Worker(`./build/workers/${filename}.js`)));
}

function expose(obj: any, ep: Endpoint = self as any) {
    ep.addEventListener("message", function callback(ev: MessageEvent) {
        if (!ev || !ev.data) return;
        const { id, type, path } = {
            path: [] as string[],
            ...(ev.data as Message),
        };
        const argumentList = (ev.data.argumentList || []).map(fromWireValue);
        const returnValue: unknown =
            getReturnValue(obj, path, type, ev, argumentList);
        Promise.resolve(returnValue)
            .catch((value) => {
                return { value, [throwMarker]: 0 };
            })
            .then((returnValue) => {
                const [wireValue, transferables] = toWireValue(returnValue);
                ep.postMessage({ ...wireValue, id }, transferables);
                if (type === MessageType.RELEASE) {
                    ep.removeEventListener("message", callback as any);
                    closeEndPoint(ep);
                }
            });
    } as any);
    if (ep.start) ep.start();
}
function getReturnValue(
    obj: any, path: string[],
    type: MessageType, ev: MessageEvent<any>,
    al: any
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
                return rawValue.apply(parent, al);
            case MessageType.CONSTRUCT:
                const value = new rawValue(...al);
                return Object.assign(value, { [proxyMarker]: true }) as any;
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

function wrap<T>(ep: Endpoint, target?: any): Remote<T> {
    return createProxy<T>(ep, [], target) as any;
}
