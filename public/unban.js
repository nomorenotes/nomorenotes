alert(1)
outdiv.textContent = "Processing..."
window.onerror = (_msg, _url, _line, _col, { stack }) => {
  alert(stack)
}
if (location.hash.length >= 8) {
  const text = location.hash.slice(1)
  const decodedObject = JSON.parse(btoa(text))
  if (localStorage.session !== decodedObject.session) {
    outDiv.textContent = "This unban URL is for a different user."
  } else {
    if (decodedObject.changeName) {
      const code = prompt("You are required to change your name. Please enter a name to continue.")
      if (!code) {
        outdiv.textContent = "The unban process has been canceled. Please reload to try again."
        return;
      } else {
        localStorage.NMNname = code
      }
    }
  }
  if (decodedObject.decrease) {
    localStorage.banExpiry2 -= decodedObject.decrease
    outdiv.innerHTML = `Your ban expiry has been decreased by ${decodedObject.decrease / 1000 / 60} minutes. You will now be unbanned ${localStorage.banExpiry2}. <a href="/banned">Return to ban screen</a>`
  } else {
    delete localStorage.banExpiry2
    outdiv.innerHTML = `You have been completely unbanned. <a href="/chat">Return to chat</a>`
  }
} else {
  outdiv.textContent = "An invalid unban code was provided. Please ask an admin for another one."
}