module.exports = function*(user) {
  const target = r.rnames[user]
  if (!target)
    return void yield `404: ${user} not found`
  yield `---- ${user} ----`
  const data = target[r.s]
  const sendline = (key, value) => `${key.padStart(12).replaceAll(" ", "&nbsp;")}: ${value}`
  yield sendline("useragent", data.ua)
  yield sendline("platform", data.pf)
  yield sendline("sockid", copied(target.id))
  yield sendline("sestn", copied(data.sestn))
}