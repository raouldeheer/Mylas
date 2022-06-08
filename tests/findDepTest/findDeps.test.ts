import { Dir } from "../../build/index.js";

const testFunc = (testCases: any[]) => {
    testCases.forEach((v) => {
        it(`Should find ${v[0]} or more folders`, () => {
            expect(Dir.nodeModules(v[1]).length).toBeGreaterThanOrEqual(v[0]);
        });
    });
};

describe("Find node modules, string input", () => {
    testFunc([
        [1, null],
        [1, process.cwd() + "/tests/findDepTest"],
        [2, process.cwd() + "/tests/findDepTest/test_dir"],
        [3, process.cwd() + "/tests/findDepTest/test_dir/test_dir2"],
    ]);
});

describe("Find node modules, options absolute input", () => {
    testFunc([
        [1, { cwd: process.cwd(), relative: false }],
        [1, { cwd: process.cwd() + "/tests/findDepTest", relative: false }],
        [2, { cwd: process.cwd() + "/tests/findDepTest/test_dir", relative: false }],
        [3, { cwd: process.cwd() + "/tests/findDepTest/test_dir/test_dir2", relative: false }],
    ]);
});

describe("Find node modules, options relative input", () => {
    testFunc([
        [1, { cwd: process.cwd(), relative: true }],
        [1, { cwd: process.cwd() + "/tests/findDepTest", relative: true }],
        [2, { cwd: process.cwd() + "/tests/findDepTest/test_dir", relative: true }],
        [3, { cwd: process.cwd() + "/tests/findDepTest/test_dir/test_dir2", relative: true }],
    ]);
});

describe("Find node modules, options only cwd input", () => {
    testFunc([
        [1, { cwd: process.cwd() }],
        [1, { cwd: process.cwd() + "/tests/findDepTest" }],
        [2, { cwd: process.cwd() + "/tests/findDepTest/test_dir" }],
        [3, { cwd: process.cwd() + "/tests/findDepTest/test_dir/test_dir2" }],
    ]);
});

describe("Find node modules, options only relative input", () => {
    testFunc([
        [1, { relative: true }],
        [1, { relative: false }],
    ]);
});