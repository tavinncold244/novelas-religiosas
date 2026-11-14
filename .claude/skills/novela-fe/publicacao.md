# Publicação — YouTube Shorts, TikTok e Facebook Reels

Um único vídeo 9:16, **≤ 2:59** (limite dos Shorts), serve as três plataformas.

## Pasta pronta para postar
1. Escrever `projetos/<proj>/publicar.json`:
```json
{ "titulo": "Jesus mandou ele soltar o ouro… mas só um teve coragem",
  "gancho": "Dois homens pendurados no abismo. Um agarrado ao ouro, outro à colheita.",
  "moral": "Onde está o seu tesouro, ali está o seu coração.",
  "versiculo": "Mateus 6:21",
  "cta": "AMÉM",
  "hashtags": "#parábola #milagre" }
```
2. `bash ferramentas/fe/publica.sh <proj>` → `youtube_shorts/<proj>/` com `<proj>.mp4`, `<proj>_thumb.jpg`, `<proj>_youtube.txt` (TÍTULO com #shorts + TAGS + DESCRIÇÃO) e `<proj>_tiktok.txt` (legenda TikTok/Facebook); `youtube_shorts/LEIA-ME.md` lista tudo.
3. Séries em partes: um projeto por parte (`fe05-mala-velha-p1`, `fe05-mala-velha-p2`), cada uma ≤ 2:59, títulos terminando em "(Parte 1)" / "(Parte 2)".

## Título (o mesmo nas 3 plataformas)
Padrão dos que viralizaram: **frase com o elemento concreto + reticências + virada de fé**.
- "Jesus deu uma ordem, mas apenas um teve coragem de soltar…"
- "Ela foi a única a dar bom dia para um senhor de botas sujas de barro…"
- "O filho rico bateu a porta na cara da mãe, mas o desempregado dormiu no chão por ela"
- "Ele ajudou o homem que jogou lama nele na estrada…"
- "Se tu é pastor mesmo, cura minha mãe… e Jesus entrou naquela casa"
Regras: ≤ 90 caracteres, 1 emoji no máximo (🙏), começa pelo personagem ou por Jesus, nunca entrega o final.

## Legenda do post
- TikTok/Facebook: título + 1 linha de gancho + versículo + moral + CTA ("comenta AMÉM e de qual cidade") + hashtags.
- Hashtags fixas: `#fé #jesus #deus #historiasdefe #reflexão #amém #novela #emocionante` + 2–3 do tema (`#milagre #parábola #oração #família #sertão`). No TikTok, os perfis também usam `#fy #fyp`.
- Facebook: os perfis grandes repetem `#reflexão #liçãodevida #historia #novela` — manter.

## Na edição (dentro do vídeo)
- **Título fixo no topo** (0–3 s), caixa simples: "JESUS MANDOU ELE SOLTAR O OURO…" (Cenas faz isso nas partes: "…PARTE 2").
- **Cartão final** 3–4 s: "DEIXA SEU **AMÉM** NOS COMENTÁRIOS" (ou "COMENTA **PARTE 2**") por cima do último quadro.
- Marca d'água discreta com o nome da página ("Dramas De Fé" (definido pelo usuário 14/11)).

## Frequência (o que os perfis fazem)
- TikTok @historiasde.fee: 2–3 vídeos/dia, séries numeradas (PARTE 6, 7, 8…) — série prende o seguidor.
- Cenas que Movem / Além: ~1 por dia no Facebook.
- Começo da página: 1–2 por dia, alternando formato curto (P/M, 1:30–2:30) e novela (B/F).
