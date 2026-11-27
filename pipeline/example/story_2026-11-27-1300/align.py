import json
from pocketsphinx import Decoder
d=Decoder(samprate=16000,bestpath=False)
for w,p in [("frahghellion","F R AA G EH L IY AH N"),("flagellum","F L AH JH EH L AH M"),("destroyest","D IH S T R OY IH S T"),("changers'","CH EY N JH ER Z"),("spake","S P EY K"),("herod's","HH EH R AH D Z")]:
    try: d.add_word(w,p,False)
    except Exception as e: print('skip',w)
txt=open('text.txt').read().strip()
d.set_align_text(txt); d.start_utt(); d.process_raw(open('vo.raw','rb').read(),full_utt=True); d.end_utt()
out=[[s.word,s.start_frame/100,(s.end_frame+1)/100] for s in d.seg() if s.word not in('<s>','</s>','<sil>','(NULL)')]
json.dump(out,open('words.json','w')); print(len(out),len(txt.split()),out[-1])
