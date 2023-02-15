module.exports = (r) => ({
  "en_us": {
    "join": (a,b)=>`${a} has joined.${b && `<div style="border: "`}`,
    "leave": a=>`${a} has ${Math.random() < .05 ? "right" : "left"}. T`,
    "kick": (a,b)=>`${a} was hit by ${b}'s rubber boot!`,
    "ban": (a,b,c,d)=>`${a} was hit by ${b}'s ${c}-pound banhammer: ${d}`,
    "join_self": (a,b,c)=>`Welcome to the ${process.env.SERVER_NAME || "local"} server, ${a} (${b}) - ${c}`,
    "help": () => `For help, type or click <button onclick="sendCommand('/help welcome')">/help welcome</button>.`,
    "chat": (a,b)=>`&lt;${a}> ${b}`,
    "action": (a,b)=>`* ${a} ${b}`,
    "nick": (a,b)=>`${a} has applied name ${b}.`,
    "truly": {
      "you": ()=>`Yes, you are yourself.`,
      "kicky": (a)=>`You were told the truth by ${a}`,
      "kick": (a,b)=>`${a} was told the truth about ${b}.`,
    },
    "nochange": a=>`${a} seems about the same.`,
    "op": {
      "me": a=>`${a} thinks that you seem more powerful.`,
      "other": (a,b)=>`${a} thinks that ${b} seems more powerful.`,
      "mep": a=>`${a} remembers thinking that you seem more powerful.`,
      "otherp": (a,b)=>`${a} remembers thinking that ${b} seems more powerful.`,
      "no": a=>`${a} is permanently deopped and cannot be opped.`,
      "select": ()=>`You must choose somebody to op.`
    },
    "deop": {
      "me": a=>`${a} thinks that you seem less powerful.`,
      "other": (a,b)=>`${a} thinks that ${b} seems less powerful.`,
      "mep": a=>`${a} remembers thinking that you seem less powerful.`,
      "otherp": (a,b)=>`${a} remembers thinking that ${b} seems less powerful.`,
      "select": ()=>`You must choose somebody to deop.`
    },
    "own": {
      "me": a=>`${a} thinks that you seem much more powerful than usual!`,
      "other": (a,b)=>`${a} thinks that ${b} seems much more powerful than usual!`,
      "select": ()=>`You must choose somebody to own. You're not cool enough to own everyone.`
    },
    "thick_force": {
      "you": (a,b)=>`A thick force prevents you from ${a.includes("%") ? a.replace("%", b) : a + " " + b}!`,
      "me": (a,b)=>`A thick force prevents ${b} from ${a.includes("%") ? a.replace("%", 'you') : a + " " + 'you'}!`
    },
    "nick_self": a=>`Name ${a} applied successfully.`,
    "join_extra": ()=>(a=>a[Math.floor(Math.random()*a.length)])([
      "In the government",
      `Abusing admin since ${new Date().getFullYear() + 1}`
    ]),
    "message": (a, b, c, d, e, f = '') => `${f.toString().padStart(12, " ").slice(-12).replace(/ /g, "&nbsp;")} ${e.toString().padStart(6, " ").slice(-6).replace(/ /g, "&nbsp;")}: ${(r.pf[c])?(r.pf[c]):("("+c+") ")}${a.toString().padStart(2, "0")}:${b.toString().padStart(2, "0")}:${new Date().getSeconds()} | ${d}`,
  }
});
