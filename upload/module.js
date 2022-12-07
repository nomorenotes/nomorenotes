const { static } = require("express")
const cors = require("cors")

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
	app.use("/upload/", cors(), static(__dirname + "/../.uploaded"))


  const { promisify } = require("util")
	app.get("/upload/admin", async (req, res) => {
		const { promises: { readdir } } = require("fs")
    const { execSync } = require("child_process")
		const basepath = __dirname + "/../.uploaded/"
		const names = await readdir(basepath)
    const rd = await Promise.all(names.map(async name => [name, await readdir(basepath + name)]))
    
    res.write("<h1>Files</h1><table>")
    res.write("<tr><th>File</th><th>Hash</th><th>Delete</th></tr>")
    const utProms = []
    for (let [name, files] of rd) {
      utProms.push(async () => {
        // This will break pretty badly if there are ever multiple files
        const execR = execSync('git status "' + files + '"')
        const tag = execR.stdout ? '<tr style="background:pink">' : "<tr>"
        
        res.write(`${tag}<td><a href="/${name}/${files}">${files}</a></td><td>${name}</td>`)
        res.write(`<td><a href="/upload/delete/${name}">Delete</a></td></tr>`)
      })
    }
    await Promise.all(utProms)
    res.end()
	})
	app.get("/upload/delete/:hash", ({ params: { hash } }, res) => {
		const { promises: { rmdir } } = require("fs")
		res.write("deleting... ")
		return rmdir(`${__dirname}/../.uploaded/${hash}`, { recursive: true })
			.then(() => (res.write("done!"), res.end()))
	})
};
