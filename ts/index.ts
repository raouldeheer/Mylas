/** import all modules */
import * as File from "./fileHandler";
import * as json from "./JsonHandler";
import * as dir from "./DirHandler";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const { checkP, checkPS, ...file } = File;

/** export modules */
export default { ...file, file, dir, json };
export { json as Json };
export { dir as Dir };
export { file as File };