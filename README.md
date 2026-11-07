# Leanova OPEX Solutions website

Buildless HTML/CSS/JavaScript website. Preserve the existing root HTML paths and `CNAME` when deploying through the team's current hosting setup.

## Preview

From the repository root:

```sh
python -m http.server 8765 --bind 127.0.0.1
```

Open `http://127.0.0.1:8765/`. No package installation or compilation is needed.

## Check

```sh
python scripts/check_site.py
node --check assets/site.js
node --check assets/enquiry.js
node scripts/check_enquiry.cjs
git diff --check
```

There is no framework build or existing CI. Browser checks are documented in `docs/VERIFICATION.md`. Shared CSS is in `assets/site.css`; the mobile navigation enhancement is in `assets/site.js`. Header/footer markup is repeated in each page so navigation works even without JavaScript.

See `docs/AUDIT.md` for architecture, page inventory and roadmap, `docs/DESIGN-SYSTEM.md` for interface conventions, and `docs/ASF-WORKSPACE-PROPOSAL.md` for future integration boundaries. Do not expose backend API keys in this repository or replace illustrative applications with client results without publication approval and evidence.

Enquiries are prepared locally as reviewable emails; the visitor sends them through their own email application. No contact submission service is configured. AI/LLM readiness evidence and owner-confirmation items are recorded in `docs/OFFERING-STATUS.md`.
