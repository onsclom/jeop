import { sendClientToServerMessage as sendMessage } from "../communication";

let name = prompt("what is your name?");
while (name === null || name === "null") {
  name = prompt("ok but like i need a name lol");
}

const ws = new WebSocket(`ws://localhost:3000/ws`);

ws.onopen = () => {
  sendMessage(ws, { type: "register-user", name: name });
};

ws.onclose = () => {
  location.reload();
};

ws.onmessage = (event) => {
  console.log(`received: ${event.data}`);
};

const pongButton = document.createElement("button");
pongButton.textContent = "Pong";
document.body.appendChild(pongButton);
pongButton.onclick = () => {
  ws.send("pong");
};

const nameInput = document.createElement("input");
nameInput.placeholder = "name";
document.body.appendChild(nameInput);
