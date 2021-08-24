import {
    objectCallback,
    voidCallback,
    Method,
} from "./types";
import file from "./file";
import action from "./workers/workerActions";

const json = {
    /**
     * loads JSON from file sync.
     * @param {string} path path to load from.
     * @param {boolean} hasComments file to load has comments in json.
     * @return {T}
     */
    loadS: <T>(
        path: string,
        hasComments = false
    ): T => JSON.parse(hasComments ?
        removeComments(file.loadS(path)) :
        file.loadS(path)),
    /**
     * saves JSON data to file sync.
     * @param {string} path path to save to.
     * @param {T} data data to save.
     * @return {void}
     */
    saveS: <T>(
        path: string,
        data: T
    ): void => file.saveS(path, JSON.stringify(data)),
    /**
     * loads JSON from file.
     * @param {string} path path to load from.
     * @param {objectCallback<T>} callback callback to call. 
     * @param {boolean} hasComments file to load has comments in json.
     * @return {Promise<T>}
     */
    load: async <T>(
        path: string,
        callback?: objectCallback<T>,
        hasComments = false
    ): Promise<T> => {
        const data: T = JSON.parse(hasComments ?
            removeComments(await file.load(path)) :
            await file.load(path));
        callback?.(data);
        return data;
    },
    /**
     * saves JSON data to file.
     * @param {string} path path to save to.
     * @param {T} data data to save.
     * @param {voidCallback} callback callback to call. 
     * @return {Promise<void>}
     */
    save: async <T>(
        path: string,
        data: T,
        callback?: voidCallback
    ): Promise<void> => {
        await file.save(path, JSON.stringify(data));
        callback?.();
    },
    /**
     * loads JSON from file.
     * @param {string} path path to load from.
     * @param {objectCallback<T>} callback callback to call. 
     * @param {boolean} hasComments file to load has comments in json.
     */
    loadW: <T>(
        path: string,
        callback?: objectCallback<T>,
        hasComments = false
    ): Promise<T> => action<T>({
        method: hasComments ? Method.loadJsonComments : Method.loadJson,
        path: path,
        callback: callback,
    }),
    /**
     * saves JSON data to file.
     * @param {string} path path to save to.
     * @param {T} data data to save.
     * @param {voidCallback} callback callback to call. 
     */
    saveW: <T>(
        path: string,
        data: T,
        callback?: voidCallback
    ): Promise<void> => action({
        method: Method.saveJson,
        path: path,
        data: data,
        callback: callback,
    }),
};
export default json;

function removeComments(jsonString: string): string {
    const isEscaped = (string: string, quotePosition: number) => {
        let index = quotePosition - 1;
        let backslashCount = 0;
        while (string[index] === '\\') {
            index--;
            backslashCount++;
        }
        return !(backslashCount % 2);
    };
    let isInsideString = false;
    let isInsideSComment = false;
    let isInsideMComment = false;
    let offset = 0;
    let result = '';

    for (let i = 0; i < jsonString.length; i++) {
        const currentCharacter = jsonString[i] || "";
        const nextCharacter = jsonString[i + 1] || "";
        const isInsideComment = (isInsideMComment || isInsideSComment);

        if (!isInsideComment && currentCharacter === '"' && isEscaped(jsonString, i)) isInsideString = !isInsideString;
        if (isInsideString) continue;

        if (!isInsideComment && currentCharacter + nextCharacter === '//') {
            result += jsonString.slice(offset, i);
            offset = i;
            isInsideSComment = true;
            i++;
        } else if (isInsideSComment && currentCharacter + nextCharacter === '\r\n') {
            i++;
            isInsideSComment = false;
            offset = i;
            continue;
        } else if (isInsideSComment && currentCharacter === '\n') {
            isInsideSComment = false;
            offset = i;
        } else if (!isInsideComment && currentCharacter + nextCharacter === '/*') {
            result += jsonString.slice(offset, i);
            offset = i;
            isInsideMComment = true;
            i++;
            continue;
        } else if (isInsideMComment && currentCharacter + nextCharacter === '*/') {
            i++;
            isInsideMComment = false;
            offset = i + 1;
            continue;
        }
    }
    return (result + ((isInsideMComment || isInsideSComment) ? '' : jsonString.slice(offset))).replace(/,(?!\s*?[{["'\w])/g, "");
}
