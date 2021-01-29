import { nodeEndpoint as make } from "./worker";
import { parentPort } from "worker_threads";
import * as Comlink from "./link/link";
import {
    load,
    save,
} from "../async/jsonAsync";

const loadJson = async (
    path: string,
): Promise<unknown> => {
    return await load(path);
}

const saveJson = async (
    path: string,
    data: unknown,
): Promise<void> => {
    await save(path, data);
}

export default {
    loadJson,
    saveJson,
};
Comlink.expose({
    loadJson,
    saveJson,
}, make(parentPort));