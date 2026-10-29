import numpy as np, sys, subprocess
from scipy.signal import butter, sosfilt, fftconvolve, lfilter
from scipy.io import wavfile

SR = 44100
D = 92.4
N = int(SR * D)
rng = np.random.default_rng(7)
t = np.arange(N) / SR
K = '/tmp/claude-0/-home-claude/33f89777-cd65-5bef-bf62-72d95a2b7331/scratchpad/soundcn/assets/'

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
BPM = 104; beat = 60 / BPM
# drone (D)
dr = np.sin(2 * np.pi * mid(38) * t) * .5 + np.sin(2 * np.pi * mid(45) * t) * .25 + np.sin(2 * np.pi * mid(26) * t) * .4
dmask = np.interp(t, [0, 2, 25.8, 27.6, 27.7, 29.0, 30, 43, 55, 67, 69.4, 70.9, 82.8, 83.4, 84.8, 90, 92.4], [0, .7, .6, .6, 0, 0, .8, .8, .9, .9, 1, .9, 1, .3, .9, .6, 0])
mus.add(dr * dmask * .28, 0)
# feast groove: doum-tek pattern (maqsum) 2.4 -> 27.69
pattern = [(0, 'D'), (1, 'T'), (1.5, 'T'), (2.5, 'D'), (3, 'T')]
bar = 0; t0 = 2.4
while True:
    bs = t0 + bar * 4 * beat
    if bs > 27.6: break
    for off, k in pattern:
        at = bs + off * beat
        if at >= 27.69: continue
        g = .55 if at < 6.6 else .8
        mus.add(doum() if k == 'D' else tek(), at, g, (-.2 if k == 'D' else .25))
    for k in range(8):
        at = bs + k * beat / 2
        if 6.6 < at < 27.69: mus.add(jingle(), at, .5 if k % 2 == 0 else .3, .5)
    bar += 1
# oud riff in D Phrygian dominant over the feast
scale = [62, 63, 66, 67, 69, 70, 72, 74]
riff = [0, 1, 2, 1, 0, 4, 3, 2, 1, 2, 1, 0]
k = 0; at = 6.6
while at < 27.4:
    n = scale[riff[k % len(riff)]] + (12 if (k // 24) % 2 else 0) - 12
    mus.add(oud(mid(n), 1.1, .6), at, .45, -.3)
    at += beat / 2 if k % 3 != 2 else beat; k += 1
# darker low strings under the sacrilege (11 -> 25.8)
def pad(notes, a, b, g=.12, cut=900):
    tt = t[int(a * SR):int(b * SR)] - a
    s = sum(((2 * ((mid(n) * r * tt) % 1) - 1)) for n in notes for r in (1, 1.004))
    s = lp(s, cut, 4) * np.clip(tt / 1.5, 0, 1) * np.clip((b - a - tt) / 1.5, 0, 1)
    mus.add(s * g, a)
pad([38, 45, 50, 53], 11.0, 25.9, .07)
# eerie section 29 -> 43
mus.add(shimmer(14.5, mid(81)), 29.0, 1.0)
mus.add(shimmer(9.0, mid(80)), 34.0, .8, .4)
for k in range(int((43 - 36.3) / .78)): mus.add(heartbeat(), 36.3 + k * .78, .7); mus.add(heartbeat(), 36.3 + k * .78 + .2, .45)
pad([50, 51, 57], 36.3, 43.2, .06, 700)
# Daniel 43 -> 55: solemn
pad([38, 50, 53, 57], 43.0, 55.2, .08, 1100)
mus.add(shimmer(6, mid(74)), 45.2, 1.0)
# verdict 55 -> 67
pad([38, 46, 50, 53], 55.0, 67.4, .08, 1000)
for at in [55.2, 58.8, 62.2]: mus.add(taiko(), at, .9)
# fall: ostinato build 70.9 -> 82.9
pad([38, 45, 50], 70.9, 83.0, .07, 800)
k = 0; at = 72.6
while at < 82.8:
    p = (at - 72.6) / 10.2
    mus.add(doum(), at, .55 + .4 * p, -.2)
    if k % 2: mus.add(tek(), at + beat / 2, .4 + .3 * p, .3)
    at += beat * (1 if p < .5 else .5); k += 1
mus.add(riser(3.0), 79.9, .5)
pad([38, 45, 50, 57], 84.6, 92.4, .09, 1200)
mus.add(shimmer(7.0, mid(74)), 85.0, .8)
music = reverb(mus.b, 3.2, .3)

# ---------- SFX ----------
fx = Bus()
lowx = lambda k=0: smp(f'kenney_sci-fi-sounds/lowFrequency_explosion_00{k}.ogg')
metal = lambda k=0: smp(f'kenney_impact-sounds/impactMetal_heavy_00{k}.ogg')
bell = lambda k=0: smp(f'kenney_impact-sounds/impactBell_heavy_00{k}.ogg')
fx.add(boom(), 0.15, .8)
fx.add(gong(98), 0.2, .5)
fx.add(whoosh(1.2), 2.3, .35)
fx.add(babble(19.5), 6.4, .35)            # crowd at the feast
fx.add(whoosh(.9), 6.5, .35)
for k in range(8): fx.add(smp('kenney_rpg-audio/handleCoins.ogg' if k % 2 else 'kenney_rpg-audio/handleCoins2.ogg'), 8.2 + k * .09, .12, (k % 3 - 1) * .4)   # counter
for k, at in enumerate([9.8, 10.0, 10.25]): fx.add(smp(f'kenney_impact-sounds/impactGlass_light_00{k}.ogg'), at, .35, (k - 1) * .4)  # cups clink
fx.add(riser(2.2), 11.5, .25)
fx.add(metal(1), 14.65, .35)               # golden cups
fx.add(gong(147, 4), 14.7, .3)
fx.add(smp('kenney_rpg-audio/metalPot1.ogg'), 19.0, .4)
for k, at in enumerate([21.18, 21.69, 22.66, 23.37, 24.26, 24.76]):
    fx.add([metal(2), metal(3), smp('kenney_impact-sounds/impactBell_heavy_001.ogg') * .5, metal(4), smp('kenney_rpg-audio/chop.ogg'), smp('kenney_impact-sounds/impactGeneric_light_002.ogg')][k], at, .3, (k % 3 - 1) * .5)
fx.add(whoosh(1.5), 25.7, .4)
fx.add(boom(4.0), 27.69, 1.0)              # music stops
fx.add(lowx(0), 29.2, .8)                  # hand
fx.add(shimmer(3, mid(93)), 29.25, 1.5)
fx.add(smp('kenney_impact-sounds/impactGlass_heavy_000.ogg'), 30.54, .25, -.3)
fx.add(smp('kenney_impact-sounds/impactGlass_heavy_001.ogg'), 31.23, .25, .3)
for k in range(4): fx.add(scrape(.7 + .2 * (k % 2)), 32.5 + k * .82, .55, (k - 1.5) * .25)   # writing
fx.add(boom(), 35.3, .55)
fx.add(smp('kenney_rpg-audio/cloth3.ogg'), 37.9, .5)
fx.add(babble(2.0), 39.3, .4)
fx.add(smp('kenney_rpg-audio/metalLatch.ogg'), 41.1, .4)
for k in range(6): fx.add(smp(f'kenney_rpg-audio/footstep0{k}.ogg'), 43.2 + k * .35, .3)   # Daniel walks in
fx.add(boom(), 45.3, .7); fx.add(gong(110), 45.35, .45)
fx.add(riser(1.6), 48.3, .3)
for k, at in enumerate([49.95, 51.13, 52.28, 53.36]):
    fx.add(boom(2.5), at, .85); fx.add(gong([98, 98, 110, 82][k], 4), at + .02, .4)
fx.add(whoosh(1.2), 54.9, .4)
fx.add(smp('kenney_rpg-audio/handleCoins.ogg'), 56.45, .35)   # numbered
fx.add(smp('kenney_rpg-audio/creak1.ogg'), 59.7, .5)          # scales
fx.add(smp('kenney_rpg-audio/creak3.ogg'), 61.3, .55)
fx.add(metal(0), 61.4, .35)
fx.add(smp('kenney_rpg-audio/knifeSlice.ogg'), 63.6, .6)       # divided
fx.add(whoosh(1.0), 65.2, .35)
fx.add(boom(4.0), 67.36, .6)
fx.add(metal(4), 69.49, .7); fx.add(boom(), 69.5, .9)          # killed: crown falls
fx.add(smp('kenney_impact-sounds/impactMetal_light_002.ogg'), 69.9, .35); fx.add(smp('kenney_impact-sounds/impactMetal_light_004.ogg'), 70.2, .25)
fx.add(smp('kenney_rpg-audio/bookOpen.ogg'), 72.7, .5)
fx.add(babble(3.0), 75.9, .25)
fx.add(water(4.0), 77.0, .6)
for k in range(22): fx.add(smp(f'kenney_impact-sounds/footstep_concrete_00{k % 5}.ogg'), 77.6 + k * .2, .22, (k % 5 - 2) * .3)
fx.add(boom(), 81.6, .6)
fx.add(boom(4.5), 82.9, .5)
fx.add(smp('kenney_impact-sounds/impactGlass_light_003.ogg'), 83.4, .35)   # cup falls
fx.add(boom(5.0), 84.8, 1.0); fx.add(gong(73, 6), 84.85, .55)
fx.add(whoosh(1.2), 86.4, .4)
fx.add(gong(147, 5), 86.7, .3)
sfx = reverb(fx.b, 2.0, .2)

wavfile.write(sys.argv[1], SR, (np.clip(music, -1, 1) * .9).astype(np.float32))
wavfile.write(sys.argv[2], SR, (np.clip(sfx, -1, 1) * .9).astype(np.float32))
print('ok')
