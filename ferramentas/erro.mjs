// Mostra o erro completo de um pedido do RepoStore. Uso: node ferramentas/erro.mjs <id>
import { readFileSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";
const cfg = JSON.parse(readFileSync(join(homedir(), ".claude.json"), "utf8"));
const srv = Object.values(cfg.projects || {}).map((p) => p.mcpServers?.["repostore-video"]).find(Boolean);
let s = null;
const call = async (method, params, id) => {
  const headers = { ...srv.headers, "Content-Type": "application/json", Accept: "application/json, text/event-stream", ...(s ? { "Mcp-Session-Id": s } : {}) };
  const r = await fetch(srv.url, { method: "POST", headers, body: JSON.stringify({ jsonrpc: "2.0", id, method, params }) });
  s = r.headers.get("mcp-session-id") || s;
  const t = await r.text();
  return t.trim().startsWith("{") ? JSON.parse(t) : JSON.parse(t.split("\n").filter((l) => l.startsWith("data:")).at(-1).slice(5));
};
await call("initialize", { protocolVersion: "2025-03-26", capabilities: {}, clientInfo: { name: "novela-ia", version: "1" } }, 1);
const r = await call("tools/call", { name: "get_video", arguments: { id: process.argv[2] } }, 2);
console.log(JSON.parse(r.result.content[0].text).error);
