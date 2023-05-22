/// <reference path="array-part.d.ts" />


Array.prototype.part = 
/** 
 * @template T
 * @param {(el: T, idx: number, array: Array<T>) => boolean} pred
*/
function (pred) {
    /** @type {[Array<T>[], Array<T>[]]} */
    const res = [[], []]
    this.forEach((el, idx, ary) => {
        (pred(el, idx, ary) ? res[0] : res[1]).push(el)
    })
    return res
}

const { parse } = require("shell-quote")
const chalk = require("chalk")

console.log("Welcome to nty, the nomorenotes terminal.")
console.log()

const rl = require("readline").createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: chalk.cyanBright`nty> `
})
rl.prompt()

/**
 * @template K extends string | number | symbol
 * @template V
 * @param {Record<K, V>} obj The object to turn into a map.
 * @returns {Map<K, V>} The object turned into a map.
 */
// @ts-expect-error - trust me bro
const map = obj => new Map(Object.entries(obj))
const BREAKOUT = Symbol("BREAKOUT")

const checkBounds = function (args, min, max) {
    min ??= 0
    max ??= Infinity
    const name = args.callee.name
    if (args.length < min) {
        console.log(chalk.redBright`${name}: not enough arguments (${args.length} < ${min})`)
    } else if (args.length > max) {
        console.log(chalk.redBright`${name}: too many arguments (${args.length} > ${max})`)
    } else return
    throw BREAKOUT
}

const commands = map({
    echo() {
        checkBounds(arguments)
        console.log(Array.from(arguments).join(" "))
    },
    exit(code) {
        code ??= 0
        checkBounds(arguments, 0, 1)
        code *= 1
        if (!isFinite(code)) code = 1
        process.exit(code)
    },
    eval(text) {
        checkBounds(arguments, 1, 1)
        console.log(eval(text))
    },
    bash() {
        checkBounds(arguments, 0, 0)
        try {
            rl.pause()
            require("child_process").spawnSync("stty sane; bash", { shell: true, stdio: [0, 1, 2] })
        } finally {
            rl.resume()
        }
    }
})

for (let name of ["echo"]) {
    commands.get(name).length = Infinity
}

rl.on("line", line => {
    try {
        const [args, special] = parse(line).part(el => typeof el === "string")
        if (!args.length) return
        let r
        if ((r = digCommand(commands, ...args)) !== true) {
            console.log(chalk.redBright`${args[0]}: ${r || "no such command"}`)
        }
    } catch (e) {
        if (e !== BREAKOUT) console.log(chalk.redBright(e instanceof Error ? e.stack : e))
    } finally {
        rl.prompt()
    }
})

/**
 * @typedef {((...keys: string[]) => void) | Map<string, Diggable> | void} Diggable
 */

/**
 * @param map {Diggable}
 * @param key {string}
 * @param keys {string[]}
 * @return {boolean | string} Whether or not it was found, or an error message.
 */
function digCommand(map, key, ...keys) {
    // console.log(chalk.gray`dig: ${key}; ${keys.join(",")}`)
    if (!map) {
        // Simplest case
        return false
    } else if (map.has(key)) {
        // Simple case
        const val = map.get(key)
        if (typeof val === "function") {
            return val(...keys) ?? true
        } else {
            // @ts-expect-error - defeats the purpose of spreading
            return digCommand(map, ...keys)
        }
    } else {
        return false
    }
}