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
    //check if path is only a filename.
    if (!path.includes("\\") && !path.includes("/"))
        return path.includes(".");
    if (Path.isAbsolute(path)) //check if path is absolute.
        throw new Error("Cannot use absolute path");
    /** check if dir exists */
    if (checkDir(path) != true) return false;
    return true; // all checks good return true
};

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
};

/**
 * checks if dirPath exists.
 * @param {string} path path to check.
 * @return {Promise<boolean>}
 */
 export const checkPath = async (
    path: string
): Promise<boolean> => {
    //check if path is only a filename.
    if (!path.includes("\\") && !path.includes("/"))
        return path.includes(".");
    if (Path.isAbsolute(path)) //check if path is absolute.
        throw new Error("Cannot use absolute path");
    /** check if dir exists */
    if (checkDir(path) != true) return false;
    /** check permissions */
    if (await checkPerm(path) != true) return false;
    return true; // all checks good return true
};

/**
 * checks the permissions of a path.
 * @param {string} path path to check permissions of.
 * @return {Promise<boolean>}
 */
export const checkPerm = async (
    path: string
): Promise<boolean> => {
    /** check permissions */
    const parsedPath = Path.parse(path);
    if (fs.existsSync(path)) {
        await fs.promises.access(
            path,
            fs.constants.R_OK |
            fs.constants.W_OK
        ).catch(() => {
            throw new Error("Permissions error");
        });
    }
    await fs.promises.access(
        parsedPath.dir,
        fs.constants.R_OK |
        fs.constants.W_OK
    ).catch(() => {
        throw new Error("Permissions error");
    });
    return true;
};
