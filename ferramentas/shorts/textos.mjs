// Escreve em cada pasta de youtube_shorts: <ep>_tiktok_facebook.txt e <ep>_youtube.txt.
import { readFileSync, writeFileSync } from "node:fs";
const OUT = "E:/NOVELAS RELIGIOSAS/youtube_shorts";
const pontos = JSON.parse(readFileSync(process.argv[2], "utf8"));

// t = título/gancho, p1/p2 = ganchos das partes, m = moral, h = hashtags do tema
const E = {
  "ep01-pedreiro-hotel": { t: "O pedreiro foi humilhado no hotel de luxo… mas ninguém sabia quem ele era", m: "Humilhar quem trabalha nunca é brincadeira.", h: "#pedreiro #hotel" },
  "ep02-boleira-noivas": { t: "A boleira foi humilhada na loja de noivas… mas ninguém sabia quem ela era", m: "Deus olha primeiro pro coração.", h: "#noiva #boleira" },
  "ep03-catador-carteira": { t: "Ela largou o marido catador por um carro importado… e se arrependeu", m: "Honestidade quando ninguém está vendo vale mais que qualquer carro.", h: "#catador #honestidade" },
  "ep04-borracheira": { t: "Ele não pagou a borracheira… mas não sabia quem era o velhinho da caminhonete", p1: "Ela consertou o pneu de um velhinho de graça… e o rapaz riu dela. O que vem agora?", p2: "O velhinho da caminhonete revela quem é de verdade 😱", m: "Quem ajuda sem olhar a quem nunca fica sem nada.", h: "#borracheira #mulherforte" },
  "ep05-moto-inveja": { t: "Ele destruiu a moto do colega por inveja… mas alguém filmou tudo", p1: "Ele perdeu a moto, o emprego… e ainda perdoou quem fez isso.", p2: "O vídeo da vendedora de salgado muda tudo 😱", m: "A inveja destrói quem carrega ela.", h: "#inveja #motoboy" },
  "ep06-luz-cortada": { t: "Cortaram a luz da vovó com o neto doente… mas um visitante bateu na porta", p1: "Um moço desconhecido sabia o nome dela… e sumiu da cadeira. Quem era ele?", p2: "A fé da Dona Lurdes é recompensada 🙏", m: "Quem dá com amor nunca fica sem nada.", h: "#jesus #milagre" },
  "ep07-roca-geladeira": { t: "Humilharam a senhora da roça na loja… mas ela era a dona do prédio", p1: "Ela pediu 30 geladeiras e riram da cara dela. Quem vai pagar?", p2: "A verdade sobre a senhora da roça deixa todo mundo sem chão 😱", m: "Nunca julgue ninguém pela roupa.", h: "#roça #humildade" },
  "ep08-costureira": { t: "Ele largou a costureira pela moça do carro vermelho… mas um vídeo mudou tudo", p1: "Uma proposta de 500 mil chega pra costureira abandonada…", p2: "E o marido que foi embora? Veja como termina 😱", m: "Quem te abandona não decide o seu valor.", h: "#costureira #recomeço" },
  "ep09-gari": { t: "A síndica humilhava o gari… mas não sabia de quem era o velhinho que ele ajudou", p1: "O gari não deixou o velhinho perdido sozinho no sol…", p2: "Descobriram quem era o velhinho, e a síndica ficou sem chão 😱", m: "Nenhum trabalho honesto é pequeno aos olhos de Deus.", h: "#gari #respeito" },
  "ep10-salao": { t: "A prima cancelou as clientes do salão por inveja… mas o barbeiro gravou tudo", p1: "O áudio foi parar na internet e o salão encheu…", p2: "E a prima invejosa? Veja o final 😱", m: "A inveja tenta apagar a luz dos outros, mas só se queima.", h: "#inveja #salão" },
  "ep11-personal": { t: "Ela traiu o marido cadeirante com o personal… e se arrependeu", p1: "Uma indenização de 1,8 milhão chega pro marido abandonado…", p2: "Ela quer voltar… veja o que ele responde 😱", m: "Quem te abandona na queda não merece te ver de pé.", h: "#traição #superação" },
  "ep12-poco": { t: "Ela largou o marido do sítio pelo fazendeiro… mas ele achou um tesouro no poço", p1: "O poço que todo mundo chamou de loucura vale 5 milhões…", p2: "E a esposa que foi embora? Veja o final 😱", m: "Quem desiste de você na seca não merece beber da sua água.", h: "#sítio #fé" },
  "ep15-gravida-enxoval": { t: "Humilharam a grávida da roça na loja de enxoval… mas não sabiam quem era o marido", m: "Deus nunca esquece de quem confia nele.", h: "#grávida #enxoval" },
  "ep17-marmiteira": { t: "O engenheiro não pagou 30 marmitas… mas não sabia quem era o velhinho da calçada", m: "A bondade sempre volta.", h: "#marmiteira #bondade" },
  "ep18-uti-milagre": { t: "\"Se Jesus existisse, pagava o hospital\"… mas ela não sabia quem pediu comida", m: "Deus nunca esquece quem divide o pouco que tem.", h: "#jesus #milagre" },
  "ep19-churrasquinho": { t: "Ela largou o marido do churrasquinho por um carro importado… e se arrependeu", p1: "O velhinho da esquina tem um segredo pro Reginaldo…", p2: "O que o velhinho deixou muda a vida dele 😱", m: "Trabalho honesto e coração limpo sempre voltam.", h: "#churrasquinho #traição" },
  "ep20-caixa-filmado": { t: "Esconderam dinheiro na bolsa da caixa pra ela ser demitida… mas filmaram tudo", p1: "Demitida como ladra depois de 12 anos… mas alguém viu tudo.", p2: "O vídeo do estoquista revela a verdade 😱", m: "A verdade sempre aparece.", h: "#injustiça #verdade" },
  "ep21-bota-de-barro": { t: "Expulsaram o homem de bota de barro da concessionária… mas ele era o presidente", p1: "Ele vai voltar amanhã… com o dinheiro e de cabeça erguida.", p2: "A volta do homem da bota de barro 😱", m: "Nunca julgue ninguém pela roupa ou pela bota suja.", h: "#roça #humildade" },
  "ep22-pao-dividido": { t: "Queria jogar a viúva e os filhos na rua… mas um papel na Bíblia mudou tudo", p1: "Ela achou um papel dentro da Bíblia… e a casa era dela!", p2: "O dono das casas vai ter que se explicar 😱", m: "Deus nunca abandona quem confia nele.", h: "#viúva #bíblia" },
  "ep23-mecanica-chuva": { t: "Ele humilhou a mecânica e não pagou… mas não sabia quem era o velhinho", p1: "Ela contou tudo pro Seu Augusto… sem saber quem ele era.", p2: "O playboy da moto descobre quem é o Seu Augusto 😱", m: "Nunca deixe ninguém dizer que você não pode.", h: "#mecânica #mulherforte" },
  "ep24-costureira-noiva": { t: "Ele trocou a esposa de 25 anos por uma menina… e se arrependeu", p1: "Uma mulher desconhecida deu um cartão pra Neide…", p2: "A costureira dá a volta por cima e o ex se arrepende 😱", m: "Deus transforma o que sobrou em vitrine.", h: "#costureira #recomeço" },
  "ep25-acucar-no-tanque": { t: "Ele jogou açúcar no tanque da moto do colega… mas alguém filmou tudo", p1: "O motoboy ia ser demitido… até alguém mostrar um vídeo.", p2: "O vídeo revela quem sabotou a moto 😱", m: "Deus vê o que ninguém vê.", h: "#inveja #motoboy" },
  "ep26-motorista-estrela": { t: "Ela deu 1 estrela e denunciou o motorista… mas o terço dele salvou o pai dela", m: "Deus anda ao lado de quem trabalha honesto.", h: "#motorista #uber" },
  "ep27-aliancas-pescador": { t: "Humilharam o pescador na joalheria… mas não sabiam quem ele era", m: "Nunca julgue ninguém pelo chinelo.", h: "#pescador #joalheria" },
  "ep28-gari-mochila": { t: "A blogueira humilhava o gari na praça… mas ele achou uma mochila de dinheiro", m: "Não existe trabalho pequeno, existe gente pequena.", h: "#gari #honestidade" },
  "ep29-bilhete-pedreiro": { t: "Ela largou o pedreiro por causa de 5 reais na loteria… e ele ganhou 32 milhões", m: "Deus vê quem trabalha calado.", h: "#pedreiro #loteria" },
  "ep30-bolo-salgado": { t: "A cunhada trocou o açúcar por sal no bolo de casamento… mas alguém filmou tudo", m: "A verdade sempre aparece.", h: "#confeiteira #inveja" },
  "ep31-chuva-sertao": { t: "O coronel trancou o açude e apostou que não ia chover… mas chegou o domingo", m: "O céu responde na hora certa.", h: "#sertão #fé" },
  "ep32-lavadeira-grife": { t: "Expulsaram a lavadeira de chinelo da loja de grife… mas ela era dona da empresa", m: "Nunca julgue ninguém pelo chinelo.", h: "#lavadeira #humildade" },
  "ep33-barbeiro-andarilho": { t: "Enxotaram o andarilho da barbearia de luxo… mas o barbeiro pobre atendeu Jesus", m: "Jesus entra pela porta de quem acolhe.", h: "#jesus #milagre #barbeiro" },
  "ep34-cuidadora-testamento": { t: "Chamaram a cuidadora de ladra pra tirar ela da casa… mas o testamento revelou tudo", m: "Quem cuida com amor nunca fica sem recompensa.", h: "#cuidadora #testamento" },
  "ep35-catador-terreno": { t: "Largou o catador porque ele só tinha um terreno no mato… mas não sabia o que viria ali", m: "Nunca despreze quem tem pouco.", h: "#catador #traicao #terreno" },
  "ep36-feirante-tomates": { t: "Pisou nas verduras da idosa por inveja… mas o rapaz do caldo de cana filmou tudo", m: "Quem planta inveja colhe solidão.", h: "#feira #inveja #feirante" },
  "ep37-vovo-celular": { t: "Expulsaram a vovó de chinelo da loja de celular… mas não sabiam de quem era o shopping", m: "Nunca julgue ninguém pela roupa.", h: "#vovo #shopping #humildade" },
  "ep38-luz-cortada": { t: "Cortaram a luz da aposentada e debocharam da fé dela… mas não sabiam quem ia bater na porta", m: "Não feche a porta pra quem pede ajuda.", h: "#jesus #milagre #fe" },
};

const BASE = "#novela #novelas #historia #fé #deus #emocionante #reflexão #amém";
const junta = (linhas) => linhas.filter((x) => x != null).join("\n").replace(/\n{3,}/g, "\n\n") + "\n";
for (const [ep, p] of Object.entries(pontos)) {
  const e = E[ep]; if (!e) throw new Error(`Sem texto: ${ep}`);
  const tt = [], yt = [];
  for (const n of p.corte ? [1, 2] : [0]) {
    const cab = n ? `===== PARTE ${n} (arquivo ${ep}_parte${n}.mp4) =====` : `===== arquivo ${ep}.mp4 =====`;
    const gancho = n === 1 ? e.p1 : n === 2 ? e.p2 : null;
    const nav = n === 1 ? "👉 A PARTE 2 já está no perfil!" : n === 2 ? "👈 Não viu a Parte 1? Tá no perfil!" : null;
    const titulo = `${e.t}${n ? ` (Parte ${n})` : ""}`;
    const tags = `${BASE} ${e.h}${n ? ` #parte${n}` : ""}`;
    tt.push(junta([cab, "", `${titulo} 😱`, gancho, nav, `🙏 ${e.m}`, "Comenta AMÉM e escreve de qual cidade está assistindo 👇", "", tags]));
    const ytTitulo = `${titulo} #shorts`;
    if (ytTitulo.length > 100) throw new Error(`Título YT longo (${ytTitulo.length}): ${ep}`);
    yt.push(junta([cab, "", "TÍTULO:", ytTitulo, "", "DESCRIÇÃO:", gancho, nav, `🙏 ${e.m}`, "",
      "Se você acredita que Deus honra quem é humilde, deixa o like, comenta AMÉM e se inscreve no canal pra não perder as próximas histórias. 🙏", "", `#shorts ${tags}`]));
  }
  writeFileSync(`${OUT}/${ep}/${ep}_tiktok_facebook.txt`, "\uFEFF" + tt.join("\n"));
  writeFileSync(`${OUT}/${ep}/${ep}_youtube.txt`, "\uFEFF" + yt.join("\n"));
}
console.log("OK", Object.keys(pontos).length, "pastas");
