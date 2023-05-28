/** @type {import("xterm").Terminal} */
const term = new Terminal()
const fit = new FitAddon.FitAddon()
const sock = io()
term.loadAddon(fit)
term.open(nty_holder)
sock.on("auth", () => {
    nty_login.hidden = false
    nty_login_load_row.hidden = true
    nty_login_row.hidden = false
})
const sleep = time => new Promise(res => setTimeout(res, time))
const failing = p => p.then(v => { throw v })
const sendAck = (socket, ...args) => new Promise(res => socket.emit(...args, res))
nty_login_btn.onclick = async () => {
    nty_login_load_row.hidden = false
    nty_login_row.hidden = true
    const success = await Promise.race([sendAck(sock, "auth", nty_user.value, nty_pass.value), sleep(5000).then(() => false)])
    nty_login_load_row.hidden = true
    nty_login_row.hidden = false
    if (success) {
        nty_login.hidden = true
    } else {
        nty_login_btn.style.color = "red"
        await sleep(500)
        nty_login_btn.style.color = "inherit"
    }
}
sock.emit("tty", { cols: term.cols, rows: term.rows })
sock.on("stdout", (/** @type {string} */ data) => {
    term.write(data)
})
sock.on("died", ({ exitCode, signal }) => {
    term.write(`\x1b[0m\x1b[?25l\n\x1b[91mexited with code ${exitCode}` + (signal ? `(signal ${signal})` : ""))
    document.body.style.opacity = "0.5"
})
term.onData(sock.emit.bind(sock, "stdin"))
term.onResize(sock.emit.bind(sock, "winch"))
fit.fit()
window.onresize = () => {
    fit.fit()
}

let loader = 0
const loaderSeq = [">   ", "->  ", " -> ", "  ->", "   -", "    ", "    "].map(line => "[" + line + "]")
setInterval(() => {
    loader++
    loader %= loaderSeq.length
    nty_loader.innerHTML = loaderSeq[loader].replaceAll(" ", "&nbsp;").replace("<", "&lt;")
}, 250)