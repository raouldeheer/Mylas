import fs from "fs";
import {
    objectCallback,
    voidCallback,
    Method,
} from "./types";
import {
    checkPath,
} from "./checks";
import action from "./workerActions";

const buf = {
    /**
     * loads string data from file.
     * @param {string} path path to load from.
     * @param {objectCallback<Buffer>} callback callback to call. 
     * @return {Promise<Buffer>}
     */
    load: async (
        path: string,
        callback?: objectCallback<Buffer>
    ): Promise<Buffer> => {
        if (await checkPath(path) == true) {
            const data = await fs.promises.readFile(path);
            callback?.(data);
            return data;
        } else {
            throw new Error(`Can't read from ${path}`);
        }
    },
    /**
     * saves string to file.
     * @param {string} path path to save to.
     * @param {Buffer} data data to save.
     * @param {voidCallback} callback callback to call. 
     * @return {Promise<void>}
     */
    save: async (
        path: string,
        data: Buffer,
        callback?: voidCallback
    ): Promise<void> => {
        if (await checkPath(path) == true) {
            await fs.promises.writeFile(path, data);
            callback?.();
        } else {
            throw new Error(`Can't write to ${path}`);
        }
    },
    /**
     * loads string data from file.
     * @param {string} path path to load from.
     * @param {objectCallback<Buffer>} callback callback to call. 
     */
    loadW: async (
        path: string,
        callback?: objectCallback<Buffer>
    ): Promise<Buffer> => {
        const array = await action<Uint8Array>({
            method: Method.loadBuffer,
            path: path,
        });
        callback?.(Buffer.from(array));
        return Buffer.from(array);
    },
    /**
     * saves string to file.
     * @param {string} path path to save to.
     * @param {Buffer} data data to save.
     * @param {voidCallback} callback callback to call. 
     */
    saveW: async (
        path: string,
        data: Buffer,
        callback?: voidCallback,
    ): Promise<void> => {
        const sharedUint8Array = new Uint8Array(new SharedArrayBuffer(data.byteLength));
        sharedUint8Array.set(data);
        await action({
            method: Method.saveBuffer,
            path: path,
            data: sharedUint8Array,
            callback: callback
        });
    },
};
export default buf;
