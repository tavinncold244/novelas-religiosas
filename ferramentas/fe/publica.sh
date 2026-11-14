#!/bin/bash
# publica.sh <proj> — prepara um episódio da página Dramas De Fé para postar.
# Lê projetos/<proj>/publicar.json  { "titulo": "...", "gancho": "...", "moral": "...", "versiculo": "...",
#                                     "cta": "AMÉM", "hashtags": "#jesus #milagre" }
# Precisa de saida/<proj>.mp4 (≤ 2:59) e thumbs/<proj>/thumb.png.
# Saída: youtube_shorts/<proj>/
#   <proj>.mp4             o vídeo final
#   <proj>_thumb.jpg       a thumb 1080x1920
#   <proj>_youtube.txt     TÍTULO + TAGS + DESCRIÇÃO (YouTube Shorts)
#   <proj>_tiktok.txt      legenda pronta (TikTok e Facebook Reels)
# e atualiza youtube_shorts/LEIA-ME.md
R="E:/NOVELAS RELIGIOSAS"; P=$1; D="$R/youtube_shorts/$P"
[ -f "$R/projetos/$P/publicar.json" ] || { echo "falta projetos/$P/publicar.json"; exit 1; }
T=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$R/saida/$P.mp4") || exit 1
node -e "process.exit(+process.argv[1]>179.5?1:0)" "$T" || { echo "PASSA DE 2:59 ($T s) — cortar antes"; exit 1; }
mkdir -p "$D"
cp "$R/saida/$P.mp4" "$D/$P.mp4"
[ -f "$R/thumbs/$P/thumb.png" ] && ffmpeg -loglevel error -y -i "$R/thumbs/$P/thumb.png" \
  -vf "scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920" -q:v 2 "$D/${P}_thumb.jpg"
node - "$R/projetos/$P/publicar.json" "$D" "$P" "$T" <<'JS'
const fs = require("fs");
const [, , arq, D, P, T] = process.argv;
const e = JSON.parse(fs.readFileSync(arq, "utf8"));
const cta = e.cta || "AMÉM";
const parte2 = cta === "PARTE 2";
const BASE = "#dramasdefe #fé #jesus #deus #historiasdefe #reflexão #amém #novela #emocionante";
const hashtags = `${BASE} ${e.hashtags || ""}`.trim();
// tags do YouTube: sem #, separadas por vírgula, ≤ 500 caracteres
const extras = ["dramas de fé", "histórias de fé", "novela cristã", "história emocionante", "jesus", "deus", "fé", "milagre", "oração", "reflexão", "lição de vida", "shorts"];
const tags = [...new Set([...hashtags.split(/\s+/).map((h) => h.replace(/^#/, "")), ...extras])].filter(Boolean);
let tagStr = ""; for (const t of tags) { const s = tagStr ? `${tagStr}, ${t}` : t; if (s.length > 480) break; tagStr = s; }
const L = (a) => a.filter((x) => x != null).join("\n").replace(/\n{3,}/g, "\n\n") + "\n";
const ytTitulo = `${e.titulo} #shorts`;
if (ytTitulo.length > 100) { console.error(`Título YT longo (${ytTitulo.length}) — encurte em publicar.json`); process.exit(1); }
const pedido = parte2 ? "Quer ver como termina? Comenta PARTE 2 👇" : `Se você crê, comenta ${cta} e escreve de qual cidade está assistindo 👇`;
fs.writeFileSync(`${D}/${P}_tiktok.txt`, "\uFEFF" + L([
  `${e.titulo} 🙏`, e.gancho, "",
  e.versiculo ? `📖 ${e.versiculo}` : null,
  `🙏 ${e.moral}`, "",
  pedido,
  "Compartilha com alguém que precisa ouvir isso hoje ❤️", "",
  `${hashtags} #fy #fyp`]));
fs.writeFileSync(`${D}/${P}_youtube.txt`, "\uFEFF" + L([
  "TÍTULO:", ytTitulo, "",
  "TAGS:", tagStr, "",
  "DESCRIÇÃO:", e.gancho, "",
  e.versiculo ? `📖 ${e.versiculo}` : null,
  `🙏 ${e.moral}`, "",
  parte2 ? "Quer ver como termina? Comenta PARTE 2 e se inscreve pra não perder. 👇"
         : `Se você crê que Deus não esquece ninguém, deixa o like, comenta ${cta} e se inscreve no Dramas De Fé pra receber a próxima história. 🙏`, "",
  `#shorts ${hashtags}`]));
// LEIA-ME.md
const leia = `${D}/../LEIA-ME.md`;
const dur = `${Math.floor(T / 60)}:${String(Math.round(T % 60)).padStart(2, "0")}`;
let txt = fs.existsSync(leia) ? fs.readFileSync(leia, "utf8") : "# Dramas De Fé — vídeos prontos para postar\n\nCada pasta tem: o vídeo (.mp4), a thumb (_thumb.jpg), o texto do YouTube (_youtube.txt: título, tags e descrição) e o texto do TikTok/Facebook (_tiktok.txt).\n\n| Episódio | Duração | Título |\n|---|---|---|\n";
const linha = `| ${P} | ${dur} | ${e.titulo} |`;
txt = txt.split("\n").filter((l) => !l.startsWith(`| ${P} |`)).join("\n").replace(/\n*$/, "\n") + linha + "\n";
fs.writeFileSync(leia, txt);
JS
ls "$D"
