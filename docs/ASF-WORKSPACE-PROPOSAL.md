# Proposed ASF workspace — not an implemented product

Update, 7 November 2026: the owner has now supplied the existing ASF Analysis application URL, `https://api.leanovaopexsolutions.com/asf`. Its API-key-protected application surface was verified in the browser and is linked from the marketing website. The new-workspace design below remains a proposal; it is not a description of that application's verified functionality. No key was entered or analysis run. HKAIVERSE Capability Studio is a separate related venture, not this application or an asserted integration. See `VENTURE-AND-ANALYSIS-SOURCES.md` for current evidence.

This proposal is a handoff for the backend owner. The public website explains the methodology and routes enquiries to Contact. It does not collect documents, store credentials or simulate analysis. No new official ASF stages are asserted. The brief's eight-stage visualization (business context → observe → diagnose gaps → prioritize → design improvements → implement → measure → adapt) remains proposed; the public diagram retains the existing site's Understand → Diagnose → Prioritize → Design → Implement → Measure → Adapt sequence until the business owner confirms wording.

## Evidence and integration boundary

The separate `los-asf-backend` README documents source ingestion, queued analysis, status, source references and Markdown reports. This is stronger evidence than assuming no API code exists, but it is not proof of production readiness. It explicitly records pending real-model validation and deployment. The review prototype links to a hosted `/asf` page, creating a status discrepancy to resolve with the developer. Do not expose a shared API key in website source, local storage or a browser-facing query string. The public marketing site must not call the tenant voice API in `los-backend`, whose source explicitly documents missing authentication and entitlement checks.

## Proposed architecture

Public HTML website → separate workspace → authenticated server boundary → existing ASF service (after readiness confirmation) → protected evidence/report storage.

Workspace authentication, per-user/tenant authorization and session cookies belong at the server boundary. Public website remains independent. Agree allowed origins, authenticated access, retention, deletion, upload limits, malware/content handling, rate limits and audit records before connecting real business data. The existing service API-key requirement alone does not demonstrate user isolation.

## Proposed UI flow

1. Assessment start: explain purpose, supported inputs and data policy.
2. Business context: industry, operational challenge, objective and questions.
3. Evidence input: show only formats approved by the actual deployment. Client prechecks supplement server validation.
4. Review: inspect context and selected evidence before starting a job.
5. Analysis progress: display real server status. Handle queued/running/completed/failed states only when supported; show retries and timeouts honestly.
6. Findings: show cited evidence, limitations and uncertainty. Missing evidence is an explicit empty state.
7. Recommendations: separate evidence from interpretation; do not invent named agents or autonomous actions.
8. Human review: accept, revise or reject recommendations. No execution without an implemented, authorized backend action.
9. Action plan: agree ownership, milestones and measures. This requires a new persistence contract if the service cannot save it.
10. Outcomes: record baselines and actual KPI measurements. Tracking is future work, not existing analysis functionality.
11. Saved assessments/reports: user-scoped access and retention policy. Do not imply availability until implemented.

## Candidate API mapping — verify before integration

| UI need | Existing documented service candidate | Remaining decision |
| --- | --- | --- |
| Upload evidence | POST /api/asf/sources | Authorized storage scope, approved formats, limits, deletion |
| Public URL source | POST /api/asf/sources/url | Server URL guards and provenance |
| Start analysis | POST /api/asf/analyze | Authenticated actor, request schema/version, readiness, duplicate-submit behavior |
| Analysis progress/results | GET /api/asf/analysis/{id} | Ownership checks, status vocabulary, polling/backoff, expiry |
| Source references | GET /api/asf/analysis/{id}/sources | Citation navigation and access control |
| Export report | GET /api/asf/analysis/{id}/report.md | Authorized download, 409 pending state |
| Readiness | GET /ready | Operator monitoring; meaningful unavailable state in UI |
| Approval, action plan, KPI history | No contract verified | Backend design required; do not fabricate endpoints |

Expected transport failures include unauthenticated/forbidden, size/type rejection, validation errors, model unavailability, network interruptions and expired jobs. Preserve user-entered context during recoverable failures without persisting sensitive evidence in browser storage. Render reports as escaped text or sanitized content, never raw model HTML.

Before implementation, the owner must confirm the actual running version and API schema, real-model readiness, deployment origin, authentication/ownership model, approved ASF stages and whether any multi-agent responsibilities are implemented. Public case studies additionally require venture/client classification, permission to publish, implementation evidence and verified outcomes.
