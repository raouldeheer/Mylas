import { Worker } from "worker_threads";
import * as Comlink from "comlink";
import fileWorker from "./fileWorker";
import { nodeEndpoint } from "./worker";
import {
    objectCallback,
    stringCallback,
    voidCallback,
} from "@raouldeheer/tstypes";
import jsonWorker from "./jsonWorker";

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
        nodeEndpoint(
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
        nodeEndpoint(
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
 * @return {Promise<unknown>}
 */
const loadJson = async (
    path: string,
    callback?: objectCallback<unknown>
): Promise<unknown> => {
    const worker = Comlink.wrap<typeof jsonWorker>(
        nodeEndpoint(
            new Worker("./build/workers/jsonWorker.js")));
    try {
        const data = await worker.loadJson(path);
        callback?.(data);
        return data;
    } finally {
        worker[Comlink.releaseProxy]();
    }
}

/**
 * saves JSON data to file.
 * @param {string} path path to save to.
 * @param {T} data data to save.
 * @param {voidCallback} callback callback to call. 
 * @return {Promise<void>}
 */
const saveJson = async <T>(
    path: string,
    data: T,
    callback?: voidCallback
): Promise<void> => {
    const worker = Comlink.wrap<typeof jsonWorker>(
        nodeEndpoint(
            new Worker("./build/workers/jsonWorker.js")));
    try {
        await worker.saveJson(path, data);
        callback?.();
    } finally {
        worker[Comlink.releaseProxy]();
    }
}

export { loadFile, saveFile, loadJson, saveJson };