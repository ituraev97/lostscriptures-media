"""Bible quiz Short for TikTok (1080x1920, 18–30 s): hook, question read aloud, 4 options, 3-second countdown,
answer reveal with the verse, then a book card for the shop. Pure PIL frames -> ffmpeg; voice = Kokoro.
Usage: python3 quiz.py quiz.json out.mp4"""
import json, sys, os, re, math, subprocess
import numpy as np, soundfile as sf
from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageEnhance, ImageOps
from scipy.signal import resample_poly
Q = json.load(open(sys.argv[1])); OUT = sys.argv[2]
W, H, FPS, SR = 1080, 1920, 30, 48000
FS = os.environ.get('FONTS', 'fonts_pkg/node_modules/@fontsource')
cin = lambda s: ImageFont.truetype(f'{FS}/cinzel/files/cinzel-latin-700-normal.woff', s)
cor = lambda s: ImageFont.truetype(f'{FS}/cormorant-garamond/files/cormorant-garamond-latin-700-normal.woff', s)
cori = lambda s: ImageFont.truetype(f'{FS}/cormorant-garamond/files/cormorant-garamond-latin-600-italic.woff', s)
GOLD, CREAM, NIGHT, GREEN, RED = (242, 207, 115), (243, 231, 207), (6, 5, 14), (92, 200, 120), (255, 106, 90)
TMP = os.path.splitext(OUT)[0] + '_tmp'; os.makedirs(TMP, exist_ok=True)

# ---------- voice
from kokoro_onnx import Kokoro
K = Kokoro(os.environ.get('KOKORO', '/home/claude/tts/kokoro.onnx'), os.environ.get('VOICES', '/home/claude/tts/voices.bin'))
def say(text, speed=1.0):
    y, sr = K.create(re.sub(r'\bLORD\b', 'Lord', text), voice='am_michael', speed=speed, lang='en-us'); y = np.asarray(y, np.float32)
    nz = np.where(np.abs(y) > 2e-3)[0]; y = y[max(0, nz[0] - 240): nz[-1] + 1200]
    return resample_poly(y, 2, 1).astype(np.float32)
L = 'ABCD'
lines = [('q', Q['question']), ('opts', '. '.join(f'{L[i]}: {o}' for i, o in enumerate(Q['options'])) + '.'),
         ('ans', Q['reveal_spoken']), ('cta', Q['cta_spoken'])]
V = {k: say(t, 1.0 if k != 'opts' else 1.05) for k, t in lines}
# timeline (seconds)
t = .4; T = {}
T['q0'] = t; t += len(V['q']) / SR + .25
T['o0'] = t; t += len(V['opts']) / SR + .2
T['cd0'] = t; t += 3.0                       # countdown, no voice
T['rev'] = t; t += .35
T['a0'] = t; t += len(V['ans']) / SR + .5
T['card'] = t; T['c0'] = t + .4; t = T['c0'] + len(V['cta']) / SR + 1.4
END = t
# option appearance times: spread across the options read
oinf = [T['o0'] + (len(V['opts']) / SR) * k / 4 for k in range(4)]
# ---------- audio mix
n = int(END * SR); mix = np.zeros(n, np.float32)
def put(y, at, g=1.0):
    i = int(at * SR); j = min(n, i + len(y)); mix[i:j] += g * y[:j - i]
put(V['q'], T['q0']); put(V['opts'], T['o0']); put(V['ans'], T['a0']); put(V['cta'], T['c0'])
tt = np.arange(int(.09 * SR)) / SR
tick = (np.sin(2 * np.pi * 1800 * tt) * np.exp(-tt * 60)).astype(np.float32) * .35
for k in range(3): put(tick, T['cd0'] + k, 1)
tt = np.arange(int(1.2 * SR)) / SR
ding = sum(np.sin(2 * np.pi * f * tt) * np.exp(-tt * d) for f, d in [(1318.5, 3), (1975.5, 4), (2637, 5)]).astype(np.float32) * .18
put(ding, T['rev'])
tt = np.arange(int(.35 * SR)) / SR
whoosh = (np.random.default_rng(1).standard_normal(len(tt)) * np.sin(np.pi * tt / .35) ** 2 * .08).astype(np.float32)
for at in oinf + [T['card']]: put(whoosh, at - .05)
tt = np.arange(n) / SR   # soft bed: low drone + slow pulse, ducks a little under speech
bed = (np.sin(2 * np.pi * 73.42 * tt) * .5 + np.sin(2 * np.pi * 110 * tt) * .3 + np.sin(2 * np.pi * 146.83 * tt) * .2) * (.8 + .2 * np.sin(2 * np.pi * tt * 1.0))
bed = bed * np.clip(tt / 1, 0, 1) * np.clip((END - tt) / 1, 0, 1)
vr = np.sqrt(np.mean(mix[np.abs(mix) > .01] ** 2)); bed *= vr * 10 ** (-16 / 20) / np.sqrt(np.mean(bed ** 2))
sf.write(f'{TMP}/mix.wav', mix + bed.astype(np.float32), SR)

# ---------- picture
bg = Image.open(Q['bg']).convert('RGB')
g = ImageOps.grayscale(bg); bg = Image.blend(ImageOps.autocontrast(bg, cutoff=.5), ImageOps.colorize(ImageOps.autocontrast(g, cutoff=.5), (12, 9, 8), (225, 205, 170)), .55)
bgs = {}
def background(z):
    zz = round(z, 3)
    if zz not in bgs:
        s = max(W / bg.width, H / bg.height) * zz; iw, ih = bg.width * s, bg.height * s
        x0, y0 = (iw - W) / 2 / s, (ih - H) / 2 / s
        im = bg.resize((W, H), Image.LANCZOS, box=(x0, y0, x0 + W / s, y0 + H / s))
        bgs.clear(); bgs[zz] = ImageEnhance.Brightness(im).enhance(.5)
    return bgs[zz]
shade = Image.new('RGBA', (W, H)); sd = ImageDraw.Draw(shade)
for y in range(H):
    a = int(170 * (1 - y / 700)) if y < 700 else (int(190 * ((y - 1420) / 500)) if y > 1420 else 0)
    sd.line([(0, y), (W, y)], fill=(4, 4, 10, max(0, a)))
def wrap(d, text, font, maxw):
    out, cur = [], ''
    for w in text.split():
        x = (cur + ' ' + w).strip()
        if d.textlength(x, font=font) > maxw and cur: out.append(cur); cur = w
        else: cur = x
    return out + [cur]
def ease(x): x = min(1, max(0, x)); return 1 - (1 - x) ** 3
def text_c(d, xy, s, font, fill, a=1.0, shadow=True):
    if shadow: d.text((xy[0], xy[1] + 4), s, font=font, fill=(0, 0, 0, int(200 * a)), anchor='mm')
    d.text(xy, s, font=font, fill=fill + (int(255 * a),), anchor='mm')
logo = Image.open(Q['logo']).convert('RGBA').resize((66, 66))
def book_card(fr, a, t):
    d = ImageDraw.Draw(fr)
    x0, y0, x1, y1 = 120, 600, 960, 1390
    d.rounded_rectangle([x0, y0, x1, y1], 36, fill=(10, 8, 18, int(235 * a)), outline=GOLD + (int(255 * a),), width=3)
    text_c(d, (W / 2, y0 + 70), Q['card_kicker'], cin(36), GOLD, a, False)
    # drawn book: wine cover, gold frame, title in Cinzel (no real cover image available from this environment)
    bx0, by0, bw, bh = W / 2 - 150, y0 + 125, 300, 400
    k = ease((t - T['card']) / .5); by0 += (1 - k) * 60
    d.rounded_rectangle([bx0 + 14, by0 + 10, bx0 + bw + 14, by0 + bh + 10], 10, fill=(0, 0, 0, int(160 * a)))
    d.rounded_rectangle([bx0, by0, bx0 + bw, by0 + bh], 10, fill=(92, 15, 31, int(255 * a)))
    d.rectangle([bx0, by0, bx0 + 26, by0 + bh], fill=(70, 10, 24, int(255 * a)))
    d.rounded_rectangle([bx0 + 40, by0 + 22, bx0 + bw - 18, by0 + bh - 22], 6, outline=GOLD + (int(220 * a),), width=3)
    tl = wrap(d, Q['product_short'].upper(), cin(30), bw - 90); yy = by0 + bh / 2 - (len(tl) - 1) * 20
    for i, l in enumerate(tl): d.text((bx0 + 29 + (bw - 47) / 2, yy + i * 40), l, font=cin(30), fill=GOLD + (int(255 * a),), anchor='mm')
    tl = wrap(d, Q['product_title'], cor(40), 760); yy = y0 + 590
    for i, l in enumerate(tl[:2]): text_c(d, (W / 2, yy + i * 46), l, cor(40), CREAM, a, False)
    text_c(d, (W / 2, y1 - 52), Q['card_cta'], cin(34), GOLD, a, False)
p = subprocess.Popen(['ffmpeg', '-v', 'error', '-y', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-s', f'{W}x{H}', '-r', str(FPS), '-i', '-', '-i', f'{TMP}/mix.wav',
                      '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '19', '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '160k',
                      '-af', 'loudnorm=I=-14:TP=-1.5', '-shortest', '-movflags', '+faststart', OUT], stdin=subprocess.PIPE)
nf = int(END * FPS); ans = Q['answer']
for f in range(nf):
    t = f / FPS
    fr = background(1.0 + .08 * t / END).convert('RGBA'); fr.alpha_composite(shade); d = ImageDraw.Draw(fr)
    # HUD
    fr.alpha_composite(logo, (70, 212)); d.text((152, 222), 'THE LOST SCRIPTURES', font=cin(30), fill=CREAM)
    d.text((152, 262), Q['hud_sub'], font=cori(30), fill=(243, 231, 207, 170))
    if t < T['card']:
        # hook + question
        a = ease((t - .1) / .4)
        text_c(d, (W / 2, 360), Q['hook'], cin(40), RED, a)
        qa = ease((t - T['q0'] + .1) / .35); ql = wrap(d, Q['question'], cor(66), 860); y0 = 500
        for i, l in enumerate(ql): text_c(d, (W / 2, y0 + i * 76 + (1 - qa) * 20), l, cor(66), CREAM, qa)
        oy = y0 + len(ql) * 76 + 50
        for k, o in enumerate(Q['options']):
            a = ease((t - oinf[k]) / .3)
            if a <= 0: continue
            y = oy + k * 132; revealed = t >= T['rev']
            col, fill = (GOLD, (10, 8, 18, 215))
            if revealed: col, fill = (GREEN, (20, 60, 34, 235)) if k == ans else ((150, 140, 130), (10, 8, 18, 150))
            dx = (1 - a) * 80
            d.rounded_rectangle([110 + dx, y, 970 + dx, y + 108], 54, fill=fill[:3] + (int(fill[3] * a),), outline=col + (int(255 * a),), width=4)
            d.ellipse([128 + dx, y + 14, 208 + dx, y + 94], fill=col + (int(255 * a),))
            d.text((168 + dx, y + 54), L[k], font=cin(44), fill=NIGHT + (int(255 * a),), anchor='mm')
            d.text((236 + dx, y + 54), o, font=cor(52), fill=(CREAM if not revealed or k == ans else (170, 160, 150)) + (int(255 * a),), anchor='lm')
        # countdown ring
        if T['cd0'] <= t < T['rev']:
            r = 70; cx, cy = W / 2, oy + 4 * 132 + 110; left = 3 - (t - T['cd0'])
            d.ellipse([cx - r, cy - r, cx + r, cy + r], fill=(10, 8, 18, 220), outline=(80, 70, 60, 255), width=8)
            d.arc([cx - r, cy - r, cx + r, cy + r], -90, -90 + 360 * (left / 3), fill=GOLD + (255,), width=8)
            d.text((cx, cy), str(math.ceil(left)), font=cin(64), fill=GOLD + (255,), anchor='mm')
        if t >= T['rev']:
            a = ease((t - T['rev']) / .35); y = oy + 4 * 132 + 70
            for i, l in enumerate(wrap(d, Q['reveal_text'], cori(46), 860)[:2]): text_c(d, (W / 2, y + i * 54), l, cori(46), GOLD, a)
    else:
        a = ease((t - T['card']) / .4); book_card(fr, a, t)
    fr2 = fr.convert('RGB')
    if t > END - .5: fr2 = ImageEnhance.Brightness(fr2).enhance(max(0, (END - t) / .5))
    p.stdin.write(fr2.tobytes())
p.stdin.close(); assert p.wait() == 0
json.dump({k: round(v, 2) for k, v in T.items()} | {'end': round(END, 2)}, open(f'{TMP}/timing.json', 'w'))
print('OUT', OUT, round(END, 1), 's')
