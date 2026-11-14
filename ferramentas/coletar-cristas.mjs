import { readFileSync, writeFileSync, existsSync, renameSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';
import { execFileSync } from 'node:child_process';
const root='E:/NOVELAS RELIGIOSAS';
const cfg=JSON.parse(readFileSync(join(homedir(),'.claude.json'),'utf8'));
const srv=Object.values(cfg.projects||{}).map(p=>p.mcpServers?.['repostore-video']).find(Boolean);
let session,seq=0;
async function rpc(method,params){
 const r=await fetch(srv.url,{method:'POST',headers:{...srv.headers,'Content-Type':'application/json',Accept:'application/json, text/event-stream',...(session?{'Mcp-Session-Id':session}:{})},body:JSON.stringify({jsonrpc:'2.0',id:++seq,method,params}),signal:AbortSignal.timeout(25000)});
 session=r.headers.get('mcp-session-id')||session;
 const t=await r.text();const j=t.trim().startsWith('{')?JSON.parse(t):JSON.parse(t.split('\n').filter(x=>x.startsWith('data:')).at(-1).slice(5));
 if(j.error)throw Error(JSON.stringify(j.error));return j.result;
}
async function call(name,args){const r=await rpc('tools/call',{name,arguments:args});return JSON.parse(r.content.find(c=>c.type==='text').text);}
await rpc('initialize',{protocolVersion:'2025-03-26',capabilities:{},clientInfo:{name:'novela-coleta',version:'1'}});
const list=await call('list_videos',{kind:'all',limit:100});
for(const slug of ['ep13-cadeira-vazia','ep14-pao-do-perdao']){
 const d=join(root,'projetos',slug);
 const records=[];
 for(const line of readFileSync(join(d,'elencos.txt'),'utf8').trim().split(/\r?\n/)){const [name,id]=line.split(/\s+/);records.push({name:'elenco_'+name,id,kind:'image'});}
 if(existsSync(join(d,'criados.txt')))for(const line of readFileSync(join(d,'criados.txt'),'utf8').trim().split(/\r?\n/)){const [name,t,id]=line.split(/\s+/);records.push({name:name+'_'+t,id,kind:'video'});}
 for(const x of records){
  const dest=join(d,x.kind==='image'?x.name+'.png':'clipes/'+x.name+'.mp4');
  if(existsSync(dest)){console.log(slug,x.name,'local');continue;}
  let v=list.find(v=>v.id===x.id);if(!v){console.log(slug,x.name,'ausente na listagem');continue;}
  if(v.status!=='done'){console.log(slug,x.name,v.status,v.error||'');continue;}
  if(!v.stored){try{v=await call('get_video',{id:x.id});}catch(e){console.log(slug,x.name,e.message);continue;}}
  if(!v.download_url){console.log(slug,x.name,'sem URL');continue;}
  try{
   const r=await fetch(v.download_url,{signal:AbortSignal.timeout(45000)});if(!r.ok)throw Error('download HTTP '+r.status);
   writeFileSync(dest+'.part',Buffer.from(await r.arrayBuffer()));renameSync(dest+'.part',dest);
   console.log(slug,x.name,'BAIXADO');
   if(x.kind==='video'){
    const out=execFileSync(process.execPath,[join(root,'ferramentas/revisar.mjs'),slug,x.name],{encoding:'utf8',maxBuffer:10*1024*1024});
    writeFileSync(join(d,'clipes',x.name+'_revisao.txt'),out);console.log(out);
   }
  }catch(e){console.log(slug,x.name,'ERRO',e.message.slice(0,300));}
 }
 const p=JSON.parse(readFileSync(join(d,'producao.json'),'utf8'));p.status='em_producao';p.pedidos=list.filter(v=>v.conversation_id?.startsWith(slug)).map(({id,kind,status,conversation_id,download_url,error})=>({id,kind,status,conversation_id,download_url,error}));p.bloqueio=null;writeFileSync(join(d,'producao.json'),JSON.stringify(p,null,2));
}
