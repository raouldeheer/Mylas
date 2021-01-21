import fs, {
    promises as fsPromises,
} from "fs";
import Path from "path";
import {
    stringCallback,
    voidCallback,
} from "@raouldeheer/tstypes";
import {
    loadFile as loadW,
    saveFile as saveW,
} from "./workers/Handlers";


export {
    loadFileSync as loadS,
    saveFileSync as saveS,
    loadFile as load,
    saveFile as save,
    checkPath as checkP,
    checkPathSync as checkPS,
    loadW,
    saveW,
};

/**
 * checks if dirPath exists.
 * @param {string} path path to check.
 * @return {boolean}
 */
const checkPathSync = (
    path: string
): boolean => {
    if (Path.isAbsolute(path)) //check if path is absolute.
        throw new Error("Cannot use absolute path");
    /** check if dir exists */
    if (checkDir(path) != true) return false;
    return true; // all checks good return true
}

/**
 * checks if dirPath exists.
 * @param {string} path path to check.
 * @return {Promise<boolean>}
 */
const checkPath = async (
    path: string
): Promise<boolean> => {
    if (Path.isAbsolute(path)) //check if path is absolute.
        throw new Error("Cannot use absolute path");
    /** check if dir exists */
    if (checkDir(path) != true) return false;
    /** check permissions */
    if (await checkPerm(path) != true) return false;
    return true; // all checks good return true
}

/**
 * checks if the path.dir exist. if false make dir.
 * @param {string} path path for dir to check.
 * @return {boolean}
 */
const checkDir = (
    path: string
): boolean => {
    /** check if dir exists */
    const parsedPath = Path.parse(path);
    const dir = parsedPath.dir;
    if (!(//check if path doesn't have dir or if path exists
        (dir == '') ||
        (fs.existsSync(dir))
    )) fs.mkdirSync(parsedPath.dir, { recursive: true });
    if (!fs.existsSync(dir)) // check if path doesn't exists
        return false;
    return true;
}

/**
 * checks the permissions of a path.
 * @param {string} path path to check permissions of.
 * @return {Promise<boolean>}
 */
const checkPerm = async (
    path: string
): Promise<boolean> => {
    /** check permissions */
    const parsedPath = Path.parse(path);
    if (fs.existsSync(path)) {
        await fsPromises.access(
            path, 
            fs.constants.R_OK | 
            fs.constants.W_OK
        ).catch(() => { 
            throw new Error("Permissions error") 
        })
    }
    await fsPromises.access(
        parsedPath.dir, 
        fs.constants.R_OK | 
        fs.constants.W_OK
    ).catch(() => { 
        throw new Error("Permissions error") 
    })
    return true;
}

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

/**
 * loads string data from file.
 * @param {string} path path to load from.
 * @param {stringCallback} callback callback to call. 
 * @return {Promise<string>}
 */
const loadFile = async (
    path: string,
    callback?: stringCallback
): Promise<string> => {
    if (await checkPath(path) == true) {
        const data = await fsPromises.readFile(path, "utf8");
        callback?.(data);
        return data;
    } else {
        throw new Error(`Can't read from ${path}`);
    }
}

/**
 * saves string to file.
 * @param {string} path path to save to.
 * @param {string} data data to save.
 * @param {voidCallback} callback callback to call. 
 * @return {Promise<void>}
 */
const saveFile = async (
    path: string,
    data: string,
    callback?: voidCallback
): Promise<void> => {
    if (await checkPath(path) == true) {
        await fsPromises.writeFile(path, data, "utf8");
        callback?.();
    } else {
        throw new Error(`Can't write to ${path}`);
    }
}
