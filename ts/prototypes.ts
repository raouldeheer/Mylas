import jsonAsync from "./async/jsonAsync";
import jsonSync from "./sync/jsonSync";
import fileAsync from "./async/fileAsync";
import fileSync from "./sync/fileSync";
import {
    jsonWorker,
    fileWorker,
} from "./workers/workerActions";
import { voidCallback } from "./types";

String.load = fileAsync.load;
String.save = fileAsync.save;
String.prototype.save = async (path: string, callback?: voidCallback) =>
    await fileAsync.save(path, String(this), callback);
String.loadS = fileSync.loadS;
String.saveS = fileSync.saveS;
String.prototype.saveS = (path: string) => fileSync.saveS(path, String(this));
JSON.load = jsonAsync.load;
JSON.save = jsonAsync.save;
JSON.loadS = jsonSync.loadS;
JSON.saveS = jsonSync.saveS;
JSON.loadW = jsonWorker.loadW;
JSON.saveW = jsonWorker.saveW;
String.loadW = fileWorker.loadW;
String.saveW = fileWorker.saveW;
String.prototype.saveW = async (path: string, callback?: voidCallback) =>
    await fileWorker.saveW(path, String(this), callback);