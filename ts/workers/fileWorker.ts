import { expose } from "./worker";
import { parentPort } from "worker_threads";
import {
    load,
    save,
} from "../async/fileAsync";

const loadFile = async (
    path: string,
): Promise<string> => {
    return await load(path);
}

const saveFile = async (
    path: string,
    data: string,
): Promise<void> => {
    await save(path, data);
}

const thisClass = {
    loadFile,
    saveFile,
};

export default thisClass
expose(thisClass, parentPort);