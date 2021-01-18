import { parentPort } from "worker_threads";
import * as Comlink from "comlink";

function nodeEndpoint(nep:any) {
    const listeners = new WeakMap();
    return {
        postMessage: nep.postMessage.bind(nep),
        addEventListener: (_:any, eh:any) => {
            const l = (data:any) => {
                if ("handleEvent" in eh) {
                    eh.handleEvent({ data });
                }
                else {
                    eh({ data });
                }
            };
            nep.on("message", l);
            listeners.set(eh, l);
        },
        removeEventListener: (_:any, eh:any) => {
            const l = listeners.get(eh);
            if (!l) {
                return;
            }
            nep.off("message", l);
            listeners.delete(eh);
        },
        start: nep.start && nep.start.bind(nep),
    };
}


export class MyClass {
    _counter: number;
    
    constructor(init = 0) {
      console.log(init);
      this._counter = init;
    }
  
    get counter() {
      return this._counter;
    }
  
    increment(delta = 1) {
      this._counter += delta;
    }
  }
  
  Comlink.expose(MyClass, nodeEndpoint(parentPort));