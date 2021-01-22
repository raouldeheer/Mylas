import { json } from "../async/asyncHandlers";
import { jsonS } from "../sync/syncHandlers";
import {
    loadJson as loadW,
    saveJson as saveW,
} from "../workers/workerHandlers";

const { load, save } = json;
const { loadS, saveS } = jsonS;

export default {
    loadS,
    saveS,
    load,
    save,
    loadW,
    saveW,
};