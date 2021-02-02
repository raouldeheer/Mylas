import { parentPort } from "worker_threads";
import { load as loadF, save as saveF } from "../async/fileAsync";
import { load as loadJ, save as saveJ, } from "../async/jsonAsync";
import { Method, WorkerRequest } from "./workerHandlers";

parentPort!.on('message', async (workerRequest: WorkerRequest) => {
    const { method, path, data } = workerRequest;
    switch (method) {
        case Method.loadFile:
            parentPort!.postMessage(await loadF(path));
            break;
        case Method.saveFile:
            try {
                await saveF(path, data);
            } catch (error) { process.exit(1); }
            break;
        case Method.loadJson:
            parentPort!.postMessage(await loadJ(path));
            break;
        case Method.saveJson:
            try {
                await saveJ(path, data);
            } catch (error) { process.exit(1); }
            break;
        default:
            break;
    }
    setTimeout(() => { process.exit(0); }, 10);
});