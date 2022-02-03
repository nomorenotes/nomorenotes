var express = require('express');
const bodyParser = require("body-parser");
var app = express();
app.use(bodyParser.text())
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;
var iom = require("./iomodule.js");
iom.main(io);

io.toString = () => "[IO]"

app.use(bodyParser.raw())
const users = process.env.USERS ? JSON.parse(process.env.USERS) : {"admin": "adminpassword", "user": "userpassword"};

process.on("uncaughtException", e=>(console.error(e),e));

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
app.use('/lib', express.static(__dirname + '/lib'))
app.get("/favicon.ico", (req, res) => {
  res.sendFile(__dirname + "/favicon/drive_new.ico");
});
app.get("/story.txt", (req, res) => {
  res.sendFile(__dirname + "/story.txt");
});
app.get("/themes.json", (req, res) => {
  res.sendFile(__dirname + "/themes.json");
});

require("./site/module.js")(app); // site urls
require("./chat/module.js")(app); // chat urls
require("./login/module.js")(app); // login urls
require("./test/module.js")(app); // will always give a fake error
require("./vis/module.js")(app); // edit ALL the saveables

app.get("/banned", (req, res) => {
  res.sendFile(__dirname + "/banned.html");
});

app.get("/timer", (req, res) => {
  res.sendFile(__dirname + "/timer.html");
});

app.get("/nopine", (req, res) => {
  res.sendFile(__dirname + "/nopine.html");
});

app.post("/hook/:name", (req, res) => {
  
})

http.listen(port, function(){
  console.log('listening on *:' + port);
});
