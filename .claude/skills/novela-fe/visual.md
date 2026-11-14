# Visual da página de fé (medido nas folhas de contato de 17 referências, 13/11/2026)

**Muda em relação à novela-ia:** lá o look é "vídeo de celular / vlog". Aqui os vídeos que viralizam são **cinematográficos** — parecem filme/série bíblica, não vlog.

## O que os 3 perfis mostram
| Perfil | Look |
|---|---|
| Cenas que Movem (1,3 mi seg., até 11 mi views) | Luz dourada de pôr do sol, contraluz, poeira no ar, cânion/sertão/casa de taipa, close extremo com lágrima, **Jesus em túnica de linho bege, cabelo castanho ondulado até o ombro, barba cheia, olhar sereno**. Cenas de estúdio de TV, chuva na cidade, casas de luxo para novelas de família. |
| Além Das Histórias (234 mil seg., 300–900 mil views) | Novela realista de dia nublado/interior bem iluminado (oficina, concessionária, estrada de barro), muitos **planos médios com 2–3 pessoas**, figurinos fixos e fáceis (camisa xadrez azul + boné bege; terno azul + gravata vinho; polo verde). Jesus só no **fim**, em close sereno com o pôr do sol atrás, falando para a câmera. |
| @historiasde.fee TikTok (até 460 mil views) | Favela de tijolo à vista, quarto pobre com luz quente de abajur/janela, pastor de camisa branca com Bíblia preta no peito, doente na cama, ajoelhados rezando. Final com todo o elenco olhando a câmera + texto "DEIXA SEU AMÉM NOS COMENTÁRIOS". 1080x1920. |

## Regras visuais (para todo prompt)
- 9:16, 1080x1920, **cinematic film look**, ultra-realista, lente 35–50 mm, profundidade de campo rasa.
- Luz motivada e quente: **golden hour**, raio de sol pela janela, vela/lamparina, poeira no ar. Crise = tons frios/escuros; milagre = a luz dourada entra no quadro.
- Close no rosto nas falas emotivas (lágrima escorrendo vende), **plano médio de 2+ pessoas** nas brigas e no perdão (regra 8 da novela-ia continua valendo).
- Planos simbólicos curtos sem fala (mão segurando a de outro, porta abrindo com luz, Bíblia aberta, curativo caindo) — só como **cobertura** por cima da fala (nunca silêncio).
- Brasil: casa de taipa/tijolo, sertão, favela, roça, igreja simples, hospital público, cidade com chuva.

## Jesus (personagem fixo — mesma descrição em TODO episódio)
Copiar literalmente nos prompts:
```
JESUS — man in his early 30s, Middle-Eastern features, warm olive skin, shoulder-length wavy
dark-brown hair parted in the middle, full well-groomed dark-brown beard, calm kind brown eyes,
gentle smile. Simple long ivory/beige linen robe with a V-neck and a light-brown cloth sash,
barefoot or simple leather sandals. No halo, no glow effects on the body, no jewelry.
Voice: calm, deep, warm, slow Brazilian Portuguese.
```
- Sempre **sereno**: nunca grita, nunca ri alto. Fala devagar, frases curtas, chama de "filho", "filha", "meu filho".
- Pode aparecer **disfarçado** (andarilho, pedinte, homem de chapéu na estrada) e só no fim mostrar quem é. Nesse caso, outro bloco de figurino, mas o MESMO rosto/cabelo/barba.
- Gerar 1 imagem de referência dele (create_image 9:16, retrato, fundo de pôr do sol) e reutilizar em todos os episódios: `referencias/fe/jesus_ref.png`.
- Moderação (aprendizado da novela-ia): evitar "cross necklace", "holy symbols in the action", "glowing", "halo". Descrever o milagre pelo efeito ("the old man stands up from the bed, amazed, smiling") e pela luz ("warm golden sunlight fills the room").

## Texto na tela
- Os perfis NÃO usam legenda palavra a palavra (Cenas usa um título fixo no topo "A AMANTE GRÁVIDA… PARTE 2"; TikTok só o CTA final). **Nós usamos legenda sincronizada** (padrão da casa, ajuda retenção sem som) + **título fixo no topo nos 3 primeiros segundos**.
- Último 3–5 s: cartão "DEIXA SEU **AMÉM** NOS COMENTÁRIOS" (branco, AMÉM em amarelo, contorno preto) por cima do quadro final com o elenco olhando a câmera.
- Marca d'água da página no centro, discreta (todos os 3 perfis fazem — ajuda contra repostagem).
