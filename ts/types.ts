
export declare type voidCallback = () => void;

export declare type stringCallback = (arg0: string) => void;

export declare type objectCallback<T> = (arg0: T) => void;

export declare type booleanCallback = (arg0: boolean) => void;

export const enum Method {
    loadFile,
    saveFile,
    loadJson,
    loadJsonComments,
    saveJson,
    loadBuffer,
    saveBuffer,
}

export interface Request<T = unknown> {
    method: Method,
    path: string,
    data?: any, // eslint-disable-line @typescript-eslint/no-explicit-any
    callback?: objectCallback<T>,
}
