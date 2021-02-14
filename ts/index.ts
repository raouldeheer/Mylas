/** import all modules */
import dir from "./handlers/dirHandler";
import file from "./handlers/fileHandler";
import json from "./handlers/jsonHandler";

/** export modules */
export default { ...file, file, dir, json };
export { json as Json };
export { dir as Dir };
export { file as File };