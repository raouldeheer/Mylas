/** Import all sub-modules */
import { buf as Buf } from "./buf";
import { file as File } from "./file";
import { json as Json } from "./json";
import { dir as Dir } from "./dir";
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
