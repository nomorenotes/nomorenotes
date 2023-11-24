module.exports = function*(name) {
  if (!name)
    yield `You know that not supplying a name usually means everyone, right?`
  let teop = r.rnames[name]
  if (!teop)
    yield `Error 404: ${name} not found!`
  if (!teop.op)
    yield `${name} seems about the same.`
  else {
    r.mes(r.io, "alert", `${$RS.name} thinks ${name} seems less powerful.`)
    teop.op = false
    r.losers()
    socket.emit("saveable", 0)
  }
}