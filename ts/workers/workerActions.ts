import { Worker } from 'worker_threads';
import {
    objectCallback,
    stringCallback,
    voidCallback,
} from "@raouldeheer/tstypes";

export enum Method {
    loadFile,
    saveFile,
    loadJson,
    saveJson,
}
export interface WorkerRequest {
    method: Method,
    path: string,
    data?: any,
}

const action = <T>(request: WorkerRequest): Promise<T> => {
    return new Promise((resolve, reject) => {
        const worker = new Worker('./build/workers/worker.js');
        let data: T;
        worker.on('message', result => data = result);
        worker.on('exit', code => code == 0 ? resolve(data) : reject(code));
        worker.postMessage(request);
    });
}

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
    const data: string = await action({ method: Method.loadFile, path: path });
    callback?.(data);
    return data;
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
    await action({ method: Method.saveFile, path: path, data: data });
    callback?.();
}

/**
 * loads JSON from file.
 * @param {string} path path to load from.
 * @param {objectCallback<unknown>} callback callback to call. 
 */
const loadJson = async <T>(
    path: string,
    callback?: objectCallback<T>
): Promise<T> => {
    const data: T = await action({ method: Method.loadJson, path: path });
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
    await action({ method: Method.saveJson, path: path, data: data });
    callback?.();
}

export {
    loadJson,
    saveJson,
    loadFile,
    saveFile,
};