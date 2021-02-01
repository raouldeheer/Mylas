import { exposeNode } from "./link/link";
import { parentPort } from "worker_threads";
import { load as lF, save as sF } from "../async/fileAsync";
import { load as lJ, save as sJ, } from "../async/jsonAsync";
const worker = {
    loadFile: async (p: string): Promise<string> => await lF(p),
    loadJson: async (p: string,): Promise<unknown> => await lJ(p),
    saveFile: async (p: string, d: string): Promise<void> => await sF(p, d),
    saveJson: async (p: string, d: unknown,): Promise<void> => await sJ(p, d)
};
export type worker = typeof worker;
exposeNode(worker, parentPort);