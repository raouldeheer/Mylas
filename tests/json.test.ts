import mylas, { Json } from "../ts/index";
import fs from "fs";

const testJson = [{ "Test": "Data" }];
const testJsonPath = "./tests/testdata.json";
const testJsonPathSync = "./tests/testfilesync.json";
const testJsonPathAsync = "./tests/testfileasync.json";

interface myobt {
    Test: string
}

beforeAll(() => {
    fs.writeFileSync(testJsonPath, JSON.stringify(testJson), "utf8");
});

afterAll(() => {
    fs.unlinkSync(testJsonPath);
});

/** Json tests */
describe("Save jsonfile to test folder", () => {
    it("Should save the jsondata to the filesystem", () => {
        mylas.json.saveS(testJsonPathSync, testJson);
        /** data should now be saved */
        const data = mylas.json.loadS(testJsonPathSync);
        fs.unlinkSync(testJsonPathSync)
        expect(data).toStrictEqual(testJson);
    })
    it("Should save the jsondata to the filesystem async", async () => {
        await mylas.json.save(testJsonPathAsync, testJson);
        /** data should now be saved */
        const data = await mylas.json.load(testJsonPathAsync);
        fs.unlinkSync(testJsonPathAsync)
        expect(data).toStrictEqual(testJson);
    })
    test("Should save the jsondata to the filesystem async with callback", done => {
        mylas.json.save(testJsonPathAsync, testJson, () => {
            /** data should now be saved */
            mylas.json.load(testJsonPathAsync, data => {
                fs.unlinkSync(testJsonPathAsync)
                expect(data).toStrictEqual(testJson);
                done();
            });
        });
    })
})
describe("Load jsonfile from test folder", () => {
    it("Should load the jsondata from the filesystem", () => {
        const data = mylas.json.loadS(testJsonPath);
        expect(data).toStrictEqual(testJson);
    })
    it("Should load the data from the filesystem async", async () => {
        const data = await mylas.json.load(testJsonPath);
        expect(data).toStrictEqual(testJson);
    })
    test("Should load the data from the filesystem async with callback", done => {
        mylas.json.load(testJsonPath, data => {
            expect(data).toStrictEqual(testJson);
            done();
        });
    })
})

describe("Save jsonfile to test folder using Json", () => {
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
    test("Should save the jsondata to the filesystem async with callback", done => {
        Json.save(testJsonPathAsync, testJson, () => {
            /** data should now be saved */
            Json.load(testJsonPathAsync, data => {
                fs.unlinkSync(testJsonPathAsync)
                expect(data).toStrictEqual(testJson);
                done();
            });
        });
    })
})
describe("Load jsonfile from test folder using Json", () => {
    it("Should load the jsondata from the filesystem", () => {
        const data = Json.loadS(testJsonPath);
        expect(data).toStrictEqual(testJson);
    })
    it("Should load the data from the filesystem async", async () => {
        const data = await Json.load<myobt[]>(testJsonPath);
        expect(data).toStrictEqual(testJson);
    })
    test("Should load the data from the filesystem async with callback", done => {
        Json.load(testJsonPath, data => {
            expect(data).toStrictEqual(testJson);
            done();
        });
    })
})