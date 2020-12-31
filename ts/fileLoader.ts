import fs, { promises as fsPromises } from "fs";
import { default as Path } from "path";

/**
 * checkPath checks if dirPath exists.
 * @param path path to check.
 */
export async function checkPath(path: string): Promise<boolean> {
    /** check if dir exists */
    if (Path.isAbsolute(path)) throw new Error("Cannot use absolute path"); //check if path is absolute.
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
    /** check permissions */
    if (fs.existsSync(path)) {
        await fsPromises.access(path, fs.constants.R_OK | fs.constants.W_OK)
            .catch(() => { throw new Error("Permissions error") })
    }
    await fsPromises.access(dir, fs.constants.R_OK | fs.constants.W_OK)
        .catch(() => { throw new Error("Permissions error") })
    return true; // all checks good return true
}

/**
 * loadFile loads string data from file.
 * @param path path to load from.
 */
export function loadFileSync(path: string): string {
    if (checkPath(path)) {
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
    if (checkPath(path)) {
        fs.writeFileSync(path, data, "utf8");
    } else {
        throw new Error(`Can't write to ${path}`);
    }
}

/**
 * loadFile loads string data from file.
 * @param path path to load from.
 */
export async function loadFile(path: string): Promise<string> {
    if (await checkPath(path)) {
        return await fsPromises.readFile(path, "utf8");
    } else {
        throw new Error(`Can't read from ${path}`);
    }
}

/**
 * saveFile saves string to file.
 * @param path path to save to.
 * @param data data to save.
 */
export async function saveFile(path: string, data: string): Promise<void> {
    if (await checkPath(path)) {
        await fsPromises.writeFile(path, data, "utf8");
    } else {
        throw new Error(`Can't write to ${path}`);
    }
}