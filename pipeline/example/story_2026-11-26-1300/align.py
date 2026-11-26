import json
from pocketsphinx import Decoder
d=Decoder(samprate=16000,bestpath=False)
for w,p in [("verily","V EH R AH L IY"),("kummest","K AH M IH S T"),("barabbas","B ER AE B AH S"),("laystye","L EY S T AY"),("nicodemus","N IH K AH D IY M AH S"),("ghestus","G EH S T AH S"),("dizmus","D IH Z M AH S"),("chrisostom","K R IH S AA S T AH M"),("golgotha","G AH L G AA TH AH")]:
    d.add_word(w,p,False)
txt=open('text.txt').read().strip()
d.set_align_text(txt); d.start_utt(); d.process_raw(open('vo.raw','rb').read(),full_utt=True); d.end_utt()
out=[[s.word,s.start_frame/100,(s.end_frame+1)/100] for s in d.seg() if s.word not in('<s>','</s>','<sil>','(NULL)')]
json.dump(out,open('words.json','w')); print(len(out),len(txt.split()),out[-1])
