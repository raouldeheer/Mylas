import fs, { promises as fsPromises } from "fs";
import { booleanCallback, voidCallback } from "@raouldeheer/tstypes";
import Path from "path";
import { checkP as checkPath, checkPS as checkPathSync } from "./fileHandler";

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
 * @param {voidCallback} callback function to call when done.
 * @return {Promise<void>}
 */
async function mkDir(path: string, callback?: voidCallback): Promise<void> {
    if (await checkPath(path)) {
        await fsPromises.mkdir(path, { recursive: true });
    }
    if (callback != undefined) callback();
}

/**
 * makes fs dir sync
 * @param {string} path path to dir
 * @return {void}
 */
function mkDirSync(path: string): void {
    if (checkPathSync(path)) {
        fs.mkdirSync(path, { recursive: true });
    }
}

/**
 * removes fs dir
 * @param {string} path path to dir
 * @param {voidCallback} callback function to call when done. 
 * @return {Promise<void>}
 */
async function rmDir(path: string, callback?: voidCallback): Promise<void> {
    if (await checkPath(path)) {
        await fsPromises.rmdir(path);
    }
    if (callback != undefined) callback();
}

/**
 * removes fs dir sync
 * @param {string} path path to dir
 * @return {void}
 */
function rmDirSync(path: string): void {
    if (checkPathSync(path)) {
        fs.rmdirSync(path);
    }
}

/**
 * checks if dir exists.
 * @param {string} path path path to dir.
 * @param {booleanCallback} callback function to call when done.
 * @return {Promise<boolean>}
 */
async function checkDir(path: string, callback?: booleanCallback): Promise<boolean> {
    if (Path.parse(path).ext !== "") throw new Error("Cannot check file!");
    if (callback != undefined) callback(fs.existsSync(path));
    return fs.existsSync(path);
}

/**
 * checks if dir exists sync.
 * @param {string} path path to dir.
 * @return {boolean}
 */
function checkDirSync(path: string): boolean {
    if (Path.parse(path).ext !== "") throw new Error("Cannot check file!");
    return fs.existsSync(path);
}
