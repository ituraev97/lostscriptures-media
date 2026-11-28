import json,re
w=json.load(open('words.json')); segs=json.load(open('segs.json'))
disp=' '.join(s[0] for s in segs).replace('Zuh-kee-us','Zacchaeus')
toks=disp.split(); assert len(toks)==len(w),(len(toks),len(w))
out=[{"w":t,"s":round(o[1],2),"e":round(o[2],2)} for t,o in zip(toks,w)]
KW={'city','jesus','hated','most','dinner','luke','nineteen','jericho','jerusalem','oasis','palms','balsam','pilgrim','chief','tax','zacchaeus','publicans','title','nowhere','testament','rich','rome','squeezed','traitor','thief','crowd','little','stature','richest','ran','climbed','sycomore','tree','looked','up','name','haste','down','abide','house','nobody','introduced','murmured','guest','sinner','table','stand','stood','lord','half','goods','poor','false','accusation','restore','fourfold','why','number','law','moses','confessed','fifth','penalty','sheep','sold','caught','sentenced','salvation','son','abraham','seek','save','lost','pilgrims','sycamore','climbs','days','hang','thieves','one','follow'}
phr=[];cur=[]
for k,o in enumerate(out):
    base=re.sub(r"'s$","",o["w"].strip('.,?!:;\'').lower())
    o["k"]=1 if base in KW else 0
    cur.append(o)
    nxt=out[k+1]["s"] if k+1<len(out) else 999
    nw=out[k+1]['w'] if k+1<len(out) else ''
    if re.search(r'[.?,!:;]$',o["w"]) or len(cur)>=4 or nxt-o["e"]>0.35 or (k+1<len(out) and sum(len(x['w'])+1 for x in cur)+len(nw)>21):
        phr.append(cur);cur=[]
if cur: phr.append(cur)
open('/home/claude/w/rem/src/caps.ts','w').write('export const CAPS:{w:string;s:number;e:number;k:number}[][]='+json.dumps(phr,ensure_ascii=False)+';\n')
print(len(phr), max(sum(len(x['w'])+1 for x in p) for p in phr))
