//usr/bin/env false; echo "Warning: Attempted to run a node script in bash."; node "$0" "$@"; exit
console.clear()
const { promisify } = require("util")
const c = require("chalk")
const exec = promisify(require("child_process").execFile)
const fs = require("fs").promises
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
  //console.log(commits, refs, "\n")
  let i = 0
  const j = commits.length
  const processor = hash => (alterline(c.gray`processing ${hash} [${(i++).toString()}/${j}]`), exec("git", ["cat-file", "commit", hash]).then(data => [hash, data]).then(pair => loadCommitPair(pair, refs)))
  await commits.reduce((promise, nextHash) => promise.then(() => processor(nextHash)), Promise.resolve())
  alterline(`Done processing ${j} commits.`)
  console.log(c.gray`waiting for refs...`)
  await Array.from(refs).forEach(([commit, refs]) => {
    for (let ref of refs) {
      elements.push({
        group: 'nodes',
        data: {
          id: "ref_" + ref,
          ref_target: commit
        },
        classes: ["refptr"]
      })
      elements.push({
        group: 'edges',
        data: {
          source: "ref_" + ref,
          target: commit
        },
        classes: ["refptr"]
      })
      alterline(`ref: ${commit} <- ${ref}`)
    }
    alterline(`refs done: ${commit}`)
  })
  alterline("Generating file..." + c.gray`[${elements.length} elements]`)
  const json = JSON.stringify(elements)
  const totalBytes = json.length
  await fs.writeFile("public/objects.json.")
  alterline(`Writing... ` + c.gray`[${totalBytes}b]`)
  await fs.writeFile("public/objects.json", json)
  alterline(`Writing... done.`)
}
function alterline(...text) {
  process.stdout.cork()
  process.stdout.moveCursor(0, -1)
  process.stdout.cursorTo(0)
  process.stdout.clearLine()
  console.log(...text)
  process.stdout.uncork()
}
const elements = []
async function loadCommitPair([hash, { stdout: data }], refs) {
  const headers = {}
  let currentHeader = []
  //console.log(data)
  const iter = data.split("\n")[Symbol.iterator]()
  for (let header of iter) {
    //console.log(currentHeader, headers, header)
    if (header === "") break
    if (header.startsWith(" ")) {
      currentHeader[1] += "\n" + header.slice(1)
    } else {
      if (currentHeader.length) {
        const [name, data2] = currentHeader
        if (headers[name]) {
          headers[name].push(data2)
        } else {
          headers[name] = [data2]
        }
      }
      const parts = header.split(" ")
      currentHeader = [parts.shift(), parts.join(" ")]
    }
  }
  const remaining = Array.from(iter).join("\n")
  const paragraphs = remaining.split("\n\n")
  //console.log(headers)
  const parents = headers.parent || []
  const ref = refs.get(hash)
  elements.push({
    group: "nodes",
    data: {
      id: hash,
      message: paragraphs,
      headers,
      refs: Array.from(ref || [])
    },
    classes: [
      parents.length === 0 ? "orphan" :
      parents.length === 1 ? "commit" :
      "merge",
      ref
        && first(ref, el => el.startsWith("refs/remotes/"))
        && "remote",
      ref
        && first(ref, el => el.startsWith("refs/heads/"))
        && "branch",
      ref && "ref",
    ].filter(a => a)
  })
  for (let parent of parents) {
    elements.push({
      group: "edges",
      data: {
        source: hash,
        target: parent
      },
      pannable: true
    })
  }
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

function first(iter, pred) {
  for (let item of iter) {
    return true
  }
  return false
}