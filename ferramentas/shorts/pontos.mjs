// Para cada episódio > 180 s, acha a emenda de clipe mais perto do meio sem fala atravessando.
import { execFileSync } from "node:child_process";
import { readFileSync, readdirSync, writeFileSync } from "node:fs";
const R = "E:/NOVELAS RELIGIOSAS";
const FF = "E:/Ferramentas/ffmpeg/ffmpeg-9.0.2-full_build/bin/ffprobe.exe";
const dur = (f) => +execFileSync(FF, ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", f]).toString();
const t = (s) => { const [h, m, x] = s.split(":"); return +h * 3600 + +m * 60 + +x; };
const out = {};
for (const f of readdirSync(`${R}/saida`).filter((f) => /^ep\d+.*\.mp4$/.test(f) && !f.includes("_v1"))) {
  const nome = f.replace(".mp4", ""), total = dur(`${R}/saida/${f}`);
  if (total <= 179.5) { out[nome] = { total }; continue; }
  const ed = `${R}/projetos/${nome}/edicao`;
  const clipes = readFileSync(`${ed}/lista.txt`, "utf8").match(/'([^']+)'/g).map((s) => s.slice(1, -1));
  let acc = 0; const emendas = [];
  for (const c of clipes) { acc += dur(`${ed}/${c}`); emendas.push(+acc.toFixed(2)); }
  const falas = readFileSync(`${ed}/legendas.ass`, "utf8").split("\n").filter((l) => l.startsWith("Dialogue")).map((l) => { const p = l.split(","); return [t(p[1]), t(p[2])]; });
  const cand = emendas.slice(0, -1)
    .filter((e) => e <= 179 && total - e <= 179 && !falas.some(([a, b]) => a < e - 0.05 && b > e + 0.05))
    .sort((a, b) => Math.abs(a - total / 2) - Math.abs(b - total / 2));
  out[nome] = { total, montado: +acc.toFixed(2), corte: cand[0] ?? null };
}
writeFileSync(process.argv[2], JSON.stringify(out, null, 1));
for (const [k, v] of Object.entries(out)) console.log(k.padEnd(28), v.total.toFixed(1), v.montado ?? "", v.corte ?? "");
