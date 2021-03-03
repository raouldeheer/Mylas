/**
 * loads JSON from file sync.
 * @param {string} path path to load from.
 * @return {T}
 */
export const loadJsonSync = <T>(
    path: string
): T => JSON.parse(String.loadS(path));

/**
 * saves JSON data to file sync.
 * @param {string} path path to save to.
 * @param {T} data data to save.
 * @return {void}
 */
export const saveJsonSync = <T>(
    path: string,
    data: T
): void => String.saveS(path, JSON.stringify(data));


export default {
    loadS: loadJsonSync,
    saveS: saveJsonSync,
}
JSON.loadS = loadJsonSync;
JSON.saveS = saveJsonSync;