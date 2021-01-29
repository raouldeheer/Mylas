import { exposeNode } from "./link/link";
import { parentPort } from "worker_threads";
import { load, save, } from "../async/fileAsync";

const fileWorker = {
    loadFile: async (path: string): Promise<string> => {
        return await load(path);
    },
    saveFile: async (path: string, data: string): Promise<void> => {
        await save(path, data);
    }
};

export default fileWorker
exposeNode(fileWorker, parentPort);