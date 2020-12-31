/** import all modules */
import { 
    loadFileSync    as loadS,
    saveFileSync    as saveS,
    loadFile        as load,
    saveFile        as save
} from "./fileLoader";
import * as JsonLoader from "./JsonLoader";

/** export modules */
export default { loadS, saveS, load, save };
export { JsonLoader as Json };
