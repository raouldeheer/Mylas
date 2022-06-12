import { existsSync, mkdirSync } from "fs";
import { parse } from "path";

/**
 * checks if dirPath exists.
 * @param {string} path path to check.
 * @return {boolean}
 */
export const checkPathSync = (
    path: string,
): boolean => {
    /** check if dir exists */
    if (!checkDir(path)) return false;
    return true;// all checks good return true
};

/**
 * checks if dirPath exists.
 * @param {string} path path to check.
 * @return {Promise<boolean>}
 */
export const checkPath = async (
    path: string,
): Promise<boolean> => {
    /** check if dir exists */
    if (!checkDir(path)) return false;
    return true; // all checks good return true
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
