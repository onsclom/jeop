/*
admin should:
- see all users
  - see their points
  - add/remove points
  - kick players?
*/

import { sendClientToServerMessage as sendMessage } from "../communication";

const ws = new WebSocket(`ws://${location.host}/ws/admin`);

ws.onopen = () => {
  sendMessage(ws, { type: "register-admin" });
};

ws.onclose = () => {
  location.reload();
};

// UI
const main = document.createElement("main");
document.body.appendChild(main);

const buzzersButton = document.createElement("button");
buzzersButton.textContent = "Toggle Buzzers";
buzzersButton.style.padding = "1rem";
main.appendChild(buzzersButton);
buzzersButton.onclick = () => {
  sendMessage(ws, { type: "toggle-buzzers" });
};

const stateDiv = document.createElement("pre");
main.appendChild(stateDiv);

ws.onmessage = (event) => {
  console.log(event.data);
  const data = JSON.parse(event.data);
  stateDiv.textContent = JSON.stringify(data, null, 2);
};
