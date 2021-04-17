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
require("./prototypes");

/** Make modules */
/** JSON functions */
const Json = {
    ...jsonSync,
    ...jsonAsync,
    ...jsonWorker,
};
/** File functions */
const File = {
    ...fileSync,
    ...fileAsync,
    ...fileWorker,
};
/** Directory functions */
const Dir = {
    ...dirSync,
    ...dirAsync,
};
const Mylas = {
    json: Json,
    file: File,
    dir: Dir,
    ...File
};

/** Export modules */
export default Mylas;
export { Json, Dir, File };
