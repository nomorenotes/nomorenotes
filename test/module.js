module.exports = (app) => {
  app.get('/test', function(req, res){
    res.sendFile(__dirname + '/index.html');
  });
  /*app.get("/test.js", (req, res) => {
    res.sendFile(__dirname + "/main.js");
  });
  app.get("/test.css", (req, res) => {
    res.sendFile(__dirname + "/styles.css");
  });*/
}
