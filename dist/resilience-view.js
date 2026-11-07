import { money } from './engine.js';
import { outageEconomics, outageFields } from './resilience.js';

export function resilienceView(context, assumptions) {
  const intro = `<div class="page-heading">
    <div class="eyebrow">BUNDLE DECISION TOOL</div>
    <h1>Resilience Lab</h1>
    <p>What would a broadband outage cost your business?</p>
  </div>`;
  if (!context.comparison) return intro + `<section class="lab-card">
    <h2>This quote needs a different comparison</h2>
    <p>The lab compares one site with a single compatible fibre or leased-line connection. Your current quote is outside that scenario.</p>
    <button class="btn primary" data-action="nav-quote">Review my quote</button>
  </section>`;

  const { base, backup } = context.comparison;
  const result = outageEconomics(context.comparison, assumptions);
  const moneyRow = (label, first, second) =>
    `<tr><th scope="row">${label}</th><td>${money(first)}</td><td>${money(second)}</td></tr>`;
  const verdict = result.yearlyNet > 0 ? 'Backup pays off in this scenario'
    : result.yearlyNet < 0 ? 'Backup costs more than it protects' : 'Both options break even';
  const breakEven = result.breakEvenHours === null ? 'No break-even under these inputs'
    : `${result.breakEvenHours.toFixed(2)} outage hours per month to break even`;

  return intro + `<div class="lab-grid">
    <section class="lab-card">
      <div class="eyebrow">${context.sample ? 'FICTIONAL FIVE-PERSON CLINIC' : 'YOUR CURRENT QUOTE · ONE SITE'}</div>
      <h2>Compare the two bundles</h2>
      <p>Both options retain the rest of the bundle. Only the 4G/5G failover changes.</p>
      <table class="lab-comparison">
        <thead><tr><th scope="col">Case price</th><th scope="col">Primary only</th><th scope="col">With backup</th></tr></thead>
        <tbody>
          ${moneyRow('Monthly', base.monthly, backup.monthly)}
          ${moneyRow('Setup', base.setup, backup.setup)}
          ${moneyRow('First 12 months', base.monthly * 12 + base.setup, backup.monthly * 12 + backup.setup)}
        </tbody>
      </table>
      <small>Starting catalogue prices, excluding taxes. The comparison covers 12 months.</small>
      <form id="outage-form" class="lab-form">
        <h2>Set your assumptions</h2>
        <div class="lab-presets">
          <button type="button" class="btn secondary" data-action="lab-preset" data-hours="0.5">Quiet month · 0.5 h</button>
          <button type="button" class="btn secondary" data-action="lab-preset" data-hours="2">Disrupted month · 2 h</button>
        </div>
        ${outageFields.map(({ key, label, max, step }) => `
          <label for="lab-${key}">${label}</label>
          <input id="lab-${key}" name="${key}" type="number" required min="0" max="${max}" step="${step}" value="${assumptions[key]}">
        `).join('')}
        <button class="btn primary" type="submit">Run stress test</button>
      </form>
    </section>
    <section class="lab-card lab-result" aria-live="polite">
      <div class="eyebrow">FIRST-YEAR MODEL</div>
      <h2>${verdict}</h2>
      <dl>
        <div><dt>Estimated contribution protected</dt><dd>${money(result.yearlyAvoidedLoss)}</dd></div>
        <div><dt>Extra backup cost, including setup</dt><dd>${money(result.yearlyPremium)}</dd></div>
        <div class="lab-net"><dt>Net benefit</dt><dd>${money(result.yearlyNet)}</dd></div>
      </dl>
      <strong>${breakEven}</strong>
      <p>Protected contribution = outage hours × contribution lost per hour × share avoided × 12.</p>
      <p>Use contribution after variable costs. Check mobile coverage and whether backup can support your critical workflows before buying.</p>
      <button class="btn secondary" data-action="lab-download">Download decision receipt</button>
      ${context.sample ? '' : `<div class="lab-presets">
        <button class="btn secondary" data-action="lab-apply" data-choice="without">Use primary only</button>
        <button class="btn primary" data-action="lab-apply" data-choice="withBackup">Use backup bundle</button>
      </div>`}
    </section>
  </div>`;
}
