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
    "nick_self": a=>`Name ${a} applied successfully.`,
    "join_extra": ()=>(a=>a[Math.floor(Math.random()*a.length)])([
      "In the government",
      `Abusing admin since ${new Date().getFullYear() + 1}`
    ]),
    "message": (a, b, c, d, e, f = '') => `${f.toString().padStart(12, " ").slice(-12).replace(/ /g, "&nbsp;")} ${e.toString().padStart(6, " ").slice(-6).replace(/ /g, "&nbsp;")}: ${(r.pf[c])?(r.pf[c]):("("+c+") ")}${a.toString().padStart(2, "0")}:${b.toString().padStart(2, "0")}:${new Date().getSeconds()} | ${d}`,
  }
});
