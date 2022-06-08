import fs from "fs";
import path from "path";
import os from "os";

export default function (input?: { cwd?: string; relative?: boolean; } | string): string[] {
    const opts = {
        cwd: process.cwd(),
        relative: true,
        ...(typeof input === "string" ? { cwd: input } : input),
    };
    const results = [];
    let schDr = opts.cwd;
    let modDr: string | null;
    let df = false;
    do {
        if (schDr.charAt(0) === "~") schDr = tilde(schDr);
        if (schDr.charAt(0) === "@") schDr = path.join(gm || (gm = isWin ?
            path.resolve(prefix || (prefix = getPrefix()), "node_modules") :
            path.resolve(prefix || (prefix = getPrefix()), "lib/node_modules")), schDr.slice(1));
        modDr = lookup(schDr);
        if (modDr) {
            const fmd = opts.relative ? path.relative(opts.cwd, modDr) : modDr;
            df = results.indexOf(fmd) > -1;
            if (!df) {
                results.push(fmd);
                schDr = path.join(modDr, "../../");
            }
        }
    } while (modDr && !df);
    return results;
}

function lookup(cwd: string): string | null {
    const fp = path.resolve(cwd, "node_modules");
    const res = fs.existsSync(fp) ? path.resolve(fp) : null;
    if (res) return res;
    const dir = path.dirname(cwd);
    return dir === cwd ? null : lookup(dir);
}

let gm: string;
let prefix: string;

function getPrefix(): string {
    if (process.env.PREFIX) {
        prefix = process.env.PREFIX;
    } else {
        prefix = confPath(path.resolve(os.homedir(), ".npmrc"));
        if (!prefix) {
            try {
                prefix = confPath(path.resolve(file(), "..", "..", "npmrc"));
                if (prefix) prefix = confPath(path.resolve(prefix, "etc", "npmrc")) || prefix;
            } catch (_) { /* Do nothing */ }
            if (!prefix) {
                if (isWin) {
                    prefix = process.env.APPDATA
                        ? path.join(process.env.APPDATA, "npm")
                        : path.dirname(process.execPath);
                } else {
                    prefix = path.dirname(path.dirname(process.execPath));
                    if (process.env.DESTDIR) prefix = path.join(process.env.DESTDIR, prefix);
                }
            }
        }
    }
    return prefix ? tilde(prefix) : "";
}

function confPath(configPath: string) {
    try { return inip(fs.readFileSync(configPath, "utf-8"))?.prefix; }
    catch (err) { return null; }
}

function inip(str: string) {
    const out = Object.create(null);
    let p = out;
    let section = null;
    for (const line of str.split(/[\r\n]+/g)) {
        if (!line || line.match(/^\s*[;#]/)) continue;
        const match = line.match(/^\[([^\]]*)\]$|^([^=]+)(=(.*))?$/i);
        if (!match) continue;
        if (match[1] !== undefined) {
            section = decode(match[1]);
            if (section === "__proto__") {
                p = Object.create(null);
                continue;
            }
            p = out[section] = out[section] || Object.create(null);
            continue;
        }
        const keyRaw = decode(match[2] || "");
        const isArray = keyRaw.length > 2 && keyRaw.slice(-2) === "[]";
        const key = isArray ? keyRaw.slice(0, -2) : keyRaw;
        if (key === "__proto__")
            continue;
        const valueRaw = match[3] ? decode(match[4] || "") : true;
        const value = valueRaw === "true"
            || valueRaw === "false"
            || valueRaw === "null"
            ? JSON.parse(valueRaw)
            : valueRaw;
        if (isArray) {
            if (!Object.hasOwnProperty.call(p, key)) p[key] = [];
            else if (!Array.isArray(p[key])) p[key] = [p[key]];
        }
        if (Array.isArray(p[key])) p[key].push(value);
        else p[key] = value;
    }
    const remove = [];
    for (const j of Object.keys(out)) {
        if (!Object.hasOwnProperty.call(out, j) || typeof out[j] !== 'object' || Array.isArray(out[j])) continue;
        const parts = j.replace(/\1/g, '\u0002LITERAL\\1LITERAL\u0002').replace(/\\\./g, '\u0001').split(/\./)
            .map(part => part.replace(/\1/g, '\\.').replace(/\2LITERAL\\1LITERAL\2/g, '\u0001'));
        let p = out;
        const l = parts.pop() || "";
        const nl = l.replace(/\\\./g, '.');
        for (const part of parts) {
            if (part === '__proto__') continue;
            if (!Object.hasOwnProperty.call(p, part) || typeof p[part] !== 'object')
                p[part] = Object.create(null);
            p = p[part];
        }
        if (p === out && nl === l) continue;
        p[nl] = out[j];
        remove.push(j);
    }
    remove.forEach(d => delete out[d]);
    return out;
}

function decode(str: string) {
    str = str.trim();
    const c1 = str.charAt(0), c2 = str.charAt(str.length - 1);
    if ((c1 === "\"" && c2 === "\"") || (c1 === "'" && c2 === "'")) {
        str = c1 === "'" ? str.substr(1, str.length - 2) : str;
        try { return JSON.parse(str); } catch (_) { /* Do nothing */ }
    } else {
        let esc = false, unesc = "";
        for (let i = 0; i < str.length; i++) {
            const c = str.charAt(i);
            if (esc) {
                if ("\\;#".indexOf(c) !== -1) unesc += c;
                else unesc += "\\" + c;
                esc = false;
            } else if (";#".indexOf(c) !== -1) break;
            else if (c === "\\") esc = true;
            else unesc += c;
        }
        if (esc) unesc += "\\";
        return unesc.trim();
    }
    return str;
}

const tilde = (fp: string) => fp.charAt(0) === "~" ?
    fp.charAt(1) === "+" ? path.join(process.cwd(), fp.slice(2)) :
        path.join(os.homedir(), fp.slice(1)) : fp;

const isWin = process.platform === "win32" ||
    process.env.OSTYPE === "cygwin" ||
    process.env.OSTYPE === "msys";

function file(): string {
    const env = (process.env.PATH || "").split(isWin ? ";" : ":");
    let ext = [""];
    if (isWin) {
        env.unshift(process.cwd());
        ext = (process.env.PATHEXT || ".EXE;.CMD;.BAT;.COM").split(";");
    }
    for (const envi of env) {
        const part = path.join(
            (envi.charAt(0) === "\"" && envi.slice(-1) === "\"")
                ? envi.slice(1, -1)
                : envi,
            "npm");
        for (const exti of ext)
            if (isexesync(part + exti)) return fs.realpathSync(part + exti);
    }
    throw new Error("Can't find npm file");
}

function isexesync(path: string) {
    try {
        return (isWin ? (path: string) => {
            const stat = fs.statSync(path);
            if (!stat.isSymbolicLink() && !stat.isFile()) return false;
            if (!process.env.PATHEXT) return true;
            const pathext = process.env.PATHEXT.split(";");
            if (pathext.indexOf("") !== -1) return true;
            for (const pathexti of pathext) {
                const p = pathexti.toLowerCase();
                if (p && path.substr(-p.length).toLowerCase() === p) return true;
            }
            return false;
        } : (path: string) => {
            const { mode, gid, uid, isFile } = fs.statSync(path);
            return (isFile() && (
                (mode & 1) ||
                (mode & 2) && gid === process.getgid!() ||
                (mode & 4) && uid === process.getuid!() ||
                (mode & 6) && process.getuid!() === 0
            ));
        })(path);
    } catch (_) { return false; }
}
