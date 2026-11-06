"""Dependency-free checks for the static site's routes, anchors and HTML foundations."""
from collections import Counter
from html.parser import HTMLParser
from pathlib import Path
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

ET.parse(ROOT / 'sitemap.xml')
if errors:
    raise SystemExit('\n'.join(errors))
print(f'PASS: {len(pages)} pages, {link_count} local links/assets/anchors, unique IDs, landmarks, metadata and sitemap XML.')
