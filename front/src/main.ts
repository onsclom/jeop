const wsServer = import.meta.env.DEV
  ? `ws://localhost:3000`
  : `wss://${location.host}:3000`;

const ws = new WebSocket(wsServer);

ws.onopen = () => {
  console.log("Connected to server");
};

const button = document.createElement("button");
button.textContent = "Send message";
button.onclick = () => {
  ws.send("Hello from client");
};
document.body.appendChild(button);

ws.onmessage = (event) => {
  console.log("Message from server", event.data);
};
