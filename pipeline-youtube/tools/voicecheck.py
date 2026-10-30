"""Mandatory voice check: 48 kHz voice files + pocketsphinx recovers the first narration lines."""
import sys, subprocess, glob, re, os
import soundfile as sf
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from script import S
src = sys.argv[1]
rates = set(sf.info(f).samplerate for f in glob.glob('build/vo/*.wav'))
print('vo sample rates:', rates)
subprocess.run(['ffmpeg', '-loglevel', 'error', '-y', '-i', src, '-t', '40', '-ac', '1', '-ar', '16000', '-f', 's16le', '/tmp/vc.raw'], check=True)
from pocketsphinx import Decoder
d = Decoder(samprate=16000)
d.start_utt(); d.process_raw(open('/tmp/vc.raw', 'rb').read(), full_utt=True); d.end_utt()
hyp = d.hyp().hypstr if d.hyp() else ''
print('ASR:', hyp)
STOP = set('the a an and of to on in that it was is by for with not one more less they this there'.split())
lines = [t for k, t, v in S if k == 'vo'][:3]
words = {w for l in lines for w in re.findall(r"[a-z']+", l.lower()) if w not in STOP and len(w) > 2}
got = words & set(hyp.lower().split())
print('content words recovered:', sorted(got), len(got))
ok = rates == {48000} and len(got) >= 4
print('VOICE CHECK', 'PASS' if ok else 'FAIL'); sys.exit(0 if ok else 1)
