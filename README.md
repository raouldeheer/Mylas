# Mylas 
![npm](https://img.shields.io/npm/dt/mylas)
![install size](https://badgen.net/packagephobia/install/mylas)
![npm bundle size (scoped)](https://img.shields.io/bundlephobia/min/mylas)
![npm bundle size (scoped)](https://img.shields.io/bundlephobia/minzip/mylas)
![dependencie count](https://img.shields.io/badge/dependencies-0-brightgreen)
![GitHub](https://img.shields.io/github/license/raouldeheer/Mylas)
![npm (scoped)](https://img.shields.io/npm/v/mylas)
![GitHub package.json version](https://img.shields.io/github/package-json/v/raouldeheer/Mylas)
![node-current (scoped)](https://img.shields.io/node/v/mylas)
![node-lts (scoped)](https://img.shields.io/node/v-lts/mylas)   
Mylas is a npm package that makes the loading and storing of data from fs easy and reliable. And it supports multithreading.   
<img src="./.github/logo.png" width="600"> 

## Installation
Install Mylas from NPM
```
npm i mylas
//Or
yarn add mylas
```

## Examples
Synchronous functions:
```
const Mylas = require("mylas");

//Save string to file
Mylas.saveS("./text.txt", "Hello world!");

//Load string from file
const loadedData = Mylas.loadS("./text.txt");

//Save JSON to file
JSON.saveS("./text.json", [{test: "Hello world"}]);

//Load JSON from file
const loadedJSON = JSON.loadS("./text.json");
```
ASync, Promises & Callback:
```
const Mylas = require("mylas");

//Save string to file async
await Mylas.save("./text.txt", "Hello world!", () => {console.log("Saved!")});

//Load string from file async
const loadedData = await Mylas.load("./text.txt", (data) => {console.log(`Loaded: ${data}`)});

//Save JSON to file async
await JSON.save("./text.json", [{test: "Hello world"}], () => {console.log("Saved!")});

//Load JSON from file async
const loadedJSON = await JSON.load("./text.json", (data) => {console.log(`Loaded: ${data}`)});
```
Multithreaded / Worker:
```
const Mylas = require("mylas");

//Save string to file with worker
await Mylas.saveW("./text.txt", "Hello world!", () => {console.log("Saved!")});

//Load string from file with worker
const loadedData = await Mylas.loadW("./text.txt", (data) => {console.log(`Loaded: ${data}`)});

//Save JSON to file with worker
await JSON.saveW("./text.json", [{test: "Hello world"}], () => {console.log("Saved!")});

//Load JSON from file with worker
const loadedJSON = await JSON.loadW("./text.json", (data) => {console.log(`Loaded: ${data}`)});
```

## Features
All features are listed at the [Features page](https://github.com/raouldeheer/Mylas/blob/main/.github/FEATURES.md).  

## Contributing
To start contributing read our [Contributing page](https://github.com/raouldeheer/Mylas/blob/main/.github/CONTRIBUTING.md).  

## Supported Versions
Check for supported versions at the [security policy](https://github.com/raouldeheer/Mylas/security/policy).  
