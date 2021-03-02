import {
    objectCallback,
    voidCallback,
} from "../types";
require("./fileAsync");

/**
 * loads JSON from file.
 * @param {string} path path to load from.
 * @param {objectCallback<T>} callback callback to call. 
 * @return {Promise<T>}
 */
export const loadJson = async <T>(
    path: string,
    callback?: objectCallback<T>
): Promise<T> => {
    const data: T = JSON.parse(await String.load(path));
    callback?.(data);
    return data;
}

/**
 * saves JSON data to file.
 * @param {string} path path to save to.
 * @param {T} data data to save.
 * @param {voidCallback} callback callback to call. 
 * @return {Promise<void>}
 */
export const saveJson = async <T>(
    path: string,
    data: T,
    callback?: voidCallback
): Promise<void> => {
    await String.save(path, JSON.stringify(data));
    callback?.();
}

JSON.load = loadJson;
JSON.save = saveJson;