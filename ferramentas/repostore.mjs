import { appendFileSync as fs_append } from "node:fs";
// Cliente mínimo do MCP do RepoStore (HTTP), para checar status sem despejar o prompt.
// Uso:
//   node ferramentas/repostore.mjs status <id> [<id>...]     -> id status link/erro
//   node ferramentas/repostore.mjs esperar <id> [<id>...]    -> repete até todos terminarem
//   node ferramentas/repostore.mjs criar <arquivo_prompt> <segundos> <conversation_id> [video_url]
import { readFileSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";

const cfg = JSON.parse(readFileSync(join(homedir(), ".claude.json"), "utf8"));
const srv = Object.values(cfg.projects || {}).map((p) => p.mcpServers?.["repostore-video"]).find(Boolean);
if (!srv) throw new Error("repostore-video não configurado em ~/.claude.json");

let sessao = null, seq = 0;
async function rpc1(method, params) {
  const headers = { ...srv.headers, "Content-Type": "application/json", Accept: "application/json, text/event-stream" };
  if (sessao) headers["Mcp-Session-Id"] = sessao;
  const r = await fetch(srv.url, { method: "POST", headers, body: JSON.stringify({ jsonrpc: "2.0", id: ++seq, method, params }) });
  sessao = r.headers.get("mcp-session-id") || sessao;
  const txt = await r.text();
  const json = txt.trim().startsWith("{") ? JSON.parse(txt) : JSON.parse(txt.split("\n").filter((l) => l.startsWith("data:")).at(-1).slice(5));
  if (json.error) throw new Error(JSON.stringify(json.error));
  return json.result;
}
// "rate_limited" / falha de rede (muitos lotes em paralelo) → espera e tenta de novo
async function rpc(method, params) {
  for (let i = 0; ; i++) {
    try { return await rpc1(method, params); } catch (e) {
      if (i >= 40 || !/rate_limited|fetch failed|ECONNRESET|Unexpected|undefined/i.test(String(e))) throw e;
      await new Promise((r) => setTimeout(r, 15000 + Math.random() * 15000));
    }
  }
}
async function init() {
  await rpc("initialize", { protocolVersion: "2025-03-26", capabilities: {}, clientInfo: { name: "novela-ia", version: "1" } });
  const h = { ...srv.headers, "Content-Type": "application/json", Accept: "application/json, text/event-stream" };
  if (sessao) h["Mcp-Session-Id"] = sessao;
  await fetch(srv.url, { method: "POST", headers: h, body: JSON.stringify({ jsonrpc: "2.0", method: "notifications/initialized" }) });
}
async function tool(name, args) {
  const r = await rpc("tools/call", { name, arguments: args });
  const t = r.content?.find((c) => c.type === "text")?.text ?? "{}";
  try { return JSON.parse(t); } catch { return { raw: t }; }
}
const linha = (v) => `${v.id} ${v.status} ${v.status === "done" ? v.download_url : v.error ? "ERRO: " + v.error.slice(0, 160) : ""}`;

const [cmd, ...args] = process.argv.slice(2);
await init();
if (cmd === "status") {
  for (const id of args) console.log(linha(await tool("get_video", { id })));
} else if (cmd === "esperar") {
  const pend = new Set(args);
  while (pend.size) {
    for (const id of [...pend]) {
      const v = await tool("get_video", { id });
      if (v.status === "done" || v.status === "failed") { console.log(linha(v)); pend.delete(id); }
    }
    if (pend.size) await new Promise((r) => setTimeout(r, 30000));
  }
} else if (cmd === "criar" || cmd === "imagem") {
  // imagem <arquivo_prompt> <conversation_id>
  // imagem <arquivo_prompt> <conversation_id> [refs]  (refs = imagens separadas por vírgula)
  const [arq, seg, conv, ref] = cmd === "imagem" ? [args[0], 0, args[1], args[2]] : args;
  const a = { prompt: readFileSync(arq, "utf8"), aspect_ratio: "9:16", conversation_id: conv };
  if (cmd === "criar") a.duration_seconds = +seg;
  // ref: link de vídeo (video_url) OU até 3 imagens separadas por vírgula (arquivo local ou https)
  //   ex.: clipes/B03_ultimo.jpg,referencias/fe/jesus_ref.png
  if (ref && /^https?:.*\.(mp4|webm|mov)|download/i.test(ref)) a.video_url = ref;
  else if (ref) a.images = ref.split(",").map((r) => /^https?:/.test(r) ? r
    : { mime_type: /\.png$/i.test(r) ? "image/png" : "image/jpeg", data_base64: readFileSync(r).toString("base64"), filename: r.split(/[\\/]/).pop() });
  // fila da conta cheia ("Você já tem 8 pedidos na fila") → espera uma vaga e tenta de novo
  for (;;) {
    const v = await tool(cmd === "imagem" ? "create_image" : "create_video", a);
    if (v.id) { console.log(v.id); break; }
    if (!/fila|tentativas|espere|limite|Libera uma vaga/i.test(JSON.stringify(v))) { console.error(JSON.stringify(v)); process.exit(1); }
    try { fs_append("E:/NOVELAS RELIGIOSAS/projetos/espera_repostore.log", new Date().toLocaleString("pt-BR") + " ESPERANDO: " + JSON.stringify(v).slice(0, 200) + "\n"); } catch {}
    await new Promise((r) => setTimeout(r, 30000));
  }
} else throw new Error("comando: status | esperar | criar | imagem");
