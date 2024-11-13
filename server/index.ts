const server = Bun.serve({
  fetch(req, server) {
    if (server.upgrade(req)) {
      return;
    }
    return new Response("Upgrade failed", { status: 500 });
  },
  websocket: {
    message(ws, message) {
      console.log("Message from client", message);
      ws.send("Pong from server");
    },
    open(ws) {
      console.log("Connected to client");
    },
    close(ws, code, message) {},
    drain(ws) {},
  },
});

console.log(`websocket server running on ws://localhost:${server.port}`);
