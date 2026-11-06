# Case data

The CSVs in `source/` come from the competition's **Project Udyam Digital** data pack. All businesses, people, identifiers, documents and financial figures are fictional. They describe the case's fictional operator, **Accel Business**, not Airtel customers or Airtel performance.

| Source | Records | Used for |
| --- | ---: | --- |
| `source/product_catalogue.csv` | 25 | Product prices, setup fees, minimum contracts, eligibility and dependencies |
| `source/smb_leads.csv` | 5,000 | Funnel and segment analysis for Apr–Jun 2026 |
| `source/mock_gstin_registry.csv` | 3,534 | Mock business registration lookup and status checks |
| `source/mock_udyam_registry.csv` | 2,723 | Mock Udyam registration lookup |
| `../dist/data/kyc_documents/` | 47 images | Supplied specimen documents for 12 fictional applicants |

The browser reads JSON copies from `dist/data/`. Rebuild them after changing the CSVs:

```sh
python scripts/prepare-data.py
```

The script uses Python's standard library. Python is only needed to regenerate data, not to run the application.

## Conventions that matter

- GSTINs use a valid 15-character format and checksum, but the embedded PAN entity character is intentionally `X`. The prototype accepts that character for the synthetic fixtures.
- Udyam identifiers use district code `00`, which is part of the fictional fixture convention.
- Document age and expiry checks use **15 July 2026**, the case reference date, rather than the computer's current date.
- Catalogue prices have a minimum and maximum. The prototype quotes the minimum, labels it as a starting price and excludes taxes. Setup fees and per-product minimum contract lengths remain visible.
- Product dependencies are `|`-separated alternatives. Product availability by city tier is `;`-separated. Per-user and per-site pricing must be multiplied by the relevant quantity.
- A matching trade name alone does not uniquely identify a business: the dataset includes repeated names across states. Verification uses the full registration identifier; the default K03 sample pairs GST and Udyam records from Maharashtra.

## Baselines, not performance claims

The supplied funnel has 5,000 leads and 368 activations: **7.36%** conversion. Professional offices have 138 activations from 1,247 leads: **11.07%**. These are observations from the fictional dataset. The application has not demonstrated an uplift in real conversion or activation speed.

Specimen K03 is Ganesh Woodcraft, with GSTIN `27XUIXG0767D1ZP`. The sample-loading controls read the supplied registries and documents; they do not bypass validation. Other applicants include intentional exceptions that should require correction or human review.
