import {
    objectCallback,
    voidCallback,
} from "@raouldeheer/tstypes";
import {
    load as loadFile,
    save as saveFile,
} from "./fileAsync";

export {
    loadJson as load,
    saveJson as save,
};

/**
 * loads JSON from file.
 * @param {string} path path to load from.
 * @param {objectCallback<T>} callback callback to call. 
 * @return {Promise<T>}
 */
const loadJson = async <T>(
    path: string,
    callback?: objectCallback<T>
): Promise<T> => {
    const data: T = JSON.parse(await loadFile(path));
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
const saveJson = async <T>(
    path: string,
    data: T,
    callback?: voidCallback
): Promise<void> => {
    await saveFile(path, JSON.stringify(data));
    callback?.();
}
