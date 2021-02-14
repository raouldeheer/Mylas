import fs, {
    promises as fsPromises,
} from "fs";
import {
    booleanCallback,
    voidCallback,
} from "../types";
import {
    checkPath,
} from "./checksAsync";

export {
    mkDir as mk,
    rmDir as rm,
    checkDir as check,
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