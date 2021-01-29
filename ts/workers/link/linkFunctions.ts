
import {
    Endpoint,
    Message,
    WireValue,
} from "./protocol";
import {
    toWireValue,
} from "./transferHandlers";

export function processArguments(argumentList: any[]): [WireValue[], Transferable[]] {
    const processed = argumentList.map(toWireValue);
    return [processed.map((v) => v[0]), myFlat(processed.map((v) => v[1]))];
}

export function requestResponseMessage(
    ep: Endpoint,
    msg: Message,
    transfers?: Transferable[]
): Promise<WireValue> {
    return new Promise((resolve) => {
        const id = new Array(4)
            .fill(0)
            .map(() => Math.floor(Math.random() * Number.MAX_SAFE_INTEGER).toString(16))
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
export function throwIfProxyReleased(isReleased: boolean) {
    if (isReleased) {
        throw new Error("Proxy has been released and is not useable");
    }
}

export function myFlat<T>(arr: (T | T[])[]): T[] {
    return Array.prototype.concat.apply([], arr);
}
export function isMessagePort(endpoint: Endpoint): endpoint is MessagePort {
    return endpoint.constructor.name === "MessagePort";
}