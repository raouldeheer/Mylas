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

import { Worker } from "worker_threads";
import * as Comlink from "comlink";
import fileWorker from "./workers/fileWorker";
import { nodeEndpoint } from "./workers/worker";


const work = new Worker("./build/workers/fileWorker.js");
const endpoint = nodeEndpoint(work);

async function init() {
    const MyClass = Comlink.wrap<typeof fileWorker>(endpoint);
    const result = await MyClass.loadJson(69);
    MyClass[Comlink.releaseProxy]();
    return result;
}

async function go() {
    console.log(await init());
}

go();