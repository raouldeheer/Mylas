/** Import all sub-modules */
import jsonAsync from "./async/jsonAsync";
import jsonSync from "./sync/jsonSync";
import fileAsync from "./async/fileAsync";
import fileSync from "./sync/fileSync";
import {
    jsonWorker,
    fileWorker,
} from "./workers/workerActions";
import dirAsync from "./async/dirAsync";
import dirSync from "./sync/dirSync";

/** Make modules */
const Mylas = {
    json: {
        ...jsonSync,
        ...jsonAsync,
        ...jsonWorker,
    },
    file: {
        ...fileSync,
        ...fileAsync,
        ...fileWorker,
    },
    dir: {
        ...dirSync,
        ...dirAsync,
    },
    ...fileSync,
    ...fileAsync,
    ...fileWorker,
}

/** Export modules */
export default Mylas;
const Json = Mylas.json;
const Dir = Mylas.dir;
const File = Mylas.file;
export { Json, Dir, File };
