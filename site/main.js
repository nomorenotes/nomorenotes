/*global readCookie, createCookie, eraseCookie, $, _ */
// <style> * {display: inline-block;} </style>

/*(() => {
  const prevFeed = $("#prev-feed")
  const sock = io();
  sock.on("chat message", (msg) => {
    if (prevFeed.children().size() >= 5) {
      prevFeed.children().first().remove();
    }
    prevFeed.append($("<li>").text(msg)); // </li>
  });
});*/

function loadTheme() {
  console.log("loading theme")
  fetch("/themes.json")
    .then((resp) => {
      let body = resp.body
      body = body.getReader()
      let nextPart = { done: false }
      let data = ""
      function handler(part) {
        data += part.value || ""
        if (part.done) {
          finish(data)
        } else {
          body.read().then(handler)
        }
      }
      function finish() {
        console.log(`processing theme data: ${data}`)
        data = JSON.parse(data)
        console.log("theme data fetched")
        const ust = readCookie("theme") || data._default_
        console.log(`got user prefrences: ${ust}`)
        const color = data[ust]
        console.log(`which means color ${color}`)
        createCookie("theme", ust, 7)
      }
    })
    .catch((err) => {
      console.error(err.stack)
    })
}

$(() => {
  loadTheme()
})
