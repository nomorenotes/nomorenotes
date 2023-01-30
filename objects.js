//usr/bin/env false; echo "Warning: Attempted to run a node script in bash."; node "$0" "$@"; exit
const { promisify } = require("util")
const c = require("chalk")
const exec = promisify(require("child_process").execFile)
// exec("git", ["for-each-ref", "--python", "--format", "({ref:%(refname),type:%(objecttype),id:%(objectname)})"], {
//   maxBuffer: Infinity
// }).then(({ stdout, stderr }) => {
//   const things = stdout.trim().split("\n").map(eval).map(obj => ({...obj, ref: obj.ref.split("/").splice(1, Infinity) }))
//   for (let {ref, type, id} of things) {
//     mark_commit(ref, type, id)
//   }
// })

// function mark_commit(ref, type, id) {
//   if ref[0] === 
// }
console.log(`// pid: ${process.pid}`)
async function main() {
  console.log("Loading commit and ref list...")
  const [commits, refs] = await Promise.all([
    exec("git", ["rev-list", "--all"])
      .then(ret => ret.stdout.split("\n").filter(x => x)),
    exec("git", ["for-each-ref", "--python", "--format", "[%(objectname), %(refname)]"])
      .then(ret => ret.stdout.split("\n").map(txt => eval(`${txt}`)).filter(x => x))
      .then(ret => ret.reduce((map, [object, ref]) => (map.has(object) ? map.get(object).add(ref) : map.set(object, new Set([ref])), map), new Map()))
  ])
  alterline(`${commits.length} commits to process\n`)
  updateProgress.m = commits.length
  updateProgress.l = String(commits.length).length
  // updateProgress(0)
  console.log(commits, refs, "\n")
  const processor = hash => (alterline(c.gray`processing ${hash}`), exec("git", ["cat-file", "commit", hash], { stdout: process.stdout }).then(data => [hash, data]).then(pair => loadCommitPair(pair)))
  console.log(await commits.reduce((promise, nextHash) => promise.then(() => processor(nextHash)), Promise.resolve()))
}
function alterline(...text) {
  process.stdout.cork()
  process.stdout.moveCursor(0, -1)
  process.stdout.cursorTo(0)
  process.stdout.clearLine()
  console.log(...text)
  process.stdout.uncork()
}
async function loadCommitPair() {
  
}
const incProgress = change => updateProgress(updateProgress.c + change)
function updateProgress(newProgress) {
  if (newProgress > updateProgress.c) {
    updateProgress.c = newProgress
    alterline(`${String(newProgress).padStart(updateProgress.l)}/${updateProgress.m}`)
  }
}
updateProgress.c = -1

if (require.main === module) {
  main()
}