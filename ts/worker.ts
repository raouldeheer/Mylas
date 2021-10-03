import {
    parentPort as PP,
} from "worker_threads";
import { Json, Buf, File, Method, Request } from "./index";
/* eslint-disable */
PP!.once("message", async ({ method, path, data }: Request) => {
    try {
        if (method === Method.loadFile) PP!.postMessage(await File.load(path));
        if (method === Method.saveFile) await File.save(path, data);
        if (method === Method.loadJson) PP!.postMessage(await Json.load(path));
        if (method === Method.loadJsonComments) PP!.postMessage(await Json.load(path, undefined, true));
        if (method === Method.saveJson) await Json.save(path, data);
        if (method === Method.saveBuffer) await Buf.save(path, Buffer.from(data));
        if (method === Method.loadBuffer) {
            const data = await Buf.load(path);
            const sharedUint8Array = new Uint8Array(
                new SharedArrayBuffer(data.byteLength));
            sharedUint8Array.set(data);
            PP!.postMessage(sharedUint8Array);
        }
        setTimeout(process.exit(0), 10);
    } catch (error) { process.exit(1); }
});
