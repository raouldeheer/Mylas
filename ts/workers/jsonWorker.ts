// import { worker } from "./worker";
// import { parentPort } from "worker_threads";
// import * as Comlink from "comlink";
// import {
//     objectCallback,
//     voidCallback
//  } from "@raouldeheer/tstypes";

// export class jsonWorker extends worker {

//     /**
//      * loads JSON from file.
//      * @param {string} path path to load from.
//      * @param {objectCallback<T>} callback callback to call. 
//      * @return {Promise<T>}
//      */
//     public static loadJson = async <T>(
//         path: string,
//         callback?: objectCallback<T>
//     ): Promise<T> => {
//         const data: T = JSON.parse(await loadFile(path));
//         callback?.(data);
//         return data;
//     }

//     /**
//      * saves JSON data to file.
//      * @param {string} path path to save to.
//      * @param {T} data data to save.
//      * @param {voidCallback} callback callback to call. 
//      * @return {Promise<void>}
//      */
//     public static saveJson = async <T>(
//         path: string,
//         data: T,
//         callback?: voidCallback
//     ): Promise<void> => {
//         await saveFile(path, JSON.stringify(data));
//         callback?.();
//     }

// }

// Comlink.expose(jsonWorker, jsonWorker.nodeEndpoint(parentPort));