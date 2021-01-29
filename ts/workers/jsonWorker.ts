import { exposeNode } from "./link/link";
import { parentPort } from "worker_threads";
import { load, save, } from "../async/jsonAsync";

const jsonWorker = {
    loadJson: async (path: string,): Promise<unknown> => {
        return await load(path);
    },
    saveJson: async (path: string, data: unknown,): Promise<void> => {
        await save(path, data);
    }
};

export default jsonWorker
exposeNode(jsonWorker, parentPort);