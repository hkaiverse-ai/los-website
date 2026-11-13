# Information and approvals needed from the company owner — 11 November 2026

Website v3 (Draft PR #1). Everything below is either **missing**, **conflicting between sources**, or **built but held for approval**. Nothing here was guessed on the website.

## A. Sources used

| Source | Where | Used for |
|---|---|---|
| MCA Certificate of Incorporation (12 Aug 2026) | `hkaiverse-ai/leanova-cango-caves-website` @ `codex/cango-caves-website`, `cango-tender/Leanova-certificate-of-incorporation.pdf` | Legal name, CIN U62099TS2026PTC221079, registered address with PIN, incorporation date |
| ASF Final Nine Pillar Architecture v3.0 (8 Aug 2026, "Pillars final and closed") | `hkaiverse-ai/los-asf-backend` @ `main`, `reference/ASF_Final_Nine_Pillar_Architecture_v3.docx`; same names in `src/asf/framework/data/pillars.yaml` | Nine pillar names and short descriptions; mandatory "not an ISO standard" caveat |
| Earlier owner-supplied corrections | `docs/BUSINESS-IDENTITY-REVIEW.md` | contact@ email, LinkedIn company URL, CEO role |
| Owner brief (this request) | — | Homepage heading, service structure, founder name spelling |

## B. Missing — please supply

| # | Item | Website state now |
|---|---|---|
| 1 | **Founder photograph** | Initials placeholder on About and Articles |
| 2 | **Founder biography**: approved introduction, designation (Founder / Director / CEO), sectors, years of experience, expertise | Short neutral line + "Profile awaiting approval" box listing what is needed |
| 3 | **Certifications / qualifications** with issuing bodies (an old unverified profile template mentions "M.Tech, LSS MBB, 30+ years, ZED Consultant, Lead Auditor" — **not used**; please confirm or correct) | None shown |
| 4 | **Leadership philosophy** in his own words | Company philosophy only |
| 5 | **Team**: names, roles, photos and consent | "Awaiting team details" box. No team members shown |
| 6 | **Official ASF nine-pillar diagram** (artwork) | Pillars shown as a text list from the v3.0 document, captioned as such |
| 7 | **HK Verslo official case-study document** + written permission to name the client | **Not on the website.** No document exists in any company repository (only an empty slot in an archive branch). Please send the document |
| 8 | **Verified project results** (any client) | "No client case studies published yet". Template ready: `docs/templates/` |
| 9 | **Industry experience**: which sectors Leanova has actually worked in | Three proposed industry pages built, marked "awaiting approval" and `noindex` (hidden from Google) |
| 10 | **WhatsApp number** | Fully built but **switched off**. Set `whatsapp` in `scripts/layout.py` (digits only, e.g. `919491887419`) and run `python scripts/layout.py`. This turns on the floating button, header/footer links and "Send on WhatsApp" |
| 11 | **Genuine testimonials** with written permission | Empty "Testimonials" section |
| 12 | **Google account access** (Search Console, Business Profile) | Not used. See `docs/COMPANY-PROFILE-KIT.md` |
| 13 | **Approved legal text** for Privacy Policy and Terms & Conditions | Both pages carry a visible "Draft for company & legal review" notice |

## C. Conflicts — please decide

| Item | Values found | Website uses |
|---|---|---|
| **Phone** | +91 94918 87419 (current site) · **+91 63095 86954** (primary in tender drafts) · "+9194991887419" (tender, likely a typo) | +91 94918 87419. Please confirm the official number and which one is on WhatsApp |
| **Email** | contact@leanovaopexsolutions.com (owner-supplied) · info@ (tender drafts, old site) | contact@. Confirm the mailbox is monitored |
| **Address district** | MCA certificate: "…Ameenpur, Ramachandrapuram, **Medak** – 502032, Telangana" · internal notes say district is disputed (Medak vs Sangareddy) | MCA wording exactly. Confirm before Google Business Profile |
| **Founder name spelling** | "Vijaya Sekhar Danaboyina" (this brief) · "Vijay Sekhar Danaboyina" (LinkedIn, tender form) · "D Vijaya Sekhar" | "Vijaya Sekhar Danaboyina". Confirm official spelling |
| **ASF terminology** | v3.0 nine pillars (frozen, Aug 2026) · site's older 7-stage overview / 8-step delivery · older archive "eight layers" / "six domains" | Nine pillars added as the architecture; 7-stage/8-step kept as "how we apply it". Confirm whether to retire the 7-stage wording |
| **Company age** | Incorporated 12 Aug 2026 | About says "incorporated in August 2026". Founder experience predates the company and should be stated in his profile |

## D. Built and held for approval

- **Initial assessment offer**: "Initial Plant Walk & Waste Assessment" shown as *proposed, not yet an offer* on Contact. Confirm: free or paid, duration, locations covered, what the visitor receives. Alternative name offered in the brief: "Adaptation Diagnostic".
- **Industry pages** (`industry-auto-engineering.html`, `industry-pharma-process.html`, `industry-msme-manufacturing.html`): approve, edit or remove. Then remove `noindex` and run `python scripts/layout.py` to add them to the sitemap.
- **Articles**: hub ready; first article topics in `docs/templates/ARTICLE-TEMPLATE.md`. Nothing is published under a consultant's name.
- **HKAIVERSE**: kept as related venture linking to https://app.hkaiverse.ai/practice (verified 200). Main site is https://hkaiverse.ai. Confirm which destination you prefer.

## E. External actions not taken

No Google Business Profile, Search Console, LinkedIn, IndiaMART, Justdial or ads changes. No production deployment and no merge. The production site (`main` → GitHub Pages) is unchanged.

## F. Simplification pass (12 November 2026)

Changes made on request: the homepage heading no longer says "in India". Navigation is now Home · About Us · Services · ASF™ · Training · Case Studies · Contact, plus **Talk to Our Experts**. The three enquiry options appear on the homepage and as Step 1 of the Contact form. `lean-training.html` was merged into `training.html`, and `insights.html` into `articles.html`. Removed: the homepage problem grid, industries, "why us" and work sections; About vision/mission/philosophy and team placeholder; the Contact FAQ, guidance block and assessment proposal; Case Studies statistics and testimonials sections; and the per-service deliverables, industry and long tool lists.

Still needed in addition to section B:
- **WhatsApp number**: still not verified, so no WhatsApp button is shown. Set it in `scripts/layout.py` to enable the button everywhere.
- **Other social profiles** (Facebook, Instagram, YouTube, X): only LinkedIn is verified, so only LinkedIn appears in the footer. Send any other official URLs.
- **Initial Plant Walk / Adaptation Diagnostic**: removed from Contact until the offer is confirmed.
- **Digital & AI Capabilities page** (`capabilities.html`) was not shortened in this pass; it is linked from the footer and Services. Recommend a separate trim once AI offering status is confirmed.
