/** import all modules */
import { loadFileSync as loadSync, saveFileSync as saveSync, loadFile as load, saveFile as save } from "./fileLoader";
import * as JsonLoader from "./JsonLoader";

/** export modules */
export default { loadSync, saveSync, load, save };
export { JsonLoader as Json };
