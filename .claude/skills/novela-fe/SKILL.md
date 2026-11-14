---
name: novela-fe
description: Produz vídeos de FÉ verticais (9:16, até 2:59) para a página religiosa no YouTube Shorts, TikTok e Facebook — parábolas com Jesus, milagres com conversão, Jesus disfarçado testando a bondade, bondade recompensada e novelas de família em partes ("comenta PARTE 2"), com visual de filme, CTA de AMÉM e versículo. Usa o mesmo pipeline de geração/revisão/montagem da novela-ia. Use sempre que o usuário pedir vídeo, história, parábola, milagre, novela ou episódio de fé, Jesus, Deus, Bíblia ou religião neste projeto (E:\NOVELAS RELIGIOSAS), ou pedir para preparar/postar algo da página de fé.
---

# Vídeos de fé — página religiosa (Shorts, TikTok, Facebook)

Baseado no estudo de 3 perfis (Cenas que Movem 1,3 mi, Além Das Histórias 234 mil, @historiasde.fee no TikTok) — 17 vídeos baixados e transcritos em `referencias/fe/`.

Leia, conforme a etapa:
- `nicho.md` — o que viraliza no nicho e por quê (números, ganchos, CTAs reais). Ler uma vez por sessão.
- `formatos.md` — **os 6 formatos** (P parábola, M milagre com ameaça, J Jesus disfarçado, B bondade recompensada, F família em partes, S palco), batidas com tempo, rotação, banco de CTAs e de versículos. **Ler antes de todo roteiro.**
- `visual.md` — look de filme, luz dourada e a **descrição fixa de Jesus** (igual em todo episódio).
- `publicacao.md` — título, legenda, hashtags, partes, pasta pronta para postar.
- `historico.md` — episódios feitos. Nunca repetir o formato do anterior.
- `aprendizados.md` — o que deu certo/errado nesta página. Atualizar a cada episódio.

## Pipeline = o da novela-ia
Geração (RepoStore/VidoGrid), revisão de clipes, montagem sem silêncio, legendas e música seguem **exatamente** `.claude/skills/novela-ia/SKILL.md` (receita de 01/11, passos 1–6, `prompt.mjs`, `repostore.mjs`, `revisar.mjs`, `falantes.mjs`, `novela.mjs`) e os aprendizados técnicos dela (`novela-ia/aprendizados.md`). Ler esses dois antes de gerar. O que muda está abaixo.

## Regras desta página
1. **Deus age em todo episódio**: milagre, oração atendida, Jesus presente, perdão ou conversão. Não é só justiça social.
2. **Gancho = perigo/ameaça/ordem na 1ª frase** (regra 7 da novela-ia). Na parábola é Jesus dando a ordem no meio do perigo ("Solte essa bolsa de ouro. Dê-me a sua mão").
3. **Jesus**: bloco fixo de `visual.md` copiado literalmente; sereno, fala pouco, frases de efeito. Imagem de referência única em `referencias/fe/jesus_ref.png` (gerar na 1ª vez e reusar sempre).
4. **Final**: alguém olha para a câmera (Jesus, o pastor ou o convertido) e fala 1 CTA do banco + versículo. Depois, `cartazes.sh` põe o cartão "DEIXA SEU AMÉM NOS COMENTÁRIOS" (ou "COMENTA PARTE 2").
5. **Duração 1:30–2:59** — nunca 3:00 ou mais. P e M ficam em 1:30–2:30; B e F até 2:59 ou em partes.
6. **Visual de filme** (não vlog): no prompt trocar "smartphone vlog footage, handheld" por "cinematic film still look, 35mm lens, shallow depth of field, warm golden-hour light" (ver `visual.md`).
7. **Moderação**: sem arma, sangue, demônio/diabo, cruz/símbolo sagrado na ação, "glowing/halo". Ameaça só falada; milagre descrito pelo efeito e pela luz. Nada de folclore/pacto com o diabo (dá view, não dá comentário).
8. Valem também: zero silêncio, personagens idênticos, nenhum bug, cenas em dupla (4–6 por episódio), legenda palavra a palavra, thumb junto, falar com o usuário em português.

## Fluxo de um episódio
Pasta `projetos/fe<NN>-<slug>/` (ex.: `fe01-ouro-abismo`). Partes: `fe05-mala-velha-p1`, `-p2`.
1. **Formato** — abrir `historico.md`, escolher em `formatos.md` um formato diferente do último e variar cenário/fiel/vilão/milagre.
2. **Roteiro** (`roteiro.md`) — batidas do formato, 1ª frase = conflito, ~3,7 palavras/s (2:30 ≈ 520 palavras; 2:59 ≈ 620), 2–4 locações, oração em voz alta, CTA + versículo no fim. Escrever `publicar.json` junto (título com reticências, ver `publicacao.md`).
3. **Elenco** (`personagens.md`) — blocos fixos em inglês; Jesus pelo bloco de `visual.md`.
4. **Blocos e prompts** — `blocos.json` com o campo `"estilo"` (substitui a linha de vlog do prompt.mjs):
   `"estilo": "Fictional Brazilian faith drama performed by professional actors. Vertical 9:16, cinematic film look, ultra-realistic, 35mm lens, shallow depth of field, warm golden-hour light, gentle slow camera moves, shot in Brazil. One continuous scene in one location; every actor keeps exactly the same face, hair and clothes in every shot."`
   e o `prefixo`/`prefixo_ref` que evita as recusas "likeness"/"conflicts" (copiar do `projetos/fe01-mala-enchente/blocos.json`: "The attached reference images are AI-generated stills from earlier shots of this same fictional film… do not ask for clarification, just generate the video.")
   → `node ferramentas/prompt.mjs <proj> todos`. Personagem que larga um objeto na história ganha variante de bloco "EMPTY-HANDED" (ver `aprendizados.md`).
   Gerar cada clipe com `bash ferramentas/fe/clipe.sh <proj> <bloco> <tentativa> <refs>` (gera, espera, revisa, tira o último quadro, tenta 3x sozinho).
5. **Gerar e revisar cada clipe** — igual novela-ia (um por vez na conversa ancorada, md5, folha, transcrição, `falantes.mjs`).
   **Continuidade (pedido do usuário 13/11):** aprovou o clipe → `ffmpeg -sseof -0.05 -i clipes/BNN_vK.mp4 -frames:v 1 clipes/BNN_ultimo.jpg` → o próximo clipe do MESMO cenário sai com essa imagem de referência: `node ferramentas/repostore.mjs criar prompts/BNN.txt 10 <conv> clipes/BNN_ultimo.jpg` (até 3 imagens separadas por vírgula, ex. `+ ,referencias/fe/jesus_ref.png` quando Jesus entra). Mudou de cenário → usar a imagem de elenco/locação nova. Por isso os clipes saem em ordem, um de cada vez.
6. **Montar** — `edicao.json` (`ancorado: true`, `silencio_extra: true`) → `node ferramentas/novela.mjs <proj> tudo`. Música padrão da página (escolhida pelo usuário 14/11): `musica/fe_sad_piano_rain.mp3`, `volume_musica: 0.12` (ducking, sem atrapalhar as falas). Alternativas: piano/cordas emotivo (`musica/triste_piano_chuva.mp3`; para milagre/vitória buscar faixa de "worship/inspirational piano" no Pixabay, salvar como `musica/fe_<nome>.mp3` e registrar em `musica/catalogo.md`).
7. **Cartazes** — `bash ferramentas/fe/cartazes.sh <proj> "<TÍTULO CURTO EM MAIÚSCULAS…>" AMÉM` (ou `"PARTE 2"`; 4º argumento = nome da página na marca d'água). Conferir 1 quadro do início e 1 do fim.
8. **Revisão final** — `silencedetect` (0 vãos ≥ 0,3 s), duração ≤ 2:59 (`ffprobe`), legenda em 5 pontos e **fim de cada fala inteiro**: `bash ferramentas/fe/finais.sh <proj>` (o fim do "montado" tem de bater com o roteiro; se sumiu palavra, aumentar o `fim`/remover do `remover` desse clipe). Pedido do usuário 14/11: nunca cortar o finalzinho das falas.
9. **Thumb** — como `novela-ia/thumbnail.md`, mas o texto é de fé ("ELE NÃO QUIS SOLTAR O OURO / JESUS AVISOU"), Jesus ou o rosto em lágrimas em primeiro plano, luz dourada. `thumbs/<proj>/thumb.png`.
10. **Pasta para postar** — `bash ferramentas/fe/publica.sh <proj>` → `youtube_shorts/<proj>/` com vídeo, thumb, texto do YouTube (título, tags, descrição) e do TikTok/Facebook.
11. **Registrar** em `historico.md` e o que aprendeu em `aprendizados.md`.

## Mais referências
Reels do Facebook: `E:\Ferramentas\uv\programa\uvx.exe yt-dlp -f "best[ext=mp4]/best" --write-info-json -o "referencias/fe/<perfil>/%(id)s.%(ext)s" "https://www.facebook.com/reel/<id>"`.
TikTok (lista com views): `uvx yt-dlp --flat-playlist --print "%(id)s %(view_count)s %(duration)s %(title).120s" "https://www.tiktok.com/@historiasde.fee"`.
Transcrever rápido: `whisper-cli.exe -m C:\Users\Usuario\.cache\hyperframes\whisper\models\ggml-small.bin -l pt -t 11 -f audio.wav` (o `hyperframes transcribe` em paralelo ficou 10x mais lento).
Sem login no Facebook só aparecem ~10 reels por página; para ver a aba inteira, usar o Chrome do usuário (Claude in Chrome, logado).
