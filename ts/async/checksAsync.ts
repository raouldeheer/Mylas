import fs, {
    promises as fsPromises,
} from "fs";
import Path from "path";
import { checkDir } from "../sync/checksSync";

export {
    checkPath,
    checkPerm,
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