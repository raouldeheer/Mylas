import {
    loadS as loadFileSync,
    saveS as saveFileSync,
} from "./fileSync";

export {
    loadJsonSync as loadS,
    saveJsonSync as saveS,
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
