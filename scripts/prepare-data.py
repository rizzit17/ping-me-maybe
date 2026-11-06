"""Regenerate browser data from the original, fictional competition CSVs.

Run from any directory: python scripts/prepare-data.py
Requires Python 3.9+ and the standard library only.
The supplied specimen PNGs are tracked separately in dist/data/kyc_documents/.
"""
import collections
import csv
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "data" / "source"
OUTPUT = ROOT / "dist" / "data"


def read_rows(name):
    with (SOURCE / f"{name}.csv").open(encoding="utf-8-sig", newline="") as handle:
        return list(csv.DictReader(handle))


def write_json(name, value, compact=False):
    options = {"ensure_ascii": False}
    if compact:
        options["separators"] = (",", ":")
    (OUTPUT / f"{name}.json").write_text(json.dumps(value, **options), encoding="utf-8")


def main():
    OUTPUT.mkdir(parents=True, exist_ok=True)
    for name in ("product_catalogue", "mock_gstin_registry", "mock_udyam_registry"):
        write_json(name, read_rows(name), compact=True)

    leads = read_rows("smb_leads")
    segments = []
    for name in sorted({row["segment"] for row in leads}):
        members = [row for row in leads if row["segment"] == name]
        activated = sum(row["outcome"] == "Activated" for row in members)
        segments.append({
            "name": name,
            "leads": len(members),
            "activated": activated,
            "conversion": round(activated / len(members) * 100, 2),
        })

    drop_reasons = collections.Counter(row["drop_reason"] for row in leads if row["drop_reason"])
    write_json("insights", {
        "leads": len(leads),
        "activations": sum(row["outcome"] == "Activated" for row in leads),
        "segments": segments,
        "dropReasons": drop_reasons.most_common(8),
        "source": "Supplied synthetic Apr–Jun 2026 dataset; not Airtel customer data.",
    })
    print(f"Prepared catalogue, mock registries and insights from {len(leads):,} fictional leads.")


if __name__ == "__main__":
    main()
