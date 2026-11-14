#!/bin/bash
# finais.sh <proj> [...] — para cada clipe montado (edicao/cNN.mp4) transcreve os últimos 2,2 s e mostra
# lado a lado com o fim do roteiro e o fim do clipe original. Fala que some no "montado" = corte comeu o final.
R="E:/NOVELAS RELIGIOSAS"; W=/e/Ferramentas/whisper/Release/whisper-cli.exe
M=/c/Users/Usuario/.cache/hyperframes/whisper/models/ggml-small.bin
S="${TMP:-/tmp}"
cd "$R"
for p in "$@"; do
  echo "=== $p"
  n=0
  for c in projetos/$p/edicao/c*.mp4; do
    n=$((n+1))
    info=$(node -e "const j=require('./projetos/$p/edicao.json'),bl=require('./projetos/$p/blocos.json');const c=j.clipes[$n-1];const f=bl.blocos.find(x=>x.id===c.bloco).falas;console.log(c.bloco+'\t'+c.arquivo+'\t'+f.at(-1)[2].split(' ').slice(-5).join(' '))")
    bloco=$(echo "$info" | cut -f1); arq=$(echo "$info" | cut -f2); fim=$(echo "$info" | cut -f3)
    ffmpeg -loglevel error -y -sseof -2.2 -i "$c" -ar 16000 -ac 1 "$S/e.wav"
    cut=$($W -m $M -l pt -t 11 -nt -f "$S/e.wav" 2>/dev/null | tr -d '\n' | sed 's/^ *//')
    ffmpeg -loglevel error -y -sseof -3 -i "projetos/$p/$arq" -ar 16000 -ac 1 "$S/o.wav"
    orig=$($W -m $M -l pt -t 11 -nt -f "$S/o.wav" 2>/dev/null | tr -d '\n' | sed 's/^ *//')
    printf '%s\n  roteiro: ...%s\n  montado: ...%s\n  original: ...%s\n' "$bloco" "$fim" "$cut" "$orig"
  done
done
