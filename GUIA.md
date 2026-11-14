# Editor Bilibili — fluxo de trabalho

Padrão de saída: **1920x1080 (16:9), 30 fps, H.264 + AAC, áudio normalizado a -16 LUFS**, legendas em **chinês simplificado** (Microsoft YaHei, branco com contorno preto, embaixo, gravadas no vídeo).

## Pastas
- `entrada/` — coloque aqui os vídeos brutos
- `projetos/<nome>/` — `projeto.json`, `legendas_zh.srt` e `work/` (arquivos intermediários)
- `saida/` — vídeo final `<nome>.mp4`
- `sfx/` — efeitos sonoros (chime, click, glitch-1..3, impact-bass-1..2, pop, riser, sparkle, whoosh, whoosh-short, whoosh-cinematic, typing, ping, notification...)
- `thumbs/<nome>/` — thumbnails (geradas no ChatGPT) + `referencias/`
- `motions/` — projetos HyperFrames (intros, títulos, animações). `intro-padrao/` → `intro-padrao.mp4`
- `ferramentas/editor.mjs` — script de edição

## Passo a passo
```bash
node ferramentas/editor.mjs silencios <p>    # sugere cortes de silêncio
node ferramentas/editor.mjs cortar <p>       # aplica os cortes e enquadra em 16:9
node ferramentas/editor.mjs transcrever <p>  # transcrição com tempo (whisper)
node ferramentas/editor.mjs blocos <p>       # frases curtas para traduzir
# -> o Claude traduz os blocos para chinês e escreve projetos/<p>/legendas_zh.srt
node ferramentas/editor.mjs render <p>       # legendas + sfx + intro/outro -> saida/<p>.mp4
```

## projeto.json
```json
{
  "entrada": "entrada/video.mp4",
  "idioma": "pt",
  "modelo_whisper": "medium",
  "cortes": [],
  "legendas": "legendas_zh.srt",
  "sfx": [{ "t": 3.2, "som": "whoosh", "vol": 0.6 }],
  "intro": "../../motions/intro-padrao.mp4",
  "outro": null
}
```
- `"formato": "vertical"` → saída 1080x1920 (9:16), legenda maior e mais alta. Sem isso, 16:9.
- Legenda no idioma falado no vídeo (português fica português).
- `entrada` pode ser uma lista (`["entrada/1.mp4", "entrada/2.mp4", ...]`) — os vídeos são juntados nessa ordem.
- Projetos com vários vídeos usam `projetos/<p>/montar.mjs`: legendas e efeitos escritos no tempo original, remapeados pelos cortes.
- `cortes`: trechos a **manter**, em segundos do vídeo original (vazio = vídeo inteiro).
- `sfx[].t`: tempo no vídeo **já cortado** (sem contar a intro).

## Motions (HyperFrames)
```bash
cd motions/intro-padrao
node ../../node_modules/hyperframes/bin/hyperframes.mjs lint
node ../../node_modules/hyperframes/bin/hyperframes.mjs render -o ../intro-padrao.mp4
```
Whisper.cpp fica em `E:\Ferramentas\whisper\Release` (o editor.mjs já adiciona ao PATH).
