#!/bin/bash
# thumb_local.sh <ep> <clipe.mp4> <segundo> "<LINHA 1>" "<LINHA 2>" — thumb provisória quando o Chrome/ChatGPT está fora
R="E:/NOVELAS RELIGIOSAS"; F="C\:/Windows/Fonts/impact.ttf"; mkdir -p "$R/thumbs/$1"
ffmpeg -loglevel error -y -ss $3 -i "$2" -frames:v 1 -vf "scale=1080:1920,eq=contrast=1.15:saturation=1.3,drawtext=fontfile='$F':text='$4':fontsize=100:fontcolor=white:borderw=8:bordercolor=black:x=(w-tw)/2:y=150,drawtext=fontfile='$F':text='$5':fontsize=100:fontcolor=yellow:borderw=8:bordercolor=black:x=(w-tw)/2:y=280" "$R/thumbs/$1/thumb.png"
