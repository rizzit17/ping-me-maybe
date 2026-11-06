from pathlib import Path
import csv,json,statistics
ROOT=Path(__file__).resolve().parents[1]
with (ROOT/'data/source/smb_leads.csv').open(encoding='utf-8-sig',newline='') as f:rows=list(csv.DictReader(f))
def metrics(group):
 a=[r for r in group if r['outcome']=='Activated'];cost=sum(float(r['acquisition_cost_inr']) for r in group)
 return {'leads':len(group),'activated':len(a),'conversionPercent':len(a)/len(group)*100,'acquisitionCost':cost,'costPerLead':cost/len(group),'cac':cost/len(a),'meanActivationDays':statistics.mean(float(r['days_lead_to_activation']) for r in a),'meanFollowUpCalls':statistics.mean(float(r['customer_follow_up_calls']) for r in a),'sixMonthChurnPercent':sum(r['churned_within_6_months']=='Y' for r in a)/len(a)*100}
all_metrics=metrics(rows);prof=metrics([r for r in rows if r['segment']=='Professional offices'])
model_cac=(prof['costPerLead']*1000+20000)/150
result={'source':'Supplied synthetic CSVs; not Airtel performance.','overall':all_metrics,'professionalOffices':prof,'planningScenario':{'pilotLeads':1000,'targetConversionPercent':15,'incrementalDigitalCostPerLead':20,'modelledActivations':150,'modelledCAC':model_cac,'reductionPercent':(1-model_cac/prof['cac'])*100}}
(ROOT/'docs/case-metrics.json').write_text(json.dumps(result,indent=2),encoding='utf-8')
print(json.dumps(result,indent=2))
