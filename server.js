var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;
var iom = require("./iomodule.js");
iom.main(io);

const users = process.env.USERS ? JSON.parse(process.env.USERS) : {"admin": "adminpassword", "user": "userpassword"};

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

app.get("/favicon.ico", (req, res) => {
  res.sendFile(__dirname + "/favicon/drive.ico");
});

require("./site/module.js")(app); // site urls
require("./chat/module.js")(app); // chat urls
require("./login/module.js")(app); // login urls
require("./chframe/module.js")(app); // chat frame

http.listen(port, function(){
  console.log('listening on *:' + port);
});
