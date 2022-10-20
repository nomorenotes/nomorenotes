const write = text => outdiv.textContent = text
const redir = (loc = location.href, cb = () => {}) => cb(setTimeout(() => location = loc, 5000))
write("Processing")
window.onerror = (_msg, _url, _line, _col, { stack }) => alert(stack)
const text = location.hash.slice(1)
write(text)
if (text.length < 8) {
  write("Invalid hash provided. Please ask an admin for another URL.")
} else {
  const { session, decrease, changeName } = JSON.parse(atob(text))
  if (session === localStorage.session) {
    if (changeName) {
      const oldName = localStorage.NMNname
      const newName = prompt(`The admin unbanning you requires you to change your name. Please change your name.`, oldName)
      if (newName) {
        if (oldName === newName) {
          write("You cannot use your old name. Reloading in 5 seconds.")
          redir(void 0, 0)
        }
      } else {
        write("You must provide a new name. Reloading in 5 seconds.")
        redir(void 0, 0)
      }
    }
    if (decrease) {
      localStorage.banExpiry2 -= decrease
      const time = Math.floor(decrease / 1000)
      const mins = Math.floor(time / 60)
      const secs = time % 60
      write(`Your ban time has been decreased by ${mins}:${secs.toString().padStart(2, 0)}. You will now be unbanned ${Date(+localStorage.banExpiry2)}. Returning to banned screen in 5 seconds.`)
      redir('/banned')
    } else {
      delete localStorage.banExpiry2
      write(`You have been completely unbanned. Returning to chat in 5 seconds.`)
      redir('/chat')
    }
  } else {
    write("This URL is for a different user. Please send it to the correct user, or ask an admin if it was for you.")
  }
}