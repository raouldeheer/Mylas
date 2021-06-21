import mylas from "../ts/index";
import fs from "fs";

const testData = Buffer.from("Test data");
const testDataPath = "./tests/buffertestdata.txt";
const testDataPathAsync = "./tests/buffertestfileasync.txt";

beforeAll(() => {
    fs.writeFileSync(testDataPath, testData, "utf8");
});

afterAll(() => {
    fs.unlinkSync(testDataPath);
});


/** file tests */
describe("Save file to test folder", () => {
    it("Should save the data to the filesystem async", async () => {
        await mylas.buf.saveW(testDataPathAsync, testData);
        /** data should now be saved */
        const data = await mylas.buf.loadW(testDataPathAsync);
        fs.unlinkSync(testDataPathAsync);
        expect(data).toStrictEqual(testData);
    });
    test("Should save the data to the filesystem async with callback", done => {
        mylas.buf.saveW(testDataPathAsync, testData, () => {
            /** data should now be saved */
            mylas.buf.loadW(testDataPathAsync, data => {
                fs.unlinkSync(testDataPathAsync);
                expect(data).toStrictEqual(testData);
                done();
            });
        });
    });
});
describe("Load file from test folder", () => {
    it("Should load the data from the filesystem async", async () => {
        const data = await mylas.buf.loadW(testDataPath);
        expect(data).toStrictEqual(testData);
    });
    test("Should load the data from the filesystem async with callback", done => {
        mylas.buf.loadW(testDataPath, data => {
            expect(data).toStrictEqual(testData);
            done();
        });
    });
});
