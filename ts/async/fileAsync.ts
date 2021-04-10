import {
    promises as fs,
} from "fs";
import {
    stringCallback,
    voidCallback,
} from "../types";
import {
    checkPath,
} from "./checksAsync";

export default {
    /**
    * loads string data from file.
    * @param {string} path path to load from.
    * @param {stringCallback} callback callback to call. 
    * @return {Promise<string>}
    */
    load: async (
        path: string,
        callback?: stringCallback
    ): Promise<string> => {
        if (await checkPath(path) == true) {
            const data = await fs.readFile(path, "utf8");
            callback?.(data);
            return data;
        } else {
            throw new Error(`Can't read from ${path}`);
        }
    },
    /**
     * saves string to file.
     * @param {string} path path to save to.
     * @param {string} data data to save.
     * @param {voidCallback} callback callback to call. 
     * @return {Promise<void>}
     */
    save: async (
        path: string,
        data: string,
        callback?: voidCallback
    ): Promise<void> => {
        if (await checkPath(path) == true) {
            await fs.writeFile(path, data, "utf8");
            callback?.();
        } else {
            throw new Error(`Can't write to ${path}`);
        }
    },
};
