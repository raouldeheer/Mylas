import { file } from "./file";
import { json } from "./json";
import { voidCallback } from "./types";

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
