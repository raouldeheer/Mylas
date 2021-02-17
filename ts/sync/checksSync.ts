import fs from "fs";
import Path from "path";

/**
 * checks if dirPath exists.
 * @param {string} path path to check.
 * @return {boolean}
 */
export const checkPathSync = (
    path: string
): boolean => {
    if (Path.isAbsolute(path)) //check if path is absolute.
        throw new Error("Cannot use absolute path");
    /** check if dir exists */
    if (checkDir(path) != true) return false;
    return true; // all checks good return true
}

/**
 * checks if the path.dir exist. if false make dir.
 * @param {string} path path for dir to check.
 * @return {boolean}
 */
export const checkDir = (
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
