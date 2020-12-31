import { Json } from "../ts/index";
import fs from "fs";

const testJson = [{ "Test": "Data" }];
const testJsonPath = "./tests/testdata.json";
const testJsonPathSync = "./tests/testfilesync.txt";
const testJsonPathAsync = "./tests/testfileasync.txt";

beforeAll(() => {
    fs.writeFileSync(testJsonPath, JSON.stringify(testJson), "utf8");
});

afterAll(() => {
    fs.unlinkSync(testJsonPath);
});

/** Json tests */
describe("Save jsonfile to test folder", () => {
    it("Should save the jsondata to the filesystem", () => {
        Json.saveS(testJsonPathSync, testJson);
        /** data should now be saved */
        const data = Json.loadS(testJsonPathSync);
        fs.unlinkSync(testJsonPathSync)
        expect(data).toStrictEqual(testJson);
    })
    it("Should save the jsondata to the filesystem async", async () => {
        await Json.save(testJsonPathAsync, testJson);
        /** data should now be saved */
        const data = await Json.load(testJsonPathAsync);
        fs.unlinkSync(testJsonPathAsync)
        expect(data).toStrictEqual(testJson);
    })
})
describe("Load jsonfile from test folder", () => {
    it("Should load the jsondata from the filesystem", () => {
        const data = Json.loadS(testJsonPath);
        expect(data).toStrictEqual(testJson);
    })
    it("Should load the data from the filesystem async", async () => {
        const data = await Json.load(testJsonPath);
        expect(data).toStrictEqual(testJson);
    })
})