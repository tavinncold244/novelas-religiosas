#!/bin/bash
# thumb.sh <proj> <url_ou_arquivo_da_imagem_base> "<LINHA 1>" "<LINHA 2>" "<LINHA AMARELA>"
# Baixa a imagem base (gerada no RepoStore com refs do episódio), recorta 1080x1920, põe faixa escura
# no topo e 3 linhas centralizadas (2 brancas + 1 amarela). Saída: thumbs/<proj>/thumb.png
R="E:/NOVELAS RELIGIOSAS"; P=$1; SRC=$2; D="$R/thumbs/$P"; mkdir -p "$D"
if [[ "$SRC" == http* ]]; then curl -sL -o "$D/base.webp" "$SRC"; SRC="$D/base.webp"; fi
ffmpeg -loglevel error -y -i "$SRC" -vf "scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920" "$D/base.png" || exit 1
cd "$R/ferramentas/shorts" || exit 1
printf '%s' "$3" > _a.txt; printf '%s' "$4" > _b.txt; printf '%s' "$5" > _c.txt
ffmpeg -loglevel error -y -i "$D/base.png" -vf "drawbox=x=0:y=0:w=iw:h=520:color=black@0.45:t=fill,\
drawtext=fontfile=impact.ttf:textfile=_a.txt:fontsize=112:fontcolor=white:borderw=8:bordercolor=black:x=(w-tw)/2:y=50,\
drawtext=fontfile=impact.ttf:textfile=_b.txt:fontsize=112:fontcolor=white:borderw=8:bordercolor=black:x=(w-tw)/2:y=190,\
drawtext=fontfile=impact.ttf:textfile=_c.txt:fontsize=112:fontcolor=yellow:borderw=9:bordercolor=black:x=(w-tw)/2:y=335" "$D/thumb.png" && echo "OK $D/thumb.png"
rm -f _a.txt _b.txt _c.txt
