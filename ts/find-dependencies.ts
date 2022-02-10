/* eslint-disable @typescript-eslint/no-non-null-assertion */
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
        if (schDr.charAt(0) === "@") schDr = path.join(GPath(), schDr.slice(1));
        modDr = lookup(schDr)
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
        prefix = tConfP(path.resolve(os.homedir(), ".npmrc"));
        if (!prefix) {
            try {
                prefix = tConfP(path.resolve(fs.realpathSync(file("npm")), "..", "..", "npmrc"));
                if (prefix) prefix = tConfP(path.resolve(prefix, "etc", "npmrc")) || prefix;
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

function tConfP(configPath: string) {
    try { return inip(fs.readFileSync(configPath, "utf-8"))?.prefix; }
    catch (err) { return null; }
}

const GPath = () => gm || (gm = isWin ?
    path.resolve(Prefix(), "node_modules") :
    path.resolve(Prefix(), "lib/node_modules"));
const Prefix = () => prefix || (prefix = getPrefix());

function inip(str: string) {
    // eslint-disable-next-line
    const out: any = {};
    let p = out;
    let section = null;
    str.split(/[\r\n]+/g).forEach(line => {
        if (!line || line.match(/^\s*[;#]/)) return;
        const match = line.match(/^\[([^\]]*)\]$|^([^=]+)(=(.*))?$/i);
        if (!match) return;
        if (match[1] !== undefined) {
            section = decode(match[1]);
            if (section === "__proto__") {
                p = {};
                return;
            }
            p = out[section] = out[section] || {};
            return;
        }
        let key = decode(match[2]!);
        if (key === "__proto__") return;
        let value = match[3] ? decode(match[4]!) : true;
        if (["true", "false", "null"].includes(value as string)) value = JSON.parse(value as string);
        if (key.length > 2 && key.slice(-2) === "[]") {
            key = key.substring(0, key.length - 2);
            if (key === "__proto__") return;
            if (!p[key]) p[key] = [];
            else if (!Array.isArray(p[key])) p[key] = [p[key]];
        }
        if (Array.isArray(p[key])) p[key].push(value);
        else p[key] = value;
    });
    Object.keys(out).filter(k => {
        if (!out[k] ||
            typeof out[k] !== "object" ||
            Array.isArray(out[k]))
            return false;
        const parts = k.replace(/\1/g, "\u0002LITERAL\\1LITERAL\u0002")
            .replace(/\\\./g, "\u0001")
            .split(/\./).map(part => part.replace(/\1/g, "\\.")
                .replace(/\2LITERAL\\1LITERAL\2/g, "\u0001"));
        let p = out;
        const l = parts.pop() || "";
        const nl = l.replace(/\\\./g, ".");
        parts.forEach(part => {
            if (part === "__proto__") return;
            if (!p[part] || typeof p[part] !== "object") p[part] = {};
            p = p[part];
        });
        if (p === out && nl === l) return false;
        p[nl] = out[k];
        return true;
    }).forEach(del => delete out[del]);
    return out;
}

function decode(val: string) {
    val = (val || "").trim();
    if ((val.charAt(0) === "\"" && val.slice(-1) === "\"") ||
        (val.charAt(0) === "'" && val.slice(-1) === "'")) {
        if (val.charAt(0) === "'") val = val.substr(1, val.length - 2);
        try { val = JSON.parse(val); } catch (_) { /* Do nothing */ }
    } else {
        let esc = false;
        let unesc = "";
        for (let i = 0, l = val.length; i < l; i++) {
            const c = val.charAt(i);
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
    return val;
}

const tilde = (fp: string) => fp.charCodeAt(0) === 126 ?
    fp.charCodeAt(1) === 43 ? path.join(process.cwd(), fp.slice(2)) :
        path.join(os.homedir(), fp.slice(1)) : fp;

const isWin = process.platform === "win32" ||
    process.env.OSTYPE === "cygwin" ||
    process.env.OSTYPE === "msys";
const colon = isWin ? ";" : ":";

function file(cmd: string): string {
    let env = (process.env.PATH || "").split(colon);
    let ext = [""];
    if (isWin) {
        env.unshift(process.cwd());
        ext = (process.env.PATHEXT || ".EXE;.CMD;.BAT;.COM").split(colon);
        if (cmd.indexOf(".") !== -1 && ext[0] !== "") ext.unshift("");
    }
    if (cmd.match(/\//) || isWin && cmd.match(/\\/)) env = [""];
    for (let i = 0; i < env.length; i++) {
        const part = (env[i]!.charAt(0) === "\"" && env[i]!.slice(-1) === "\"") ? env[i]!.slice(1, -1) : env[i];
        const p = (!part && /^\.[\\/]/.test(cmd) ? cmd.slice(0, 2) : "") + path.join(part!, cmd);
        for (let j = 0; j < ext.length; j++)
            if (isexesync(p + ext[j])) return p + ext[j];
    }
    throw new Error("not found: " + cmd);
}

const core = isWin ? (path: string) => {
    const stat = fs.statSync(path);
    if (!stat.isSymbolicLink() && !stat.isFile()) return false;
    if (!process.env.PATHEXT) return true;
    const pathext = process.env.PATHEXT.split(";");
    if (pathext.indexOf("") !== -1) return true;
    for (let i = 0; i < pathext.length; i++) {
        const p = pathext[i]!.toLowerCase();
        if (p && path.substr(-p.length).toLowerCase() === p) return true;
    }
    return false;
} : (path: string) => {
    const { mode, gid, uid, isFile } = fs.statSync(path);
    return (isFile() && (
        (mode & 1) ||
        (mode & 2) && gid === process.getgid() ||
        (mode & 4) && uid === process.getuid() ||
        (mode & 6) && process.getuid() === 0
    ));
};
function isexesync(path: string) {
    try { return core(path); }
    catch (_) { return false; }
}
