/** @type {import("xterm").Terminal} */
const term = new Terminal()
const fit = new FitAddon.FitAddon()
const sock = io()
term.loadAddon(fit)
term.open(Albert)
sock.emit("tty", { cols: term.cols, rows: term.rows })
sock.on("stdout", (/** @type {string} */ data) => {
    term.write(data)
})
sock.on("died", ({ exitCode, signal }) => {
    term.write(`\x1b[0m\x1b[?25l\n\x1b[91mexited with code ${exitCode}` + (signal ? `(signal ${signal})` : ""))
})
term.onData(sock.emit.bind(sock, "stdin"))
term.onResize(sock.emit.bind(sock, "winch"))

// /** @param {import("xterm").IEvent<{ key: string, domEvent: KeyboardEvent }>} ev */
// function defaultSh(ev) {
//     const prompt = "\x1b[33mnty> \x1b[0m"
//     let line = ""

//     /** @param {{ key: string, domEvent: KeyboardEvent }} k */
//     function handler(k) {
//         if (k.key.charCodeAt(0) === 127) k.key = "\b"
//         switch (k.key) {
//             case '\b':
//                 line = line.substring(0, -1)
//         }
//     }
//     const D = ev(handler)
// }
// defaultSh(term.onKey)
fit.fit()
window.onresize = () => {
    fit.fit()
}

// Bob.onkeypress = /** @type {(ev: KeyboardEvent) => void} */ ev => {
//     if (ev.keyCode === 13) {
//         Bob.value = ""
//     }

//     alert(ev.key)
// }