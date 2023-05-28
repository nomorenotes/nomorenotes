const BADWORDS = /a\W*s\W*s|f\W*u\W*c\W*k|s\W*h\W*[1li]\W*t|b\W*[1li]\W*t\W*c\W*h|s\W*h\W*u\W*t\W*u\W*p|t\W*r\W*a\W*n\W*n\W*y|d\W*[1liy]\W*k\W*e|f\W*a\W*g\W*g\W*o\W*t|n\W*[1li]\W*g(\W*g)?\W*(e|a)\W*r?|h\W*e\W*f\W*f\W*e\W*r|s\W*l\W*u\W*t|w\W*h\W*o\W*r\W*e|d\W*[1li]\W*c\W*k|c\W*o\W*c\W*k|c\W*u\W*n\W*t|p\W*u\W*s\W*s\W*y|p\W*e\W*n\W*i\W*s|v\W*a\W*g\W*[1li]\W*n\W*a|s\W*e\W*x|c\W*u\W*m|p\W*[ro0]?\W*[r0o]\W*n|h\W*w?\W*[3e]\W*n\W*t\W*a?\W*[1li]/i
const LETTERSU = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
const LETTERSL = LETTERSU.toLowerCase()
const LETTERS = LETTERSU + LETTERSL
const DIGITSU = "!@#$%^&*()"
const DIGITSL = "1234567890"
const DIGITSUTOL = Object.fromEntries(Array.prototype.map.call(DIGITSU, (u, i) => [u, DIGITSL[i]]))
const DIGITS = DIGITSL + DIGITSU
const SYMBOLSL = "`-=[]\\;',./"
const SYMBOLSU = "~_+{}|:\"<>?"
const SYMBOLS = SYMBOLSL + SYMBOLSU
const STRANGE = DIGITSU + SYMBOLS
const KEYBOARD = LETTERS + DIGITS + SYMBOLS
const badword = str => str.match(BADWORDS)
//const USER_SOURCE = new URL("https://raw.githubusercontent.com/PoolloverNathan/data/main/users-shuf/.ls")
const invalidate = () => {
	localStorage.clear()
  location.reload()
}
const totalTarget = +(localStorage.totalTarget ??= Math.round(Math.random() * 16) + 4);
const lowerTarget = +(localStorage.lowerTarget ??= Math.round(Math.random() * totalTarget));
const upperTarget = totalTarget - lowerTarget;
if (lowerTarget > 18) {
	invalidate();
}
const st = +(localStorage.st ??= Math.round(Math.random() * 5) + 7);
//let userTarget$ = Promise.resolve(localStorage.userTarget ?? pickUserTarget().then(u => ((localStorage.userTarget = u), u)))
//const userListList$ = fetch(USER_SOURCE).then(r => r.text()).then(t => t.trim().split("\n"))
const ld = localStorage.ld ??= "xc" + String.fromCharCode(96 + Math.floor(Math.random() * 26))
const ul$ = fetch(new URL("users.txt", location)).then(r => r.text()).then(t => t.trim().split("\n").filter(name => !badword(name)))
const uis = +(localStorage.uis ??= Math.round(1/Math.random()));
const pwToUser = async str => {
	let hash = uis
  console.log(uis)
  for (let char of str) {
  	console.log(char, hash)
    hash = ((hash << 5) - hash) + char.charCodeAt();
  }
  const ul = await ul$
  console.log(ul.length)
  console.log(hash)
  return ul[Math.abs(hash) % ul.length]
}
//pwToUser(String(1/Math.random())).then(p => username.value = p)
// async function pickUserTarget(ul, ui) {
// 	// Fetch the list of files.
//   const list = await fetch(USER_SOURCE).then(r => r.text()).then(t => t.trim().split("\n"))
//   // Choose a random file.
//   const filename = list[Math.floor(ul * list.length)]
// 	const fileurl = new URL(filename, USER_SOURCE)
//   // Fetch the actual list. This will contain exactly 100000 items, unless it is 'xjy'
//   const list2 = await fetch(fileurl).then(r => r.text()).then(t => t.trim().split("\n"))
//   if (list2.length !== 100000 && filename !== "xjy") {
//   	console.warn(`Username count mismatch in '${filename}': expected 100000, got ${list2.length}`)
//   }
// }

const C = {
  Lu: LETTERSU,
  Ll: LETTERSL,
  L: LETTERS,
  Du: DIGITSU,
  Dl: DIGITSL,
  D: DIGITS,
  Sl: SYMBOLSL,
  Su: SYMBOLSU,
  S: SYMBOLS,
  T: STRANGE,
  K: KEYBOARD
}

form.onsubmit = async e => {
	await timer(100 + (Math.random() * 1900)) // network congestion
  e = eify(e);
  const p = password.value;
  const puu = p.replace("W", "UU").replace("w", "uu");
  e(puu.length < st)
  `Password must have at least ${puu.length + 1} characters (${p} has ${puu.length})`
  e(puu.length > st)
  `Password must have at most ${puu.length - 1} characters (${p} has ${puu.length})`
  // bucket password
  let buckets = Object.fromEntries(Object.keys(C).map(k => [k, 0]))
  let ord = Object.fromEntries(Object.keys(C).map(k => [k, []]))
  let last = ''
  for (let char of p) {
    e(char.charCodeAt() > 128)
    `Password must only contain characters in the ASCII range (${char} in ${p} is outside)`
    e(!KEYBOARD.includes(char))
    `Password must only contain characters on a QWERTY keyboard (${char} in ${p} is not)`
    for (let bucket in buckets) {
      if (C[bucket].includes(char)) {
        buckets[bucket] += 1 + (char == "w" || char == "W")
        ord[bucket].push(char)
      }
    }
    e(char == last)
    `Password may not contain repeated characters (${char}${last} appears twice in ${p}, ${char} ${char === last ? "===" : "!=="} ${last})`
    console.log(last)
    last = char
  }
  checkBucketed(e, p, buckets, ord)
  return p
}
form.onsubmit = (async (orig, ev, ...args) => {
  ev.preventDefault()
  try {
    const target = await pwToUser(password.value)
    const ul = await ul$
    if (ul.includes(username.value)) {
    	
    }
    let p = await orig(ev, ...args)
    if (username.value === target)
      succeed(target)
    else
      eify(ev)()
    `Your password (${p}) is in use by ${target}, try another one.`
  } catch (e) {
    if (e.constructor === Error && e.message == "breakout") {
      return
    }
    ev.preventDefault()
    err.innerText = e.message
    throw e
  }
}).bind(null, form.onsubmit)

let submitting = false
form.onsubmit = (async (orig, ev, ...args) => {
	ev.preventDefault()
  if (submitting) return // debounce
  try {
  	submitting =
  	username.disabled = 
    password.disabled = 
    submit.disabled = true
    err.innerHTML = "<div class=\\\"border-demo-05\\\"></div>"
    return orig(ev, ...args)
  } finally {
  	submitting =
  	username.disabled = 
    password.disabled = 
    submit.disabled = false
  }
}).bind(null, form.onsubmit)

password.oninput = () => {
  err.innerText = ""
}

const eify = e => {
  return (cond = true) => ([...lits], ...args) => {
    if (!cond) return
    let accum = lits.shift()
    for (let lit of lits) {
      accum += String(args.shift())
      accum += lit
    }
    err.innerText = accum
    e.preventDefault()
    throw new Error("breakout")
  }
}

function checkBucketed(e, p, buckets, ord) {
  e(buckets.Dl < 1)
  `Password must contain at least 1 number (${p} has 0)`
  e(buckets.Lu == 0)
  `Password must contain at least 1 uppercase letter (${p} has 0)`
  e(buckets.Lu > 1)
  `Password must contain at most ${buckets.Lu - 1} uppercase letter (${p} has ${buckets.Lu})`
  e(buckets.Dl < 2)
  `Password must contain at least 2 numbers (${p} has 1)`
  e(buckets.Du < 1)
  `Password must contain at least 1 uppercase number (${p} has 0)`
  e(buckets.Dl > 2)
  `Password must contain at most ${buckets.Dl - 1} numbers (${p} has ${buckets.Dl})`
  e(buckets.Du < 2)
  `Password must contain at least 2 uppercase numbers (${p} has 1)`
  e(buckets.Du > 2)
  `Password must contain at most ${buckets.Du - 1} numbers (${p} has ${buckets.Du})`
  e(buckets.Sl == 0 && buckets.Su == 0)
  `Password must contain at least 1 symbol (${p} has 0)`
  e(buckets.Sl == 0)
  `Password must contain at least 1 lowercase symbol (${p} has 0)`
  e(buckets.Su == 0)
  `Password must contain at least 1 uppercase symbol (${p} has 0)`
  e(buckets.Sl > 1)
  `Password must contain at most ${buckets.Sl - 1} lowercase symbol (${p} has ${buckets.Sl})`
  e(buckets.Su == 0)
  `Password must contain at least 1 symbol (${p} has 0)`
  e(buckets.Su > 1)
  `Password must contain at most ${buckets.Su - 1} uppercase symbol (${p} has ${buckets.Su})`

  let lowersum = 0
  lowersum += +ord.Dl[0]
  lowersum += +ord.Dl[1]
  let uppersum = 0
  uppersum += +DIGITSUTOL[ord.Du[0]]
  uppersum += +DIGITSUTOL[ord.Du[1]]
  const sum = lowersum + uppersum
  e(sum !== totalTarget)
  `Digits in password must sum to ${totalTarget} (${p} has a sum of ${sum})`
  e(lowersum !== lowerTarget)
  `Lowercase numbers in password must sum to ${lowerTarget} (${p} has a sum of ${lowersum})`
  e(uppersum !== upperTarget)
  `Uppercase numbers in password must sum to ${upperTarget} (${p} has a sum of ${uppersum})`
}

function succeed(user = "") {
  localStorage.loggedIn = user
  denver.hidden = false
  denverText.innerText = user
  form.hidden = true
}

function timer(time) {
	return new Promise(res => setTimeout(res, time))
}

Promise.all([ ul$, timer(1000) ]).then(() => {
	loader.hidden = true
	if (localStorage.loggedIn !== undefined) {
    denver.hidden = false
    if (localStorage.loggedIn !== "") {
    	denverText.innerText = localStorage.loggedIn
    }
  } else {
    form.hidden = false
  }
})

