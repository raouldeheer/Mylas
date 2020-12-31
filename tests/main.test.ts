import mylas from "../ts/index";
import fs from "fs";

const testData = "Test data";
const testDataPath = "./tests/testdata.txt";
const testDataPathSync = "./tests/testfilesync.txt";
const testDataPathAsync = "./tests/testfileasync.txt";

beforeAll(() => {
    fs.writeFileSync(testDataPath, testData, "utf8");
});

afterAll(() => {
    fs.unlinkSync(testDataPath);
});

/** file tests */
describe("Save file to test folder", () => {
    it("Should save the data to the filesystem", () => {
        mylas.saveSync(testDataPathSync, testData);
        /** data should now be saved */
        const data = mylas.loadSync(testDataPathSync);
        fs.unlinkSync(testDataPathSync)
        expect(data).toStrictEqual(testData);
    })
    it("Should save the data to the filesystem async", async () => {
        await mylas.save(testDataPathAsync, testData);
        /** data should now be saved */
        const data = await mylas.load(testDataPathAsync);
        fs.unlinkSync(testDataPathAsync)
        expect(data).toStrictEqual(testData);
    })
})
describe("Load file from test folder", () => {
    it("Should load the data from the filesystem", () => {
        const data = mylas.loadSync(testDataPath);
        expect(data).toStrictEqual(testData);
    })
    it("Should load the data from the filesystem async", async () => {
        const data = await mylas.load(testDataPath);
        expect(data).toStrictEqual(testData);
    })
})