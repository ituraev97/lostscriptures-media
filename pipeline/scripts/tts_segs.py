import sys, json, numpy as np, soundfile as sf
from kokoro_onnx import Kokoro
k = Kokoro(sys.argv[1]+'/kokoro-v1.0.onnx', sys.argv[1]+'/voices-v1.0.bin')
segs = json.load(open(sys.argv[2])); out=[]; marks=[]; sr=24000; t=0.25
out.append(np.zeros(int(sr*.25)))
for text,pause,speed in segs:
    s,sr = k.create(text, voice=sys.argv[4], speed=speed, lang='en-us')
    # trim leading/trailing silence
    a=np.abs(s); idx=np.where(a>0.01)[0]
    if len(idx): s=s[max(0,idx[0]-240):idx[-1]+480]
    marks.append([text,round(t,3),round(t+len(s)/sr,3)])
    out.append(s); out.append(np.zeros(int(sr*pause))); t+=len(s)/sr+pause
sf.write(sys.argv[3], np.concatenate(out), sr); json.dump(marks,open(sys.argv[3]+'.segs.json','w'),indent=0); print(round(t,2))
