# Aprendizados (atualizar a cada episódio — mais recente no topo)

## 2026-11-05 — ep20 (caixa filmado) na RepoStore, com cenas em dupla — saida/ep20-caixa-filmado.mp4, 3:05
- **Gancho novo** (regra 7): C01 = gerente acusando a caixa cara a cara ("Abre essa bolsa agora, Andreia!").
- **Duplas funcionam** (regra 8): `dupla` no bloco → prompt.mjs pede "medium two-shot… ONLY X speaks… Y keeps the mouth CLOSED". 9/23 duplas, voz sempre na boca certa (falantes.mjs). Solo em `plano` médio.
- RepoStore agora entrega por `www.videoapi.com.br/.../download` → **curl -L** (sem -L o arquivo sai com 0 bytes).
- Conversas ancoradas em imagem de elenco: as 2ª/3ª/4ª locações devolveram SÓ "image instead of a video". Remédio que funcionou: 1º clipe da locação em conversa NOVA sem elenco (`noref.sh`), o resto por ref desse clipe (`refaz.sh`/`insiste_ref.sh`).
- Conversa ancorada às vezes devolve o clipe ANTERIOR (C03=C02, C18=C17, md5 igual) → checar md5 sempre.
- **Nome de personagem em produto**: papel higiênico "Vanessa" na prateleira (C09, C16) e "PRISCILA" na porta da caminhonete (ep21). Cenários agora dizem "no products with labels, no writing or names anywhere" — conferir rótulos com zoom.
- **Legenda queimada aparece muito** (ep22: C01, C07, C14, C22): olhar o terço de baixo de TODO clipe em 2, 5 e 8 s antes de aprovar. Clipe noref pode vir com legenda queimada (C03 t6) e às vezes vira dupla mesmo pedindo solo.
- Abertura posada (elenco em fila) dentro da fala: `cobrir.ate` é tempo do ARQUIVO original (antes do corte de silêncio) — tem que passar do fim da pose no arquivo (ver quadros 0–2 s), senão o corte joga a cobertura fora. Cobrir os 0,8 s com um insert recortado do próprio clipe sem rosto (mão com o celular) — `cobrir.de`.
- Recusa "couldn't generate that exact version": tirar "pointing to the exit door", "hiding phone behind his back"; noref + ref de clipe sem choro passou.


## 2026-11-04 — ep17 (marmiteira) e ep18 (UTI) no VidoGrid, conta nova JR
- **Download sem o Chrome:** o botão Download parou de baixar (bloqueio de vários downloads). Solução: `node ferramentas/recebe.mjs` (servidor 127.0.0.1:8765) e, com o vídeo aberto no histórico, JS na página faz `fetch('http://127.0.0.1:8765/epNN_CNN_v1.mp4',{method:'POST',body:video.currentSrc})` → o servidor baixa a URL assinada do R2 para projetos/_recebidos/. Revisão: `projetos/rev2.sh <proj> CNN_v1`.
- Fluxo por clipe (só 1 por vez; um 2º pedido volta 503): página /app/video-gen/grok → (ref) `button[aria-label="Add reference image"]` + file_upload no input do diálogo → JS escolhe 'Grok Imagine Video 1.5','9:16 Portrait','1080p FHD','15s','Audio On', seta o textarea pelo setter nativo e clica GENERATE (repetir até 3x se 'Generation failed' 503). Histórico: /history?filter_by=video, 1º card = mais novo.
- **Contador /profile/usage "GENERATIONS"**: bloqueio por moderação CONTA; erro 503/"server currently…" NÃO conta. As 2 gerações antigas do dia (00:49 UTC) entram no limite de 20/dia UTC.
- Moderação derrubou: "arrogant, pointing aggressively… chame o segurança" e "happy tears, hand on her cross necklace" (este passou reescrito como "very happy and emotional, smiling warmly, one hand on her chest"). Evitar adjetivos agressivos e símbolos religiosos na ação.
- Ref fixa o cenário: cenas do 'ponto de ônibus' viraram sala de espera do hospital para manter o rosto da Marta.
- 9 clipes de 15 s → 1:56 depois do corte de silêncio (≈12,9 s úteis por clipe).

## 2026-11-04 — retomada ep13/ep14 na RepoStore
- **Limite da conta: 300 gerações por dia** ("Você chegou ao limite de 300 gerações por dia. Libera uma vaga em 9 h 44 min"). Janela móvel: as vagas voltam aos poucos. Com ~4 tentativas por clipe útil, isso dá ~2 episódios de 32 clipes por dia. Não disparar tenta.sh em massa; cada falha conta.
- Erros intermitentes continuam (região, image instead of video, serviço indisponível) — ~30% dos pedidos.
- Ref que abre com 2 pessoas posadas (C08: Paulo+Jesus) faz o modelo recusar o clipe de 1 pessoa ("conflicts") → usar ref de clipe com o personagem sozinho.
- revisar.mjs rodando em paralelo às vezes sai com TEXTO vazio (whisper concorrente) → rerev.sh re-baixa e revisa em sequência.
- Paulo (35) sai com entradas no cabelo na luz do entardecer em quase todos os clipes; mesmo homem (cicatriz, camiseta) → aceito.
- Capa do ep15 no ChatGPT: o perfil do Chrome do VidoGrid estava deslogado no ChatGPT — o usuário entrou e saiu de 1ª (941x1672).

## 2026-11-03 — ep11 (personal) e ep12 (poço), arquétipo B, produzidos em paralelo
- **RepoStore instável o dia todo**: "Video generation isn't available for this account in your country or region", "the generation service is temporarily unavailable", "the model produced an image instead of a video" e "Muitas tentativas. Espere um pouco". São intermitentes — o mesmo pedido passa na 2ª–5ª tentativa. `projetos/tenta.sh <proj> <bloco> "<ref> <t>"` refaz por referência até 4 vezes com 60 s de espera; `repostore.mjs criar` agora também espera quando a resposta diz "tentativas/espere".
- **"Image instead of a video"** aconteceu na 1ª aparição em conversa com imagem de elenco (Marcelo, Edson). Saída: conversa NOVA sem imagem e sem o prefixo (`tail -n +2 prompts/CNN.txt > CNN_noref.txt`), e os outros clipes do personagem por referência desse.
- **Conversa ancorada travou devolvendo o clipe anterior** (ep11: C02 = C01, depois C02 = C13). Mesmo remédio: conversa nova.
- **Clipe misturado entre episódios**: o C05 do ep11 começou com o Kauã e virou o barbeiro do ep10 falando "Fica com o like!". Rodar 2 episódios em paralelo na mesma conta pode cruzar contexto — sempre transcrever e olhar o rosto aos 5 s.
- **Referência carrega a FASE da história**: com o Edson de cadeira de rodas como ref, as cenas de "6 meses depois" saíram com ele sentado. Para depois do salto de tempo, usar como ref um clipe já da fase nova (de muleta).
- Quando um clipe de reação/reflexão falha ou queima legenda 3+ vezes, cortá-lo do episódio (ep11 C28, ep12 C12) — o episódio continua > 3 min.
- **Pausas que o corte por volume deixa passar**: `novela.mjs` tem a opção `silencio_extra: true` no edicao.json, que também remove todo vão do `silencedetect` (−35 dB, ≥ 0,3 s). Usar sempre.
- `projetos/faltam.mjs <proj>` lista as tentativas baixadas de cada bloco e os que faltam.

## 2026-11-02 — ep09 (gari, arquétipo D) — saida/ep09-gari.mp4, 3:36, 712 palavras
- **"rate_limited" do RepoStore** com ~18 lotes/refazimentos em paralelo (cada um fazendo init + polling). `repostore.mjs` agora repete a chamada com espera aleatória de 15–30 s e o `esperar` consulta a cada 30 s. Mesmo assim, disparar no máximo ~10 em paralelo e espaçar 3–10 s entre eles.
- Quando o `esperar` cai, o pedido continua no servidor: recuperar o id em criados.txt e rodar esperar/status de novo (não precisa gerar de novo).
- Idade do protagonista idoso deriva (62 → ~75) mas fica IGUAL em todos os clipes por referência — aceitável quando consistente.
- B-roll da conversa ancorada às vezes abre com o elenco posado: usar `ini` ≥ 1,5 s no cobrir (gerar_edicao.mjs tem OFF por locação).

## 2026-11-02 — ep08 (costureira, arquétipo B) — saida/ep08-costureira.mp4, 3:38, 662 palavras
- **Figurino estampado sem cor de fundo varia entre imagens de elenco** (camisa florida saiu com fundo preto numa locação e branco na outra). Descrever a cor de FUNDO da estampa ("WHITE shirt with big blue hibiscus print") e conferir as imagens de elenco lado a lado ANTES de gerar clipes.
- **Referência contamina a pose**: 5 clipes da Marlene por referência do C09 (oração) saíram todos rezando, mesmo com falas alegres. A ref deve ter pose/emoção NEUTRA (ou a mesma da cena).
- **Conversa ancorada "trava"**: a partir de certo ponto cada novo pedido devolve o clipe anterior (C14 = C11, C14 = C17 duas vezes). Saída: conversa nova por referência.
- Recusas por referência sem motivo claro ("couldn't generate"): tirar "teary eyes"/"hand over mouth" e trocar a ref resolveu.
- Ref de outra locação gera conflito ("checked the reference… conflicts") → usar ref da MESMA locação.
- Links videoapi.com.br às vezes não baixam; `repostore.mjs status <id>` devolve o link media.repostorevideo.shop que funciona (lote.sh/refaz.sh do ep08+ já usam). `ferramentas/erro.mjs <id>` mostra o erro completo.

## 2026-11-02 — ep07 (roça/geladeira, arquétipo A) — saida/ep07-roca-geladeira.mp4, 3:44, 681 palavras
- Loja com 23 clipes: anchored só para as 1ªs aparições (8) e 15 em paralelo por referência → pronto em ~1 h. **Legenda queimada em 4 dos 15 por referência** (C16, C17, C19, C25 — falas com nome próprio/números). Acrescentei ao prefixo_ref "The bottom of the frame must stay clean: NO subtitles, NO captions."
- C20 "recusado" 2x não por conteúdo: o modelo parou pedindo esclarecimento ("conflitos entre tempo e tom"). Resolveu encurtando a fala (20 → 15 palavras) e emoção calma. Ler o erro inteiro (repostore get_video .error) antes de suavizar.
- Figurino mudou de cor num clipe por referência (camiseta cinza → turquesa) — revisar cor da roupa também.
- Pausa de 0,30 s passou de novo no corte → `remover` no edicao.json. Rodar silencedetect sempre.

## 2026-11-02 — ep06 (luz cortada, arquétipo C) — saida/ep06-luz-cortada.mp4, 3:42, 694 palavras
- **Fila longa de uma locação dividida**: a conversa ancorada gera só a 1ª aparição de cada personagem; o resto da locação sai em PARALELO por `refaz.sh <bloco> t1 "<bloco_ref> t1"` (1 conversa por clipe, ref = clipe aprovado do mesmo personagem). 8 clipes da rua prontos em ~10 min, rostos iguais. Usar sempre que uma locação tiver > 10 clipes.
- Personagem "disfarçado" (Jesus como pedinte) envelheceu em 2 de 3 tentativas dentro da casa. Funcionou: idade explícita + "NO grey hair, young smooth face" na descrição e ref de um clipe em que ele está fiel.
- Cena noturna (velas) na mesma conversa da imagem de elenco diurna funcionou, e a "luz acendendo sozinha" também.
- Duplicado 1 de 32 (C18=C17), legenda queimada 1 (C09).
- Revisões rápidas: ver.sh pega legenda queimada na hora (terço inferior).

## 2026-11-02 — ep05 (moto/inveja, arquétipo E) — saida/ep05-moto-inveja.mp4, 3:32, 711 palavras
- Mesma receita do ep04 (32 clipes de 1 pessoa, 4 conversas). Só 2 refazimentos: C16 (Lucas saiu com outro rosto na oração) e C32 (Jesus com legenda queimada — refeito na própria conversa ancorada, t2 limpo).
- Nenhum duplicado desta vez. Legenda queimada continua aparecendo em clipe de 1 personagem falando para a câmera.
- O corte de silêncio deixou passar uma pausa de 0,64 s (som baixo acima do piso). `novela.mjs` agora aceita `"remover": [[a, b]]` por clipe (tempos do arquivo original) — conferir SEMPRE `silencedetect` no montado e corrigir antes de entregar.
- `ver.sh` (ep05+): uma linha por clipe com rosto aos 5 s + tira de pose 2,5 s + terço inferior em 3 tempos (legenda?) + md5 — revisão de 6–9 clipes numa imagem só.
- `falantes.mjs` precisa do edicao.json já existir.

## 2026-11-01 — ep04 (borracheira, arquétipo D) — saida/ep04-borracheira.mp4, 3:43, 710 palavras
- **Pedido do usuário: vídeos acima de 3 min.** 32 clipes de 10 s, 1 fala de ~20–27 palavras cada (máx. 32) → 223 s depois do corte de silêncio (~7 s úteis por clipe). Para 3 min+ planejar ≥ 30 clipes / ≥ 650 palavras.
- **Todos os clipes com 1 pessoa só** ("Close-up on X ONLY…"): 0 voz no personagem errado em 32 clipes.
- 4 conversas em paralelo (borracharia 17 clipes, casa 6, escritório 8, Jesus 1) + refazimentos em conversas próprias com `video_url` (`refaz.sh <bloco> <t> "<bloco_ref> <t>"`). Total ~2 h com fila da conta dividida com outra sessão.
- `repostore.mjs criar|imagem` agora **espera vaga** quando a fila da conta está cheia (repete a cada 30 s) — antes saía com erro. `imagem <prompt> <conversa>` cria as imagens de elenco pelo script.
- **Duplicados na fila sequencial: 4 de 32** (C05=C04, C14=C13, C22=C21, C31=C30), não só no último. md5 em todos, sempre.
- **Legenda queimada mesmo com "CRITICAL: NO TEXT" no topo**: 2 de 32 (C10, C30 — ambos da menina Bia, cena alegre). Detectar com `texto.sh` (terço inferior em 3 tempos, 1 linha por clipe) — a folha de contato pequena NÃO mostra a legenda.
- **Idade deriva**: a Rosa (45) saiu com 55–70 em alguns clipes, pior em refazimento com ref de clipe já envelhecido (C31 t2 idosa). Escolher como ref o clipe em que o personagem está mais fiel à imagem de elenco.
- Refazimento às vezes repete a ÚLTIMA frase no começo (C10 t2: "Eu te amo muito, viu? Tá bom, mãe…") → aproveitar com `ini` no edicao.json.
- Thumb: ChatGPT acertou de primeira com 3 refs (protagonista, revelado de terno, vilão em choque).

## 2026-11-01 — ep03 (catador/carteira, arquétipo B) — saida/ep03-catador-carteira.mp4, 2:40, 491 palavras, 0 silêncio, −15,8 LUFS
- **3 locações = 3 imagens de elenco em 3 conversas** (ep03-casa, ep03-rua, ep03-loja) + Jesus em conversa própria → filas sequenciais rodando EM PARALELO entre si. Rostos/roupas mantidos. Personagem com 2 figurinos (Davi catador / de terno): chave extra `DAVI_TERNO` + `"rotulos": {"DAVI_TERNO": "DAVI"}` no blocos.json (prompt.mjs agora suporta).
- **Quase tudo em clipes de 1 pessoa só** ("Close-up on X ONLY… nobody else in the frame") → voz no personagem errado caiu a quase zero. Os únicos erros de "quem" foram em clipes com 2 pessoas: C09 (rosto do falante saiu do quadro) e C17 (Bernardo apresentou o RODRIGO como Davi). Regra: 2 pessoas só quando inevitável.
- **O ÚLTIMO clipe de cada fila sequencial voltou DUPLICADO do anterior** (C04=C03, C06=C05, C22=C21 — md5 igual), mesmo pedindo um por vez. Sempre md5 em todos.
- Figurino trocado: Rodrigo saiu com o terno do Davi (descrições de 4 pessoas na mesma conversa se misturam) → refazer com `video_url` de um clipe do próprio personagem.
- **Legenda queimada** voltou 3x (C19 t1, t2; C06 t10). Funcionou: linha no TOPO do prompt "CRITICAL: this video must contain NO TEXT OF ANY KIND on screen…". prompt.mjs agora diz "ABSOLUTELY NO subtitles… each line is spoken only once" (C12 repetiu a fala inteira).
- **Recusas**: oração com choro/joelhos e Kelly "crying, mascara running" → "the model ended the turn without a video". Passou com tom calmo/esperançoso ("sitting, hands together, calm hopeful face", "sad, regretful, teary eyes"). Referência de clipe com choro também parece puxar recusa — usar ref de clipe calmo do mesmo personagem.
- **Fila de 8 pedidos é da CONTA**: outra sessão/sócio usando a mesma chave ocupa a fila ("Você já tem 8 pedidos na fila") e `repostore.mjs criar` devolve o erro como texto → o `esperar` fica em loop com id inválido. Checar se o id parece UUID antes de esperar; se fila cheia, esperar e repetir.
- Sem referência o rosto do protagonista muda um pouco (C06 t12 com ref de outra locação: aceitável, mas não idêntico).
- Thumb: ChatGPT acertou o texto de primeira com 3 refs (antes/depois do protagonista + vilã em choque) e recorte circular "antes".

## 2026-11-01 — ep02 (boleira/loja de noivas) — saida/ep02-boleira-noivas.mp4, 2:31, 473 palavras
- Receita do ep01 (elenco + clipes de 10 s na conversa ancorada) manteve rostos/roupas em 17/17 clipes. Clipe sem elenco no início (C06, C09, C16, C17) também saiu igual.
- **Voz no personagem errado continua o bug nº 1** (7 de 17 na 1ª passada), mesmo com "SHOT n — close-up on X". O padrão: em clipe de 2 falas, a 2ª pessoa às vezes aparece mexendo a boca na fala da 1ª. **Remédio que funcionou 5/5: clipe com UMA pessoa só na tela** ("Close-up on X ONLY for the whole clip… nobody else in the frame") — e reaproveitar a fala certa do clipe antigo com `ini`/`fim` no `edicao.json` (mesmo arquivo pode entrar 2x com trechos diferentes; criar blocos C09A/C09B etc. em blocos.json para a legenda).
- Fala curta de 1 pessoa (8 palavras) → clipe de **5 s** funciona.
- **Paralelo sem bug:** cada clipe em conversa própria (`ep02-<bloco>-ref1`) com `video_url` = clipe aprovado do mesmo personagem/cenário + `prefixo_ref`. 3 clipes prontos juntos em ~3 min, aparência igual. Usar isso para refazimentos.
- **Tarefas em segundo plano morrem quando a sessão/PC reinicia** (aconteceu 3x). `lote.sh` agora grava `criados.txt` logo após criar (dá para recuperar o link com `repostore.mjs status <id>`). Preferir gerar em primeiro plano, 1 chamada por clipe, ou paralelo em conversas separadas.
- O modelo voltou a **queimar legenda** num refazimento (C09 t2) → "ABSOLUTELY NO subtitles" em todos os prompts.
- Pose do elenco: medir com tira 6 fps dos 2,5 s iniciais (`ffmpeg -t 2.5 -vf fps=6,scale=80:-1,tile=15x1`); variou 0,2–2,0 s. b-roll da loja vazia saiu com piso diferente — ok para cobertura curta.
- `novela.mjs tudo` com 21 trechos leva >10 min → rodar em background.

## 2026-11-01 — ep01 v2: voz no personagem errado + lip sync (feedback do usuário)
- O usuário viu: **"o personagem que fala não é o que era pra estar falando"** e boca fora de sincronia. Causas achadas:
  1. O modelo às vezes coloca a voz de A enquanto mostra B mexendo a boca (5 de 17 clipes: C04, C05, C08, C09, C15). A revisão por transcrição + folha geral NÃO pega isso.
  2. **Culpa da edição:** congelar o 1º quadro (capa) por até 1 s enquanto a fala já rola = boca parada com voz → parece lip sync quebrado. NÃO congelar quadro com fala.
- Correções:
  - `ferramentas/falantes.mjs <proj> [clipes]`: folha por FALA (quem deveria falar + 4 quadros dentro da fala). Revisar TODA fala: o personagem do rótulo está na tela de boca mexendo? Em dúvida, quadros densos (fps=4) do trecho.
  - Prompt (prompt.mjs): cada fala é um "SHOT n — close-up on NOME, who says …"; "only their lips move… everyone else listens with their mouth closed".
  - Prompt: "the first 1.5 seconds are a silent establishing shot — nobody speaks" → o elenco posado cai no silêncio e o corte de silêncio o remove. Sem capa congelada.
  - Com a abertura silenciosa sobram ~8,5 s → no máximo ~30 palavras por clipe de 10 s.
  - Para gerar em paralelo sem o bug de vídeo trocado: cada clipe numa conversa própria com `video_url` = clipe aprovado cujo 1º quadro é o elenco posado (`prefixo_ref`).
- Resultado da regeneração (10 clipes): **o "SHOT n — close-up on NOME" resolveu o falante errado em 10/10** (quando aparece outra pessoa é reação de boca fechada). MAS o modelo **ignorou** o "1.5 s silent establishing shot": a fala começa em 0 s e, com `video_url`, o elenco posado fica 0,3–1,7 s na tela enquanto alguém fala. Um clipe (C13) perdeu a última fala curta → tirei do roteiro.
- **Solução de edição para o elenco posado: cobrir com b-roll do cenário SEM pessoas** (gerar 1 clipe de 10 s "slow camera movement across the lobby, NO people, no voices"), voz por cima — recurso normal de edição, sem quebrar lip sync. No `edicao.json`: `"cobrir": {"ate": <fim da pose>, "de": "clipes/BROLL.mp4", "ini": <trecho do b-roll>}`; variar o trecho entre clipes. Medir o fim da pose com tira de 6 fps dos 2,5 s iniciais.
- **Usuário aprovou a v2 ("ficou certo")** → esta é a receita padrão: close no falante por fala + revisão `falantes.mjs` + b-roll para cobrir pose.
- Resultado final v2: 2:20, 501 palavras, 0 pausas ≥ 0,3 s, −15,6 LUFS, nenhum clipe abre com pose, falante certo em todas as falas revisadas.

## 2026-11-01 — ep01 entregue (saida/ep01-pedreiro-hotel.mp4, 2:26, 541 palavras, 0 silêncio)
- 17 clipes de 10 s; 26 gerações no total (refazimentos: 2 por aparência, 5 por bug de vídeo trocado/repetido, 2 recusas, 1 com legenda queimada, 1 com pessoa duplicada).
- O modelo às vezes **queima legenda na imagem** mesmo com "no subtitles" → reforçar "ABSOLUTELY NO subtitles, captions or any text burned into the image".
- O modelo às vezes **duplica um personagem** por 1–2 quadros (dois Joaquins) → olhar a folha com atenção.
- Clipe de cena nova (suíte) sem referência saiu com outro Joaquim; com `video_url` = clipe aprovado da suíte (C17) saiu igual.
- Recusa em cena de idosa chorando com referência do saguão; passou com "smiles with happy tears… warm hug".
- Elenco posado no início: às vezes é corte seco (detectado sozinho), às vezes a câmera sai devagar da pose (~1 s) → `capa` manual no `edicao.json`.
- Legenda: dois eventos ASS sobrepostos se misturam na tela → o editor agora corta cada evento no início do seguinte e força tempos monotônicos.
- Corte de silêncio: RMS 20 ms, vão ≥ 0,22 s, folga 0,07 s; tirou 0,7–3 s por clipe de 10 s. Loudness final −15,6 LUFS.

## 2026-11-01 — ep01 (pedreiro/hotel), consistência entre clipes
- **A SOLUÇÃO DE CONSISTÊNCIA: imagem de elenco na mesma conversa.** 1) `create_image` (9:16) com todos os personagens lado a lado, de frente, corpo inteiro, no cenário, com o `conversation_id` do episódio; 2) cada `create_video` no MESMO `conversation_id`, com o prefixo "use the character reference image generated earlier in this conversation… EXACTLY like in that image". O serviço usa a imagem como 1º quadro (aparece ~0,5 s do elenco posado no início → cortar/cobrir na edição) e os rostos/roupas batem. Em 30 s o 3º segmento ainda deriva (Renata trocou, Marcos duplicado) → usar **clipes de 10 s**, todos ancorados na imagem.
- **BUG do RepoStore: vários pedidos simultâneos na MESMA conversa podem voltar com o MESMO vídeo** (links diferentes, arquivo idêntico: C12=C11, C15=C16=C14). Sempre `md5sum` nos clipes baixados e comparar a transcrição com a fala esperada; refazer os duplicados. Lote de 8 (C01–C08) saiu ok; o problema apareceu no 2º lote e de novo nos refazimentos (C12 veio = C17). **Regra: na conversa ancorada, UM pedido por vez** (esperar terminar antes do próximo). Para paralelizar, usar várias conversas, cada uma com a SUA chamada de imagem? Não — a imagem sairia diferente. Então: sequencial, ~1–4 min por clipe de 10 s.
- Testes reprovados (30 s só com texto, 2 versões de B1–B4): em TODAS algum personagem troca de rosto/etnia entre segmentos; uma versão voltou com 10 s em vez de 30; outra pulou uma fala inteira. Sempre conferir duração e texto.
- **Clipes de 30 s = 3 segmentos de 10 s costurados pelo serviço** (dá pra ver a troca a cada ~10 s). Dentro de cada segmento tudo bate; entre segmentos os coadjuvantes com descrição vaga mudam (Renata "blonde" virou morena/loira). Protagonista com traços fortes (Joaquim) e careca de óculos (Marcos) se mantiveram. → Descrever cada personagem com 3–4 traços inconfundíveis (pele muito clara + platinada + coque alto + argolas).
- Fila: máximo **8 pedidos simultâneos** por conta. 30 s demora ~3 min.
- `ferramentas/prompt.mjs <proj> todos` gera os prompts a partir de `blocos.json` (descrições literais); `ferramentas/repostore.mjs criar|status|esperar` fala direto com o MCP sem despejar o prompt no contexto.
- Revisão automática: `node ferramentas/revisar.mjs <projeto> <NN_vK> <download_url>` (baixa, folha de contato, transcrição, pausas).
- C01 (10 s) saiu perfeito: 37 palavras, 0 silêncio, letreiros só "HOTEL/RECEPÇÃO" (a instrução de letreiro funciona).
- **Clipes de 10 s gerados separadamente NÃO mantêm os personagens**, mesmo com o bloco de descrição idêntico:
  - sem referência: Joaquim virou "estátua cinza" (coberto de pó), Renata outro rosto → reprovado.
  - com `video_url` = clipe anterior: melhor (mesmo tipo de cenário), mas balcão mudou de madeira p/ mármore, Renata mudou de rosto, camiseta ganhou estampa "TRA…". Também demorou 4 min (vs 1 min).
- "cement dust on his face" → a IA exagera e pinta a pessoa de cinza. Sujeira só na roupa.
- Roupa lisa precisa de "plain … with no print", senão aparece texto.
- Fala termina colada no fim do clipe (10,00 s) com 37 palavras → risco de cortar a última palavra. Deixar ~10% de folga (10 s ≈ 32 palavras).

## 2026-11-01 — testes iniciais do RepoStore
- **Saldo ilimitado** (plano do usuário). O número 4100 não desce. Refazer à vontade.
- **Saída**: MP4 H.264 720x1280, 24 fps, AAC, com voz gerada pelo próprio modelo. Duração exata pedida (10,0 s). Gera em ~1 min. Link expira em 24 h → baixar na hora.
- **Fala**: português BR correto, lábios sincronizados, falou todas as falas do prompt na ordem. Ritmo real ≈ **3,7 palavras/s** (37 palavras em 10 s). Ou seja: 10 s ≈ 30–35 palavras; 30 s ≈ 90–100.
- **Recusa de segurança**: prompt com "furious", "shouting", humilhação explícita de idosa → `failed` ("couldn't generate that video as described"). **Funcionou** ao: começar com "Fictional Brazilian telenovela scene performed by professional actors", trocar por "stern / arrogant / worried", tirar exclamações agressivas. A humilhação tem de estar NAS FALAS, mas descrita com emoções moderadas. Usar `conversation_id` novo depois de uma recusa (o contexto pode carregar a recusa).
- **Bugs vistos no teste 02**:
  - Pausa de 0,77 s entre falas de personagens diferentes → resolver na edição (cortar silêncio).
  - Nome "Agnaldo" pronunciado "Aguinaldo" → escolher nomes de pronúncia inequívoca ou escrever como se fala.
  - O modelo **escreveu o nome da personagem num letreiro** ao fundo ("DONA CREU…") → acrescentar ao prompt: "background signs show only generic store names, never character names". Revisar letreiros em toda folha de contato.
- Visual sai igual ao das referências: close-ups, câmera de celular, cenário brasileiro cheio. Os modelos escolhem os enquadramentos sozinhos (alternou close-ups como pedido).
- Upscale para 1080x1920 na edição final (lanczos) ou entregar 720x1280 como as referências.

## 2026-11-03 — VidoGrid (Grok Imagine Video 1.5) pelo Chrome — ep15
- 9:16, 1080p (1088x1920), 15 s, 24 fps; ~3 min por clipe; 1 por vez. Fala termina entre 10 e 14,5 s → corte de silêncio tira ~3–4 s por clipe; 13 clipes = 2:24.
- Prompt CURTO (~800 caracteres) e simples. O longo ("Fictional telenovela…", "8 months pregnant with a big round belly") caiu na moderação.
- Consistência: 1 personagem por clipe em close + "Image reference" = quadro do personagem tirado de um clipe aprovado. Funcionou 100% (rosto/roupa iguais). A referência também fixa o cenário (pedi sala da fazenda, veio a loja) e vira o 1º quadro.
- 13/13 clipes aprovados de primeira (só C01 refeito por moderação). Português perfeito, sem legenda queimada.
- Upload: o botão "N/5" abre um diálogo da página com input[type=file] → file_upload da extensão.
- Cloudflare "Confirme que é humano" aparece às vezes (janela escondida) — só o usuário resolve.

## 2026-11-05 — ep19 (VidoGrid, 15 clipes = 3:12)
- 15 clipes de 15 s com falas de 40–46 palavras → 192 s após cortar silêncio (≈12,8 s úteis/clipe). Para ≥3 min: 15 clipes.
- Novo no VidoGrid: caixa "POLICY CHECK — REQUIRED" (`[aria-label="Policy check"]`) tem de estar marcada antes do Generate (usuário autorizou marcar).
- Grok teve "Partial Outage" (10% sucesso) por ~1 h: a página /status mostra a taxa; esperar subir >50% antes de insistir. "high traffic"/503 não contam no limite.
- 503 "busy" logo após o Generate → clicar Generate de novo a cada ~10 s até "Queued" (o prompt e a ref continuam no formulário).
- Moderação bloqueou: "smiling slyly… whispering" + "tight top" (C03) e até "proud and emotional, hand on the barbecue cart" (C12, aleatório). Reescrever a ação com palavras calmas resolveu.
- Cloudflare apareceu 2x em ~20 gerações → avisar o usuário (PushNotification) e esperar.
- Download: se `video.currentSrc` vier vazio, usar `video.src`/`source.src`.

## ep22 (2026-11-05)
- refaz por ref herda QUEM está no vídeo de referência: C20 (Marlene+mendigo) refeito com ref C04 (Cida) saiu com a Cida falando. Escolher ref que tenha os MESMOS personagens da cena.
- Locação nova sem ref (noref) troca o rosto do protagonista. No ep23 o prefixo_ref passou a dizer "same characters… location is the one described below" para levar o rosto de uma locação a outra.
- Legenda queimada continua em ~20% dos clipes de rua; conferir terço inferior sempre.

## ep23 (2026-11-05)
- Fila com dependências (`w C02; insiste_ref C07 1 C02`) + prefixo_ref "same characters… location described below": rosto da protagonista carregado entre locações. 24/24 aprovados, só 6 falhas de geração. Melhor episódio até agora em retrabalho.
- Ainda assim o 1º clipe de lote ancorado no elenco (C03) abriu com o elenco posado ~1,3 s → cobrir com recorte de torso do próprio clipe.

## ep24 (06/11/2026)
- Madrugada inteira o RepoStore devolveu "imagem em vez de vídeo" / "não consegui gerar" em quase tudo; às 8h voltou. Filas precisam de retentativa (li.sh = até 5 tentativas na conversa do elenco; insiste_ref com t automático).
- Conversa do elenco às vezes "trava" e devolve um clipe já entregue (C01 veio = C21; ep26 C01 veio = C24). Sempre conferir TEXTO; marcar `dup` no ids.txt e refazer por ref.
- Briga dentro do carro (dupla no banco da frente) foi recusada 4x; na calçada ao lado do carro passou.
- Elenco posado aparece só 1–2 quadros em vários clipes, mas no C17 durou 1,1 s: medir com fps=10 no arquivo-fonte antes de escolher o `cobrir.ate`.
- ep25: elenco na COZINHA (local com mais cenas) + cadeias por ref funcionou; 2 clipes duplicados (C18=C17) e 1 com fala embaralhada (C22) refeitos.
- ep26: briga dentro do carro recusada; clipes feitos sem ref (C02) definiram o rosto do Edson e os da cadeia por ref tinham outro → refazer com ref no rosto majoritário. Limite de 300/dia: repostore.mjs agora espera a vaga. Regra nova: final ≤ 2:59 (22 blocos ≈ 2:52).
- ep27: legenda queimada sem conserto (4 falhas) → crop=iw*0.8:ih*0.8:iw*0.1:0 + scale tira a legenda do quadro. Elenco posado em 5 de 8 clipes da conversa do elenco: medir com fps=5 e cobrir.
- ep29 (07/11): a conversa do elenco ficou travada só devolvendo IMAGEM (35 falhas no C01). Solução: C01 por noref (conversa nova, sem elenco) e todas as outras por ref encadeada a partir dele → 22/22 em 1 h, sem elenco posado. Adotar como padrão.
- (feito) thumb do ep29 refeita no ChatGPT em 07/11.
- ep30: 22 blocos com 662 palavras deram 3:05 → para ≤ 2:59 usar no máx. ~640 palavras ou 21 blocos; conferir duração antes de entregar (adiciona.sh bloqueia > 2:59).
- PENDENTE: refazer no ChatGPT a thumb do ep32 (provisória feita com thumb_local.sh, Chrome fora) e rodar adiciona.sh de novo.
- PENDENTE: refazer no ChatGPT a thumb do ep33 (provisória) e rodar adiciona.sh de novo.
- ep34 (07/11): retomado em outro PC; 21/21 em ~30 min, só 4 falhas. C04 cortava "embora" no fim dos 10 s → aparado em 8,65 s (C04_x). C14 com legenda queimada → crop 80%. Thumb provisória (Chrome desconectado).
- PENDENTE: refazer no ChatGPT a thumb do ep34 (provisória) e rodar adiciona.sh de novo.
- ep35 (08/11): personagem "RONALDO" com cabelo penteado pra trás + corrente de ouro + polo branca saiu com cara de jogador famoso → 3 clipes refeitos. Trocar só o visual (careca) NÃO resolveu — o rótulo "RONALDO" no prompt puxa o rosto. Nunca usar nome de famoso como rótulo de personagem no prompt (nem no diálogo, se der); usar nome comum (Valdemar) + visual bem distante.
- PENDENTE: refazer no ChatGPT a thumb do ep35 (provisória) e rodar adiciona.sh de novo.
- ep36 (08/11): 21/21 em 1 h de manhã (09:30–10:30). C02 com legenda queimada no meio do quadro → crop 74%. Thumb provisória.
- Madrugada 08/11 01:15–08:36 o RepoStore não aceitou pedidos (provável limite 300/dia); agora repostore.mjs grava cada espera em projetos/espera_repostore.log.
- ep37 (09/11): 17/21 no dia 08 + 4 no dia 09 (retomado). C09 com legenda queimada → crop 80%; C21 cortava a última frase → aparado em "comenta amém". Thumb provisória: 2ª linha ≤ 16 letras senão corta.
- PENDENTE: refazer no ChatGPT a thumb do ep37 (provisória).
