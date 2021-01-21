import {
    objectCallback,
    voidCallback,
} from "@raouldeheer/tstypes";
import {
    loadS as loadFileSync,
    saveS as saveFileSync,
    load as loadFile,
    save as saveFile,
} from "./fileHandler";
import {
    loadJson as loadW,
    saveJson as saveW,
} from "./workers/workerHandlers";

export {
    loadJsonSync as loadS,
    saveJsonSync as saveS,
    loadJson as load,
    saveJson as save,
    loadW,
    saveW,
};

/**
 * loads JSON from file sync.
 * @param {string} path path to load from.
 * @return {T}
 */
const loadJsonSync = <T>(
    path: string
): T => {
    return JSON.parse(loadFileSync(path));
}

/**
 * saves JSON data to file sync.
 * @param {string} path path to save to.
 * @param {T} data data to save.
 * @return {void}
 */
const saveJsonSync = <T>(
    path: string,
    data: T
): void => {
    saveFileSync(path, JSON.stringify(data));
}

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
