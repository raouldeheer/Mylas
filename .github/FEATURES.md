## Features

### File
- Mylas.load: Loads file from fs returns a string promise or calls callback. (async)
- Mylas.loadW: Loads file from fs returns a string promise or calls callback. (multithreaded/worker)
- Mylas.loadS: Loads file from fs returns a string. (sync)
- Mylas.save: Saves file to fs returns void promise or calls callback. (async)
- Mylas.saveW: Saves file to fs returns void promise or calls callback. (multithreaded/worker)
- Mylas.saveS: Saves file to fs returns void. (sync)
- Mylas.file or import {file}: functions above.

### Json
- Mylas.json.load: Loads JSON from fs returns json promise or calls callback. (async)
- Mylas.json.loadW: Loads JSON from fs returns json promise or calls callback. (multithreaded/worker)
- Mylas.json.loadS: Loads JSON from fs returns json. (sync)
- Mylas.json.save: Saves JSON to fs returns void promise or calls callback. (async)
- Mylas.json.saveW: Saves JSON to fs returns void promise or calls callback. (multithreaded/worker)
- Mylas.json.savesS: Saves JSON to fs returns void. (sync)
- import {json}: functions above.

### Dir
- Mylas.dir.mk: Makes dir in fs returns void promise or calls callback. (async)
- Mylas.dir.mkS: Makes dir in fs returns void. (sync)
- Mylas.dir.rm: Removes dir in fs returns void promise or calls callback. (async)
- Mylas.dir.rmS: Removes dir in fs returns void. (sync)
- Mylas.dir.check: Checks if dir exists in fs returns boolean promise or call callback. (async)
- Mylas.dir.checkS: Checks if dir exists in fs returns boolean. (sync)
