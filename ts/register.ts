import file from "./file";
import json from "./json";
import { voidCallback, stringCallback, objectCallback } from "./types";

// These types are here for tsc to compile.
// These types are in index.d.ts for release version.
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
        saveS: (path: string) => void;
        save: (path: string, callback?: voidCallback) => Promise<void>;
        saveW: (path: string, callback?: voidCallback) => Promise<void>;
    }
}

String.load = file.load;
String.save = file.save;
String.loadS = file.loadS;
String.saveS = file.saveS;
String.loadW = file.loadW;
String.saveW = file.saveW;
String.prototype.save = async function (path: string, callback?: voidCallback) {
    await file.save(path, String(this), callback);
};
String.prototype.saveS = function (path: string) {
    file.saveS(path, String(this));
};
String.prototype.saveW = async function (path: string, callback?: voidCallback) {
    await file.saveW(path, String(this), callback);
};
JSON.load = json.load;
JSON.save = json.save;
JSON.loadS = json.loadS;
JSON.saveS = json.saveS;
JSON.loadW = json.loadW;
JSON.saveW = json.saveW;

export { };
