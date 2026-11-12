# Leanova complete redesign — 12 November 2026

## Isolation

Repository: `hkaiverse-ai/los-website`. Branch: `codex/leanova-complete-redesign-2026-11-12`, based on main commit `f14915e5e7a7e7de17f5108b495ff12e45f55431`.

No main-branch changes, merge, DNS changes, GitHub Pages configuration changes or edits to existing Sites were made. CNAME is retained unchanged. Existing production and supplied archive URLs returned HTTP 200 during verification.

## Inspection and implementation

Inspected the nine-page static HTML/CSS source, available assets, supplied archive homepage and previous redesign documentation in `feat/leanova-enterprise-experience`, including offering status, business identity, owner approvals and website review. The prior design repeated long topic lists, lacked an approved founder biography, used inconsistent company details across versions and had no enquiry delivery endpoint. The old case-study surface contained unpublished content. No founder photo or official ASF diagram artwork was found.

Implemented a responsive dark navy, gold and warm neutral design with no animation dependencies, external font requests or framework runtime. Five primary destinations: Home, Services, Capabilities, About and Contact. ASF, industries and training remain accessible in the footer. All original HTML filenames remain available in this branch. Resources and internal work pages contain useful links and accurate status descriptions rather than invented articles or client outcomes.

Services contain compact challenge / how-we-help descriptions with enquiry CTAs. Capabilities separate internal pilots, development work and scope-to-confirm areas. Factory Records Digitisation is retained within the source-supported digital offering. AI Voice Agents remains an internal pilot. HKAIVERSE is a related venture, distinct from core consulting and client work. ASF uses the documented nine pillar names, not an invented official diagram.

The latest user brief is the authority for founder name, title, 30+ years, career history, qualifications, contact details, registered address and social links. Prior conflicting details were superseded. Career organisations are explicitly not presented as Leanova clients. No testimonials, customer logos, savings or project results were invented.

## Contact delivery: incomplete dependency

There is no verified contact submission API in the existing frontend or inspected backend information. The source-supported email preparation behavior has been retained with validation, encoded mailto/Gmail/Outlook/WhatsApp links, copy controls and a no-default-email-app explanation. It explicitly does not submit automatically and makes no delivery claim.

**This does not yet meet the requested automatic form delivery requirement.** The owner has been asked for an approved delivery provider or endpoint. Configure and test actual inbox receipt before describing direct submission as complete. Do not put delivery API keys in browser code. No test email or WhatsApp message was sent during frontend testing.

## SEO and privacy

Unique titles/descriptions, one H1 per page, heading hierarchy, canonical URLs, Organization structured data, local assets and a well-formed XML sitemap were added. The separate review is deliberately `noindex`; robots.txt blocks indexing. Before an approved production release, review policy text and change preview indexing controls to production rules. No ranking or legal-compliance guarantee is made.

## Validation results

| Check | Result |
| --- | --- |
| HTML inventory, metadata, legal details, IDs, image alt text, form labels | PASS across 12 pages |
| Internal links, fragments and asset references | PASS: 308 checked |
| XML sitemap parsing | PASS |
| JavaScript syntax | PASS: `node --check assets/site.js` |
| Browser layout | PASS: all 12 pages at 390 × 844, 768 × 1024 and 1440 × 960; no horizontal overflow |
| Visual review | Homepage desktop/mobile, tablet venture section and desktop founder profile inspected |
| Mobile navigation | PASS: menu expands and Contact navigation reaches enquiry |
| Form validation | PASS: all five empty fields rejected |
| Valid enquiry | PASS: multiline content and ampersands encoded into all four channel links with official destination |
| Copy enquiry | PASS: browser clipboard reported copied |
| Editing after preparing | PASS: stale prepared result hidden |
| Existing HKAIVERSE image | PASS: loaded at natural width 1156px after lazy-load activation |
| Browser console | No warnings/errors observed during the page sweeps |
| Email and phone | Correct mailto and tel targets verified; email-app availability, call completion and mailbox receipt not verified |
| WhatsApp | HTTP 200; redirect preserves phone 919491887419; no message sent and account monitoring not verified |
| Instagram, HKAIVERSE and ASF application | HTTP 200 at configured URLs; no sign-in or application analysis performed |
| LinkedIn | Exact user-provided URL present; automated HTTP verification blocked with 403 |
| Production + original archive | Both HTTP 200; no write or deployment actions performed against either |
| Loading footprint | CSS ~14 KB and JS ~4 KB uncompressed; no external fonts or framework runtime. No Lighthouse or real-user performance score measured |

Run the static checks from this repository using `python docs/check_redesign.py`.

## Still needed

1. Approved enquiry delivery provider / endpoint and successful receipt test at info@leanovaopexsolutions.com.
2. Founder photograph with permission to publish.
3. Official ASF nine-pillar diagram artwork, if available.
4. Review of policy text before production use.
5. Commercial-readiness confirmation before changing AI capability status labels.

Publication of the incomplete-form design review is awaiting the owner's choice. A distinct unpublished Site was registered for this purpose; existing review links were not reused.

## Logo follow-up

Added the original repository asset `assets/leanova-logo.png` to the header and footer on all 12 pages. Preserved its aspect ratio and added meaningful alt text. Browser verification confirmed both instances load and no horizontal overflow occurs at desktop and mobile widths.

## Simple improvements after reference review

Before edits, saved and integrity-checked `outputs/Leanova-before-simple-improvements-2026-11-12.zip`, copied from the clean hosting checkout at published source commit f7246b713b213551da406bf665897451304472dc. Hosted Version 1 also remains saved for rollback.

Replaced the generic technology homepage section with one clearly labelled illustrative factory-records example; changed the existing principles into a concise four-step process; added four native expandable FAQs and a WhatsApp link beside the closing CTA. Kept the company positioning, official logo and other pages. No maintenance service, outcome statistics or new commercial availability claim was added.

Validation: static check passed with 309 internal links/assets; FAQ controls opened all four answers; homepage had no horizontal overflow at 390px, 768px and 1440px; four process steps and correct WhatsApp destination confirmed; no console warnings/errors observed. Direct enquiry delivery remains unconfigured and honestly labelled. The user authorised updating the same review URL after preserving a copy.
