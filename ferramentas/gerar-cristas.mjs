// Geração retomável. Não aprova clipes nem monta vídeos automaticamente.
import {readFileSync,appendFileSync,existsSync,writeFileSync} from 'node:fs';
import {execFile} from 'node:child_process';
import {promisify} from 'node:util';
import {homedir} from 'node:os';
import {join} from 'node:path';
const exec=promisify(execFile),sleep=ms=>new Promise(r=>setTimeout(r,ms));
const cfg=JSON.parse(readFileSync(join(homedir(),'.claude.json'),'utf8'));
const srv=Object.values(cfg.projects||{}).map(p=>p.mcpServers?.['repostore-video']).find(Boolean);
let session,seq=0;
async function rpc(method,params){
 const r=await fetch(srv.url,{method:'POST',headers:{...srv.headers,'Content-Type':'application/json',Accept:'application/json, text/event-stream',...(session?{'Mcp-Session-Id':session}:{})},body:JSON.stringify({jsonrpc:'2.0',id:++seq,method,params}),signal:AbortSignal.timeout(30000)});
 session=r.headers.get('mcp-session-id')||session;
 const t=await r.text();const j=t.trim().startsWith('{')?JSON.parse(t):JSON.parse(t.split('\n').filter(x=>x.startsWith('data:')).at(-1).slice(5));
 if(j.error)throw Error(JSON.stringify(j.error));return j.result;
}
async function call(name,args){const r=await rpc('tools/call',{name,arguments:args});return JSON.parse(r.content.find(c=>c.type==='text').text);}
await rpc('initialize',{protocolVersion:'2025-03-26',capabilities:{},clientInfo:{name:'novela-lote',version:'1'}});
let cache=[],last=0,refresh;
async function recent(){
 if(Date.now()-last<20000)return cache;
 if(refresh)return refresh;
 refresh=(async()=>{cache=await call('list_videos',{kind:'all',limit:100});if(!Array.isArray(cache))throw Error(JSON.stringify(cache));last=Date.now();return cache;})().finally(()=>{refresh=null;});
 return refresh;
}
async function worker(slug,loc,blocks){
 const dir='projetos/'+slug,log=dir+'/criados.txt';
 for(const b of blocks){
  const old=existsSync(log)?readFileSync(log,'utf8').trim().split(/\r?\n/).find(l=>l.startsWith(b.id+' t1 ')):null;
  let id=old?.split(/\s+/)[2];
  if(!id){
   try{
    const r=await exec(process.execPath,['ferramentas/repostore.mjs','criar',dir+'/prompts/'+b.id+'.txt','10',slug+'-'+loc],{timeout:360000,maxBuffer:1024*1024});id=r.stdout.trim();
    if(!/^[a-f0-9-]{36}$/.test(id))throw Error('ID inválido');
    appendFileSync(log,`${b.id} t1 ${id}\n`);console.log(slug,b.id,'CRIADO',id);
   }catch(e){
    console.log(slug,b.id,'ENVIO INCERTO; interrompendo esta locação para evitar duplicatas.',e.message.slice(0,200));return;
   }
  }
  let v,errors=0;
  for(;;){
   try{v=(await recent()).find(x=>x.id===id);if(!v)v=await call('get_video',{id});errors=0;}
   catch(e){if(++errors>=5){console.log(slug,b.id,'CONSULTA INDISPONÍVEL');return;}await sleep(30000);continue;}
   if(v.status==='done'||v.status==='failed')break;
   await sleep(30000);
  }
  writeFileSync(dir+'/clipes/'+b.id+'_t1_status.json',JSON.stringify(v,null,2));
  console.log(slug,b.id,v.status);
  if(v.status==='failed'){console.log(v.error);return;}
 }
 console.log(slug,loc,'LOCAÇÃO GERADA; REVISÃO OBRIGATÓRIA');
}
const jobs=[];
for(const slug of ['ep13-cadeira-vazia','ep14-pao-do-perdao']){
 const ep=JSON.parse(readFileSync('projetos/'+slug+'/blocos.json','utf8'));
 const qa=JSON.parse(readFileSync('projetos/'+slug+'/aprovados.json','utf8'));
 const groups=Object.groupBy(ep.blocos,b=>b.cenario==='JESUS'&&slug.startsWith('ep13')?'RUA':b.cenario);
 for(const [loc,blocks] of Object.entries(groups))if(qa['ELENCO_'+loc])jobs.push(()=>worker(slug,loc,blocks));
}
await Promise.all(jobs.map(fn=>fn()));
