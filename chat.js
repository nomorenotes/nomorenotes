$(function () {
  var manotify = false;
  var notify = false;
  var socket = io();
  $('#send').submit(function(){
    socket.emit('chat message', $('#m').val());
    $('#m').val('');
    return false;
  });
  $("#loginf").submit(function(){
    $("#logind").hide();
    socket.emit("passver", $("password").val());
  });
  socket.on('chat message', function(msg){
    $('#messages').append($('<li>').text(msg));
    if (notify) {
      notify = manotify;
      alert(msg);
    }
    window.scrollTo(0, document.body.scrollHeight);
  });
  socket.on("passok", function(ok){
    if (ok) {
      $("chat").show();
    } else {
      history.go(-1);
    }
  });
});
