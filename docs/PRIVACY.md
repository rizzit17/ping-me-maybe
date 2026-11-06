# Privacy and security choices
**Team:** Ping Me Maybe · **Prototype:** Udyam Saathi · **Case:** Project Udyam Digital

## Purpose and minimum data
The prototype demonstrates business bundle discovery and onboarding using the supplied fictional Accel Business dataset. Discovery needs business type, team size, number of locations, city, budget and connectivity preferences. It does not need government identifiers. Registration lookup and document handling occur only after a separate, purpose-specific consent checkbox. Refusing consent leaves discovery and quoting available.

## Processing and storage
The product catalogue and mock registries are static synthetic case files. Uploaded images are read with Tesseract.js in a browser worker. Images, extracted fields, consent and entered registry identifiers remain in this tab's memory. They are not sent to the application server, the optional language model, or an analytics provider. Public CDN requests load OCR software and language files; Google Fonts provides typography. These providers see normal request metadata, not the documents processed by the worker.

Non-identifying preferences and demo order line items use tab-scoped session storage. No document image, registry identifier, signatory name or address is written to session storage or application logs. Reload clears the KYC session; a visible “Clear all session data” action clears the stored preferences and order too. Removing a document revokes its browser object URL. Withdrawing consent clears verification results, registry inputs and images; outstanding OCR results are discarded.

## Advisor separation
The default, labelled guided advisor works locally with rules. When the local server has an API credential, the live advisor sends the owner's message and basic business preferences to the configured AI provider. The interface explicitly asks owners not to put identifiers or document contents into chat. No KYC document context is attached automatically. Credentials stay in server environment variables; `.env` is ignored by Git. Static hosting has no live GenAI backend by default.

## Validation and human review
Quotes use deterministic catalogue rules, not generated prices. GSTIN structure/checksum, mock registration status, document field extraction, the 90-day address-proof window, ID expiry, and registration/document business-name matching are checked. Ambiguous OCR requires image review and field confirmation. These are prototype controls, not proof of government authenticity, identity, consent capacity, statutory telecom KYC or DPDP compliance. Real deployment would require an authorised verification provider, serviceability checks, an approved retention schedule, access controls, encryption, audit logs and a documented process for deletion and support.

## Transparency and user control
Verification results mask identifiers. The order flow collects no payment and performs no real provisioning. Tracker transitions require a visible “Simulate” control. Requests for human help enter a local demo queue and do not contact a third party. The owner can inspect and change the bundle before proceeding. The case's fixed **15 July 2026** date is used for synthetic document checks and is disclosed in the KYC interface.
