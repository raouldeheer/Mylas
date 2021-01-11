import fs, {
    promises as fsPromises
} from "fs";
import {
    booleanCallback,
    voidCallback
} from "@raouldeheer/tstypes";
import Path from "path";
import {
    checkP as checkPath,
    checkPS as checkPathSync
} from "./fileHandler";

export {
    mkDir as mk,
    mkDirSync as mkS,
    rmDir as rm,
    rmDirSync as rmS,
    checkDir as check,
    checkDirSync as checkS
};

/**
 * makes fs dir
 * @param {string} path path to dir
 * @param {voidCallback} callback callback to call.
 * @return {Promise<void>}
 */
const mkDir = async (
    path: string,
    callback?: voidCallback
): Promise<void> => {
    if (await checkPath(path))
        await fsPromises.mkdir(path, { recursive: true });
    callback?.();
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
 * removes fs dir
 * @param {string} path path to dir
 * @param {voidCallback} callback callback to call. 
 * @return {Promise<void>}
 */
const rmDir = async (
    path: string,
    callback?: voidCallback
): Promise<void> => {
    if (await checkPath(path))
        await fsPromises.rmdir(path);
    callback?.();
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
 * checks if dir exists.
 * @param {string} path path path to dir.
 * @param {booleanCallback} callback callback to call.
 * @return {Promise<boolean>}
 */
const checkDir = async (
    path: string,
    callback?: booleanCallback
): Promise<boolean> => {
    const response = fs.existsSync(path);
    callback?.(response);
    return response;
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
