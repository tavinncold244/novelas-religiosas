import {readFileSync,writeFileSync,appendFileSync,existsSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
const slugs=['ep13-cadeira-vazia','ep14-pao-do-perdao'];
for(const slug of slugs){
 const dir='projetos/'+slug;
 const ep=JSON.parse(readFileSync(dir+'/blocos.json','utf8'));
 const qa=existsSync(dir+'/aprovados.json')?JSON.parse(readFileSync(dir+'/aprovados.json','utf8')):{};
 const lines=existsSync(dir+'/criados.txt')?readFileSync(dir+'/criados.txt','utf8').trim().split(/\r?\n/):[];
 const created=new Set(lines.map(x=>x.split(/\s+/)[0]));
 const groups=Object.groupBy(ep.blocos,b=>b.cenario==='JESUS'&&slug.startsWith('ep13')?'RUA':b.cenario);
 for(const [loc,blocks] of Object.entries(groups)){
  if(!qa['ELENCO_'+loc]){console.log(slug,loc,'aguarda aprovação do elenco');continue;}
  const pending=blocks.find(b=>created.has(b.id)&&!qa[b.id]);
  if(pending){console.log(slug,loc,'aguarda',pending.id);continue;}
  const next=blocks.find(b=>!created.has(b.id));if(!next)continue;
  try{
   const id=execFileSync(process.execPath,['ferramentas/repostore.mjs','criar',dir+'/prompts/'+next.id+'.txt','10',slug+'-'+loc],{encoding:'utf8',timeout:180000}).trim();
   if(!/^[a-f0-9-]{36}$/.test(id))throw Error('ID inválido');
   appendFileSync(dir+'/criados.txt',`${next.id} t1 ${id}\n`);console.log(slug,next.id,id);
  }catch(e){console.log(slug,next.id,'ERRO',e.message.slice(0,300));}
 }
}
