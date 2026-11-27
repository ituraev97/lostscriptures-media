import numpy as np, sys, subprocess
from scipy.signal import butter, sosfilt, fftconvolve, lfilter
from scipy.io import wavfile

SR = 44100
D = float(sys.argv[3])
N = int(SR * D)
rng = np.random.default_rng(7)
t = np.arange(N) / SR
K = '/home/claude/w/kokoro/soundcn/assets/'

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
def crack(L=.35):
    n = int(L * SR); tt = np.arange(n) / SR
    s = rng.standard_normal(n) * np.exp(-tt * 38)
    s = hp(s, 1800, 2) * 1.4 + np.sin(2 * np.pi * (3200 - 9000 * tt) * tt) * np.exp(-tt * 60) * .5
    pre = rng.standard_normal(int(.12 * SR)) * np.linspace(0, .25, int(.12 * SR))
    return np.concatenate([hp(pre, 3000), s]) * .9
def fire(L):
    n = int(L * SR); s = lp(rng.standard_normal(n), 900, 2) * .6 + hp(rng.standard_normal(n) * (rng.random(n) > .997), 2000) * 2
    return s * np.clip(np.arange(n) / SR / .8, 0, 1) * np.clip((L - np.arange(n) / SR) / 1.2, 0, 1)
mus = Bus()
dr = np.sin(2 * np.pi * mid(38) * t) * .5 + np.sin(2 * np.pi * mid(45) * t) * .25 + np.sin(2 * np.pi * mid(26) * t) * .4
dmask = np.interp(t, [0, 1, 34.9, 35.3, 36.0, 38.0, 94.0, 94.3, 96.5, 98.5, D], [0, .7, .9, .9, 0, .6, .9, .9, 0, .6, 0])
mus.add(dr * dmask * .26, 0)
# hook
pad([38, 45, 50, 53], 0, 4.4, .08)
mus.add(shimmer(3.0, mid(74)), 1.5, .5)
# temple / treasury 4.3 -> 31: pulse with doumbek + oud
pad([38, 45, 50, 53], 4.3, 31.2, .075, 950)
mus.add(babble(7.0) * .5, 5.5, .4)
k = 0; at = 5.3
while at < 30.6:
    mus.add(doum(.4), at, .26, -.1)
    if k % 2: mus.add(tek(), at + beat / 2, .15, .3)
    at += beat; k += 1
k = 0; at = 9.4
while at < 30.5:
    mus.add(oud(mid([62, 63, 66, 67, 69, 67, 66, 63][k % 8]), 1.2, .5), at, .22, -.25); at += beat / 2; k += 1
mus.add(shimmer(4.0, mid(81)), 18.6, .5)
mus.add(riser(2.4), 32.9, .5)
# I AM: drop out 35.3-36, then build
pad([37, 44, 50], 36.2, 40.4, .08, 760)
for at in np.arange(38.1, 40.3, beat / 2): mus.add(taiko(.9), at, .28)
# the bush 40.4 -> 55: awe, shimmer, flute
pad([38, 45, 50, 54, 57], 41.4, 55.0, .085, 1100)
mus.add(shimmer(6.0, mid(74)), 43.0, .8); mus.add(shimmer(6.0, mid(81)), 46.0, .6)
k = 0; at = 43.2
while at < 54.4:
    mus.add(flute(mid([69, 67, 66, 64, 62, 64][k % 6]), beat * 1.9, .9), at, .2, .2); at += beat * 2; k += 1
# the law 55 -> 67: tension, heartbeat, ticking
pad([37, 44, 50], 55.0, 67.0, .085, 760)
for k in range(int((60.9 - 55.2) / .85)): mus.add(heartbeat(), 55.2 + k * .85, .4); mus.add(heartbeat(), 55.4 + k * .85, .28)
for at in np.arange(60.1, 62.6, beat / 2): mus.add(taiko(.9), at, .26)
for k in range(int((75.3 - 67.0) / (beat / 2))): mus.add(tek(.08), 67.0 + k * beat / 2, .1 + .06 * (k % 2), .25)
# again 67 -> 84
pad([38, 45, 50, 53], 67.0, 84.2, .08, 850)
for at in np.arange(77.8, 84.0, beat * 2): mus.add(taiko(1.1), at, .3)
k = 0; at = 75.4
while at < 83.8:
    mus.add(oud(mid([62, 63, 66, 67, 69, 70, 69, 66][k % 8]), 1.0, .6), at, .24, -.3); at += beat / 2; k += 1
# the garden 84 -> end: night, drums, hard stop on 'fell to the ground', resolution
pad([37, 44, 49], 84.0, 96.0, .09, 800)
for k in range(int((91.0 - 86.8) / .85)): mus.add(heartbeat(), 86.8 + k * .85, .4)
mus.add(riser(2.2), 89.2, .45)
for at in np.arange(91.3, 95.6, beat): mus.add(taiko(1.4), at, .32)
pad([38, 45, 50, 54, 57], 98.6, D, .09, 1300)
mus.add(shimmer(7.0, mid(74)), 99.5, 1.0)
k = 0; at = 103.8
while at < D - 1:
    mus.add(flute(mid([74, 73, 71, 69, 66, 69][k % 6]), beat * 1.9, .9), at, .2, .2); at += beat * 2; k += 1
music = reverb(mus.b, 3.2, .3)

def stone(g=1.0):
    return smp('kenney_impact-sounds/impactPlank_medium_00%d.ogg' % rng.integers(0, 5), g)
fx = Bus()
fx.add(boom(), 0.15, .7); fx.add(boom(3), 1.01, .6)
fx.add(boom(4), 2.82, .9); fx.add(gong(73, 5), 2.85, .4)
for k in range(5): fx.add(smp('kenney_impact-sounds/impactMining_00%d.ogg' % (k % 5)), 2.9 + k * .17, .35)
fx.add(smp('kenney_rpg-audio/bookOpen.ogg'), 4.1, .5)
fx.add(whoosh(1.0), 5.0, .3); fx.add(boom(3), 5.34, .5)
fx.add(whoosh(1.0), 9.2, .3)
fx.add(boom(3), 12.0, .55)
fx.add(boom(2.5), 15.36, .45)
fx.add(shimmer(2.5, mid(86)), 19.9, .5)
fx.add(boom(3), 23.26, .6)
fx.add(boom(3), 24.45, .5)
fx.add(smp('kenney_rpg-audio/bookFlip1.ogg'), 28.3, .45); fx.add(boom(3), 28.4, .5)
fx.add(whoosh(1.2), 30.8, .3)
fx.add(boom(6), 35.45, 1.2); fx.add(gong(65, 7), 35.5, .6)
fx.add(boom(4), 37.13, .8)
fx.add(boom(5), 38.09, .8)
for k in range(8): fx.add(smp('kenney_impact-sounds/impactMining_00%d.ogg' % (k % 5)), 38.8 + k * .16 + rng.random() * .05, .45)
fx.add(boom(3), 40.4, .6)
fx.add(whoosh(1.4), 41.5, .35)
fx.add(fire(5.5) * .7, 42.9, .6); fx.add(boom(4), 43.1, .7)
fx.add(boom(5), 46.08, .9); fx.add(gong(98, 6), 47.47, .5)
fx.add(smp('kenney_rpg-audio/bookOpen.ogg'), 49.7, .5)
fx.add(boom(3), 50.93, .6); fx.add(boom(3), 52.6, .5)
fx.add(boom(4), 53.76, .8); fx.add(gong(82, 5), 53.8, .4)
fx.add(smp('kenney_rpg-audio/bookFlip2.ogg'), 55.05, .5)
fx.add(boom(5), 60.09, 1.0)
for k in range(6): fx.add(smp('kenney_impact-sounds/impactMining_00%d.ogg' % (k % 5)), 60.2 + k * .2, .4)
fx.add(whoosh(1.5), 62.6, .35)
for k in range(8): fx.add(smp('kenney_impact-sounds/footstep_concrete_%03d.ogg' % (k % 5)), 63.4 + k * .4, .18)
fx.add(smp('kenney_impact-sounds/impactWood_heavy_000.ogg'), 67.9, .4)
fx.add(smp('kenney_impact-sounds/impactWood_heavy_002.ogg'), 69.55, .5); fx.add(boom(3), 69.55, .5)
fx.add(smp('kenney_rpg-audio/bookOpen.ogg'), 72.3, .5)
fx.add(boom(3), 75.43, .5)
fx.add(boom(5), 77.82, .9)
for k in range(6): fx.add(smp('kenney_impact-sounds/impactMining_00%d.ogg' % (k % 5)), 78.0 + k * .18, .4)
fx.add(boom(4), 83.18, .8); fx.add(gong(73, 5), 83.2, .4)
fx.add(boom(3), 85.38, .5); fx.add(boom(3), 86.08, .55)
fx.add(fire(3.8) * .5, 86.8, .5)
fx.add(boom(6), 91.33, 1.2); fx.add(gong(65, 7), 91.4, .55)
fx.add(boom(3), 93.07, .6)
fx.add(whoosh(1.0), 94.0, .5); fx.add(boom(5), 94.56, 1.0)
for k in range(10): fx.add(smp('kenney_impact-sounds/impactSoft_heavy_00%d.ogg' % (k % 5)), 95.2 + k * .12 + rng.random() * .06, .5)
fx.add(boom(6), 95.75, 1.1)
fx.add(boom(4), 98.79, .8)
for k in range(5): fx.add(smp('kenney_impact-sounds/impactMining_00%d.ogg' % (k % 5)), 98.9 + k * .17, .35)
fx.add(boom(5), 101.52, .9)
fx.add(boom(3), 103.08, .6)
fx.add(whoosh(1.2), 103.8, .4)
sfx = reverb(fx.b, 2.0, .2)
wavfile.write(sys.argv[1], SR, (np.clip(music, -1, 1) * .9).astype(np.float32))
wavfile.write(sys.argv[2], SR, (np.clip(sfx, -1, 1) * .9).astype(np.float32))
print('ok')
