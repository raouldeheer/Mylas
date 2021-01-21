import { Endpoint } from "comlink";

interface NodeEndpoint {
    postMessage(message: unknown, transfer?: unknown): void;
    on(
        type: string,
        listener: EventListenerOrEventListenerObject,
        options?: unknown,
    ): void;
    off(
        type: string,
        listener: EventListenerOrEventListenerObject,
        options?: unknown,
    ): void;
    start?: () => void;
}

export default function(nep: NodeEndpoint): Endpoint {
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