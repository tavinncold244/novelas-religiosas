import {readFileSync,writeFileSync} from 'node:fs';
import {homedir} from 'node:os';
import {join} from 'node:path';
const cfg=JSON.parse(readFileSync(join(homedir(),'.claude.json'),'utf8'));
const srv=Object.values(cfg.projects||{}).map(p=>p.mcpServers?.['repostore-video']).find(Boolean);
let session,seq=0;
async function rpc(method,params){
 const r=await fetch(srv.url,{method:'POST',headers:{...srv.headers,'Content-Type':'application/json',Accept:'application/json, text/event-stream',...(session?{'Mcp-Session-Id':session}:{})},body:JSON.stringify({jsonrpc:'2.0',id:++seq,method,params}),signal:AbortSignal.timeout(25000)});
 session=r.headers.get('mcp-session-id')||session;
 const t=await r.text();let j;try{j=t.trim().startsWith('{')?JSON.parse(t):JSON.parse(t.split('\n').filter(x=>x.startsWith('data:')).at(-1).slice(5));}catch{throw Error('HTTP '+r.status+'; resposta não JSON');}
 if(j.error)throw Error(JSON.stringify(j.error));return j.result;
}
try{
 await rpc('initialize',{protocolVersion:'2025-03-26',capabilities:{},clientInfo:{name:'novela-inspecao',version:'1'}});
 if(process.argv[2]==='tools'){const r=await rpc('tools/list',{});console.log(JSON.stringify(r.tools.map(t=>({name:t.name,inputSchema:t.inputSchema})),null,2));}
 else if(['recentes','fila'].includes(process.argv[2])){
  const r=await rpc('tools/call',{name:'list_videos',arguments:{kind:process.argv[2]==='fila'?'all':'image',limit:process.argv[2]==='fila'?30:8}});
  const v=JSON.parse(r.content.find(c=>c.type==='text').text);
  if(Array.isArray(v)){
   const meus=v.filter(x=>/^ep1[34]-/.test(x.conversation_id||''));
   writeFileSync('projetos/novelas-cristas-pedidos.json',JSON.stringify({consultado_em:new Date().toISOString(),pedidos:meus},null,2));
   console.log(JSON.stringify({outros_pendentes:v.filter(x=>!/^ep1[34]-/.test(x.conversation_id||'')&&['queued','generating','pending'].includes(x.status)).length,pedidos:meus.map(({id,status,conversation_id,download_url,error,created_at})=>({id,status,conversation_id,download_url,error,created_at}))},null,2));
  }else console.log(JSON.stringify(v));
 }
 else for(const id of process.argv.slice(2)){
  const r=await rpc('tools/call',{name:'get_video',arguments:{id}});const v=JSON.parse(r.content.find(c=>c.type==='text').text);
  console.log(JSON.stringify(v));
 }
}catch(e){console.error(e.name+': '+e.message);process.exitCode=1;}
