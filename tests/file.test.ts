import { File } from "../build/index.js";
import fs from "fs";

const testData = "Test data";
const testDataPath = "./tests/filetestdata.txt";
const testDataPathSync = "./tests/filetestfilesync.txt";
const testDataPathAsync = "./tests/filetestfileasync.txt";

beforeAll(() => {
    fs.writeFileSync(testDataPath, testData, "utf8");
});

afterAll(() => {
    fs.unlinkSync(testDataPath);
});

/** file tests */
describe("Save file to test folder", () => {
    it("Should save the data to the filesystem", () => {
        File.saveS(testDataPathSync, testData);
        /** data should now be saved */
        const data = File.loadS(testDataPathSync);
        fs.unlinkSync(testDataPathSync);
        expect(data).toStrictEqual(testData);
    });
    it("Should save the data to the filesystem async", async () => {
        await File.save(testDataPathAsync, testData);
        /** data should now be saved */
        const data = await File.load(testDataPathAsync);
        fs.unlinkSync(testDataPathAsync);
        expect(data).toStrictEqual(testData);
    });
    test("Should save the data to the filesystem async with callback", done => {
        File.save(testDataPathAsync, testData, () => {
            /** data should now be saved */
            File.load(testDataPathAsync, data => {
                fs.unlinkSync(testDataPathAsync);
                expect(data).toStrictEqual(testData);
                done();
            });
        });
    });
});
describe("Load file from test folder", () => {
    it("Should load the data from the filesystem", () => {
        const data = File.loadS(testDataPath);
        expect(data).toStrictEqual(testData);
    });
    it("Should load the data from the filesystem async", async () => {
        const data = await File.load(testDataPath);
        expect(data).toStrictEqual(testData);
    });
    test("Should load the data from the filesystem async with callback", done => {
        File.load(testDataPath, data => {
            expect(data).toStrictEqual(testData);
            done();
        });
    });
});
