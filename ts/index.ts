// /** import all modules */
// import * as File from "./fileHandler";
// import * as json from "./JsonHandler";
// import * as dir from "./DirHandler";

// // eslint-disable-next-line @typescript-eslint/no-unused-vars
// const { checkP, checkPS, ...file } = File;

// /** export modules */
// export default { ...file, file, dir, json };
// export { json as Json };
// export { dir as Dir };
// export { file as File };


function nodeEndpoint(nep: any) {
    const listeners = new WeakMap();
    return {
        postMessage: nep.postMessage.bind(nep),
        addEventListener: (_: any, eh: any) => {
            const l = (data: any) => {
                if ("handleEvent" in eh) {
                    eh.handleEvent({ data });
                }
                else {
                    eh({ data });
                }
            };
            nep.on("message", l);
            listeners.set(eh, l);
        },
        removeEventListener: (_: any, eh: any) => {
            const l = listeners.get(eh);
            if (!l) {
                return;
            }
            nep.off("message", l);
            listeners.delete(eh);
        },
        start: nep.start && nep.start.bind(nep),
    };
}

import { Worker } from "worker_threads";
import * as Comlink from "comlink";
import { fileWorker as func } from "./workers/fileWorker";


const work = new Worker("./build/workers/fileWorker.js");
const endpoint = nodeEndpoint(work);

async function init() {
    const MyClass = Comlink.wrap<func>(endpoint);
    const result = await MyClass.loadJson(69);
    MyClass[Comlink.releaseProxy]();
    return result;
}

async function go() {
    console.log(await init());
}

go();