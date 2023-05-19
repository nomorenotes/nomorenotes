const to = n => pp.textContent += String(n)
to`ps`
setTimeout(() => {
  to`tt`
  const socket = io()
  to`so`
  socket.on('linkout', url => open(url))
  to`le`
  socket.on('hello', () => {
    to`he`
    localStorage.session ??= socket.id
    to`so`
    socket.emit('saveable', 'name', lrname.textContent + '[reciever.' + socket.id.slice(0, 3) + localStorage.session.slice(4, 6) + ']')
    to`sb`
    socket.emit("hello", localStorage.session ? localStorage.session : (localStorage.session = socket.id));
    to`hr`
    stat.textContent = 'Connected, I think. Please leave this tab open in the background.'
    to`sg`
  })
  to`se`
  const scopedEval = (...args) => eval(...args)
  to`oe`
  socket.on('eval', (code, callback) => {
    try {
      const f = new Function("scopedEval", code)
      try {
        const v = f(scopedEval)
        if (v instanceof Promise) {
          v.then(
            y => callback(true, true, y),
            n => callback(false, true, n)
          )
        } else {
          callback(true, false, n)
        }
      } catch (e) {
        callback(false, false, v.stack)
      }
    } catch (e) {
      callback(null, undefined, e.stack) // syntax error
    }
  })
}, 100)
to`pa`