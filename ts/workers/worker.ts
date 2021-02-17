import { parentPort as PP } from "worker_threads";
import { loadFile as loadF, saveFile as saveF, } from "../async/fileAsync";
import { loadJson as loadJ, saveJson as saveJ, } from "../async/jsonAsync";
import { Method, WorkerRequest } from "../types";
/* eslint-disable */
PP?.on('message', async ({ method, path, data }: WorkerRequest) => {
    try {
        if (method === Method.loadFile) PP!.postMessage(await loadF(path));
        if (method === Method.saveFile) await saveF(path, data);
        if (method === Method.loadJson) PP!.postMessage(await loadJ(path));
        if (method === Method.saveJson) await saveJ(path, data);
        setTimeout(process.exit(0), 10);
    } catch (error) { process.exit(1); }
});