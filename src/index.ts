import type { ServerWebSocket } from "bun";
import type {
  ClientToServerMessage,
  ServerToClientMessage,
} from "./server/communication";

const state = {
  users: {} as Record<string, ServerWebSocket<unknown>>,
  admins: [] as ServerWebSocket<unknown>[],
  buzzersActive: false,
};

setInterval(() => {
  state.admins.forEach((ws) => {
    ws.send(JSON.stringify(state, null, 2));
  });
}, 10);

const server = Bun.serve({
  async fetch(req, server) {
    const path = new URL(req.url).pathname;
    if (path.startsWith("/ws")) {
      server.upgrade(req, {
        data: {
          createdAt: Date.now(),
          uuid: crypto.randomUUID(),
          admin: path.endsWith("admin"),
        },
      });
    }

    if (path === "/") {
      const build = await Bun.build({ entrypoints: ["./src/front/user.ts"] });
      const script = await build.outputs[0].text();
      return new Response(
        `<!DOCTYPE html> <html> <body> <script defer> ${script} </script> </body> </html>`,
        { headers: { "Content-Type": "text/html" } },
      );
    }
    if (path === "/admin") {
      const build = await Bun.build({ entrypoints: ["./src/front/admin.ts"] });
      const script = await build.outputs[0].text();
      return new Response(
        `<!DOCTYPE html> <html> <body> <script defer> ${script} </script> </body> </html>`,
        { headers: { "Content-Type": "text/html" } },
      );
    }
    if (path === "/tv") {
      const build = await Bun.build({ entrypoints: ["./src/front/tv.ts"] });
      const script = await build.outputs[0].text();
      return new Response(
        `<!DOCTYPE html> <html> <body> <script defer> ${script} </script> </body> </html>`,
        { headers: { "Content-Type": "text/html" } },
      );
    }

    return new Response("not found", { status: 404 });
  },
  websocket: {
    message(ws, message) {
      if (typeof message != "string") return;
      const data = JSON.parse(message) as ClientToServerMessage;

      switch (data.type) {
        case "register-user":
          if (state.users[data.name]) {
            state.users[data.name].close();
          }
          state.users[data.name] = ws;
          break;
        case "register-admin":
          state.admins.push(ws);
          break;
        case "toggle-buzzers":
          state.buzzersActive = !state.buzzersActive;
          break;
        default:
          console.log("unhandled message", data);
      }
    },
    open(ws) {},
    close(ws, code, message) {
      const user = Object.entries(state.users).find(([, user]) => user === ws);
      if (user) {
        delete state.users[user[0]];
      }
      const adminIndex = state.admins.findIndex((admin) => admin === ws);
      if (adminIndex !== -1) {
        state.admins.splice(adminIndex, 1);
      }
    },
    drain(ws) {},
  },
});

console.log(`server started at ${server.url.href}`);
