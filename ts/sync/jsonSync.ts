export default {
    /**
    * loads JSON from file sync.
    * @param {string} path path to load from.
    * @return {T}
    */
    loadS: <T>(
        path: string
    ): T => JSON.parse(String.loadS(path)),
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
}