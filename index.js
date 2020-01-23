var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

app.get("/favicon.ico", (req, res) => {
  res.sendFile(__dirname + "/favicon/drive.ico");
});

io.on('connection', function(socket){
  socket.emit(`! Welcome, <${socket.id}>`);
  socket.broadcast.emit(`! <${socket.id}> has joined.`);
  socket.on('chat message', function(msg){
    msg.replace("\\\\", "\f") // temp rm \\
       .replace("\\r\\n", "\n")
       .replace("\\r", "\\n")
       .replace("\\n", "<br/>")
       .replace("\\t", "\t")
       .replace("\f", "\\\\")
       .split("<br/>")
       .map((m) => {io.emit("chat message", `% <${socket.id}> ${m}`);});
  });
});

http.listen(port, function(){
  console.log('listening on *:' + port);
});
