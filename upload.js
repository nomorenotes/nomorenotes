const { createWriteStream, mkdir } = require("fs")
const { createHash } = require("crypto")

const _setStatus = (io) => (status) => io.emit("upload:status", status)
const _done = (io) => (url) => io.emit("upload:done", url)

const { r } = require("./iomodule.js")
const logger = r.dbg.extend("upload")

module.exports = (io, app) => {
  app.use("/upload/", require("cors")(), require("express").static(__dirname + "/.uploaded"))
  app.get("/upload/admin", (req, res) => {
    const {
      promises: { readdir },
    } = require("fs")
    const basepath = __dirname + "/../.uploaded/"
    return readdir(basepath)
      .then((names) =>
        names.map(async (name) => [name, await readdir(basepath + name)])
      )
      .then((proms) => Promise.all(proms))
      .then((data) => {
        res.write("<h1>Files</h1><table>")
        res.write("<tr><th>File</th><th>Hash</th><th>Delete</th></tr>")
        for (let [name, files] of data) {
          // This will break pretty badly if there are ever multiple files
          res.write(
            `<tr><td><a href="/${name}/${files}">${files}</a></td><td>${name}</td>`
          )
          res.write(`<td><a href="/upload/delete/${name}">Delete</a></td></tr>`)
        }
        res.end()
      })
  })
  app.get("/upload/delete/:hash", ({ params: { hash } }, res) => {
    const {
      promises: { rmdir },
    } = require("fs")
    res.write("deleting... ")
    return rmdir(`${__dirname}/.uploaded/${hash}`, { recursive: true }).then(
      () => (res.write("done!"), res.end())
    )
  })
  logger("ready")

  io.on("connection", (sc) => {
    const setStatus = _setStatus(sc)
    const done = _done(sc)
    const handleFile = (file, name) => {
      logger("Got a file!")
      setStatus("hashing")
      const hash = createHash("sha512")
      hash.update(file)
      const res = hash.digest("hex")
      // const resethash = createHash("md5")
      // resethash.update(file)
      // const resetpw = hash.digest("hex").substr(0, 8)
      void setStatus("saving")
      void mkdir(`.uploaded/${res}`, (e, r) => {
        if (e) return setStatus(`ERROR creating directory!\n${e.stack}`)
        const ws = createWriteStream(`.uploaded/${res}/${name}`)
        ws.write(file)
        done(`upload/${res}/${name}`)
        // setStatus(resetpw)
      })
    }
    sc.on("upload:file", handleFile)
    sc.on("upload:url", async (url, name) => {
      const resp = await fetch(url)
      const buf = await resp.buffer()
      handleFile(url, name)
    })
  })
}
