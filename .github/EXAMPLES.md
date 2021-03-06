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