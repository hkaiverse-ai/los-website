from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlsplit,unquote
import json,xml.etree.ElementTree as ET
p=Path(__file__).resolve().parents[1]
class Page(HTMLParser):
 def __init__(self,text):
  super().__init__(); self.tags=[];self.ids=[];self.feed(text)
 def handle_starttag(self,t,a):
  a=dict(a);self.tags.append((t,a))
  if 'id' in a:self.ids.append(a['id'])
pages={f.name:Page(f.read_text(encoding='utf-8')) for f in p.glob('*.html')}
errors=[];links=0
for file,doc in pages.items():
 text=(p/file).read_text(encoding='utf-8')
 if sum(t=='h1' for t,a in doc.tags)!=1:errors.append(file+': H1 count')
 if len(doc.ids)!=len(set(doc.ids)):errors.append(file+': duplicate IDs')
 for required in ['description','robots']:
  if not any(t=='meta' and a.get('name')==required and a.get('content') for t,a in doc.tags):errors.append(file+': missing '+required)
 if 'contact@' in text:errors.append(file+': outdated email')
 if 'H.No. 5-12/424 B, Road No. 2, Near Sai Baba Temple, Ameenpur, Ramachandrapuram, Sangareddy - 502032, Telangana, India.' not in text:errors.append(file+': address')
 for t,a in doc.tags:
  if t=='img' and not a.get('alt'):errors.append(file+': image alt')
  if t=='label' and a.get('for') not in doc.ids:errors.append(file+': label target')
  if t=='a' and a.get('target')=='_blank' and 'noopener' not in a.get('rel',''):errors.append(file+': unsafe external target')
  for attr in (['href'] if t in ['a','link'] else ['src'] if t in ['script','img'] else []):
   url=a.get(attr,'');u=urlsplit(url)
   if u.scheme or u.netloc:continue
   links+=1;target=unquote(u.path) or file
   if not (p/target).exists():errors.append(f'{file}: missing {target}')
   if u.fragment and target in pages and unquote(u.fragment) not in pages[target].ids:errors.append(f'{file}: missing fragment {url}')
ET.parse(p/'sitemap.xml')
report={'pages':len(pages),'local_links_and_assets_checked':links,'errors':errors,'result':'PASS' if not errors else 'FAIL'}
print(json.dumps(report,indent=2));raise SystemExit(bool(errors))
