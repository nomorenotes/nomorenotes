if (location.protocol === "http:") location.protocol = "https:";
else if (localStorage.banExpiry1 && +localStorage.banExpiry1 > Date.now()) location.pathname = "/banned";

function trueInit() {
  if ("realName" in localStorage) {
    realNameIn.value = localStorage.realName;
    usernameIn.value = localStorage.NMNname;
    init();
    $(chat).show();
  } else {
    $(logond).show();
  }
}

trueInit();

$(logonf).submit(e => {
  e.preventDefault();
  $(logond).hide();
  $(chat).show();
  init();
})

function init() {
  localStorage.realName = realNameIn.value;
  localStorage.NMNname = usernameIn.value;
  const saveable = ["name"];
  var manotify = false;
  var notify = false;
  var socket = io();
  socket.on("hello", () => {
    socket.emit("hello", localStorage.session ? localStorage.session : (localStorage.session = socket.id), usernameIn.value, realNameIn.value);
  });
  $('#send').submit(function () {
    socket.emit('chat message', $('#m').val());
    $('#m').val('');
    return false;
  });
  socket.on('chat message', function (id, msg) {
    $('#messages').append($('<li>', { id }).html(msg));
    if (notify) {
      notify = manotify;
      alert(msg);
    }
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
    localStorage.banExpiry1 = Date.now() + time * 60000;
    localStorage.banReason = reason;
    location.pathname = "/banned"
  })
  socket.on("delete", (id) => {
    document.getElementById(id).removeElement();
  });
  socket.on("reload", () => { history.go(0); });
  socket.on("linkout", (url) => { open(url); });
  $.on("blur", () => { alert("blur"); });
  window.sendCommand = (cmd) => {
    socket.emit("chat message", cmd);
    $("#m").val("");
  }
  window.showCommand = (cmd) => {
    $("#m").val(cmd);
  }
});
document.addEventListener("keydown", e => {
  if (e.ctrlKey && e.altKey && e.key.toLowerCase() === "d") {
    e.preventDefault();
    console.log("hyperactive rabbits")
    $(document.body).toggleClass("dark")
  }
});
