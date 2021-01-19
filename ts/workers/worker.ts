

export class worker {
    
    public static nodeEndpoint(nep: any) {
        const listeners = new WeakMap();
        return {
            postMessage: nep.postMessage.bind(nep),
            addEventListener: (_: any, eh: any) => {
                const l = (data: any) => {
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
            removeEventListener: (_: any, eh: any) => {
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


}


// export class funcs {
//     loadJsonSync = (string: String): String => {
//         return string;
//     }

//     saveJsonSync = (string: number) => {
//         return string;
//     }

//     loadJson = (string: number) => {
//         return string + 10;
//     }

//     saveJson = (string: number) => {
//         return string + 25;
//     }

// }

// const func = new funcs();
// Comlink.expose(func, nodeEndpoint(parentPort));