import { checkPathSync } from "./checksSync";
import fs from "fs";

export {
    mkDirSync as mkS,
    rmDirSync as rmS,
    checkDirSync as checkS
}

/**
 * makes fs dir sync
 * @param {string} path path to dir
 * @return {void}
 */
const mkDirSync = (
    path: string
): void => {
    if (checkPathSync(path))
        fs.mkdirSync(path, { recursive: true });
}

/**
 * removes fs dir sync
 * @param {string} path path to dir
 * @return {void}
 */
const rmDirSync = (
    path: string
): void => {
    if (checkPathSync(path))
        fs.rmdirSync(path);
}

/**
 * checks if dir exists sync.
 * @param {string} path path to dir.
 * @return {boolean}
 */
const checkDirSync = (
    path: string
): boolean => {
    return fs.existsSync(path);
}