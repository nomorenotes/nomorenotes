const { static } = require("express");
const cors = require("cors");

module.exports = (app) => {
  app.get("/upload.js", (req, res) => {
    res.sendFile(__dirname + "/main.js");
  });
  app.get("/upload.css", (req, res) => {
    res.sendFile(__dirname + "/styles.css");
  });
  app.get("/upload", (req, res) => {
    res.sendFile(__dirname + "/index.html");
  });
  app.use("/upload/", cors(), static(__dirname + "/../.uploaded"));

  app.get("/upload/admin", (req, res) => {
    const {
      promises: { readdir },
    } = require("fs");
    const basepath = __dirname + "/../.uploaded/";
    return readdir(basepath)
      .then((names) =>
        names.map(async (name) => [name, await readdir(basepath + name)])
      )
      .then((proms) => Promise.all(proms))
      .then((data) => {
        res.write("<h1>Files</h1><table>");
        res.write("<tr><th>File</th><th>Hash</th><th>Delete</th></tr>");
        for (let [name, files] of data) {
          // This will break pretty badly if there are ever multiple files
          res.write(
            `<tr><td><a href="/${name}/${files}">${files}</a></td><td>${name}</td>`
          );
          res.write(
            `<td><a href="/upload/delete/${name}">Delete</a></td></tr>`
          );
        }
        res.end();
      });
  });
  app.get("/upload/delete/:hash", ({ params: { hash } }, res) => {
    const {
      promises: { rmdir },
    } = require("fs");
    res.write("deleting... ");
    return rmdir(`${__dirname}/../.uploaded/${hash}`, { recursive: true }).then(
      () => (res.write("done!"), res.end())
    );
  });
};
