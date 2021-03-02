export declare type voidCallback = () => void;
export declare type stringCallback = (arg0: string) => void;
export declare type objectCallback<T> = (arg0: T) => void;
export declare type booleanCallback = (arg0: boolean) => void;
export enum Method {
    loadFile,
    saveFile,
    loadJson,
    saveJson,
}
export interface Request<T = unknown> {
    method: Method,
    path: string,
    data?: any, // eslint-disable-line @typescript-eslint/no-explicit-any
    callback?: objectCallback<T>,
}
declare global {
    interface JSON {
        loadS: <T>(path: string) => T;
        saveS: <T>(path: string, data: T) => void;
        load: <T>(path: string, callback?: objectCallback<T>) => Promise<T>;
        save: <T>(path: string, data: T, callback?: voidCallback) => Promise<void>;
        loadW: <T>(path: string, callback?: objectCallback<T>) => Promise<T>;
        saveW: <T>(path: string, data: T, callback?: voidCallback) => Promise<void>;
    }
    interface StringConstructor {
        loadS: (path: string) => string;
        saveS: (path: string, data: string) => void;
        load: (path: string, callback?: stringCallback) => Promise<string>;
        save: (path: string, data: string, callback?: voidCallback) => Promise<void>;
        loadW: (path: string, callback?: stringCallback) => Promise<string>;
        saveW: (path: string, data: string, callback?: voidCallback) => Promise<void>;
    }
    interface String {
        loadS: (path: string) => string;
        saveS: (path: string) => void;
        load: (path: string, callback?: stringCallback) => Promise<string>;
        save: (path: string, callback?: voidCallback) => Promise<void>;
        loadW: (path: string, callback?: stringCallback) => Promise<string>;
        saveW: (path: string, callback?: voidCallback) => Promise<void>;
    }
}