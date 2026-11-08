"""Chapter-by-chapter Kokoro synthesis with resume. Writes build/vo/chNN.wav (48 kHz mono) + build/timeline.json.
Usage: python3 synth.py text.json build [--voice am_michael --speed 0.85]"""
import json, os, re, sys, unicodedata, random, argparse
import numpy as np, soundfile as sf
from scipy.signal import resample_poly
ap = argparse.ArgumentParser(); ap.add_argument('src'); ap.add_argument('out'); ap.add_argument('--voice', default='am_michael'); ap.add_argument('--speed', type=float, default=.85)
a = ap.parse_args()
from kokoro_onnx import Kokoro
k = Kokoro('/home/claude/tts/kokoro.onnx', '/home/claude/tts/voices.bin')
SR, OUT_SR = 24000, 48000
os.makedirs(f'{a.out}/vo', exist_ok=True)
NUM = {0:'zero',1:'one',2:'two',3:'three',4:'four',5:'five',6:'six',7:'seven',8:'eight',9:'nine',10:'ten',11:'eleven',12:'twelve',13:'thirteen',14:'fourteen',15:'fifteen',16:'sixteen',17:'seventeen',18:'eighteen',19:'nineteen',20:'twenty',30:'thirty',40:'forty',50:'fifty',60:'sixty',70:'seventy',80:'eighty',90:'ninety'}
def words(n):
    if n >= 100: return NUM[n // 100] + ' hundred' + ('' if n % 100 == 0 else ' and ' + words(n % 100))
    return NUM.get(n) or (NUM[n // 10 * 10] + '-' + NUM[n % 10])
FIX = {'Azazel': 'Azazel', 'Semjaza': 'Semyaza', 'Sheol': 'Sheol', 'Erythraean': 'Erythrean'}
def norm(s):
    s = unicodedata.normalize('NFKD', s); s = ''.join(c for c in s if not unicodedata.combining(c))
    s = s.replace('’', "'").replace('‘', "'").replace('“', '"').replace('”', '"')
    for x, y in FIX.items(): s = s.replace(x, y)
    s = re.sub(r'\bLORD\b', 'Lord', s); s = re.sub(r'\bGOD\b', 'God', s); s = re.sub(r'\bJEHOVAH\b', 'Jehovah', s)
    return s
def say(text):
    text = norm(text); chunks = []
    if len(text) > 280:  # keep Kokoro under its token limit: split at sentence / semicolon boundaries
        parts = re.split(r'(?<=[.;:!?])\s+', text); cur = ''
        for p in parts:
            if len(cur) + len(p) > 280 and cur: chunks.append(cur); cur = p
            else: cur = (cur + ' ' + p).strip()
        if cur: chunks.append(cur)
    else: chunks = [text]
    out = []
    for i, c in enumerate(chunks):
        if len(c) > 400:  # still too long: split at commas
            sub = re.split(r'(?<=,)\s+', c); cur = ''
            for p in sub:
                if len(cur) + len(p) > 300 and cur: out.append(gen(cur)); out.append(np.zeros(int(.3 * SR))); cur = p
                else: cur = (cur + ' ' + p).strip()
            if cur: out.append(gen(cur))
        else: out.append(gen(c))
        if i < len(chunks) - 1: out.append(np.zeros(int(.45 * SR)))
    return np.concatenate(out)
def gen(t):
    y, sr = k.create(t, voice=a.voice, speed=a.speed, lang='en-us')
    y = np.asarray(y, dtype=np.float32)
    nz = np.where(np.abs(y) > 2e-3)[0]  # trim edge silence
    return y[max(0, nz[0] - 240): nz[-1] + 2400] if len(nz) else y
data = json.load(open(a.src)); rnd = random.Random(7)
blocks = [('intro', data['intro'])] + [(f"ch{c['chapter']:02d}", c) for c in data['chapters']] + [('outro', data['outro'])]
for name, b in blocks:
    path = f'{a.out}/vo/{name}.wav'
    if os.path.exists(path): continue
    segs, marks = [], []
    t = 0.0
    if isinstance(b, str):
        lines = [(None, l) for l in b.split('\n') if l.strip()]
    else:
        lines = [('title', b.get('title') or f"Chapter {words(b['chapter'])}.")] + [(v['v'], v['t']) for v in b['verses']]
    for i, (v, txt) in enumerate(lines):
        y = say(txt); marks.append({'v': v, 't': round(t, 2), 'd': round(len(y) / SR, 2), 'text': txt})
        segs.append(y); t += len(y) / SR
        gap = 2.0 if v == 'title' else rnd.uniform(.8, 1.2) if i < len(lines) - 1 else 0
        segs.append(np.zeros(int(gap * SR))); t += gap
    y = np.concatenate(segs); y = resample_poly(y, 2, 1)
    sf.write(path + '.tmp.wav', y, OUT_SR); os.replace(path + '.tmp.wav', path)
    json.dump(marks, open(f'{a.out}/vo/{name}.json', 'w'), indent=0)
    print(name, round(len(y) / OUT_SR, 1), 's', flush=True)
print('SYNTH DONE')
