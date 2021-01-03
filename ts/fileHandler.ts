import fs, { promises as fsPromises } from "fs";
import Path from "path";

export {
    loadFileSync as loadS,
    saveFileSync as saveS,
    loadFile as load,
    saveFile as save,
    checkPath as checkP,
    checkPathSync as checkPS
};

/**
 * checks if dirPath exists.
 * @param {string} path path to check.
 */
function checkPathSync(path: string): boolean {
    if (Path.isAbsolute(path)) throw new Error("Cannot use absolute path"); //check if path is absolute.
    /** check if dir exists */
    if (checkDir(path) != true) return false;
    return true; // all checks good return true
}

/**
 * checks if dirPath exists.
 * @param {string} path path to check.
 */
async function checkPath(path: string): Promise<boolean> {
    if (Path.isAbsolute(path)) throw new Error("Cannot use absolute path"); //check if path is absolute.
    /** check if dir exists */
    if (checkDir(path) != true) return false;
    /** check permissions */
    if (await checkPerm(path) != true) return false;
    return true; // all checks good return true
}

/**
 * checks if the path.dir exist. if it doesn't exist checkDir will make the dir.
 * @param {string} path path for dir to check.
 */
function checkDir(path: string): boolean {
    /** check if dir exists */
    const parsedPath = Path.parse(path);
    const dir = parsedPath.dir;
    if (!((dir == '') || (fs.existsSync(dir)))) { //check if path doesn't have dir or if path exists
        fs.mkdirSync(parsedPath.dir, { recursive: true });
    }
    if (!fs.existsSync(dir)) return false; // check if path doesn't exists
    return true;
}

/**
 * checks the permissions of a path.
 * @param {string} path path to check permissions of.
 */
async function checkPerm(path: string): Promise<boolean> {
    /** check permissions */
    const parsedPath = Path.parse(path);
    if (fs.existsSync(path)) {
        await fsPromises.access(path, fs.constants.R_OK | fs.constants.W_OK)
            .catch(() => { throw new Error("Permissions error") })
    }
    await fsPromises.access(parsedPath.dir, fs.constants.R_OK | fs.constants.W_OK)
        .catch(() => { throw new Error("Permissions error") })
    return true;
}

/**
 * loads string data from file.
 * @param {string} path path to load from.
 */
function loadFileSync(path: string): string {
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
 */
function saveFileSync(path: string, data: string): void {
    if (checkPathSync(path) == true) {
        fs.writeFileSync(path, data, "utf8");
    } else {
        throw new Error(`Can't write to ${path}`);
    }
}

/**
 * loads string data from file.
 * @param {string} path path to load from.
 * @param {VoidFunction} callback function to call when done. 
 */
async function loadFile(path: string, callback?: FunctionStringCallback): Promise<string> {
    if (await checkPath(path) == true) {
        const data = await fsPromises.readFile(path, "utf8");
        if (callback != undefined) callback(data);
        return data;
    } else {
        throw new Error(`Can't read from ${path}`);
    }
}

/**
 * saves string to file.
 * @param {string} path path to save to.
 * @param {string} data data to save.
 * @param {VoidFunction} callback function to call when done. 
 */
async function saveFile(path: string, data: string, callback?: VoidFunction): Promise<void> {
    if (await checkPath(path) == true) {
        await fsPromises.writeFile(path, data, "utf8");
        if (callback != undefined) callback();
    } else {
        throw new Error(`Can't write to ${path}`);
    }
}