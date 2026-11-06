import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {extractDocument,validateGstinFormat,validateKyc,checkGstin} from '../dist/engine.js';
const fixture=JSON.parse(readFileSync(new URL('./fixtures/kyc-ocr.json',import.meta.url)));
const registry=JSON.parse(readFileSync(new URL('../dist/data/mock_gstin_registry.json',import.meta.url)));
test('audit covers all 47 student specimen images and 12 applicants',()=>{assert.equal(fixture.documents.length,47);assert.equal(new Set(fixture.documents.map(d=>d.applicant)).size,12);});
for(const applicant of [...new Set(fixture.documents.map(d=>d.applicant))]){
 test(`${applicant}: extracted fields stay reviewable and corrected GSTINs pass checksums`,()=>{
  for(const d of fixture.documents.filter(d=>d.applicant===applicant)){
   const actual=extractDocument(d.text,d.kind);assert.ok(Array.isArray(actual.issues));assert.ok(actual.textLength>0);
   if(actual.gstCorrected)assert.equal(validateGstinFormat(actual.gst),true);
  }
 });
}
function review(id){const docs=Object.fromEntries(fixture.documents.filter(d=>d.applicant===id).map(d=>[d.kind,{...extractDocument(d.text,d.kind),status:'reviewed'}]));return validateKyc({consent:true,gstResult:checkGstin(docs.gst.gst||'',registry),documents:docs,quote:{gstRequired:true}});}
test('K03 real OCR can complete the fictional applicant review',()=>assert.deepEqual(review('K03'),[]));
test('K01 cancelled registry entry is blocked',()=>assert.ok(review('K01').some(e=>e.includes('active GSTIN'))));
test('K11 stale address proof is blocked',()=>assert.ok(review('K11').some(e=>e.includes('90 days'))));
test('K07 legal-name discrepancy triggers review',()=>assert.ok(review('K07').some(e=>e.includes('legal name'))));
