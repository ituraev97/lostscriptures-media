"""Join chapter voice files with chapter gaps, synthesize a quiet drone bed, mix, normalise.
Writes build/voice.wav, build/bed.wav, build/mix.wav (48 kHz mono, about -18 LUFS) and build/timeline.json.
Usage: python3 assemble.py ep.json build"""
import json, os, sys, subprocess
import numpy as np, soundfile as sf
ep = json.load(open(sys.argv[1])); B = sys.argv[2]; SR = 48000
blocks = ['intro'] + [f"ch{c['chapter']:02d}" for c in ep['chapters']] + ['outro']
LEAD, CH_GAP, TAIL = 6.0, 3.5, 25.0   # seconds: silence before the first words, between chapters, after the last words
timeline, t = [], LEAD
with sf.SoundFile(f'{B}/voice.wav', 'w', SR, 1, 'PCM_16') as out:
    out.write(np.zeros(int(LEAD * SR), dtype=np.float32))
    for name in blocks:
        y, sr = sf.read(f'{B}/vo/{name}.wav', dtype='float32'); assert sr == SR, (name, sr)
        marks = json.load(open(f'{B}/vo/{name}.json'))
        timeline.append({'block': name, 'start': round(t, 2), 'dur': round(len(y) / SR, 2), 'marks': marks})
        out.write(y); t += len(y) / SR
        out.write(np.zeros(int(CH_GAP * SR), dtype=np.float32)); t += CH_GAP
    out.write(np.zeros(int(TAIL * SR), dtype=np.float32)); t += TAIL
total = t
json.dump({'duration': round(total, 2), 'blocks': timeline}, open(f'{B}/timeline.json', 'w'), indent=1)

# drone bed: D-minor pad, chords change every ~40 s with long crossfades, gentle filtered noise "air"; continuous phase in chunks
chords = [[73.42, 110.0, 146.83, 174.61, 220.0], [65.41, 98.0, 130.81, 164.81, 196.0], [58.27, 87.31, 116.54, 146.83, 174.61], [69.30, 103.83, 138.59, 174.61, 207.65]]
amps = [.5, .32, .22, .12, .08]
CH = 40.0; XF = 12.0
rng = np.random.default_rng(3)
from scipy.signal import lfilter
zi = np.zeros(1)
with sf.SoundFile(f'{B}/bed.wav', 'w', SR, 1, 'PCM_16') as out:
    n_total = int(total * SR); step = SR * 10; i = 0
    while i < n_total:
        n = min(step, n_total - i); tt = (np.arange(n) + i) / SR
        idx = (tt // CH).astype(int); frac = (tt % CH)
        y = np.zeros(n)
        for c in range(len(chords)):
            w_cur = (idx % len(chords) == c).astype(float)
            w_prev = ((idx - 1) % len(chords) == c).astype(float)
            w = w_cur * np.clip(frac / XF, 0, 1) + w_prev * np.clip(1 - frac / XF, 0, 1)
            if not w.any(): continue
            for f, a in zip(chords[c], amps):
                y += w * a * np.sin(2 * np.pi * f * tt + .4 * np.sin(2 * np.pi * .07 * tt + f))
        y *= .7 + .3 * np.sin(2 * np.pi * tt / 23.0)
        nz = rng.standard_normal(n) * .04
        out_n, zi = lfilter([(1 - .9995) * 30], [1, -.9995], nz, zi=zi)   # one-pole low-pass "air"
        y += out_n
        fade = np.clip(tt / 8, 0, 1) * np.clip((total - tt) / 15, 0, 1)
        out.write((y * fade * .12).astype(np.float32)); i += n
# mix: bed about 14 dB under the speech level
v, _ = sf.read(f'{B}/voice.wav', dtype='float32'); b, _ = sf.read(f'{B}/bed.wav', dtype='float32')
m = min(len(v), len(b)); v, b = v[:m], b[:m]
speech_rms = np.sqrt(np.mean(v[np.abs(v) > .01] ** 2)); bed_rms = np.sqrt(np.mean(b ** 2))
b *= speech_rms * 10 ** (-14 / 20) / bed_rms
sf.write(f'{B}/premix.wav', v + b, SR, 'PCM_16')
# two-pass loudnorm to -18 LUFS
r = subprocess.run(['ffmpeg', '-hide_banner', '-i', f'{B}/premix.wav', '-af', 'loudnorm=I=-18:TP=-2:LRA=11:print_format=json', '-f', 'null', '-'], capture_output=True, text=True)
js = json.loads(r.stderr[r.stderr.rindex('{'):r.stderr.rindex('}') + 1])
af = (f"loudnorm=I=-18:TP=-2:LRA=11:measured_I={js['input_i']}:measured_TP={js['input_tp']}:measured_LRA={js['input_lra']}"
      f":measured_thresh={js['input_thresh']}:offset={js['target_offset']}:linear=true,aresample=48000")
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', f'{B}/premix.wav', '-af', af, '-ac', '1', f'{B}/mix.wav'], check=True)
print('total', round(total / 60, 1), 'min')
