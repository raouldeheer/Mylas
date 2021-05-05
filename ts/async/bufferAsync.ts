import {
    promises as fs,
} from "fs";
import {
    objectCallback,
    voidCallback,
} from "../types";
import {
    checkPath,
} from "./checksAsync";

export default {
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
            const data = await fs.readFile(path);
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
            await fs.writeFile(path, data);
            callback?.();
        } else {
            throw new Error(`Can't write to ${path}`);
        }
    },
};
