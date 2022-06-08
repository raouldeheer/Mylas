import fs from "fs";
import {
    stringCallback,
    voidCallback,
    Method,
} from "./types";
import {
    checkPathSync,
    checkPath,
} from "./checks";
import action from "./workerActions";

const file = {
    /**
     * loads string data from file.
     * @param {string} path path to load from.
     * @return {string}
     */
    loadS: (
        path: string
    ): string => {
        if (checkPathSync(path, fs.constants.R_OK)) {
            return fs.readFileSync(path, "utf8");
        } else {
            throw new Error(`Can't read from ${path}`);
        }
    },
    /**
    * saves string to file.
    * @param {string} path path to save to.
    * @param {string} data data to save.
    * @return {void}
    */
    saveS: (
        path: string,
        data: string
    ): void => {
        if (checkPathSync(path, fs.constants.W_OK)) {
            fs.writeFileSync(path, data, "utf8");
        } else {
            throw new Error(`Can't write to ${path}`);
        }
    },
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
        if (await checkPath(path, fs.constants.R_OK)) {
            const data = await fs.promises.readFile(path, "utf8");
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
        if (await checkPath(path, fs.constants.W_OK)) {
            await fs.promises.writeFile(path, data, "utf8");
            callback?.();
        } else {
            throw new Error(`Can't write to ${path}`);
        }
    },
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
};
export default file;
