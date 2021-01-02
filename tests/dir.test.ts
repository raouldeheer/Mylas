import mylas, { Dir } from "../ts/index";
import fs from "fs";



const testDataPathDir = "./tests/testdir/";
const testDataPathDirAsync = "./tests/testdirasync/";
const testDataPathDirSync = "./tests/testdirsync/";



describe("Make and remove dir on fs", () => {
    test("Should create and remove dir", done => {
        mylas.dir.mk(testDataPathDir, () => {
            expect(fs.existsSync(testDataPathDir)).toBeTruthy();
            mylas.dir.rm(testDataPathDir, () => {
                expect(fs.existsSync(testDataPathDir)).toBeFalsy();
                done();
            })
        })
    })
    it("Should create and remove dir", async () => {
        await mylas.dir.mk(testDataPathDirAsync);
        expect(fs.existsSync(testDataPathDirAsync)).toBeTruthy();
        await mylas.dir.rm(testDataPathDirAsync);
        expect(fs.existsSync(testDataPathDirAsync)).toBeFalsy();
    })
    it("Should create and remove dir", () => {
        mylas.dir.mkS(testDataPathDirSync)
        expect(fs.existsSync(testDataPathDirSync)).toBeTruthy();
        mylas.dir.rmS(testDataPathDirSync)
        expect(fs.existsSync(testDataPathDirSync)).toBeFalsy();
    })
})

describe("Make and remove dir on fs using Dir", () => {
    test("Should create and remove dir", done => {
        Dir.mk(testDataPathDir, () => {
            expect(fs.existsSync(testDataPathDir)).toBeTruthy();
            Dir.rm(testDataPathDir, () => {
                expect(fs.existsSync(testDataPathDir)).toBeFalsy();
                done();
            })
        })
    })
    it("Should create and remove dir", async () => {
        await Dir.mk(testDataPathDirAsync);
        expect(fs.existsSync(testDataPathDirAsync)).toBeTruthy();
        await Dir.rm(testDataPathDirAsync);
        expect(fs.existsSync(testDataPathDirAsync)).toBeFalsy();
    })
    it("Should create and remove dir", () => {
        Dir.mkS(testDataPathDirSync)
        expect(fs.existsSync(testDataPathDirSync)).toBeTruthy();
        Dir.rmS(testDataPathDirSync)
        expect(fs.existsSync(testDataPathDirSync)).toBeFalsy();
    })
})