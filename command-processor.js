'esversion: 6';
const cdict = {};
const fs = require("fs");
let mes = null;
let _userOps = null;
try {
  _userOps = JSON.parse(process.env.USEROPS || "['Administrator']");
} catch (e) {
  console.log(e);
  _userOps = ["Administrator"];
}
const catchBadCommand = false;
const { r } = require("./iomodule.js"); r.away = {};
r.away = {};
const apply_name = module.exports.apply_name = (who, name, talk = true) => {
  if (r.rnames[name]) {
    if (talk) mes(who, "cmdresp", `Name ${name} already authenticated.`, r.SYS_ID);
  } else {
    if (talk) mes(who.broadcast, "alert", `${who[r.s].name} has applied name ${name}.`, r.SYS_ID);
    console.log(`setting rnames[${who[r.s].name}] = undefined`, r.SYS_ID);
    r.rnames[who[r.s].name] = undefined;
    console.log(`setting r.rnames[${name}] = ${who}`);
    r.rnames[name] = who;
    console.log(`setting ${who.id}[r.s].name = ${name}`);
    who[r.s].name = name;
    if (talk) mes(who, "cmdresp", `Name ${name} applied successfully.`, r.SYS_ID);
    who.emit("saveable", "name", name);
  }
};
const main = module.exports = (_mes) => (msg, from, sudo = from) => {
  var edid, d; // because warnings
  mes = _mes;
  if (msg.startsWith("/")) {
    const args = msg.slice(1).split(" ");
    const cmd = args.shift();
    if (from._debug_command_detection) { from.emit("chat message", `Command detected! ${cmd}:${args}`); }
    if (from.op) {
      switch (cmd) { // OP COMMANDS
        case "sudo":
          return main(`/${cmd} ${args.join(" ")}`);
        case "/lockdown":
          let tolockn = args.shift();
          let tolock = r.rnames[tolockn];
          if (tolock) {
            tolock[r.s].lock = !tolock[r.s].lock;
            mes(sudo, "cmdresp", `${tolock[r.s].lock ? "L" : "Unl"}ocked ${tolockn} successfully.`);
          } else {
            mes(sudo, "cmdresp", `404: ${tolockn} not found!`);
          }
          return true;
        case "tellraw":
          mes(r.io, args.shift(), args.join(" "), r.SYS_ID); return true;
        case "_debug_command_detection_enable":
          from._debug_command_detection = true; return true;
        case "youare":
          let torename = r.rnames[args[1]];
          if (torename) {
            apply_name(torename, args[0], true, sudo);
          } else {
            mes(sudo, "cmdresp", `Could not rename nonexistent ${args[1]}.`, r.SYS_ID);
          } return true;
        case "release":
          r.rnames[args[0]] = 0; return true;

        case "_rawdelete":
          r.io.emit("delete", `${args[0]}`); return true;

        case "iamtruly":
          if (args[0] == from[r.s].name) {
            mes(sudo, "cmdresp", r.t.truly.you());
          } else {
            var totruth = r.rnames[args[0]];
            if (totruth) {
              mes(totruth, "alert", r.t.truly.kicky(from[r.s].name));
              mes(totruth.broadcast, "alert", r.t.truly.kick(totruth[r.s].name, from[r.s].name));
              totruth.silentLeave = true;
              totruth.disconnect(true);
            }
            apply_name(from, args[0], !totruth, sudo);
          }
          return true;

        case "_rawedit":
          d = new Date();
          edid = args.shift();
          r.io.emit("edit", `${args.shift()}`, r.t.message((d.getHours() + 8 + 12) % 24, d.getMinutes(), args.shift(), args.join(" "), edid)); return true;

        case "linkout":
          let tolink = args.shift();
          let tol = r.rnames[tolink];
          let link = args.join(" ");
          if (tol) {
            tol.emit("linkout", link);
            mes(sudo, "cmdresp", `Ok, ${tolink} is on ${link} now.`, r.SYS_ID);
            mes(tolink, "alert", `You were <a href="${link}" target=_blank>linked</a> by ${tolink[r.s].name}`)
          } else {
            mes(sudo, "cmdresp", `Error 404: ${tolink} not found!`, r.SYS_ID);
          } return true;

        case "code":
          from.emit("linkout", "https://github.dev/nomorenotes/nomorenotes")
          mes(from, "cmdresp", "You are now coding!")
          return true;
        case "op":
          let top = r.rnames[args[0]];
          if (top == undefined && args[0]) { mes(sudo, "cmdresp", `Error 404: ${args[0]} not found!`, r.SYS_ID); return true; }
          if (args[0]) {
            if (top.op)
              mes(sudo, "cmdresp", `${args[0]} seems about the same.`);
            else {
              mes(top.broadcast, "alert", `${from[r.s].name} thinks ${args[0]} seems more powerful.`);
              mes(top, "alert", `${from[r.s].name} thinks you seem more powerful.`, r.SYS_ID);
              top.op = true;
              top.emit("saveable", 1);
            }
            return true;
          } else {
            mes(sudo, "cmdresp", `Dude, wtf?? You can't op EVERYONE.`, r.SYS_ID);
            return true;
          }
          throw new Error("impossible");
        case "deop":
          let teop = r.rnames[args[0]];
          if (teop == undefined && args[0]) { mes(sudo, "cmdresp", `Error 404: ${args[0]} not found!`, r.SYS_ID); return true; }
          if (args[0]) {
            if (!teop.op)
              mes(sudo, "cmdresp", `${args[0]} seems about the same.`);
            else {
              mes(teop.broadcast, "alert", `${from[r.s].name} thinks ${args[0]} seems less powerful.`);
              mes(teop, "alert", `${from[r.s].name} thinks you seem less powerful.`, r.SYS_ID);
              teop.op = false;
              socket.emit("saveable", 0);
            }
          } else {
            mes(sudo, "cmdresp", `So THIS is why all our staff disappeared.`, r.SYS_ID);
            return true;
          }
          throw new Error("impossible");
        /*
        case "spam":
          let count = parseInt(args.shift());
          if (isNaN(count)) {mes(sudo, "cmdresp", `That's not a number, silly!`, r.SYS_ID);}
          else if (count < 0) {mes(sudo, "cmdresp", `How am I supposed to remove spam?`, r.SYS_ID);}
          else if (count == 0) {mes(sudo, "cmdresp", `Nothing is spammed.`, r.SYS_ID);}
          else {for (var i = 0; i <= (count < 200 ? count : 200); i++) {r.sendmsg(from)(args.join(" "));}}
          return true;/**/
        case "reload":
          let toload = r.rnames[args[0]];
          if (toload == undefined && args[0]) { mes(sudo, "cmdresp", `Error 404: ${args[0]} not found!`, r.SYS_ID); return true; }
          if (args[0]) {
            mes(sudo, "cmdresp", `${args[0]} has loaded again!`, r.SYS_ID);
            toload.emit("reload");
            return true;
          } else {
            mes(sudo, "cmdresp", `Look at the chaos. Everyone reloading.`, r.SYS_ID);
            from.broadcast.emit("reload");
            return true;
          }
          throw new Error("impossible");
        case "kick":
          let tokick = r.rnames[args[0]];
          if (tokick) {
            mes(tokick, "alert", `You were kicked from NoMoreNotes by ${from[r.s].name}.`, r.SYS_ID);
            var tokm = r.t.kick(tokick[r.s].name);
            tokick.silentLeave = true;
            tokick.disconnect(true);
            mes(tokick.broadcast, "alert", tokm);
          } else {
            mes(sudo, "cmdresp", `Error 404: ${args[0]} not found!`, r.SYS_ID);
          } return true;
        case "preban":
          let topban = r.rnames[args[0]];
          if (!topban) return mes(sudo, "cmdresp", `Error 404: ${args[0]} not found!`, r.SYS_ID);
          mes(sudo, `Are you completely sure you want to ban ${args[0]}`);
          from.ban = topban;
          return true;
        case "ban":
          if (args.length < 3) {
            mes(sudo, "cmdresp", "Name, time, and message are required.");
            from.ban = undefined;
            return true;
          }
          const target = args.shift();
          const timestr = args.shift();
          let toban = r.rnames[target];
          let time = parseFloat(timestr); // minutes - 1h = 60, 24h = 1440, 7d = 10080
          let m = args.join(" ")
          if (toban) {
            if (toban !== from.ban) mes(sudo, "Use /preban first.");
            toban.silentLeave = true;
            toban.emit("ban", from[r.s].name, time, m);
            toban.disconnect(true);
            var tobm = r.t.ban(tokick[r.s].name, time, m);
            mes(toban.broadcast, "alert", tobm);
          } else {
            mes(sudo, "cmdresp", `Error 404: ${target} not found!`, r.SYS_ID);
          }
          from.ban = undefined;
          return true;
        default:

      }
    }
    switch (cmd) { //NON-OP COMMANDS
      case "funpie":
        mes(sudo, "cmdresp", `${args[0]} and ${args[1]} are stinky!`, r.SYS_ID); return true;
      case "away":
        if (args[0]) {
          r.away[from.id] = args.join(" ");
          mes(r.io, "alert", `${from[r.s].name} away: ${args.join(" ")}`);
        } else {
          if (r.away[from.id]) {
            mes(r.io, "alert", `${from[r.s].name} back: ${r.away[from.id]}`);
            delete r.away[from.id];
          } else {
            mes(sudo, "cmdresp", "you were never away");
          }
        }
        return true;
      case "iam":
        if (!from.op) {
          if (r.surr.issurrogate(args[0])) {
            mes(sudo, "cmdresp", "Emojis are not allowed in names because it messes up the everything. Please choose something else.");
            return true;
          } else if (args[0].length > 16) {
            mes(sudo, "cmdresp", "The maximum name length is 16 characters.");
            return true;
          }
        }
        apply_name(from, args[0]); return true;
      case "w":
        let toname = args.shift();
        let to = r.rnames[toname];
        let msg = args.join(" ");
        if (to) {
          mes(to, "msg", `(private) &lt;${from[r.s].name}> ${msg}`, from);
          mes(sudo, "msg", `(to ${toname}) <${from[r.s].name}> ${msg}`, from);
          if (r.away[to.id]) {
            mes(sudo, "cmdresp", `${toname} away: ${r.away[to.id]}`);
          }
        } else {
          mes(sudo, "cmdresp", `Error 404: ${toname} not found!`, from);
        } return true;
      case "getid":
        let toid = args[1];
        let sock = r.rnames[toid];
        if (sock) {
          mes(sudo, "cmdresp", `"${toid}" has the ID $${sock.id}`, r.SYS_ID);
        } else {
          mes(sudo, "cmdresp", `Error 404: ${toid} not found!`, r.SYS_ID);
        }
        return true;
      case "_nowop":
        from.op = true;//from[r.s].name in _userOps; //jshint ignore:line
        return true;
      case "delete":
        r.io.emit("delete", `${from.id}${args[0]}`); return true;
      case "image":
        var imageid = args.shift();
        var comment = args.join(" ");
        mes(r.io, "msg", `${comment}<details open><summary>Image</summary><img alt="${comment}" src="${imageid}"></img></details>`); return true;
      case "video":
        var videoid = args.shift();
        var autoplay = "";
        var controls = "controls ";
        var vomment = args.join(" ");
        var changed = false;
        while (args[0].startsWith("+")) {
          console.log("parsing flag");
          if (args[0] == "+nocontrols") { controls = ""; args.shift(); console.log("found +nocontrols"); }
          else if (args[0] == "+autoplay") { autoplay = "autoplay "; args.shift(); console.log("found +autoplay"); }
          else { mes(sudo, "cmdresp", `Unknown flag ${args[0]}`); return true; }
        }
        console.log(`about to render video ${videoid}\n`);
        console.log(vomment ? `comment: ${vomment}` : vomment);
        console.log(`controls: ${controls} | autoplay: ${autoplay}`);
        mes(r.io, "msg", `${vomment}<details open><summary>Video</summary><video ${controls}${autoplay}alt="${vomment}" src="${videoid}"></img></details>`); return true;
      case "list":
        r.list.forEach(player => {
          mes(sudo, "cmdresp", `${player[r.s].name}: ${r.away[player.id] || "here"}`);
        });
        mes(sudo, "cmdresp", `${r.list.length} here`); return true;
      case "me":
        mes(r.io, "msg", r.t.action(from[r.s].name, args.join(" ")), from); return true;
      case "help":
        if (args[0]) {
          let helpdocid = args[0].replace(/\.|\/|\\/g, '');
          if (!from.op) helpdocid = helpdocid.replace("#", "");
          fs.readFile(`./help/${helpdocid}.txt`, "utf-8", (err, data) => {
            if (err) {
              if (err.code == "ENOENT") {
                mes(sudo, "cmdresp", `Help file ${helpdocid} not found.`);
              } else {
                mes(sudo, "cmdresp", `Error ${err.code} while reading ${helpdocid}.txt: ${err.message}`);
              }
              return true;
            }
            console.log(typeof data);
            data.split("\n").map(d => d.replace("\r\n", "\n").replace("\r", "\n")).filter(line => line).forEach(line => {
              mes(from, "cmdresp", `[Help ${helpdocid}]: ${line}`);
            });
            return true;
          });
        } else {
          fs.readdir("help", function (err, files) {
            //handling error
            if (err) {
              mes(sudo, "cmdresp", `Error ${err.code} while listing help pages: ${err.message}`);
              return true;
            }
            files = files
              .map(name => name
                .replace(".txt", "")
                .replace("help/"))
              .filter(name => !name.startsWith("%"))
              .filter(name => (from.op || !name.startsWith("#")));
            mes(sudo, "cmdresp", `List of help articles (use <button>/help filename</button> to read):  ${files.join(" ")}`);
            return true;
          });
        }
        return true;
      case "edit":
        d = new Date();
        r.io.emit("edit", `${from.id}${edid = args.shift()}`, r.t.message((d.getHours() + 8 + 12) % 24, d.getMinutes(), args.shift(), [`<${from[r.s].name}>`, ...args, `(edited)`].join(" "), edid)); return true;
      default:
        mes(sudo, "cmdresp", `Unrecognized command ${cmd}. The command does not exist, or you aren't allowed to run it. Run /help for help.`, r.SYS_ID); return catchBadCommand;
    }
    return catchBadCommand;
  }
  return false;
};
