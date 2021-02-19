import { Worker } from 'worker_threads';
import {
    Method,
    objectCallback,
    stringCallback,
    voidCallback,
    Request,
} from "../types";

const action = async <T>({ callback, ...req }: Request<T>): Promise<T> => {
    return await new Promise<T>((res, rej) => {
        let d: T;
        new Worker('./build/workers/worker.js')
            .on('message', m => d = m).on('exit', c => c == 0 ? res(d) : rej(c))
            .on('error', e => rej(e)).on('messageerror', e => rej(e))
            .postMessage(req);
    }).then(v => { callback?.(v); return v; }, e => { throw new Error(e); });
}

/**
 * loads string data from file.
 * @param {string} path path to load from.
 * @param {stringCallback} callback callback to call. 
 */
export const loadFileWorker = async (
    path: string,
    callback?: stringCallback
): Promise<string> => {
    return await action<string>({
        method: Method.loadFile,
        path: path,
        callback: callback,
    });
}

/**
 * saves string to file.
 * @param {string} path path to save to.
 * @param {string} data data to save.
 * @param {voidCallback} callback callback to call. 
 */
export const saveFileWorker = async (
    path: string,
    data: string,
    callback?: voidCallback,
): Promise<void> => {
    return await action<void>({
        method: Method.saveFile,
        path: path,
        data: data,
        callback: callback
    });
}

/**
 * loads JSON from file.
 * @param {string} path path to load from.
 * @param {objectCallback<T>} callback callback to call. 
 */
export const loadJsonWorker = async <T>(
    path: string,
    callback?: objectCallback<T>
): Promise<T> => {
    return await action<T>({
        method: Method.loadJson,
        path: path,
        callback: callback,
    });
}

/**
 * saves JSON data to file.
 * @param {string} path path to save to.
 * @param {unknown} data data to save.
 * @param {voidCallback} callback callback to call. 
 */
export const saveJsonWorker = async (
    path: string,
    data: unknown,
    callback?: voidCallback
): Promise<void> => {
    return await action<void>({
        method: Method.saveJson,
        path: path,
        data: data,
        callback: callback,
    });
}