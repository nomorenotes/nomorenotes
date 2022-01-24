const r = {};
let io = null;
r.al = process.env.al || "gU ";
r.s = Symbol("nomorenotes");
const LANG = "en_us";
const SYS_ID = { id: "system" };
const senderid = { [SYS_ID.id]: 0 };
const USERDICT = process.env.USER || {};
r.USERDICT = USERDICT;
r.SYS_ID = SYS_ID;
r.nexusData = require("./servers.json");
r.nexusSyms = {
  "other": "&nbsp;",
  "here": ">",
  "noid": "!"
}
module.exports = {};
r.io = null;
r.surr = require("./surr.js")
r.pf = require("./prefixes.js");
r.t = require("./texts.js")(r)[LANG];
r.list = [];
r.sendmsg = from => msg => {
  msg = format_msg(r.parse_emoji(msg));
  return magic(from, msg) ?
    undefined :
    msg.split("<br/>")
      .map((m) => {
        mes(from.hotboxed ? from : r.io, "msg", r.t.chat(from[r.s].name, m), from);
      });
};
r.parse_emoji = (e => msg => {
  for (let i of Object.keys(e)) { // This is how 4-loops work, right?
    if (e.hasOwnProperty(i)) {
      msg = msg.replace(new RegExp(`:${i}:`, "g"), e[i]);
    }
  }
  return msg;
})(require("./emoji.js"));
//const names = {};
const rnames = {};
const mes = (who, prefix, msg, sender = SYS_ID) => {
  if (who === io && prefix === "mes" && sender !== SYS_ID) {
    io.to("preview").emit(msg)
  }
  if (who === io) who = io.to("main");
  console.log(`mes: ${typeof sender} ${sender} send ${prefix} to ${typeof who} ${sender}: ${msg}`);
  var d = new Date();
  who.emit("chat message", `${sender.id}${senderid[sender.id]}`, r.t.message((d.getHours() + 7 + 12) % 24, d.getMinutes(), prefix, msg, senderid[sender.id]++));

};
const ipToSocket = {};
//r.names = names;
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
      sender[r.s].name = sender.id.slice(0, 8);
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
  .replace(/(?<=^|\W)ass+/igm, "but")
  .replace(/f\W*u\W*c\W*k/ig, "truck")
  .replace(/s\W*h\W*[1li]\W*t/ig, "ship")
  .replace(/b\W*[1li]\W*t\W*c\W*h/ig, "female dog")
  .replace(/s\W*h\W*u\W*t\W*u\W*p/ig, "shut down")
  .replace(/t\W*r\W*a\W*n\W*n\W*y/ig, "tyrannosaurus rex")
  .replace(/d\W*[1li]\W*k\W*e/ig, "chuiwawa")
  .replace(/f\W*a\W*g\W*g\W*o\W*t/ig, "french fry")
  .replace(/n\W*[1li]\W*g\W*g\W*(e|a)\W*r?/ig, "nacho")
  .replace(/j\W*o\W*s\W*e/ig, "jesus")
  .replace(/t\W*r\W*u\W*m\W*p/ig, "trombone") // joke
  .replace(/J\W*o\W*e\W*B\W*[1li]\W*d\W*e\W*n/ig, "Jeffery Bezos") // joke
  .replace(/h\W*e\W*f\W*f\W*e\W*r/ig, "helper")
  .replace(/s\W*l\W*u\W*t/ig, "serial killer")
  .replace(/d\W*[1li]\W*c\W*k/ig, "dinosaur")
  .replace(/c\W*o\W*c\W*k/ig, "cabbage")
  .replace(/c\W*a\W*b\W*l\W*e/ig, "cock") // joke
  .replace(/c\W*u\W*n\W*t/ig, "putter")
  .replace(/p\W*u\W*s\W*s\W*y/ig, "kitty")
  .replace(/p\W*e\W*n\W*i\W*s/ig, "pencil")
  .replace(/v\W*a\W*g\W*[1li]\W*n\W*a/ig, "vinegar")
  .replace(/s\W*e\W*x/ig, "saltwater")
  .replace(/c\W*u\W*m/ig, "ice cream")
  .replace(/p\W*[ro0]?\W*[r0o]\W*n/ig, "corn")
  .replace(/h\W*w?\W*[3e]\W*n\W*t\W*a?\W*[1li]/, "hitmen")
  
/*.replace(/</g, "&lt;")
.replace(/>/g, "&gt;")
.replace(/%$/g, "<")
.replace(/$%/g, ">")*/
module.exports.main = (_io) => {
  io = r.io = _io;
  r.cmdmod = require("./command-processor.js")(mes);
  /* io.use((client, next) => {
    console.log(io.request.connection.remoteAddress);
    client.ipAddress = io.request.connection.remoteAddress;
    next();
  }); */
  io.on("connection", (socket) => {
    console.log("Existence")
    socket[r.s] = {};
    socket._id = socket.id;
    socket[r.s].name = "Guest-" + socket.id.slice(0, 3);
    socket.toString = () => {
      return `[Socket ${socket[r.s].name}]`
    }
    socket.on('saveable', (name, value) => {
      switch (name) {
        case "name":
          if (rnames[value]) {
            mes(socket, "alert", "Sorry, your saved name was taken.");
            mes(rnames[value], "alert", `You prevented ${socket[r.s].name} from getting their name.`);
          } else {
            socket[r.s].name = value;
          }
          break;
        case "mode":
          switch (+value) {
            case -3:
              socket.emit("chat message", "You are banned!");
              socket.disconnect(true);
              break;
            case 1:
              socket[r.t].op = true;
              break;
            default:
              socket[r.t].op = false;
          }
          break;
        default:
          socket.emit("chat message", `US${name}`, `recieved unknown saveable "${name}"="${value}"`);
      }
    });
    socket.on('hello', (session, uname, passw) => {
      console.log("Hello")
      socket.removeAllListeners();
      if (!USERDICT[uname]) { socket.emit("loginbad", `Unknown user ${uname}`); }
      if (!session) socket.emit("authenticate", session = socket.id);
      if (io.guestlock && socket[r.s].name === "Guest-" + socket.id.slice(0, 3)) {
        socket.emit("chat message", "guestlock", "Guests are currently locked out of this server.")
        socket.disconnect(true);
        return;
      }
      console.log("Survived removal")
      rnames[socket[r.s].name] = socket;
      //socket.id = session ? session : socket.id;
      socket.join("main");
      mes(socket, "alert", r.t.join_self(socket[r.s].name, session), SYS_ID);
      mes(socket.broadcast, "alert", r.t.join(socket[r.s].name), SYS_ID);
      socket.on("chat message", msg => console.log(`[CHAT ${socket[r.s].name}] ${msg}`)); // who doesn't love log spam
      socket.on('chat message', r.sendmsg(socket));
      socket.on("image", (im) => { console.log(im); });
      r.list.push(socket);
      senderid[socket.id] = 0;
      socket.on("disconnect", () => {
        if (!socket.silentLeave) mes(socket.broadcast, "alert", r.t.leave(socket[r.s].name), SYS_ID);
        //whoDisBot.onLeave(socket);
        delete rnames[socket[r.s].name];
        delete senderid[socket.id];
        delete socket[r.s];
        r.list.splice(r.list.indexOf(socket), 1);
      });
    });
    socket.on("preview", () => {
      console.log("Preview")
      socket.removeAllListeners()
      socket.join("preview")
    })
    setTimeout(() => socket.emit("hello"), 250);
  });
};
