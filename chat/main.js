// alert(-5)
let hasNewMessage = false

window.onerror = (_msg, _url, _line, _col, e) => {
  if (confirm(`=== UNHANDLED EXCEPTION ===

${e.stack}

Would you like to reload?`)) history.go(0)
}

// alert(670n)
const opts = location.hash ? location.hash.slice(1).split("&") : []
if (location.protocol === "http:" && !opts.includes("noHttps")) location.protocol = "https:";
else if (localStorage.banExpiry2 && +localStorage.banExpiry2 > Date.now()) location.pathname = "/banned";
else $(function () {

  const saveable = ["name"];
  var manotify = false;
  var notify = false;
  var socket = io();
  socket.on("hello", () => {
    saveable.forEach(s => {
      if (localStorage["NMN" + s]) {
        socket.emit("saveable", s, localStorage["NMN" + s]);
      }
    });
    socket.emit("hello", localStorage.session ? localStorage.session : (localStorage.session = socket.id));
  });
  $('#send').submit(function () {
    socket.emit('chat message', $('#m').val());
    $('#m').val('');
    return false;
  });
  socket.on('chat message', function (id, msg) {
    $('#messages').append($('<li>', { id }).html(msg));
    // alert(-32)
    if (document.hidden) hasNewMessage = true
    window.scrollTo(0, document.body.scrollHeight);
  });
  socket.on("gotping", (wasTargeted, source) => {
    alert(`${source} has pinged ${wasTargeted ? "you" : "everyone"}!`);
  });
  socket.on("saveable", (name, value) => {
    localStorage["NMN" + name] = value;
  });
  socket.on("edit", (id, msg) => {
    $(`#${id}`).html(msg);
  });
  socket.on("ban", (banner, time, reason) => {
    localStorage.banner = banner;
    localStorage.banExpiry2 = Date.now() + time * 60000;
    localStorage.banReason = reason;
    location.pathname = "/banned"
  })
  socket.on("delete", (id) => {
    document.getElementById(id).removeElement();
  });
  socket.on("reload", () => { history.go(0); });
  socket.on("linkout", (url) => { open(url); });
  // window.on("blur", () => { alert("blur"); });
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
	window.sendCommand = (cmd) => {
		socket.emit("chat message", cmd);
		//$("#m").val("");
	}
	window.showCommand = (cmd) => {
		$("#m").val(cmd);
	}
})
document.addEventListener("keydown", e => {
  if (e.ctrlKey && e.altKey && e.key.toLowerCase() === "d") {
    e.preventDefault();
    console.log("hyperactive rabbits")
    $(document.body).toggleClass("dark")
  } else if (e.which === 85 && e.ctrlKey) {
		open(`view-source:${location}`)
	}
});

document.onvisibilitychange = e => {
  if (!document.hidden) {
    hasNewMessage = false
  }
}

let link = document.querySelector("link[rel~='icon']");
if (!link) {
    link = document.createElement('link');
    link.rel = 'icon';
    document.getElementsByTagName('head')[0].appendChild(link);
}
    
setInterval(() => {
  if (hasNewMessage) {
    link.href = "/noticeme.ico"
	}
}, 500)
setTimeout(() => setInterval(() => {
  link.href = "/favicon.ico"
}, 500), 250)