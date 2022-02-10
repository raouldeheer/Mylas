import fs from "fs";
import findDeps from "./find-dependencies";
import {
    booleanCallback,
    voidCallback,
} from "./types";
import {
    checkPathSync,
    checkPath,
} from "./checks";

const dir = {
    /**
     * makes fs dir sync
     * @param {string} path path to dir
     * @return {void}
     */
    mkS: (path: string): void => {
        if (checkPathSync(path))
            fs.mkdirSync(path, { recursive: true });
    },
    /**
     * removes fs dir sync
     * @param {string} path path to dir
     * @return {void}
     */
    rmS: (path: string): void => {
        if (checkPathSync(path)) {
            // node version 12 compatibility
            if (process.versions.node.startsWith("12")) {
                fs.rmdirSync(path, { recursive: true });
            } else {
                fs.rmSync(path, { recursive:true, force: true });
            }
        }
    },
    /**
     * checks if dir exists sync.
     * @param {string} path path to dir.
     * @return {boolean}
     */
    checkS: (path: string): boolean =>
        fs.existsSync(path),
    /**
     * makes fs dir
     * @param {string} path path to dir
     * @param {voidCallback} callback callback to call.
     * @return {Promise<void>}
     */
    mk: async (
        path: string,
        callback?: voidCallback
    ): Promise<void> => {
        if (await checkPath(path))
            await fs.promises.mkdir(path, { recursive: true });
        callback?.();
    }
    ,
    /**
     * removes fs dir
     * @param {string} path path to dir
     * @param {voidCallback} callback callback to call. 
     * @return {Promise<void>}
     */
    rm: async (
        path: string,
        callback?: voidCallback
    ): Promise<void> => {
        if (await checkPath(path)) {
            // node version 12 compatibility
            if (process.versions.node.startsWith("12")) {
                await fs.promises.rmdir(path, { recursive: true });
            } else {
                await fs.promises.rm(path, { recursive:true, force: true });
            }
        }
        callback?.();
    },
    /**
     * checks if dir exists.
     * @param {string} path path to dir.
     * @param {booleanCallback} callback callback to call.
     * @return {Promise<boolean>}
     */
    check: async (
        path: string,
        callback?: booleanCallback
    ): Promise<boolean> => {
        const response = fs.existsSync(path);
        callback?.(response);
        return response;
    },
    /**
     * NodeModules find where the node_modules directories are.
     * @param input optional cwd input.
     * @returns an array of locations where node_modules is found.
     */
    nodeModules: (input?: { cwd?: string; relative?: boolean; } | string): string[] => findDeps(input),
};
export default dir;
