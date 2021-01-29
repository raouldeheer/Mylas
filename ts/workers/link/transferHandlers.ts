/* eslint-disable */
import { WireValue, WireValueType } from "./protocol";
import { transferHandlers } from "./transferTypes";

const transferCache = new WeakMap<any, Transferable[]>();

export function transfer(obj: any, transfers: Transferable[]) {
    transferCache.set(obj, transfers);
    return obj;
}

export function toWireValue(value: any): [WireValue, Transferable[]] {
    for (const [name, handler] of transferHandlers) {
        if (handler.canHandle(value)) {
            const [serializedValue, transferables] = handler.serialize(value);
            return [
                {
                    type: WireValueType.HANDLER,
                    name,
                    value: serializedValue,
                },
                transferables,
            ];
        }
    }
    return [
        {
            type: WireValueType.RAW,
            value,
        },
        transferCache.get(value) || [],
    ];
}

export function fromWireValue(value: WireValue): any {
    switch (value.type) {
        case WireValueType.HANDLER:
            return transferHandlers.get(value.name)!.deserialize(value.value);
        case WireValueType.RAW:
            return value.value;
    }
}