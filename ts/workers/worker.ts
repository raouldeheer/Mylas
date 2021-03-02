import {
    parentPort as PP,
} from "worker_threads";
require("../async/fileAsync");
require("../async/jsonAsync");
import {
    Method,
    Request,
} from "../types";
/* eslint-disable */
PP?.once('message', async ({ method, path, data }: Request) => {
    try {
        if (method === Method.loadFile) PP!.postMessage(await String.load(path));
        if (method === Method.saveFile) await String.save(path, data);
        if (method === Method.loadJson) PP!.postMessage(await JSON.load(path));
        if (method === Method.saveJson) await JSON.save(path, data);
        setTimeout(process.exit(0), 10);
    } catch (error) { process.exit(1); }
});