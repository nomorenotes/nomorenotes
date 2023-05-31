/* @type {object} */ let data = require("./db.json")
const { promises: fsp } = require("fs")

let file = "./db.json"
exports.data = data
Object.defineProperty(exports, "filename", {
  configurable: true,
  enumerable: true,
  get() {
    return file
  },
  set($event) {
    file = $event
    data = require("./" + file)
  },
})

exports.save = () => {
  fsp.writeFile(file, JSON.stringify(data, null, 2))
}

exports.touch = (...keys) => {
  const key = keys.pop()
  const base = keys.length ? exports.touch(...keys) : data
  if (key in data) {
    return data[key]
  } else {
    const val = (data[key] = {})
    exports.save()
    return val
  }
}
