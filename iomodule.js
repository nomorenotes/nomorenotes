const r = {};
const LANG = "en_us";
const SYS_ID={id:"system"};
const senderid = {[SYS_ID.id]: 0};
const USERDICT = {"username": "cGFzc3dvcmQ"};
r.USERDICT = USERDICT;
r.SYS_ID = SYS_ID;
module.exports = {};
r.io = null;
r.pf = require("./prefixes.js");
r.t = require("./texts.js")(r)[LANG];
r.list = [];
r.sendmsg = from => msg => (
  magic(from, msg) ?
    undefined :
    format_msg(msg)
     .map((m) => {
      mes(r.io, "msg", r.t.chat(names[from.id], m), from);
}));
const names = {};
const rnames = {};
const mes = (who, prefix, msg, sender = SYS_ID) => {
  console.log(`mes: ${typeof sender} send ${prefix} to ${typeof who}: ${msg}`);
  var d = new Date();
  who.emit("chat message", `${sender.id}${senderid[sender.id]}`, r.t.message((d.getHours() + 7 + 12) % 24, d.getMinutes(), prefix, msg, senderid[sender.id]++));
};
const ipToSocket = {};
r.names = names;
r.rnames = rnames;
r.senderid = senderid;
module.exports.r = r;
const magic = module.exports.magic = (sender, msg) => {
  if (r.cmdmod(msg, sender, sender)) {
    return true;
  }
  switch (msg) {
    //case "/iam Freshdude":
    //  apply_name(sender, "DarkWolf129"); return true;
    case "/iam Adam":
      //sender.disconnect(); return true;
      //apply_name(sender, "Azandfer");
      return true;
      //case "/iam pokepat12":
      //  apply_name(sender, "Poképat12"); return true;
    case "/imnot":
      names[sender.id] = sender.id.slice(0, 8);
      mes(sender, "cmdresp", `You are now annonymous.`, SYS_ID);
      return true;
    case "":
      return true;
    case "/moo":
      mes(sender, "cmdresp", `There are no easter eggs in this program.`, SYS_ID);
      return true;
      //case "/_debug_dump_naming":
      //  mes(sender, "cmdresp", `names: ${JSON.stringify(names)}\nrnames: ${JSON.stringify(rnames)}`);
    default:
      if (msg.startsWith("/iam")) return true;
      return false;
  }
};
const format_msg = module.exports.format_msg = msg => msg.replace("\\\\", "\f") // temp rm \\
  .replace(/\\r\\n/g, "\n")
  .replace(/\\r/g, "\\n")
  .replace(/\\n/g, "<br/>")
  .replace(/\\t/g, "\t")
  .replace(/\f/g, "\\\\")
  .replace(/ass+ /ig, "but")
  .replace(/fuck/ig, "truck")
  .replace(/shit/ig, "ship")
  .replace(/bitch/ig, "female dog")
  .replace(/shut up/ig, "shut down")
  /*.replace(/</g, "&lt;")
  .replace(/>/g, "&gt;")
  .replace(/%$/g, "<")
  .replace(/$%/g, ">")*/
  .split("<br/>");
module.exports.main = (io) => {
  r.io = io;
  r.cmdmod = require("./command-processor.js")(mes);
  /*io.use((client, next) => {
    console.log(io.request.connection.remoteAddress);
    client.ipAddress = io.request.connection.remoteAddress;
    next();
  });*/
  io.on("connection", (socket) => {
    console.log(`[CONN ${socket.id.slice(0, 8)}] ${socket.id}`); 
    socket.on('hello', (session, uname, passw) => {
      console.log(`[HELO ${socket.id.slice(0, 8)}] ${session}|${uname}:${passw}`);
      if (!USERDICT[uname]) {socket.emit("loginbad", `Unknown user ${uname}`);};
      if (!session) socket.emit("authenticate", session = socket.id);
      socket._id = socket.id;
      socket.id = /*session ? session :*/ socket.id;
      socket.join("main");
      names[socket.id] = socket.id.slice(0, 8);
      rnames[names[socket.id]] = socket;
      mes(socket, "alert", r.t.join_self(names[socket.id], session), SYS_ID);
      mes(socket.broadcast, "alert", r.t.join(names[socket.id]), SYS_ID);
      socket.on("chat message", msg => console.log(`[CHAT ${names[socket.id]}] ${msg}`)); // who doesn't love log spam
      socket.on('chat message', r.sendmsg(socket));
      socket.on("image", (im) => {console.log(im);});
      r.list.push(socket);
      senderid[socket.id] = 0;
      socket.on("disconnect", () => {
        if(!socket.silentLeave) mes(socket.broadcast, "alert", r.t.leave(names[socket.id]), SYS_ID);
        //whoDisBot.onLeave(socket);
        delete rnames[names[socket.id]];
        delete senderid[socket.id];
        names[socket.id] = undefined;
        r.list.splice(r.list.indexOf(socket), 1);
        console.log(`[BYBY ${socket.id.slice(0, 8)}] ${socket.id}`);
      });
    });
    console.log(`[SELO ${socket.id.slice(0, 8)}] ${socket.id}`); 
    setTimeout(()=>socket.emit("hello"), 250);
  });
};
