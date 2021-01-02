import fs, { promises as fsPromises } from "fs";
import { checkP as checkPath, checkPS as checkPathSync } from "./fileHandler";

export {
    mkDir as mk,
    mkDirSync as mkS,
    rmDir as rm,
    rmDirSync as rmS
};

/**
 * makes fs dir
 * @param path path to dir
 * @param callback function to callback
 */
async function mkDir(path: string, callback?: VoidFunction): Promise<void> {
    if (await checkPath(path)) {
        await fsPromises.mkdir(path, { recursive: true });
    }
    if (callback != undefined) callback();
}

/**
 * makes fs dir sync
 * @param path path to dir
 */
function mkDirSync(path: string): void {
    if (checkPathSync(path)) {
        fs.mkdirSync(path, { recursive: true });
    }
}

/**
 * removes fs dir
 * @param path path to dir
 * @param callback function to callback
 */
async function rmDir(path: string, callback?: VoidFunction): Promise<void> {
    if (await checkPath(path)) {
        await fsPromises.rmdir(path);
    }
    if (callback != undefined) callback();
}

/**
 * removes fs dir sync
 * @param path path to dir
 */
function rmDirSync(path: string): void {
    if (checkPathSync(path)) {
        fs.rmdirSync(path);
    }
}
