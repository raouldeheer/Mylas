import mylas, { Dir } from "../build/index.js";
import fs from "fs";

const testDataPathDir = "./tests/testdir/";
const testDataPathDirAsync = "./tests/testdirasync/";
const testDataPathDirSync = "./tests/testdirsync/";
const testDataPathDir2 = "./tests/testdir2/";
const testDataPathDirAsync2 = "./tests/testdirasync2/";
const testDataPathDirSync2 = "./tests/testdirsync2/";

describe("Make and remove dir on fs", () => {
    test("Should create and remove dir", done => {
        mylas.dir.mk(testDataPathDir, () => {
            expect(fs.existsSync(testDataPathDir)).toBeTruthy();
            mylas.dir.check(testDataPathDir, (result) => {
                expect(result).toBeTruthy();
                mylas.dir.rm(testDataPathDir, () => {
                    expect(fs.existsSync(testDataPathDir)).toBeFalsy();
                    mylas.dir.check(testDataPathDir, (result2) => {
                        expect(result2).toBeFalsy();
                        done();
                    });
                });
            });

        });
    });
    it("Should create and remove dir", async () => {
        await mylas.dir.mk(testDataPathDirAsync);
        expect(fs.existsSync(testDataPathDirAsync)).toBeTruthy();
        expect(await mylas.dir.check(testDataPathDirAsync)).toBeTruthy();
        await mylas.dir.rm(testDataPathDirAsync);
        expect(fs.existsSync(testDataPathDirAsync)).toBeFalsy();
        expect(await mylas.dir.check(testDataPathDirAsync)).toBeFalsy();
    });
    it("Should create and remove dir", () => {
        mylas.dir.mkS(testDataPathDirSync);
        expect(fs.existsSync(testDataPathDirSync)).toBeTruthy();
        expect(mylas.dir.checkS(testDataPathDirSync)).toBeTruthy();
        mylas.dir.rmS(testDataPathDirSync);
        expect(fs.existsSync(testDataPathDirSync)).toBeFalsy();
        expect(mylas.dir.checkS(testDataPathDirSync)).toBeFalsy();
    });
});

describe("Make and remove dir on fs", () => {
    test("Should create and remove dir", done => {
        Dir.mk(testDataPathDir2, () => {
            expect(fs.existsSync(testDataPathDir2)).toBeTruthy();
            Dir.check(testDataPathDir2, (result) => {
                expect(result).toBeTruthy();
                Dir.rm(testDataPathDir2, () => {
                    expect(fs.existsSync(testDataPathDir2)).toBeFalsy();
                    Dir.check(testDataPathDir2, (result2) => {
                        expect(result2).toBeFalsy();
                        done();
                    });
                });
            });

        });
    });
    it("Should create and remove dir", async () => {
        await Dir.mk(testDataPathDirAsync2);
        expect(fs.existsSync(testDataPathDirAsync2)).toBeTruthy();
        expect(await Dir.check(testDataPathDirAsync2)).toBeTruthy();
        await Dir.rm(testDataPathDirAsync2);
        expect(fs.existsSync(testDataPathDirAsync2)).toBeFalsy();
        expect(await Dir.check(testDataPathDirAsync2)).toBeFalsy();
    });
    it("Should create and remove dir", () => {
        Dir.mkS(testDataPathDirSync2);
        expect(fs.existsSync(testDataPathDirSync2)).toBeTruthy();
        expect(Dir.checkS(testDataPathDirSync2)).toBeTruthy();
        Dir.rmS(testDataPathDirSync2);
        expect(fs.existsSync(testDataPathDirSync2)).toBeFalsy();
        expect(Dir.checkS(testDataPathDirSync2)).toBeFalsy();
    });
});
