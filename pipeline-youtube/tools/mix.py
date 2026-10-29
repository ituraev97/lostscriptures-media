"""Score + mix for the Enoch film, all synthesized: a dark ambient bed in D minor that follows the
chapters (drone, slow pads, low pulse in the judgment chapters, high shimmer for heaven), impacts on
the title and chapter cards, narration on top with the music ducked under speech, mastered to -14 LUFS.
    python3 tools/mix.py   -> build/mix.wav
"""
import json, os, subprocess, sys
import numpy as np, soundfile as sf
from scipy import signal
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import dsp
from dsp import SR, hz, filt, pad_chord, reverb

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
TL = json.load(open(os.path.join(ROOT, "film", "timeline.json")))
DUR = TL["duration"]; N = int(DUR * SR) + SR
rng = np.random.default_rng(7)
tv = lambda n: np.arange(n) / SR

def place(buf, sig, t, g=1.0, pan=0.0):
    if sig.ndim == 1:
        a = (pan + 1) / 2; sig = np.stack([sig * np.sqrt(1 - a), sig * np.sqrt(a)])
    s = int(t * SR); e = min(s + sig.shape[1], buf.shape[1])
    if e > s: buf[:, s:e] += g * sig[:, :e - s]

# ---------------------------------------------------------------- sections from the chapter cards
chap = [(0.0, "open")]
names = {"I": "man", "II": "watchers", "III": "knowledge", "IV": "giants", "V": "judgment", "VI": "heaven",
         "VII": "books", "VIII": "lost", "IX": "ethiopia", "X": "desert", "": "close"}
for e in TL["ev"]:
    if e["kind"] == "chapter": chap.append((e["t"], names.get(e["text"].split("|")[0], "close")))
    if e["kind"] == "title": chap.append((e["t"], "title"))
chap.sort()
MOOD = {  # chord roots (semitones from D), minor?, brightness, pulse?
    "open": ([0, -2, -5, -4], 900, False), "title": ([0, -4, -2, 0], 1500, False), "man": ([0, 3, -2, -4], 1100, False),
    "watchers": ([0, -4, -5, -7], 800, True), "knowledge": ([0, 1, -2, 0], 900, True), "giants": ([0, 1, 0, -2], 700, True),
    "judgment": ([0, -4, -5, -7], 750, True), "heaven": ([0, 5, 3, -2], 2200, False), "books": ([0, 3, 5, 3], 1300, False),
    "lost": ([0, -2, -4, -5], 1000, False), "ethiopia": ([0, 3, -2, 0], 1200, False), "desert": ([0, -4, -2, 3], 1300, False),
    "close": ([0, -4, 3, -2], 1500, False),
}
music = np.zeros((2, N))
D2 = 38  # midi D2
bounds = chap + [(DUR, None)]
CH = 7.5  # seconds per chord
for (t0, mood), (t1, _) in zip(bounds[:-1], bounds[1:]):
    roots, bright, pulse = MOOD[mood]
    t = t0; k = 0
    while t < t1:
        L = min(CH + 1.5, t1 - t + 1.5)
        r = D2 + 12 + roots[k % len(roots)]
        minor = (k % len(roots)) in (0, 2)
        notes = [r, r + (3 if minor else 4), r + 7, r + 12]
        nm = [dsp.note_name(m) for m in notes]
        p = pad_chord(nm, L, (bright * 0.6, bright), attack=1.8, release=1.6, voices=4, detune=0.1)
        place(music, p, t, 0.55)
        if mood == "heaven":
            for j in range(4):
                f = hz(dsp.note_name(r + 24 + [0, 7, 12, 19][j]))
                n = int(3.0 * SR); x = np.sin(2 * np.pi * f * tv(n)) * np.exp(-tv(n) / 1.6) * (1 - np.exp(-tv(n) / 0.3))
                place(music, x, t + j * 1.8, 0.05, 0.6 * (j % 2 * 2 - 1))
        t += CH; k += 1
    if pulse:  # slow heartbeat-like low pulse
        tt = t0 + 1.0
        while tt < t1 - 0.5:
            n = int(0.5 * SR); x = np.sin(2 * np.pi * 46 * tv(n)) * np.exp(-tv(n) / 0.16)
            place(music, x, tt, 0.35); place(music, x * 0.6, tt + 0.32, 0.35)
            tt += 2.2
# continuous drone (D + A), slowly breathing
n = N; tt = tv(n)
drone = (np.sin(2 * np.pi * hz("D2") * tt) + 0.6 * np.sin(2 * np.pi * hz("A2") * tt) + 0.3 * signal.sawtooth(2 * np.pi * hz("D1") * tt))
drone = filt(drone, "lowpass", 300) * (0.7 + 0.3 * np.sin(2 * np.pi * tt / 23))
music += np.stack([drone, drone]) * 0.09
# desert wind under the whole film
wind = filt(rng.standard_normal(N), "bandpass", [250, 1200]) * (0.5 + 0.5 * np.sin(2 * np.pi * tt / 17 + 1))
music += np.stack([wind, np.roll(wind, 2400)]) * 0.012
music = reverb(music, 0.35, length=3.0, decay=1.1)[:, :N]

# ---------------------------------------------------------------- impacts on cards
fx = np.zeros((2, N))
def boom(big=False):
    n = int(4.0 * SR); t = tv(n)
    f = 30 + 50 * np.exp(-t / 0.35)
    sub = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t / (1.4 if big else 0.9))
    noise = filt(rng.standard_normal(n), "lowpass", 900) * np.exp(-t / 0.5) * 0.4
    return np.tanh(1.5 * (sub + noise))
def whoosh(L=1.4):
    n = int(L * SR); t = tv(n); e = np.sin(np.pi * t / L) ** 3
    return filt(rng.standard_normal(n), "bandpass", [400, 2600]) * e
for e in TL["ev"]:
    if e["kind"] == "title": place(fx, boom(True), e["t"], 0.9); place(fx, whoosh(1.6), e["t"] - 1.2, 0.25)
    elif e["kind"] == "chapter": place(fx, boom(), e["t"] + 0.05, 0.55); place(fx, whoosh(1.2), e["t"] - 0.9, 0.18)
    elif e["kind"] == "quote": place(fx, whoosh(1.0), e["t"] - 0.2, 0.08)
    elif e["kind"] == "end": place(fx, boom(True), e["t"], 0.6)
fx = reverb(fx, 0.4, length=3.0, decay=1.2)[:, :N]

# ---------------------------------------------------------------- narration + ducking
voice = np.zeros((2, N))
for t, w in TL["vo"]:
    y, sr = sf.read(w)
    if y.ndim > 1: y = y.mean(axis=1)
    if sr != SR:  # loudnorm can write 192 kHz; never place samples at the wrong rate
        from scipy.signal import resample_poly; from math import gcd
        g_ = gcd(int(sr), int(SR)); y = resample_poly(y, int(SR) // g_, int(sr) // g_)
    place(voice, y, t, 1.0)
voice = reverb(voice, 0.06, length=0.8, decay=0.25)[:, :N]
env = np.abs(voice).max(axis=0)
hop = 480
pres = np.array([env[i:i + hop].max() for i in range(0, N, hop)]) > 0.02
pres = np.convolve(pres.astype(float), np.ones(50) / 50, mode="same") > 0.04
g = np.convolve(np.where(pres, 0.45, 1.0), np.ones(40) / 40, mode="same")
duck = np.repeat(g, hop)[:N]
if len(duck) < N: duck = np.pad(duck, (0, N - len(duck)), constant_values=1.0)

mix = voice * 1.0 + music * duck * 0.42 + fx * 0.5
fade = int(1.5 * SR); mix[:, -fade:] *= np.linspace(1, 0, fade)
mix = mix / (np.abs(mix).max() + 1e-9) * 0.9
raw = os.path.join(ROOT, "build", "mix_raw.wav"); sf.write(raw, mix.T, SR)
out = os.path.join(ROOT, "build", "mix.wav")
subprocess.run(["ffmpeg", "-loglevel", "error", "-y", "-i", raw, "-af", "loudnorm=I=-14:TP=-1.5:LRA=11", "-ar", "48000", out], check=True)
print("->", out, "%.1f s" % (N / SR))
