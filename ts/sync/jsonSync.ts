export default {
    /**
    * loads JSON from file sync.
    * @param {string} path path to load from.
    * @return {T}
    */
    loadS: <T>(
        path: string,
        hasComments = false
    ): T => JSON.parse(hasComments? removeComments(String.loadS(path)): String.loadS(path)),
    /**
     * saves JSON data to file sync.
     * @param {string} path path to save to.
     * @param {T} data data to save.
     * @return {void}
     */
    saveS: <T>(
        path: string,
        data: T
    ): void => String.saveS(path, JSON.stringify(data)),
};

export function removeComments(jsonString: string): string {
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