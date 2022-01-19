module.exports = (r) => ({
  "en_us": {
    "join": a=>`&lt;${a}> has joined.`,
    "leave": a=>`&lt;${a}> has ${Math.random() < .1 ? "right" : "left"}. T`,
    "kick": (a,b)=>`&lt;${a}> was hit by &lt;${b}>'s rubber boot!`,
    "ban": (a,b,c,d)=>`&lt;${a}>; was hit by &lt;${b}>'s ${c}-pound banhammer: ${d}`,
    "join_self": (a,b)=>`Welcome to the ${process.env.SERVER_NAME || "local"} server, ${a} (${b})`,
    "chat": (a,b)=>`&lt;${a}> ${b}`,
    "action": (a,b)=>`* ${a} ${b}`,
    "nick": (a,b)=>`${a} has applied name ${b}.`,
    "truly": {
      "you": ()=>`Yes, you are yourself.`,
      "kicky": (a)=>`You were told the truth by ${a}`,
      "kick": (a,b)=>`${a} was told the truth about ${b}.`,
    },
    "nick_self": a=>`Name ${a} applied successfully.`,
    "message": (a, b, c, d, e, f = '') => `${f.toString().padStart(12, " ").slice(-12).replace(/ /g, "&nbsp;")} ${e.toString().padStart(6, " ").slice(-6).replace(/ /g, "&nbsp;")}: ${(r.pf[c])?(r.pf[c]):("("+c+") ")}${a.toString().padStart(2, "0")}:${b.toString().padStart(2, "0")} | ${d}`,
  }
});
