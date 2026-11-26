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
BPM = 76; beat = 60 / BPM
def pad(notes, a, b, g=.12, cut=900):
    tt = t[int(a * SR):int(b * SR)] - a
    s = sum(((2 * ((mid(n) * r * tt) % 1) - 1)) for n in notes for r in (1, 1.004))
    s = lp(s, cut, 4) * np.clip(tt / 1.5, 0, 1) * np.clip((b - a - tt) / 1.5, 0, 1)
    mus.add(s * g, a)
dr = np.sin(2 * np.pi * mid(38) * t) * .5 + np.sin(2 * np.pi * mid(45) * t) * .25 + np.sin(2 * np.pi * mid(26) * t) * .4
dmask = np.interp(t, [0, 1, 63.6, 64.0, 66.4, 68.6, 99.0, 99.4, 104, D], [0, .7, .9, .9, 0, .6, .8, .5, .6, 0])
mus.add(dr * dmask * .26, 0)
# hook 0 -> 9
pad([38, 45, 50, 53], 0, 9.2, .08)
mus.add(boom(), 0.15, .5)
mus.add(shimmer(3.0, mid(74)), 5.6, .7)
# the road: walking pulse 9 -> 22
pad([38, 45, 50, 52], 9.0, 22.2, .075, 900)
k = 0; at = 9.1
while at < 21.8:
    mus.add(doum(.4), at, .28, -.1)
    if k % 2: mus.add(tek(), at + beat / 2, .16, .3)
    at += beat; k += 1
k = 0; at = 11.0
while at < 21.6:
    mus.add(oud(mid([62, 64, 65, 69, 67, 65, 64, 62][k % 8]), 1.2, .45), at, .24, -.25); at += beat; k += 1
# eyes holden: mystery 22 -> 41.5
pad([37, 44, 50], 22.0, 41.6, .08, 750)
mus.add(shimmer(5.0, mid(79)), 22.2, .6)
for k in range(int((33.8 - 29.4) / .85)): mus.add(heartbeat(), 29.4 + k * .85, .4); mus.add(heartbeat(), 29.6 + k * .85, .28)
k = 0; at = 34.6
while at < 41.0:
    mus.add(flute(mid([69, 67, 65, 64, 62][k % 5]), beat * 1.9, .9), at, .22, .2); at += beat * 2; k += 1
mus.add(riser(2.0), 39.5, .4)
# fools -> scriptures 41.5 -> 52.8
pad([38, 45, 50, 53, 57], 41.5, 53.0, .085, 1000)
k = 0; at = 43.8
while at < 52.6:
    mus.add(oud(mid([62, 65, 69, 72, 70, 69, 65, 64][k % 8]), 1.2, .5), at, .26, -.3); at += beat / 2; k += 1
for at in np.arange(43.8, 52.6, beat * 2): mus.add(taiko(1.1), at, .3)
# emmaus, evening, the bread: tension builds, stops before the reveal
pad([38, 45, 50, 53], 52.8, 64.0, .08, 850)
k = 0; at = 53.0
while at < 58.3:
    mus.add(oud(mid([62, 65, 67, 69][k % 4]), 1.2, .45), at, .24, -.25); at += beat / 2; k += 1
for i, at in enumerate([58.57, 59.2, 59.78, 60.7]): mus.add(oud(mid([62, 67, 69, 74][i]), 1.6, .5), at, .32, (i % 2 - .5) * .4)
mus.add(riser(2.4), 61.5, .5)
# reveal 64.7: warm
pad([38, 45, 50, 54, 57], 64.7, 70.4, .095, 1400)
mus.add(shimmer(6.0, mid(74)), 64.75, 1.0)
mus.add(shimmer(4.0, mid(86)), 66.7, .7)
# genesis: ticking puzzle 70.4 -> 82.4
pad([38, 45, 50, 53], 70.4, 82.5, .075, 850)
for k in range(int((81.8 - 70.6) / (beat / 2))): mus.add(tek(.08), 70.6 + k * beat / 2, .11 + .07 * (k % 2), .25)
for at in [73.9, 75.1, 77.6]: mus.add(doum(), at, .45)
mus.add(shimmer(4.0, mid(81)), 78.7, .8)
# burn, walk back, Cleopas 82.4 -> 99
pad([38, 45, 50, 54], 82.4, 99.3, .085, 1100)
k = 0; at = 82.6
while at < 98.6:
    mus.add(oud(mid([62, 66, 69, 71, 69, 66, 64, 66][k % 8]), 1.3, .45), at, .24, -.2); at += beat / 2; k += 1
for at in np.arange(84.9, 98.6, beat * 2): mus.add(taiko(1.0), at, .28)
# resolution
pad([38, 45, 50, 54, 57], 99.2, D, .09, 1300)
mus.add(shimmer(8.0, mid(74)), 99.4, .9)
k = 0; at = 101.4
while at < 107.0:
    mus.add(flute(mid([74, 73, 71, 69, 66, 69][k % 6]), beat * 1.9, .9), at, .2, .2); at += beat * 2; k += 1
music = reverb(mus.b, 3.2, .3)

# ---------- SFX ----------
fx = Bus()
W_ = 'kenney_impact-sounds/impactWood_heavy_000.ogg'
fx.add(boom(), 0.2, .8); fx.add(gong(98), 0.25, .4)
fx.add(boom(3), 2.14, .7)
fx.add(boom(4), 6.0, .9); fx.add(gong(73, 5), 6.05, .45)
fx.add(smp('kenney_rpg-audio/bookOpen.ogg'), 7.6, .5)
fx.add(whoosh(1.0), 8.9, .35)
for k in range(10): fx.add(smp('kenney_impact-sounds/footstep_concrete_%03d.ogg' % (k % 5)), 9.3 + k * .55, .18)
fx.add(boom(3), 13.35, .6)
fx.add(boom(2.5), 15.58, .55)
fx.add(whoosh(1.0), 16.5, .3)
fx.add(boom(4), 21.35, .9); fx.add(gong(110, 5), 21.4, .4)
fx.add(boom(3), 23.0, .7)
fx.add(boom(2.5), 25.46, .5); fx.add(smp(W_), 26.14, .5); fx.add(boom(3), 27.0, .6)
fx.add(whoosh(1.0), 29.3, .3)
fx.add(boom(3), 32.1, .6)
fx.add(smp('kenney_rpg-audio/bookFlip1.ogg'), 34.7, .4)
fx.add(boom(3), 38.13, .6); fx.add(boom(4), 40.63, .8)
fx.add(boom(5), 41.62, 1.0); fx.add(gong(82, 5), 41.65, .45)
fx.add(smp('kenney_rpg-audio/bookOpen.ogg'), 43.8, .5)
fx.add(smp('kenney_rpg-audio/bookFlip2.ogg'), 46.0, .45)
fx.add(boom(3), 47.9, .6)
fx.add(boom(4), 51.93, .8)
fx.add(whoosh(1.2), 52.7, .35)
fx.add(boom(2.5), 54.89, .5)
fx.add(whoosh(1.0), 55.4, .3)
fx.add(smp('kenney_rpg-audio/doorClose_1.ogg'), 57.9, .35)
for at in [58.57, 59.2, 59.78, 60.7]: fx.add(boom(2.0), at, .55); fx.add(smp(W_), at, .25)
fx.add(boom(3), 61.65, .6)
fx.add(boom(6), 64.76, 1.1); fx.add(gong(73, 7), 64.8, .55)
fx.add(whoosh(1.4), 66.4, .5); fx.add(boom(4), 66.7, .8)
fx.add(boom(3), 68.44, .5)
fx.add(smp('kenney_rpg-audio/bookFlip1.ogg'), 70.5, .5)
fx.add(boom(3), 73.93, .6); fx.add(boom(4), 75.13, .8); fx.add(gong(98, 5), 75.2, .35)
fx.add(boom(3), 76.1, .6); fx.add(boom(4), 77.96, .8)
fx.add(whoosh(1.0), 78.6, .3); fx.add(boom(4), 81.75, .8)
fx.add(boom(3), 83.28, .6)
for k in range(8): fx.add(smp('kenney_impact-sounds/footstep_concrete_%03d.ogg' % (k % 5)), 85.0 + k * .45, .16)
fx.add(smp('kenney_rpg-audio/bookOpen.ogg'), 88.3, .5)
fx.add(boom(3), 91.97, .6); fx.add(boom(4), 93.46, .8)
fx.add(boom(5), 97.18, 1.0); fx.add(gong(73, 6), 97.2, .5)
fx.add(boom(3), 98.0, .5)
fx.add(whoosh(1.0), 99.2, .3)
fx.add(boom(4), 102.13, .8); fx.add(gong(98, 5), 102.2, .4)
fx.add(whoosh(1.2), 103.3, .4)
sfx = reverb(fx.b, 2.0, .2)
wavfile.write(sys.argv[1], SR, (np.clip(music, -1, 1) * .9).astype(np.float32))
wavfile.write(sys.argv[2], SR, (np.clip(sfx, -1, 1) * .9).astype(np.float32))
print('ok')
