import fs, {
    promises as fsPromises,
} from "fs";
import {
    booleanCallback,
    voidCallback,
} from "./types";
import {
    checkPathSync,
    checkPath,
} from "./checks";

export const dir = {
    /**
     * makes fs dir sync
     * @param {string} path path to dir
     * @return {void}
     */
    mkS: (path: string): void => {
        if (checkPathSync(path))
            fs.mkdirSync(path, { recursive: true });
    },
    /**
     * removes fs dir sync
     * @param {string} path path to dir
     * @return {void}
     */
    rmS: (path: string): void => {
        if (checkPathSync(path))
            fs.rmdirSync(path);
    },
    /**
     * checks if dir exists sync.
     * @param {string} path path to dir.
     * @return {boolean}
     */
    checkS: (path: string): boolean =>
        fs.existsSync(path),
    /**
     * makes fs dir
     * @param {string} path path to dir
     * @param {voidCallback} callback callback to call.
     * @return {Promise<void>}
     */
    mk: async (
        path: string,
        callback?: voidCallback
    ): Promise<void> => {
        if (await checkPath(path))
            await fsPromises.mkdir(path, { recursive: true });
        callback?.();
    }
    ,
    /**
     * removes fs dir
     * @param {string} path path to dir
     * @param {voidCallback} callback callback to call. 
     * @return {Promise<void>}
     */
    rm: async (
        path: string,
        callback?: voidCallback
    ): Promise<void> => {
        if (await checkPath(path))
            await fsPromises.rmdir(path);
        callback?.();
    },
    /**
     * checks if dir exists.
     * @param {string} path path to dir.
     * @param {booleanCallback} callback callback to call.
     * @return {Promise<boolean>}
     */
    check: async (
        path: string,
        callback?: booleanCallback
    ): Promise<boolean> => {
        const response = fs.existsSync(path);
        callback?.(response);
        return response;
    },
};