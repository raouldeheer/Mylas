import { nodeEndpoint as make } from "./worker";
import { parentPort } from "worker_threads";
import * as Comlink from "./link/link";
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

export default {
    loadFile,
    saveFile,
};
Comlink.expose({
    loadFile,
    saveFile,
}, make(parentPort));