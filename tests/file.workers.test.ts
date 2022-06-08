import mylas from "../build/index.js";
import fs from "fs";

const testData = "Test data";
const testDataPath = "./tests/fileworkertestdata.txt";
const testDataPathAsync = "./tests/fileworkertestfileasync.txt";

beforeAll(() => {
    fs.writeFileSync(testDataPath, testData, "utf8");
});

afterAll(() => {
    fs.unlinkSync(testDataPath);
});

/** file tests */
describe("Save file to test folder", () => {
    it("Should save the data to the filesystem async", async () => {
        await mylas.file.saveW(testDataPathAsync, testData);
        /** data should now be saved */
        const data = await mylas.file.loadW(testDataPathAsync);
        fs.unlinkSync(testDataPathAsync);
        expect(data).toStrictEqual(testData);
    });
    test("Should save the data to the filesystem async with callback", done => {
        mylas.file.saveW(testDataPathAsync, testData, () => {
            /** data should now be saved */
            mylas.file.loadW(testDataPathAsync, data => {
                fs.unlinkSync(testDataPathAsync);
                expect(data).toStrictEqual(testData);
                done();
            });
        });
    });
});
describe("Load file from test folder", () => {
    it("Should load the data from the filesystem async", async () => {
        const data = await mylas.file.loadW(testDataPath);
        expect(data).toStrictEqual(testData);
    });
    test("Should load the data from the filesystem async with callback", done => {
        mylas.file.loadW(testDataPath, data => {
            expect(data).toStrictEqual(testData);
            done();
        });
    });
});
