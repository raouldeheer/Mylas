import { removeComments } from "../sync/jsonSync";
import {
    objectCallback,
    voidCallback,
} from "../types";

export default {
    /**
    * loads JSON from file.
    * @param {string} path path to load from.
    * @param {objectCallback<T>} callback callback to call. 
    * @return {Promise<T>}
    */
    load: async <T>(
        path: string,
        callback?: objectCallback<T>,
        hasComments: boolean = false
    ): Promise<T> => {
        const data: T = JSON.parse(hasComments? removeComments(await String.load(path)): await String.load(path));
        callback?.(data);
        return data;
    },
    /**
    * saves JSON data to file.
    * @param {string} path path to save to.
    * @param {T} data data to save.
    * @param {voidCallback} callback callback to call. 
    * @return {Promise<void>}
    */
    save: async <T>(
        path: string,
        data: T,
        callback?: voidCallback
    ): Promise<void> => {
        await String.save(path, JSON.stringify(data));
        callback?.();
    },
};
