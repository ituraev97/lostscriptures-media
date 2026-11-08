"""Vertical excerpt (YouTube Short / TikTok) from the long reading: verses cut from build/vo, darkened plates with a slow push-in,
phrase captions, gold hook on top, call to the full reading at the end.
Usage: python3 short.py short.json out.mp4"""
import json, sys, os, re, subprocess
import numpy as np, soundfile as sf
from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageEnhance, ImageOps
cfg = json.load(open(sys.argv[1])); OUT = sys.argv[2]
W, H, FPS, SR = 1080, 1920, 30, 48000
FS = os.environ.get('FONTS', 'fonts_pkg/node_modules/@fontsource')
cin = lambda s: ImageFont.truetype(f'{FS}/cinzel/files/cinzel-latin-700-normal.woff', s)
cor = lambda s: ImageFont.truetype(f'{FS}/cormorant-garamond/files/cormorant-garamond-latin-600-normal.woff', s)
cori = lambda s: ImageFont.truetype(f'{FS}/cormorant-garamond/files/cormorant-garamond-latin-600-italic.woff', s)
# --- audio: pieces = [{"block":"ch06","v":["2","6"]}, {"wav":"cta.wav","text":"..."}]
audio, caps, shots, t = [], [], [], 0.6
audio.append(np.zeros(int(.6 * SR), np.float32))
for p in cfg['pieces']:
    if 'wav' in p:
        y, _ = sf.read(p['wav'], dtype='float32'); items = [(y, p['text'])]
    else:
        y_all, _ = sf.read(f"{cfg['build']}/vo/{p['block']}.wav", dtype='float32'); marks = json.load(open(f"{cfg['build']}/vo/{p['block']}.json"))
        items = [(y_all[int(m['t'] * SR): int((m['t'] + m['d']) * SR)], m['text']) for m in marks if m['v'] in p['v']]
    for y, text in items:
        text = re.sub(r'[⌜⌝〚〛‹›†]|\(\?\)', '', text); text = re.sub(r'\s+', ' ', text).strip()
        d = len(y) / SR
        # phrases of ~4-7 words, timed by character share
        words = text.split(); phrases, cur = [], []
        for w in words:
            cur.append(w)
            if len(cur) >= 7 or (len(cur) >= 3 and re.search(r'[,.;:!?’]$', w)): phrases.append(' '.join(cur)); cur = []
        if cur: phrases.append(' '.join(cur))
        tot = sum(len(x) + 4 for x in phrases); tt = t
        for ph in phrases:
            dd = d * (len(ph) + 4) / tot; caps.append((tt, tt + dd, ph)); tt += dd
        audio.append(y); t += d
        gap = p.get('gap', .9); audio.append(np.zeros(int(gap * SR), np.float32)); t += gap
END = t + cfg.get('tail', 1.2)
audio.append(np.zeros(int(cfg.get('tail', 1.2) * SR), np.float32))
vo = np.concatenate(audio)
tt = np.arange(len(vo)) / SR
bed = sum(a * np.sin(2 * np.pi * f * tt) for f, a in [(73.42, .5), (110, .3), (146.83, .2), (220, .1)]) * (.75 + .25 * np.sin(2 * np.pi * tt / 9))
bed *= np.sqrt(np.mean(vo[np.abs(vo) > .01] ** 2)) * 10 ** (-13 / 20) / np.sqrt(np.mean(bed ** 2))
bed *= np.clip(tt / 1.5, 0, 1) * np.clip((END - tt) / 1.5, 0, 1)
sf.write('' + cfg['build'] + '/short_mix.wav', vo + bed, SR)
# --- pictures: shots = [{"img":"05","until":14.0,"from":[.5,.4,1.0],"to":[.5,.3,1.15]}, ...]
def prep(name):
    im = Image.open(f"{cfg['img_dir']}/{name}.jpg").convert('RGB')
    g = ImageOps.grayscale(im); sep = ImageOps.colorize(ImageOps.autocontrast(g, cutoff=.5), (14, 10, 8), (228, 206, 170))
    return ImageEnhance.Brightness(Image.blend(ImageOps.autocontrast(im, cutoff=.5), sep, .55)).enhance(.7)
pics = {s['img']: prep(s['img']) for s in cfg['shots']}
def cam(im, fx, fy, z):
    s = max(W / im.width, H / im.height) * z; iw, ih = im.width * s, im.height * s
    left = min(0, max(W - iw, W / 2 - fx * iw)); top = min(0, max(H - ih, H / 2 - fy * ih))
    # crop box in source coords
    x0, y0 = -left / s, -top / s
    return im.resize((W, H), Image.LANCZOS, box=(x0, y0, x0 + W / s, y0 + H / s))
shade = Image.new('RGBA', (W, H)); sd = ImageDraw.Draw(shade)
for y in range(H):
    a = 0
    if y < 620: a = int(230 * (1 - y / 620) ** 1.3)
    if y > 1250: a = max(a, int(200 * ((y - 1250) / 670) ** 1.2))
    sd.line([(0, y), (W, y)], fill=(3, 3, 8, a))
def gold(d, xy, text, font):
    d.text((xy[0], xy[1] + 4), text, font=font, fill=(0, 0, 0, 200), anchor='mm')
    d.text(xy, text, font=font, fill=(242, 207, 115), anchor='mm')
def wrap(text, font, maxw, d):
    out, cur = [], ''
    for w in text.split():
        x = (cur + ' ' + w).strip()
        if d.textlength(x, font=font) > maxw and cur: out.append(cur); cur = w
        else: cur = x
    return out + [cur]
p = subprocess.Popen(['ffmpeg', '-v', 'error', '-y', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-s', f'{W}x{H}', '-r', str(FPS), '-i', '-',
                      '-i', '' + cfg['build'] + '/short_mix.wav',
                      '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '20', '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '160k',
                      '-af', 'loudnorm=I=-14:TP=-1.5', '-shortest', '-movflags', '+faststart', OUT], stdin=subprocess.PIPE)
nfr = int(END * FPS); prev = None
for f in range(nfr):
    t = f / FPS
    k = next(i for i, s in enumerate(cfg['shots']) if t < s['until'] or i == len(cfg['shots']) - 1)
    s = cfg['shots'][k]; t0 = cfg['shots'][k - 1]['until'] if k else 0; x = (t - t0) / max(.1, s['until'] - t0)
    a, b = s['from'], s['to']; z = a[2] * (b[2] / a[2]) ** x
    fr = cam(pics[s['img']], a[0] + (b[0] - a[0]) * x, a[1] + (b[1] - a[1]) * x, z)
    if k and t - t0 < .6:  # crossfade from the previous shot
        q = cfg['shots'][k - 1]; pa, pb = q['from'], q['to']
        prevf = cam(pics[q['img']], pb[0], pb[1], pb[2]); fr = Image.blend(prevf, fr, (t - t0) / .6)
    fr = fr.convert('RGBA'); fr.alpha_composite(shade); d = ImageDraw.Draw(fr)
    hook_a = 1.0
    for i, line in enumerate(cfg['hook']):
        gold(d, (W / 2, 330 + i * 92), line, cin(70 if i else 58))
    d.text((W / 2, 330 + len(cfg['hook']) * 92 - 10), cfg['sub'], font=cori(40), fill=(243, 231, 207, 210), anchor='mm')
    cap = next((c for c in caps if c[0] <= t < c[1]), None)
    if cap:
        lines = wrap(cap[2], cor(64), 860, d); y0 = 1180 - (len(lines) - 1) * 40
        bw = max(d.textlength(l, font=cor(64)) for l in lines) / 2 + 40
        d.rounded_rectangle([W / 2 - bw, y0 - 52, W / 2 + bw, y0 + (len(lines) - 1) * 80 + 52], 28, fill=(4, 4, 10, 150))
        for i, ln in enumerate(lines):
            d.text((W / 2, y0 + i * 80 + 3), ln, font=cor(64), fill=(0, 0, 0, 220), anchor='mm')
            d.text((W / 2, y0 + i * 80), ln, font=cor(64), fill=(250, 242, 225), anchor='mm')
    d.text((W / 2, 1440), cfg['credit'], font=cori(30), fill=(233, 220, 192, 170), anchor='mm')
    if t > END - cfg.get('cta_secs', 6):
        ca = min(1, (t - (END - cfg.get('cta_secs', 6))) / .5)
        d.rounded_rectangle([140, 820, 940, 1000], 40, fill=(10, 8, 16, int(225 * ca)), outline=(217, 164, 65, int(255 * ca)), width=3)
        d.text((W / 2, 880), cfg['cta'][0], font=cin(44), fill=(242, 207, 115, int(255 * ca)), anchor='mm')
        d.text((W / 2, 945), cfg['cta'][1], font=cori(40), fill=(243, 231, 207, int(255 * ca)), anchor='mm')
    p.stdin.write(fr.convert('RGB').tobytes())
p.stdin.close(); assert p.wait() == 0
print('OUT', OUT, round(END, 1), 's')
