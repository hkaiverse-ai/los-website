# Related venture and separate analysis application

Verified 7 November 2026 for Draft PR #1. This update applies to the existing nine-page website and the existing review preview; it creates no new application.

## HKAIVERSE relationship and description

The owner explicitly confirms that **HKAIVERSE Capability Studio is a related venture of Leanova OPEX Solutions**, not a regular consulting service or client engagement. This is the source for the relationship wording. No legal ownership percentage, customer relationship or corporate structure is inferred.

The `hkaiverse-ai/hkaiverse-web` repository was inspected at source ref `57e1d65c7207e52b681d44ee5de18449a60633b1`:

- `app/public-metadata.ts` declares `SITE_ORIGIN = https://hkaiverse.ai` and describes practical learning, capability development, practice, projects and feedback.
- `app/product-links.ts` declares `PRODUCT_APP_ORIGIN = https://app.hkaiverse.ai` and `practice = ${PRODUCT_APP_ORIGIN}/practice`.
- `app/home-page.tsx` and `app/site-shell.tsx` use the name **AI Capability Practice Studio**. The owner's requested **HKAIVERSE Capability Studio** is the Leanova feature title; the supporting copy names the existing Practice Studio so it does not invent a different product.
- The existing Leanova asset `assets/photos/hk-aiverse-logo-master.png` is reused unmodified, with its natural aspect ratio, alt text and lazy loading. Its blue/violet identity is kept distinct from Leanova's gold and the ASF feature.

The exact destination `https://app.hkaiverse.ai/practice` was opened in the browser. After its loading state, it showed AI Capability Practice Studio, realistic scenario practice, explaining reasoning and decisions, advisory feedback and account links. No account was created, practice session started or purchase made. Its public page states that detailed feedback depends on analysis availability and that practice is not a qualification. Leanova copy retains those limits without publishing prices, scoring claims, user counts or promised outcomes.

Placement: a dedicated homepage feature after the AI introduction; a separate related-venture section on Our Work outside the illustrative business examples; a short About relationship and Company-footer link. HKAIVERSE is not added to the homepage's six capability cards, service taxonomy, ASF stages or client examples.

## ASF Analysis application

The owner supplied and approved `https://api.leanovaopexsolutions.com/asf`. Browser inspection confirmed the title **ASF Analysis — Leanova OPEX Solutions**, a required API-key field, document/spreadsheet upload input, public URL input, business-context questions and an Analyze control.

The website links to that existing application using a new tab with `rel="noopener noreferrer"`. It does not embed/copy the application, collect a key, pass credentials through a URL, submit documents or run analysis. Link verification proves the application surface opens; it does not prove authorized analysis, model quality, exports or backend execution. No key was entered and no analysis was run.

The latest live inspection and owner-provided URL supersede the earlier uncertainty about whether a hosted ASF analysis surface exists. Earlier repository README statements about missing deployment/model readiness may be stale. Readiness for a particular user's authorized use and export behavior remain for the application owner to confirm.

## Clear boundaries

| Area | Role |
| --- | --- |
| Leanova consulting | Business and process improvement services |
| ASF™ | Methodology for context, constraints, priorities and adaptation |
| ASF Analysis | Separate API-key-protected application, linked externally |
| HKAIVERSE Capability Studio | Related capability-development venture with its own platform identity |
| AI agents and LLM solutions | Technology development areas with the existing explicit readiness labels |

No integration among these products is claimed. The existing seven-item ASF overview and eight-item consulting delivery sequence remain separate; definitive official stage/pillar terminology still requires owner reconciliation.
