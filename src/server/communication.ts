import type { ServerWebSocket } from "bun";

export type ClientToServerMessage =
  | { type: "toggle-buzzers" }
  | { type: "register-user"; name: string }
  | { type: "register-admin" };

export type ServerToClientMessage = { type: "pong" };

export function sendClientToServerMessage(
  ws: WebSocket,
  message: ClientToServerMessage,
) {
  ws.send(JSON.stringify(message));
}

export function sendServerToClientMessage(
  ws: ServerWebSocket,
  message: ServerToClientMessage,
) {
  ws.send(JSON.stringify(message));
}
