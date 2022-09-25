#!/usr/bin/env bash

rm -rf ./build
tsc --build ./config/tsconfig.json
tsup --config config/tsup.config.ts
cp ./ts/dts/* ./build
