import { createServer } from "node:http";
import { loadEnv } from "vite";
Object.assign(process.env, loadEnv("development", process.cwd(), ""));
const { default: chat } = await import("../api/chat.js");
const { default: compare } = await import("../api/compare.js");
createServer((req, res) => {
  if (req.url === "/health") { res.writeHead(200); res.end("ok"); return; }
  const handler = { "/api/chat": chat, "/api/compare": compare }[req.url];
  if (handler) return handler(req, res);
  res.writeHead(404); res.end("Not found");
}).listen(3001, "127.0.0.1", () => console.log("Portfolio API: http://127.0.0.1:3001"));
