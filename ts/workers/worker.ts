import { Endpoint } from "comlink";

/* eslint-disable */
export default function(nep: any): Endpoint {
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