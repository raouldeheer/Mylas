import { loadFileSync, saveFileSync, loadFile, saveFile } from "./fileLoader";

export { loadJsonSync as loadS, saveJsonSync as saveS, loadJson as load, saveJson as save };

/**
 * loadJsonSync loads JSON from file.
 * @param path path to load from.
 */
function loadJsonSync(path: string): unknown {
    return JSON.parse(loadFileSync(path) ?? "");
}

/**
 * saveJsonSync saves JSON data to file.
 * @param path path to save to.
 * @param data data to save.
 */
function saveJsonSync(path: string, data: unknown): void {
    saveFileSync(path, JSON.stringify(data));
}

/**
 * loadJson loads JSON from file.
 * @param path path to load from.
 */
async function loadJson(path: string, callback?: (data: unknown) => void): Promise<unknown> {
    const data = JSON.parse(await loadFile(path));
    if (callback != undefined) callback(data);
    return data;
}

/**
 * saveJson saves JSON data to file.
 * @param path path to save to.
 * @param data data to save.
 */
async function saveJson(path: string, data: unknown, callback?: VoidFunction): Promise<void> {
    await saveFile(path, JSON.stringify(data));
    if (callback != undefined) callback();
}