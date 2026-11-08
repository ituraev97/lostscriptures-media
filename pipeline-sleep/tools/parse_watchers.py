"""Parse the Charles 1917 Book of the Watchers text into chapters -> verses (reading order, Ethiopic version only)."""
import re, json, sys
src = sys.argv[1]; out = sys.argv[2]
L = open(src, encoding='utf-8').read().split('\n')
start = next(i for i, l in enumerate(L) if l.strip() == 'CHAPTER 1')
end = next(i for i, l in enumerate(L) if l.strip().startswith('FROM THE SAME SITE'))
L = L[start:end]
# paragraphs
paras, cur = [], []
for l in L:
    if l.strip() == '' or set(l.strip()) <= set('='):
        if cur: paras.append(cur); cur = []
    else: cur.append(l.strip())
if cur: paras.append(cur)
chapters = {}; ch = None; skip = 0; dropped = []
for p in paras:
    head = p[0]
    if head.startswith('Greek version'): skip = 1; dropped.append(' / '.join(p)); continue
    if head.startswith('Ethiopic version'): continue
    m = re.match(r'^CHAPTERS? (\d+)(?:[–-]\d+)?:', head)
    if m and head.isupper(): continue  # Charles's section titles (editorial)
    m = re.match(r'^CHAPTER (\d+)$', head)
    body = p
    if m:
        n = int(m.group(1)); body = p[1:]
        if skip:
            skip = 0; dropped.append(' / '.join(p)); continue
        if n not in chapters: chapters[n] = []
        ch = n
        if not body: continue
        if ' '.join(body) in ' '.join(chapters[n]): dropped.append('DUPLICATE: ' + ' '.join(body)); continue
    elif skip:
        skip = 0; dropped.append(' / '.join(p)); continue
    text = ' '.join(body)
    if len(body) == 1 and not re.search(r'\[\d+\]', text) and len(text) < 90 and not text.endswith(',') and not text.startswith(('And ', 'Or ', 'But ')) and sum(w[:1].isupper() for w in text.split()) >= 0.5 * len(text.split()):
        dropped.append('SUBTITLE: ' + text); continue
    chapters[ch].append(text)
def clean(s):
    s = re.sub(r'[⌜⌝〚〛‹›†]', '', s)
    s = re.sub(r'\(\?\)', '', s)
    s = re.sub(r'\[(?!\d+\])([^\]]*)\]', r'\1', s)   # interpolation brackets: keep words
    s = re.sub(r'\(([^)]*)\)', r'\1', s)            # editor's supplied words: keep
    s = s.replace('—', ', ').replace('...', '…')
    s = re.sub(r'\s+', ' ', s).strip()
    s = re.sub(r'\s+([,.;:!?’])', r'\1', s)
    return s
res = []
for n in sorted(chapters):
    full = clean(' '.join(chapters[n]))
    parts = re.split(r'\[(\d+)\]', full)
    verses = []
    if parts[0].strip(): verses.append(('0', parts[0].strip()))
    for i in range(1, len(parts), 2): verses.append((parts[i], parts[i + 1].strip()))
    res.append({'chapter': n, 'verses': [{'v': v, 't': t} for v, t in verses if t]})
json.dump(res, open(out, 'w'), indent=1, ensure_ascii=False)
w = sum(len(v['t'].split()) for c in res for v in c['verses'])
print('chapters', len(res), [c['chapter'] for c in res], 'words', w)
print('\n'.join('DROP: ' + d[:160] for d in dropped))
