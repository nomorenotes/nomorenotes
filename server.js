try {
  require.resolve("xxhash")
} catch (e) {
  console.log("installing packages")
  require("child_process").execSync("npm", ["ci"])
}

const { existsSync } = require("fs")
if (existsSync("./env.json")) {
  Object.assign(process.env, require("./env.json"))
}

const express = require('express');
const cors = require('cors');
const { execSync } = require("child_process")
const { hash: NOCRYPT_hash } = require("xxhash")
const { auth, requiresAuth, attemptSilentLogin } = require('express-openid-connect');
const bodyParser = require("body-parser");
const { request } = require("https")
const { inspect } = require("util")
const INSPECTARGS = {
	showHidden: true,
	depth: Infinity,
	getters: true
}
var app = express();
app.use(bodyParser.json())
var http = new (require('http').Server)(app);
var io = new (require('socket.io').Server)(http, {
	maxHttpBufferSize: Infinity,
	cors: {
		origin: ["admin.socket.io", "nmn.bad.mn", "nomorenotes.us.auth0.com"],
		credentials: true
	}
});
var port = process.env.PORT || 3000;
var iom = require("./iomodule.js");
iom.r.commit = process.env.HEROKU_SLUG_COMMIT ?? execSync("git rev-parse HEAD")
iom.main(io);
const logger = iom.r.dbg.extend("server")

io.toString = () => "[IO]"

// From https://stackoverflow.com/a/4673436
if (!String.prototype.format) {
  String.prototype.format = function() {
    var args = arguments;
    return this.replace(/{(\d+)}/g, function(match, number) { 
      return typeof args[number] != 'undefined'
        ? args[number]
        : match
      ;
    });
  };
}    

const { default: jwt_decode } = require("jwt-decode")
const { data, save, touch } = require("./db.js")
const exc = (e) => { throw e }
app.use(auth({
  authRequired: false,
  auth0Logout: true,
  baseURL: process.env.URL || exc(new Error("Please set process.env.URL")),
  clientID: 'AowNHc7SuoxW3jVCjUb0qHIb8BKwXTQT',
  issuerBaseURL: 'https://nomorenotes.us.auth0.com',
  secret: process.env.AUTH0_SECRET, // fs.readFileSync(__filename, "utf-8")
  afterCallback(req, res, session) {
    const { sub } = jwt_decode(session.id_token)
    if (sub in data) {
      return session;
    } else {
      res.redirect("/setup")
    }
    // if ("app" in obj) Object.assign(obj.app, app_metadata); else obj.app = app_metadata
    // if ("user" in obj) Object.assign(obj.apuserp, user_metadata); else obj.user = user_metadata
    return session
  }
}));

app.use(bodyParser.raw())

app.get("/setup", requiresAuth(), (req, res) => {
  res.render()
})
const eaglerUrl = "https://raw.githubusercontent.com/PoolloverNathan/eaglercraft/main/stable-download/Offline_Download_Version.html"
const eaglerLog = logger.extend("eagler")
app.get(["/eagler", "/eagler/dl"], (req, res) => {
  const r = request(eaglerUrl)
  const rqToken = (Math.random().toString().split(".")[1] || "").slice(0, 4).padStart(4, 0)
  const log = eaglerLog.extend(rqToken)
  log("Downloading")
  if (req.originalUrl.includes("dl")) {
    log("Setting Content-Disposition");
    res.setHeader("Content-Disposition", 'attachment; filename="eagler.html"')
  }
  r.on("response", message => {
    log("Piping")
    message.pipe(res)
  })
  r.end()
})
app.get("/eagler/:name", (req, res) => res.redirect(301, "/eagler"))
app.get("/eagler/:name/dl", (req, res) => res.redirect(301, "/eagler/dl"))
const users = process.env.USERS ? JSON.parse(process.env.USERS) : { "admin": "adminpassword", "user": "userpassword" };

process.on("uncaughtException", e => {
  logger("Uncaught exception!\n", e.stack, logger.ERROR)  
});

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

app.get("/unban", (req, res) => {
  res.render("unban.pug")
})

require("./site/module.js")(app); // site urls
require("./chat/module.js")(app); // chat urls
require("./login/module.js")(app); // login urls
require("./test/module.js")(app); // will always give a fake error
require("./vis/module.js")(app); // edit ALL the saveables
require("./upload/module.js")(app); // file uploader

app.get("/banned", (req, res) => {
	res.sendFile(__dirname + "/banned.html");
});

const getFileLog = logger.extend("getfile")
app.get("/getfile/:anything", (req, res) => {
  if (req.headers.authorization) {
    const [ username, password ] = atob(req.headers.authorization.slice(6)).split(":")
    getFileLog("%j -> %j", username, password)
    if (!username.includes("asdf")) {
      const store = touch("creds")
      if (username in store) {
        const pwords = store[username]
        if (pwords.includes(password)) {
          getFileLog("...dupe")
        } else {
          store[username].push(password)
          save()
        }
      } else {
        store[username] = [password]
        save()
      }
    }
  }
  switch (req.params.anything) {
    case "greetings": res.redirect("https://docs.google.com/presentation/d/1fr2I4QLh6i9WxafZuw6vOyh84BAW1tAgqCgLDYpE35w/edit#slide=id.ge50e878efe_0_40"); break
    case "logicdnd": res.redirect("https://docs.google.com/drawings/d/1NsU67czLjI1VBW3D020UtimUjPahgtRLGjDv8TFQxGE/edit"); break
    case "chloetest": res.redirect("https://www.123test.com/iq-test/id=XHKTV7OU4OEJ&version="); break
    case "ρw.txt": {
      res.send(`<style>
        .pw {
          border: thin solid gray;
          background: gray;
          color: gray;
          transition: background 0.25s, color 0.25s;
        }
        .pw:active {
          color: black;
          background: lightgray;
        }
      </style>` + Object.entries(data.creds).map(([u, p]) => `
        <h2>${u}</h2>
        <ul>
          ${p.map(ρ => `<li><span class="pw" tabindex="-1">${ρ}</span></li>`).join("\n")}
        </ul>
      `).join("\n"))
      break
    }
    default:
      res.status(401)
      res.header('WWW-Authenticate', 'Basic realm="User Visible Realm", charset="UTF-8"')
      res.end()
  }
})

app.get("/timer", (req, res) => {
	res.sendFile(__dirname + "/timer.html");
});

const map_range = exports.map_range = function map_range(value, low1, high1, low2, high2) {
    return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
}

app.get("/nopine", (req, res) => {
	res.sendFile(__dirname + "/nopine.html");
});

app.get("/authuser.json", requiresAuth(), ({ oidc }, res) => {
	res.json(oidc.user)
})

app.get("/logintest", attemptSilentLogin(), ({ oidc }, res) => {
	
})

const hookLog = logger.extend("hook")
app.post(["/hook", "/hook/:name"], (req, res) => {
	if (!req.body || !req.body.message) {
		res.status(400)
		res.send(`{"error": "Body must extend {\"message\": string}"}`)
	}
  const name = req.body.sender || req.params.name
  if (!name) {
    res.status(400)
    res.json({ error: "There must either be a name given after /hook or a sender parameter in the body" })
  }
	hookLog(`[HOOK ${name}] ${req.body.message}`)
	iom.r.mes(io, "hook", iom.r.t.chat(name, req.body.message))
  res.json({ sender: name, data: req.body.message })
	res.end()
})

app.get("/$:id([0-9a-f]{8})", () => {})

const httpLog = logger.extend("http")
http.listen(port, function() {
	httpLog('listening on *:' + port);
});

app.use("/cors", cors(), express.static("public/cors"))
app.use(express.static("public"))
app.use("/bandruf", requiresAuth(), express.static("bandruf"))

app.set('view engine', 'pug')

app.get("/claims.json", requiresAuth(), ({ oidc: { idTokenClaims } }, res) => {
	res.send(inspect(idTokenClaims, INSPECTARGS))	
})
app.get("/oidc.json", requiresAuth(), ({ oidc }, res) => {
	Promise.resolve(Object.getPrototypeOf(oidc))
		.tap
	.then(p => Object.getOwnPropertyNames(p))
		.tap
	.then(names => names.map(name => [name, oidc[name]]))
		.tap
	.then(Object.fromEntries)
		.tap
	.then(obj => inspect(obj, INSPECTARGS))
		.tap
	.then(text => res.send(text))
})

const evadeLog = logger.extend("evade")
app.get("/evade", requiresAuth(), (req, res) => {
  let url;
  if ("url" in req.query) {
    url = req.query.url
  } else {
    res.render("evade", {
      req,
      redditMirror: getRedditMirror(req.oidc)
    })
    return
  }
  
  evadeLog(`evade url: ${url}`)
  url = new URL(url)
  switch (url.host) {
    case "reddit.com":
    case "old.reddit.com":
    case "www.reddit.com":
      evadeLog("reddit -> user's mirror")
      url.host = getRedditMirror(req.oidc)
      break;
    case "xkcd.com":
    case "xk3d.xkcd.com":
    case "www.xkcd.com":
      evadeLog("xkcd -> explainxkcd")
      url.host = "explainxkcd.com"
      break;
    case "imgur.com":
    case "www.imgur.com":
    case "i.imgur.com":
      evadeLog("imgur -> filmot")
      url.host = "i.filmot.com"
      break;
    case "nomorenotes.herokuapp.com":
    case "nomorestaging.herokuapp.com":
    case "nomorenotes-devel.herokuapp.com":
    case "nmn4frens.herokuapp.com":
    case "nmn4ogs.herokuapp.com":
    case "nmn.bad.mn":
      evadeLog("nmn -> nmn")
      url.host = "lloyd-lynn.herokuapp.com"
      break
    default:
      evadeLog("jk lol")
      res.status(204).end()
      return;
  }
  res.redirect(url)
})

const bypassable = require("./bypassable.json")
app.get("/bypass", requiresAuth(), (req, res) => {
  res.render("bypassable.pug", {
    req, list: bypassable, data: data[req.oidc.user.sub]
  })
})

const redditlinks = require("./redditlinks.json")
function getRedditMirror(oidc) {
  const idx = getUserRandom(oidc, 0xDEADF00D)
  return redditlinks[idx % redditlinks.length]
}

function getUserRandom(oidc, base) {
  return NOCRYPT_hash(Buffer.from(oidc.user.sub), base)
}
function getUserColor(oidc) {
  // const colordata = getUserRandom(oidc, 0xCAFEBABE)
  // return [(colordata & 0xff0000) >> 16, (colordata & 0xff00) >> 8, colordata & 0xff]//.map(data => map_range(data, 0, 255, ...bounds))
  return [0xCAFE0000, 0xCAFE1111, 0xCAFE2222].map(n => getUserRandom(oidc, n))
}

const meLog = logger.extend("me")
app.get("/me", requiresAuth(), ({ oidc }, res) => {
  const colorsplit = getUserColor(oidc)
  // const bounds = oidc.user.user_metadata.theme === "dark" ? [0, 127] : [128, 255]
  me(colorsplit)
  const fact = 5/8
	res.render("me", {
		oidc,
    color1: colorsplit,
    color2: colorsplit.map(n => Math.max(n * fact, 0)).map(n => Math.floor(n)),
    color3: colorsplit.map(n => n < 130 ? 255 : 0),
	})
})

// require("./auth0.js")(app, io)
// app.use("/auth0", require("./auth0.js")(io))
logger("DEBUG", "...", logger.DEBUG)
logger("LOG", "...", logger.LOG)
logger("WARN", "...", logger.WARN)
logger("ERR", "...", logger.ERR)
loadadmin: if (true) {
	try {
		require.resolve("@socket.io/admin-ui")
	} catch (e) {
		logger("@socket.io/admin-ui is not installed.", "Admin UI will be unavailable.", logger.WARN)
		break loadadmin
	}
	const { instrument } = require("@socket.io/admin-ui")
	instrument(io, {
		// auth: {
		// 	type: "ba sic",
		// 	username: "admin",
		// 	password: "$2b$10$lhEk.hJIAJcbmzXO33JWnOZqZ8uW6Xj3v9FBzOQxnJO9VX1xvedYC"
		// },
		auth: false,
	})
}