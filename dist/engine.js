// The catalogue, never the language model, is the authority for every quote.
export const CASE_TODAY = '2026-07-15';
export const DEFAULT_PROFILE = { type: '', name: '', employees: 5, sites: 1, city: 'Delhi', tier: 1, budget: 3500, language: 'en', hasGstin: false, internet: 'fibre', priority: 'reliability' };
export const BUSINESS_TYPES = [
  { id: 'clinic', name: 'Clinic & healthcare', hi: 'क्लिनिक और हेल्थकेयर', segment: 'prof', icon: 'medical', example: 'Patient records, appointments, always-on internet' },
  { id: 'office', name: 'Professional office', hi: 'प्रोफेशनल ऑफिस', segment: 'prof', icon: 'briefcase', example: 'CA firms, consultancies & growing teams' },
  { id: 'education', name: 'Coaching & education', hi: 'कोचिंग और शिक्षा', segment: 'prof', icon: 'book', example: 'Online classes, staff email & secure Wi-Fi' },
  { id: 'retail', name: 'Retail & services', hi: 'दुकान और सेवाएं', segment: 'micro', icon: 'store', example: 'Shops, salons, cafés & local businesses' },
  { id: 'multi', name: 'Multi-location business', hi: 'कई शाखाओं वाला व्यवसाय', segment: 'multi', icon: 'network', example: 'One connected setup across every location' },
  { id: 'manufacturing', name: 'Small manufacturing', hi: 'छोटा मैन्युफैक्चरिंग', segment: 'mfg', icon: 'factory', example: 'Reliable operations, machines & teams' },
];
export const money = n => new Intl.NumberFormat('en-IN', {style:'currency', currency:'INR', maximumFractionDigits:0}).format(n);
export const segmentOf = p => BUSINESS_TYPES.find(t => t.id === p.type)?.segment || 'prof';
export const productById = (catalogue,id) => catalogue.find(p => p.product_id === id);
export const unitPrice = p => Number(p.price_min_inr_per_month);
export function eligibility(product, profile, items = []) {
  const reasons=[];
  if (!String(product.available_city_tiers).split(';').includes(String(profile.tier))) reasons.push('Not available in this city tier');
  if (Number(profile.employees) < Number(product.min_employees)) reasons.push(`Needs at least ${product.min_employees} employees`);
  if (Number(profile.sites) < Number(product.min_sites)) reasons.push(`Needs at least ${product.min_sites} locations`);
  if (product.requires_gstin === 'Y' && !profile.hasGstin) reasons.push('Requires an active GSTIN');
  if (product.requires_one_of && !product.requires_one_of.split('|').some(id => items.some(i=>i.id===id))) reasons.push('Add a compatible internet connection first');
  return reasons;
}
export function quantityFor(product, profile) {
  if (product.unit === 'per site') return Number(profile.sites);
  if (product.unit === 'per user' || product.unit === 'per device') return Number(profile.employees);
  return 1;
}
export function calculateQuote(items,catalogue,profile) {
  const errors=[];
  const lines=items.map(item=> {
    const product=productById(catalogue,item.id);
    if (!product) {errors.push('Unknown product'); return null;}
    if (!Number.isInteger(item.qty) || item.qty<1 || item.qty>10000) errors.push(`Invalid quantity for ${product.product_name}`);
    errors.push(...eligibility(product,profile,items).map(e=>`${product.product_name}: ${e}`));
    return { ...item, product, monthly:unitPrice(product)*item.qty, setup:Number(product.one_time_setup_inr)*item.qty };
  }).filter(Boolean);
  const monthly=lines.reduce((s,i)=>s+i.monthly,0), setup=lines.reduce((s,i)=>s+i.setup,0);
  return {lines,monthly,setup,errors,contract:Math.max(0,...lines.map(l=>Number(l.product.min_contract_months))),installDays:Math.max(0,...lines.map(l=>Number(l.product.typical_install_days))),gstRequired:lines.some(l=>l.product.requires_gstin==='Y'),overBudget:monthly>Number(profile.budget)};
}
export function recommend(profile,catalogue) {
  const segment=segmentOf(profile), items=[];
  const budget=Number(profile.budget);
  const push=(id,reason,essential=false)=> {
    const p=productById(catalogue,id); if(!p || eligibility(p,profile,items).length) return;
    const qty=quantityFor(p,profile);
    const current=calculateQuote(items,catalogue,profile).monthly;
    if (essential || current+unitPrice(p)*qty<=budget) items.push({id,qty,reason});
  };
  const connection=profile.internet==='wireless'?'P04':segment==='micro'?'P01':'P02';
  push(connection,profile.internet==='wireless'?'Wireless internet where fibre is unavailable.':'A reliable connection for your day-to-day work.',true);
  if (profile.priority==='budget') {
    if(segment==='prof') push('P16','Business email for every member of your team.');
  } else {
    if(profile.priority==='reliability') push('P09','Keep payments and work moving during a broadband outage.');
    if(segment==='prof'||segment==='mfg') push('P16','Give your team professional email and shared documents.');
    if(segment==='prof'||segment==='mfg') push('P20','Protect the devices that hold your business files.');
    if(segment==='micro') push('P19','Bring billing, inventory and payments together.');
    if(segment==='multi') push('P22','Separate guest Wi-Fi from your business network.');
    if(profile.priority==='customers' && profile.hasGstin) push('P15','Reach customers through a verified WhatsApp channel.');
  }
  return items;
}
export function parseMessage(text,profile) {
  const p={...profile}; const t=text.toLowerCase();
  const types=[[/clinic|doctor|dental|hospital|क्लिनिक|डॉक्टर/,'clinic'],[/coaching|school|education|class|कोचिंग|शिक्षा/,'education'],[/manufactur|factory|textile|फैक्ट्री/,'manufacturing'],[/chain|multi.site|branches|शाखा/,'multi'],[/shop|retail|salon|kirana|cafe|restaurant|दुकान|किराना/,'retail'],[/office|accountant|consult|\bca\b|ऑफिस/,'office']];
  for(const [regex,type] of types) if(regex.test(t)){p.type=type;break;}
  const employees=t.match(/(\d+)\s*(?:employees|staff|people|users|members|कर्मचारी|लोग)/);
  if(employees) p.employees=Math.min(500,Math.max(1,Number(employees[1])));
  const sites=t.match(/(\d+)\s*(?:sites|locations|branches|stores|शाखा)/);
  if(sites) p.sites=Math.min(100,Math.max(1,Number(sites[1])));
  const budget=t.match(/(?:budget|बजट|₹|rs\.?|inr)\s*(?:of|is|:|है)?\s*([\d,]+)(k)?/) || t.match(/([\d,]+)(k)?\s*(?:per month|\/month|monthly|महीने)/);
  if(budget) p.budget=Math.max(500,Math.min(1000000,Number(budget[1].replaceAll(',',''))*(budget[2]?1000:1)));
  if(/no gst|without gst|don't have gst|do not have gst|gst नहीं/.test(t)) p.hasGstin=false;
  else if(/have (?:a )?gst|gst.registered|gst available/.test(t)) p.hasGstin=true;
  if(/no fibre|no fiber|wireless|airfiber|airfibre/.test(t)) p.internet='wireless';
  if(/cheap|lowest|save|afford|कम बजट/.test(t)) p.priority='budget';
  if(/uptime|backup|reliab|outage/.test(t)) p.priority='reliability';
  if(/whatsapp|marketing|customers/.test(t)) p.priority='customers';
  const cities={delhi:1,mumbai:1,bengaluru:1,bangalore:1,chennai:1,hyderabad:1,kolkata:1,pune:1,jaipur:2,lucknow:2,indore:2,kochi:2,ludhiana:2,surat:2,coimbatore:2};
  for(const [city,tier] of Object.entries(cities)) if(t.includes(city)){p.city=city[0].toUpperCase()+city.slice(1);p.tier=tier;break;}
  return p;
}
export function advisorReply(text,profile,catalogue) {
  const hi=profile.language==='hi';
  if(!profile.type) return hi?'आपका व्यवसाय किस प्रकार का है? जैसे क्लिनिक, दुकान या ऑफिस। नीचे से भी चुन सकते हैं।':'Tell me what you do—run a clinic, a shop, an office, or something else? You can also choose a business type below.';
  if(/contract|cancel|commitment/.test(text.toLowerCase())) return hi?'हर प्रोडक्ट की न्यूनतम अवधि अलग है। कोट में मासिक लागत, सेटअप फीस और हर प्रोडक्ट की अवधि दिखाई गई है।':'Each product has its own minimum contract. Your quote shows every term, monthly charge and one-time fee before you proceed. No cancellation fee has been assumed in this prototype.';
  if(/privacy|data|safe|secure|kyc/.test(text.toLowerCase())) return hi?'KYC से पहले आपकी सहमति ली जाएगी। दस्तावेज़ इसी ब्राउज़र में पढ़े जाते हैं। यह डेमो केवल दिए गए काल्पनिक रजिस्टर से जाँच करता है।':'You control KYC consent. Document reading happens in this browser; checks use the supplied fictional registries. Documents are not sent to the advisor. You can clear all session data from the privacy screen.';
  const q=calculateQuote(recommend(profile,catalogue),catalogue,profile);
  return hi?`${profile.employees} लोगों और ${profile.sites} लोकेशन के लिए, ₹${q.monthly.toLocaleString('en-IN')}/माह का शुरुआती बंडल सुझाऊँगा। ${q.overBudget?'यह बजट से अधिक है—कम लागत वाला विकल्प चुनें।':'यह आपके मासिक बजट के अंदर है।'} आप बजट, बैकअप या इंटरनेट की ज़रूरत बदल सकते हैं।`:`For ${profile.employees} people across ${profile.sites} ${profile.sites===1?'location':'locations'}, I’d start with a ${money(q.monthly)}/month bundle. ${q.overBudget?'The minimum connection exceeds your budget; raise it or try wireless internet.':'That fits your monthly budget.'} Tell me if you need a lower price, backup connectivity, or a customer messaging channel.`;
}
export function validateGstinFormat(value) {
  const gst=value.trim().toUpperCase();
  if(!/^\d{2}[A-Z]{5}\d{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/.test(gst)) return false;
  const chars='0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';let factor=2,sum=0;
  for(let i=13;i>=0;i--){let n=chars.indexOf(gst[i])*factor;sum+=Math.floor(n/36)+(n%36);factor=factor===2?1:2;}
  return chars[(36-(sum%36))%36]===gst[14];
}
export function checkGstin(value,registry) {
  const gst=value.trim().toUpperCase();
  if(!validateGstinFormat(gst)) return {ok:false,message:'Check the 15-character GSTIN and its checksum.'};
  const record=registry.find(r=>r.gstin===gst);
  if(!record) return {ok:false,message:'No match in the supplied mock GST registry. This is not a live government lookup.'};
  if(record.status.toLowerCase()!=='active') return {ok:false,message:`Mock registry status: ${record.status}. This GSTIN cannot be used for checkout.`,record};
  return {ok:true,message:'Active business found in the mock GST registry.',record};
}
export function checkUdyam(value,registry) {
  const id=value.trim().toUpperCase();
  if(!/^UDYAM-[A-Z]{2}-\d{2}-\d{7}$/.test(id)) return {ok:false,message:'Use the format UDYAM-XX-00-1234567.'};
  const record=registry.find(r=>r.udyam_number===id);
  return record?{ok:true,message:'Enterprise found in the mock Udyam registry.',record}:{ok:false,message:'No match in the supplied mock Udyam registry.'};
}
export function maskIdentifier(value) {return value?`${value.slice(0,2)}${'•'.repeat(Math.max(4,value.length-6))}${value.slice(-4)}`:'';}
export function extractDocument(text,kind) {
  const cleaned=text.toUpperCase();
  const gst=cleaned.match(/\b\d{2}[A-Z]{5}\d{4}[A-Z][1-9A-Z]Z[0-9A-Z]\b/)?.[0];
  const udyam=cleaned.match(/UDYAM[-\s]*[A-Z]{2}[-\s]*\d{2}[-\s]*\d{7}/)?.[0]?.replace(/\s/g,'');
  const dates=[...text.matchAll(/\b(\d{4})-(\d{2})-(\d{2})\b|\b(\d{2})[\/\-](\d{2})[\/\-](\d{4})\b/g)].map(m=>m[1]?`${m[1]}-${m[2]}-${m[3]}`:`${m[6]}-${m[5]}-${m[4]}`);
  const labelledBillDate=text.match(/Bill\s*date\s*[:\s]*(\d{4}-\d{2}-\d{2})/i)?.[1];
  const billDate=labelledBillDate||dates.filter(d=>d<=CASE_TODAY).sort().at(-1);
  const validUntil=text.match(/Valid\s*(?:till|until|to)\s*[:\s]*(\d{4}-\d{2}-\d{2})/i)?.[1];
  const confirmedName=text.match(/(?:^|\n)\s*Name\s*[:\s]+([^\n]+)/i)?.[1]?.trim();
  const businessName=text.match(/(?:For business|Billed to)\s*[:\s]+([^\n]+)/i)?.[1]?.trim();
  const confirmedAddress=text.match(/Supply\s*address\s*[:\s]+([\s\S]*?)(?:Bill\s*date|Units\s*consumed)/i)?.[1]?.trim().replace(/\s*\n\s*/g,' ');
  const age=billDate?Math.floor((Date.parse(CASE_TODAY)-Date.parse(billDate))/86400000):null;
  const issues=[];
  if(kind==='gst' && !gst) issues.push('GSTIN could not be read. Try a clearer image or enter it manually.');
  if(kind==='udyam' && !udyam) issues.push('Udyam number could not be read. Try a clearer image or enter it manually.');
  if(kind==='address' && age!==null && age>90) issues.push(`Address proof is ${age} days old at the case reference date. Upload proof within 90 days.`);
  if(kind==='address' && labelledBillDate>CASE_TODAY) issues.push('Address proof issue date is after the case reference date.');
  if(kind==='id' && validUntil && validUntil<CASE_TODAY) issues.push('Signatory ID is expired at the case reference date.');
  return {gst,udyam,billDate,validUntil,confirmedName,businessName,confirmedAddress,age,issues,textLength:text.trim().length};
}
export function validateKyc({consent,gstResult,udyamResult,documents,quote}) {
  const errors=[];
  if(!consent) errors.push('Consent is required before verification.');
  if(quote.gstRequired && !gstResult?.ok) errors.push('This bundle requires a verified active GSTIN.');
  if(!gstResult?.ok && !udyamResult?.ok) errors.push('Verify either a GSTIN or an Udyam registration.');
  for(const kind of ['id','address']) {
    const d=documents[kind];
    if(!d) errors.push(`Upload ${kind==='id'?'signatory ID':'address proof'}.`);
    else if(d.status!=='reviewed') errors.push(`Confirm the extracted ${kind==='id'?'signatory ID':'address proof'} details.`);
    if(d?.issues?.length) errors.push(...d.issues);
  }
  const norm=s=>String(s||'').toLowerCase().replace(/[^a-z0-9]/g,'');
  const registeredNames=[gstResult?.record?.legal_name,gstResult?.record?.trade_name,udyamResult?.record?.enterprise_name].filter(Boolean).map(norm);
  for(const kind of ['id','address']) {
    if(documents[kind]?.businessName && registeredNames.length && !registeredNames.includes(norm(documents[kind].businessName))) errors.push(`The business name on the ${kind==='id'?'signatory ID':'address proof'} does not match the verified registration. Request a manual review.`);
  }
  return [...new Set(errors)];
}
