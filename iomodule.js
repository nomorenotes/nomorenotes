module.exports = {};
const pf = require("./prefixes.js");
const names = {};
const apply_name = module.exports.apply_name = (who, name) => {
  who.broadcast.emit("chat message", `${pf.alert} ${names[who.id]} has applied name ${name}.`);
  names[who.id] = name;
  who.emit("chat message", `${pf.cmdresp} Name applied successfully.`);
};



const magic = module.exports.magic = (sender, msg) => {
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
    default:
      return false;
  }
};


const format_msg = module.exports.format_msg = msg => msg.replace("\\\\", "\f") // temp rm \\
                                                         .replace("\\r\\n", "\n")
                                                         .replace("\\r", "\\n")
                                                         .replace("\\n", "<br/>")
                                                         .replace("\\t", "\t")
                                                         .replace("\f", "\\\\")
                                                         .replace("class", "\f")
                                                         .replace("ass", "but")
                                                         .replace("\f", "class")
                                                         .replace("fuck", "truck")
                                                         .replace("shit", "ship")
                                                         .split("<br/>");

module.exports.main = (io) => {
  io.on('connection', function(socket){
    names[socket.id] = socket.id.slice(0,8);
    socket.emit("chat message", `${pf.alert} Welcome, <${names[socket.id]}>`);
    socket.broadcast.emit("chat message", `${pf.alert} <${names[socket.id]}> has joined.`);
    //whoDisBot.onJoin(socket);
    socket.on('chat message', msg => (
                                     magic(socket, msg) ?
                                     undefined :
                                     format_msg(msg).map((m) => {io.emit("chat message", `${pf.msg} <${names[socket.id]}> ${m}`);})
                                     ));
    socket.on("disconnect", () => {
      io.emit("chat message", `${pf.alert} <${names[socket.id]}> has left.`);
      //whoDisBot.onLeave(socket);
      names[socket.id] = undefined;
    });
  });
}
