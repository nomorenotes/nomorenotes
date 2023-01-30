const { createWriteStream, mkdir } = require("fs")
const { createHash } = require("crypto")

const _setStatus = io => status => io.emit("upload:status", status)
const _done = io => url => io.emit("upload:done", url)

module.exports = io => {
	console.log("loaded upload.js")
	
	io.on("connection", sc => {
		const setStatus = _setStatus(sc)
		const done = _done(sc)
		const handleFile = (file, name) => {
			console.log("Got a file!")
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
				console.log(r)
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
		});
	})
}