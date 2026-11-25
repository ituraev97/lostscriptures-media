import sys,json
from pocketsphinx import Decoder
d=Decoder(samprate=16000,bestpath=False)
for w,p in [("nain","N EY N"),("zarrafath","Z AE R AH F AE TH"),("shoonem","SH UW N AH M"),("strangers","S T R EY N JH ER Z"),("mothers","M AH DH ER Z"),("widows","W IH D OW Z")]:
    try: d.add_word(w,p,False)
    except Exception as e: print('addfail',w,e)
txt=open('text.txt').read().strip()
d.set_align_text(txt); d.start_utt(); d.process_raw(open('vo.raw','rb').read(),full_utt=True); d.end_utt()
out=[[s.word,s.start_frame/100,(s.end_frame+1)/100] for s in d.seg() if s.word not in('<s>','</s>','<sil>','(NULL)')]
json.dump(out,open('words.json','w')); print(len(out),len(txt.split()),out[-1])
