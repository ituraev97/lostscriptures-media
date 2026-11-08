"""Build an episode text JSON from the King James Version (public domain).
Source: https://raw.githubusercontent.com/thiagobodruk/bible/master/json/en_kjv.json (cached in ~/.pdcache).
Usage:
  python3 kjv.py ep.json --title "..." --part "Psalms 1-41"            # whole chapters
  python3 kjv.py ep.json --title "..." --part "Matthew 5-7" --part "John 14-17"
Each chapter is read with a spoken heading ("Psalm twenty-three." / "Matthew, chapter five.").
Psalm superscriptions in the KJV JSON are part of verse 1 text, as printed in the KJV; they are kept.
Then edit intro/outro in the JSON if needed (1-2 calm sentences each)."""
import json, os, re, sys, argparse, urllib.request
ap = argparse.ArgumentParser(); ap.add_argument('out'); ap.add_argument('--title', required=True); ap.add_argument('--part', action='append', required=True)
ap.add_argument('--intro'); ap.add_argument('--outro')
a = ap.parse_args()
cache = os.path.expanduser('~/.pdcache/en_kjv.json'); os.makedirs(os.path.dirname(cache), exist_ok=True)
if not os.path.exists(cache):
    urllib.request.urlretrieve('https://raw.githubusercontent.com/thiagobodruk/bible/master/json/en_kjv.json', cache)
raw = open(cache, encoding='utf-8-sig').read(); bible = json.loads(raw)
NAMES = {b['name'].lower(): b for b in bible}; NAMES.update({b['abbrev'].lower(): b for b in bible})
NUM = {0: 'zero', 1: 'one', 2: 'two', 3: 'three', 4: 'four', 5: 'five', 6: 'six', 7: 'seven', 8: 'eight', 9: 'nine', 10: 'ten', 11: 'eleven', 12: 'twelve', 13: 'thirteen', 14: 'fourteen',
       15: 'fifteen', 16: 'sixteen', 17: 'seventeen', 18: 'eighteen', 19: 'nineteen', 20: 'twenty', 30: 'thirty', 40: 'forty', 50: 'fifty', 60: 'sixty', 70: 'seventy', 80: 'eighty', 90: 'ninety'}
def words(n):
    if n >= 100: return NUM[n // 100] + ' hundred' + ('' if n % 100 == 0 else ' and ' + words(n % 100))
    return NUM.get(n) or (NUM[n // 10 * 10] + '-' + NUM[n % 10])
chapters = []
for part in a.part:
    m = re.match(r'^(.+?)\s+(\d+)(?:-(\d+))?$', part.strip()); book, c0, c1 = m.group(1), int(m.group(2)), int(m.group(3) or m.group(2))
    b = NAMES[book.lower()]
    for c in range(c0, c1 + 1):
        vs = b['chapters'][c - 1]
        vs = [re.sub(r'\{[^}]*\}', '', v) for v in vs]          # KJV italics/notes markers in this JSON are in braces
        vs = [re.sub(r'\s+([,.;:!?])', r'\1', re.sub(r'\s+', ' ', v)).strip() for v in vs]
        head = f"Psalm {words(c)}." if b['name'] == 'Psalms' else f"{b['name']}, chapter {words(c)}."
        chapters.append({'chapter': len(chapters) + 1, 'ref': f"{b['name']} {c}", 'title': head,
                         'verses': [{'v': str(i + 1), 't': v} for i, v in enumerate(vs) if v]})
ep = {'title': a.title, 'source': 'King James Version (1611/1769), public domain',
      'intro': a.intro or f"Welcome to The Lost Scriptures.\nTonight we read {', '.join(a.part)}, from the King James Bible.\nDim the lights, let your breathing slow, and let the words carry you into rest.",
      'outro': a.outro or "Here we end tonight's reading.\nRest now. Sleep well, and goodnight.", 'chapters': chapters}
json.dump(ep, open(a.out, 'w'), indent=1, ensure_ascii=False)
w = sum(len(v['t'].split()) for c in chapters for v in c['verses'])
print(a.out, len(chapters), 'chapters', w, 'words', f'~{w / 120:.0f} min at speed 0.85')
