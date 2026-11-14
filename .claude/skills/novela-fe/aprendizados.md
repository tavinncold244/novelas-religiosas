# Aprendizados da página de fé (mais recente no topo)

Os aprendizados técnicos de geração/montagem estão em `.claude/skills/novela-ia/aprendizados.md` — ler lá também. Aqui só o que é específico desta página.

## 2026-11-14 — fe03 (padeiro, B) 2:00 e fe04 (carona na chuva, J) 1:37
- **O `estilo` do blocos.json vale para TODAS as locações** — se o episódio muda de noite para manhã, o modelo trava ("noite x manhã"). Escrever o estilo sem hora do dia e pôr a luz no cenário (ou corrigir o prompt da locação diferente).
- **Ref de personagem que tem outra pessoa na borda** (cabelo loiro da passageira) traz essa pessoa de volta → recortar só o rosto (`crop`) ou usar quadro em que ele está sozinho.
- **Mudança de figurino na história** (tira o avental, troca de roupa, mendigo → terno): criar variante do personagem E não usar ref antiga com a roupa velha (puxa a roupa de volta ou dá "conflito").
- **Nome de personagem aparece em cartaz/caixa** (SEU TIÃO, DAVI, VALTER): o cenário precisa de "plain walls with NO posters, NO written words; plain crates with no logos". Mesmo assim "VALTER" voltou nas caixas (marca da padaria) — evitar nome de dono que vire marca.
- Falha de rede no download (curl status 6) → `clipe.sh` agora tenta o revisar 3x.
- Jesus no final em locação nova: a ref do Jesus de outra cena (carro à noite) dá conflito; melhor só o último quadro do lugar + descrição fixa.
- Whisper inventa repetição às vezes; mas "carro-carro" era real → re-transcrever o trecho antes de decidir.

## 2026-11-14 — fe02 (UTI / enfermeira, formato M) — 1:53, 16 clipes
- **Imagem de elenco (create_image) como ref às vezes é recusada como "foto de pessoa real"** mesmo com o prefixo (3 recusas no B01). Solução: B01 SEM ref (só texto, `tail -n +2` tira o prefixo) — passou de 1ª; depois tudo por quadros dos clipes. Fazer assim por padrão: B01 sem ref.
- **Jesus igual entre episódios**: `referencias/fe/jesus_ref_clipe.jpg` (quadro do fe01) como ref deu o mesmo rosto no fe02.
- Ref de personagem tirada de OUTRA locação puxa a locação junto no meio do clipe (B07 t1 pulou pro corredor) → ref do personagem tem que ser da mesma locação, ou só o último quadro.
- O whisper às vezes corta o início do texto do revisar.mjs (B14) — antes de refazer, re-transcrever os 6 primeiros segundos.
- `ferramentas/fe/thumb.sh <proj> <url> L1 L2 AMARELA` faz a thumb com faixa escura; base gerada com `repostore.mjs imagem thumb.txt <conv> ref1,ref2,ref3`.

## 2026-11-14 — fe01 (mala na enchente, parábola) — saida/fe01-mala-enchente.mp4, 2:22, 19 clipes
- **Look de filme funciona no RepoStore**: o campo `estilo` no blocos.json + imagens de elenco geradas com "cinematic film still, golden hour" deram o visual dos perfis de referência.
- **Último quadro como referência (regra do usuário)**: `clipe.sh` tira `clipes/BNN_tK_ultimo.jpg` e o próximo clipe sai com ele → continuidade ótima (a câmera "continua" do quadro anterior). Quando o último quadro NÃO mostra o personagem que vai falar, juntar um 2º ref com o rosto dele tirado de um clipe aprovado (`ref_otavio.jpg`, `ref_jesus2.jpg`) — senão o rosto muda (B04, B15).
- **Não usar a imagem de elenco inteira como 2º ref no meio da cena**: puxa o elenco posado e junta personagens que estavam separados (B02 t1). Recortar só o rosto/corpo de quem falta (`ref_cida.jpg`).
- **Recusas e como evitar** (o usuário reclamou da demora): (1) "likeness of the people in those photos" → o modelo acha que o ref é foto de pessoa real; (2) "conflicts / clarify" → texto contradiz o ref (água na cintura x tornozelo; "no writing" x marca na máquina). Correção que funcionou: o `prefixo` diz que as refs são quadros gerados por IA deste filme fictício e manda seguir o texto na ação sem pedir esclarecimento. Depois disso quase tudo passou de 1ª. `clipe.sh` também tenta 3x sozinho.
- **Retrato isolado do Jesus (jesus.jpg) como ref dá recusa ou rosto diferente** — usar quadro do Jesus de um clipe aprovado do episódio.
- **Objeto largado volta na cena seguinte** (máquina no barco, mala na margem) porque o bloco fixo do personagem diz "hugging…". Criar variante do personagem (`CIDA_BARCO`, `OTAVIO_LIVRE`) com "EMPTY-HANDED, there is NO … anywhere".
- Choro forte come a fala (B14 t1 falou metade) → fala mais curta e emoção "teary, speaking clearly".
- Legenda queimada apareceu 2x (B05, B15) — olhar o terço de baixo sempre.
- Thumb sem o Chrome: `repostore.mjs imagem thumb.txt <conv> ref1.jpg,ref2.jpg` (agora aceita refs) + texto com drawtext, uma linha por drawtext (centraliza) e faixa escura no topo.
- Música do usuário para a página: `musica/fe_sad_piano_rain.mp3` (−11 LUFS, volume 0.12 com ducking) — voz final −16 LUFS.

## 2026-11-13 — criação da skill
- Referências: 17 vídeos em `referencias/fe/` (6 Cenas que Movem, 5 Além Das Histórias, 6 TikTok @historiasde.fee) com folha e transcrição.
- `ferramentas/fe/cartazes.sh` (título no topo 0–3 s + cartão AMÉM/PARTE 2 + marca d'água) e `ferramentas/fe/publica.sh` (pasta `youtube_shorts/`) testados num vídeo de referência: OK.
- Ainda não testado: look "cinematic/golden hour" no RepoStore/VidoGrid e a imagem de referência de Jesus. Fazer 1 clipe de teste no 1º episódio antes de gerar o resto.
- Nome da página: **Dramas De Fé** (14/11) — padrão do cartazes.sh.
