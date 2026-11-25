import json,re
w=json.load(open('words.json')); segs=json.load(open('segs.json'))
disp=' '.join(s[0] for s in segs)
toks=disp.split(); assert len(toks)==len(w),(len(toks),len(w))
out=[{"w":t,"s":round(o[1],2),"e":round(o[2],2)} for t,o in zip(toks,w)]
KW={'four','roof','paralyzed','jesus','heal','first','capernaum','galilee','house','room','door','mat','near','climb','basalt','beams','branches','mud','dug','dirt','faith','theirs','healing','son','sins','forgiven','sin','talmud','bed','scribes','blasphemies','god','isaiah','transgressions','easier','arise','walk','check','power','immediately','arose','never','blasphemy','trial','priest','death','friends','follow'}
phr=[];cur=[]
for k,o in enumerate(out):
    o["k"]=1 if o["w"].strip('.,?!:\'').lower().replace("'s","") in KW else 0
    cur.append(o)
    nxt=out[k+1]["s"] if k+1<len(out) else 999
    if re.search(r'[.?,!:]$',o["w"]) or len(cur)>=4 or nxt-o["e"]>0.35 or (k+1<len(out) and sum(len(x['w'])+1 for x in cur)+len(out[k+1]['w'])>21):
        phr.append(cur);cur=[]
if cur: phr.append(cur)
open('/root/w/rem/src/caps.ts','w').write('export const CAPS:{w:string;s:number;e:number;k:number}[][]='+json.dumps(phr,ensure_ascii=False)+';\n')
print(len(phr), max(sum(len(x['w'])+1 for x in p) for p in phr), out[-1])
