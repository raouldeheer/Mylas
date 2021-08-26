#!/usr/bin/env bash

tsc --build ./config/tsconfig.json
cp ./ts/index.d.ts ./build/index.d.ts