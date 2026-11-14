#!/usr/bin/env node
// Editor Bilibili 16:9 — cortes, legendas em chinês, efeitos sonoros, intro/outro.
//
// Uso (sempre a partir de E:\NOVELAS RELIGIOSAS):
//   node ferramentas/editor.mjs silencios <projeto>        -> sugere cortes de silêncio (projetos/<p>/silencios.json)
//   node ferramentas/editor.mjs cortar <projeto>           -> work/cortado.mp4 (1920x1080, 30fps, áudio normalizado)
//   node ferramentas/editor.mjs transcrever <projeto>      -> work/transcricao.json (palavras com tempo)
//   node ferramentas/editor.mjs blocos <projeto>           -> work/blocos.json (frases prontas para traduzir)
//   node ferramentas/editor.mjs render <projeto>           -> saida/<projeto>.mp4 (legendas + sfx + intro/outro)
//
// Configuração em projetos/<p>/projeto.json:
// {
//   "entrada": "entrada/video.mp4",
//   "idioma": "pt",                         // idioma falado no vídeo (pt, zh, en...)
//   "cortes": [[0, 12.5], [15, 60]],        // trechos a MANTER (segundos do original); vazio = vídeo todo
//   "legendas": "legendas_zh.srt",          // relativo à pasta do projeto, tempos do vídeo já cortado
//   "sfx": [{ "t": 3.2, "som": "whoosh", "vol": 0.6 }],
//   "intro": "motions/intro.mp4",           // opcional
//   "outro": null                           // opcional
// }

import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve, basename } from "node:path";
import { fileURLToPath } from "node:url";

const RAIZ = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const WHISPER_DIR = "E:\\Ferramentas\\whisper\\Release";
// Formato padrão 16:9; "formato": "vertical" no projeto.json troca para 1080x1920 (9:16).
let W = 1920, H = 1080;
const FPS = 30;
const SEP = process.platform === "win32" ? ";" : ":";
const ENV = { ...process.env, PATH: `${WHISPER_DIR}${SEP}${process.env.PATH}` };

function run(cmd, args, opts = {}) {
  const r = spawnSync(cmd, args, { stdio: opts.capture ? "pipe" : "inherit", encoding: "utf8", env: ENV, shell: opts.shell, cwd: opts.cwd });
  if (r.status !== 0 && !opts.allowFail) {
    if (opts.capture) process.stderr.write(r.stderr || "");
    throw new Error(`${cmd} falhou (código ${r.status})`);
  }
  return r;
}

function ffprobe(file) {
  const r = run("ffprobe", ["-v", "error", "-print_format", "json", "-show_streams", "-show_format", file], { capture: true });
  const j = JSON.parse(r.stdout);
  return {
    dur: parseFloat(j.format.duration),
    temAudio: j.streams.some((s) => s.codec_type === "audio"),
    video: j.streams.find((s) => s.codec_type === "video"),
  };
}

function carregar(nome) {
  const dir = join(RAIZ, "projetos", nome);
  const cfgPath = join(dir, "projeto.json");
  if (!existsSync(cfgPath)) throw new Error(`Não achei ${cfgPath}`);
  const cfg = JSON.parse(readFileSync(cfgPath, "utf8"));
  if (cfg.formato === "vertical") [W, H] = [1080, 1920];
  const work = join(dir, "work");
  mkdirSync(work, { recursive: true });
  // "entrada" pode ser uma lista (ex.: 1.mp4, 2.mp4...): junta na ordem em work/juntado.mp4.
  if (!Array.isArray(cfg.entrada)) return { dir, work, cfg, entrada: resolve(RAIZ, cfg.entrada) };
  const juntado = join(work, "juntado.mp4");
  if (!existsSync(juntado)) {
    const arqs = cfg.entrada.map((e) => resolve(RAIZ, e));
    const args = ["-y", "-hide_banner", "-loglevel", "error", "-stats"];
    arqs.forEach((a) => args.push("-i", a));
    const f = arqs.map((_, i) => `[${i}:v]${enquadrar()}[v${i}];[${i}:a]aresample=48000[a${i}];`).join("")
      + arqs.map((_, i) => `[v${i}][a${i}]`).join("") + `concat=n=${arqs.length}:v=1:a=1[v][a]`;
    run("ffmpeg", [...args, "-filter_complex", f, "-map", "[v]", "-map", "[a]", ...VCODEC, ...ACODEC, juntado]);
  }
  return { dir, work, cfg, entrada: juntado };
}

// Enquadra qualquer vídeo em 1920x1080 sem distorcer (barras pretas se necessário).
const enquadrar = () => `scale=${W}:${H}:force_original_aspect_ratio=decrease,pad=${W}:${H}:(ow-iw)/2:(oh-ih)/2:black,setsar=1,fps=${FPS}`;
const VCODEC = ["-c:v", "libx264", "-preset", "medium", "-crf", "18", "-pix_fmt", "yuv420p"];
const ACODEC = ["-c:a", "aac", "-b:a", "192k", "-ar", "48000", "-ac", "2"];

function silencios(nome) {
  const { dir, entrada } = carregar(nome);
  const r = run("ffmpeg", ["-hide_banner", "-i", entrada, "-af", "silencedetect=noise=-35dB:d=0.8", "-f", "null", "-"], { capture: true });
  const { dur } = ffprobe(entrada);
  const ini = [...r.stderr.matchAll(/silence_start: ([\d.]+)/g)].map((m) => +m[1]);
  const fim = [...r.stderr.matchAll(/silence_end: ([\d.]+)/g)].map((m) => +m[1]);
  // Trechos de fala = intervalos fora dos silêncios, com 0.15s de folga.
  const manter = [];
  let cursor = 0;
  ini.forEach((s, i) => {
    const a = Math.max(0, cursor - 0.15), b = Math.min(dur, s + 0.15);
    if (b - a > 0.3) manter.push([+a.toFixed(2), +b.toFixed(2)]);
    cursor = fim[i] ?? dur;
  });
  if (dur - cursor > 0.3) manter.push([+Math.max(0, cursor - 0.15).toFixed(2), +dur.toFixed(2)]);
  const total = manter.reduce((t, [a, b]) => t + b - a, 0);
  writeFileSync(join(dir, "silencios.json"), JSON.stringify({ duracao_original: dur, duracao_sem_silencio: +total.toFixed(2), cortes: manter }, null, 2));
  console.log(`Original ${dur.toFixed(1)}s -> sem silêncios ${total.toFixed(1)}s (${manter.length} trechos). Veja silencios.json`);
}

function cortar(nome) {
  const { work, cfg, entrada } = carregar(nome);
  const info = ffprobe(entrada);
  const cortes = cfg.cortes?.length ? cfg.cortes : [[0, info.dur]];
  const args = ["-y", "-hide_banner", "-loglevel", "error", "-stats", "-i", entrada];
  if (!info.temAudio) args.push("-f", "lavfi", "-i", "anullsrc=r=48000:cl=stereo");
  const aSrc = info.temAudio ? "0:a" : "1:a";
  let f = "";
  // Terceiro valor opcional = zoom do trecho (ex.: 1.12) — alternar zooms disfarça os jump cuts.
  cortes.forEach(([a, b, z], i) => {
    const zoom = z > 1 ? `,crop=iw/${z}:ih/${z},scale=${W}:${H},setsar=1` : "";
    f += `[0:v]trim=${a}:${b},setpts=PTS-STARTPTS,${enquadrar()}${zoom}[v${i}];`;
    f += `[${aSrc}]atrim=${a}:${b},asetpts=PTS-STARTPTS,aresample=48000,afade=t=in:d=0.02,afade=t=out:st=${Math.max(0, b - a - 0.02)}:d=0.02[a${i}];`;
  });
  f += cortes.map((_, i) => `[v${i}][a${i}]`).join("") + `concat=n=${cortes.length}:v=1:a=1[v][araw];`;
  f += `[araw]loudnorm=I=-16:TP=-1.5:LRA=11[a]`;
  const out = join(work, "cortado.mp4");
  run("ffmpeg", [...args, "-filter_complex", f, "-map", "[v]", "-map", "[a]", ...VCODEC, ...ACODEC, out]);
  console.log(`OK -> ${out} (${ffprobe(out).dur.toFixed(1)}s)`);
}

function transcrever(nome) {
  const { work, cfg } = carregar(nome);
  const src = join(work, "cortado.mp4");
  if (!existsSync(src)) throw new Error("Rode 'cortar' antes.");
  const idioma = cfg.idioma || "pt";
  const modelo = cfg.modelo_whisper || "medium";
  const cli = join(RAIZ, "node_modules", "hyperframes", "bin", "hyperframes.mjs");
  run(process.execPath, [cli, "transcribe", src, "--engine", "whisper", "--model", modelo, "--language", idioma, "--dir", work]);
  // O CLI grava transcript.json na pasta --dir.
  const t = join(work, "transcript.json");
  if (!existsSync(t)) throw new Error("Transcrição não gerada.");
  writeFileSync(join(work, "transcricao.json"), readFileSync(t));
  console.log(`OK -> ${join(work, "transcricao.json")}`);
}

// Agrupa palavras em frases curtas (máx ~3.5s ou pausa > 0.5s ou pontuação final).
function blocos(nome) {
  const { work } = carregar(nome);
  const palavras = JSON.parse(readFileSync(join(work, "transcricao.json"), "utf8"));
  const out = [];
  let cur = null;
  for (const w of palavras) {
    const txt = w.text.trim();
    if (!txt) continue;
    if (cur && (w.start - cur.fim > 0.5 || w.end - cur.ini > 3.5)) { out.push(cur); cur = null; }
    if (!cur) cur = { ini: w.start, fim: w.end, texto: txt };
    else { cur.fim = w.end; cur.texto += (/^[\u3000-\u9fff]/.test(txt) ? "" : " ") + txt; }
    if (/[.!?。！？]$/.test(txt) || (/[,，、;；]$/.test(txt) && cur.fim - cur.ini > 1.6)) { out.push(cur); cur = null; }
  }
  if (cur) out.push(cur);
  const r = out.map((b, i) => ({ n: i + 1, ini: +b.ini.toFixed(2), fim: +b.fim.toFixed(2), texto: b.texto }));
  writeFileSync(join(work, "blocos.json"), JSON.stringify(r, null, 2));
  console.log(`OK -> ${r.length} blocos em ${join(work, "blocos.json")}`);
}

// No vertical a fonte escala pela altura: menor e mais alta na tela (acima da interface do app).
const estiloLegenda = () => [
  "FontName=Microsoft YaHei", `Fontsize=${H > W ? 13 : 17}`, "Bold=1",
  "PrimaryColour=&H00FFFFFF", "OutlineColour=&H00000000", "BackColour=&H80000000",
  "BorderStyle=1", "Outline=1.6", "Shadow=0.6", "Alignment=2", `MarginV=${H > W ? 50 : 18}`,
].join(",");

function normalizarSegmento(src, out) {
  const info = ffprobe(src);
  const args = ["-y", "-hide_banner", "-loglevel", "error", "-i", src];
  if (!info.temAudio) args.push("-f", "lavfi", "-t", String(info.dur), "-i", "anullsrc=r=48000:cl=stereo");
  args.push("-vf", enquadrar(), "-map", "0:v", "-map", info.temAudio ? "0:a" : "1:a", ...VCODEC, ...ACODEC, "-shortest", out);
  run("ffmpeg", args);
}

function render(nome) {
  const { dir, work, cfg } = carregar(nome);
  const base = join(work, "cortado.mp4");
  if (!existsSync(base)) throw new Error("Rode 'cortar' antes.");

  const args = ["-y", "-hide_banner", "-loglevel", "error", "-stats", "-i", base];
  const sfx = cfg.sfx || [];
  sfx.forEach((s) => {
    const arq = existsSync(join(RAIZ, "sfx", `${s.som}.mp3`)) ? join(RAIZ, "sfx", `${s.som}.mp3`) : resolve(dir, s.som);
    if (!existsSync(arq)) throw new Error(`Efeito não encontrado: ${s.som}`);
    args.push("-i", arq);
  });

  let vf = "[0:v]null";
  if (cfg.legendas) {
    const srt = join(dir, cfg.legendas);
    if (!existsSync(srt)) throw new Error(`Legenda não encontrada: ${srt}`);
    // Caminho relativo + cwd no projeto evita o escape de "E:\" no filtro subtitles.
    vf = `[0:v]subtitles=${cfg.legendas.replace(/\\/g, "/")}:fontsdir=C\\\\:/Windows/Fonts:force_style='${estiloLegenda()}'`;
  }
  let f = `${vf}[v];`;
  if (sfx.length) {
    sfx.forEach((s, i) => {
      const ms = Math.round(s.t * 1000);
      f += `[${i + 1}:a]aresample=48000,volume=${s.vol ?? 0.6},adelay=${ms}|${ms}[s${i}];`;
    });
    f += `[0:a]${sfx.map((_, i) => `[s${i}]`).join("")}amix=inputs=${sfx.length + 1}:duration=first:normalize=0,alimiter=limit=0.95[a]`;
  } else f += `[0:a]anull[a]`;

  const meio = join(work, "meio.mp4");
  run("ffmpeg", [...args, "-filter_complex", f, "-map", "[v]", "-map", "[a]", ...VCODEC, ...ACODEC, meio], { cwd: dir });

  mkdirSync(join(RAIZ, "saida"), { recursive: true });
  const final = join(RAIZ, "saida", `${nome}.mp4`);
  const partes = [];
  if (cfg.intro) { const p = join(work, "intro_n.mp4"); normalizarSegmento(resolve(dir, cfg.intro), p); partes.push(p); }
  partes.push(meio);
  if (cfg.outro) { const p = join(work, "outro_n.mp4"); normalizarSegmento(resolve(dir, cfg.outro), p); partes.push(p); }

  if (partes.length === 1) {
    run("ffmpeg", ["-y", "-loglevel", "error", "-i", meio, "-c", "copy", "-movflags", "+faststart", final]);
  } else {
    const lista = join(work, "concat.txt");
    writeFileSync(lista, partes.map((p) => `file '${p.replace(/\\/g, "/")}'`).join("\n"));
    run("ffmpeg", ["-y", "-loglevel", "error", "-f", "concat", "-safe", "0", "-i", lista, "-c", "copy", "-movflags", "+faststart", final]);
  }
  console.log(`PRONTO -> ${final} (${ffprobe(final).dur.toFixed(1)}s, ${W}x${H})`);
}

const [cmd, nome] = process.argv.slice(2);
const cmds = { silencios, cortar, transcrever, blocos, render };
if (!cmds[cmd] || !nome) {
  console.log("Uso: node ferramentas/editor.mjs <silencios|cortar|transcrever|blocos|render> <projeto>");
  process.exit(1);
}
try { cmds[cmd](nome); } catch (e) { console.error("ERRO:", e.message); process.exit(1); }
