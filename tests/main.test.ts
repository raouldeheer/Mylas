import mylas from "../build/index.js";
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
        mylas.saveS(testDataPathSync, testData);
        /** data should now be saved */
        const data = mylas.loadS(testDataPathSync);
        fs.unlinkSync(testDataPathSync);
        expect(data).toStrictEqual(testData);
    });
    it("Should save the data to the filesystem async", async () => {
        await mylas.save(testDataPathAsync, testData);
        /** data should now be saved */
        const data = await mylas.load(testDataPathAsync);
        fs.unlinkSync(testDataPathAsync);
        expect(data).toStrictEqual(testData);
    });
    test("Should save the data to the filesystem async with callback", done => {
        mylas.save(testDataPathAsync, testData, () => {
            /** data should now be saved */
            mylas.load(testDataPathAsync, data => {
                fs.unlinkSync(testDataPathAsync);
                expect(data).toStrictEqual(testData);
                done();
            });
        });
    });
});
describe("Load file from test folder", () => {
    it("Should load the data from the filesystem", () => {
        const data = mylas.loadS(testDataPath);
        expect(data).toStrictEqual(testData);
    });
    it("Should load the data from the filesystem async", async () => {
        const data = await mylas.load(testDataPath);
        expect(data).toStrictEqual(testData);
    });
    test("Should load the data from the filesystem async with callback", done => {
        mylas.load(testDataPath, data => {
            expect(data).toStrictEqual(testData);
            done();
        });
    });
});
