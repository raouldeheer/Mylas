import { Worker } from 'worker_threads';
import { Request } from "../types";
const action = <T>(
    { callback, ...req }: Request<T>
): Promise<T> => new Promise<T>((res, rej) => {
    let d: T;
    new Worker('./build/workers/worker.js')
        .once('message', m => d = m).once('exit', c => c == 0 ? res(d) : rej(c))
        .once('error', e => rej(e)).once('messageerror', e => rej(e))
        .postMessage(req);
}).then(v => { callback?.(v); return v; }, e => { throw new Error(e); });
export default action;
