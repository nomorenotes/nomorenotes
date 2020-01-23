var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;

const users = process.env.USERS ? JSON.parse(process.env.USERS) : {"admin": "adminpassword", "user": "userpassword"};

const names = {};

const magic = msg => {
  switch (msg) {
    default:
      return false;
  }
}

const format_msg = msg => msg.replace("\\\\", "\f") // temp rm \\
                             .replace("\\r\\n", "\n")
                             .replace("\\r", "\\n")
                             .replace("\\n", "<br/>")
                             .replace("\\t", "\t")
                             .replace("\f", "\\\\")
                             .split("<br/>");

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

app.get("/favicon.ico", (req, res) => {
  res.sendFile(__dirname + "/favicon/drive.ico");
});

io.on('connection', function(socket){
  names[socket.id] = socket.id.slice(0,8);
  socket.emit("chat message", `! Welcome, <${names[socket.id]}>`);
  socket.broadcast.emit("chat message", `! <${names[socket.id]}> has joined.`);
  socket.on('chat message', msg => (
                                   magic(msg)
                                   ? format_msg(msg).map((m) => {io.emit("chat message", `% <${names[socket.id]}> ${m}`);})
                                   : undefined
                                   ));
  socket.on("disconnect", () => { io.emit("chat message", `! <${names[socket.id]}> has left.`); names[socket.id] = undefined;});
});

http.listen(port, function(){
  console.log('listening on *:' + port);
});
