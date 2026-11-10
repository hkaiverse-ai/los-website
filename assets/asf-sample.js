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
    plant: {
      title: 'Sample A — Fictional component manufacturer: delivery reliability',
      context: 'Business context (fictional): a two-line machining unit is missing customer delivery dates. Objective: find the main causes and the first improvements to make.',
      sources: ['shift_production_log_Q3.xlsx (fictional)', 'customer_complaints_2026.csv (fictional)', 'maintenance_register.pdf (fictional)'],
      synopsis: 'In the sample evidence, Line 2 is the constraint. Unplanned stoppages and long changeovers account for most of its lost time, and late orders cluster on products routed through Line 2. Complaint data points to dimensional defects on one product family. Maintenance records are incomplete for six weeks, so the downtime picture is partial.',
      metrics: [
        ['Line 2 availability', '71%', 'shift log, Jul–Sep'],
        ['Average changeover', '96 min', 'shift log, 212 changeovers'],
        ['On-time delivery', '78%', 'complaints file, dispatch dates'],
        ['Rejection rate, family B', '4.2%', 'complaints file'],
      ],
      findings: [
        { s: 'Late orders are concentrated on products routed through Line 2.', basis: 'evidence', c: 0.86, q: 'Line 2 — 41 of 53 late orders', src: 'customer_complaints_2026.csv, rows 2–54' },
        { s: 'Changeovers on Line 2 take about twice as long as on Line 1.', basis: 'evidence', c: 0.81, q: 'Avg changeover L1 48 min / L2 96 min', src: 'shift_production_log_Q3.xlsx, sheet "Summary"' },
        { s: 'Dimensional defects on product family B are the most frequent complaint type.', basis: 'evidence', c: 0.77, q: 'Dimension out of tolerance (Family B) — 19', src: 'customer_complaints_2026.csv' },
      ],
      risks: [{ s: 'If Line 2 stays the constraint, adding demand will increase late deliveries.', basis: 'inference', c: 0.64 }],
      opportunities: [{ s: 'A SMED workshop on the top three Line 2 changeovers could recover capacity without capital spend.', basis: 'inference', c: 0.6 }],
      unknowns: [{ s: 'Maintenance entries are missing for weeks 31–36, so the share of downtime from breakdowns cannot be confirmed.', basis: 'evidence', c: 0.9 }],
      actions: [
        { s: 'Confirm the Line 2 constraint with a two-week time study.', p: 'High' },
        { s: 'Run a SMED improvement on the three most frequent changeovers.', p: 'High' },
        { s: 'Start a root-cause investigation (8D) on family B dimensional defects.', p: 'Medium' },
        { s: 'Restore daily maintenance logging before measuring results.', p: 'Medium' },
      ],
    },
    msme: {
      title: 'Sample B — Fictional MSME fabrication unit: rework and paper records',
      context: 'Business context (fictional): a 40-person fabrication unit sees frequent rework and keeps inspection records on paper. Objective: reduce rework and decide whether to digitise records.',
      sources: ['inspection_register_scans.pdf (fictional)', 'job_card_summary.xlsx (fictional)'],
      synopsis: 'The sample evidence shows rework concentrated in welding, mostly from fit-up gaps. Many inspection pages are scanned images without a text layer, so they could not be read and are reported as gaps. Digitising the inspection register would make the defect pattern measurable.',
      metrics: [
        ['Jobs with rework', '18%', 'job card summary, 310 jobs'],
        ['Rework in welding', '62%', 'of rework jobs'],
        ['Unreadable register pages', '14 of 40', 'scanned images, no text layer'],
      ],
      findings: [
        { s: 'Most rework originates in the welding stage.', basis: 'evidence', c: 0.82, q: 'Rework stage: Welding — 35 of 56', src: 'job_card_summary.xlsx, sheet "Rework"' },
        { s: 'Fit-up gap is the most frequently recorded welding defect.', basis: 'evidence', c: 0.7, q: 'Fit-up gap > spec', src: 'inspection_register_scans.pdf, p. 3' },
      ],
      risks: [{ s: 'Decisions based on the paper register may miss defects recorded on unreadable pages.', basis: 'inference', c: 0.66 }],
      opportunities: [{ s: 'A simple fixture and standard work at fit-up could address the main rework source.', basis: 'inference', c: 0.55 }],
      unknowns: [{ s: 'Rework cost per job is not recorded in the sources provided.', basis: 'evidence', c: 0.92 }],
      actions: [
        { s: 'Digitise the inspection register using a structured form.', p: 'High' },
        { s: 'Introduce a fit-up check and fixture trial on the highest-volume job type.', p: 'High' },
        { s: 'Start recording rework hours per job to size the cost of poor quality.', p: 'Medium' },
      ],
    },
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
