module.exports = (app) => {
  app.get("/site.js", (req, res) => {
    res.sendFile(__dirname + "/main.js");
  });
  app.get("/site.css", (req, res) => {
    res.sendFile(__dirname + "/styles.css");
  });
  app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
  });
};
