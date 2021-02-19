import { Worker } from 'worker_threads';
import {
    Method,
    objectCallback,
    stringCallback,
    voidCallback,
    Request,
} from "../types";

const action = <T>({ callback, ...req }: Request<T>
): Promise<T> => new Promise<T>((res, rej) => {
    let d: T;
    new Worker('./build/workers/worker.js')
        .once('message', m => d = m).once('exit', c => c == 0 ? res(d) : rej(c))
        .once('error', e => rej(e)).once('messageerror', e => rej(e))
        .postMessage(req);
}).then(v => { callback?.(v); return v; }, e => { throw new Error(e); });

/**
 * loads string data from file.
 * @param {string} path path to load from.
 * @param {stringCallback} callback callback to call. 
 */
export const loadFileWorker = async (
    path: string,
    callback?: stringCallback
): Promise<string> => await action<string>({
    method: Method.loadFile,
    path: path,
    callback: callback,
});

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
): Promise<void> => await action({
    method: Method.saveFile,
    path: path,
    data: data,
    callback: callback
});

/**
 * loads JSON from file.
 * @param {string} path path to load from.
 * @param {objectCallback<T>} callback callback to call. 
 */
export const loadJsonWorker = async <T>(
    path: string,
    callback?: objectCallback<T>
): Promise<T> => await action<T>({
    method: Method.loadJson,
    path: path,
    callback: callback,
});

/**
 * saves JSON data to file.
 * @param {string} path path to save to.
 * @param {T} data data to save.
 * @param {voidCallback} callback callback to call. 
 */
export const saveJsonWorker = async <T>(
    path: string,
    data: T,
    callback?: voidCallback
): Promise<void> => await action({
    method: Method.saveJson,
    path: path,
    data: data,
    callback: callback,
});