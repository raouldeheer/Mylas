import { exposeNode } from "./link/link";
import { parentPort } from "worker_threads";
import { load as loadFile, save as saveFile } from "../async/fileAsync";
import { load as loadJson, save as saveJson, } from "../async/jsonAsync";

const worker = {
    loadFile: async (path: string): Promise<string> => {
        return await loadFile(path);
    },
    saveFile: async (path: string, data: string): Promise<void> => {
        await saveFile(path, data);
    },
    loadJson: async (path: string,): Promise<unknown> => {
        return await loadJson(path);
    },
    saveJson: async (path: string, data: unknown,): Promise<void> => {
        await saveJson(path, data);
    }
};

export default worker;
exposeNode(worker, parentPort);