import fs from "fs";
import { checkPathSync } from "./checksSync";

export {
    loadFileSync as loadS,
    saveFileSync as saveS,
};

/**
 * loads string data from file.
 * @param {string} path path to load from.
 * @return {string}
 */
const loadFileSync = (
    path: string
): string => {
    if (checkPathSync(path) == true) {
        return fs.readFileSync(path, "utf8");
    } else {
        throw new Error(`Can't read from ${path}`);
    }
}

/**
 * saves string to file.
 * @param {string} path path to save to.
 * @param {string} data data to save.
 * @return {void}
 */
const saveFileSync = (
    path: string,
    data: string
): void => {
    if (checkPathSync(path) == true) {
        fs.writeFileSync(path, data, "utf8");
    } else {
        throw new Error(`Can't write to ${path}`);
    }
}
