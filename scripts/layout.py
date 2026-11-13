"""Shared header/footer for the static site.

The site is buildless: every page carries its own header and footer so it
works without JavaScript. This script keeps those copies identical.

    python scripts/layout.py          # rewrite header/footer on every page

Company details live in COMPANY below. Change them here, run the script,
then run scripts/check_site.py.
"""
from pathlib import Path
import re
import json

ROOT = Path(__file__).resolve().parents[1]
CSS_VERSION = '20261112-it'

COMPANY = {
    'legal_name': 'Leanova Opex Solutions Private Limited',
    'email': 'contact@leanovaopexsolutions.com',
    'phone_display': '+91 94918 87419',
    'phone_tel': '+919491887419',
    # WhatsApp: leave empty until the owner confirms which number is monitored
    # on WhatsApp. When empty, no WhatsApp buttons are rendered anywhere.
    'whatsapp': '',
    'whatsapp_message': 'Hello Leanova, I would like to discuss a process improvement need in our IT business.',
    # Registered office exactly as on the MCA Certificate of Incorporation (12 Aug 2026).
    'address_lines': ['H.No. 5-12/424 B, Road No. 2,', 'Near Sai Baba Temple, Ameenpur,', 'Ramachandrapuram, Medak &ndash; 502032, Telangana'],
    'cin': 'U62099TS2026PTC221079',
    'linkedin': 'https://www.linkedin.com/company/leanova-opex-solutions-pvt-ltd/',
}

NAV = [
    ('index.html', 'Home'),
    ('about.html', 'About Us'),
    ('services.html', 'Services'),
    ('asf.html', 'ASF&trade;'),
    ('training.html', 'Training'),
    ('case-studies.html', 'Case Studies'),
    ('contact.html', 'Contact'),
]

# Which top-level nav item a page belongs to.
SECTION = {
    'index.html': 'index.html', 'about.html': 'about.html', 'capabilities.html': 'capabilities.html',
    'asf.html': 'asf.html', 'case-studies.html': 'case-studies.html', 'insights.html': 'insights.html',
    'industries.html': 'industries.html', 'services.html': 'services.html', 'training.html': 'training.html',
}
for _p in ['lean-it-consulting', 'lean-six-sigma-consulting', 'operational-excellence',
           'growing-it-businesses', 'productivity-improvement', 'lean-training',
           'workflow-digitisation', 'quality-process-excellence']:
    SECTION[f'{_p}.html'] = 'services.html'
for _p in ['it-services', 'software-saas', 'it-support-operations']:
    SECTION[f'{_p}.html'] = 'industries.html'
for _p in ['articles', 'author-vijay-sekhar-danaboyina', 'article-process-before-automation']:
    SECTION[f'{_p}.html'] = 'insights.html'


def wa_link():
    if not COMPANY['whatsapp']:
        return ''
    from urllib.parse import quote
    return f"https://wa.me/{COMPANY['whatsapp']}?text={quote(COMPANY['whatsapp_message'])}"


WA_ICON = ('<svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8s-.4-.1-.6.1-.7.8-.8 1-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.3-.4.7-1.4.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.3.8 3.2.6a2.7 2.7 0 0 0 1.8-1.2 2.2 2.2 0 0 0 .1-1.2c0-.1-.2-.2-.5-.3z"/></svg>')


def header(page):
    current = SECTION.get(page, '')
    links = []
    for href, label in NAV:
        cur = ' aria-current="page"' if href == current else ''
        links.append(f'      <a href="{href}"{cur}>{label}</a>')
    links.append('      <a class="btn" href="contact.html#enquiry">Talk to Our Experts</a>')
    wa = wa_link()
    call = [f'<a href="tel:{COMPANY["phone_tel"]}">Call {COMPANY["phone_display"]}</a>']
    if wa:
        call.append(f'<a href="{wa}" target="_blank" rel="noopener noreferrer">WhatsApp us<span class="sr-only"> (opens WhatsApp)</span></a>')
    call.append(f'<a href="mailto:{COMPANY["email"]}">Email</a>')
    return ('<header class="top">\n'
            f'  <div class="mobile-call" aria-label="Quick contact">{" &middot; ".join(call)}</div>\n'
            '  <div class="wrap">\n'
            '    <div class="brand">\n'
            '      <img class="brand__logo" src="assets/leanova-mark.jpeg" alt="" width="1024" height="626">\n'
            '      <span class="brand__rule" aria-hidden="true"></span>\n'
            '      <a class="brand__text" href="index.html">\n'
            '        <span class="brand__name">Leanova <span>OPEX</span> Solutions</span>\n'
            '        <span class="brand__tag">Transforming Operations. Enabling Excellence. Accelerating Growth.</span>\n'
            '      </a>\n'
            '    </div>\n'
            '    <button class="menu-toggle" type="button" aria-controls="primary-navigation" aria-expanded="false" hidden>Menu <span aria-hidden="true">+</span></button>\n'
            '    <nav class="main" id="primary-navigation" aria-label="Main navigation">\n'
            + '\n'.join(links) + '\n'
            '    </nav>\n'
            '  </div>\n'
            '</header>')


def footer():
    c = COMPANY
    return f'''<footer class="foot"><div class="wrap"><div class="cols cols--3">
<div><h2 class="foot__heading">Leanova</h2><p><strong>{c['legal_name']}</strong></p><p class="small">Registered office:<br>{'<br>'.join(c['address_lines'])}<br>CIN {c['cin']}</p></div>
<nav aria-label="Footer"><h2 class="foot__heading">Explore</h2><ul><li><a href="services.html">Services</a> · <a href="training.html">Training</a></li><li><a href="capabilities.html">Technology capabilities</a></li><li><a href="industries.html">IT Sectors</a> · <a href="articles.html">Articles</a></li><li><a href="privacy-policy.html">Privacy Policy</a></li><li><a href="terms.html">Terms &amp; Conditions</a></li></ul></nav>
<div><h2 class="foot__heading">Contact</h2><p><a href="mailto:{c['email']}">{c['email']}</a><br><a href="tel:{c['phone_tel']}">{c['phone_display']}</a></p><a class="social-link" href="{c['linkedin']}" target="_blank" rel="noopener noreferrer"><svg class="linkedin-icon" aria-hidden="true" viewBox="0 0 24 24" fill="currentColor"><path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9h4v12H3zM9 9h3.8v1.7h.1c.5-1 1.8-2 3.8-2 4 0 4.8 2.6 4.8 6V21h-4v-5.6c0-1.3 0-3-1.9-3s-2.2 1.5-2.2 2.9V21H9z"/></svg> LinkedIn company page ↗</a></div>
</div></div><div class="foot__base"><span>&copy; 2026 {c['legal_name']}</span><a href="contact.html#enquiry">Discuss Your Project →</a></div></footer>'''


def head(page, title, description, jsonld=None, og_type='website'):
    url = 'https://leanovaopexsolutions.com/' + ('' if page == 'index.html' else page)
    blocks = ''
    for block in (jsonld or []):
        blocks += f'\n<script type="application/ld+json">{json.dumps(block, ensure_ascii=False)}</script>'
    return f'''<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>{title}</title>
<meta name="description" content="{description}">
<link rel="icon" href="assets/favicon.png">
<meta property="og:type" content="{og_type}">
<meta property="og:title" content="{title}">
<meta property="og:description" content="{description}">
<meta property="og:image" content="https://leanovaopexsolutions.com/assets/og-image.jpg">
<meta name="twitter:card" content="summary_large_image">
<link rel="stylesheet" href="assets/site.css?v={CSS_VERSION}">
<link rel="canonical" href="{url}">
<meta property="og:url" content="{url}">
<script src="assets/site.js?v={CSS_VERSION}" defer></script>{blocks}
</head>'''


def page(name, title, description, main, jsonld=None):
    html = (head(name, title, description, jsonld) + '\n<body>\n<a class="skip" href="#main">Skip to main content</a>\n\n'
            + header(name) + f'\n\n<main id="main" tabindex="-1">\n{main}\n</main>\n' + footer() + '\n\n</body>\n</html>\n')
    (ROOT / name).write_text(html, encoding='utf-8', newline='\n')


def relayout(path):
    text = path.read_text(encoding='utf-8')
    text = re.sub(r'<header class="top">.*?</header>', lambda m: header(path.name), text, count=1, flags=re.S)
    text = re.sub(r'<footer class="foot">.*?</footer>(\n<a class="wa-float".*?</a>)?', lambda m: footer(), text, count=1, flags=re.S)
    text = re.sub(r'data-whatsapp="[^"]*"', f'data-whatsapp="{COMPANY["whatsapp"]}"', text)
    text = re.sub(r'assets/(site\.css|site\.js)\?v=[\w-]+', lambda m: f'assets/{m.group(1)}?v={CSS_VERSION}', text)
    path.write_text(text, encoding='utf-8', newline='\n')


def sitemap(lastmod='2026-11-11'):
    priority = {'index.html': '1.0', 'services.html': '0.9', 'contact.html': '0.9', 'about.html': '0.8', 'asf.html': '0.8'}
    rows = []
    for p in sorted(ROOT.glob('*.html'), key=lambda x: (x.name != 'index.html', x.name)):
        if 'name="robots" content="noindex' in p.read_text(encoding='utf-8'):
            continue
        loc = 'https://leanovaopexsolutions.com/' + ('' if p.name == 'index.html' else p.name)
        rows.append(f'<url><loc>{loc}</loc><lastmod>{lastmod}</lastmod><priority>{priority.get(p.name, "0.7")}</priority></url>')
    NL = chr(10)
    xml = ('<?xml version="1.0" encoding="UTF-8"?>' + NL
           + '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' + NL
           + NL.join(rows) + NL + '</urlset>' + NL)
    (ROOT / 'sitemap.xml').write_text(xml, encoding='utf-8', newline=NL)
    return len(rows)


if __name__ == '__main__':
    for p in sorted(ROOT.glob('*.html')):
        relayout(p)
    print('Header/footer refreshed on', len(list(ROOT.glob('*.html'))), 'pages; sitemap URLs:', sitemap())
