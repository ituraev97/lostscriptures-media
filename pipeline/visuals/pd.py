#!/usr/bin/env python3
"""Public-domain picture finder for archive.org scans (Doré, Tissot, Schnorr, Roberts...).

  python3 pd.py find <item_id> <regex> [--max 30]   -> leaf numbers whose OCR text matches (page captions/titles)
  python3 pd.py sheet <item_id> <leaf> [<leaf> ...] -o sheet.jpg   -> numbered contact sheet (LOOK at it!)
  python3 pd.py get <item_id> <leaf> -o plate.jpg [--w 2400]       -> high-res page image
  python3 pd.py browse <item_id> <from_leaf> <to_leaf> -o sheet.jpg -> contact sheet of a leaf range
  python3 pd.py crop <in.jpg> <x0> <y0> <x1> <y1> -o out.jpg       -> crop by fractions (0..1) after LOOKING at the page
  python3 pd.py prep <in.jpg> <public_dir> <name> [--sepia 0.35]  -> public/<name>.jpg (+ _bg.jpg blurred backdrop); prints the Pic JSON
  python3 pd.py film-sheet <item_id> [--every 20] -o sheet.jpg     -> timestamped frames of a PD film (find the shots)
  python3 pd.py film <item_id> <start_s> <dur_s> -o clip.mp4       -> cut a silent 1080p-wide clip (no audio) from a PD film

Leaves are 0-based scan indexes (archive.org /page/n<leaf>). Text cache lives in ~/.pdcache.
"""
import os, re, sys, json, html, argparse, subprocess, urllib.request
from io import BytesIO
CACHE = os.path.expanduser('~/.pdcache'); os.makedirs(CACHE, exist_ok=True)

def fetch(url, tries=4):
    import time
    for i in range(tries):
        try:
            with urllib.request.urlopen(urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'}), timeout=120) as r:
                return r.read()
        except Exception as e:
            if i == tries - 1: raise
            time.sleep(3 * (i + 1))

def pages_text(item):
    p = os.path.join(CACHE, item + '.pages.json')
    if os.path.exists(p): return json.load(open(p))
    xml = fetch(f'https://archive.org/download/{item}/{item}_djvu.xml').decode('utf-8', 'ignore')
    pages = []
    for obj in re.split(r'<OBJECT\b', xml)[1:]:
        words = re.findall(r'<WORD[^>]*>(.*?)</WORD>', obj, re.S)
        pages.append(html.unescape(' '.join(w.strip() for w in words)))
    json.dump(pages, open(p, 'w')); return pages

def img(item, leaf, w=1800):
    from PIL import Image
    return Image.open(BytesIO(fetch(f'https://archive.org/download/{item}/page/n{leaf}_w{w}.jpg'))).convert('RGB')

def sheet(item, leaves, out, cols=6, tw=300):
    from PIL import Image, ImageDraw
    ims = []
    for l in leaves:
        try: im = img(item, l, 400)
        except Exception as e: print('skip', l, e); continue
        im.thumbnail((tw, int(tw * 1.5))); ims.append((l, im))
    if not ims: sys.exit('nothing fetched')
    th = max(i.height for _, i in ims) + 34; rows = (len(ims) + cols - 1) // cols
    S = Image.new('RGB', (cols * tw, rows * th), (20, 20, 20)); d = ImageDraw.Draw(S)
    for k, (l, im) in enumerate(ims):
        x, y = (k % cols) * tw, (k // cols) * th
        S.paste(im, (x + (tw - im.width) // 2, y + 30)); d.text((x + 6, y + 6), f'leaf {l}', fill=(255, 220, 120))
    S.save(out, quality=88); print(out, len(ims), 'pages')

def film_url(item):
    files = json.loads(fetch(f'https://archive.org/metadata/{item}/files'))['result']
    vids = [f for f in files if f['name'].lower().endswith(('.mp4', '.mpeg4', '.m4v'))] or [f for f in files if f['name'].lower().endswith(('.ogv', '.avi', '.mkv'))]
    if not vids: sys.exit('no video file in ' + item)
    f = max(vids, key=lambda f: int(f.get('size') or 0))
    url = f'https://archive.org/download/{item}/' + urllib.request.quote(f['name'])
    try:  # resolve the archive.org redirect to the data node once (ffmpeg then seeks with range requests)
        url = urllib.request.urlopen(urllib.request.Request(url, method='HEAD', headers={'User-Agent': 'Mozilla/5.0'}), timeout=60).geturl()
    except Exception: pass
    L = f.get('length') or 0
    try: L = float(L)
    except ValueError: L = sum(float(x) * 60 ** i for i, x in enumerate(reversed(str(L).split(':'))))
    return url, L

# ffmpeg does not read HTTPS_PROXY; it honours http_proxy (also for https, via CONNECT)
FENV = dict(os.environ); FENV.setdefault('http_proxy', os.environ.get('HTTPS_PROXY') or os.environ.get('https_proxy') or '')

def probe_len(url):
    r = subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', url], capture_output=True, text=True, env=FENV)
    try: return float(r.stdout.strip())
    except ValueError: return 0

if __name__ == '__main__':
    a = sys.argv[1:]
    if not a: print(__doc__); sys.exit()
    cmd = a[0]; ap = argparse.ArgumentParser(); ap.add_argument('-o', default='out.jpg'); ap.add_argument('--max', type=int, default=30); ap.add_argument('--w', type=int, default=2400)
    if cmd == 'find':
        item, rx = a[1], a[2]; o = ap.parse_args(a[3:])
        n = 0
        for i, t in enumerate(pages_text(item)):
            m = re.search(rx, t, re.I)
            if m:
                s = max(0, m.start() - 70); print(f'leaf {i}: …{t[s:m.end() + 90]}…'); n += 1
                if n >= o.max: break
    elif cmd == 'sheet':
        item = a[1]; leaves = [int(x) for x in a[2:] if x.isdigit()]; o = ap.parse_args([x for x in a[2:] if not x.isdigit()]); sheet(item, leaves, o.o)
    elif cmd == 'browse':
        item, f, t = a[1], int(a[2]), int(a[3]); o = ap.parse_args(a[4:]); sheet(item, list(range(f, t + 1)), o.o)
    elif cmd == 'crop':
        from PIL import Image
        src = a[1]; x0, y0, x1, y1 = map(float, a[2:6]); o = ap.parse_args(a[6:])
        im = Image.open(src).convert('RGB'); W_, H_ = im.size
        im.crop((int(x0 * W_), int(y0 * H_), int(x1 * W_), int(y1 * H_))).save(o.o, quality=94); print(o.o)
    elif cmd == 'prep':
        from PIL import Image, ImageFilter, ImageEnhance, ImageOps
        ap.add_argument('--sepia', type=float, default=.35); ap.add_argument('--size', dest='mx', type=int, default=2600)
        src, pub, name = a[1], a[2], a[3]; o = ap.parse_args(a[4:]); os.makedirs(pub, exist_ok=True)
        im = Image.open(src).convert('RGB'); im.thumbnail((o.mx, o.mx), Image.LANCZOS)
        im = ImageOps.autocontrast(im, cutoff=.5)
        if o.sepia > 0:  # warm multiply grade, same family as the long documentaries
            g = ImageOps.grayscale(im); sep = ImageOps.colorize(g, (28, 18, 10), (255, 236, 200))
            im = Image.blend(im, sep, o.sepia)
        im.save(f'{pub}/{name}.jpg', quality=92)
        bg = ImageOps.fit(im, (540, 960), Image.LANCZOS).filter(ImageFilter.GaussianBlur(28))
        ImageEnhance.Brightness(bg).enhance(.45).resize((1080, 1920), Image.LANCZOS).save(f'{pub}/{name}_bg.jpg', quality=85)
        print(json.dumps({'src': f'{name}.jpg', 'w': im.width, 'h': im.height, 'bg': f'{name}_bg.jpg'}))
    elif cmd == 'film-sheet':
        from PIL import Image, ImageDraw
        ap.add_argument('--every', type=float, default=20); ap.add_argument('--start', type=float, default=0); ap.add_argument('--end', type=float, default=0)
        item = a[1]; o = ap.parse_args(a[2:]); url, L = film_url(item); L = L or probe_len(url); end = o.end or L
        ts = [o.start + i * o.every for i in range(int((end - o.start) // o.every) + 1)][:60]; ims = []
        for ts_ in ts:
            r = subprocess.run(['ffmpeg', '-v', 'error', '-ss', str(ts_), '-i', url, '-frames:v', '1', '-vf', 'scale=320:-2', '-f', 'image2pipe', '-vcodec', 'mjpeg', '-'], capture_output=True, env=FENV)
            if r.stdout: ims.append((ts_, Image.open(BytesIO(r.stdout)).convert('RGB')))
        cols = 6; tw = 320; th = max(i.height for _, i in ims) + 26; S = Image.new('RGB', (cols * tw, ((len(ims) + cols - 1) // cols) * th), (15, 15, 15)); d = ImageDraw.Draw(S)
        for k, (ts_, im) in enumerate(ims):
            x, y = (k % cols) * tw, (k // cols) * th; S.paste(im, (x, y + 24)); d.text((x + 4, y + 4), f'{int(ts_ // 60)}:{ts_ % 60:04.1f}  ({ts_:.0f}s)', fill=(255, 220, 120))
        S.save(o.o, quality=88); print(o.o, len(ims), 'frames, film length', round(L), 's')
    elif cmd == 'film':
        item, st, du = a[1], float(a[2]), float(a[3]); o = ap.parse_args(a[4:]); url, _ = film_url(item)
        # remove letterbox / pillarbox bars (many archive.org transfers put 4:3 film inside 16:9)
        r = subprocess.run(['ffmpeg', '-v', 'info', '-ss', str(st), '-i', url, '-t', str(min(du, 4)), '-vf', 'cropdetect=24:2:0', '-an', '-f', 'null', '-'], capture_output=True, text=True, env=FENV)
        crops = re.findall(r'crop=(\d+:\d+:\d+:\d+)', r.stderr); crop = f'crop={crops[-1]},' if crops else ''
        subprocess.run(['ffmpeg', '-v', 'error', '-y', '-ss', str(st), '-i', url, '-t', str(du), '-an', '-vf', crop + 'scale=1080:-2:flags=lanczos,eq=contrast=1.06,format=yuv420p',
                        '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '17', '-r', '30', '-movflags', '+faststart', o.o], check=True, env=FENV)
        print(o.o, subprocess.run(['ffprobe','-v','error','-select_streams','v','-show_entries','stream=width,height','-of','csv=p=0',o.o],capture_output=True,text=True).stdout.strip(), crop)
    elif cmd == 'get':
        item, leaf = a[1], int(a[2]); o = ap.parse_args(a[3:]); img(item, leaf, o.w).save(o.o, quality=93); print(o.o)
