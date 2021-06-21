import {
    checkPathSync,
} from "./checksSync";
import fs from "fs";

export default {
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
        if (checkPathSync(path))
            fs.rmdirSync(path);
    },
    /**
    * checks if dir exists sync.
    * @param {string} path path to dir.
    * @return {boolean}
    */
    checkS: (path: string): boolean =>
        fs.existsSync(path),
};
