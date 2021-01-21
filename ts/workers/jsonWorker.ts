import { endpoint } from "./worker";
import { parentPort } from "worker_threads";
import * as Comlink from "comlink";
import { load, save } from "../fileHandler";

const loadJson = async (
    path: string,
): Promise<unknown> => {
    const data = JSON.parse(await load(path));
    return data;
}

const saveJson = async (
    path: string,
    data: unknown,
): Promise<void> => {
    await save(path, JSON.stringify(data));
    return;
}

export default {
    loadJson,
    saveJson,
};
Comlink.expose({
    loadJson,
    saveJson,
}, endpoint(parentPort));