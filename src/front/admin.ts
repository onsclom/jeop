/*
admin should:
- see all players
  - see points
  - add/remove points
  - kick players?
- enable buzzers / disable buzzers
*/

import { sendClientToServerMessage as sendMessage } from "../server/communication";

const ws = new WebSocket(`ws://${location.host}/ws/admin`);

ws.onopen = () => {
  sendMessage(ws, { type: "register-admin" });
};

ws.onclose = () => {
  location.reload();
};

// UI
const canvas = document.createElement("canvas");
document.body.appendChild(canvas);
canvas.style.width = "100%";
canvas.style.height = "100%";
canvas.style.position = "absolute";
canvas.style.top = "0";
canvas.style.left = "0";

let state = "";

ws.onmessage = (event) => {
  console.log(event.data);
  state = event.data;
};

const fontHeight = 20;
(function drawLoop() {
  canvas.width = window.innerWidth * devicePixelRatio;
  canvas.height = window.innerHeight * devicePixelRatio;

  const ctx = canvas.getContext("2d");
  assert(ctx);
  ctx.scale(devicePixelRatio, devicePixelRatio);

  ctx.font = `${fontHeight}px sans-serif`;

  drawMultiLineText(ctx, state);

  requestAnimationFrame(drawLoop);
})();

function drawMultiLineText(ctx: CanvasRenderingContext2D, text: string) {
  const lines = text.split("\n");
  for (let i = 0; i < lines.length; i++) {
    ctx.fillText(lines[i], 0, i * fontHeight + fontHeight);
  }
}

function assert(condition: any, message?: string): asserts condition {
  if (!condition) {
    throw new Error(message);
  }
}
