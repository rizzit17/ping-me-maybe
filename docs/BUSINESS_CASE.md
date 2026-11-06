# Udyam Saathi: pilot business case

**Team:** Ping Me Maybe  
**Campus:** Vellore Institute of Technology, Vellore  
**Competition:** Airtel Sync 2026, Digital Track

## Customer and initial segment

Start with professional offices in two pilot cities: clinics, CA firms and coaching centres with one location and small teams. Their recurring need is reliable internet plus productivity and device security. The supplied synthetic quarter contains 138 activations from 1,247 professional-office leads (11.07%), compared with 110 from 2,709 micro-retail leads (4.06%). Professional offices also have enough lead volume to learn from exceptions. Manufacturers have higher observed conversion but only 289 leads and more complex installations. These observations guide a pilot; they do not prove segment selection causes conversion gains.

Keep field partners involved in serviceability confirmation, installation and document exceptions. Digital-origin leads should retain an attributed partner owner. Pilot partner compensation should reward completed, retained activations rather than encouraging unnecessary add-ons. Commission amounts require operator agreement and are not included as a claimed saving.

## Value and pricing

The owner gets a single itemised quote and one place to follow onboarding. For a five-person, one-site clinic, the case catalogue produces a starting bundle of INR 3,118/month: fibre 300 (1,499), backup failover (499), five email users (625) and five protected devices (495). Setup is INR 1,500, giving INR 4,618 before taxes for the first month plus setup. Each product in this example has a 12-month minimum. No invented discount or universal contract is applied. The interface excludes already-held productivity/security tools when the owner declares them.

Do not claim instant physical activation. The selected catalogue products have a longest typical installation time of five days, subject to actual serviceability and an installer slot. The measured case average of 17.6 days includes the entire lead-to-activation journey.

## Competitive analysis

See [COMPETITIVE_ANALYSIS.md](COMPETITIVE_ANALYSIS.md). Integrated bundles and digital advisory already exist. The pilot hypothesis is that explainable multilingual discovery, rule-checked quotes, local document extraction and a visible partner handoff improve completion and owner understanding. Competitor end-to-end KYC speed and conversion have not been independently tested.

## Ninety-day rollout

1. **Days 1-30:** Confirm approved operator/identity integrations and data-handling requirements. Validate catalogue rules and serviceability. Train partners, define attribution and instrument each funnel stage. Complete an accessibility review with Hindi/Tamil speakers.
2. **Days 31-60:** Recruit professional offices in two cities. Use assisted onboarding while documenting OCR corrections, abandoned quotes and support requests. Compare like-for-like cohorts rather than aggregating different business types.
3. **Days 61-90:** Review a planned 1,000 comparable professional-office leads against a comparable control journey. Track conversion, full acquisition cost, activation time and follow-up calls. Expand only if targets and exception handling hold. Determine sample size and power before an operator experiment; 1,000 leads alone does not guarantee statistical significance.

Assign one analytics owner to immutable funnel events, one operations owner to installer handoffs and one privacy owner to consent/retention review. The prototype's local partner queue demonstrates ownership, not a production CRM.

## Economics: explicitly an assumption scenario

The synthetic dataset has INR 5,539,640 acquisition cost across 5,000 leads and 368 activations. Therefore acquisition cost per lead is INR 1,107.928 and blended CAC is INR 15,053.37.

The pilot targets professional offices, so its cost comparison uses that segment rather than the blended baseline. Those 1,247 leads cost INR 1,475,870 and produced 138 activations: INR 1,183.5365 per lead and INR 10,694.71 per activation.

For 1,000 comparable office leads, assume the same acquisition spend per lead, INR 20 incremental digital cost per lead, and 15% conversion:

```text
Acquisition spend = 1,000 × INR 1,183.5365 = INR 1,183,536.49
Incremental digital spend = 1,000 × INR 20 = INR 20,000
Activations = 1,000 × 15% = 150
Modelled CAC = INR 1,203,536.49 / 150 = INR 8,023.58
Reduction from professional-office case CAC = 24.98%
```

This holds acquisition spend per lead constant and assumes conversion changes. It does not establish a causal saving or include unestimated implementation costs. Track all costs and partner commissions before making an ROI claim. At the proposed INR 9,000 CAC ceiling, a clinic paying INR 3,118/month would need about 8.2 months to recover CAC **if** gross contribution were 35%. The margin is an illustration, not supplied operator economics. Tax, setup revenue, churn and support costs would change payback.

## Five success measures

| Metric | Professional-office baseline | Proposed target | Definition and review |
| --- | ---: | ---: | --- |
| Lead-to-activation | 11.07% | 15% | Activated / all comparable pilot leads; quarterly cohort |
| Mean lead-to-activation time | 16.92 days | ≤ 10 days | Calendar days, same inclusion rules and serviceability mix |
| Acquisition cost | INR 10,695 | ≤ INR 9,000 | All marketing, field/channel, digital and onboarding costs / activations |
| Follow-up calls | 3.07 | ≤ 1.5 | Mean customer status-chasing calls per activated business |
| Six-month churn | 13.77% | ≤ 12% | Churned / activated cohort; review after six months, beyond the 90-day pilot |

Targets are hypotheses. Report segment, channel, language and city mix so changes in the lead population cannot masquerade as product impact. Monitor exception rates and privacy incidents as release gates, not additional success claims.

## Risks and practical controls

| Risk | Control and owner |
| --- | --- |
| Generated prices or unsuitable products | Deterministic catalogue engine; engineering owns eligibility and quote tests |
| OCR errors, identity mismatch or forged documents | Field confirmation and conservative manual review; authorised KYC provider required before production |
| Serviceability and installation delays | Operator availability check, installer confirmation and realistic status updates; operations owns dates |
| Digital journey bypasses partners | Shared lead ownership, assisted completion and retained-activation incentives; channel operations owns attribution |
| Free-tier AI limits or provider outage | Visible guided fallback; key stays server-side; do not imply guided responses are generated |
| Privacy or retention failure | Purpose-specific consent, minimal data, separate document/AI paths and an approved production retention schedule |

## Evidence

Baselines and prices derive from the supplied CSVs in `data/source/`. [The preparation script](../scripts/prepare-data.py) reproduces browser JSON; the application tests check quote rules. [The privacy note](PRIVACY.md) describes prototype controls and required production gates. No private judges-only material was used.
