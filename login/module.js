module.exports = (app) => {
  app.get('/login', function(req, res){
    res.sendFile(__dirname + '/index.html');
  });
  app.get("/login.js", (req, res) => {
    res.sendFile(__dirname + "/main.js");
  });
  app.get("/login.css", (req, res) => {
    res.sendFile(__dirname + "/styles.css");
  });
}
