const opts = location.hash ? location.hash.slice(1).split("&") : []
localStorage.life = localStorage.life || 0
let mine = null
let mesg = 0
let global_sock = null
let autoscrollTo = messages.scrollTop
let disconnect = "waiting"
if (location.protocol === "http:" && !opts.includes("noHttps"))
  location.protocol = "https:"
else if (localStorage.banExpiry2 && +localStorage.banExpiry2 > Date.now())
  location.pathname = "/banned"
else
  $(function () {
    const saveable = ["name"]
    var manotify = false
    var notify = false
    var socket = io()
    global_sock = socket
    socket.on("disconnect", (reason) => {
      disconnect = reason
    })
    window.sendCommand = (cmd) => {
      socket.emit("chat message", cmd)
      //$("#m").val("");
    }
    window.showCommand = (cmd) => {
      $("#m").val(cmd)
    }
    socket.on("hello", () => {
      // TODO: fix
      // socket.emit("doesblur", !document.hasFocus())
      disconnect = "connected"
      saveable.forEach((s) => {
        if (localStorage["NMN" + s]) {
          socket.emit("saveable", s, localStorage["NMN" + s])
        }
      })
      socket.emit(
        "hello",
        localStorage.session
          ? localStorage.session
          : (localStorage.session = socket.id)
      )
    })
    document.getElementById("m").oninput = ({ target }) => {
      socket.emit("fupdate", target.value)
    }
    $("#send").submit(function () {
      socket.emit("chat message", $("#m").val())
      if (!$("#m").val().startsWith("/")) {
        localStorage.life++
        mesg++
      }
      $("#m").val("")
      socket.emit("fupdate", "")
      return false
    })
    window.addEventListener("focus", () => {
      socket.emit("doesblur", false)
    })
    window.addEventListener("blur", () => {
      socket.emit("doesblur", true)
    })
    socket.on("bbstart", () => {
      $("#userlist").empty()
    })
    socket.on("bbu", ([name, id, k, away]) => {
      $("#userlist").append($("<li>", { id: "user--" + id, name, title: away }).text(name).addClass(k))
    })
    socket.on("chat message", function (id, msg) {
      const e = $("<li>", { id }).html(msg).appendTo(messages)
      if (id.startsWith(socket.id)) {
        mine = e
      }
      if (notify) {
        notify = manotify
        console.log(msg)
      }
      let scrollTarget = messages.scroll
      messages.scrollTop = messages.scrollHeight
      autoscrollTo = messages.scrollTop
    })
    socket.on("gotping", (wasTargeted, source) => {
      alert(`${source} has pinged ${wasTargeted ? "you" : "everyone"}!`)
    })
    socket.on("saveable", (name, value) => {
      localStorage["NMN" + name] = value
    })
    socket.on("edit", (id, msg) => {
      $(`#${id}`).html(msg)
    })
    socket.on("fupdate", (id, msg) => {
      // alert("fupdated")
      const el = document.getElementById(`user--${id}`)
      if (!el) return void alert("fupdating nonexistent user?")
      // remove class 'user-with', reflow, and readd
      el.classList.remove("user-with")
      void el.offsetHeight
      el.classList.add("user-with")
    })
    socket.on("sarcastic", (id, from, to) => {
      // alert("s")
      const el = document.getElementById(id)
      if (el) {
        // alert("good s")
        let [left, right] = el.innerHTML.split("&gt; ")
        // alert("slash s " + right)
        let newRight = right.replace(new RegExp(from), to)
        // alert(":s")
        // if (right == newRight) alert("that changed NOTHING")
        // else alert("that changed SOMETHING " + newRight)
        el.innerHTML = `${left}&gt; ${newRight}`
        // alert("rewritten")
      // } else {
        // alert("bad s")
      }
    })
    socket.on("ban", (banner, time, reason) => {
      localStorage.banner = banner
      localStorage.banExpiry2 = Date.now() + time * 60000
      localStorage.banReason = reason
      location.pathname = "/banned"
    })
    socket.on("delete", (id) => {
      document.getElementById(id).removeElement()
    })
    socket.on("reload", () => {
      history.go(0)
    })
    socket.on("linkout", (url) => {
      open(url)
    })
    $(".psa span").click(() => $(".psa").toggleClass("closed"))
    // $(window).on("blur", () => { alert("blur"); });
    // document.getElementById('m').onpaste = function (event) {
    //   // use event.originalEvent.clipboard for newer chrome versions
    //   var items = (event.clipboardData || event.originalEvent.clipboardData).items;
    //   alert(JSON.stringify(items)); // will give you the mime types
    //   // find pasted image among pasted items
    //   var blob = null;
    //   for (var i = 0; i < items.length; i++) {
    //     if (items[i].type.indexOf("image") === 0) {
    //       blob = items[i].getAsFile();
    //     }
    //   }
    //   // load image if there is a pasted image
    //   if (blob !== null) {
    //     var reader = new FileReader();
    //     reader.onload = function (event) {
    //       alert(event.target.result); // data url!
    //       document.getElementById("pastedImage").src = event.target.result;
    //     };
    //     reader.readAsDataURL(blob);
    //   }
    // };
  })
const hyperactiveRabbits = () => {
  $(document.body).toggleClass("dark")
}
document.addEventListener("keydown", (e) => {
  if (e.ctrlKey && e.altKey && e.key.toLowerCase() === "d") {
    e.preventDefault()
    console.log("hyperactive rabbits")
    hyperactiveRabbits()
  } else if (e.key === "ArrowUp") {
    if (m.value === "" && mine && global_sock && mine.attr("id").startsWith(global_sock.id)) {
      m.value = `/edit ${mine.attr("id").replace(global_sock.id, "")} ${mine.html().split("&gt; ")[1].replace(/ \(edited\)$/, "")}`
      e.preventDefault()
    }
  } else if (e.key.toLowerCase() === "u" && e.altKey) {
    open(`view-source:${location}`)
  }
})

window.onerror = (msg, _url, _line, _col, err) => {
  alert(
    err
      ? err?.stack?.includes(String(msg))
        ? err.stack
        : `${err.name}: ${err.message}\n${err.stack}`
      : msg
  )
}

detectConnection()
const lowercaseAlphabet = new Set("abcdefghijklmnopqrstuvwxyz")
const uppercaseAlphabet = new Set("ABCDEFGHIJKLMNOPQRSTUVWXYZ")
const lowercaseAlphabet2 = new Set("abcdefghijklmnopqrstuvwxyz0123456789")
const uppercaseAlphabet2 = new Set("ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789")
const lowercaseAlphabet3 = new Set(
  "abcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-={}[]\\|;:'\",<.>/?"
)
const uppercaseAlphabet3 = new Set(
  "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-={}[]\\|;:'\",<.>/?"
)
setInterval(detectConnection, 100)
function detectConnection() {
  let {
    downlink = "?bps",
    type = "connection",
    effectiveType = "unknown",
  } = navigator.connection ?? { effectiveType: "nonexistent" }
  let downlinkStr = String(downlink)
  if (downlink === 10) {
    downlinkStr = "≥10"
  }
  if (downlink < 1) {
    downlink *= 1000
    downlinkStr = `<span style="color: red;">${downlink}bps</span>`
  }
  if (downlink < 1) {
    downlink *= 1000
    downlinkStr = `<span style="color: orange;">${downlink}Kbps</span>`
  } else if (isFinite(downlink)) {
    downlink += "Mbps"
  }
  const connection = `${effectiveType} ${type} (${downlink})`
  const lifetime = `lifetime messages: ${localStorage.life}`
  stats.innerHTML = `${connection}<br>${lifetime}<br><span onclick="global_sock.connected ? global_sock?.close() : global_sock?.open()">${disconnect}</span>`
}
