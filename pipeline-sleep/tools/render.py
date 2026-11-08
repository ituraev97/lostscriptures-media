"""Calm long-form video: darkened public-domain plates, crossfade every few minutes, small chapter/source caption.
Static stretches are encoded as stills (almost free); only crossfades are rendered frame by frame.
Usage: python3 render.py plan.json build out.mp4"""
import json, os, sys, subprocess, math
import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageEnhance, ImageOps
plan = json.load(open(sys.argv[1])); B = sys.argv[2]; OUT = sys.argv[3]
TL = json.load(open(f'{B}/timeline.json')); T = TL['duration']
W, H, FPS = 1920, 1080, 24
FS = os.environ.get('FONTS', 'fonts_pkg/node_modules/@fontsource')
fi = lambda s: ImageFont.truetype(f'{FS}/cormorant-garamond/files/cormorant-garamond-latin-600-italic.woff', s)
fc = lambda s: ImageFont.truetype(f'{FS}/cinzel/files/cinzel-latin-400-normal.woff', s)
SEG = f'{B}/segs'; os.makedirs(SEG, exist_ok=True); os.makedirs(f'{B}/states', exist_ok=True)
ENC = ['-c:v', 'libx264', '-preset', 'medium', '-tune', 'stillimage', '-crf', str(plan.get('crf', 28)), '-g', '2400', '-keyint_min', '48',
       '-pix_fmt', 'yuv420p', '-r', str(FPS), '-f', 'mpegts']

# ---- states: (start, image, caption, credit)
blocks = {b['block']: b for b in TL['blocks']}
events = []  # (time, image or None, caption or None)
for item in plan['schedule']:  # {"block": "ch06", "images": ["04", ...], "caption": "Chapter 6"}
    b = blocks[item['block']]; t0 = b['start'] - (plan['lead'] if item['block'] == 'intro' else 1.5)
    t0 = max(0.0, t0); dur = b['dur']
    imgs = item.get('images', [])
    for k, im in enumerate(imgs):
        events.append((t0 + dur * k / len(imgs), im, item['caption'] if k == 0 else None))
    if not imgs: events.append((t0, None, item['caption']))
events.sort(key=lambda e: e[0])
states, cur_img, cur_cap = [], None, None
for t, im, cap in events:
    cur_img = im or cur_img; cur_cap = cap or cur_cap
    if states and abs(states[-1]['t'] - t) < 1e-6: states[-1].update(img=cur_img, cap=cur_cap)
    else: states.append({'t': t, 'img': cur_img, 'cap': cur_cap})
states[0]['t'] = 0.0
for i, s in enumerate(states): s['end'] = states[i + 1]['t'] if i + 1 < len(states) else T
DIM_FROM = T - plan.get('dim_last', 600)
def dim(t): return 1.0 if t < DIM_FROM else max(.25, 1 - .75 * (t - DIM_FROM) / (T - DIM_FROM))

_cache = {}
def plate(name):
    if name in _cache: return _cache[name]
    im = Image.open(f"{plan['img_dir']}/{name}.jpg").convert('RGB')
    g = ImageOps.grayscale(im); sep = ImageOps.colorize(ImageOps.autocontrast(g, cutoff=.5), (14, 10, 8), (228, 206, 170))
    im = Image.blend(ImageOps.autocontrast(im, cutoff=.5), sep, .55)
    im = ImageEnhance.Brightness(im).enhance(.62)
    s = min(W / im.width, H / im.height) if im.width / im.height > 1.45 else H / im.height * .98
    fg = im.resize((int(im.width * s), int(im.height * s)), Image.LANCZOS)
    bg = ImageOps.fit(im, (W // 4, H // 4)).filter(ImageFilter.GaussianBlur(14)).resize((W, H), Image.LANCZOS)
    bg = ImageEnhance.Brightness(bg).enhance(.35)
    _cache[name] = (fg, bg); return fg, bg
vign = Image.new('L', (W, H), 0); dv = ImageDraw.Draw(vign); dv.ellipse([-W * .25, -H * .35, W * 1.25, H * 1.35], fill=255)
vign = vign.filter(ImageFilter.GaussianBlur(220))
def frame(s):
    fg, bg = plate(s['img']); c = bg.copy()
    c.paste(fg, ((W - fg.width) // 2, (H - fg.height) // 2))
    c = Image.composite(c, Image.new('RGB', (W, H), (3, 3, 6)), vign)
    d = ImageDraw.Draw(c, 'RGBA')
    d.rectangle([0, H - 120, W, H], fill=(0, 0, 0, 90))
    d.text((70, H - 96), s['cap'], font=fc(30), fill=(233, 220, 192, 150))
    d.text((70, H - 54), plan['credits'][s['img']] + '  ·  ' + plan['text_credit'], font=fi(28), fill=(233, 220, 192, 120))
    k = dim((s['t'] + s['end']) / 2)
    if k < 1: c = ImageEnhance.Brightness(c).enhance(k)
    return c
for i, s in enumerate(states):
    p = f"{B}/states/{i:03d}.png"
    if not os.path.exists(p): frame(s).save(p)
    s['png'] = p

# ---- segments
def nf(sec): return max(1, int(round(sec * FPS)))
segs = []; cursor = 0  # frames
bounds = []
for i in range(1, len(states)):
    img_change = states[i]['img'] != states[i - 1]['img']
    bounds.append(plan.get('fade_img', 3.0) if img_change else plan.get('fade_cap', .6))
total_frames = nf(T)
def run_static(png, frames, out):
    if os.path.exists(out): return
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-loop', '1', '-framerate', str(FPS), '-i', png, '-frames:v', str(frames)] + ENC + [out + '.tmp'], check=True); os.replace(out + '.tmp', out)
def run_fade(a, b, frames, out):
    if os.path.exists(out): return
    A = np.asarray(Image.open(a).convert('RGB'), dtype=np.float32); Bm = np.asarray(Image.open(b).convert('RGB'), dtype=np.float32)
    p = subprocess.Popen(['ffmpeg', '-v', 'error', '-y', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-s', f'{W}x{H}', '-r', str(FPS), '-i', '-'] + ENC + [out + '.tmp'], stdin=subprocess.PIPE)
    for k in range(frames):
        x = (k + .5) / frames; x = x * x * (3 - 2 * x)
        p.stdin.write((A * (1 - x) + Bm * x).astype(np.uint8).tobytes())
    p.stdin.close(); assert p.wait() == 0; os.replace(out + '.tmp', out)
pos = 0
for i, s in enumerate(states):
    end_f = nf(s['end'])
    tail = nf(bounds[i] / 2) if i < len(states) - 1 else 0
    head_skip = nf(bounds[i - 1] / 2) if i > 0 else 0
    still_frames = end_f - tail - pos
    if still_frames > 0:
        out = f'{SEG}/s{i:03d}.ts'; run_static(s['png'], still_frames, out); segs.append(out); pos += still_frames
    if i < len(states) - 1:
        fl = nf(bounds[i]); out = f'{SEG}/f{i:03d}.ts'; run_fade(s['png'], states[i + 1]['png'], fl, out); segs.append(out); pos += fl
    print(f'state {i + 1}/{len(states)}', flush=True)
with open(f'{B}/segs.txt', 'w') as f:
    for s in segs: f.write(f"file '{os.path.abspath(s)}'\n")
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 'concat', '-safe', '0', '-i', f'{B}/segs.txt', '-i', f'{B}/mix.wav', '-map', '0:v', '-map', '1:a',
                '-c:v', 'copy', '-c:a', 'aac', '-b:a', str(plan.get('abr', '96k')), '-ac', '1', '-shortest', '-movflags', '+faststart', OUT], check=True)
json.dump(states, open(f'{B}/states.json', 'w'), indent=1)
print('FINAL', OUT, round(os.path.getsize(OUT) / 1e6, 1), 'MB')
