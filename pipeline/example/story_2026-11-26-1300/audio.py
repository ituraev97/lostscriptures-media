import numpy as np, sys, subprocess
from scipy.signal import butter, sosfilt, fftconvolve, lfilter
from scipy.io import wavfile

SR = 44100
D = float(sys.argv[3])
N = int(SR * D)
rng = np.random.default_rng(7)
t = np.arange(N) / SR
K = '/root/w/soundcn/assets/'

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
BPM = 72; beat = 60 / BPM
def pad(notes, a, b, g=.12, cut=900):
    tt = t[int(a * SR):int(b * SR)] - a
    s = sum(((2 * ((mid(n) * r * tt) % 1) - 1)) for n in notes for r in (1, 1.004))
    s = lp(s, cut, 4) * np.clip(tt / 1.5, 0, 1) * np.clip((b - a - tt) / 1.5, 0, 1)
    mus.add(s * g, a)
dr = np.sin(2 * np.pi * mid(38) * t) * .5 + np.sin(2 * np.pi * mid(45) * t) * .25 + np.sin(2 * np.pi * mid(26) * t) * .4
dmask = np.interp(t, [0, 1, 63.0, 63.4, 64.4, 69.0, 78.3, 78.6, 92.9, 93.3, 104.4, 105, D], [0, .7, .9, .9, 0, .5, .8, .6, .6, .9, .7, .5, 0])
mus.add(dr * dmask * .26, 0)
# hook
pad([38, 45, 50, 53], 0, 9.4, .08)
mus.add(boom(), 0.15, .5)
mus.add(shimmer(3.0, mid(74)), 5.8, .7)
# golgotha: slow taiko + oud 9.3 -> 21.5
pad([38, 45, 50, 51], 9.3, 28.9, .075, 800)
for at in np.arange(9.45, 21.4, beat * 2): mus.add(taiko(1.2), at, .35)
k = 0; at = 12.2
while at < 21.3:
    mus.add(oud(mid([62, 63, 66, 67, 69, 67, 66, 63][k % 8]), 1.1, .45), at, .26, -.25); at += beat / 2; k += 1
# mockers: heartbeat 21.5 -> 28.8
for k in range(int((28.6 - 21.6) / .85)): mus.add(heartbeat(), 21.6 + k * .85, .45); mus.add(heartbeat(), 21.8 + k * .85, .3)
mus.add(riser(2.2), 24.2, .4)
# both mocked: mystery 28.8 -> 43.8
pad([37, 44, 50], 28.8, 43.9, .08, 750)
k = 0; at = 33.7
while at < 42.8:
    p = (at - 33.7) / 9.1
    mus.add(doum(), at, .3 + .35 * p, -.1)
    if k % 2: mus.add(tek(), at + beat / 2, .18 + .3 * p, .3)
    at += beat; k += 1
mus.add(riser(2.0), 41.0, .45)
mus.add(shimmer(4.0, mid(79)), 43.0, .8)
# nine words: tension -> stop before the answer
pad([38, 45, 50, 53], 43.8, 63.4, .08, 900)
k = 0; at = 45.3
while at < 52.8:
    mus.add(oud(mid([62, 65, 67, 69, 70, 69, 67, 65][k % 8]), 1.2, .45), at, .28, -.3); at += beat / 2; k += 1
for i, at in enumerate([53.16, 53.69, 54.10, 54.52, 54.78, 55.08, 55.53, 55.69, 55.89]):
    mus.add(oud(mid([62, 65, 69, 72, 74, 77, 79, 81, 86][i]), 1.5, .5), at, .3, (i % 3 - 1) * .3)
pad([37, 44, 50], 56.6, 63.3, .07, 700)
mus.add(riser(2.4), 61.0, .5)
# answer: silence then warm 64.6 ->
pad([38, 45, 50, 54, 57], 64.6, 78.5, .095, 1400)
mus.add(shimmer(9.0, mid(74)), 64.7, 1.0)
mus.add(shimmer(6.0, mid(81)), 68.0, .8)
k = 0; at = 69.1
while at < 77.8:
    mus.add(oud(mid([62, 66, 69, 74, 69, 66][k % 6]), 1.4, .4), at, .26, -.2); at += beat / 2; k += 1
# the comma: ticking puzzle 78.4 -> 93
pad([38, 45, 50, 53], 78.4, 93.3, .075, 850)
for k in range(int((92.6 - 78.6) / (beat / 2))): mus.add(tek(.08), 78.6 + k * beat / 2, .12 + .08 * (k % 2), .25)
for at in [78.9, 81.4, 84.0, 86.0, 89.7]: mus.add(doum(), at, .45)
# names + resolution
pad([37, 44, 49], 93.2, 100.5, .085, 650)
for at in [93.4, 97.2, 98.8]: mus.add(taiko(), at, .5)
pad([38, 45, 50, 54, 57], 100.4, D, .085, 1300)
mus.add(shimmer(8.0, mid(74)), 102.0, .9)
k = 0; at = 102.2
while at < 106.0:
    mus.add(oud(mid([62, 66, 69, 74, 69, 66][k % 6]), 1.5, .4), at, .28, -.2); at += beat / 2; k += 1
music = reverb(mus.b, 3.2, .3)

# ---------- SFX ----------
fx = Bus()
W_ = 'kenney_impact-sounds/impactWood_heavy_000.ogg'
fx.add(boom(), 0.2, .8); fx.add(gong(98), 0.25, .4)
fx.add(boom(3), 2.5, .8); fx.add(smp(W_), 2.5, .4)
fx.add(boom(4), 6.6, .9); fx.add(gong(73, 5), 6.65, .45)
fx.add(smp('kenney_rpg-audio/bookOpen.ogg'), 7.95, .5)
fx.add(boom(3), 9.45, .8); fx.add(gong(110, 4), 9.5, .35)
fx.add(babble(4.0), 9.6, .25)
for at in [10.05, 10.35, 10.65]: fx.add(smp(W_), at, .3)
fx.add(whoosh(1.0), 12.0, .3); fx.add(whoosh(1.0), 13.4, .3)
fx.add(boom(2.5), 14.25, .5)
fx.add(smp('kenney_rpg-audio/bookFlip1.ogg'), 15.3, .4)
fx.add(boom(3), 17.6, .7); fx.add(boom(4), 18.4, .9); fx.add(gong(73, 5), 18.45, .4)
fx.add(boom(3), 20.76, .8)
fx.add(babble(3.5), 21.6, .45)
fx.add(smp('kenney_rpg-audio/metalClick.ogg'), 23.1, .3)
fx.add(babble(2.5), 23.2, .3)
fx.add(whoosh(1.0), 25.0, .3)
fx.add(boom(4), 26.25, 1.0); fx.add(gong(82, 5), 26.3, .45)
fx.add(babble(2.0), 28.7, .3)
fx.add(boom(3), 29.6, .6)
fx.add(smp('kenney_rpg-audio/bookFlip2.ogg'), 30.7, .5); fx.add(boom(3), 32.8, .8)
fx.add(whoosh(1.0), 33.4, .3)
fx.add(smp('kenney_rpg-audio/bookOpen.ogg'), 36.2, .5)
fx.add(boom(3), 39.3, .7)
fx.add(boom(5), 42.95, 1.0); fx.add(gong(98, 6), 43.0, .5)
fx.add(whoosh(1.0), 43.8, .3)
fx.add(boom(4), 45.4, .9)
fx.add(boom(2.5), 49.4, .5)
fx.add(whoosh(1.2), 51.4, .35)
fx.add(boom(5), 55.9, .9); fx.add(gong(73, 6), 55.95, .5)
for at in [57.56, 57.85]: fx.add(smp(W_), at, .5)
fx.add(boom(3), 60.4, .6)
fx.add(boom(6), 64.65, 1.0); fx.add(gong(73, 7), 64.7, .5)
fx.add(boom(5), 68.0, 1.1); fx.add(gong(110, 7), 68.05, .6)
fx.add(boom(3), 69.1, .6)
fx.add(whoosh(1.0), 72.3, .3)
fx.add(boom(2.5), 75.4, .5); fx.add(boom(2.5), 76.45, .5); fx.add(boom(3.5), 77.35, .8)
fx.add(boom(3), 78.9, .7); fx.add(smp('kenney_rpg-audio/bookFlip1.ogg'), 81.4, .5)
fx.add(whoosh(.8), 84.7, .45); fx.add(smp('kenney_rpg-audio/metalClick.ogg'), 85.3, .5)
fx.add(boom(3), 86.0, .5)
fx.add(smp('kenney_rpg-audio/bookOpen.ogg'), 93.3, .5)
fx.add(boom(4), 97.2, .9); fx.add(boom(4), 98.8, .9); fx.add(gong(73, 5), 98.85, .4)
fx.add(whoosh(1.0), 100.4, .3)
fx.add(boom(3), 103.5, .7); fx.add(gong(98, 5), 103.6, .4)
fx.add(whoosh(1.2), 104.4, .4)
sfx = reverb(fx.b, 2.0, .2)
wavfile.write(sys.argv[1], SR, (np.clip(music, -1, 1) * .9).astype(np.float32))
wavfile.write(sys.argv[2], SR, (np.clip(sfx, -1, 1) * .9).astype(np.float32))
print('ok')
