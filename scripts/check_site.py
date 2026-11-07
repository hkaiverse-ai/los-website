"""Dependency-free checks for the static site's routes, anchors and HTML foundations."""
from collections import Counter
from html.parser import HTMLParser
from pathlib import Path
import re
from urllib.parse import unquote, urlsplit
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parents[1]


class Page(HTMLParser):
    def __init__(self, path):
        super().__init__(convert_charrefs=True)
        self.path, self.ids, self.links, self.tags, self.attrs = path, [], [], [], []
        self.feed(path.read_text(encoding='utf-8'))

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        self.tags.append(tag)
        self.attrs.append((tag, attrs))
        if 'id' in attrs:
            self.ids.append(attrs['id'])
        if tag in ('a', 'link', 'script', 'img', 'iframe'):
            self.links.append(attrs.get('href', attrs.get('src', '')))


pages = {p.name: Page(p) for p in ROOT.glob('*.html')}
errors = []
link_count = 0
for name, page in pages.items():
    def require(condition, message):
        if not condition:
            errors.append(f'{name}: {message}')
    require(page.tags.count('h1') == 1, 'expected one h1')
    require(page.tags.count('main') == 1, 'expected one main landmark')
    require(not [i for i, n in Counter(page.ids).items() if n > 1], 'duplicate IDs')
    require(any(t == 'html' and a.get('lang') == 'en' for t, a in page.attrs), 'missing language')
    require(any(t == 'link' and a.get('rel') == 'canonical' for t, a in page.attrs), 'missing canonical')
    require(any(t == 'meta' and a.get('name') == 'description' and a.get('content') for t, a in page.attrs), 'missing description')
    require(any(t == 'nav' and a.get('aria-label') == 'Main navigation' for t, a in page.attrs), 'unnamed navigation')
    require(all('alt' in a for t, a in page.attrs if t == 'img'), 'image without alt')
    for link in page.links:
        url = urlsplit(link)
        if url.scheme or url.netloc:
            continue
        link_count += 1
        require(bool(link) and link != '#', 'empty/placeholder link')
        dest = unquote(url.path) or name
        target = ROOT / dest
        require(target.is_file(), f'missing target {dest}')
        if url.fragment and dest in pages:
            require(unquote(url.fragment) in pages[dest].ids, f'missing anchor {dest}#{url.fragment}')
    require(any(t == 'a' and a.get('href') == '#main' for t, a in page.attrs), 'missing skip link')

# Guard the agreed product structure and enquiry routes.
expected_capabilities = ['Lean Transformation', 'Operational Excellence', 'Digital Transformation', 'AI-Enabled Operations', 'Process Excellence', 'Capability Development']
home_text = (ROOT / 'index.html').read_text(encoding='utf-8')
capabilities = [text.strip() for text in re.findall(r'<article class="card capability">.*?<h3>(.*?)</h3>', home_text, re.S)]
if capabilities != expected_capabilities:
    errors.append('index.html: core capabilities changed or duplicated')
for anchor in ['operations', 'digital', 'ai', 'intelligent-automation', 'capability-development']:
    if anchor not in pages['services.html'].ids:
        errors.append(f'services.html: missing service group {anchor}')
contact = pages['contact.html']
radio_values = [a.get('value') for t, a in contact.attrs if t == 'input' and a.get('name') == 'interest']
if radio_values != ['operations', 'digital-ai', 'asf']:
    errors.append('contact.html: enquiry options changed or duplicated')
if not any(t == 'input' and a.get('type') == 'email' and 'required' in a for t, a in contact.attrs):
    errors.append('contact.html: required email validation missing')
if any(t == 'form' and a.get('method', '').lower() == 'post' for t, a in contact.attrs):
    errors.append('contact.html: unexpected submission mechanism; delivery backend is not configured')
for offering in ['agents', 'multi-agent', 'llm', 'assistants', 'voice', 'workflows', 'rag', 'reporting']:
    expected = f'contact.html?interest=digital-ai&service={offering}#enquiry'
    if offering not in pages['services.html'].ids or expected not in pages['services.html'].links:
        errors.append(f'services.html: missing categorized enquiry for {offering}')

ET.parse(ROOT / 'sitemap.xml')
if errors:
    raise SystemExit('\n'.join(errors))
print(f'PASS: {len(pages)} pages, {link_count} local links/assets/anchors, unique IDs, landmarks, metadata and sitemap XML.')
