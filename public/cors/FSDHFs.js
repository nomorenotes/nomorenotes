"use strict";
export class FSDHFs {
  constructor(handle) {
    this.handle = handle;
  }
  async readFile(path, {}) {
    const handle = await this.resolveFile(path);
    const file = await handle.getFile();
    return file.text();
  }
  async writeFile(path, data, { flags = "w" }) {
    const handle = await this.resolveFile(path);
    // @ts-expect-error - this api does not currently have type support
    const writable = await handle.createWritable({
      keepExistingData: flags.includes("a"),
    });
    writable.write(data);
    writable.close();
  }
  async unlink(path) {
    const parts = FSDHFs.resolvePath(path);
    const filename = parts.pop();
    const dir = await this.resolveDir(parts);
    dir.removeEntry(filename);
  }
  async readdir(path) {
    const dir = await this.resolveDir(path);
    const names = [];
    // @ts-expect-error - see above
    for await (let handle of dir.values()) {
      names.push(handle.name);
    }
  }
  async mkdir(path) {
    const parts = FSDHFs.resolvePath(path);
    const newName = parts.pop();
    const dir = await this.resolveDir(parts);
    let failed = false;
    try {
      await dir.getDirectoryHandle(path);
      failed = true;
    } catch (e) {
      await dir.getDirectoryHandle(path, { create: true });
    }
    if (failed) {
      throw new Error("exists");
    }
  }
  async rmdir(path) {
    const parts = FSDHFs.resolvePath(path);
    const dirname = parts.pop();
    const dir = await this.resolveDir(parts);
    dir.removeEntry(dirname);
  }
  async stat(path) {
    const parts = FSDHFs.resolvePath(path);
    const filename = parts.pop();
    const dir = await this.resolveDir(parts);
    const handle = await dir.getDirectoryHandle(filename);
    return {}; // almost everything is unsupported
  }
  static resolvePath(path) {
    return ary_apply(
      typeof path === "string" ? path.split("/") : path,
      (value, i, ary) =>
        value === ".."
          ? ((ary[i] = ""), (ary[i - 1] = ""))
          : value === "."
          ? (ary[i] = "")
          : value
    ).filter((part) => part);
  }
  async resolveDir(path, options) {
    const parts = FSDHFs.resolvePath(path);
    return parts.reduce(
      async (handle, name) => (await handle).getDirectoryHandle(name, options),
      Promise.resolve(this.handle)
    );
  }
  async resolveFile(path, fileOptions, dirOptions) {
    const parts = FSDHFs.resolvePath(path);
    const filename = parts.pop();
    if (!filename) throw new Error("Cannot resolve empty path in file mode");
    const dir = await parts.reduce(
      async (handle, name) =>
        (await handle).getDirectoryHandle(name, dirOptions),
      Promise.resolve(this.handle)
    );
    return dir.getFileHandle(filename, fileOptions);
  }
}
function ary_apply(array, callback) {
  const working = [...array];
  working.forEach(callback);
  return working;
}
