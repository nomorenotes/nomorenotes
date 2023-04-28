const LANG = "en_us";
const SYS_ID = { id: "system" };
const senderid = { [SYS_ID.id]: 0 };
const USERDICT = process.env.USER || {};
/** @type {any} */
const _ = undefined;
/** @type {(value: any) => any} */
const any = (a) => a;
/**
Holds common data for common data storage.
@type {import("./types/server").R}
*/
const r = {
  al: process.env.al || "gU ",
  SYS_ID,
  USERDICT,
  dbg: require("./fancify_log.js")(require("debug")("nmn")),
  s: _,
  nexusData: require("./servers_list.js"),
  nexusSyms: {
    other: "&nbsp;",
    here: ">",
    noid: "!",
  },
  surr: require("./surr.js"),
  pf: require("./prefixes.js"),
  t: _,
  list: [],
};
// @ts-expect-error - Symbol() isn't unique enough
// and when I tried to put this comment in the
// assignment, it silenced the entire expression
r.s = Symbol("nomorenotes");
r.t = require("./texts.js")(r)[LANG];
/** @type {ServerType} */
// @ts-expect-error overwritten before it should be a problem
let io = null;
const baseLog = r.dbg.extend("io");
const MAIL_OPTS = {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
};
const mailLog = baseLog.extend("mail");
mailLog("mail url:", process.env.MAIL_URL);
r.mail = (content, username = "Server") => {
  mailLog(`mailing ${username}: ${content}`);
  let proms = [];
  for (let url of (process.env.MAIL_URL || "").split(";")) {
    if (!url) continue;
    mailLog(`Discord mail: ${url}`);
    proms.push(
      fetch(url, {
        ...MAIL_OPTS,
        body: JSON.stringify({ username, content }),
      })
    );
  }
  if (!content.startsWith("Server restarted @ ")) {
    for (let nmnurl of (process.env.NMN_MAIL_URL || "").split(";")) {
      if (!nmnurl) continue;
      let sender = username + (process.env.NMN_MAIL_SUFFIX ?? "");
      mailLog(`NMN mail: ${nmnurl}`);
      proms.push(
        fetch(nmnurl, {
          ...MAIL_OPTS,
          body: JSON.stringify({ message: content, sender }),
        })
      );
    }
  }
  return Promise.all(proms);
};
const fetch = require("node-fetch");
r.sendmsg = (from) => (msg) => {
  msg = format_msg(r.parse_emoji(msg));
  const isMagic = magic(from, msg);
  if (!isMagic) {
    r.mail(msg, from[r.s].name);
    return msg.split("<br/>").map((m) => {
      mes(
        from[r.s].hotboxed ? from : r.io,
        "msg",
        r.t.chat(from[r.s].name, m),
        from
      );
    });
  }
};
r.parse_emoji = ((e) => (msg) => {
  for (let i of Object.keys(e)) {
    // This is how 4-loops work, right?
    if (e.hasOwnProperty(i)) {
      msg = msg.replace(new RegExp(`:${i}:`, "g"), e[i]);
    }
  }
  return msg;
})(require("./emoji.js"));
//const names = {};
const rnames = {};
const mesLog = baseLog.extend("mes");
const mes = (r.mes = (who, prefix, msg, sender = SYS_ID) => {
  if (who === io && prefix === "msg" && sender !== SYS_ID) {
    io.to("preview").emit(msg);
  }
  if (who === io) who = io.to("main");
  mesLog(
    `mes: ${typeof sender} ${sender} send ${prefix} to ${typeof who} ${who}: ${msg}`
  );
  var d = new Date();
  who.emit(
    "chat message",
    `${sender.id}${senderid[sender.id]}`,
    r.t.message(
      (d.getHours() + 7 + 12) % 24,
      d.getMinutes(),
      prefix,
      msg,
      senderid[sender.id]++
    )
  );
});
const ipToSocket = {};
//r.names = names;
r.rnames = rnames;
r.senderid = senderid;
module.exports.r = r;
const magic = (module.exports.magic = (sender, msg) => {
  if (!msg || r.cmdmod(msg, sender, sender)) {
    return true;
  }
});
const format_msg = (module.exports.format_msg = (msg) =>
  msg
    .replace(/\\\\/g, "\f") // temp rm \\
    .replace(/\\r\\n/gi, "\n")
    .replace(/\\n/gi, "<br/>")
    .replace(/\f/g, "\\\\")
    .replace(/(?<=^|\W)ass+/gim, "but")
    .replace(/f\W*u\W*c\W*k/gi, "truck")
    .replace(/s\W*h\W*[1li]\W*t/gi, "ship")
    .replace(/b\W*[1li]\W*t\W*c\W*h/gi, "female dog")
    .replace(/s\W*h\W*u\W*t\W*u\W*p/gi, "shut down")
    .replace(/t\W*r\W*a\W*n\W*n\W*y/gi, "tyrannosaurus rex")
    .replace(/d\W*[1liy]\W*k\W*e/gi, "chuiwawa")
    .replace(/f\W*a\W*g\W*g\W*o\W*t/gi, "french fry")
    .replace(/n\W*[1li]\W*g(\W*g)?\W*(e|a)\W*r?/gi, "nacho")
    .replace(/j\W*o\W*s\W*e/gi, "jesus")
    .replace(/t\W*r\W*u\W*m\W*p/gi, "trombone") // joke
    .replace(/J\W*o\W*e\W*B\W*[1li]\W*d\W*e\W*n/gi, "Jeffery Bezos") // joke
    .replace(/h\W*e\W*f\W*f\W*e\W*r/gi, "helper")
    .replace(/s\W*l\W*u\W*t/gi, "serial killer")
    .replace(/w\W*h\W*o\W*r\W*e/gi, "horse")
    .replace(/d\W*[1li]\W*c\W*k/gi, "dinosaur")
    .replace(/c\W*o\W*c\W*k/gi, "cabbage")
    .replace(/c\W*a\W*b\W*l\W*e/gi, "cock") // joke
    .replace(/c\W*u\W*n\W*t/gi, "putter")
    .replace(/p\W*u\W*s\W*s\W*y/gi, "kitty")
    .replace(/p\W*e\W*n\W*i\W*s/gi, "pencil")
    .replace(/v\W*a\W*g\W*[1li]\W*n\W*a/gi, "vinegar")
    .replace(/s\W*e\W*x/gi, "saltwater")
    .replace(/(?!(?<=do)cument)c\W*u\W*m/gi, "ice cream")
    .replace(/p\W*[ro0]?\W*[r0o]\W*n/gi, "corn")
    .replace(/h\W*w?\W*[3e]\W*n\W*t\W*a?\W*[1li]/gi, "hitmen")
    .replace(
      /\{r\/([a-zA-Z0-9]{3,21})\}/,
      (_match, sub) =>
        `<a href="//bob.fr.to/r/${sub}" target=_blank>r/${sub}</a>`
    )); // autolink subs

/*.replace(/</g, "&lt;")
.replace(/>/g, "&gt;")
.replace(/%$/g, "<")
.replace(/$%/g, ">")*/
const rids = {};
const { inspect } = require("util");
const {
  performance: { now },
} = require("perf_hooks");
baseLog("performing", typeof now);
const joinLog = baseLog.extend("join");
const evalLog = baseLog.extend("eval");
const chatLog = baseLog.extend("chat");
const imageLog = chatLog.extend("image");
module.exports.main = (_io) => {
  io = r.io = _io;
  r.cmdmod = require("./command-processor.js")(mes);
  require("./upload.js")(io);
  r.mail(`Server restarted @ ${r.commit}`);
  io.on("connection", (socket) => {
    joinLog("Existence", socket.id);
    socket[r.s] = {};
    socket._id = socket.id;
    socket[r.s].name = "Guest-" + socket.id.slice(0, 3);
    socket.on("eval", async (expr, callback) => {
      const startTime = now();
      evalLog(`Evaluating ${expr}`);
      let retval = eval(expr);
      let wasPromise = false;
      if (retval instanceof Promise) {
        wasPromise = true;
        retval = await retval;
      }
      const endTime = now();
      const inspected = inspect(retval, {
        compact: false,
        depth: Infinity,
        breakLength: Infinity,
      });
      callback(`>>> ${expr}
===${endTime - startTime}ms${wasPromise ? " (async)" : ""}
${inspected}`);
    });
    socket.toString = () => {
      return `[Socket ${socket[r.s].name}]`;
    };
    socket.on("saveable", (name, value) => {
      switch (name) {
        case "name":
          if (rnames[value]) {
            mes(socket, "alert", "Sorry, your saved name was taken.");
            mes(
              rnames[value],
              "alert",
              `You prevented ${socket[r.s].name} from getting their name.`
            );
          } else {
            socket[r.s].name = value;
          }
          break;
        case "mode":
          switch (+value) {
            case -3:
              socket.emit("chat message", "alert", "You are banned!");
              socket.disconnect(true);
              break;
            case 1:
              socket[r.t].op = true;
              break;
            default:
              socket[r.t].op = false;
          }
          break;
        case "userdata":

        default:
          socket.emit(
            "chat message",
            `US${name}`,
            `recieved unknown saveable "${name}"="${value}"`
          );
      }
    });
    socket.once("hello", (session, uname, passw) => {
      joinLog("Hello");
      if (uname === "nmn-link") {
        return nmnlink(session);
      }
      if (!USERDICT[uname]) {
        socket.emit("loginbad", `Unknown user ${uname}`);
      }
      if (!session) socket.emit("authenticate", (session = socket.id));
      if (
        io.guestlock &&
        socket[r.s].name === "Guest-" + socket.id.slice(0, 3)
      ) {
        socket.emit(
          "chat message",
          "guestlock",
          "Guests are currently locked out of this server."
        );
        socket.disconnect(true);
        return;
      }
      joinLog("Survived removal");
      rnames[socket[r.s].name] = socket;
      //socket.id = session ? session : socket.id;
      socket.join("main");
      mes(
        socket,
        "alert",
        r.t.join_self(socket[r.s].name, session, r.t.join_extra()),
        SYS_ID
      );
      mes(socket, "alert", r.t.help(), SYS_ID);
      mes(
        socket.broadcast,
        "alert",
        r.t.join(socket[r.s].name, require("./motd.js")),
        SYS_ID
      );
      socket.on("chat message", (msg) => chatLog(socket[r.s].name, msg)); // who doesn't love log spam
      socket.on("chat message", r.sendmsg(socket));
      socket.on("image", (im) => {
        imageLog(socket[r.s].name, im);
      });
      r.list.push(socket);
      rids[socket.id] = socket;
      senderid[socket.id] = 0;
      r.mail(`${socket[r.s].name} has joined.`);
      socket.on("disconnect", () => {
        if (!socket.silentLeave) {
          mes(socket.broadcast, "alert", r.t.leave(socket[r.s].name), SYS_ID);
          r.mail(`${socket[r.s].name} has left. T`);
        }
        //whoDisBot.onLeave(socket);
        delete rnames[socket[r.s].name];
        delete rids[socket.id];
        delete senderid[socket.id];
        delete socket[r.s];
        r.list.splice(r.list.indexOf(socket), 1);
      });
    });
    setTimeout(() => socket.emit("hello"), 250);
  });
};

function nmnlink(socket) {
  io.on("ban", (id, time, reason, callback) => {
    try {
      if (id in rids) {
        const toban = rids[id];
        const tobm = r.t.ban(toban[r.s].name, socket[r.s].name, time, m);
        toban.emit("ban", socket[r.s].name, time, m);
        toban.disconnect(true);
        mes(r.io, "alert", tobm);
        callback(true);
      } else {
        callback(false);
      }
    } catch (e) {
      callback(e);
    }
  });
}

function updatenmnlink() {
  io.to("nmnlink").emit(
    "users",
    r.list.map((socket) => ({ name: socket[r.s].name, id: socket.id }))
  );
}
