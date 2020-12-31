import fs, { promises as fsPromises } from "fs";
import { default as Path } from "path";


export function checkPathSync(path: string): boolean {
    if (Path.isAbsolute(path)) throw new Error("Cannot use absolute path"); //check if path is absolute.
    /** check if dir exists */
    if (checkDir(path) != true) return false;
    return true; // all checks good return true
}

/**
 * checkPath checks if dirPath exists.
 * @param path path to check.
 */
export async function checkPath(path: string): Promise<boolean> {
    if (Path.isAbsolute(path)) throw new Error("Cannot use absolute path"); //check if path is absolute.
    /** check if dir exists */
    if (checkDir(path) != true) return false;
    /** check permissions */
    if (await checkPerm(path) != true) return false;
    return true; // all checks good return true
}

/**
 * checkDir checks if the path.dir exist. if it doesn't exist checkDir will make the dir.
 * @param path path for dir to check.
 */
function checkDir(path: string): boolean {
    /** check if dir exists */
    const parsedPath = Path.parse(path);
    const dir = parsedPath.dir;
    if (!((dir == '') || (fs.existsSync(dir)))) { //check if path doesn't have dir or if path exists
        const steps = dir.split(dir.includes("/") ? "/" : "\\"); //split dir in steps
        for (let i = 0; i < steps.length; i++) {
            if (steps[i] != ".") {
                const pathTillNow = steps.reduce((prev, curr, curr_i) => {
                    return (curr_i > i) ? prev : prev + Path.sep + curr;
                })
                if (!fs.existsSync(pathTillNow)) fs.mkdirSync(pathTillNow); // check and make dir
            }
        }
    }
    if (!fs.existsSync(dir)) return false; // check if path doesn't exists
    return true;
}

/**
 * checkperm checks the permissions of a path.
 * @param path path to check permissions of.
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
 * loadFile loads string data from file.
 * @param path path to load from.
 */
export function loadFileSync(path: string): string {
    if (checkPathSync(path) == true) {
        return fs.readFileSync(path, "utf8");
    } else {
        throw new Error(`Can't read from ${path}`);
    }
}

/**
 * saveFileSync saves string to file.
 * @param path path to save to.
 * @param data data to save.
 */
export function saveFileSync(path: string, data: string): void {
    if (checkPathSync(path) == true) {
        fs.writeFileSync(path, data, "utf8");
    } else {
        throw new Error(`Can't write to ${path}`);
    }
}

/**
 * loadFile loads string data from file.
 * @param path path to load from.
 */
export async function loadFile(path: string, callback?: FunctionStringCallback): Promise<string> {
    if (await checkPath(path) == true) {
        const data = await fsPromises.readFile(path, "utf8");
        if (callback != undefined) callback(data);
        return data;
    } else {
        throw new Error(`Can't read from ${path}`);
    }
}

/**
 * saveFile saves string to file.
 * @param path path to save to.
 * @param data data to save.
 */
export async function saveFile(path: string, data: string, callback?: VoidFunction): Promise<void> {
    if (await checkPath(path) == true) {
        await fsPromises.writeFile(path, data, "utf8");
        if (callback != undefined) callback();
    } else {
        throw new Error(`Can't write to ${path}`);
    }
}