/* eslint-disable */
import { Worker } from "worker_threads";
import {
    cEP, cP, NEP,
    FWV, TWV, transfer as tr,
} from "./proxy";
import {
    proxyMarker, Remote, throwMarker,
    release, Message, MessageType as MT, Endpoint,
} from "./types";
export {
    Endpoint, release,
    expose, wrap,
    exposeNode, makeWorker,
};

function exposeNode(obj: any, pp: any) { expose(obj, NEP(pp)) }

function makeWorker<T>(f: string): Remote<T> {
    return wrap<T>(NEP(new Worker(`./build/workers/${f}.js`)));
}

function expose(obj: any, ep: Endpoint = self as any) {
    ep.addEventListener("message", function callback(ev: MessageEvent) {
        if (!ev || !ev.data) return;
        const { id, type, path } = {
            path: [] as string[],
            ...(ev.data as Message),
        };
        const aL = (ev.data.argumentList || []).map(FWV);
        const rV: unknown =
            grV(obj, path, type, ev, aL);
        Promise.resolve(rV)
            .catch((value) => { return { value, [throwMarker]: 0 }; })
            .then((rV) => {
                const [wV, tfs] = TWV(rV);
                ep.postMessage({ ...wV, id }, tfs);
                if (type === MT.RELEASE) {
                    ep.removeEventListener("message", callback as any);
                    cEP(ep);
                }
            });
    } as any);
    if (ep.start) ep.start();
}
function grV(
    obj: any, path: string[],
    type: MT, ev: MessageEvent<any>,
    al: any
): unknown {
    try {
        const pa = path.slice(0, -1).reduce((obj, prop) => obj[prop], obj);
        const rv = path.reduce((obj, prop) => obj[prop], obj);
        switch (type) {
            case MT.GET: return rv;
            case MT.SET: pa[path.slice(-1)[0]!] = FWV(ev.data.value);
                return true;
            case MT.APPLY: return rv.apply(pa, al);
            case MT.CONSTRUCT: return Object.assign(new rv(...al),
                { [proxyMarker]: true }) as any;
            case MT.ENDPOINT: const { port1, port2 } = new MessageChannel();
                expose(obj, port2); return tr(port1, [port1]);
            case MT.RELEASE: return undefined;
        }
    } catch (value) { return { value, [throwMarker]: 0 }; }
}

function wrap<T>(ep: Endpoint, target?: any): Remote<T> {
    return cP<T>(ep, [], target) as any;
}