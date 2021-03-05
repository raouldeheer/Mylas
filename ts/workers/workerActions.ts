import {
    Worker,
} from 'worker_threads';
import {
    Method,
    objectCallback,
    stringCallback,
    voidCallback,
    Request,
} from "../types";

const action = <T>(
    { callback, ...req }: Request<T>
): Promise<T> => new Promise<T>((res, rej) => {
    let d: T;
    new Worker('./build/workers/worker.js')
        .once('message', m => d = m).once('exit', c => c == 0 ? res(d) : rej(c))
        .once('error', e => rej(e)).once('messageerror', e => rej(e))
        .postMessage(req);
}).then(v => { callback?.(v); return v; }, e => { throw new Error(e); });

export const jsonWorker = {
    /**
     * loads JSON from file.
     * @param {string} path path to load from.
     * @param {objectCallback<T>} callback callback to call. 
     */
    loadW: <T>(
        path: string,
        callback?: objectCallback<T>
    ): Promise<T> => action<T>({
        method: Method.loadJson,
        path: path,
        callback: callback,
    }),
    /**
     * saves JSON data to file.
     * @param {string} path path to save to.
     * @param {T} data data to save.
     * @param {voidCallback} callback callback to call. 
     */
    saveW: <T>(
        path: string,
        data: T,
        callback?: voidCallback
    ): Promise<void> => action({
        method: Method.saveJson,
        path: path,
        data: data,
        callback: callback,
    }),
}

export const fileWorker = {
    /**
     * loads string data from file.
     * @param {string} path path to load from.
     * @param {stringCallback} callback callback to call. 
     */
    loadW: (
        path: string,
        callback?: stringCallback
    ): Promise<string> => action<string>({
        method: Method.loadFile,
        path: path,
        callback: callback,
    }),
    /**
     * saves string to file.
     * @param {string} path path to save to.
     * @param {string} data data to save.
     * @param {voidCallback} callback callback to call. 
     */
    saveW: (
        path: string,
        data: string,
        callback?: voidCallback,
    ): Promise<void> => action({
        method: Method.saveFile,
        path: path,
        data: data,
        callback: callback
    }),
}

