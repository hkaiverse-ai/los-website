# Leanova website audit and implementation roadmap

Audit date: 6 November 2026. Source: `hkaiverse-ai/los-website`, default branch `main`, base commit `f14915e5e7a7e7de17f5108b495ff12e45f55431`. Fresh checkout was clean; work branch: `feat/leanova-enterprise-experience`.

## Architecture

The complete tracked website is nine root HTML files, one shared CSS file, eight raster assets, `.gitignore` and `CNAME`. No AGENTS.md, package manifest, framework, component library, JavaScript, server, authentication, API calls, database, build scripts, tests or CI configuration exist in this repository. HTML links provide routing; header and footer markup is repeated on every page. Styling uses CSS variables, grid, media queries and inline styles. CSS imports Inter, Jost and JetBrains Mono from Google Fonts. Existing effects include gradients, hover transforms, smooth scrolling and sticky navigation. Reduced-motion support already exists.

`CNAME` identifies the live domain, consistent with GitHub Pages, but the hosting source/settings have not been verified. Do not change deployment settings. The site is served directly; there is no compilation command. Local preview: `python -m http.server 8765 --bind 127.0.0.1`.

Related repositories exist: `los-backend`, `los-asf-backend`, and `los-frontend-archive`. Their trees were inspected for context; they are separate applications, not dependencies of these public HTML pages. Do not assume that their endpoints are deployed or approved for public use. The archive contains older pages and a proof of concept; copying it into the active website would restore unrelated functionality without a verified integration contract.

## Reference comparison

The live homepage's content and routes correspond to this repository. It explains the six capabilities but omits a clear consulting journey, substantial ASF introduction, service grouping and a useful closing invitation. The prototype initially failed through web retrieval and timed out in browser creation, but its tab subsequently loaded and was inspected visually and through its page structure. It uses a dark/gold identity, oversized uppercase hero, decorative 3D imagery, a four-part narrative, expanded AI/web/marketing services, affiliated-venture claims and an ASF workspace link. Retain its clear positioning, journey and ASF prominence; avoid its oversized hero/decorative motion and unconfirmed web/marketing offerings. Workspace and HKAIVERSE claims differ from the supplied brief and need owner confirmation rather than being copied. The prototype was used as a reference; the existing application was preserved.

## Complete page inventory and findings

| Page | Working / retain | Gap / action |
| --- | --- | --- |
| index.html | Six distinct capabilities, real service links | Strengthen headline, add service pathways, consulting journey, ASF overview and closing CTA |
| about.html | Mission, vision, philosophy and differentiation already supplied | Improve readability and connect company approach to ASF; preserve approved source wording |
| services.html | All six requested categories and detailed tools already exist | Group operations vs digital/AI, add jump links and native expandable details; connect training and ASF separately |
| asf.html | Separate framework page and detailed consulting methodology | Add dimensions, responsive workflow and future-AI status; conflicting HK AIverse implementation claims need confirmation |
| industries.html | Manufacturing, services and MSME offerings | Sector names alone offer little decision support; add explicitly illustrative problem-to-service pathways |
| training.html | Five training categories supplied in source | Explain intended audiences and practical application; no new qualifications/certifications |
| case-studies.html | Outcome dimensions | Generic examples imply achieved results without evidence; public HKAIVERSE placeholder conflicts with ASF's detailed claims. Reframe as illustrative applications; hold HKAIVERSE for approval |
| insights.html | Six useful subject areas | Empty resource catalogue with no articles. Provide actual service/learning pathways and explain available guidance |
| contact.html | Email, telephone, office map, six FAQs | No form or contact API exists. Retain honest email/phone contact instead of inventing a submission success state; make FAQs expandable |

## Cross-cutting findings

- Navigation links and service fragment IDs exist. No dead `#` buttons were found in the initial source. All pages already include language, viewport, skip link, unique title/description and Open Graph image.
- No mobile menu exists: navigation wraps into multiple rows. Long brand text, fixed minimum grid widths and long contact strings need small-screen verification.
- Font weight 200/300, small all-caps labels and subdued footer text weaken readability. Gradients, metallic button styling and repeated card treatments dominate the identity.
- Every closing band contains only a button. Images are largely unused; keep originals but use only relevant visuals. Do not fabricate client photography or results.
- No sitemap, robots file, canonical URL or `og:url` exists. Metadata foundations should be completed.
- There are no forms, search, tabs, login, loading states or API interactions to repair. Email delivery cannot be verified from a mailto link. Do not introduce controls that imply these capabilities exist.

## Prioritized roadmap

| Priority | Current problem / proposed solution | Benefit | Files | Dependency |
| --- | --- | --- | --- | --- |
| Critical | Conflicting HKAIVERSE and unsupported result claims: retain originals in history, publish clearly illustrative applications only | Credibility | asf.html, case-studies.html | Business owner must approve an evidence-backed case study before publication |
| High | Wrapping navigation and small-screen risk: progressive mobile disclosure, Escape/focus handling, safe grids | Usable navigation | all HTML, assets/site.js, assets/site.css | None |
| High | Incomplete home journey: concise positioning, six capabilities, service overview, existing-methodology summary, ASF and clear CTA | Visitors understand offer and next step | index.html | Retain source methodology; no new official stages |
| High | Dense services: two clear groups, anchor navigation and details | Easier discovery | services.html, CSS | None |
| High | ASF is text-heavy: dimensions and ordered workflow using existing stages, honest AI status | Explain methodology without simulating software | asf.html, CSS | New eight-stage wording remains proposed in workspace plan |
| High | Inconsistent presentation: restrained charcoal/gold tokens, stronger type, consistent actions/spacing | Readability and consistency | CSS, all HTML | None |
| Medium | Sparse industries/training/resources: relevant pathways, audiences and links | Better visitor decisions | industries.html, training.html, insights.html | No new claims of experience or qualifications |
| Medium | Missing discovery metadata and checks: canonical URLs, sitemap, robots and static validation | Maintainability / SEO | HTML, sitemap.xml, robots.txt, scripts/check_site.py | Confirm production index URL on release |
| Future | No contact submission backend: agree endpoint, validation, abuse controls, retention and delivery confirmation before a real form | Reliable enquiries | contact.html + backend | Backend owner and privacy decisions |
| Future | Authenticated ASF workspace: separate proposed flow and API contract | Integrate real analysis later | docs/ASF-WORKSPACE-PROPOSAL.md | Backend owner, authentication, data policy, real deployment and approved methodology |

## Preserve / defer

Keep all existing routes, assets, business contact details, mission/vision, training topics, six capabilities and the detailed consulting methodology. Keep deployment unchanged. Remove no dependencies (none are installed) and delete no assets. Archive original unverified copy through Git history; do not treat repository copy as independent proof of delivered outcomes. Browser, external-link, backend and delivery verification results must be reported separately from static checks.

## Related backend evidence (read-only)

`los-backend/pyproject.toml` declares Python >=3.12, FastAPI >=0.115, Uvicorn >=0.32 and Pydantic >=2.9. Its `src/lva/main.py` provides health and tenant voice-session routes backed by in-memory stores. Source comments explicitly identify missing authentication, entitlement, budget and kill-switch checks; it is an internal pilot and is not suitable as a public contact or agent endpoint.

`los-asf-backend/README.md` documents a separate FastAPI-style API surface for evidence ingestion, queued analysis, status and report export plus an `/asf` UI. It specifies an API key for non-local environments, file-backed data storage and Azure OpenAI configuration. It also states real-model analysis and a deployment target are pending. Those statements were not independently verified against deployment infrastructure. The prototype links to `api.leanovaopexsolutions.com/asf`; this conflict with the backend documentation must be resolved by its owner. No backend or credentials were changed, and no real document uploads or analysis calls were made.
