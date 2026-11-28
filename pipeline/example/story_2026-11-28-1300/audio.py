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

mus = Bus()
BPM = 80; beat = 60 / BPM
def pad(notes, a, b, g=.12, cut=900):
    tt = t[int(a * SR):int(b * SR)] - a
    s = sum(((2 * ((mid(n) * r * tt) % 1) - 1)) for n in notes for r in (1, 1.004))
    s = lp(s, cut, 4) * np.clip(tt / 1.5, 0, 1) * np.clip((b - a - tt) / 1.5, 0, 1)
    mus.add(s * g, a)
def coins(n=6):
    out = []
    return sum([], [])
dr = np.sin(2 * np.pi * mid(38) * t) * .5 + np.sin(2 * np.pi * mid(45) * t) * .25 + np.sin(2 * np.pi * mid(26) * t) * .4
dmask = np.interp(t, [0, 1, 38.4, 38.7, 39.5, 41, 63.0, 63.3, 64.3, 66, 100.5, 100.8, 102, 103.5, D], [0, .7, .9, .9, 0, .6, .9, .9, 0, .6, .9, .9, 0, .5, 0])
mus.add(dr * dmask * .26, 0)
# hook
pad([38, 45, 50, 53], 0, 6.6, .08)
mus.add(babble(5.5) * .6, 0.0, .45)
mus.add(shimmer(3.0, mid(74)), 3.0, .5)
# jericho 6.4 -> 27.6: oriental groove
pad([38, 45, 50, 53], 6.4, 27.8, .075, 950)
k = 0; at = 7.76
while at < 27.2:
    mus.add(doum(.4), at, .26, -.1)
    if k % 2: mus.add(tek(), at + beat / 2, .15, .3)
    at += beat; k += 1
k = 0; at = 10.8
while at < 27.0:
    mus.add(oud(mid([62, 63, 66, 67, 69, 67, 66, 63][k % 8]), 1.2, .5), at, .22, -.25); at += beat / 2; k += 1
mus.add(shimmer(4.0, mid(81)), 15.3, .5)
# the tree 27.6 -> 47: crowd + running pulse, drop on 'looked up'
pad([38, 45, 50, 54], 27.6, 38.6, .08, 1000)
mus.add(babble(6.0) * .6, 27.5, .5)
for at in np.arange(33.0, 38.5, beat / 2): mus.add(taiko(.8), at, .22)
mus.add(riser(2.0), 36.6, .45)
pad([38, 45, 50, 54, 57], 39.5, 47.2, .085, 1200)
mus.add(shimmer(6.0, mid(74)), 39.6, .8); mus.add(shimmer(5.0, mid(81)), 42.0, .6)
k = 0; at = 40.8
while at < 46.8:
    mus.add(flute(mid([69, 67, 66, 64, 62, 64][k % 6]), beat * 1.9, .9), at, .2, .2); at += beat * 2; k += 1
# the crowd 47.2 -> 54.4: tension
pad([37, 44, 50], 47.2, 54.6, .085, 760)
mus.add(babble(4.0) * .8, 47.2, .5)
for k in range(int((54.2 - 51.0) / .85)): mus.add(heartbeat(), 51.0 + k * .85, .4); mus.add(heartbeat(), 51.2 + k * .85, .28)
# fourfold 54.4 -> 77.7
pad([38, 45, 50, 53], 54.4, 63.3, .08, 900)
for k in range(int((63.2 - 58.9) / (beat / 2))): mus.add(tek(.08), 58.9 + k * beat / 2, .1 + .06 * (k % 2), .25)
mus.add(riser(2.2), 61.1, .45)
pad([37, 44, 50], 64.3, 77.8, .085, 800)
k = 0; at = 66.0
while at < 73.4:
    mus.add(oud(mid([62, 63, 65, 67, 68, 67, 65, 63][k % 8]), 1.0, .6), at, .2, -.3); at += beat / 2; k += 1
for at in np.arange(73.7, 77.6, beat): mus.add(taiko(1.1), at, .3)
# abraham 77.7 -> 91.6: warm resolution
pad([38, 45, 50, 54, 57], 77.7, 91.8, .09, 1300)
mus.add(shimmer(6.0, mid(74)), 79.0, .9); mus.add(shimmer(6.0, mid(81)), 85.7, .7)
k = 0; at = 79.0
while at < 91.0:
    mus.add(flute(mid([74, 73, 71, 69, 66, 69][k % 6]), beat * 1.9, .9), at, .2, .2); at += beat * 2; k += 1
# the road 91.6 -> end
pad([38, 45, 50, 53], 91.6, 100.7, .08, 900)
k = 0; at = 91.7
while at < 100.4:
    mus.add(oud(mid([62, 63, 66, 67, 69, 67, 66, 63][k % 8]), 1.0, .5), at, .18, -.25); at += beat; k += 1
for k in range(int((100.6 - 98.6) / .85)): mus.add(heartbeat(), 98.6 + k * .85, .4)
pad([38, 45, 50, 54, 57], 101.6, D, .09, 1300)
mus.add(shimmer(6.0, mid(74)), 101.7, 1.0)
k = 0; at = 103.4
while at < D - 1:
    mus.add(flute(mid([74, 73, 71, 69, 66, 69][k % 6]), beat * 1.9, .9), at, .2, .2); at += beat * 2; k += 1
music = reverb(mus.b, 3.2, .3)

def coin(g=1.0):
    return smp('kenney_rpg-audio/handleCoins%s.ogg' % ['', '2'][rng.integers(0, 2)], g)
fx = Bus()
fx.add(boom(3), 0.2, .55)
fx.add(boom(4), 2.74, .85); fx.add(gong(73, 5), 2.78, .4)
fx.add(boom(3), 3.78, .55)
fx.add(smp('kenney_rpg-audio/bookOpen.ogg'), 6.45, .5)
fx.add(whoosh(1.0), 7.3, .3); fx.add(boom(4), 7.76, .7)
fx.add(whoosh(1.0), 10.5, .3)
fx.add(coin(), 14.1, .5)
fx.add(boom(4), 15.29, .8); fx.add(gong(82, 5), 15.32, .35)
fx.add(smp('kenney_rpg-audio/bookFlip1.ogg'), 16.1, .45)
fx.add(coin(), 20.5, .6); fx.add(boom(3), 20.51, .55)
fx.add(coin(), 23.5, .45); fx.add(coin(), 24.1, .4)
fx.add(boom(4), 26.85, .8)
fx.add(whoosh(1.2), 27.3, .3)
fx.add(boom(3), 31.69, .45)
for k in range(8): fx.add(smp('kenney_impact-sounds/footstep_grass_%03d.ogg' % (k % 5)), 34.37 + k * .14, .3)
fx.add(smp('kenney_impact-sounds/impactWood_medium_00%d.ogg' % 1), 35.4, .45); fx.add(smp('kenney_impact-sounds/impactWood_light_002.ogg'), 35.9, .4)
fx.add(boom(6), 38.68, 1.1); fx.add(gong(65, 7), 38.75, .5)
fx.add(boom(3), 39.95, .55)
fx.add(boom(5), 40.77, .9)
fx.add(boom(3), 45.51, .4)
fx.add(boom(5), 47.79, .9)
fx.add(boom(4), 50.46, .8)
fx.add(boom(3), 52.91, .5)
fx.add(boom(4), 54.61, .75)
fx.add(coin(), 57.3, .5); fx.add(coin(), 57.7, .45)
fx.add(smp('kenney_rpg-audio/bookOpen.ogg'), 59.0, .5)
fx.add(boom(6), 63.3, 1.2); fx.add(gong(65, 7), 63.35, .55)
for k in range(4): fx.add(coin(), 63.4 + k * .22, .45)
fx.add(boom(4), 64.38, .8)
fx.add(boom(3), 65.0, .5)
fx.add(smp('kenney_rpg-audio/bookFlip2.ogg'), 66.0, .5); fx.add(boom(3), 69.49, .5)
fx.add(smp('kenney_rpg-audio/bookFlip1.ogg'), 70.1, .5); fx.add(boom(4), 72.47, .7)
fx.add(boom(3), 73.7, .5)
fx.add(boom(6), 76.88, 1.1); fx.add(gong(73, 5), 76.9, .45)
fx.add(boom(3), 79.03, .5)
fx.add(boom(4), 83.24, .7); fx.add(shimmer(2.5, mid(86)), 82.6, .5)
fx.add(boom(4), 84.96, .8)
fx.add(boom(4), 87.0, .7)
fx.add(shimmer(3.0, mid(86)), 90.6, .5)
fx.add(whoosh(1.4), 91.3, .35)
fx.add(boom(3), 97.49, .55)
fx.add(boom(6), 100.74, 1.1); fx.add(gong(65, 7), 100.8, .5)
fx.add(boom(3), 102.21, .5)
fx.add(whoosh(1.2), 103.0, .4); fx.add(boom(3), 103.42, .55)
sfx = reverb(fx.b, 2.0, .2)
wavfile.write(sys.argv[1], SR, (np.clip(music, -1, 1) * .9).astype(np.float32))
wavfile.write(sys.argv[2], SR, (np.clip(sfx, -1, 1) * .9).astype(np.float32))
print('ok')
