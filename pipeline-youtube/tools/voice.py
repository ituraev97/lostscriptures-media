"""Narration: one wav per line (Kokoro, male documentary voice), then timeline.json with real durations.
    python3 tools/voice.py   -> build/vo/*.wav, film/timeline.json
"""
import hashlib, json, os, subprocess, sys
import numpy as np, soundfile as sf
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from script import S

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
VO = os.path.join(ROOT, "build", "vo"); os.makedirs(VO, exist_ok=True)
VOICE, SPEED, PITCH = "am_michael", 0.9, 0.96
_K = None

def kok():
    global _K
    if _K is None:
        from kokoro_onnx import Kokoro
        _K = Kokoro("/home/claude/tts/kokoro.onnx", "/home/claude/tts/voices.bin")
    return _K

def speak(text):
    key = hashlib.md5(f"{VOICE}|{SPEED}|{PITCH}|{text}".encode()).hexdigest()[:14]
    out = os.path.join(VO, key + ".wav")
    if not os.path.exists(out):
        s, sr = kok().create(text, voice=VOICE, speed=SPEED, lang="en-us")
        raw = out + ".raw.wav"; sf.write(raw, s, sr)
        af = f"asetrate={int(sr*PITCH)},aresample=48000,atempo={1/PITCH:.5f},highpass=f=70,equalizer=f=180:t=q:w=1:g=2,loudnorm=I=-19:TP=-2,aresample=48000"
        subprocess.run(["ffmpeg", "-loglevel", "error", "-y", "-i", raw, "-af", af, "-ac", "1", out], check=True)
        os.remove(raw)
    y, sr = sf.read(out)
    # trim trailing silence for timing
    a = np.abs(y); idx = np.where(a > 0.01)[0]
    end = (idx[-1] + 1) / sr if len(idx) else len(y) / sr
    start = idx[0] / sr if len(idx) else 0
    return out, end, start

t = 1.2
ev, vo, subs = [], [], []
for i, (kind, text, vis) in enumerate(S):
    e = {"i": i, "kind": kind, "t": round(t, 3), "vis": vis}
    if kind == "vo":
        w, d, _ = speak(text); vo.append([t, w]); subs.append([t, t + d, text])
        e["dur"] = d; t += d + 0.38
        if text.endswith(("?", "...")): t += 0.35
    elif kind == "quote":
        q, ref = text.split("|")
        e.update(text=q, ref=ref)
        t += 0.7; e["say"] = round(t, 3)
        w, d, _ = speak(q.replace("...", ",")); vo.append([t, w]); subs.append([t, t + d, q])
        e["sdur"] = d; t += d + 1.1
        e["dur"] = round(t - e["t"], 3)
    elif kind == "title":
        e["dur"] = 5.5; e["text"] = text; t += 5.5
    elif kind == "chapter":
        e["dur"] = 3.4; e["text"] = text; t += 3.4
    elif kind == "end":
        e["dur"] = 7.0; e["text"] = text; t += 7.0
    ev.append(e)
dur = round(t + 0.5, 2)
os.makedirs(os.path.join(ROOT, "film"), exist_ok=True)
json.dump({"duration": dur, "ev": ev, "vo": vo, "subs": subs}, open(os.path.join(ROOT, "film", "timeline.json"), "w"), indent=0)

def ts(x):
    h, r = divmod(x, 3600); m, s = divmod(r, 60)
    return f"{int(h):02d}:{int(m):02d}:{int(s):02d},{int((s % 1) * 1000):03d}"
with open(os.path.join(ROOT, "build", "captions_en.srt"), "w") as f:
    for k, (a, b, txt) in enumerate(subs, 1):
        f.write(f"{k}\n{ts(a)} --> {ts(b)}\n{txt}\n\n")
print("duration %.1f s (%.2f min), %d lines" % (dur, dur / 60, len(vo)))
