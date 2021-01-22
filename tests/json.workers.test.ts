import {Json} from "../ts/index";
import fs from "fs";

const testData = [{ Test: "Data" }];
const testDataPath = "./tests/jsonworkertestdata.json";
const testDataPathAsync = "./tests/jsonworkertestfileasync.json";

beforeAll(() => {
    fs.writeFileSync(testDataPath, JSON.stringify(testData), "utf8");
});

afterAll(() => {
    fs.unlinkSync(testDataPath);
});

/** file tests */
describe("Save file to test folder", () => {
    it("Should save the data to the filesystem async", async () => {
        await Json.saveW(testDataPathAsync, testData);
        /** data should now be saved */
        const data = await Json.loadW(testDataPathAsync);
        fs.unlinkSync(testDataPathAsync);
        expect(data).toEqual(testData);
    })
    test("Should save the data to the filesystem async with callback", done => {
        Json.saveW(testDataPathAsync, testData, () => {
            /** data should now be saved */
            Json.loadW(testDataPathAsync, data => {
                fs.unlinkSync(testDataPathAsync)
                expect(data).toEqual(testData);
                done();
            });
        });
    })
})
describe("Load file from test folder", () => {
    it("Should load the data from the filesystem async", async () => {
        const data = await Json.loadW(testDataPath);
        expect(data).toEqual(testData);
    })
    test("Should load the data from the filesystem async with callback", done => {
        Json.loadW(testDataPath, data => {
            expect(data).toEqual(testData);
            done();
        });
    })
})
