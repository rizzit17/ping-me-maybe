// Run a copy from .build/ with the bundled @oai/artifact-tool on its module path.
import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath,pathToFileURL} from 'node:url';
import {Presentation,PresentationFile} from '@oai/artifact-tool';
process.env.RUNTIME_NODE_MODULES ||= 'C:/Users/Rishit/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const output=path.join(root,'submission');
const preview=path.join(root,'.build/slides');
await fs.mkdir(output,{recursive:true});await fs.mkdir(preview,{recursive:true});
const P=Presentation.create({slideSize:{width:960,height:540}});
const C={red:'#E40000',ink:'#242422',muted:'#6C6C65',line:'#DFDFD8',wash:'#F5F4EF'};
const font='Arial';
const bg=await fs.readFile(path.join(root,'assets/submission-frame.jpg'));
function text(s,value,x,y,w,h,size=18,color=C.ink,bold=false){const t=s.shapes.add({geometry:'textbox',position:{left:x,top:y,width:w,height:h},fill:'none',line:{fill:'none',width:0}});t.text=value;t.text.style={fontFamily:font,fontSize:size,color,bold,verticalAlignment:'middle'};t.text.insets=0;return t;}
function slide(title,number,source='Synthetic competition case data; all projections are assumptions.'){
 const s=P.slides.add();s.images.add({blob:bg.buffer.slice(bg.byteOffset,bg.byteOffset+bg.byteLength),contentType:'image/jpeg',position:{left:0,top:0,width:960,height:540}});
 text(s,title,55,90,850,65,30,C.ink,true);
 text(s,`Ping Me Maybe  /  VIT Vellore  /  ${number}`,55,492,600,16,10,C.muted);
 s.speakerNotes.text=source;return s;
}
function table(s,values,x,y,w,h,widths,size=14){const t=s.tables.add({rows:values.length,columns:values[0].length,left:x,top:y,width:w,height:h,columnWidths:widths,values});t.borders.assign({fill:C.line,width:.6,style:'solid'});for(let r=0;r<values.length;r++)for(let c=0;c<values[r].length;c++){const cell=t.getCell(r,c);cell.fill=r===0?C.red:r%2===0?C.wash:'#FFFFFF';cell.text.style={fontFamily:font,fontSize:size,color:r===0?'#FFFFFF':C.ink,bold:r===0};}return t;}
async function image(s,name,x,y,w,h,fit='contain'){const bytes=await fs.readFile(path.join(root,'docs/images/slides',name));s.images.add({blob:bytes.buffer.slice(bytes.byteOffset,bytes.byteOffset+bytes.byteLength),contentType:'image/jpeg',position:{left:x,top:y,width:w,height:h},fit});}
function diagramBox(s,label,x,y,w=220,h=65){const shape=s.shapes.add({geometry:'rect',position:{left:x,top:y,width:w,height:h},fill:C.wash,line:{fill:C.line,width:1}});shape.text=label;shape.text.style={fontFamily:font,fontSize:16,color:C.ink,bold:true,alignment:'center',verticalAlignment:'middle'};return shape;}
function arrow(s,x,y,w=36){s.shapes.add({geometry:'rightArrow',position:{left:x,top:y,width:w,height:15},fill:C.red,line:{fill:'none',width:0}});}

let s=slide('Udyam Saathi',1,'Source: Airtel_SYNC_Case.pdf, Project Udyam Digital. Baseline: 368 / 5,000 = 7.36%. All underlying businesses and documents are fictional. The working prototype supports catalogue-grounded Gemini or OpenAI when a server-side credential is configured; guided mode remains explicitly labelled.');
text(s,'A simpler digital start\nfor small businesses',55,169,440,112,37,C.ink,true);
text(s,'Discover a useful bundle, verify documents\nand follow activation in one workspace.',55,302,445,60,19,C.muted);
text(s,'7.36%',55,390,165,58,43,C.red,true);
text(s,'baseline lead-to-activation\n368 activations from 5,000 synthetic leads',225,399,350,50,15,C.muted);
await image(s,'overview-laptop.jpg',510,190,400,225,'contain');

s=slide('Professional offices are the first pilot segment',2,'Source: data/source/smb_leads.csv and product_catalogue.csv. Professional offices: 138 / 1,247 = 11.07%; micro retail: 110 / 2,709 = 4.06%. Higher observed conversion does not establish causality. Office bundle calculation: P02 1499 + P09 499 + P16 5*125 + P20 5*99 = INR 3118/month; P09 setup INR 1500. Each selected product has a 12-month minimum. Prices use the synthetic catalogue minimum and exclude taxes.');
text(s,'11.07% observed conversion',55,163,445,37,25,C.red,true);
text(s,'vs 4.06% for micro retail. Clinics, CA firms and\ncoaching centres need reliable internet and secure tools.',55,210,820,50,18,C.muted);
table(s,[['Five-person clinic, one site','Quantity','Monthly INR'],['Biz Fibre 300','1 site','1,499'],['Backup 4G/5G Failover','1 site','499'],['Cloud Email & Office Suite','5 users','625'],['Endpoint Security','5 devices','495'],['Total','', '3,118']],55,282,575,174,[330,100,145],13.5);
text(s,'INR 1,500 setup\nINR 4,618 first month\n12-month minimum',665,292,240,100,20,C.ink,true);
text(s,'Starting case prices, excluding taxes.\nExisting tools are retained where possible.\nMulti-site and manufacturing follow later.',665,405,245,64,14,C.muted);

s=slide('Would this clinic pay for backup connectivity?',3,'Source: Resilience Lab in the working prototype. Case P09 adds INR 499/month and INR 1,500 setup. User-editable scenario assumes INR 500 contribution lost per outage hour and 75% avoidable with backup. Protected contribution is hours × contribution × avoidable share × 12. No real outage or coverage data is used.');
await image(s,'resilience-laptop.jpg',55,165,512,288,'contain');
text(s,'Change the outage assumption',590,175,315,35,21,C.red,true);
text(s,'2 h/month → INR 1,512 net benefit\n0.5 h/month → INR 5,238 net cost',590,220,315,67,17,C.ink,true);
text(s,'Break-even: 1.66 hours per month. The receipt records the quote, assumptions and math.',590,300,315,75,16,C.muted);
text(s,'The owner can revise the bundle, then continue to verification and order tracking.',590,382,315,65,15,C.muted);

s=slide('Integrated bundles already exist; the journey must improve',4,'Sources reviewed 7 November 2026: [1] https://www.airtel.in/b2b/ [2] https://www.jio.com/business/services/connectivity/jiobusiness-solution/ [3] https://www.myvi.in/business/enterprise-segments/smb/msme-readyfornext . These public product pages establish advertised features, not independently tested onboarding performance. A feature not described on a page is unverified, not absent. Udyam Saathi is a prototype, not a market-leading product.');
table(s,[['Offer','Established strength','Observed public entry','Implication for us'],['Airtel Business [1]','Broad connectivity, cloud\nand security portfolio','Request a callback\nfor tailored solutions','Reuse product depth;\nreduce discovery effort'],['JioBusiness [2]','Integrated connectivity\nand digital services','Product plans and\ndigital self-care','A bundle alone is\nnot differentiation'],['Vi ReadyForNext [3]','MSME digital-readiness\nassessment and advisory','Assessment-led\ndiscovery','Connect discovery to\na transparent next step'],['Udyam Saathi','Outage stress test + local\nOCR + partner handoff','One demonstrable\nonboarding prototype','Test completion and\nclarity in the pilot']],55,168,850,260,[160,225,220,245],13.5);
text(s,'Differentiation hypothesis: multilingual guidance, testable bundle economics and visible exceptions\nin one flow. Competitor KYC speed and end-to-end conversion remain unverified.',55,443,850,40,15,C.muted);

s=slide('The model advises; the catalogue and checks decide',5,'Architecture follows current source: advisor.mjs, server.mjs, dist/engine.js and dist/app.js. Gemini documentation: https://ai.google.dev/gemini-api/docs/structured-output . The API key stays server-side. Gemini free-tier submitted content may improve Google products; this demo should use fictional inputs only. No KYC images are attached to advisor requests. OCR and registry fixtures run in the browser.');
diagramBox(s,'Owner workspace\nEnglish / Hindi / Tamil',55,178,235,65);arrow(s,303,202);
diagramBox(s,'Server-side advisor\nGemini or OpenAI',354,178,235,65);arrow(s,602,202);
diagramBox(s,'Catalogue engine\n25 products and rules',652,178,253,65);
diagramBox(s,'Explicit KYC consent\nOn-device document OCR',55,291,235,65);arrow(s,303,315);
diagramBox(s,'Mock registries + review\nDates, names and address',354,291,235,65);arrow(s,602,315);
diagramBox(s,'Order tracker\nPartner exception queue',652,291,253,65);
text(s,'Data flow: preferences and chat reach the advisor; document images stay in the browser.',55,384,850,30,17,C.ink,true);
text(s,'Controls: consent withdrawal clears KYC, identifiers are masked in results, credentials stay\non the server, and owners can reset session data. Legal and operator approval remain rollout gates.',55,427,850,48,16,C.muted);

s=slide('A 90-day pilot tests conversion before expansion',6,'Professional-office baselines: acquisition spend INR 1,475,870 / 138 activations = INR 10,694.71 CAC. Segment conversion 11.0666%. Planning assumptions: 1,000 comparable office leads, 15% conversion, same segment spend per lead INR 1,183.5365, INR 20 incremental digital cost per lead. CAC = (1,183,536.49 + 20,000) / 150 = INR 8,023.58, 24.98% below the office baseline. Spend, margin, attribution and outcomes need experimental validation. 1,000 pilot leads are directional evidence, not guaranteed statistical power.');
text(s,'1,000 leads, two cities, professional offices first',55,166,850,35,25,C.red,true);
text(s,'Days 1–30\nOperator and privacy review\nServiceability integration\nPartner training',55,225,250,105,18,C.ink);
text(s,'Days 31–60\nAssisted launch\nInstrument the funnel\nFix document exceptions',350,225,250,105,18,C.ink);
text(s,'Days 61–90\nCompare with a control\nAudit support and retention\nExpand only after review',645,225,260,105,18,C.ink);
text(s,'Illustrative pilot economics',55,363,800,30,22,C.ink,true);
text(s,'15% conversion = 150 activations\nSame lead spend + INR 20 digital cost per lead\nModelled CAC: INR 8,024 vs INR 10,695 segment baseline',55,406,580,68,18,C.muted);
text(s,'25% lower CAC',665,405,240,35,24,C.red,true);
text(s,'Planning scenario only',665,448,240,24,15,C.muted);

s=slide('Five measures determine whether the pilot expands',7,'Professional-office baselines from 1,247 synthetic leads and 138 activations: 11.0666% conversion, 16.9203 mean activation days, INR 10,694.71 CAC, 3.0652 follow-up calls and 13.7681% six-month churn. See docs/case-metrics.json and scripts/analyse-case.py for reproducible calculations. Targets are proposed pilot hypotheses. Churn cannot be measured in a 90-day pilot; review after six months. Sources: data/source/smb_leads.csv and docs/BUSINESS_CASE.md. Repository: https://github.com/rizzit17/ping-me-maybe .');
table(s,[['Metric','Office baseline','Proposed target','Measurement'],['Lead-to-activation','11.07%','15%','Activated / all pilot leads'],['Mean lead-to-activation','16.9 days','10 days','Same eligible cohorts'],['Acquisition cost','INR 10,695','≤ INR 9,000','All acquisition cost / activated'],['Customer follow-up calls','3.07','≤ 1.5','Mean per activated customer'],['Six-month churn','13.8%','≤ 12%','Review at month six']],55,164,850,227,[245,160,165,280],14);
text(s,'Rollout gates',55,411,850,26,21,C.red,true);
text(s,'Hallucinations: catalogue-controlled quotes. Document fraud: authorised verification + human review.\nInstallation delays: serviceability checks. Partner adoption: shared leads and explicit ownership.',55,446,850,40,15,C.muted);

for(let i=0;i<P.slides.items.length;i++){
 const blob=await P.export({slide:P.slides.items[i],format:'png',scale:1.5});
 await fs.writeFile(path.join(preview,`slide-${i+1}.png`),new Uint8Array(await blob.arrayBuffer()));
}
await (await PresentationFile.exportPptx(P)).save(path.join(root,'.build/candidate.pptx'));
try{const pdf=await P.export({format:'pdf'});await fs.writeFile(path.join(output,'PingMeMaybe_VITVellore.pdf'),new Uint8Array(await pdf.arrayBuffer()));}catch(err){console.log('PDF rendering will use the verified slide images:',err.message);}
const SKILL='C:/Users/Rishit/.codex/plugins/cache/openai-primary-runtime/presentations/26.1105.12137/skills/presentations';
const {finalizePresentation}=await import(pathToFileURL(path.join(SKILL,'container_tools/artifact_tool_utils.mjs')).href);
await fs.mkdir(path.join(root,'.build/final'),{recursive:true});
const checkedPath=path.join(root,'.build/final',`validated-${Date.now()}.pptx`);
await finalizePresentation({workspaceDir:root,candidatePath:path.join(root,'.build/candidate.pptx'),finalPath:checkedPath,pythonExecutable:'C:/Users/Rishit/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/python.exe',integrityValidatorPath:path.join(SKILL,'container_tools/inspect_presentation_package_integrity.py'),layoutValidatorPath:path.join(SKILL,'container_tools/inspect_presentation_layout_geometry.py'),layoutArgs:['--expected-slide-size-emu','9144000,5143500','--validate-heading-fit','--require-native-table-slide','2','--require-native-table-slide','4','--require-native-table-slide','7'],explicitTotalSlideCount:7,requiredNativeTableOwnerSlides:[2,4,7],fontPolicy:{basis:'design',families:['Arial']},verifyArtifactToolImport:true,receiptPath:path.join(root,'.build',`presentation-validation-${Date.now()}.json`)});
await fs.copyFile(checkedPath,path.join(output,'PingMeMaybe_VITVellore.pptx'));
console.log('Created seven-slide submission.');
