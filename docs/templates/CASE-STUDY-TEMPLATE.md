# Case-study format (website)

Copy the HTML block below into `case-studies.html` inside `<div class="cols cols--2">` in the matching section. Fill it **only** from a verified row in `project-results.csv`.

```html
<article class="case-block" id="case-<short-id>">
  <span class="work-tag">Client Work</span>          <!-- or: Capability / Example (add work-tag--muted) -->
  <h3><Short descriptive title></h3>
  <dl>
    <div class="detail"><dt>Industry</dt><dd>…</dd></div>
    <div class="detail"><dt>Problem</dt><dd>…</dd></div>
    <div class="detail"><dt>Starting point</dt><dd>…</dd></div>
    <div class="detail"><dt>Approach</dt><dd>…</dd></div>
    <div class="detail"><dt>Tools</dt><dd>…</dd></div>
    <div class="detail"><dt>Results</dt><dd>… (baseline → result, period)</dd></div>
    <div class="detail"><dt>Benefit</dt><dd>…</dd></div>
  </dl>
  <!-- Optional, only with written approval: -->
  <blockquote class="note note--signal"><p>“Exact client words.”</p><p class="small">— Name, Role, Company</p></blockquote>
  <p class="small">Published with the client’s permission. Figures verified by Leanova on <date>.</p>
</article>
```

## Testimonial / review entry

```html
<figure class="card">
  <blockquote><p>“Exact words as approved by the client.”</p></blockquote>
  <figcaption class="small">Name, Role · Company (or “Plant head, engineering MSME, Hyderabad” if anonymised)</figcaption>
</figure>
```

Never write, paraphrase into new meaning, or invent a review.
