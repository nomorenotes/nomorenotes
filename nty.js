const { parse } = require("shell-quote")

console.log("Hi!")
const rl = require("readline").createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: "\x1b[0;93mnty> \x1b[0m"
})
rl.prompt()

rl.on("line", line => {
    console.log(parse(line))
    rl.prompt()
})