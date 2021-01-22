/** import all modules */
import * as dir from "./DirHandler";
import file from "./handlers/fileHandler";
import json from "./handlers/jsonHandler";

/** export modules */
export default { ...file, file, dir, json };
export { json as Json };
export { dir as Dir };
export { file as File };