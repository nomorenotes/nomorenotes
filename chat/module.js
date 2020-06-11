module.exports = (app) => {
  app.get('/raw_chat', function(req, res){
    res.sendFile(__dirname + '/index.html');
  });
  app.get("/raw_chat.js", (req, res) => {
    res.sendFile(__dirname + "/main.js");
  });
  app.get("/raw_chat.css", (req, res) => {
    res.sendFile(__dirname + "/styles.css");
  });
}
