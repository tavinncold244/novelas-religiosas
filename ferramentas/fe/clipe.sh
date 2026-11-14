#!/bin/bash
# clipe.sh <proj> <bloco> <tentativa> <refs> [conversa] [id_existente]
#   Gera (ou retoma pelo id) o clipe do bloco, espera, baixa e revisa (revisar.mjs),
#   e já tira o ÚLTIMO quadro (clipes/<bloco>_t<K>_ultimo.jpg) para ser a referência do próximo clipe.
#   Se o RepoStore recusar ("likeness", "conflicts", região, imagem no lugar de vídeo), tenta de novo
#   sozinho até 3 vezes (K, K+1, K+2) antes de desistir.
#   refs = até 3 imagens separadas por vírgula (caminhos relativos à pasta do projeto) ou link de vídeo.
# Ex.: bash ferramentas/fe/clipe.sh fe01-mala-enchente B02 1 clipes/B01_t1_ultimo.jpg
R="E:/NOVELAS RELIGIOSAS"; P=$1; B=$2; K=$3; REFS=$4; CONV0=$5; ID=$6
cd "$R/projetos/$P" || exit 1
DUR=$(node -e "console.log(require('./blocos.json').blocos.find(b=>b.id==='$B').duracao)")
for TRY in 1 2 3; do
  CONV=${CONV0:-$P-$B-t$K}
  if [ -z "$ID" ]; then
    ID=$(node "$R/ferramentas/repostore.mjs" criar "prompts/$B.txt" "$DUR" "$CONV" "$REFS") || { K=$((K+1)); continue; }
    echo "$B t$K $ID $REFS" >> criados.txt
  fi
  L=$(node "$R/ferramentas/repostore.mjs" esperar "$ID"); echo "$L"
  URL=$(echo "$L" | awk '$2=="done"{print $3}')
  if [ -n "$URL" ]; then
    for n in 1 2 3; do node "$R/ferramentas/revisar.mjs" "$P" "${B}_t$K" "$URL" && break; sleep 20; done
    ffmpeg -loglevel error -y -sseof -0.05 -i "clipes/${B}_t$K.mp4" -frames:v 1 -q:v 2 "clipes/${B}_t${K}_ultimo.jpg"
    md5sum "clipes/${B}_t$K.mp4" | cut -c1-12
    exit 0
  fi
  echo "| $B | t$K | recusa | $(echo "$L" | cut -c60-200) |" >> revisao.md
  ID=""; K=$((K+1))
done
echo "FALHOU $B (3 tentativas)"; exit 2
