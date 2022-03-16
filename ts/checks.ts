import { existsSync, accessSync, promises as fsp, mkdirSync } from "fs";
import { parse } from "path";

/**
 * checks if dirPath exists.
 * @param {string} path path to check.
 * @return {boolean}
 */
export const checkPathSync = (
    path: string,
    mode: number
): boolean => {
    /** check if dir exists */
    if (!checkDir(path)) return false;
    try {
        /** check permissions */
        accessSync(existsSync(path) ? path : parse(path).dir, mode);
        return true;// all checks good return true
    } catch (error) {
        return false;
    }
};

/**
 * checks if dirPath exists.
 * @param {string} path path to check.
 * @return {Promise<boolean>}
 */
export const checkPath = async (
    path: string,
    mode: number
): Promise<boolean> => {
    /** check if dir exists */
    if (!checkDir(path)) return false;
    try {
        /** check permissions */
        await fsp.access(existsSync(path) ? path : parse(path).dir, mode);
        return true; // all checks good return true
    } catch (error) {
        return false;
    }
};

/**
 * checks if the path.dir exist. if false make dir.
 * @param {string} path path for dir to check.
 * @return {boolean}
 */
const checkDir = (
    path: string
): boolean => {
    /** check if dir exists */
    const dir = parse(path).dir;
    //check if path doesn't have dir or if path exists
    if (!(dir == '' || existsSync(dir))) mkdirSync(dir, { recursive: true });
    return existsSync(dir); // check if path doesn't exists
};
