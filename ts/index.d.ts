declare type voidCallback = () => void;
declare type stringCallback = (arg0: string) => void;
declare type objectCallback<T> = (arg0: T) => void;
declare type booleanCallback = (arg0: boolean) => void;

declare interface JsonT {
    /**
     * loads JSON from file sync.
     * @param {string} path path to load from.
     * @param {boolean} hasComments file to load has comments in json.
     * @return {T}
     */
    loadS: <T>(path: string, hasComments?: boolean) => T;
    /**
     * saves JSON data to file sync.
     * @param {string} path path to save to.
     * @param {T} data data to save.
     * @return {void}
     */
    saveS: <T>(path: string, data: T) => void;
    /**
     * loads JSON from file.
     * @param {string} path path to load from.
     * @param {objectCallback<T>} callback callback to call.
     * @param {boolean} hasComments file to load has comments in json.
     * @return {Promise<T>}
     */
    load: <T>(path: string, callback?: objectCallback<T> | undefined, hasComments?: boolean) => Promise<T>;
    /**
     * saves JSON data to file.
     * @param {string} path path to save to.
     * @param {T} data data to save.
     * @param {voidCallback} callback callback to call.
     * @return {Promise<void>}
     */
    save: <T>(path: string, data: T, callback?: voidCallback | undefined) => Promise<void>;
    /**
     * loads JSON from file.
     * @param {string} path path to load from.
     * @param {objectCallback<T>} callback callback to call.
     * @param {boolean} hasComments file to load has comments in json.
     */
    loadW: <T>(path: string, callback?: objectCallback<T> | undefined, hasComments?: boolean) => Promise<T>;
    /**
     * saves JSON data to file.
     * @param {string} path path to save to.
     * @param {T} data data to save.
     * @param {voidCallback} callback callback to call.
     */
    saveW: <T>(path: string, data: T, callback?: voidCallback | undefined) => Promise<void>;
}
declare interface FileT {
    /**
     * loads string data from file.
     * @param {string} path path to load from.
     * @return {string}
     */
    loadS: (path: string) => string;
    /**
    * saves string to file.
    * @param {string} path path to save to.
    * @param {string} data data to save.
    * @return {void}
    */
    saveS: (path: string, data: string) => void;
    /**
    * loads string data from file.
    * @param {string} path path to load from.
    * @param {stringCallback} callback callback to call.
    * @return {Promise<string>}
    */
    load: (path: string, callback?: stringCallback | undefined) => Promise<string>;
    /**
     * saves string to file.
     * @param {string} path path to save to.
     * @param {string} data data to save.
     * @param {voidCallback} callback callback to call.
     * @return {Promise<void>}
     */
    save: (path: string, data: string, callback?: voidCallback | undefined) => Promise<void>;
    /**
     * loads string data from file.
     * @param {string} path path to load from.
     * @param {stringCallback} callback callback to call.
     */
    loadW: (path: string, callback?: stringCallback | undefined) => Promise<string>;
    /**
     * saves string to file.
     * @param {string} path path to save to.
     * @param {string} data data to save.
     * @param {voidCallback} callback callback to call.
     */
    saveW: (path: string, data: string, callback?: voidCallback | undefined) => Promise<void>;
}
declare interface DirT {
    /**
     * makes fs dir sync
     * @param {string} path path to dir
     * @return {void}
     */
    mkS: (path: string) => void;
    /**
     * removes fs dir sync
     * @param {string} path path to dir
     * @return {void}
     */
    rmS: (path: string) => void;
    /**
     * checks if dir exists sync.
     * @param {string} path path to dir.
     * @return {boolean}
     */
    checkS: (path: string) => boolean;
    /**
     * makes fs dir
     * @param {string} path path to dir
     * @param {voidCallback} callback callback to call.
     * @return {Promise<void>}
     */
    mk: (path: string, callback?: voidCallback | undefined) => Promise<void>;
    /**
     * removes fs dir
     * @param {string} path path to dir
     * @param {voidCallback} callback callback to call.
     * @return {Promise<void>}
     */
    rm: (path: string, callback?: voidCallback | undefined) => Promise<void>;
    /**
     * checks if dir exists.
     * @param {string} path path to dir.
     * @param {booleanCallback} callback callback to call.
     * @return {Promise<boolean>}
     */
    check: (path: string, callback?: booleanCallback | undefined) => Promise<boolean>;
}
declare interface BufT {
    /**
     * loads string data from file.
     * @param {string} path path to load from.
     * @param {objectCallback<Buffer>} callback callback to call.
     * @return {Promise<Buffer>}
     */
    load: (path: string, callback?: objectCallback<Buffer> | undefined) => Promise<Buffer>;
    /**
     * saves string to file.
     * @param {string} path path to save to.
     * @param {Buffer} data data to save.
     * @param {voidCallback} callback callback to call.
     * @return {Promise<void>}
     */
    save: (path: string, data: Buffer, callback?: voidCallback | undefined) => Promise<void>;
    /**
     * loads string data from file.
     * @param {string} path path to load from.
     * @param {objectCallback<Buffer>} callback callback to call.
     */
    loadW: (path: string, callback?: objectCallback<Buffer> | undefined) => Promise<Buffer>;
    /**
     * saves string to file.
     * @param {string} path path to save to.
     * @param {Buffer} data data to save.
     * @param {voidCallback} callback callback to call.
     */
    saveW: (path: string, data: Buffer, callback?: voidCallback | undefined) => Promise<void>;
}

declare interface MylasT extends FileT {
    json: JsonT;
    file: FileT;
    dir: DirT;
    buf: BufT;
}

declare const Mylas: MylasT;
declare const Json: JsonT;
declare const File: FileT;
declare const Dir: DirT;
declare const Buf: BufT;

export default Mylas;
export { Json, Dir, File, Buf };