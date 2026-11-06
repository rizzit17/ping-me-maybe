import fs from 'node:fs/promises';
import {execFileSync} from 'node:child_process';
const root=new URL('../',import.meta.url);
let localEnv='';try{localEnv=await fs.readFile(new URL('.env',root),'utf8');}catch{}
const secrets=localEnv.split(/\r?\n/).filter(l=>/^(GEMINI_API_KEY|OPENAI_API_KEY)=/.test(l)).map(l=>l.slice(l.indexOf('=')+1).trim().replace(/^["']|["']$/g,'')).filter(Boolean);
const files=execFileSync('git',['ls-files','--cached','--others','--exclude-standard','-z'],{cwd:root,encoding:'utf8'}).split('\0').filter(Boolean);
for(const file of new Set(files)){
 if(file==='.env'||/\/\.env$/.test(file))throw Error('A local credential file would be included in Git.');
 const bytes=await fs.readFile(new URL(file,root));
 if(secrets.some(secret=>bytes.includes(Buffer.from(secret))))throw Error(`A configured API credential was found in ${file}.`);
}
console.log(`Checked ${new Set(files).size} publishable files; no configured API credential is included.`);
