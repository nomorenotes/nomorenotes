$(function () {
  if (localStorage.banned) window.location.path = "/banned";
  var manotify = false;
  var notify = false;
  var socket = io();
  const debug = (window.location.hash == "#debug") ? ((d) => {
    $('#messages').append($('<li>', {class: "debug"}).text(`DEBUG: ${d}`));
  }) :
  ((d)=>{});
  debug("debugger activated");
  const hello = (socket, ...args) => {
    debug(`sent hello ${JSON.stringify(args)}`);
    socket.emit("hello", ...args);
  };
  socket.on("hello", ()=>{
    debug("recieved hello");
    hello(socket, localStorage.session ? localStorage.session : (localStorage.session = socket.id), "", "");
  });
  $('#send').submit(function(){
    debug(`sending message ${$("#m").val()}`);
    socket.emit('chat message', $('#m').val());
    $('#m').val('');
    return false;
  });
  socket.on('chat message', function(id, msg){
    debug(`recieving message ${id}: ${msg}`); 
    $('#messages').append($('<li>', {id}).html(msg));
    if (notify) {
      notify = manotify;
      alert(msg);
    }
    window.scrollTo(0, document.body.scrollHeight);
  });
  socket.on("gotping", (wasTargeted, source) => {
    debug(`recieving ${wasTargeted} ping from ${source}`);
    alert(`${source} has pinged ${wasTargeted ? "you" : "everyone"}!`);
    
  });
  socket.on("edit", (id, msg) => {
    debug(`editing message ${id} (${$(`#${id}`).text()}) to ${msg}`);
    $(`#${id}`).text(msg);
  });
  socket.on("setStorage", (key, value) => {
    debug(`storage[${key}] = ${value}`);
    localStorage[key] = value;
  });
  socket.on("delete", (id) => {
    debug(`deleting message ${id} (${$(`#${id}`).text()})`);
    document.getElementById(id).removeElement();
  });
  socket.on("reload", ()=>{debug("reloading");history.go(0);});
  socket.on("linkout", (url)=>{debug(`linking to ${url}`);open(url);});
  $.on("blur", ()=>{alert("blur");});
  document.getElementById('m').onpaste = function (event) {
    debug("beginning paste");
  // use event.originalEvent.clipboard for newer chrome versions
  var items = (event.clipboardData  || event.originalEvent.clipboardData).items;
  alert(JSON.stringify(items)); // will give you the mime types
  // find pasted image among pasted items
  var blob = null;
  for (var i = 0; i < items.length; i++) {
    if (items[i].type.indexOf("image") === 0) {
      blob = items[i].getAsFile();
    }
  }
  // load image if there is a pasted image
  if (blob !== null) {
    var reader = new FileReader();
    reader.onload = function(event) {
      alert(event.target.result); // data url!
      document.getElementById("pastedImage").src = event.target.result;
    };
    reader.readAsDataURL(blob);
  }
};
  }
    );
