import { mkdirSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { execFileSync } from 'node:child_process';
const root = 'E:/NOVELAS RELIGIOSAS';
const jesus = 'JESUS — 33-year-old Middle Eastern man, shoulder-length wavy dark-brown hair, full dark-brown beard, brown eyes, plain ivory linen robe, beige sash, brown sandals, no jewelry. Voice: warm gentle Brazilian Portuguese. A fictional dramatic portrayal of Jesus.';
const specs = [
{
slug:'ep13-cadeira-vazia', titulo:'ela guardou uma cadeira para o filho por quinze anos… naquela noite, Jesus bateu à porta.', tipo:'C — fé, reencontro e reconciliação', thumb:['QUINZE ANOS ESPERANDO','ELE VOLTOU'],
personagens:{
ANA:'ANA — 58-year-old Black Brazilian woman, medium-dark skin, oval face, short tightly curled salt-and-pepper hair, small silver stud earrings, plain mustard-yellow blouse, long navy-blue skirt, flat brown sandals. Voice: warm mature Brazilian Portuguese.',
PAULO:'PAULO — 35-year-old Black Brazilian man, medium-dark skin, short tightly curled black hair, narrow face, short black beard, thin scar through left eyebrow, plain faded teal t-shirt, dark blue jeans, brown work boots. Voice: low hesitant Brazilian Portuguese.',
LUCIA:'LUCIA — 50-year-old light-brown Brazilian woman, straight black chin-length bob, rectangular black glasses, plain burgundy blouse, black trousers, black flat shoes. Voice: firm clear Brazilian Portuguese.',
JESUS:jesus},
cenarios:{CASA:'modest Brazilian dining room, pale blue walls, rectangular dark wooden table, exactly two matching wooden chairs, cream curtain, small ceramic flower vase, warm ceiling light, no writing or signs.',RUA:'quiet Brazilian residential street at dusk, pale blue house with a solid brown wooden front door, small concrete doorstep, warm porch light, no writing or signs.',JESUS:'quiet Brazilian residential street beside a pale blue house and brown wooden front door, soft warm porch light, no writing or signs.'},
elencos:{CASA:['ANA','LUCIA','PAULO'],RUA:['PAULO','JESUS'],JESUS:['JESUS']},
cenas:[
['CASA','LUCIA','stern','Ana, tira esse prato da mesa. Faz quinze anos que seu filho foi embora. Você está preparando jantar para alguém que esqueceu seu nome.'],
['CASA','ANA','steady','Meu filho pode ter esquecido o caminho desta casa, Lúcia. Eu não esqueci o rosto dele. Enquanto eu viver, essa cadeira continua sendo dele.'],
['CASA','LUCIA','concerned','Você trabalhou o dia inteiro, comprou comida para dois e vai dormir chorando outra vez. Eu tenho medo de ver essa espera acabar com você.'],
['CASA','ANA','sad','Não pense que eu nunca senti raiva. Houve noites em que guardei o prato. Mas hoje acordei com vontade de colocar a mesa novamente.'],
['CASA','ANA','hopeful','Jesus, eu não sei onde meu filho está. Cuida dele nesta noite. Se eu tiver oportunidade de abraçá-lo, me ajuda a não começar cobrando.'],
['RUA','PAULO','hesitant','Quinze anos, mãe. Eu ensaiei essa conversa tantas vezes no ônibus. Agora estou na sua rua e não consigo dar mais um passo sozinho.'],
['RUA','PAULO','regretful','Eu levei o dinheiro que a senhora guardava para consertar o telhado. Disse que voltaria rico. Depois tive vergonha de voltar sem nada nas mãos.'],
['RUA','JESUS','gentle','Você está olhando para aquela porta há muito tempo, meu filho. Tem alguém esperando lá dentro, ou é uma lembrança que trouxe você até aqui?'],
['RUA','PAULO','sad','Minha mãe mora naquela casa azul. Se ainda estiver viva. Eu perdi o contato, troquei de cidade e fui adiando a verdade por quinze anos.'],
['RUA','JESUS','steady','Você não pode devolver esses quinze anos. Mas pode parar de aumentar essa distância hoje. A verdade começa quando você deixa de fugir dela.'],
['RUA','PAULO','worried','Eu escrevi uma carta contando tudo. Ia deixar debaixo da porta e ir embora. Se ela ler sem me ver, talvez sofra menos comigo.'],
['RUA','JESUS','gentle','Uma carta pode contar o que aconteceu. Mas não pode ouvir a resposta dela. Não escolha sozinho o final de uma conversa que ainda nem começou.'],
['CASA','LUCIA','soft','Eu fui dura com você, Ana. É que acompanhei cada aniversário sem notícia. Se ele aparecer, não sei se consigo esconder a minha mágoa.'],
['CASA','ANA','warm','Você ficou comigo quando todo mundo cansou de perguntar. Sou grata por isso. Mas hoje, se aquela porta abrir, deixa primeiro que eu seja mãe.'],
['RUA','PAULO','worried','E se ela disser que eu não sou mais filho dela? Eu sobrevivi a muita coisa, mas não sei se aguento ouvir isso hoje.'],
['RUA','JESUS','gentle','Você está tentando adivinhar uma rejeição para não arriscar um encontro. Bata na porta com honestidade. Sua mãe tem o direito de responder por ela.'],
['RUA','PAULO','surprised','Como o senhor sabe que eu trouxe uma carta? Eu não tirei do bolso. E por que parece que conhece tudo que estou sentindo agora?'],
['RUA','JESUS','warm','Paulo, sua mãe colocou dois pratos na mesa esta noite. Ela pediu ajuda para abraçar antes de cobrar. Você também pode pedir coragem para entrar.'],
['RUA','PAULO','moved','Eu não disse meu nome ao senhor. Meu Deus, eu passei tantos anos achando que estava esquecido. Jesus, me ajuda a fazer o que é certo.'],
['RUA','PAULO','resolved','Eu vou bater. Não para pedir dinheiro, nem inventar uma desculpa. Vou contar a verdade e aceitar o tempo que minha mãe precisar comigo.'],
['CASA','ANA','surprised','Essa batida... Lúcia, espera um pouquinho. Meu coração disparou de um jeito estranho. Eu mesma vou abrir. Deixa o prato onde ele está, por favor.'],
['RUA','PAULO','regretful','Mãe, sou eu, Paulo. Eu não mereço chegar exigindo nada. Só peço que me escute. O dinheiro do telhado fui eu que levei naquela manhã.'],
['CASA','ANA','moved','Eu reconheci sua voz antes de abrir, meu filho. Você está tão diferente. Deixa eu olhar seu rosto. Eu esperei tanto para ouvir você novamente.'],
['CASA','PAULO','regretful','Eu trabalhei, errei, perdi empregos e escondi tudo por vergonha. Nenhuma dificuldade justifica o que fiz. Quero devolver seu dinheiro, mesmo que seja aos poucos.'],
['CASA','ANA','steady','Nós vamos conversar sobre o dinheiro, sim. E sobre o silêncio também. Perdoar não apaga nossa história. Mas eu não quero começar afastando você outra vez.'],
['CASA','LUCIA','moved','Paulo, eu estava mandando sua mãe guardar esse prato. Ela não deixou. Eu também preciso pedir perdão por acreditar que ninguém podia mudar de caminho.'],
['CASA','PAULO','surprised','Tinha um homem comigo na rua. Ele sabia meu nome e sabia dos dois pratos. Disse que a senhora tinha pedido ajuda para me abraçar.'],
['CASA','ANA','moved','Foi exatamente o que eu pedi, meu filho. Ninguém estava aqui quando orei. Eu não pedi riqueza. Pedi uma oportunidade de olhar para você de novo.'],
['CASA','PAULO','hopeful','Mãe, duas semanas atrás eu bati nessa porta tremendo. Hoje trouxe minha primeira diária. Esta parte é para o telhado. Posso ajudar a preparar nosso jantar?'],
['CASA','ANA','warm','Pode, meu filho. A confiança está voltando nas coisas pequenas: quando você avisa que vai chegar, cumpre sua palavra e senta comigo nesta mesa novamente.'],
['CASA','LUCIA','warm','Agora eu vejo três pratos nessa mesa e ninguém precisa esconder a verdade. O telhado ainda precisa de conserto, mas essa casa já respira diferente.'],
['JESUS','JESUS','gentle','O perdão pode abrir uma porta; a responsabilidade ajuda a mantê-la aberta. Se esta história tocou você, compartilhe uma palavra de esperança com alguém hoje.']
]},
{
slug:'ep14-pao-do-perdao', titulo:'o padeiro foi acusado de roubar o pão… mas voltou para alimentar quem o humilhou.', tipo:'D — trabalhador, injustiça e perdão com reparação', thumb:['CHAMARAM ELE DE LADRÃO','ELE VOLTOU COM PÃO'],
personagens:{
MIGUEL:'MIGUEL — 44-year-old light-brown Brazilian man, short black hair with grey temples, neatly trimmed black moustache, square face, plain navy-blue t-shirt under a clean beige baker apron, dark grey trousers, black work shoes. Voice: warm slightly husky Brazilian Portuguese.',
CESAR:'CESAR — 52-year-old white Brazilian man, bald head, thick dark eyebrows, clean-shaven round face, plain dark-green polo shirt, black trousers, silver wristwatch on left wrist. Voice: firm deep Brazilian Portuguese.',
RUTE:'RUTE — 61-year-old Black Brazilian woman, short silver natural hair, round gold glasses, plain purple cardigan over a plain white blouse, dark blue skirt, black flat shoes. Voice: calm clear Brazilian Portuguese.',
JESUS:jesus},
cenarios:{PADARIA:'small Brazilian neighborhood bakery, cream tiled walls, glass bread counter, empty unmarked wicker baskets, stainless steel oven in the background, warm morning light, no brands or readable signs.',COZINHA:'modest Brazilian community kitchen, white tiled walls, blue metal door, stainless steel preparation table, large plain aluminum pots, daylight, no writing or logos.',JESUS:'outside a small Brazilian neighborhood bakery, cream tiled wall, plain glass door, soft golden morning sunlight, no writing or logos.'},
elencos:{PADARIA:['MIGUEL','CESAR','RUTE'],COZINHA:['MIGUEL','CESAR','RUTE'],JESUS:['JESUS']},
cenas:[
['PADARIA','CESAR','stern','Larga essa sacola, Miguel. Estão faltando sessenta reais no caixa e você saiu com pão escondido. Depois ainda diz que é um homem de Deus.'],
['PADARIA','MIGUEL','steady','O senhor separou esses pães de ontem e autorizou a doação. Eu ia levar para a cozinha da dona Rute. Não peguei dinheiro nenhum daqui.'],
['PADARIA','CESAR','skeptical','Eu autorizei separar as sobras, não fazer caridade com meu dinheiro. Você é o único que estava perto do balcão. Para mim, está explicado agora.'],
['PADARIA','MIGUEL','worried','Olhe as contas antes de me acusar, seu César. Faz oito anos que abro essa padaria antes do sol nascer. Meu nome vale muito para mim.'],
['PADARIA','RUTE','firm','Eu vim buscar a doação combinada ontem. Se existe diferença no caixa, confira. Uma sacola de pão não transforma um trabalhador em ladrão diante dos outros.'],
['PADARIA','CESAR','stern','Eu não quero discussão na minha padaria. Miguel, pode ir embora hoje. Depois resolvemos o que eu devo. E essa sacola fica em cima do balcão.'],
['PADARIA','MIGUEL','sad','Eu vou sair, mas preciso receber os dias trabalhados. Tenho aluguel e contas para pagar. E preciso que o senhor procure a verdade sobre esse dinheiro.'],
['COZINHA','MIGUEL','sad','Dona Rute, cheguei sem os pães e sem meu emprego. O pior não foi perder o trabalho. Foi ouvir que minha fé era uma mentira.'],
['COZINHA','RUTE','warm','Sente um instante, Miguel. Aqui você não precisa provar que merece um copo de água. Depois pensamos no trabalho. Agora eu quero ouvir você direito.'],
['COZINHA','MIGUEL','hopeful','Jesus, eu estou com muita raiva e vergonha. Não deixa essa dor escolher por mim. Me dá firmeza para buscar justiça sem ferir outra pessoa.'],
['COZINHA','RUTE','practical','Nós temos farinha para amanhã e um forno funcionando. Preciso de alguém que saiba fazer pão. Posso pagar duas diárias com a verba da cozinha.'],
['COZINHA','MIGUEL','grateful','Eu aceito essas duas diárias, dona Rute. Vou anotar cada ingrediente e entregar tudo contado. Hoje, poder trabalhar com respeito já devolve um pouco do meu chão.'],
['PADARIA','CESAR','concerned','Espere... o recibo do entregador está dobrado debaixo da gaveta. Sessenta reais de frete, pagos em dinheiro. Fui eu que tirei antes de abrir a loja.'],
['PADARIA','CESAR','regretful','Não faltava dinheiro. Eu esqueci de registrar o pagamento e coloquei a culpa no Miguel. Ele pediu que eu conferisse. Eu nem deixei que terminasse.'],
['PADARIA','CESAR','worried','Dona Rute, é o César. Encontrei o comprovante. Miguel não pegou nada. Preciso falar com ele e corrigir o que disse na frente da senhora.'],
['COZINHA','RUTE','firm','Então comece dizendo isso às mesmas pessoas que ouviram a acusação. Depois acerte o pagamento dele. Pedir desculpa exige mais do que aliviar a própria consciência.'],
['COZINHA','MIGUEL','hurt','Eu ouvi a ligação, dona Rute. Saber que encontraram a verdade ajuda. Mas ainda dói lembrar das pessoas me olhando como se eu tivesse roubado.'],
['COZINHA','RUTE','gentle','Você não precisa fingir que deixou de doer. Pode ouvir o pedido dele, pedir reparação e decidir seu caminho. Perdão também precisa de verdade para crescer.'],
['PADARIA','CESAR','regretful','Eu preciso corrigir uma injustiça. Miguel não roubou dinheiro nem pão. O erro do caixa foi meu. A doação estava autorizada. Eu acusei sem conferir nada.'],
['PADARIA','CESAR','worried','Agora o padeiro substituto cancelou e eu aceitei uma encomenda de duzentos pães para o abrigo. O forno está pronto, mas não tenho quem faça.'],
['COZINHA','RUTE','concerned','O abrigo ligou perguntando se podemos ajudar. A entrega da padaria atrasou. São duzentos pães para o café de amanhã, e nossa equipe já está completa.'],
['COZINHA','MIGUEL','conflicted','É a encomenda do seu César? Ontem ele me tirou de lá como um ladrão. Hoje precisa justamente das mãos que mandou sair da padaria.'],
['COZINHA','RUTE','steady','Você pode dizer não, Miguel. Essa decisão é sua. Se escolher ajudar, combine pagamento e condições. Bondade não obriga ninguém a aceitar humilhação como salário.'],
['COZINHA','MIGUEL','resolved','Eu vou ajudar pelo pessoal do abrigo. Mas vou conversar com ele antes. Não quero vingança, dona Rute. Também não quero passar por isso novamente.'],
['PADARIA','CESAR','regretful','Miguel, fui injusto e arrogante. Já corrigi a acusação diante dos clientes. Aqui está seu pagamento completo. Você não precisa trabalhar hoje para receber o que é seu.'],
['PADARIA','MIGUEL','steady','Obrigado por corrigir, seu César. Eu aceito seu pedido de perdão. Para fazer essa encomenda, combinamos uma diária separada. Respeito precisa continuar depois que a urgência passar.'],
['PADARIA','CESAR','moved','Combinado. E eu vou trabalhar ao seu lado, seguindo suas instruções. Depois do que fiz, achei que você gostaria de me ver perder essa encomenda inteira.'],
['PADARIA','MIGUEL','warm','Eu queria que o senhor entendesse minha dor. Não que outras pessoas ficassem sem café. Agora separa as assadeiras. Temos duzentos pães para entregar no horário.'],
['COZINHA','RUTE','happy','Os duzentos pães chegaram quentinhos, Miguel. E o conselho aprovou nosso projeto: você vai coordenar a produção daqui, com salário combinado e contrato por escrito.'],
['COZINHA','MIGUEL','grateful','Uma semana atrás eu saí de cabeça baixa. Hoje começo um trabalho novo. Agradeço a Deus pela ajuda e à senhora por enxergar minha capacidade quando eu estava ferido.'],
['COZINHA','CESAR','humble','Trouxe a farinha que prometi doar todo mês. Já registrei tudo direito. Miguel, obrigado por me mostrar que pedir perdão também significa mudar a maneira de tratar as pessoas.'],
['JESUS','JESUS','gentle','A fé também aparece no salário pago, na verdade dita e no pão dividido. Se essa história fez sentido, compartilhe e valorize quem trabalha ao seu lado.']
]}
];
for(const s of specs){
 const dir=join(root,'projetos',s.slug);if(existsSync(join(dir,'blocos.json')))throw Error('Projeto já existe: '+s.slug);
 mkdirSync(join(dir,'prompts'),{recursive:true});mkdirSync(join(dir,'clipes'),{recursive:true});
 const blocos=s.cenas.map(([cenario,n,emo,txt],i)=>({id:'C'+String(i+1).padStart(2,'0'),duracao:10,cenario,acao:`Close-up on ${n} ONLY throughout the whole clip, speaking to someone just outside the frame. Nobody else visible. Natural restrained gestures, no object handling. ${i===28&&s.slug.includes('cadeira')?'Two weeks later, identical clothes.':''}`,falas:[[n,emo,txt]]}));
 const ep={prefixo:'CRITICAL: NO TEXT OF ANY KIND. Use the character reference image earlier in this conversation. Keep exactly the same faces, ages, hair, clothes and location. Immediately leave the reference pose and show ONLY the requested speaker.',prefixo_ref:'CRITICAL: NO TEXT OF ANY KIND. Use the attached video only as visual reference for the SAME character and location. Do NOT repeat its dialogue. Film ONLY the new scene below. No subtitles or captions.',personagens:s.personagens,cenarios:s.cenarios,blocos};
 writeFileSync(join(dir,'blocos.json'),JSON.stringify(ep,null,2));
 let words=blocos.reduce((a,b)=>a+b.falas[0][2].split(/\s+/).length,0);
 writeFileSync(join(dir,'roteiro.md'),`# ${s.titulo}\n\nFicção cristã original. Arquétipo: ${s.tipo}.\n32 clipes de 10 segundos; ${words} palavras. Meta de montagem: acima de 3 minutos, a confirmar no áudio gerado.\nFormato: 1080×1920, 30 fps. Som: diálogos pt-BR e piano do usuário com ducking.\nRecursos: oração, diálogo de apoio, revelação, reparação e epílogo de Jesus.\n\n${blocos.map(b=>`## ${b.id} — ${b.cenario}\n\n${b.falas[0][0]} (${b.falas[0][1]}): “${b.falas[0][2]}”\n\nContinuidade: roupa fixa; plano fechado, interlocutor fora de quadro; mãos sem objetos.\n`).join('\n')}`);
 writeFileSync(join(dir,'personagens.md'),'# Bíblia visual\n\n'+Object.values(s.personagens).join('\n\n')+'\n\n# Locações\n\n'+Object.entries(s.cenarios).map(([n,v])=>`${n}: ${v}`).join('\n\n'));
 writeFileSync(join(dir,'producao.json'),JSON.stringify({titulo:s.titulo,arquetipo:s.tipo,status:'roteiro_pronto',palavras:words,elencos:s.elencos,thumb:s.thumb,clipes_aprovados:[],nota:'Não montar nem entregar como vídeo concluído antes da revisão visual, transcrição e falantes.'},null,2));
 writeFileSync(join(dir,'revisao.md'),'# Revisão\n\nRoteiro e prompts preparados. Nenhum clipe foi aprovado ainda.\n');
 for(const [local,nomes] of Object.entries(s.elencos)){
  writeFileSync(join(dir,'prompts',`ELENCO_${local}.txt`),`Create a photorealistic vertical 9:16 cast reference photograph for a fictional Brazilian Christian telenovela. Professional adult actors standing side by side facing camera, full body, neutral expressions, arms relaxed. Exactly one of each described actor, no duplicates. Maintain exact physical traits and clothing. No text, logos or watermarks. LOCATION: ${s.cenarios[local]}\n${nomes.map(n=>s.personagens[n]).join('\n')}`);
  writeFileSync(join(dir,'prompts',`BROLL_${local}.txt`),`Vertical 9:16 realistic smartphone footage. Slow view of the empty setting: ${s.cenarios[local]} NO people, NO voices, NO music, NO text. 10 seconds. No cuts.`);
 }
 execFileSync(process.execPath,[join(root,'ferramentas/prompt.mjs'),s.slug,'todos'],{stdio:'pipe'});
 console.log(s.slug,words+' palavras',blocos.length+' clipes', 'máximo por clipe',Math.max(...blocos.map(b=>b.falas[0][2].split(/\s+/).length)));
}
