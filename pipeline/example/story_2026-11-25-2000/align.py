import json
from pocketsphinx import Decoder
d=Decoder(samprate=16000,bestpath=False)
for w,p in [("capernayum","K AH P ER N EY AH M"),("blotteth","B L AA T AH TH"),("talmud","T AA L M UH D"),("basalt","B AH S AO L T"),("paralyzed","P EH R AH L AY Z D"),("blasphemies","B L AE S F AH M IY Z"),("blasphemy","B L AE S F AH M IY"),("mark's","M AA R K S"),("man's","M AE N Z")]:
    try: d.add_word(w,p,False)
    except Exception as e: print('addfail',w,e)
txt=open('text.txt').read().strip()
d.set_align_text(txt); d.start_utt(); d.process_raw(open('vo.raw','rb').read(),full_utt=True); d.end_utt()
out=[[s.word,s.start_frame/100,(s.end_frame+1)/100] for s in d.seg() if s.word not in('<s>','</s>','<sil>','(NULL)')]
json.dump(out,open('words.json','w')); print(len(out),len(txt.split()),out[-1])
