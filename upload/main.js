// $(() => {

statu.innerText = "loading"
const sc = io()
sc.on("connect", () => statu.innerText = "alpha")
sc.on("upload:status", stat => statu.innerText = stat)
sc.on("upload:done", url => {
	url = `${location.origin}/${url}`
	statu.innerText = `done`
	lastu.href = url;
	lastu.innerText = url;
	if (openu.checked) open(url)
})
// let endname
filei.onchange = ({ target: { files: [file] } }) => {
	// endname = file.name
	teenageninja.placeholder = file.name
};
urli.onchange = ({ value }) => {
	try {
		const { pathname } = new URL(value)
		const { length, ...segs } = pathname.split("/")
		teenageninja.placeholder = uudecode(segs[length - 1])
	} catch (e) {
		alert(e.stack)
	}
}
const getName = () => teenageninja.value || teenageninja.placeholder
ubut.onclick = () => {
	const { files: [file] } = filei;
	filel.innerText = file.name;
	filez.innerText = String(file.size) + "b";
	statu.innerText = "transmitting"
	sc.emit("upload:file", file, getName())
}
lbut.onclick = () => {
	const { value } = urli;
	sc.emit("upload:url", urli, getName())
}
window.onerror = (msg, url, line, col, err) => {
  if (!err.ignored) alert()
}
function raw_upload(use_b64) {
  if (teenageninja.value === "") {
    fail("A filename must be specified when using raw uploading.")
  }
  const data = rtx_on.value
  if (use_b64) {
    try {
      data = atob(data)
    } catch (e) {
      fail("Failed to decode base64. Is it valid?")
    }
  }
  // start upload
	filel.innerText = teenageninja.value + ' [raw]';
	filez.innerText = String(data.length) + "b";
	statu.innerText = "transmitting"
	sc.emit("upload:file", data, teenageninja.value)
}
function fail(msg) {
  alert("Error: " + msg + "\nThe most likely cause of the problem is located between the keyboard and chair.")
  const err = Error(msg)
  err.ignore = true
  return err
}
tbut.onclick = raw_upload.bind(null, false)
bbut.onclick = raw_upload.bind(null, true)
uue.onclick = () => {
	teenageninja.placeholder = filei.target.files[0].name
}
lle.onclick = () => {
	try {
		const { pathname } = new URL(urli.value)
		const { length, ...segs } = pathname.split("/")
		teenageninja.placeholder = uudecode(segs[length - 1])
	} catch (e) {
		alert(e.stack)
	}
}
// })