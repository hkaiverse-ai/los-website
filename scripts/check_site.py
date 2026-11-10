"""Dependency-free checks for the static site's routes, anchors and HTML foundations."""
from collections import Counter
from html.parser import HTMLParser
from pathlib import Path
import re
import json
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
        if tag in ('a', 'link', 'img', 'iframe') or (tag == 'script' and 'src' in attrs):
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

for page_name in ['index.html', 'case-studies.html']:
    page = pages[page_name]
    if page.ids.count('hkaiverse') != 1:
        errors.append(f'{page_name}: expected one dedicated related-venture feature')
    if not any(t == 'a' and a.get('href') == 'https://app.hkaiverse.ai/practice'
               and a.get('target') == '_blank' and 'noopener' in a.get('rel', '')
               for t, a in page.attrs):
        errors.append(f'{page_name}: verified HKAIVERSE handoff missing')
if 'hkaiverse' in pages['services.html'].ids:
    errors.append('services.html: HKAIVERSE must not become a consulting service category')
for page_name in ['index.html', 'asf.html']:
    if not any(t == 'a' and a.get('href') == 'https://api.leanovaopexsolutions.com/asf'
               and a.get('target') == '_blank' and 'noopener' in a.get('rel', '')
               for t, a in pages[page_name].attrs):
        errors.append(f'{page_name}: separate approved ASF Analysis handoff missing')

ET.parse(ROOT / 'sitemap.xml')

# Search metadata should describe each real page, and structured data must parse.
titles, descriptions = [], []
sitemap_urls = {el.text for el in ET.parse(ROOT / 'sitemap.xml').findall('.//{*}loc')}
for name in pages:
    source = (ROOT / name).read_text(encoding='utf-8')
    titles.append(re.search(r'<title>(.*?)</title>', source, re.S).group(1).strip())
    descriptions.extend(a['content'] for t, a in pages[name].attrs if t == 'meta' and a.get('name') == 'description')
    canonical = next(a['href'] for t, a in pages[name].attrs if t == 'link' and a.get('rel') == 'canonical')
    if canonical not in sitemap_urls:
        errors.append(f'{name}: canonical missing from sitemap')
    for block in re.findall(r'<script type="application/ld\+json">(.*?)</script>', source, re.S):
        try:
            data = json.loads(block)
            if data.get('@context') != 'https://schema.org' or not data.get('@type'):
                errors.append(f'{name}: invalid structured data identity')
        except json.JSONDecodeError:
            errors.append(f'{name}: malformed structured data')
if len(titles) != len(set(titles)) or len(descriptions) != len(set(descriptions)):
    errors.append('duplicate page title or description')

# Business identity must agree across every route, including legal pages.
for name in pages:
    text = (ROOT / name).read_text(encoding='utf-8')
    footer = text.split('<footer', 1)[-1]
    for required in ['Leanova Opex Solutions Private Limited', '5-12/424 B',
                     'Near Sai Baba Temple, Ramachandrapuram', 'contact@leanovaopexsolutions.com',
                     'tel:+919491887419', 'privacy-policy.html', 'terms.html',
                     'https://www.linkedin.com/company/leanova-opex-solutions-pvt-ltd/']:
        if required not in footer:
            errors.append(f'{name}: footer missing business detail {required}')
    if any(stale in text for stale in ['info@leanovaopexsolutions.com', 'Narendranagar', 'Road No. 02', '502032']):
        errors.append(f'{name}: superseded business contact detail')
for legal_page in ['privacy-policy.html', 'terms.html']:
    if legal_page not in pages or legal_page not in (ROOT / 'sitemap.xml').read_text(encoding='utf-8'):
        errors.append(f'{legal_page}: legal page or sitemap entry missing')
if 'google.com/maps?q=' in (ROOT / 'contact.html').read_text(encoding='utf-8'):
    errors.append('contact.html: automatic map embed must not return without privacy review')
if errors:
    raise SystemExit('\n'.join(errors))
print(f'PASS: {len(pages)} pages, {link_count} local links/assets/anchors, unique IDs, landmarks, metadata and sitemap XML.')
