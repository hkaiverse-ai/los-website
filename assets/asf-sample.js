// ASF public demo — FICTIONAL SAMPLE DATA ONLY.
// Hand-written to mirror the section structure of the ASF Analysis synopsis
// (title, executive synopsis, key findings, metrics, risks, opportunities,
// unknowns, recommended actions; each item with basis, confidence, evidence).
// No network requests are made and nothing here is ASF Analysis output.
(() => {
  const output = document.getElementById('sample-output');
  const buttons = document.querySelectorAll('[data-sample]');
  if (!output || !buttons.length) return;

  const SAMPLES = {
  "delivery": {
    "title": "Sample A — Fictional IT delivery team: review delays",
    "context": "Fictional example only: a software delivery team has work waiting for reviews. The aim is to understand handoffs before choosing a tool.",
    "sources": [
      "delivery_workflow_notes.txt (fictional)"
    ],
    "synopsis": "In this illustrative scenario, requests wait for review because ownership and acceptance criteria are unclear. The first step is to agree responsibilities and make waiting work visible. This is not an actual client finding or output from ASF Analysis.",
    "metrics": [
      [
        "Review waiting time",
        "Measure first",
        "Compare the starting point with the agreed change"
      ],
      [
        "Repeat work",
        "Measure first",
        "Track returned items and reasons"
      ]
    ],
    "findings": [
      {
        "s": "Review ownership is not defined consistently in the fictional workflow.",
        "basis": "fictional example",
        "q": "Review owner: to be agreed",
        "src": "delivery_workflow_notes.txt (fictional)"
      }
    ],
    "risks": [
      {
        "s": "Adding automation before responsibilities are clear may preserve the delay.",
        "basis": "illustrative reasoning"
      }
    ],
    "opportunities": [
      {
        "s": "Clearer handoffs and acceptance criteria may reduce repeat requests.",
        "basis": "illustrative reasoning"
      }
    ],
    "unknowns": [
      {
        "s": "No measured baseline or verified client outcome is provided.",
        "basis": "fictional example"
      }
    ],
    "actions": [
      {
        "s": "Agree review ownership and acceptance criteria.",
        "p": "First"
      },
      {
        "s": "Record waiting time and review the effect of the changes.",
        "p": "Next"
      }
    ]
  },
  "support": {
    "title": "Sample B — Fictional IT support team: recurring requests",
    "context": "Fictional example only: a support team answers similar questions repeatedly while guidance is spread across documents.",
    "sources": [
      "support_workflow_notes.txt (fictional)"
    ],
    "synopsis": "This scenario illustrates a knowledge and workflow gap. Start by reviewing repeated request types and agreeing who maintains the guidance. A knowledge assistant could be explored later, once reliable information and access rules are in place.",
    "metrics": [
      [
        "Repeat requests",
        "Measure first",
        "Track request type and reason"
      ],
      [
        "Time to find guidance",
        "Measure first",
        "Agree a useful measure with the team"
      ]
    ],
    "findings": [
      {
        "s": "Guidance ownership is unclear in the fictional example.",
        "basis": "fictional example",
        "q": "Knowledge owner: not assigned",
        "src": "support_workflow_notes.txt (fictional)"
      }
    ],
    "risks": [
      {
        "s": "Unreviewed guidance could produce inconsistent responses.",
        "basis": "illustrative reasoning"
      }
    ],
    "opportunities": [
      {
        "s": "A maintained knowledge source and clearer request routing could support more consistent service.",
        "basis": "illustrative reasoning"
      }
    ],
    "unknowns": [
      {
        "s": "No technical integration, model performance or client result has been verified.",
        "basis": "fictional example"
      }
    ],
    "actions": [
      {
        "s": "Review repeated request types and confirm knowledge owners.",
        "p": "First"
      },
      {
        "s": "Pilot a clearer workflow before considering AI assistance.",
        "p": "Next"
      }
    ]
  }
};

  const el = (tag, text, cls) => { const n = document.createElement(tag); if (text) n.textContent = text; if (cls) n.className = cls; return n; };
  const items = (heading, list) => {
    const frag = document.createDocumentFragment();
    frag.append(el('h4', heading));
    const ul = el('ul', '', 'sample-items');
    list.forEach((it) => {
      const li = el('li');
      li.append(el('div', it.s));
      const meta = el('div', '', 'sample-meta');
      if (it.p) meta.append(el('span', `Priority: ${it.p}`));
      if (it.basis) meta.append(el('span', `Basis: ${it.basis}`));
      if (typeof it.c === 'number') meta.append(el('span', `Confidence: ${Math.round(it.c * 100)}%`));
      if (it.q) { const q = el('q', it.q); meta.append(q); }
      if (it.src) meta.append(el('span', `Source: ${it.src}`));
      li.append(meta); ul.append(li);
    });
    frag.append(ul);
    return frag;
  };

  const render = (key) => {
    const d = SAMPLES[key];
    if (!d) return;
    const report = el('article', '', 'sample-report');
    report.setAttribute('aria-label', 'Sample report — fictional data');
    report.append(el('h3', d.title));
    report.append(el('p', d.context, 'small'));
    report.append(el('p', `Sources (fictional): ${d.sources.join(' · ')}`, 'small'));
    report.append(el('h4', 'Executive synopsis'));
    report.append(el('p', d.synopsis));
    report.append(el('h4', 'Important metrics'));
    const m = el('div', '', 'sample-metrics');
    d.metrics.forEach(([name, value, ctx]) => { const box = el('div'); box.append(el('b', value), el('span', `${name} — ${ctx}`)); m.append(box); });
    report.append(m);
    report.append(items('Key findings', d.findings));
    report.append(items('Risks', d.risks));
    report.append(items('Opportunities', d.opportunities));
    report.append(items('Unknowns & evidence gaps', d.unknowns));
    report.append(items('Recommended actions', d.actions));
    report.append(el('p', 'End of sample. Fictional data, written by hand to show structure. Not an ASF Analysis result.', 'small'));
    output.replaceChildren(report);
    buttons.forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.sample === key)));
  };

  buttons.forEach((b) => b.addEventListener('click', () => render(b.dataset.sample)));
})();
