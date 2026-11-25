import numpy as np, sys, subprocess
from scipy.signal import butter, sosfilt, fftconvolve, lfilter
from scipy.io import wavfile

SR = 44100
D = float(sys.argv[3])
N = int(SR * D)
rng = np.random.default_rng(7)
t = np.arange(N) / SR
K = '/root/w/kokoro/soundcn/assets/'

def lp(x, f, o=2): return sosfilt(butter(o, f, 'low', fs=SR, output='sos'), x)
def hp(x, f, o=2): return sosfilt(butter(o, f, 'high', fs=SR, output='sos'), x)
def bp(x, lo, hi, o=2): return sosfilt(butter(o, [lo, hi], 'band', fs=SR, output='sos'), x)
def mid(n): return 440 * 2 ** ((n - 69) / 12)
def st(x): return np.stack([x, x], 1) if x.ndim == 1 else x

def reverb(x, secs=3.0, mix=.35):
    L = int(SR * secs); x = st(x)
    ir = rng.standard_normal((L, 2)) * np.exp(-np.arange(L) / (SR * secs / 6.5))[:, None]
    for c in range(2): ir[:, c] = lp(ir[:, c], 5500)
    ir /= np.sqrt((ir ** 2).sum(0))
    out = np.zeros_like(x)
    for c in range(2): out[:, c] = fftconvolve(x[:, c], ir[:, c])[:len(x)]
    return x * (1 - mix) + out * mix

class Bus:
    def __init__(s): s.b = np.zeros((N, 2))
    def add(s, sig, at, g=1.0, pan=0.0):
        sig = np.asarray(sig, dtype=float)
        if sig.ndim == 1: sig = np.stack([sig * (1 - max(pan, 0)), sig * (1 + min(pan, 0))], 1)
        i = int(at * SR)
        if i >= N or i + len(sig) <= 0: return
        if i < 0: sig = sig[-i:]; i = 0
        e = min(N, i + len(sig)); s.b[i:e] += sig[:e - i] * g

def smp(rel, g=1.0):
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', K + rel, '-f', 'f32le', '-ac', '1', '-ar', str(SR), '-'], capture_output=True).stdout
    x = np.frombuffer(raw, dtype=np.float32).astype(np.float64)
    return x / (np.abs(x).max() or 1) * g

# ---------- instruments ----------
def oud(f, L=1.4, bright=.5):
    n = int(L * SR); Np = int(SR / f)
    exc = np.zeros(n); burst = rng.uniform(-1, 1, Np); exc[:Np] = lp(burst, 2000 + 4000 * bright)
    a = .996
    den = np.zeros(Np + 2); den[0] = 1; den[Np] = -a * .5; den[Np + 1] = -a * .5
    y = lfilter([1], den, exc)
    body = bp(y, 120, 3000) * .8 + y * .3
    return body * np.exp(-np.arange(n) / SR * 2.2) * .9
def doum(L=.5):
    tt = np.arange(int(L * SR)) / SR
    return (np.sin(2 * np.pi * (75 + 60 * np.exp(-tt * 25)) * tt) * np.exp(-tt * 9) + lp(rng.standard_normal(len(tt)), 300) * np.exp(-tt * 40) * .3) * 1.1
def tek(L=.12):
    tt = np.arange(int(L * SR)) / SR
    return (bp(rng.standard_normal(len(tt)), 1800, 6000) * np.exp(-tt * 70) + np.sin(2 * np.pi * 420 * tt) * np.exp(-tt * 60) * .4) * .6
def jingle(L=.25):
    tt = np.arange(int(L * SR)) / SR
    return hp(rng.standard_normal(len(tt)), 6000) * np.exp(-tt * 18) * .35
def taiko(L=1.6):
    tt = np.arange(int(L * SR)) / SR
    return (np.sin(2 * np.pi * (48 + 50 * np.exp(-tt * 14)) * tt) * np.exp(-tt * 3.5) + lp(rng.standard_normal(len(tt)), 250) * np.exp(-tt * 12) * .6) * 1.3
def boom(L=3.5):
    tt = np.arange(int(L * SR)) / SR
    return (np.sin(2 * np.pi * (34 + 55 * np.exp(-tt * 7)) * tt) * np.exp(-tt * 1.5) + lp(rng.standard_normal(len(tt)), 160) * np.exp(-tt * 2.5) * 2) * .95
def gong(f=110, L=6):
    tt = np.arange(int(L * SR)) / SR
    s = sum(a * np.sin(2 * np.pi * f * r * tt + np.sin(2 * np.pi * .7 * tt) * .3) * np.exp(-tt * d) for r, a, d in [(1, 1, .5), (1.48, .6, .7), (2.07, .5, .9), (2.76, .35, 1.2), (3.9, .25, 1.6)])
    return s * .35 * (1 - np.exp(-tt * 60))
def riser(L=2.5):
    tt = np.arange(int(L * SR)) / SR; n = rng.standard_normal(len(tt)); y = np.zeros(len(tt)); ch = 40; cl = len(tt) // ch
    for k in range(ch):
        f = 300 * 12 ** (k / ch); y[k * cl:(k + 1) * cl] = bp(n[k * cl:(k + 1) * cl], f * .8, min(f * 1.4, 18000))
    return y * (tt / L) ** 2 * 1.4
def whoosh(L=1.0):
    tt = np.arange(int(L * SR)) / SR
    return bp(rng.standard_normal(len(tt)), 250, 2500) * np.sin(np.pi * tt / L) ** 2 * 1.1
def scrape(L=1.0):  # stone etching
    tt = np.arange(int(L * SR)) / SR
    g = (np.abs(np.sin(2 * np.pi * 22 * tt + rng.random() * 6)) ** 6)
    return bp(rng.standard_normal(len(tt)), 900, 4500) * g * np.sin(np.pi * tt / L) ** .5 * .9
def heartbeat():
    tt = np.arange(int(.3 * SR)) / SR
    return np.sin(2 * np.pi * (50 + 30 * np.exp(-tt * 30)) * tt) * np.exp(-tt * 14)
def babble(L):
    tt = np.arange(int(L * SR)) / SR; n = rng.standard_normal(len(tt))
    v = sum(bp(n, f * .9, f * 1.1) * (0.5 + .5 * np.sin(2 * np.pi * (3 + k) * tt + k)) for k, f in enumerate([350, 600, 900, 1300]))
    return lp(v, 2500) * .5
def water(L):
    tt = np.arange(int(L * SR)) / SR
    return lp(rng.standard_normal(len(tt)), 900) * (0.6 + 0.4 * np.sin(2 * np.pi * 1.7 * tt)) * np.sin(np.pi * tt / L)
def shimmer(L, f=880):
    tt = np.arange(int(L * SR)) / SR
    s = sum(np.sin(2 * np.pi * f * r * (1 + .003 * k) * tt + k) for k, r in enumerate([1, 1.5, 2.01, 2.99]))
    return s * .08 * np.sin(np.pi * tt / L) ** 2


def flute(f, L, g=1.0):
    tt = np.arange(int(L * SR)) / SR
    vib = 1 + .006 * np.sin(2 * np.pi * 5.2 * tt) * np.clip(tt / .4, 0, 1)
    ph = 2 * np.pi * f * np.cumsum(vib) / SR
    s = np.sin(ph) + .25 * np.sin(2 * ph) + .08 * np.sin(3 * ph)
    br = bp(rng.standard_normal(len(tt)), f * .8, f * 3) * .12
    env_ = np.clip(tt / .12, 0, 1) * np.clip((L - tt) / .25, 0, 1)
    return (s + br) * env_ * .5 * g

# ---------- MUSIC ----------
mus = Bus()
BPM = 76; beat = 60 / BPM
def pad(notes, a, b, g=.12, cut=900):
    tt = t[int(a * SR):int(b * SR)] - a
    s = sum(((2 * ((mid(n) * r * tt) % 1) - 1)) for n in notes for r in (1, 1.004))
    s = lp(s, cut, 4) * np.clip(tt / 1.5, 0, 1) * np.clip((b - a - tt) / 1.5, 0, 1)
    mus.add(s * g, a)
dr = np.sin(2 * np.pi * mid(38) * t) * .5 + np.sin(2 * np.pi * mid(45) * t) * .25 + np.sin(2 * np.pi * mid(26) * t) * .4
dmask = np.interp(t, [0, 1, 43.4, 43.8, 47.5, 48.5, 83.2, 83.5, 92.9, 93.3, 100.2, 100.6, D], [0, .7, .9, 0, 0, .7, .9, .5, .6, 1, .8, .4, 0])
mus.add(dr * dmask * .26, 0)
pad([38, 45, 50, 53], 0, 9.5, .08)
mus.add(boom(), 0.15, .5)
# Capernaum: oud walk 9.3 -> 17
k = 0; at = 9.4
while at < 16.9:
    mus.add(oud(mid([62, 65, 67, 69, 70, 69, 67, 65][k % 8]), 1.2, .45), at, .3, -.3); at += beat / 2; k += 1
pad([38, 45, 50, 53], 9.3, 17.5, .07, 800)
# the four: doumbek march building 17.2 -> 31.6
pad([38, 45, 50, 51], 17.2, 36.8, .07, 800)
k = 0; at = 17.3
while at < 31.5:
    p = (at - 17.3) / 14.2
    mus.add(doum(), at, .35 + .35 * p, -.1)
    if k % 2: mus.add(tek(), at + beat / 2, .2 + .3 * p, .3)
    at += beat; k += 1
k = 0; at = 22.0
while at < 31.4:
    mus.add(oud(mid([62, 63, 66, 67, 69, 67, 66, 63][k % 8]), 1.0, .5), at, .25, .25); at += beat / 2; k += 1
mus.add(riser(2.0), 29.6, .45)
# lowering + their faith: shimmer
mus.add(shimmer(6.0, mid(81)), 33.5, .8)
mus.add(shimmer(4.0, mid(86)), 37.4, .7)
mus.add(riser(2.6), 41.0, .4)
# silence after 'Son, thy sins be forgiven thee'
pad([38, 45, 50, 54, 57], 44.0, 47.6, .07, 1200)
mus.add(shimmer(4.0, mid(74)), 44.0, 1.0)
# mystery 47.6 -> 56.4
pad([38, 45, 50], 47.6, 56.6, .08, 900)
mus.add(shimmer(4.0, mid(79)), 51.0, .7)
# scribes: heartbeat 56.5 -> 68.7
pad([37, 44, 50], 56.4, 68.9, .08, 700)
for k in range(int((68.5 - 56.5) / .9)): mus.add(heartbeat(), 56.5 + k * .9, .45); mus.add(heartbeat(), 56.7 + k * .9, .3)
mus.add(shimmer(4.0, mid(81)), 64.0, .7)
# which is easier: building pulse 68.8 -> 83.3
pad([38, 45, 50, 53], 68.8, 83.6, .08, 900)
k = 0; at = 69.8
while at < 83.2:
    p = (at - 69.8) / 13.4
    mus.add(doum(), at, .35 + .5 * p, -.2)
    if k % 2: mus.add(tek(), at + beat / 2, .2 + .35 * p, .3)
    at += beat * (1 if p < .6 else .5); k += 1
mus.add(riser(2.4), 81.0, .55)
# ARISE: warm resolution 83.4 -> 93
pad([38, 45, 50, 54, 57], 83.4, 93.4, .095, 1400)
mus.add(shimmer(8.0, mid(74)), 83.5, 1.0)
k = 0; at = 86.6
while at < 92.8:
    mus.add(oud(mid([62, 66, 69, 74, 69, 66][k % 6]), 1.4, .4), at, .3, -.2); at += beat / 2; k += 1
# the trial: dark 93 -> 100.3
pad([37, 44, 49], 93.0, 100.6, .09, 650)
for at in [93.8, 95.4, 97.0, 99.0]: mus.add(taiko(), at, .55)
# resolution
pad([38, 45, 50, 54, 57], 100.3, D, .085, 1300)
mus.add(shimmer(8.0, mid(74)), 101.0, .9)
k = 0; at = 100.6
while at < 103.4:
    mus.add(oud(mid([62, 66, 69, 74, 69, 66][k % 6]), 1.5, .4), at, .3, -.2); at += beat / 2; k += 1
music = reverb(mus.b, 3.2, .3)

# ---------- SFX ----------
fx = Bus()
fx.add(boom(), 0.2, .8); fx.add(gong(98), 0.25, .4)
fx.add(smp('kenney_impact-sounds/impactWood_heavy_000.ogg'), 1.4, .5); fx.add(boom(3), 1.4, .6)
fx.add(babble(2.0), 3.0, .2)
fx.add(boom(4), 5.8, .9); fx.add(gong(73, 5), 5.85, .45)
fx.add(whoosh(1.0), 7.0, .3)
fx.add(smp('kenney_rpg-audio/bookOpen.ogg'), 8.3, .5)
fx.add(boom(3), 9.4, .7); fx.add(gong(110, 4), 9.45, .35)
fx.add(babble(5.0), 11.5, .3)
fx.add(boom(3), 15.3, .8); fx.add(babble(3.0), 14.2, .35)
fx.add(boom(2.5), 17.4, .6)
for k in range(10): fx.add(smp(f'kenney_rpg-audio/footstep0{k % 6}.ogg'), 17.6 + k * .4, .18, (k % 3 - 1) * .3)
fx.add(whoosh(1.0), 21.6, .3); fx.add(boom(3), 22.9, .8)
for k in range(5): fx.add(smp(f'kenney_rpg-audio/footstep0{k % 6}.ogg'), 22.1 + k * .25, .15, .2)
fx.add(boom(2.5), 25.5, .6); fx.add(smp('kenney_impact-sounds/impactWood_medium_001.ogg'), 27.8, .4)
fx.add(smp('kenney_rpg-audio/cloth3.ogg'), 28.2, .4); fx.add(smp('kenney_impact-sounds/impactWood_medium_001.ogg'), 29.0, .3)
for k in range(5): fx.add(scrape(.5), 29.9 + k * .32, .45, (k % 2 - .5) * .4)
fx.add(boom(3), 30.8, .8)
fx.add(lp(rng.standard_normal(int(2.6 * SR)), 1800) * np.exp(-np.arange(int(2.6 * SR)) / SR * 1.2) * .5, 31.7, .6)
fx.add(babble(2.5), 32.2, .35)
fx.add(smp('kenney_rpg-audio/cloth3.ogg'), 33.8, .5); fx.add(smp('kenney_rpg-audio/cloth3.ogg'), 34.6, .4)
fx.add(boom(2.5), 35.4, .5)
fx.add(boom(3), 39.8, .8)
fx.add(whoosh(1.0), 42.2, .3)
fx.add(boom(5), 43.9, 1.1); fx.add(gong(82, 6), 43.95, .55)
fx.add(boom(3), 46.4, .7)
fx.add(smp('kenney_rpg-audio/bookFlip1.ogg'), 51.0, .5)
fx.add(boom(2.5), 55.3, .5)
fx.add(whoosh(1.0), 56.4, .3)
fx.add(boom(4), 59.2, 1.0); fx.add(gong(73, 5), 59.25, .4)
fx.add(boom(2.5), 61.5, .6)
fx.add(smp('kenney_rpg-audio/bookFlip2.ogg'), 63.9, .5); fx.add(boom(3), 66.8, .6)
fx.add(whoosh(1.0), 68.7, .3)
fx.add(smp('kenney_rpg-audio/bookFlip1.ogg'), 71.3, .4); fx.add(boom(2.5), 73.0, .6)
fx.add(boom(2), 76.2, .5); fx.add(boom(2.5), 78.1, .6)
fx.add(boom(6), 83.4, 1.3); fx.add(gong(73, 7), 83.45, .6)
fx.add(boom(3), 86.8, .8); fx.add(smp('kenney_rpg-audio/cloth3.ogg'), 87.6, .5)
for k in range(6): fx.add(smp(f'kenney_rpg-audio/footstep0{k % 6}.ogg'), 88.5 + k * .38, .2, (k % 3 - 1) * .3)
fx.add(babble(2.5), 90.7, .4)
fx.add(boom(4), 93.8, .9); fx.add(gong(98, 5), 93.85, .4)
fx.add(smp('kenney_rpg-audio/cloth3.ogg'), 96.6, .6)
fx.add(boom(5), 99.0, 1.0); fx.add(gong(73, 6), 99.05, .5)
fx.add(boom(3), 102.7, .6); fx.add(smp('kenney_impact-sounds/impactWood_heavy_000.ogg'), 102.7, .35)
fx.add(whoosh(1.2), 103.3, .4); fx.add(gong(98, 5), 103.6, .4)
sfx = reverb(fx.b, 2.0, .2)
wavfile.write(sys.argv[1], SR, (np.clip(music, -1, 1) * .9).astype(np.float32))
wavfile.write(sys.argv[2], SR, (np.clip(sfx, -1, 1) * .9).astype(np.float32))
print('ok')
