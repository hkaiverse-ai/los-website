# Leanova website review, redesign and ASF investigation — 10 November 2026

Branch `feat/leanova-website-v2`, stacked on Draft PR #1 (`feat/leanova-enterprise-experience`). The live site at leanovaopexsolutions.com is still served from `main` and was **not** changed. No DNS, hosting, backend or credential change was made.

## 0. What was found before starting

| Item | Finding |
|---|---|
| Repository | `hkaiverse-ai/los-website`: buildless static HTML/CSS/JS, deployed by GitHub Pages (`CNAME` = leanovaopexsolutions.com). No framework, package manifest or CI. |
| Live site | Same as `main` (commit `f14915e`): 9 pages. It still shows **"PLACEHOLDER — NOT PUBLISHED COPY"** on Case Studies, uses `info@` (collateral uses `contact@`), and has no robots.txt or sitemap (both return 404). |
| Prototype (rocky-elk) | Dark/gold design; adds web-development and marketing services, links a public `Leanova-Website-Source.zip` and `TEAMMATE-README.txt`, and uses `info@`. |
| PR #1 review (dreamypixie) | Draft PR #1, not merged. Fixes most content, contact, policy and SEO foundations. 17 pages. This work builds on it rather than redoing it. |

## 1. Website audit

| Area | Current situation (live / PR #1) | Identified problem | Recommended improvement (status) | Priority |
|---|---|---|---|---|
| Case Studies | Live: visible "PLACEHOLDER — NOT PUBLISHED COPY"; generic results | Damages credibility; implies results without evidence | Removed in PR #1. v2 adds a four-label system (verified / capability demo / illustrative / sample) on every item, plus an ASF Analysis capability demonstration. **Done** | Critical |
| Services vs Capabilities | PR #1 Services page mixed consulting services with 8 AI offerings; homepage called services "core capabilities" | Same content in two concepts; visitors can't tell what is sold from what is technically possible | New `capabilities.html`; AI/agent/LLM/voice content moved there; Services keeps only offerings, with a pointer. Checker enforces no duplication. **Done** | High |
| Navigation | Live: 7 items, no Case Studies/Insights; PR #1: "Our Work", "Training", "Contact Us" | Missing Capabilities/Insights; inconsistent labels | Home · About · Services · Capabilities · Industries · ASF · Case Studies · Insights · **Discuss Your Process**. Training sits under Services. **Done** | High |
| CTAs | "Talk to Our Experts", "Contact Us", "Send Us an Email", "Explore Our Services" lead to different experiences | Confusing; bare mailto button opens an app chooser on Android/Windows | One enquiry label ("Discuss Your Process") → contact form. Bare mailto button replaced with **Copy email address**, Gmail and Outlook web-compose links. **Done** | High |
| Email "Open Email Application" | `mailto:` with no handler; choosing Chrome shows nothing | Chrome isn't a mail client, so nothing can open | Root cause explained in §8. Fallbacks: visible address, copy button, webmail compose, copyable prepared enquiry. **Done** | High |
| Homepage | PR #1: hero, 6 cards, ASF, AI intro, HKAIVERSE, approach | No business-problem framing, industries, work, or "why us"; AI looked like a separate business | Adds two connected dimensions (Operations + Technology), 6 named business problems with links to the relevant service, capabilities/HK AI Works, labelled work, industries, why Leanova, one CTA. **Done** | High |
| Service pages | 6 pages: problem, approach, measures | Missing who it's for, deliverables, FAQ | Added "Who it is for", "Typical deliverables" (agreed per engagement) and 4 FAQs to each. **Done** | Medium |
| ASF | Methodology page + link to the app | No public demo; nothing explains what the app outputs | Verified facts panel (inputs, outputs, access) + offline, clearly labelled sample report. **Done** | High |
| HK AI Works | Not on site | Requested initiative was missing | Capabilities section (status: in development) and homepage mention. Relationship needs confirming (§12). **Done** | Medium |
| HKAIVERSE Capability Studio | PR #1 homepage feature and Case Studies section | Fine | Kept. Also linked from Capabilities "Where you can see it". | — |
| Leadership | PR #1 CEO section on About | Out of scope (management handling) | **Not touched.** | — |
| Footer | 3 columns, mixed service/AI links | No Capabilities column | 4 columns: Services, Capabilities, Company, Connect. Legal name, address, phone, email, LinkedIn, policies. | Medium |
| WhatsApp | None on live, PR #1 or v2 | Requested in brief | **Not added.** Whether +91 94918 87419 is a monitored WhatsApp Business number is unconfirmed. Once confirmed, add `https://wa.me/919491887419`. | Medium |
| Contact delivery | No backend; mailto/webmail drafts only | Prospects must send the email themselves | Kept honest (no fake success). A real form needs a backend (§8). | Future |
| Insights | Topic list, no articles | Thin content | Left as is. Needs real articles from the team (§12). | Medium |
| SEO | Live: no robots/sitemap/canonical | Indexing gaps | PR #1 adds robots, sitemap, canonicals, JSON-LD. v2 adds the Capabilities page and better titles for Case Studies and Insights. | High |
| Mobile | PR #1 disclosure menu at 58rem | With 9 nav items, labels wrapped onto two lines on laptops | `white-space:nowrap`; tagline hidden below 90rem; verified in QA. **Done** | Medium |

## 2. Benchmarking (Capgemini, Accenture, Deloitte, McKinsey, Infosys)

Automated retrieval worked for Capgemini (sections: Highlights, Latest insights, Recent client stories, Latest news) and Deloitte. Accenture, McKinsey and Infosys blocked automated requests (403 or no response). So this is a pattern-level review based on their well-known public structure. No content, layout or assets were copied.

| Pattern | Seen on | Suitable for Leanova? | How applied |
|---|---|---|---|
| Separate *what we do* (services/industries) from *how/what we bring* (capabilities, technology) | All five | Yes | Services vs Capabilities pages |
| Problem-led entry ("what are you trying to solve?") | Accenture, McKinsey | Yes, it fits manufacturing buyers | Homepage "Does any of this sound familiar?" |
| Client stories as the main proof | Capgemini, Infosys, Accenture | Yes, **but only verified ones** | Labelled work; no unverified stories |
| Insights hub driving organic search | All five | Yes, once real articles exist | Insights kept; articles requested |
| Single consistent enquiry CTA | Deloitte, McKinsey | Yes | "Discuss Your Process" everywhere |
| Huge mega-menus, global office selectors, investor sections | All five | **No.** That's scale Leanova doesn't have | Flat 9-item nav |
| Heavy video heroes, stock photography, big numbers ("500,000 people") | Accenture, Infosys | **No.** Leanova has no verified stats yet | Restrained hero; no invented numbers |

**Direction:** Keep the existing charcoal and gold identity. Use a quiet enterprise layout with clear hierarchy, problem-led copy and honest status labels. Credibility comes from specificity and transparency rather than scale claims.

## 3. Sitemap

```
Home
├── About Us (company, approach, CEO, philosophy, vision, mission)
├── Services
│   ├── Lean Manufacturing Consulting
│   ├── Lean Six Sigma Consulting
│   ├── Operational Excellence Consulting
│   ├── MSME Lean Consulting
│   ├── Productivity Improvement Consulting
│   ├── Quality & Process Excellence · Supply Chain & Flow   (sections)
│   ├── Digital Transformation & Factory Records              (section)
│   └── Training (Corporate Lean Training page + training catalogue)
├── Capabilities
│   ├── A Process, data & integration
│   ├── B AI & machine learning for operations
│   ├── C AI agents, LLM, voice & intelligent automation (8 offerings, status-labelled)
│   ├── HK AI Works
│   └── Where you can see it → ASF Analysis, HKAIVERSE
├── Industries (Manufacturing, Services, MSMEs)
├── ASF™ (framework, stages, ASF Analysis facts, public sample report)
├── Case Studies (labelled: demonstrations, illustrative examples, HKAIVERSE related venture)
├── Insights
├── Contact / Discuss Your Process (enquiry form → reviewable email, FAQ)
└── Privacy Policy · Terms of Use
External: ASF Analysis app (api.leanovaopexsolutions.com/asf) · HKAIVERSE (app.hkaiverse.ai/practice)
```

Marketing services were **not** published (scope and approval not confirmed).

## 6. ASF investigation (verified 10 Nov 2026, read-only, no key used)

| Question | Verified answer |
|---|---|
| API or web page? | Both. `GET /asf` (and `/`) returns an **HTML application**, "ASF Analysis — Leanova OPEX Solutions" (86 KB, strict CSP, `X-Frame-Options: DENY`). The API lives under `/api/asf/*`. |
| Reachable? | Yes. `/health` → `{"status":"ok"}`, `/ready` → `{"status":"ready"}`. So a model *is* configured now; the backend README's "no real model" note is out of date. |
| Hosting | `api.leanovaopexsolutions.com` is a CNAME to Azure Container Apps (`ca-asf…southindia.azurecontainerapps.io`). TLS: DigiCert/GeoTrust, valid to 25 Mar 2027. |
| Methods on `/asf` | GET only. HEAD/OPTIONS/POST → 405 JSON error. |
| Authentication | `/api/asf/*` needs `X-API-Key` or `Authorization: Bearer`. Unauthenticated calls → **401** `{"error":{"code":"unauthorized"…}}`. |
| Inputs | Public OpenAPI 3.1, "ASF Universal Analysis Engine" v0.2.0. Upload: `POST /api/asf/sources` (multipart) or `/sources/url`. Then `POST /api/asf/analyze` with `business_context` (10–8000 chars, required), `source_ids` (1–25, required), `objective`, `questions` (≤20), `output_style` (executive / detailed / brief). |
| Output format | JSON. Poll `GET /api/asf/analysis/{id}`; reports at `/report` and `/report.md`. |
| Response structure (from source contract `Synopsis`) | title, executive_synopsis, interpreted business context, what_the_data_says, what_matters, key_findings, important_metrics, patterns, risks, opportunities, contradictions, unknowns, recommended_actions, question_answers. Each item has basis (evidence or inference), verification, confidence and evidence citations. Also confidence summary, sources, coverage and reconciliation. |
| Nine pillars? | **Defined in backend source, but not in the public analysis output.** `src/asf/framework/data/pillars.yaml` defines 9 weighted pillars (1 Enterprise Context… to 9 Innovation, Learning & Adaptive Capacity; weights total 100%). The deployed `/analyze` contract returns a general evidence synopsis, **not a per-pillar score**. A framework-assessment denominator exists in the contract, but whether it is populated couldn't be checked without a key. |
| Score / assessment / recommendations? | Findings, risks, opportunities and recommended actions with confidence: yes. A numeric ASF maturity score or nine-pillar dashboard: **not verified**. None was invented. |

**Security observations for the API owner:** `/docs` (Swagger UI) and `/openapi.json` are publicly reachable on production. That's low risk, but consider disabling them or putting them behind auth. Never put the shared API key in website JavaScript.

**Recommended demo architecture (implemented: option 1 + 2):**
1. Public informational section: done (verified facts panel).
2. Sample-data demonstration: done. `assets/asf-sample.js` holds two fictional scenarios in the real report structure. It makes no network calls and renders with `textContent` only. It carries a dashed "Sample data only" banner and a "SAMPLE" watermark.
3. Live public analysis: **not recommended yet.** It would need a server-side proxy holding the key, plus per-visitor rate limiting, CAPTCHA/abuse controls, upload malware scanning, a retention/deletion policy and cost caps. That's backend work for the ASF owner, not a frontend change.

**"60 and zero":** meaning unconfirmed. **Not used anywhere.** One possibility worth asking about: the backend calls its product the "ASF **Tier 0** Document Diagnostic". Management should confirm.

## 7. SEO and technical report

**Titles and descriptions (main pages)**

| Page | Title |
|---|---|
| Home | Lean Manufacturing & Operational Excellence Consulting \| Leanova |
| Capabilities (new) | AI, Automation & Operational Capabilities \| Leanova OPEX Solutions |
| Case Studies | Case Studies & Capability Demonstrations \| Leanova OPEX Solutions |
| Insights | Insights on Lean, Operational Excellence & AI \| Leanova OPEX Solutions |
| Service pages | Unchanged from PR #1 (Lean Manufacturing, Lean Six Sigma, OPEX, MSME, Productivity, Lean Training) |

Every page has a unique title and description, a canonical URL, Open Graph tags, one H1, alt text and a sitemap entry (enforced by `scripts/check_site.py`). Organization and Service JSON-LD come from PR #1; Capabilities has WebPage JSON-LD. No rating, award or location schema was invented. No ranking is promised.

**Inventory**

| Item | Finding | Source |
|---|---|---|
| DNS provider | **GoDaddy** (NS `ns53/ns54.domaincontrol.com`) | nslookup |
| Apex / www | A → GitHub Pages (185.199.108–111.153); `www` and `http` 301 → `https://leanovaopexsolutions.com/` | nslookup, curl |
| Frontend hosting | GitHub Pages from `hkaiverse-ai/los-website` `main` (`Server: GitHub.com`, HSTS) | headers, CNAME |
| SSL (site) | Let's Encrypt, valid to 20 Jan 2027 (auto-renewed by Pages) | openssl |
| API / backend | `api.` → Azure Container Apps, South India; DigiCert cert to 25 Mar 2027 | nslookup, openssl |
| Mail | MX → `smtp.google.com` (Google Workspace) | nslookup |
| SPF | `v=spf1 include:spf.em.secureserver.net ?all` — **does not include Google** | nslookup |
| DMARC | `p=quarantine`, rua to GoDaddy (`onsecureserver.net`) | nslookup |
| Search Console | Two `google-site-verification` TXT records exist | nslookup |
| Deployment | Push/merge to `main` → GitHub Pages. No CI. | repo |
| Env vars | Website: none. ASF backend: `AZURE_OPENAI_*`, `ASF_ENV`, `ASF_API_KEY`, `ASF_DATA_DIR`, limits (names only, from README) | repo |
| Integrations | ASF Analysis (link), HKAIVERSE (link), Gmail/Outlook compose URLs, LinkedIn, Google Maps search link | repo |

**Email deliverability risk (action for domain owner, not changed):** mail is hosted on Google, but SPF only authorises GoDaddy's mail servers, and DMARC is set to quarantine. Mail sent from Google Workspace may be quarantined unless DKIM is set up and aligned. Recommended: add `include:_spf.google.com` to SPF (and remove the GoDaddy include if it's unused), switch on Google DKIM, then re-test.

## 8. Contact and email CTA

- **Root cause:** a `mailto:` link asks the operating system for a registered mail app. Chrome isn't a mail composer, so picking it from the Android or Windows chooser does nothing. The website can't detect or fix this.
- **Implemented:** visible address, **Copy email address** button (with a manual-copy fallback message), "Write in Gmail" and "Write in Outlook" web-compose links, and the PR #1 enquiry form (prepares a reviewable email, copies text, Gmail/Outlook/M365 drafts). No false "sent" message anywhere.
- **For a real form submission:** needs a backend endpoint (for example a small serverless function or a Google Workspace-backed form service), server-side validation, spam protection, a privacy and retention decision, and delivery confirmation. Not built, to avoid a frontend-only illusion.

## 12. Information needing management confirmation

1. Full registered-office address (city, state, PIN). The footer still shows the partial "5-12/424 B, Near Sai Baba Temple, Ramachandrapuram".
2. Official email: is `contact@` the monitored mailbox? Live site and prototype still use `info@`.
3. Phone number, and whether it is a monitored **WhatsApp Business** number.
4. Other official social accounts beyond LinkedIn.
5. **HK AI Works:** is it a brand, team, division or entity? How does it relate to Leanova and HKAIVERSE? The site currently says "the team's engineering work … in development".
6. **Factory records digitisation:** confirm it as an offered service. It's labelled "Offered today" as part of the existing digital/process-digitisation offering.
7. **ASF terminology:** the site uses a 7-stage overview and an 8-step delivery sequence. Backend source and LinkedIn describe **nine pillars** and SCOPE-ADAPT/PDCA. Which is official for the public site?
8. "60 and zero": what does it mean?
9. ASF Analysis: who may request access, and is a public self-serve trial wanted? (That needs backend work, §6.)
10. Marketing services: in scope or not?
11. Approved client case studies (client permission, context, baseline, verified outcome), logos and photos.
12. Insights articles: authors and topics for the first three pieces.
13. Privacy policy and terms: legal review.

## 15. QA

See `docs/QA-2026-11-10.md`.
