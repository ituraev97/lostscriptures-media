import json
from pocketsphinx import Decoder
d=Decoder(samprate=16000,bestpath=False)
for w,p in [("emayus","IH M EY AH S"),("kleeopas","K L IY OW P AH S"),("hegesippus","HH EH JH AH S IH P AH S"),("clopas","K L OW P AH S")]:
    d.add_word(w,p,False)
txt=open('text.txt').read().strip()
d.set_align_text(txt); d.start_utt(); d.process_raw(open('vo.raw','rb').read(),full_utt=True); d.end_utt()
out=[[s.word,s.start_frame/100,(s.end_frame+1)/100] for s in d.seg() if s.word not in('<s>','</s>','<sil>','(NULL)')]
json.dump(out,open('words.json','w')); print(len(out),len(txt.split()),out[-1])
