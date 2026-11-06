# Verification evidence

- `live-advisor.json`: real Gemini responses to fictional profiles in English, Hindi and Tamil. Contains no API credential or personal document data.
- `../case-metrics.json`: reproducible overall and professional-office baselines, with the pilot assumption scenario clearly separated.
- `../../tests/fixtures/kyc-ocr.json`: real Tesseract OCR output for all 47 supplied student specimen images, covering 12 applicants. These are synthetic fixtures, not a judges' answer key.

The 41 automated tests cover catalogue/quote rules, integration contracts and key fixture regressions. Browser checks exercised dependency blocking, consent, sample document extraction and confirmation, demo checkout, partner help and live Gemini replies. Processing every specimen is not a claim of perfect OCR or production-grade identity verification.

Unclear images, failed checksums, registration discrepancies, expired/stale documents or missing authority should require correction or manual review. Legal compliance, operator serviceability and real activation require authorised integrations beyond this prototype.
