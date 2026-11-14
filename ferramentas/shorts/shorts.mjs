// Monta youtube_shorts/: episódios ≤ 3 min copiados; > 3 min divididos em 2 partes na emenda de clipe.
import { execFileSync } from "node:child_process";
import { readFileSync, mkdirSync, copyFileSync, existsSync, writeFileSync } from "node:fs";
const R = "E:/NOVELAS RELIGIOSAS", OUT = `${R}/youtube_shorts`;
const BIN = "E:/Ferramentas/ffmpeg/ffmpeg-9.0.2-full_build/bin";
const ff = (args) => execFileSync(`${BIN}/ffmpeg.exe`, ["-y", "-hide_banner", "-loglevel", "error", ...args], { stdio: "inherit", cwd: process.argv[3] });
const FONT = "impact.ttf"; // cópia local: o ffmpeg roda com cwd no scratchpad (evita escapar "C:")
const pontos = JSON.parse(readFileSync(process.argv[2], "utf8"));
const V = ["-c:v", "libx264", "-preset", "medium", "-crf", "19", "-pix_fmt", "yuv420p", "-c:a", "aac", "-b:a", "192k", "-movflags", "+faststart"];

function thumb(nome, destino, parte) {
  const src = existsSync(`${R}/thumbs/${nome}/thumb.png`) ? `${R}/thumbs/${nome}/thumb.png` : null;
  if (!src) return console.log(`SEM THUMB: ${nome}`);
  let vf = "scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920";
  if (parte) vf += `,drawbox=x=300:y=1560:w=480:h=170:color=0xE01E37@1:t=fill,drawtext=fontfile='${FONT}':text='PARTE ${parte}':fontsize=130:fontcolor=white:borderw=6:bordercolor=black:x=(w-tw)/2:y=1580`;
  ff(["-i", src, "-vf", vf, "-q:v", "2", destino]);
}

const leia = ["# YouTube Shorts — novelas de IA", "", "Todos com menos de 3 min. Os que passavam de 3 min viraram Parte 1 e Parte 2.", ""];
for (const [nome, p] of Object.entries(pontos)) {
  const dir = `${OUT}/${nome}`; mkdirSync(dir, { recursive: true });
  const src = `${R}/saida/${nome}.mp4`;
  if (!p.corte) {
    copyFileSync(src, `${dir}/${nome}.mp4`);
    thumb(nome, `${dir}/${nome}_thumb.jpg`);
    leia.push(`- ${nome} — ${Math.floor(p.total / 60)}:${String(Math.round(p.total % 60)).padStart(2, "0")} (inteiro)`);
    console.log(`OK ${nome} (inteiro)`);
    continue;
  }
  const c = p.corte, d2 = p.total - c;
  const tx = (texto, quando) => `drawtext=fontfile='${FONT}':text='${texto}':fontsize=92:fontcolor=white:borderw=7:bordercolor=black:box=1:boxcolor=0xE01E37@0.95:boxborderw=24:x=(w-tw)/2:y=230:enable='${quando}'`;
  ff(["-i", src, "-t", String(c), "-vf", tx("CONTINUA NA PARTE 2", `gte(t,${(c - 2.5).toFixed(2)})`), ...V, `${dir}/${nome}_parte1.mp4`]);
  ff(["-ss", String(c), "-i", src, "-vf", tx("PARTE 2", "lt(t,2.5)"), ...V, `${dir}/${nome}_parte2.mp4`]);
  thumb(nome, `${dir}/${nome}_parte1_thumb.jpg`, 1);
  thumb(nome, `${dir}/${nome}_parte2_thumb.jpg`, 2);
  const m = (s) => `${Math.floor(s / 60)}:${String(Math.round(s % 60)).padStart(2, "0")}`;
  leia.push(`- ${nome} — dividido: Parte 1 ${m(c)} + Parte 2 ${m(d2)}`);
  console.log(`OK ${nome} (${c.toFixed(1)} + ${d2.toFixed(1)})`);
}
writeFileSync(`${OUT}/LEIA-ME.md`, leia.join("\n") + "\n");
console.log("FIM");
