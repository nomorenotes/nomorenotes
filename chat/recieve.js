const to = n => pp.textContent += String(n)
to`ps`
setTimeout(() => {
  to`tt`
  const socket = io()
  to`so`
  socket.on('linkout', url => open(url))
  to`lo`
  socket.on('hello', () => {
    to`he`
    socket.emit('saveable', 'name', lrname.textContent + '[reciever]')
    to`sb`
    socket.emit("hello", localStorage.session ? localStorage.session : (localStorage.session = socket.id));
    to`hr`
    stat.textContent = 'Connected, I think. Please leave this tab open in the background.'
    to`sg`
  })
}, 100)
to`pa`