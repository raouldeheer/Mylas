## Features

### File
- Mylas.load: Loads file from fs returns a string promise and calls callback. (async)
- Mylas.loadW: Loads file from fs returns a string promise and calls callback. (multithreaded/worker)
- Mylas.loadS: Loads file from fs returns a string. (sync)
- Mylas.save: Saves file to fs returns void promise and calls callback. (async)
- Mylas.saveW: Saves file to fs returns void promise and calls callback. (multithreaded/worker)
- Mylas.saveS: Saves file to fs returns void. (sync)  

Import Mylas: Mylas.file.* functions above.  
Import { File }: File.* functions above.  
String.* functions above.  

### Json
- JSON.load: Loads JSON from fs returns json promise and calls callback. (async)
- JSON.loadW: Loads JSON from fs returns json promise and calls callback. (multithreaded/worker)
- JSON.loadS: Loads JSON from fs returns json. (sync)
- JSON.save: Saves JSON to fs returns void promise and calls callback. (async)
- JSON.saveW: Saves JSON to fs returns void promise and calls callback. (multithreaded/worker)
- JSON.savesS: Saves JSON to fs returns void. (sync)

Import Mylas: Mylas.json.* functions above.  
Import { Json }: Json.* functions above.  

### Dir
- Mylas.dir.mk: Makes dir in fs returns void promise and calls callback. (async)
- Mylas.dir.mkS: Makes dir in fs returns void. (sync)
- Mylas.dir.rm: Removes dir in fs returns void promise and calls callback. (async)
- Mylas.dir.rmS: Removes dir in fs returns void. (sync)
- Mylas.dir.check: Checks if dir exists in fs returns boolean promise or call callback. (async)
- Mylas.dir.checkS: Checks if dir exists in fs returns boolean. (sync)

Import { Dir }: Dir.* functions above.   

### Buf
 - Mylas.buf.loadW Loads file from fs returns a buffer promise and calls callback. (multithreaded/worker)
 - Mylas.buf.saveW Saves buffer to file returns void promise and calls callback. (multithreaded/worker)
 
Import { Buf }: Buf.* functions above.
