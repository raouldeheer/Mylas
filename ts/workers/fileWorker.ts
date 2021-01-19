import { worker } from "./worker";
import { parentPort } from "worker_threads";
import * as Comlink from "comlink";

export class fileWorker extends worker {

    public loadJson = async (string: number) => {
        return string + 10;
    }

    public saveJson = async (string: number) => {
        return string + 25;
    }

}

const func = new fileWorker();
Comlink.expose(func, fileWorker.nodeEndpoint(parentPort));