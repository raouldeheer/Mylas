/* eslint-disable */
import { Worker } from "worker_threads";
import { Endpoint, expose, wrap } from "./link/link";
import { Remote } from "./link/types";

export { exposeNode as expose, nodeEndpoint, makeWorker };

function exposeNode(obj: any, parentPort: any) {
    expose(obj, nodeEndpoint(parentPort));
}

function makeWorker<T>(filename: string): Remote<T> {
    return wrap<T>(
        nodeEndpoint(
            new Worker(`./build/workers/${filename}.js`)));
}

function nodeEndpoint(nep: any): Endpoint {
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
