/* eslint-disable */
import { closeEndPoint, createProxy } from "./proxy";
import { fromWireValue, toWireValue } from "./transferHandlers";
import { getReturnValue } from "./linkFunctions";
import {
    Message, MessageType,
    Endpoint,
} from "./protocol";
import {
    ProxyMarked, proxyMarker,
    Remote, throwMarker,
    releaseProxy,
} from "./types";
export {
    Endpoint, releaseProxy,
    expose, wrap,
    proxy,
};

function expose(obj: any, ep: Endpoint = self as any) {
    ep.addEventListener("message", function callback(ev: MessageEvent) {
        if (!ev || !ev.data) return;
        const { id, type, path } = {
            path: [] as string[],
            ...(ev.data as Message),
        };
        const argumentList = (ev.data.argumentList || []).map(fromWireValue);
        const returnValue: unknown = getReturnValue(obj, path, type, ev, argumentList);
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

function wrap<T>(ep: Endpoint, target?: any): Remote<T> {
    return createProxy<T>(ep, [], target) as any;
}

function proxy<T>(obj: T): T & ProxyMarked {
    return Object.assign(obj, { [proxyMarker]: true }) as any;
}