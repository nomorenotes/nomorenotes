alert(typeof btn)
const socket = io()
btn.addEventListener("click", () => {
  const { value } = commandline
  evalOutput.value = `>>> ${value}
...`
  socket.emit("eval", value, (text) => {
    evalOutput.value = text
  })
})
