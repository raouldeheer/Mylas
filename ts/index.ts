/** Import all methods */
require("./async/jsonAsync");
require("./sync/jsonSync");
require("./workers/workerActions");
import {
    loadFile,
    saveFile,
} from "./async/fileAsync";
import {
    loadFileSync,
    saveFileSync,
} from "./sync/fileSync";
import {
    loadFileWorker,
    saveFileWorker,
} from "./workers/workerActions";
import {
    mkDir,
    rmDir,
    checkDir,
} from "./async/dirAsync";
import {
    mkDirSync,
    rmDirSync,
    checkDirSync,
} from "./sync/dirSync";

/** Make namespaces */
namespace Mylas {
    export namespace json {
        export const loadS = JSON.loadS;
        export const saveS = JSON.saveS;
        export const load = JSON.load;
        export const save = JSON.save;
        export const loadW = JSON.loadW;
        export const saveW = JSON.saveW;
    }
    export namespace file {
        export const loadS = loadFileSync;
        export const saveS = saveFileSync;
        export const load = loadFile;
        export const save = saveFile;
        export const loadW = loadFileWorker;
        export const saveW = saveFileWorker;
    }
    export namespace dir {
        export const mk = mkDir;
        export const mkS = mkDirSync;
        export const rm = rmDir;
        export const rmS = rmDirSync;
        export const check = checkDir;
        export const checkS = checkDirSync;
    }
    export const loadS = file.loadS;
    export const saveS = file.saveS;
    export const load = file.load;
    export const save = file.save;
    export const loadW = file.loadW;
    export const saveW = file.saveW;
}

/** Export namespaces */
export default Mylas;
import Json = Mylas.json;
import Dir = Mylas.dir;
import File = Mylas.file;
export { Json, Dir, File };

/** Add to prototypes */
String.loadS = loadFileSync;
String.saveS = saveFileSync;
String.load = loadFile;
String.save = saveFile;
String.loadW = loadFileWorker;
String.saveW = saveFileWorker;
