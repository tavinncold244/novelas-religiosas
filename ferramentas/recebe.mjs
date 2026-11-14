// servidor local: POST /<nome>.mp4 com corpo = URL assinada do vídeo -> baixa e grava em projetos/_recebidos
import http from 'http'; import fs from 'fs';
const dir = 'E:/NOVELAS RELIGIOSAS/projetos/_recebidos';
http.createServer((req,res)=>{
  res.setHeader('Access-Control-Allow-Origin','*');
  res.setHeader('Access-Control-Allow-Methods','POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers','*');
  res.setHeader('Access-Control-Allow-Private-Network','true');
  if(req.method==='OPTIONS'){res.end();return;}
  const name=req.url.slice(1).replace(/[^\w.-]/g,'_');
  let body=''; req.on('data',c=>body+=c); req.on('end',async()=>{
    try{ const r=await fetch(body.trim()); const b=Buffer.from(await r.arrayBuffer()); fs.writeFileSync(dir+'/'+name,b); console.log('salvo',name,r.status,b.length); res.end('ok '+r.status+' '+b.length);}catch(e){console.log('erro',name,String(e)); res.end('erro '+e);}
  });
}).listen(8765,'127.0.0.1',()=>console.log('ouvindo 8765'));
