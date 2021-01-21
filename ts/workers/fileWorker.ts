import { nodeEndpoint } from "./worker";
import { parentPort } from "worker_threads";
import * as Comlink from "comlink";
import fs, {
    promises as fsPromises,
} from "fs";
import Path from "path";

const checkPath = async (
    path: string,
): Promise<boolean> => {
    if (Path.isAbsolute(path)) //check if path is absolute.
        throw new Error("Cannot use absolute path");
    /** check if dir exists */
    if (checkDir(path) != true) return false;
    /** check permissions */
    if (await checkPerm(path) != true) return false;
    return true; // all checks good return true
}

const checkDir = (
    path: string,
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

const checkPerm = async (
    path: string,
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

const loadFile = async (
    path: string,
): Promise<string> => {
    if (await checkPath(path) == true) {
        const data = await fsPromises.readFile(path, "utf8");
        return data;
    } else {
        throw new Error(`Can't read from ${path}`);
    }
}

const saveFile = async (
    path: string,
    data: string,
): Promise<void> => {
    if (await checkPath(path) == true) {
        await fsPromises.writeFile(path, data, "utf8");
    } else {
        throw new Error(`Can't write to ${path}`);
    }
}

export default {
    loadFile,
    saveFile,
    checkPath,
};
Comlink.expose({
    loadFile,
    saveFile,
    checkPath,
}, nodeEndpoint(parentPort));