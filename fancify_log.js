const chalk = require("chalk")
const DEBUG = Symbol("DEBUG")
const LOG = Symbol("LOG")
const WARN = Symbol("WARN")
const ERR = Symbol("ERR")
const STYLES = {
  [LOG]: chalk.reset,
  [DEBUG]: (msg) => ({
    before: () => process.stderr.write('\x1b[2;3m'),
    value: '\x1b[2;3m' + msg,
    after: () => process.stderr.write('\x1b[m')
  }),
  [WARN]: chalk.yellow.bold,
  [ERR]: chalk.red.bgBlack.bold
}
exports = module.exports = function(base) {
  const d = Object.setPrototypeOf({
    DEBUG, LOG, WARN, ERR,
    log(message, ...parts) {
      let s = LOG
      if (parts.length) {
        s = parts.pop()
        if (!(s in STYLES)) {
          parts.push(s)
          s = LOG
        }
      }
      const fmt = STYLES[s](message)
      fmt.before && fmt.before()
      const ret = base(fmt.value ? fmt.value : fmt, ...parts)
      fmt.after && fmt.after()
    }, extend(...names) {
      return exports(base.extend(...names))
    }
  }, Function.prototype)
  const f = function(...messages) {d.log(...messages)}
  Object.setPrototypeOf(f, d)
  return f
}