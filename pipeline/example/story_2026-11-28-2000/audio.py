import numpy as np, sys, subprocess
from scipy.signal import butter, sosfilt, fftconvolve, lfilter
from scipy.io import wavfile

SR = 44100
D = float(sys.argv[3])
N = int(SR * D)
rng = np.random.default_rng(7)
t = np.arange(N) / SR
K = '/root/kokoro/soundcn/assets/'

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

mus = Bus()
BPM = 76; beat = 60 / BPM
def pad(notes, a, b, g=.12, cut=900):
    tt = t[int(a * SR):int(b * SR)] - a
    s = sum(((2 * ((mid(n) * r * tt) % 1) - 1)) for n in notes for r in (1, 1.004))
    s = lp(s, cut, 4) * np.clip(tt / 1.5, 0, 1) * np.clip((b - a - tt) / 1.5, 0, 1)
    mus.add(s * g, a)
dr = np.sin(2 * np.pi * mid(38) * t) * .5 + np.sin(2 * np.pi * mid(45) * t) * .25 + np.sin(2 * np.pi * mid(26) * t) * .4
dmask = np.interp(t, [0, 1, 35.7, 36.0, 37.6, 39, 76.5, 76.65, 77.4, 78.5, 97, 98, D], [0, .7, .9, .9, 0, .6, .9, .9, 0, .7, .8, .3, 0])
mus.add(dr * dmask * .26, 0)
# hook 0-8.3
pad([38, 45, 50, 53], 0, 8.6, .08)
mus.add(shimmer(3.0, mid(74)), 2.3, .5)
# bethesda 8.3-29.6: water + oud
pad([38, 45, 50, 53], 8.3, 29.8, .075, 950)
mus.add(water(21.0) * .5, 8.6, .55)
k = 0; at = 9.81
while at < 22.8:
    mus.add(oud(mid([62, 63, 66, 67, 69, 67, 66, 63][k % 8]), 1.2, .5), at, .2, -.25); at += beat / 2; k += 1
k = 0; at = 9.81
while at < 22.5:
    mus.add(doum(.4), at, .22, -.1)
    if k % 2: mus.add(tek(), at + beat / 2, .12, .3)
    at += beat; k += 1
mus.add(shimmer(4.0, mid(81)), 23.2, .8); mus.add(shimmer(3.5, mid(86)), 24.2, .5)
pad([37, 44, 49], 26.4, 29.8, .08, 700)
# the question 29.7-52.9
pad([38, 45, 50, 53], 29.7, 36.1, .08, 900)
for k in range(int((35.8 - 33.0) / .85)): mus.add(heartbeat(), 33.0 + k * .85, .32)
pad([38, 45, 50, 54, 57], 38.2, 53.2, .08, 1000)
for k in range(int((48.8 - 41.5) / .9)): mus.add(heartbeat(), 41.5 + k * .9, .28)
k = 0; at = 49.2
while at < 52.6:
    mus.add(flute(mid([69, 67, 65, 64][k % 4]), beat * 1.9, .9), at, .18, .2); at += beat * 2; k += 1
# rise 52.9-61
mus.add(riser(3.0), 53.0, .5)
pad([38, 45, 50, 54, 57, 62], 55.9, 61.3, .1, 1500)
mus.add(shimmer(5.0, mid(74)), 56.0, 1.0); mus.add(shimmer(5.0, mid(81)), 57.0, .7)
k = 0; at = 56.5
while at < 60.8:
    mus.add(flute(mid([74, 76, 78, 81][k % 4]), beat * 1.5, 1.0), at, .2, .2); at += beat * 1.5; k += 1
# sabbath 61-74.4: tension
pad([37, 44, 50], 61.1, 74.6, .085, 780)
for at in np.arange(61.7, 66.2, beat): mus.add(taiko(1.0), at, .26)
for at in np.arange(66.4, 74.2, beat): mus.add(doum(.4), at, .18)
mus.add(shimmer(3.0, mid(74)), 71.2, .4)
# report 74.4-83: hard stop at the twist
pad([37, 44, 49], 74.4, 76.7, .08, 700)
mus.add(riser(1.6), 75.0, .4)
pad([36, 43, 49], 77.5, 83.3, .085, 650)
for k in range(int((83.0 - 79.5) / .8)): mus.add(heartbeat(), 79.5 + k * .8, .4)
# dig 83-97.4
pad([38, 45, 50, 53], 83.1, 97.6, .075, 950)
k = 0; at = 83.33
while at < 92.0:
    mus.add(oud(mid([62, 63, 66, 67, 69, 67, 66, 63][k % 8]), 1.0, .5), at, .2, -.25); at += beat / 2; k += 1
for at in np.arange(83.33, 92.0, beat): mus.add(doum(.4), at, .2)
mus.add(shimmer(5.0, mid(81)), 92.2, .8)
mus.add(water(5.0) * .5, 93.2, .4)
# end
pad([38, 45, 50, 54, 57], 97.4, D, .09, 1300)
mus.add(shimmer(6.0, mid(74)), 97.5, 1.0)
k = 0; at = 98.0
while at < D - 1:
    mus.add(flute(mid([74, 73, 71, 69, 66, 69][k % 6]), beat * 1.9, .9), at, .18, .2); at += beat * 2; k += 1
music = reverb(mus.b, 3.2, .3)

fx = Bus()
fx.add(boom(3), 0.2, .55)
fx.add(boom(4), 2.25, .85); fx.add(gong(73, 5), 2.3, .4)
fx.add(whoosh(1.0), 4.0, .3); fx.add(boom(4), 5.79, .75)
fx.add(whoosh(1.0), 6.3, .3)
fx.add(smp('kenney_rpg-audio/bookOpen.ogg'), 8.3, .5)
fx.add(boom(3), 9.81, .55)
fx.add(boom(5), 12.68, .9); fx.add(gong(82, 5), 12.7, .35)
fx.add(whoosh(1.0), 13.2, .3)
fx.add(whoosh(1.2), 14.8, .3)
fx.add(boom(3), 17.3, .45); fx.add(boom(3), 17.83, .4); fx.add(boom(3), 18.24, .5)
fx.add(smp('kenney_rpg-audio/bookFlip1.ogg'), 21.1, .45)
fx.add(boom(3), 22.32, .5)
fx.add(boom(5), 23.26, .8)
fx.add(smp('kenney_rpg-audio/bookOpen.ogg'), 26.5, .5)
fx.add(scrape(.6), 28.3, .5); fx.add(boom(4), 28.31, .7)
fx.add(whoosh(1.0), 29.4, .3)
fx.add(boom(5), 31.51, .9); fx.add(gong(65, 6), 31.55, .45)
fx.add(boom(6), 36.0, 1.0); fx.add(gong(73, 6), 36.05, .5)
fx.add(boom(3), 38.18, .55)
fx.add(boom(4), 40.25, .8)
fx.add(smp('kenney_rpg-audio/bookFlip2.ogg'), 41.45, .5)
fx.add(boom(3), 49.23, .5)
fx.add(boom(5), 51.69, .85)
fx.add(boom(3), 53.76, .5); fx.add(boom(3), 54.9, .5)
fx.add(boom(6), 55.99, 1.2); fx.add(gong(65, 7), 56.0, .6)
fx.add(boom(3), 58.49, .55)
fx.add(boom(5), 61.7, .85)
fx.add(boom(3), 63.53, .5)
fx.add(whoosh(1.0), 66.0, .3)
fx.add(boom(4), 71.26, .7)
fx.add(boom(3), 74.48, .45)
fx.add(boom(6), 76.6, 1.2); fx.add(gong(65, 6), 76.65, .55)
fx.add(boom(4), 77.55, .7); fx.add(boom(5), 78.46, .85)
fx.add(boom(4), 81.82, .8)
fx.add(smp('kenney_rpg-audio/bookOpen.ogg'), 83.1, .4); fx.add(boom(4), 83.33, .7)
for k in range(5): fx.add(scrape(.5), 85.9 + k * .35, .3)
fx.add(boom(4), 86.19, .8)
fx.add(whoosh(1.0), 87.2, .3)
fx.add(boom(3), 88.55, .45)
for k in range(4): fx.add(boom(2), 89.72 + k * .2, .3)
fx.add(boom(3), 90.85, .5)
fx.add(boom(5), 92.25, .85); fx.add(gong(82, 5), 92.3, .4)
fx.add(boom(5), 95.52, .85); fx.add(gong(73, 6), 95.55, .45)
fx.add(whoosh(1.2), 97.0, .4); fx.add(boom(3), 97.54, .55)
sfx = reverb(fx.b, 2.0, .2)
wavfile.write(sys.argv[1], SR, (np.clip(music, -1, 1) * .9).astype(np.float32))
wavfile.write(sys.argv[2], SR, (np.clip(sfx, -1, 1) * .9).astype(np.float32))
print('ok')
