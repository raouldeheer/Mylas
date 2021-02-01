import { makeWorker, release } from "./link/link";
import { worker } from "./worker";
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
    const thread = makeWorker<worker>("worker");
    try {
        const data = await thread.loadFile(path);
        callback?.(data);
        return data;
    } finally { thread[release](); }
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
    const thread = makeWorker<worker>("worker");
    try {
        await thread.saveFile(path, data);
        callback?.();
    } finally { thread[release](); }
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
    const thread = makeWorker<worker>("worker");
    const data = await thread.loadJson(path);
    thread[release]();
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
    const thread = makeWorker<worker>("worker");
    await thread.saveJson(path, data);
    thread[release]();
    callback?.();
}

export {
    loadJson,
    saveJson,
    loadFile,
    saveFile,
};