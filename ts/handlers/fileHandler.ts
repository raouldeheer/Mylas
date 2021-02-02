import { file } from "../async/asyncHandlers";
import { fileS } from "../sync/syncHandlers";
import {
    loadFile as loadW,
    saveFile as saveW,
} from "../workers/workerActions";

const { load, save } = file;
const { loadS, saveS } = fileS;

export default {
    loadS,
    saveS,
    load,
    save,
    loadW,
    saveW,
};