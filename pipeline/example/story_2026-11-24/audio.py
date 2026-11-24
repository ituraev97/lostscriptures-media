import numpy as np, sys, subprocess
from scipy.signal import butter, sosfilt, fftconvolve, lfilter
from scipy.io import wavfile

SR = 44100
D = float(sys.argv[3])
N = int(SR * D)
rng = np.random.default_rng(7)
t = np.arange(N) / SR
K = '/root/work/kokoro/soundcn/assets/'

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


# ---------- MUSIC ----------
mus = Bus()
BPM = 96; beat = 60 / BPM
def pad(notes, a, b, g=.12, cut=900):
    tt = t[int(a * SR):int(b * SR)] - a
    s = sum(((2 * ((mid(n) * r * tt) % 1) - 1)) for n in notes for r in (1, 1.004))
    s = lp(s, cut, 4) * np.clip(tt / 1.5, 0, 1) * np.clip((b - a - tt) / 1.5, 0, 1)
    mus.add(s * g, a)
dr = np.sin(2 * np.pi * mid(38) * t) * .5 + np.sin(2 * np.pi * mid(45) * t) * .25 + np.sin(2 * np.pi * mid(26) * t) * .4
dmask = np.interp(t, [0, 1, 49.2, 49.5, 50.8, 51.5, 62.4, 62.7, 63.5, 82, 86.5, 87, 95, D], [0, .7, 1, 0, 0, .8, .8, 0, .6, .8, .8, 1, .6, 0])
mus.add(dr * dmask * .26, 0)
scale = [62, 63, 66, 67, 69, 70, 72, 74]
riff = [0, 2, 1, 0, 4, 3, 2, 1]
k = 0; at = 9.0
while at < 49.2:
    n = scale[riff[k % len(riff)]] - 12 + (12 if (k // 16) % 2 else 0)
    mus.add(oud(mid(n), 1.2, .5), at, .36, -.3)
    at += beat if k % 4 != 3 else beat * 2; k += 1
at = 9.0
while at < 49.2:
    p = (at - 9.0) / 40
    mus.add(doum(), at, .35 + .4 * p, -.2); mus.add(tek(), at + beat * 1.5, .25 + .3 * p, .3)
    at += beat * 2 if at < 44.5 else beat
pad([38, 45, 50, 53], 0, 9.2, .08)
pad([38, 46, 50, 53], 36.0, 44.6, .07, 800)
mus.add(shimmer(6.0, mid(81)), 38.3, .8)
for k in range(int((49.3 - 44.6) / .7)): mus.add(heartbeat(), 44.6 + k * .7, .6); mus.add(heartbeat(), 44.8 + k * .7, .4)
mus.add(riser(2.6), 46.9, .5)
# after the verdict
pad([36, 43, 48, 51], 51.0, 62.6, .08, 800)
for at in [52.8, 54.3, 59.1]: mus.add(taiko(), at, .8)
# the name: mystery build 63 -> 86.9
pad([38, 45, 50], 63.0, 87.0, .07, 900)
mus.add(shimmer(5.0, mid(74)), 68.3, .9)
k = 0; at = 72.4
while at < 86.5:
    p = (at - 72.4) / 14
    mus.add(doum(), at, .45 + .4 * p, -.2)
    if k % 2: mus.add(tek(), at + beat / 2, .3 + .3 * p, .3)
    at += beat * (1 if p < .6 else .5); k += 1
mus.add(riser(3.0), 84.0, .5)
# resolution 87 -> end
pad([38, 45, 50, 54, 57], 87.0, D, .085, 1300)
mus.add(shimmer(8.0, mid(74)), 91.0, .9)
k = 0; at = 95.2
while at < 101.0:
    n = [62, 66, 69, 74, 69, 66][k % 6]
    mus.add(oud(mid(n), 1.5, .4), at, .3, -.2); at += beat; k += 1
music = reverb(mus.b, 3.2, .3)

# ---------- SFX ----------
fx = Bus()
metal = lambda k=0: smp(f'kenney_impact-sounds/impactMetal_heavy_00{k}.ogg')
fx.add(boom(), 0.15, .8); fx.add(gong(98), 0.2, .45)
fx.add(babble(2.5), 0.3, .25)
fx.add(whoosh(1.0), 2.4, .35)
fx.add(boom(3), 5.2, .8); fx.add(gong(110, 4), 5.25, .4)
fx.add(boom(2.5), 7.3, .6)
fx.add(smp('kenney_rpg-audio/bookOpen.ogg'), 9.0, .5)
fx.add(whoosh(1.0), 10.4, .3); fx.add(whoosh(1.0), 12.8, .3)
fx.add(boom(2.0), 13.9, .6); fx.add(metal(1), 13.9, .3)
for k in range(6): fx.add(smp(f'kenney_rpg-audio/footstep0{k}.ogg'), 15.2 + k * .4, .2, (k % 3 - 1) * .3)
fx.add(gong(147, 3), 17.0, .3)
fx.add(whoosh(1.0), 17.5, .3)
fx.add(smp('kenney_rpg-audio/cloth3.ogg'), 21.8, .4)
fx.add(boom(4.0), 23.9, 1.0); fx.add(metal(2), 23.9, .4)
fx.add(smp('kenney_rpg-audio/metalLatch.ogg'), 25.8, .3)
fx.add(boom(3.0), 27.9, .8); fx.add(metal(0), 27.9, .35)
fx.add(whoosh(1.0), 29.2, .3)
fx.add(boom(2.0), 33.1, .6); fx.add(boom(2.0), 34.0, .6)
fx.add(whoosh(1.2), 35.9, .35)
fx.add(smp('kenney_rpg-audio/bookFlip1.ogg'), 36.6, .4)
fx.add(babble(2.5), 44.6, .35); fx.add(babble(3.0), 46.6, .45)
fx.add(boom(5.0), 49.5, 1.1); fx.add(metal(3), 49.5, .45); fx.add(gong(73, 6), 49.55, .5); fx.add(babble(1.4), 49.5, .7)
fx.add(boom(3), 53.2, .7)
fx.add(water(1.4), 54.6, .5)
fx.add(boom(2.5), 59.5, .6)
for k in range(5): fx.add(smp(f'kenney_rpg-audio/footstep0{k}.ogg'), 60.5 + k * .45, .2, .3)
fx.add(whoosh(1.2), 62.6, .35); fx.add(gong(110, 4), 62.8, .3)
fx.add(boom(2.5), 65.6, .6)
fx.add(smp('kenney_rpg-audio/bookFlip2.ogg'), 68.4, .5)
for k in range(4): fx.add(scrape(.5), 68.8 + k * .45, .25, (k - 2) * .2)
fx.add(boom(5.0), 71.1, 1.0); fx.add(gong(82, 6), 71.15, .5)
fx.add(whoosh(1.0), 72.3, .3); fx.add(whoosh(1.0), 77.1, .3)
fx.add(boom(2.5), 79.8, .5)
fx.add(boom(3.5), 82.2, .8); fx.add(gong(98, 5), 82.25, .4)
fx.add(whoosh(1.0), 85.2, .3)
fx.add(boom(2.5), 87.1, .6); fx.add(boom(4.0), 89.0, .9); fx.add(gong(73, 6), 89.05, .45)
fx.add(boom(3), 91.3, .6); fx.add(boom(3), 93.8, .7)
fx.add(shimmer(3.0, mid(86)), 97.0, 1.0)
fx.add(boom(4), 99.2, .8); fx.add(gong(110, 5), 99.25, .4)
fx.add(whoosh(1.2), 101.0, .4); fx.add(gong(98, 5), 101.2, .4)
sfx = reverb(fx.b, 2.0, .2)
wavfile.write(sys.argv[1], SR, (np.clip(music, -1, 1) * .9).astype(np.float32))
wavfile.write(sys.argv[2], SR, (np.clip(sfx, -1, 1) * .9).astype(np.float32))
print('ok')
