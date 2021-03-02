import {
    loadFileSync,
    saveFileSync,
} from "./fileSync";

/**
 * loads JSON from file sync.
 * @param {string} path path to load from.
 * @return {T}
 */
export const loadJsonSync = <T>(
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
export const saveJsonSync = <T>(
    path: string,
    data: T
): void => {
    saveFileSync(path, JSON.stringify(data));
}

JSON.loadS = loadJsonSync;
JSON.saveS = saveJsonSync;