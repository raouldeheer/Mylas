/* eslint-disable */
import {
    Endpoint,
    expose,
    release,
    wrap,
} from "./link";
import {
    Message,
    MessageType as MT,
    WireValue,
    Remote,
    createEndpoint,
    WireValueType as WVT,
    ProxyMarked,
    proxyMarker,
    throwMarker,
} from "./types";

export function cEP(e: Endpoint) {
    const isMP = (p: Endpoint): p is MessagePort =>
        p.constructor.name === "MessagePort";
    if (isMP(e)) e.close();
}

export function cP<T>(
    ep: Endpoint,
    pa: (string | number | symbol)[] = [],
    ta: object = function () { }
): Remote<T> {
    let iPR = false;
    const proxy = new Proxy(ta, {
        get(_target, pr) {
            if (iPR) throw new Error("Proxy released");
            if (pr === release)
                return () => {
                    return rRM(ep, {
                        type: MT.RELEASE, path: pa.map((p) => p.toString()),
                    }).then(() => { cEP(ep); iPR = true; });
                };
            if (pr === "then") {
                if (pa.length === 0) return { then: () => proxy };
                const r = rRM(ep, {
                    type: MT.GET, path: pa.map((p) => p.toString()),
                }).then(FWV);
                return r.then.bind(r);
            }
            return cP(ep, [...pa, pr]);
        },
        set(_t, pr, r) {
            if (iPR) throw new Error("Proxy released");
            const [value, tfs] = TWV(r);
            return rRM(ep, {
                type: MT.SET, path: [...pa, pr].map((p) => p.toString()),
                value,
            }, tfs).then(FWV) as any;
        },
        apply(_t, _th, rAL) {
            if (iPR) throw new Error("Proxy released");
            const l = pa[pa.length - 1];
            if ((l as any) === createEndpoint)
                return rRM(ep, { type: MT.ENDPOINT }).then(FWV);
            if (l === "bind") return cP(ep, pa.slice(0, -1));
            const [al, tfs] = pA(rAL);
            return rRM(ep, {
                type: MT.APPLY, path: pa.map((p) => p.toString()),
                argumentList: al,
            }, tfs).then(FWV);
        },
        construct(_t, rAL) {
            if (iPR) throw new Error("Proxy released");
            const [al, tfs] = pA(rAL);
            return rRM(ep, {
                type: MT.CONSTRUCT, path: pa.map((p) => p.toString()),
                argumentList: al,
            }, tfs).then(FWV);
        },
    });
    return proxy as any;
}

function pA(al: any[]):
    [WireValue[], Transferable[]] {
    return [al.map(TWV).map((v) => v[0]),
    Array.prototype.concat.apply([], al.map(TWV).map((v) => v[1]))];
}
function rRM(ep: Endpoint, msg: Message, t?: Transferable[])
    : Promise<WireValue> {
    return new Promise((resolve) => {
        const id = new Array(4)
            .fill(0).map(() => Math.floor(
                Math.random() * Number.MAX_SAFE_INTEGER).toString(16))
            .join("-");
        ep.addEventListener("message", function l(ev: MessageEvent) {
            if (!ev.data || !ev.data.id || ev.data.id !== id) return;
            ep.removeEventListener("message", l as any);
            resolve(ev.data);
        } as any);
        if (ep.start) ep.start();
        ep.postMessage({ id, ...msg }, t);
    });
}

const transferC = new WeakMap<any, Transferable[]>();

export function transfer(obj: any, transfers: Transferable[]) {
    transferC.set(obj, transfers);
    return obj;
}

export function TWV(v: any): [WireValue, Transferable[]] {
    for (const [name, handler] of tHs) {
        if (handler.canHandle(v)) {
            const [sV, tf] = handler.serialize(v);
            return [{ type: WVT.HANDLER, name, value: sV, }, tf];
        }
    }
    return [{ type: WVT.RAW, value: v, }, transferC.get(v) || []];
}

export function FWV(v: WireValue): any {
    switch (v.type) {
        case WVT.HANDLER: return tHs.get(v.name)!.deserialize(v.value);
        case WVT.RAW: return v.value;
    }
}

interface TH<T, S> {
    canHandle(value: unknown): value is T;
    serialize(value: T): [S, Transferable[]];
    deserialize(value: S): T;
}
interface TV { [throwMarker]: unknown; value: unknown; }
type S = { isError: true; value: Error } | { isError: false; value: unknown }

const isObject = (v: unknown): v is object =>
    (typeof v === "object" && v !== null) || typeof v === "function";

const pTH: TH<object, MessagePort> = {
    canHandle: (val): val is ProxyMarked =>
        isObject(val) && (val as ProxyMarked)[proxyMarker],
    serialize(obj) {
        const { port1, port2 } = new MessageChannel();
        expose(obj, port1);
        return [port2, [port2]];
    },
    deserialize(port) {
        port.start();
        return wrap(port);
    },
};

const tTH: TH<TV, S> = {
    canHandle: (value): value is TV =>
        isObject(value) && throwMarker in value,
    serialize({ value }) {
        let s: S = (value instanceof Error) ? {
            isError: true, value: {
                message: value.message,
                name: value.name, stack: value.stack,
            },
        } : { isError: false, value };
        return [s, []];
    },
    deserialize(s) {
        throw s.isError ? Object.assign(new Error(s.value.message), s.value)
            : s.value;
    },
};

const tHs = new Map<string, TH<unknown, unknown>>(
    [["proxy", pTH], ["throw", tTH]]);

export function NEP(nep: any): Endpoint {
    const lisn = new WeakMap();
    return {
        postMessage: nep.postMessage.bind(nep),
        addEventListener: (_, eh) => {
            const l = (data: unknown) => {
                if ("handleEvent" in eh)
                    eh.handleEvent({ data } as MessageEvent);
                else eh({ data } as MessageEvent);
            };
            nep.on("message", l);
            lisn.set(eh, l);
        },
        removeEventListener: (_, eh) => {
            const l = lisn.get(eh);
            if (!l) return;
            nep.off("message", l);
            lisn.delete(eh);
        },
        start: nep.start && nep.start.bind(nep),
    };
}