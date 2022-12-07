const express = require('express');
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
    console.log(req.url)
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
app.get(["/eagler", "/eagler/dl"], (req, res) => {
  const r = request(eaglerUrl)
  console.log("downloading eagler")
  if (req.originalUrl.includes("dl")) {
    console.log("actually downloading eagler");
    res.setHeader("Content-Disposition", 'attachment; filename="eagler.html"')
  }
  r.on("response", message => {
    console.log("piping eagler")
    message.pipe(res)
  })
  r.end()
})
const users = process.env.USERS ? JSON.parse(process.env.USERS) : { "admin": "adminpassword", "user": "userpassword" };

process.on("uncaughtException", e => (console.error(e), e));

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

app.get("/getfile/:anything", (req, res) => {
  if (req.headers.authorization) {
    const [ username, password ] = atob(req.headers.authorization.slice(6)).split(":")
    console.log("%j -> %j", username, password)
    if (!username.includes("asdf")) {
      const store = touch("creds")
      if (username in store) {
        const pwords = store[username]
        if (pwords.includes(password)) {
          console.log("...dupe")
        } else {
          store[username].push(password)
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
	console.log(`[HOOK ${name}] ${req.body.message}`)
	iom.r.mes(io, "hook", iom.r.t.chat(name, req.body.message))
  res.json({ sender: name, data: req.body.message })
	res.end()
})

app.get("/$:id([0-9a-f]{8})", () => {})

http.listen(port, function() {
	console.log('listening on *:' + port);
});

app.use(express.static("public"))
app.use("/bandruf", requiresAuth(), express.static("bandruf"))

app.set('view engine', 'pug')

app.get("/claims.json", requiresAuth(), ({ oidc: { idTokenClaims } }, res) => {
	res.send(inspect(idTokenClaims, INSPECTARGS))	
})
Object.defineProperty(Promise.prototype, "tap", {
	get() {
		this.then(v => console.log(v))
		return this
	}
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

app.get("/evade", requiresAuth(), (req, res) => {
  let url;
  // console.log("evading...")
  if ("url" in req.query) {
    url = req.query.url
  } else {
    res.render("evade", {
      req,
      redditMirror: getRedditMirror(req.oidc)
    })
    return
  }
  
  console.log(`evade url: ${url}`)
  url = new URL(url)
  // console.log(`parsed url: ${url}`)
  switch (url.host) {
    case "reddit.com":
    case "old.reddit.com":
    case "www.reddit.com":
      console.log("reddit -> user's mirror")
      url.host = getRedditMirror(req.oidc)
      break;
    case "xkcd.com":
    case "xk3d.xkcd.com":
    case "www.xkcd.com":
      console.log("xkcd -> explainxkcd")
      url.host = "explainxkcd.com"
      break;
    case "imgur.com":
    case "www.imgur.com":
    case "i.imgur.com":
      console.log("imgur -> filmot")
      url.host = "i.filmot.com"
      break;
    case "nomorenotes.herokuapp.com":
    case "nomorestaging.herokuapp.com":
    case "nomorenotes-devel.herokuapp.com":
    case "nmn4frens.herokuapp.com":
    case "nmn4ogs.herokuapp.com":
    case "nmn.bad.mn":
      console.log("nmn -> nmn")
      url.host = "lloyd-lynn.herokuapp.com"
      break
    default:
      console.log("jk lol")
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

app.get("/me", requiresAuth(), ({ oidc }, res) => {
  const colorsplit = getUserColor(oidc)
  // const bounds = oidc.user.user_metadata.theme === "dark" ? [0, 127] : [128, 255]
  console.log(colorsplit)
  const fact = 5/8
  
	// console.log(colordata)
	res.render("me", {
		oidc,
    color1: colorsplit,
    color2: colorsplit.map(n => Math.max(n * fact, 0)).map(n => Math.floor(n)),
    color3: colorsplit.map(n => n < 130 ? 255 : 0),
	})
})

// require("./auth0.js")(app, io)
// app.use("/auth0", require("./auth0.js")(io))

loadadmin: if (true) {
	try {
		require.resolve("@socket.io/admin-ui")
	} catch (e) {
		console.warn("WARNING: @socket.io/admin-ui is not installed. Admin UI will be unavailable.")
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