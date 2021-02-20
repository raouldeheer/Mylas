import {
    checkPathSync,
} from "./checksSync";
import fs from "fs";

/**
 * makes fs dir sync
 * @param {string} path path to dir
 * @return {void}
 */
export const mkDirSync = (
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
export const rmDirSync = (
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
export const checkDirSync = (
    path: string
): boolean => {
    return fs.existsSync(path);
}