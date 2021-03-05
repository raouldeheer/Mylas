import fs, {
    promises as fsPromises,
} from "fs";
import {
    booleanCallback,
    voidCallback,
} from "../types";
import {
    checkPath,
} from "./checksAsync";

export default {
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
}