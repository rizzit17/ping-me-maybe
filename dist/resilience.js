import { calculateQuote, money, recommend } from './engine.js';

const PRIMARY_IDS = ['P01', 'P02', 'P03', 'P05', 'P06'];
const BACKUP_ID = 'P09';

export const outageDefaults = { hours: 2, loss: 500, coverage: 75 };
export const outageFields = [
  { key: 'hours', label: 'Primary outage hours per month', max: 744, step: 0.5 },
  { key: 'loss', label: 'Contribution lost per outage hour (₹)', max: 1000000, step: 1 },
  { key: 'coverage', label: 'Outage loss backup could avoid (%)', max: 100, step: 1 }
];

export function resilienceComparison(items, catalogue, profile) {
  const primary = items.filter(item => PRIMARY_IDS.includes(item.id));
  if (Number(profile.sites) !== 1 || primary.length !== 1 || primary[0].qty !== 1) return null;
  const without = items.filter(item => item.id !== BACKUP_ID);
  const withBackup = [...without, {
    id: BACKUP_ID, qty: 1, reason: 'Provides a backup path when the primary connection fails.'
  }];
  const base = calculateQuote(without, catalogue, profile);
  const backup = calculateQuote(withBackup, catalogue, profile);
  if (base.errors.length || backup.errors.length) return null;
  return { base, backup, without, withBackup };
}

export function outageEconomics(comparison, assumptions) {
  const { base, backup } = comparison;
  const monthlyPremium = backup.monthly - base.monthly;
  const setupPremium = backup.setup - base.setup;
  const yearlyPremium = 12 * monthlyPremium + setupPremium;
  const avoidedLossPerHour = assumptions.loss * assumptions.coverage / 100;
  const yearlyAvoidedLoss = 12 * assumptions.hours * avoidedLossPerHour;
  return {
    monthlyPremium, setupPremium, yearlyPremium, yearlyAvoidedLoss,
    yearlyNet: yearlyAvoidedLoss - yearlyPremium,
    breakEvenHours: avoidedLossPerHour > 0 ? yearlyPremium / 12 / avoidedLossPerHour : null
  };
}

export function labContext(items, catalogue, profile) {
  if (items.length) return { sample: false, comparison: resilienceComparison(items, catalogue, profile) };
  const clinic = { ...profile, type: 'clinic', sites: 1, employees: 5, tier: 1,
    budget: 3500, internet: 'fibre', priority: 'reliability', currentTools: '' };
  return { sample: true, comparison: resilienceComparison(recommend(clinic, catalogue), catalogue, clinic) };
}

export function decisionReceipt(context, assumptions) {
  const { comparison, sample } = context;
  const result = outageEconomics(comparison, assumptions);
  const bundle = quote => [
    ...quote.lines.map(line => `${line.product.product_name} × ${line.qty}`),
    `Monthly: ${money(quote.monthly)} | Setup: ${money(quote.setup)} | 12-month spend: ${money(quote.monthly * 12 + quote.setup)}`
  ].join('\n');
  return [
    'UDYAM SAATHI | RESILIENCE DECISION RECEIPT',
    sample ? 'Scenario: fictional five-person clinic' : 'Scenario: current bundle comparison',
    'Case catalogue starting prices. Taxes excluded.',
    '', 'PRIMARY ONLY', bundle(comparison.base),
    '', 'WITH BACKUP', bundle(comparison.backup),
    '', 'ASSUMPTIONS PER LOCATION',
    `Monthly outage hours: ${assumptions.hours}`,
    `Contribution lost per outage hour: ${money(assumptions.loss)}`,
    `Share of loss avoided by backup: ${assumptions.coverage}%`,
    '', 'FIRST-YEAR MODEL',
    `Backup premium: ${money(result.yearlyPremium)}`,
    `Estimated contribution protected: ${money(result.yearlyAvoidedLoss)}`,
    `Net benefit: ${money(result.yearlyNet)}`,
    `Break-even outage hours per month: ${result.breakEvenHours?.toFixed(2) ?? 'No break-even under these inputs'}`,
    '', 'Illustrative estimates. Backup coverage and serviceability require verification.'
  ].join('\n');
}
