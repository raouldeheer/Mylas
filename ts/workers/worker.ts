import {
    parentPort as PP,
} from "worker_threads";
import {
    Method,
    Request,
} from "../types";
import bufferAsync from "../async/bufferAsync";
require("../prototypes");
/* eslint-disable */
PP?.once('message', async ({ method, path, data }: Request) => {
    try {
        if (method === Method.loadFile) PP!.postMessage(await String.load(path));
        if (method === Method.saveFile) await String.save(path, data);
        if (method === Method.loadJson) PP!.postMessage(await JSON.load(path));
        if (method === Method.saveJson) await JSON.save(path, data);
        if (method === Method.loadBuffer) {
            const data = await bufferAsync.load(path);
            const sharedUint8Array = new Uint8Array(
                new SharedArrayBuffer(data.byteLength));
            sharedUint8Array.set(data);
            PP!.postMessage(sharedUint8Array);
        }
        if (method === Method.saveBuffer)
            await bufferAsync.save(path, Buffer.from(data));
        setTimeout(process.exit(0), 10);
    } catch (error) { process.exit(1); }
});
