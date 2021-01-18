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
import { MyClass as mijClass } from "./worker";

let instance1: any, instance2: any;
async function showState() {
    console.log(`instance1.counter = ${await instance1.counter},
      instance2.counter = ${await instance2.counter}`);
}

async function init() {
    const work = new Worker("./build/worker.js");
    const endpoint = nodeEndpoint(work);
    const MyClass: any = Comlink.wrap<mijClass>(endpoint);
    instance1 = await new MyClass();
    instance2 = await new MyClass(42);
    await showState();
    await instance1.increment();
    await instance2.increment(23);
    await showState();
}

init();
