import json
from pocketsphinx import Decoder
d=Decoder(samprate=16000,bestpath=False)
for w,p in [("forasmuch","F AO R AE Z M AH CH"),("publicans","P AH B L IH K AH N Z"),("sycomore","S IH K AH M AO R"),("zuhkeeus","Z AH K IY AH S")]:
    d.add_word(w,p,False)
txt=open('text.txt').read().strip()
d.set_align_text(txt); d.start_utt(); d.process_raw(open('vo.raw','rb').read(),full_utt=True); d.end_utt()
out=[[s.word,s.start_frame/100,(s.end_frame+1)/100] for s in d.seg() if s.word not in('<s>','</s>','<sil>','(NULL)')]
json.dump(out,open('words.json','w')); print(len(out),len(txt.split()),out[-1])
