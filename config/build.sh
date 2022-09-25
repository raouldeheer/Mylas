#!/usr/bin/env bash

rm -rf ./build
tsc --build ./config/tsconfig.json
tsup --config config/tsup.config.ts
cp ./ts/index.d.ts ./build/index.d.ts
cp ./ts/register.d.ts ./build/register.d.ts
cp ./ts/interfaces.d.ts ./build/interfaces.d.ts
