module.exports = (app) => {
  app.get('/chat', function(req, res){
    res.sendFile(__dirname + '/index.html');
  });
  app.get("/chat.js", (req, res) => {
    res.sendFile(__dirname + "/main.js");
  });
  app.get("/chat.css", (req, res) => {
    res.sendFile(__dirname + "/styles.css");
  });
}
