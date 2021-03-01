/** Import all methods */
import {
    loadJson,
    saveJson,
} from "./async/jsonAsync";
import {
    loadJsonSync,
    saveJsonSync,
} from "./sync/jsonSync";
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
    loadJsonWorker,
    saveFileWorker,
    saveJsonWorker,
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
        export const loadS = loadJsonSync;
        export const saveS = saveJsonSync;
        export const load = loadJson;
        export const save = saveJson;
        export const loadW = loadJsonWorker;
        export const saveW = saveJsonWorker;
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
JSON.loadS = loadJsonSync;
JSON.saveS = saveJsonSync;
JSON.load = loadJson;
JSON.save = saveJson;
JSON.loadW = loadJsonWorker;
JSON.saveW = saveJsonWorker;
String.loadS = loadFileSync;
String.saveS = saveFileSync;
String.load = loadFile;
String.save = saveFile;
String.loadW = loadFileWorker;
String.saveW = saveFileWorker;
