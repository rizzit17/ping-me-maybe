# Three-minute demo guide

Keep the recording focused on one complete journey. Load the OCR engine before recording so the first language-model download does not interrupt the demonstration.

| Time | Screen | What to show |
| --- | --- | --- |
| 0:00–0:20 | Overview | Introduce the problem: too many products, unclear pricing and slow onboarding for small businesses. |
| 0:20–0:55 | Advisor | Enter the five-person Delhi clinic example from the README. Show that business details remain editable; briefly switch the advisor to Hindi. |
| 0:55–1:25 | Bundle | Show the ₹3,118 monthly price, ₹1,500 setup fee and individual contract terms. Change a quantity to demonstrate that the quote recalculates. |
| 1:25–2:20 | Verification | Give consent, load the supplied K03 registry and documents, and confirm the OCR fields against the original images. Clearly identify K03 as a separate fictional document fixture. |
| 2:20–2:40 | Order tracker | Submit the demo order, show the stages and advance one explicitly labelled simulated step. |
| 2:40–3:00 | Partner workspace | Add a request to the local partner queue. Explain how human help handles exceptions, then close with the professional-office pilot rationale. |

## Useful exception demonstrations

- Remove a connection while keeping a dependent product: the quote should block checkout.
- Select a GST-required product without declaring a GSTIN: the catalogue should explain the requirement.
- Enter a cancelled or suspended GSTIN from the supplied mock registry: verification should fail.
- Review address proof older than 90 days or an expired ID: the document needs correction or human review.
- Submit documents for a different registered business: the business-name checks should flag the mismatch.
- Withdraw KYC consent: entered identifiers, verification results and uploaded documents should clear.

Keep exception footage separate if showing it would exceed the three-minute limit. Do not describe guided mode as live GenAI, or simulated tracker steps as actual service activation. Catalogue prices and observed funnel results are synthetic case data.

## Prepared video

The final MP4 is in `submission/`. It is an approximately 2 minute 51 second narrated walkthrough assembled from verified application screenshots with Windows SAPI narration. The advisor screenshot shows a real Gemini response. This is not a continuous screen recording. See `demo-metadata.json` beside the video for the measured scene duration.
