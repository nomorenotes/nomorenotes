const opts = location.hash ? location.hash.slice(1).split("&") : []
localStorage.life = localStorage.life || 0
let mesg = 0
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
    window.sendCommand = (cmd) => {
      socket.emit("chat message", cmd)
      //$("#m").val("");
    }
    window.showCommand = (cmd) => {
      $("#m").val(cmd)
    }
    socket.on("hello", () => {
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
    $("#send").submit(function () {
      socket.emit("chat message", $("#m").val())
      if (!$("#m").val().startsWith("/")) {
        localStorage.life++
        mesg++
      }
      $("#m").val("")
      return false
    })
    socket.on("bbstart", () => {
      $("#userlist").empty()
    })
    socket.on("bbu", ([name, id]) => {
      $("#userlist").append($("<li>", { id }).text(name))
    })
    socket.on("chat message", function (id, msg) {
      $("#messages").append($("<li>", { id }).html(msg))
      if (notify) {
        notify = manotify
        console.log(msg)
      }
    window.scrollTo(0, $("#messages")[0].scrollHeight)
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
    socket.on("sarcastic", (id, from, to) => {
      alert("s")
      const el = document.getElementById(id)
      if (el) {
        alert("good s")
        let [left, right] = el.innerHTML.split("&gt; ")
        alert("slash s " + right)
        let newRight = right.replace(new RegExp(from), to)
        alert(":s")
        if (right == newRight) alert("that changed NOTHING")
        else alert("that changed SOMETHING " + newRight)
        el.innerHTML = `${left}&gt; ${newRight}`
        alert("rewritten")
      } else {
        alert("bad s")
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
  stats.innerHTML = `${connection}<br>${lifetime}`
}
