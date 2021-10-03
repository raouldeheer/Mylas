/** @internal */
export declare type voidCallback = () => void;
/** @internal */
export declare type stringCallback = (arg0: string) => void;
/** @internal */
export declare type objectCallback<T> = (arg0: T) => void;
/** @internal */
export declare type booleanCallback = (arg0: boolean) => void;
/** @internal */
export enum Method {
    loadFile,
    saveFile,
    loadJson,
    loadJsonComments,
    saveJson,
    loadBuffer,
    saveBuffer,
}
/** @internal */
export interface Request<T = unknown> {
    method: Method,
    path: string,
    data?: any, // eslint-disable-line @typescript-eslint/no-explicit-any
    callback?: objectCallback<T>,
}
