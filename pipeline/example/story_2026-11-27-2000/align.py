import json
from pocketsphinx import Decoder
d=Decoder(samprate=16000,bestpath=False)
for w,p in [("abraham's","EY B R AH HH AE M Z"),("blasphemeth","B L AE S F IY M AH TH"),("eemee","IY M IY"),("eggo","EH G OW"),("fus","F AH S"),("herod's","HH EH R AH D Z"),("makest","M EY K IH S T"),("tabernacles","T AE B ER N AE K AH L Z"),("teesoh","T IY S OW"),("verily","V EH R AH L IY")]:
    try: d.add_word(w,p,False)
    except Exception as e: print('skip',w,e)
txt=open('text.txt').read().strip()
d.set_align_text(txt); d.start_utt(); d.process_raw(open('vo.raw','rb').read(),full_utt=True); d.end_utt()
out=[[s.word,s.start_frame/100,(s.end_frame+1)/100] for s in d.seg() if s.word not in('<s>','</s>','<sil>','(NULL)')]
json.dump(out,open('words.json','w')); print(len(out),len(txt.split()),out[-1])
