module.exports = (r) => ({
  "en_us": {
    "join": a=>`&lt;${a}&gt; has joined.`,
    "leave": a=>`&lt;${a}&gt; has left. T`,
    "kick": a=>`&lt;${a}&gt; was hit by the rubber boot!`,
    "ban": a=>`&lt;${a}&gt; was hit by the banhammer. :(`,
    "join_self": (a,b)=>`Welcome to the ${process.env.SERVER_NAME || "local"} server, ${a} (${b})`,
    "chat": (a,b)=>`&lt;${a}&gt; ${b}`,
    "action": (a,b)=>`* ${a} ${b}`,
    "nick": (a,b)=>`${a} has applied name ${b}.`,
    "truly": {
      "you": ()=>`Yes, you are yourself.`,
      "kicky": (a)=>`You were told the truth by ${a}`,
      "kick": (a,b)=>`${a} was told the truth about ${b}.`,
    },
    "nick_self": a=>`Name ${a} applied successfully.`,
    "message": (a,b,c,d,e,f='')=>`${f.toString().padStart(12, " ").slice(-12)} ${e.toString().padStart(6, "0").slice(-6)}: ${(r.pf[c])?(r.pf[c]):("("+c+") ")}${a.toString().padStart(2, "0")}:${b.toString().padStart(2, "0")} | ${d}`,
  }
});
