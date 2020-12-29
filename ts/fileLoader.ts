import fs, { promises as fsPromises } from "fs";
import { default as Path } from "path";

/**
 * checkPath checks if dirPath exists.
 * @param path path to check.
 */
export function checkPath(path: string): boolean {
    if (Path.isAbsolute(path)) return true; //check if path is absolute.
    const parsedPath = Path.parse(path);
    if ((parsedPath.dir == '') || (fs.existsSync(parsedPath.dir))) return true; //check if path doesn't have dir or if path exists
    const steps = parsedPath.dir.split(parsedPath.dir.includes("/") ? "/" : "\\"); //split dir in steps
    for (let i = 0; i < steps.length; i++) {
        if (steps[i] != ".") {
            const pathTillNow = steps.reduce((prev, curr, curr_i) => {
                return (curr_i > i) ? prev : prev + Path.sep + curr;
            })
            if (!fs.existsSync(pathTillNow)) fs.mkdirSync(pathTillNow); // check and make dir
        }
    }
    if (fs.existsSync(parsedPath.dir)) return true; // check if path exists
    return false; // else return false
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
    if (checkPath(path)) {
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
    if (checkPath(path)) {
        await fsPromises.writeFile(path, data, "utf8");
    } else {
        throw new Error(`Can't write to ${path}`);
    }
}