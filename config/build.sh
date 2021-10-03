#!/usr/bin/env bash

rm -rf ./build
tsc --build ./config/tsconfig.json
mkdir build
tsup temp/index.js --format cjs --minify
mv ./dist/* ./build
mv ./temp/worker.js ./build
cp ./ts/index.d.ts ./build/index.d.ts
rm -rf ./temp
rm -rf ./dist
