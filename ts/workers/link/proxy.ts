import { Endpoint, releaseProxy } from "./link";
import { isMessagePort, throwIfProxyReleased, requestResponseMessage, processArguments } from "./linkFunctions";
import { MessageType } from "./protocol";
import { fromWireValue, toWireValue } from "./transferHandlers";
import { Remote, createEndpoint } from "./types";

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
            if (prop === releaseProxy) {
                return () => {
                    return requestResponseMessage(ep, {
                        type: MessageType.RELEASE,
                        path: path.map((p) => p.toString()),
                    }).then(() => {
                        closeEndPoint(ep);
                        isProxyReleased = true;
                    });
                };
            }
            if (prop === "then") {
                if (path.length === 0) {
                    return { then: () => proxy };
                }
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
            // FIXME: ES6 Proxy Handler `set` methods are supposed to return a
            // boolean. To show good will, we return true asynchronously ¯\_(ツ)_/¯
            const [value, transferables] = toWireValue(rawValue);
            return requestResponseMessage(
                ep,
                {
                    type: MessageType.SET,
                    path: [...path, prop].map((p) => p.toString()),
                    value,
                },
                transferables
            ).then(fromWireValue) as any;
        },
        apply(_target, _thisArg, rawArgumentList) {
            throwIfProxyReleased(isProxyReleased);
            const last = path[path.length - 1];
            if ((last as any) === createEndpoint) {
                return requestResponseMessage(ep, {
                    type: MessageType.ENDPOINT,
                }).then(fromWireValue);
            }
            // We just pretend that `bind()` didn’t happen.
            if (last === "bind") {
                return createProxy(ep, path.slice(0, -1));
            }
            const [argumentList, transferables] = processArguments(rawArgumentList);
            return requestResponseMessage(
                ep,
                {
                    type: MessageType.APPLY,
                    path: path.map((p) => p.toString()),
                    argumentList,
                },
                transferables
            ).then(fromWireValue);
        },
        construct(_target, rawArgumentList) {
            throwIfProxyReleased(isProxyReleased);
            const [argumentList, transferables] = processArguments(rawArgumentList);
            return requestResponseMessage(
                ep,
                {
                    type: MessageType.CONSTRUCT,
                    path: path.map((p) => p.toString()),
                    argumentList,
                },
                transferables
            ).then(fromWireValue);
        },
    });
    return proxy as any;
}