module.exports = (app) => {
  app.get("/vis", function (req, res) {
    res.sendFile(__dirname + "/index.html")
  })
  app.get("/vis.js", (req, res) => {
    res.sendFile(__dirname + "/main.js")
  })
  app.get("/vis.css", (req, res) => {
    res.sendFile(__dirname + "/styles.css")
  })
}
