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

const commands = map({
    echo(...args) {
        console.log(args.join(" "))
    },
    exit(code = 0) {
        code *= 1
        if (!isFinite(code)) code = 1
        process.exit(code)
    }
})

rl.on("line", line => {
    try {
        const [args, special] = parse(line).part(el => typeof el === "string")
        if (!args.length) return
        if (!digCommand(commands, ...args)) {
            console.log(chalk.redBright`unknown command: ${cmd}`)
        }
    } catch (e) {
        console.log(chalk.redBright(e.stack))
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
 * @return {boolean} Whether or not it was found.
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
            val(...keys)
            return true
        } else {
            // @ts-expect-error - defeats the purpose of spreading
            return digCommand(map, ...keys)
        }
    } else {
        return false
    }
}