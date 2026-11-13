# Article format

Articles are published as `article-<slug>.html` using the shared layout (`scripts/layout.py` → `page()`), linked from `articles.html#latest`, and added to `sitemap.xml`.

**Before publishing**
- Named author has written or substantially reviewed the article and approved publication under their name.
- Any example from a client is anonymised or approved; numbers come from `project-results.csv`.
- AI drafting assistance, if used, is reviewed line by line by the author.

**Structure (800–1,400 words)**
1. Title (the problem in the reader's words) · author · role · date · reading time
2. The problem on the shop floor (2–3 short paragraphs)
3. Why it happens (root causes)
4. What to do: 3–6 practical steps
5. How to measure it
6. Common mistakes
7. Where Leanova helps + link to the related service page + "Discuss Your Process"

**Structured data**: `Article` with `author` (`Person`, name, `url` → author section), `datePublished`, `publisher` → Organization `@id`.

**Planned cadence**: two articles a month. Suggested first topics:
1. Improve, then digitise: why factory digitisation fails when the process is not standard
2. Eight wastes on an Indian MSME shop floor: a practical walk-through
3. OEE without the jargon: how to start measuring with a paper sheet
4. 5S that lasts beyond the first month
5. From shift register to daily dashboard: a step-by-step path
6. Where AI actually helps in manufacturing today (and where data is not ready)
