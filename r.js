const LANG = "en_us";
/** @type {any} */
const _ = undefined
/** @type {(value: any) => any} */
const any = a => a

/** @type {import("./types/server").R} */
const r = {
  al: process.env.al || "gU ",
  SYS_ID: { id: "system" },
  USERDICT: process.env.USER || {}, // probable bug
  dbg: require("./fancify_log.js")(require("debug")("nmn")),
  s: Symbol("nomorenotes"),
  nexusData: require("./servers_list.js"),
  nexusSyms: {
    "other": "&nbsp;",
    "here": ">",
    "noid": "!"
  },
  surr: require("./surr.js"),
  pf: require("./prefixes.js"),
  t: _,
  list: []
}
r.t = require("./texts.js")(r)[LANG]
module.exports = r