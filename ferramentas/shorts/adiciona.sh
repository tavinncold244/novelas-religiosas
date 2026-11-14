#!/bin/bash
# adiciona.sh <ep> — põe um episódio (≤ 2:59, inteiro) em youtube_shorts com thumb e textos
R="E:/NOVELAS RELIGIOSAS"; EP=$1; D="$R/youtube_shorts/$EP"; mkdir -p "$D"
T0=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$R/saida/$EP.mp4"); node -e "process.exit(+process.argv[1]>179.5?1:0)" $T0 || { echo "PASSA DE 2:59 ($T0 s) — cortar antes"; exit 1; }
cp "$R/saida/$EP.mp4" "$D/$EP.mp4"
ffmpeg -loglevel error -y -i "$R/thumbs/$EP/thumb.png" -vf "scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920" -q:v 2 "$D/${EP}_thumb.jpg"
T=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$D/$EP.mp4")
echo "{\"$EP\":{\"total\":$T}}" > "$R/ferramentas/shorts/_p.json"
node "$R/ferramentas/shorts/textos.mjs" "$R/ferramentas/shorts/_p.json"
grep -q "^- $EP " "$R/youtube_shorts/LEIA-ME.md" || node -e "const t=+process.argv[1];console.log(\"- $EP — \"+Math.floor(t/60)+\":\"+String(Math.round(t%60)).padStart(2,\"0\")+\" (inteiro)\")" $T >> "$R/youtube_shorts/LEIA-ME.md"
ls "$D"
