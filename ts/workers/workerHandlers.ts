import * as link from "./link/link";
import workerObj from "./worker";
import {
    objectCallback,
    stringCallback,
    voidCallback,
} from "@raouldeheer/tstypes";

/**
 * loads string data from file.
 * @param {string} path path to load from.
 * @param {stringCallback} callback callback to call. 
 * @return {Promise<string>}
 */
const loadFile = async (
    path: string,
    callback?: stringCallback
): Promise<string> => {
    const worker = link.makeWorker<typeof workerObj>("worker");
    try {
        const data = await worker.loadFile(path);
        callback?.(data);
        return data;
    } finally {
        worker[link.releaseProxy]();
    }
}

/**
 * saves string to file.
 * @param {string} path path to save to.
 * @param {string} data data to save.
 * @param {voidCallback} callback callback to call. 
 * @return {Promise<void>}
 */
const saveFile = async (
    path: string,
    data: string,
    callback?: voidCallback,
): Promise<void> => {
    const worker = link.makeWorker<typeof workerObj>("worker");
    try {
        await worker.saveFile(path, data);
        callback?.();
    } finally {
        worker[link.releaseProxy]();
    }
}

/**
 * loads JSON from file.
 * @param {string} path path to load from.
 * @param {objectCallback<unknown>} callback callback to call. 
 */
const loadJson = async (
    path: string,
    callback?: objectCallback<unknown>
): Promise<unknown> => {
    const worker = link.makeWorker<typeof workerObj>("worker");
    const data = await worker.loadJson(path);
    worker[link.releaseProxy]();
    callback?.(data);
    return data;
}

/**
 * saves JSON data to file.
 * @param {string} path path to save to.
 * @param {unknown} data data to save.
 * @param {voidCallback} callback callback to call. 
 */
const saveJson = async (
    path: string,
    data: unknown,
    callback?: voidCallback
): Promise<void> => {
    const worker = link.makeWorker<typeof workerObj>("worker");
    await worker.saveJson(path, data);
    worker[link.releaseProxy]();
    callback?.();
}

export {
    loadJson,
    saveJson,
    loadFile,
    saveFile,
};