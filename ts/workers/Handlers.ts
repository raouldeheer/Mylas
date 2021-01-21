import { Worker } from "worker_threads";
import * as Comlink from "comlink";
import fileWorker from "./fileWorker";
import jsonWorker from "./jsonWorker";
import { endpoint } from "./worker";
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
    const worker = Comlink.wrap<typeof fileWorker>(
        endpoint(
            new Worker("./build/workers/fileWorker.js")));
    try {
        const data = await worker.loadFile(path);
        callback?.(data);
        return data;
    } finally {
        worker[Comlink.releaseProxy]();
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
    const worker = Comlink.wrap<typeof fileWorker>(
        endpoint(
            new Worker("./build/workers/fileWorker.js")));
    try {
        await worker.saveFile(path, data);
        callback?.();
    } finally {
        worker[Comlink.releaseProxy]();
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
    const worker = Comlink.wrap<typeof jsonWorker>(
        endpoint(
            new Worker("./build/workers/jsonWorker.js")));
    const data = await worker.loadJson(path);
    worker[Comlink.releaseProxy]();
    callback?.(data);
    return data;
}

/**
 * saves JSON data to file.
 * @param {string} path path to save to.
 * @param {T} data data to save.
 * @param {voidCallback} callback callback to call. 
 */
const saveJson = async (
    path: string,
    data: unknown,
    callback?: voidCallback
): Promise<void> => {
    const worker = Comlink.wrap<typeof jsonWorker>(
        endpoint(
            new Worker("./build/workers/jsonWorker.js")));
    await worker.saveJson(path, data);
    worker[Comlink.releaseProxy]();
    callback?.();
}

export {
    loadJson,
    saveJson,
    loadFile,
    saveFile,
};