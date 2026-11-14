#!/bin/bash
# cartazes.sh <proj> "<TÍTULO DO TOPO>" [AMÉM|PARTE 2] [marca]
# Depois do novela.mjs: põe por cima de saida/<proj>.mp4
#   - título fixo no topo de 0 a 3 s (caixa preta translúcida, branco)
#   - cartão final nos últimos 3,5 s: "DEIXA SEU AMÉM NOS COMENTÁRIOS" ou "COMENTA PARTE 2" (palavra-chave em amarelo)
#   - marca d'água discreta no centro (padrão "Dramas De Fé")
# O original vira saida/<proj>_sem_cartaz.mp4.
R="E:/NOVELAS RELIGIOSAS"; P=$1; TIT=$2; CTA=${3:-AMÉM}; MARCA=${4:-Dramas De Fé}
IN="$R/saida/$P.mp4"; [ -f "$IN" ] || { echo "falta $IN"; exit 1; }
cd "$R/ferramentas/shorts" || exit 1          # impact.ttf fica aqui (drawtext não aceita C\: pelo execFile)
T=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$IN")
F=$(node -e "console.log((+process.argv[1]-3.5).toFixed(2))" "$T")
printf '%s' "$TIT" | fold -s -w 22 > _tit.txt
if [ "$CTA" = "PARTE 2" ]; then printf 'COMENTA' > _c1.txt; printf 'PARTE 2' > _c2.txt; printf '' > _c3.txt
else printf 'DEIXA SEU' > _c1.txt; printf '%s' "$CTA" > _c2.txt; printf 'NOS COMENTÁRIOS' > _c3.txt; fi
printf '%s' "$MARCA" > _m.txt
[ -f "$R/saida/${P}_sem_cartaz.mp4" ] || cp "$IN" "$R/saida/${P}_sem_cartaz.mp4"   # rodar de novo refaz a partir do original
ffmpeg -loglevel error -y -i "$R/saida/${P}_sem_cartaz.mp4" -vf "\
drawtext=fontfile=impact.ttf:textfile=_m.txt:fontsize=34:fontcolor=white@0.35:x=(w-tw)/2:y=h*0.46,\
drawtext=fontfile=impact.ttf:textfile=_tit.txt:fontsize=64:line_spacing=10:fontcolor=white:borderw=4:bordercolor=black:box=1:boxcolor=black@0.45:boxborderw=24:x=(w-tw)/2:y=h*0.10:enable='lt(t,3)',\
drawtext=fontfile=impact.ttf:textfile=_c1.txt:fontsize=92:fontcolor=white:borderw=6:bordercolor=black:x=(w-tw)/2:y=h*0.36:enable='gte(t,$F)',\
drawtext=fontfile=impact.ttf:textfile=_c2.txt:fontsize=130:fontcolor=yellow:borderw=7:bordercolor=black:x=(w-tw)/2:y=h*0.36+110:enable='gte(t,$F)',\
drawtext=fontfile=impact.ttf:textfile=_c3.txt:fontsize=92:fontcolor=white:borderw=6:bordercolor=black:x=(w-tw)/2:y=h*0.36+265:enable='gte(t,$F)'" \
  -c:v libx264 -preset medium -crf 18 -pix_fmt yuv420p -c:a copy "$IN" && echo "OK $IN"
rm -f _tit.txt _c1.txt _c2.txt _c3.txt _m.txt
