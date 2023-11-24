module.exports = function*(name) {
  if (!name)
    yield `Usage: not like that`
  let top = r.rnames[name]
  if (!top)
    yield `Error 404: ${name} not found!`
  if (top.op)
    yield `${name} seems about the same.`
  else if (top.permDeop)
    yield `${name} is permanently deopped and cannot be opped.`
  else {
    r.mes(r.io, "alert", `${$RS.name} thinks ${name} seem more powerful.`)
    top.op = true
    r.losers()
  }
}