const chalk = require("chalk")
const { any } = require("./any")
const DEBUG = Symbol("DEBUG")
const LOG = Symbol("LOG")
const WARN = Symbol("WARN")
const ERR = Symbol("ERR")
/** @typedef {typeof DEBUG} DEBUG */
/** @typedef {typeof LOG} LOG */
/** @typedef {typeof WARN} WARN */
/** @typedef {typeof ERR} ERR */

/** @type Record<STYLE_KEY, (msg: string) => string | { before?: () => void, value: string, after?: () => void }> */
const STYLES = {
  [LOG]: chalk.reset,
  [DEBUG]: (msg) => ({
    before: () => process.stderr.write("\x1b[2;3m"),
    value: "\x1b[2;3m" + msg,
    after: () => process.stderr.write("\x1b[m"),
  }),
  [WARN]: chalk.yellow.bold,
  [ERR]: chalk.red.bgBlack.bold,
}

/** @typedef {DEBUG | LOG | WARN | ERR} STYLE_KEY */

/**
 * @typedef {{
 *   (...args: unknown[]): void
 *   extend(...names: string[]): Debugger
 * }} Debugger
 */

/**
 * @typedef {{
 *   DEBUG: DEBUG, LOG: LOG, WARN: WARN, ERR: ERR,
 *   log(message: string, ...parts: unknown[]): void,
 *   extend(...names: string[]): FancifyLog,
 *   (message: string, ...parts: unknown[]): void
 * }} FancifyLog
 */

exports = module.exports =
  /** @type {(base: Debugger) => FancifyLog} */ function (base) {
    const d = Object.setPrototypeOf(
      {
        DEBUG,
        LOG,
        WARN,
        ERR,
        /** @type {(message: string, ...parts: [parts: ...unknown[], STYLE_KEY?]) => void} */
        log(message, ...parts) {
          /** @type {STYLE_KEY} */
          let s = LOG
          if (parts.length) {
            let ms = parts.pop()
            if (isMember(ms, Object.keys(STYLES))) {
              s = ms
            }
          }
          const fmt = STYLES[s](message)
          if (typeof fmt === "string") {
            return base(fmt, ...parts)
          } else {
            fmt.before && fmt.before()
            const ret = base(fmt.value, ...parts)
            fmt.after && fmt.after()
            return ret
          }
        },
        /** @type {(...names: string[]) => FancifyLog} */
        extend(...names) {
          return exports(base.extend(...names))
        },
      },
      Function.prototype
    )
    /** @type {(...messages: Parameters<FancifyLog["log"]>) => ReturnType<FancifyLog["log"]>} */
    // @ts-ignore false error since this function is defined to take the parameters of the wrapped function
    const f = function (...messages) {
      return d.log(...messages)
    }
    Object.setPrototypeOf(f, d)
    return any(f)
  }

/**
 * @template T,O
 * @typedef {T extends (...args: any[]) => any ? { (...args: Parameters<T> ): ReturnType<T> } & O : T & O} CallableObject
 */

/**
 * @template T
 * Checks whether or not a value is in a set of values.
 * @param {any} value The value to check.
 * @param {T[] | Set<T>} set The set of values to check `value` against.
 * @returns {asserts value is T}
 */
function assertMember(value, set) {
  if (Array.isArray(set)) {
    if (set.includes(value)) {
      return value
    } else {
      throw new Error("value is not an element of provided array")
    }
  }
  if (set instanceof Set) {
    if (set.has(value)) {
      return value
    } else {
      throw new Error("value is not a member of provided set")
    }
  }
  throw new Error(`set must either be an array or a Set`)
}
/**
 * @template T
 * Checks whether or not a value is in a set of values.
 * @param {any} value The value to check.
 * @param {T[] | Set<T>} set The set of values to check `value` against.
 * @returns {value is T}
 */
function isMember(value, set) {
  if (Array.isArray(set)) {
    return set.includes(value)
  }
  if (set instanceof Set) {
    return set.has(value)
  }
  throw new Error(`set must either be an array or a Set`)
}
