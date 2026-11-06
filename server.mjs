import http from 'node:http';
import {readFile,stat} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {generateAdvisor} from './advisor.mjs';
const root=fileURLToPath(new URL('./dist/',import.meta.url));
const port=Number(process.env.PORT||3000);
const mime={'.html':'text/html; charset=utf-8','.css':'text/css','.js':'text/javascript','.json':'application/json','.svg':'image/svg+xml','.png':'image/png','.md':'text/markdown; charset=utf-8'};
function json(res,status,data){res.writeHead(status,{'Content-Type':'application/json','Cache-Control':'no-store'});res.end(JSON.stringify(data));}
const counts=new Map();
const catalogue=JSON.parse(await readFile(new URL('./dist/data/product_catalogue.json',import.meta.url),'utf8'));
http.createServer(async(req,res)=>{
  res.setHeader('X-Content-Type-Options','nosniff');
  res.setHeader('Referrer-Policy','strict-origin-when-cross-origin');
  const url=new URL(req.url,'http://localhost');
  if(url.pathname==='/api/health') return json(res,200,{advisor:process.env.GEMINI_API_KEY||process.env.OPENAI_API_KEY?'live':'demo',provider:process.env.GEMINI_API_KEY?'gemini':process.env.OPENAI_API_KEY?'openai':'demo',ocr:'browser'});
  if(url.pathname==='/api/advisor'&&req.method==='POST') {
    if(req.headers.origin && new URL(req.headers.origin).host!==req.headers.host) return json(res,403,{error:'Same-origin requests only.'});
    if(!process.env.GEMINI_API_KEY&&!process.env.OPENAI_API_KEY) return json(res,503,{error:'Live advisor is not configured. The catalogue-guided demo is available.'});
    const ip=req.socket.remoteAddress,now=Date.now();
    const count=counts.get(ip)||{at:now,n:0};if(now-count.at>60000){count.at=now;count.n=0;}count.n++;counts.set(ip,count);
    if(count.n>15) return json(res,429,{error:'Please wait a minute before asking again.'});
    try{
      let body='';for await(const chunk of req){body+=chunk;if(body.length>12000) return json(res,413,{error:'Message too long.'});}
      return json(res,200,await generateAdvisor(JSON.parse(body),catalogue));
    }catch(error){return json(res,502,{error:error.message||'The advisor could not respond. The guided journey still works.'});}
  }
  if(req.method!=='GET'&&req.method!=='HEAD') return json(res,405,{error:'Method not allowed.'});
  try{
    const decoded=decodeURIComponent(url.pathname);
    const target=path.resolve(root,'.'+decoded+(decoded.endsWith('/')?'index.html':''));
    if(!target.startsWith(root)) return json(res,403,{error:'Forbidden'});
    if(!(await stat(target)).isFile()) return json(res,404,{error:'Not found'});
    res.writeHead(200,{'Content-Type':mime[path.extname(target)]||'application/octet-stream','Cache-Control':'no-cache'});
    res.end(req.method==='HEAD'?undefined:await readFile(target));
  }catch{return json(res,404,{error:'Not found'});}
}).listen(port,'127.0.0.1',()=>console.log(`Udyam Saathi is ready at http://localhost:${port}`));
