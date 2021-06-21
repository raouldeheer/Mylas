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
<img src="https://raw.githubusercontent.com/raouldeheer/Mylas/HEAD/.github/logo.png" width="600"> 

## Installation
Install Mylas from NPM
```ts
npm i mylas
// Or
yarn add mylas
```

## Examples
Synchronous functions:
```ts
const Mylas = require("mylas");

// Save string to file
Mylas.saveS("./text.txt", "Hello world!");

// Load string from file
const loadedData = Mylas.loadS("./text.txt");

// Save JSON to file
JSON.saveS("./text.json", [{test: "Hello world"}]);

// Load JSON from file
const loadedJSON = JSON.loadS("./text.json");
```
[More examples](https://github.com/raouldeheer/Mylas/blob/main/.github/EXAMPLES.md)

## Features
All features are listed at the [Features page](https://github.com/raouldeheer/Mylas/blob/main/.github/FEATURES.md).  
More documentation at [mylas.js.org](https://mylas.js.org/)

## Contributing
We would love more contributors! To start contributing read our [Contributing page](https://github.com/raouldeheer/Mylas/blob/main/.github/CONTRIBUTING.md).  

## Supported Versions
Check for supported versions at the [security policy](https://github.com/raouldeheer/Mylas/security/policy).  
