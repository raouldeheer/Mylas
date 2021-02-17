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
    export const loadS = fileS.loadS;
    export const saveS = fileS.saveS;
    export const load = fileA.load;
    export const save = fileA.save;
    export const loadW = workers.loadFile;
    export const saveW = workers.saveFile;
    export namespace json {
        export const loadS = jsonS.loadS;
        export const saveS = jsonS.saveS;
        export const load = jsonA.load;
        export const save = jsonA.save;
        export const loadW = workers.loadJson;
        export const saveW = workers.saveJson;
    }
    export namespace file {
        export const loadS = fileS.loadS;
        export const saveS = fileS.saveS;
        export const load = fileA.load;
        export const save = fileA.save;
        export const loadW = workers.loadFile;
        export const saveW = workers.saveFile;
    }
    export namespace dir {
        export const mk = dirA.mk;
        export const mkS = dirS.mkS;
        export const rm = dirA.rm;
        export const rmS = dirS.rmS;
        export const check = dirA.check;
        export const checkS = dirS.checkS;
    }
}

/** Export namespaces */
export default mylas;
import Json = mylas.json;
import Dir = mylas.dir;
import File = mylas.file;
export { Json, Dir, File };