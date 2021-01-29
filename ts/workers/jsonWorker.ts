import { expose } from "./worker";
import { parentPort } from "worker_threads";
import {
    load,
    save,
} from "../async/jsonAsync";

const loadJson = async (
    path: string,
): Promise<unknown> => {
    return await load(path);
}

const saveJson = async (
    path: string,
    data: unknown,
): Promise<void> => {
    await save(path, data);
}

const thisClass = {
    loadJson,
    saveJson,
};

export default thisClass
expose(thisClass, parentPort);