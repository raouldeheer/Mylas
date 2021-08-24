import {
    parentPort as PP,
} from "worker_threads";
import {
    Method,
    Request,
} from "../types";
import buf from "../buf";
import file from "../file";
import json from "../json";
/* eslint-disable */
PP!.once('message', async ({ method, path, data }: Request) => {
    try {
        if (method === Method.loadFile) PP!.postMessage(await file.load(path));
        if (method === Method.saveFile) await file.save(path, data);
        if (method === Method.loadJson) PP!.postMessage(await json.load(path));
        if (method === Method.loadJsonComments) PP!.postMessage(await json.load(path, undefined, true));
        if (method === Method.saveJson) await json.save(path, data);
        if (method === Method.loadBuffer) {
            const data = await buf.load(path);
            const sharedUint8Array = new Uint8Array(
                new SharedArrayBuffer(data.byteLength));
            sharedUint8Array.set(data);
            PP!.postMessage(sharedUint8Array);
        }
        if (method === Method.saveBuffer)
            await buf.save(path, Buffer.from(data));
        setTimeout(process.exit(0), 10);
    } catch (error) { process.exit(1); }
});
