/** Import all methods */
import * as jsonA from "./async/jsonAsync";
import * as jsonS from "./sync/jsonSync";
import * as fileA from "./async/fileAsync";
import * as fileS from "./sync/fileSync";
import * as workers from "./workers/workerActions";
import * as dirA from "./async/dirAsync";
import * as dirS from "./sync/dirSync";

/** Make namespaces */
namespace mylas {
    export const loadS = fileS.loadFileSync;
    export const saveS = fileS.saveFileSync;
    export const load = fileA.loadFile;
    export const save = fileA.saveFile;
    export const loadW = workers.loadFile;
    export const saveW = workers.saveFile;
    export namespace json {
        export const loadS = jsonS.loadJsonSync;
        export const saveS = jsonS.saveJsonSync;
        export const load = jsonA.loadJson;
        export const save = jsonA.saveJson;
        export const loadW = workers.loadJson;
        export const saveW = workers.saveJson;
    }
    export namespace file {
        export const loadS = fileS.loadFileSync;
        export const saveS = fileS.saveFileSync;
        export const load = fileA.loadFile;
        export const save = fileA.saveFile;
        export const loadW = workers.loadFile;
        export const saveW = workers.saveFile;
    }
    export namespace dir {
        export const mk = dirA.mkDir;
        export const mkS = dirS.mkDirSync;
        export const rm = dirA.rmDir;
        export const rmS = dirS.rmDirSync;
        export const check = dirA.checkDir;
        export const checkS = dirS.checkDirSync;
    }
}

/** Export namespaces */
export default mylas;
import Json = mylas.json;
import Dir = mylas.dir;
import File = mylas.file;
export { Json, Dir, File };