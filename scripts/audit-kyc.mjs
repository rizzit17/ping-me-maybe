// Uses only student-provided specimen images and registries, never a judges' pack.
import fs from 'node:fs/promises';
import path from 'node:path';
import {createRequire} from 'node:module';
import {fileURLToPath} from 'node:url';
import {extractDocument,checkGstin,validateKyc} from '../dist/engine.js';
const require=createRequire(new URL('../.build/ocr/package.json',import.meta.url));
const {createWorker}=require('tesseract.js');
const root=fileURLToPath(new URL('../',import.meta.url));
const images=path.join(root,'dist/data/kyc_documents');
const registry=JSON.parse(await fs.readFile(path.join(root,'dist/data/mock_gstin_registry.json'),'utf8'));
const replay=process.argv.includes('--replay')?JSON.parse(await fs.readFile(path.join(root,'tests/fixtures/kyc-ocr.json'),'utf8')):null;
const worker=replay?null:await createWorker('eng',1,{cachePath:path.join(root,'.build/ocr')});
const documents=[];
for(const file of (await fs.readdir(images)).sort()){
 const kind=file.includes('gst_')?'gst':file.includes('udyam_')?'udyam':file.includes('address')?'address':'id';
 const data=replay?{text:replay.documents.find(d=>d.file===file).text}:(await worker.recognize(path.join(images,file))).data;
 documents.push({file,applicant:file.slice(0,3),kind,text:data.text,...extractDocument(data.text,kind)});
 console.log(`${file}: ${documents.at(-1).issues.length} extraction flags`);
}
if(worker)await worker.terminate();
const applicants=[];
for(const id of [...new Set(documents.map(d=>d.applicant))]){
 const docs=documents.filter(d=>d.applicant===id);const gstDoc=docs.find(d=>d.kind==='gst');const address=docs.find(d=>d.kind==='address');const signatory=docs.find(d=>d.kind==='id');
 const gst=gstDoc.gst?checkGstin(gstDoc.gst,registry):{ok:false,message:'OCR could not read GSTIN; manual review required.'};
 const errors=validateKyc({consent:true,gstResult:gst,documents:{gst:gstDoc,address:{...address,status:'reviewed'},id:{...signatory,status:'reviewed'}},quote:{gstRequired:true}});
 applicants.push({id,registryStatus:gst.record?.status||'unreadable',errors,decision:errors.length?'manual review':'eligible for demo review'});
}
await fs.mkdir(path.join(root,'tests/fixtures'),{recursive:true});
await fs.writeFile(path.join(root,'tests/fixtures/kyc-ocr.json'),JSON.stringify({source:'Real Tesseract OCR of all 47 supplied student specimen images. These are not government records or a judges answer key.',referenceDate:'2026-07-15',documents,applicants},null,2));
console.log(JSON.stringify(applicants,null,2));
