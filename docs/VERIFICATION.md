# Verification and review handoff

Updated 7 November 2026 for the Operational Excellence / ASF™ / Intelligent AI revision of Draft PR #1.

## Implemented

- Concise home: hero and two consistent enquiry CTAs, exactly six established capability cards, prominent ASF feature, short AI development introduction, approach and final enquiry.
- Services: five distinct groups for Lean & Operational Excellence, Digital Transformation, AI-Enabled Operations, AI & Intelligent Automation, and Capability Development. All established operational/digital service topics and existing external fragment targets retained.
- Eight AI offering disclosures cover agents, multi-agent orchestration, LLM applications/integration, knowledge assistants, voice, intelligent workflows/business automation, RAG and reporting/knowledge management. Each includes definition, business problem, potential benefit, illustrative use case, development status and categorized enquiry.
- ASF: stronger standalone page with business context, connected dimensions, existing seven-stage overview, preserved eight-item consulting delivery disclosure, illustrative applications and bounded future AI relationship.
- About: focused identity and differentiation; original philosophy/mission/vision retained. Other four content pages retain their useful content with shared AI footer links, asset cache versions and enquiry paths.
- Contact: exactly three radio choices, categorized preselection and an email-preparation form. Required-field, email-format and whitespace validation; encoded mailto plus copyable text. Preparing an email sends nothing. Existing direct email, phone, office map and FAQ retained. Non-JavaScript email-topic fallback remains usable.

## Checks and outcomes

| Check | Result |
| --- | --- |
| Static site validation | PASS: nine pages, 334 local links/assets/anchors, unique IDs, landmarks, metadata, sitemap XML |
| Product structure | PASS: exact six capability names, five service groups, three enquiry values and all eight categorized AI enquiry links |
| JavaScript syntax | PASS: assets/site.js and assets/enquiry.js |
| Whitespace | PASS: git diff --check |
| Build | Not applicable: preserved buildless static HTML/CSS/JS; preview package contains HTML and assets |
| Browser responsive sweep | PASS: all nine pages at 1440, 1024, 768, 375 and 320px; 45 page/width checks; no horizontal overflow, broken images or hidden enquiry initialization |
| Console | PASS: final corrected sweep captured no warnings or errors |
| Enquiry validation | PASS: empty input, whitespace-only required name and malformed email do not prepare a message |
| Email preparation | PASS: valid input produces an encoded mailto and copyable text; no send action was taken |
| AI category links | PASS: all eight service identifiers preselect Digital & AI and the correct offering label |
| Category changes | PASS: switching to ASF clears the previous prepared message and unrelated service label |
| Unknown parameters | PASS: prototype-like and markup-like query values are ignored; no category is falsely selected |

An initialization bug on the empty-category path was found during development, corrected, and rechecked in the final clean-console sweep. Cache versions were added to shared assets to avoid stale styling/script behavior in returning review browsers.

## Publication and limits

The shareable review site is a separate copy at `https://leanova-pr1-review.dreamypixie4096.chatgpt.site`. Its hosting/source is separate from the company production domain. The release marker is stored only in the preview copy and identifies the PR commit used for publication. The original site CNAME and deployment configuration are unchanged.

No production merge/deployment, real model analysis, document upload, enquiry email send or phone call is part of verification. The Google Maps embed is third-party; a direct map link remains available. Browser checks are not a full WCAG conformance audit, screen-reader certification or all-browser/device certification.

No authenticated ASF workspace or contact delivery backend was connected. Owner confirmation remains required for AI commercial scope/readiness, assistant/RAG offering status, multi-agent responsibilities, voice production controls and definitive ASF terminology. See `docs/OFFERING-STATUS.md` for source evidence. No new client implementation, product availability, accuracy figure or performance result is claimed.

## Files in this revision

Main content: `index.html`, `services.html`, `asf.html`, `about.html`, `contact.html`.
Shared navigation paths/footer/asset cache versions: also `industries.html`, `training.html`, `case-studies.html`, `insights.html`.
Behavior/design/checks: `assets/site.css`, new `assets/enquiry.js`, `scripts/check_site.py`.
Handoff: `README.md`, `docs/OFFERING-STATUS.md`, `docs/VERIFICATION.md` and audit update.
