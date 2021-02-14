import * as File from "../async/dirAsync";
import * as FileS from "../sync/dirSync";
export default { ...File, ...FileS };