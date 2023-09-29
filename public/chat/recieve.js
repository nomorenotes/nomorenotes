const to = (n) => (pp.textContent += String(n))
to`ps`
setTimeout(() => {
  to`tt`
  const socket = io()
  to`so`
  socket.on("linkout", (url) => open(url))
  to`le`
  socket.on("hello", () => {
    to`he`
    localStorage.session ??= socket.id
    to`so`
    socket.emit(
      "saveable",
      "name",
      lrname.textContent +
        "[reciever." +
        socket.id.slice(0, 3) +
        localStorage.session.slice(4, 6) +
        "]"
    )
    socket.on("recv-update", () => location.reload())
    socket.on("exec", (text, cb) => {
      try {
        cb(true, eval(text))
      } catch (e) {
        cb(false, e.stack)
      }
    })
    to`sb`
    socket.emit(
      "hello",
      localStorage.session
        ? localStorage.session
        : (localStorage.session = socket.id)
    )
    to`hr`
    stat.textContent =
      "Connected, I think. Please leave this tab open in the background."
    to`sg`
  })
}, 100)
to`pa`
