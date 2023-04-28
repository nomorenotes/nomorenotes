const { urlencoded } = require("express");
module.exports = (app) => {
  app.use(urlencoded({ extended: true }));
  app.get("/login", function (req, res) {
    res.sendFile(__dirname + "/index.html");
  });
  app.post("/login", ({ body: { username, password, intent } }, res) => {
    res.json([username, password, intent]);
  });
  app.get("/login.js", (req, res) => {
    res.sendFile(__dirname + "/main.js");
  });
  app.get("/login.css", (req, res) => {
    res.sendFile(__dirname + "/styles.css");
  });
};
