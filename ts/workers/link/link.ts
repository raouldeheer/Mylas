import { closeEndPoint, createProxy } from "./proxy";
import {
    Endpoint,
    Message,
    MessageType,
} from "./protocol";
import { fromWireValue, transfer, toWireValue } from "./transferHandlers";
import { ProxyMarked, proxyMarker, Remote, 
    throwMarker, releaseProxy } from "./types";
export { Endpoint };
export { releaseProxy };

export function expose(obj: any, ep: Endpoint = self as any) {
    ep.addEventListener("message", function callback(ev: MessageEvent) {
        if (!ev || !ev.data) {
            return;
        }
        const { id, type, path } = {
            path: [] as string[],
            ...(ev.data as Message),
        };
        const argumentList = (ev.data.argumentList || []).map(fromWireValue);
        let returnValue: unknown;
        try {
            const parent = path.slice(0, -1).reduce((obj, prop) => obj[prop], obj);
            const rawValue = path.reduce((obj, prop) => obj[prop], obj);
            switch (type) {
                case MessageType.GET:
                    {
                        returnValue = rawValue;
                    }
                    break;
                case MessageType.SET:
                    {
                        parent[path.slice(-1)[0]!] = fromWireValue(ev.data.value);
                        returnValue = true;
                    }
                    break;
                case MessageType.APPLY:
                    {
                        returnValue = rawValue.apply(parent, argumentList);
                    }
                    break;
                case MessageType.CONSTRUCT:
                    {
                        const value = new rawValue(...argumentList);
                        returnValue = proxy(value);
                    }
                    break;
                case MessageType.ENDPOINT:
                    {
                        const { port1, port2 } = new MessageChannel();
                        expose(obj, port2);
                        returnValue = transfer(port1, [port1]);
                    }
                    break;
                case MessageType.RELEASE:
                    {
                        returnValue = undefined;
                    }
                    break;
            }
        } catch (value) {
            returnValue = { value, [throwMarker]: 0 };
        }
        Promise.resolve(returnValue)
            .catch((value) => {
                return { value, [throwMarker]: 0 };
            })
            .then((returnValue) => {
                const [wireValue, transferables] = toWireValue(returnValue);
                ep.postMessage({ ...wireValue, id }, transferables);
                if (type === MessageType.RELEASE) {
                    // detach and deactive after sending release response above.
                    ep.removeEventListener("message", callback as any);
                    closeEndPoint(ep);
                }
            });
    } as any);
    if (ep.start) {
        ep.start();
    }
}

export function wrap<T>(ep: Endpoint, target?: any): Remote<T> {
    return createProxy<T>(ep, [], target) as any;
}

export function proxy<T>(obj: T): T & ProxyMarked {
    return Object.assign(obj, { [proxyMarker]: true }) as any;
}
