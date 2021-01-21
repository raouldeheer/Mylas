import { nodeEndpoint } from "./worker";
import { parentPort } from "worker_threads";
import * as Comlink from "comlink";
import fileWorker from "./fileWorker";

const loadJson = async(
    path: string,
): Promise<unknown> => {
    const data = JSON.parse(await fileWorker.loadFile(path));
    return data;
}

const saveJson = async(
    path: string,
    data: unknown,
): Promise<void> => {
    await fileWorker.saveFile(path, JSON.stringify(data));
}

export default {
    loadJson,
    saveJson,
};
Comlink.expose({
    loadJson,
    saveJson,
}, nodeEndpoint(parentPort));