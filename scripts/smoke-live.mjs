import fs from 'node:fs/promises';
import {generateAdvisor} from '../advisor.mjs';
const catalogue=JSON.parse(await fs.readFile(new URL('../dist/data/product_catalogue.json',import.meta.url),'utf8'));
if(!process.env.GEMINI_API_KEY)throw Error('GEMINI_API_KEY is not configured.');
const modelsResponse=await fetch('https://generativelanguage.googleapis.com/v1beta/models',{headers:{'x-goog-api-key':process.env.GEMINI_API_KEY},signal:AbortSignal.timeout(20000)});
if(!modelsResponse.ok)throw Error(`Gemini model discovery returned HTTP ${modelsResponse.status}.`);
const models=(await modelsResponse.json()).models||[];
const available=models.filter(m=>m.supportedGenerationMethods?.includes('generateContent')).map(m=>m.name.replace('models/',''));
const preferred=[process.env.GEMINI_MODEL,'gemini-3.5-flash-lite','gemini-2.5-flash-lite','gemini-2.5-flash'].filter(Boolean);
const model=preferred.find(m=>available.includes(m));
if(!model)throw Error('No configured Flash model was available to this key.');
process.env.GEMINI_MODEL=model;
const envPath=new URL('../.env',import.meta.url);
let envText=await fs.readFile(envPath,'utf8');
envText=/^GEMINI_MODEL=/m.test(envText)?envText.replace(/^GEMINI_MODEL=.*$/m,`GEMINI_MODEL=${model}`):envText+`\nGEMINI_MODEL=${model}\n`;
await fs.writeFile(envPath,envText);
const results=[];
for(const language of ['en','hi','ta']){
 const result=await generateAdvisor({message:language==='en'?'I run a clinic with 5 staff in Delhi. Budget 3500. Explain the recommended bundle.':language==='hi'?'हम पहले से Google Workspace इस्तेमाल करते हैं। क्या हमें फिर से ईमेल सेवा खरीदनी होगी?':'நாங்கள் ஏற்கனவே Google Workspace பயன்படுத்துகிறோம். மீண்டும் மின்னஞ்சல் சேவை வேண்டுமா?',profile:{type:'clinic',employees:5,sites:1,city:'Delhi',budget:3500,language,currentTools:language==='en'?'':'Google Workspace'}},catalogue);
 results.push({language,provider:result.provider,reply:result.reply,profileUpdates:result.profileUpdates});
 console.log(`${language}: ${result.provider} returned ${result.reply.length} characters`);
}
await fs.mkdir(new URL('../docs/verification/',import.meta.url),{recursive:true});
await fs.writeFile(new URL('../docs/verification/live-advisor.json',import.meta.url),JSON.stringify({testedAt:new Date().toISOString(),provider:'gemini',model,inputs:'Fictional clinic business profile only; no KYC or personal data.',results},null,2));
console.log(`Live provider verified with ${model}. No credential was logged.`);
