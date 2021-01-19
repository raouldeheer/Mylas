import { nodeEndpoint } from "./worker";
import { parentPort } from "worker_threads";
import * as Comlink from "comlink";

const loadJson = async (string: number) => {
    return string + 10;
}

const saveJson = async (string: number) => {
    return string + 25;
}

export default { loadJson, saveJson };
Comlink.expose({ loadJson, saveJson }, nodeEndpoint(parentPort));