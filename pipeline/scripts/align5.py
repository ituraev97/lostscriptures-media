import sys,json
from pocketsphinx import Decoder
d=Decoder(samprate=16000,bestpath=False)
d.add_word("belshazzer","B EH L SH AE Z ER",False);d.add_word("herodotus","HH IH R AA D AH T AH S",False);d.add_word("meenee","M IY N IY",False);d.add_word("perrez","P EH R EH Z",False);d.add_word("tekel","T EH K AH L",False);d.add_word("yoofarsin","Y UW F AA R S IH N",False);d.add_word("kebra","K EH B R AH",False);d.add_word("menelik","M EH N AH L IH K",False);d.add_word("nagast","N AA G AA S T",False);d.add_word("tabot","T AA B OW T",False);d.add_word("jubilees","JH UW B AH L IY Z",True)
txt=open(sys.argv[2]).read().strip()
# add missing words to dict check
missing=[w for w in txt.split() if d.lookup_word(w) is None]
print("missing",missing,file=sys.stderr)
d.set_align_text(txt)
d.start_utt(); d.process_raw(open(sys.argv[1],'rb').read(),full_utt=True); d.end_utt()
out=[]
for s in d.seg():
    if s.word in('<s>','</s>','<sil>','(NULL)'): continue
    out.append([s.word, s.start_frame/100, (s.end_frame+1)/100])
json.dump(out,open(sys.argv[3],'w'))
print(len(out))
