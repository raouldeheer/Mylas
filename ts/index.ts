/** Import all sub-modules */
import Buf from "./buf";
import File from "./file";
import Json from "./json";
import Dir from "./dir";
require("./prototypes");

/** Make module */
const Mylas = {
    json: Json,
    file: File,
    dir: Dir,
    buf: Buf,
    ...File,
};

/** Export modules */
export default Mylas;
export { Json, Dir, File, Buf };

import { Method, Request } from "./types";
export { Method, Request };