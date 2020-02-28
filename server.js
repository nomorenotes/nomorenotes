var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;

const users = process.env.USERS ? JSON.parse(process.env.USERS) : {"admin": "adminpassword", "user": "userpassword"};

const names = {};

/*
const whoDisBot = {
  botName: "WhoDisBot",
  onJoin: (socket) => {
    setTimeout(this.whoDis, 1000*Math.random());
  },
  whoDis: () => {
    io.emit("chat message", `& <${this.botName}> who dis?`);
  },
  
  onLeave: (socket) => {
    setTimeout(this.whoDat(socket), 1000*Math.random());
  },
  whoDat: () => {
    io.emit("chat message", `& <${this.botName}> who dat?`);
  }
};
*/

const apply_name = (who, name) => {
  who.broadcast.emit("chat message", `! ${names[who.id]} has applied name ${name}.`);
  names[who.id] = name;
  who.emit("chat message", "@ Name applied successfully.");
};

const magic = (sender, msg) => {
  switch (msg) {
    case "/iam theop":
      apply_name(sender, "RootUser213"); return true;
    case "/iam Freshdude":
      apply_name(sender, "DarkWolf129"); return true;
    case "/iam Adam":
      //sender.disconnect(); return true;
      apply_name(sender, "Adam"); return true;
    case "/iam pokepat12":
      apply_name(sender, "Poképat12"); return true; 
    case "/iam Lazarbeam13":
      apply_name(sender, "Average Seth"); return true; 
    case "/bye":
      sender.emit("chat message", "@ Bye bye.");
      sender.disconnect();
    case "/len":
    case "/who":
    case "/ids":
      sender.emit("chat message", `% There are ${Object.keys(names).length} people online.`);
      if (msg == "/len") { return true; }
      let isid = (msg == "/ids");
      for (id in Object.keys(names)) {
        let name = names[id];
        sender.emit("chat message", ("% " + (isid ? `[${id}]: ` : "") + $(names[id])));
      }
    default:
      return false;
  }
};
const format_msg = msg => msg.replace("\\\\", "\f") // temp rm \\
                             .replace("\\r\\n", "\n")
                             .replace("\\r", "\\n")
                             .replace("\\n", "<br/>")
                             .replace("\\t", "\t")
                             .replace("\f", "\\\\")
                             .split("<br/>");



app.get('/chat', function(req, res){
  res.sendFile(__dirname + '/chat/index.html');
});

app.get("/favicon.ico", (req, res) => {
  res.sendFile(__dirname + "/favicon/drive.ico");
});

// static content
app.get("/chat.js", (req, res) => {
  res.sendFile(__dirname + "/chat/main.js");
});
app.get("/chat.css", (req, res) => {
  res.sendFile(__dirname + "/chat/styles.css");
});

app.get("/login.js", (req, res) => {
  res.sendFile(__dirname + "/login/main.js");
});
app.get("/login.css", (req, res) => {
  res.sendFile(__dirname + "/login/styles.css");
});



io.on('connection', function(socket){
  names[socket.id] = socket.id.slice(0,8);
  socket.emit("chat message", `! Welcome, <${names[socket.id]}>`);
  socket.broadcast.emit("chat message", `! <${names[socket.id]}> has joined.`);
  //whoDisBot.onJoin(socket);
  socket.on('chat message', msg => (
                                   magic(socket, msg) ?
                                   undefined :
                                   format_msg(msg).map((m) => {io.emit("chat message", `% <${names[socket.id]}> ${m}`);})
                                   ));
  socket.on("disconnect", () => {
    io.emit("chat message", `! <${names[socket.id]}> has left.`);
    //whoDisBot.onLeave(socket);
    delete names[socket.id];
  });
});

http.listen(port, function(){
  console.log('listening on *:' + port);
});
