/** @type {import("xterm").Terminal} */
const term = new Terminal()
const fit = new FitAddon.FitAddon()
const sock = io()
term.loadAddon(fit)
term.open(document.body)
sock.emit("tty", { cols: term.cols, rows: term.rows })
sock.on("stdout", (/** @type {string} */ data) => {
    term.write(data)
})
sock.on("died", ({ exitCode, signal }) => {
    term.write(`\x1b[0m\x1b[?25l\n\x1b[91mexited with code ${exitCode}` + (signal ? `(signal ${signal})` : ""))
})
term.onData(sock.emit.bind(sock, "stdin"))
term.onResize(sock.emit.bind(sock, "winch"))
fit.fit()
window.onresize = () => {
    fit.fit()
}