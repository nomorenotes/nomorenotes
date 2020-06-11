$(() => {
  const prev_feed = $("#prev-feed")
  const sock = io();
  sock.on("chat message", (msg) => {
    if (prev_feed.children().size() >= 5) {
      prev_feed.children().first().remove();
    }
    prev_feed.append($("<li>").text(msg));
  });
});
