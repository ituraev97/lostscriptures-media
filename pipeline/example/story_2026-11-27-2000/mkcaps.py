import json,re
w=json.load(open('words.json')); segs=json.load(open('segs.json'))
disp=' '.join(s[0] for s in segs)
disp=disp.replace('Teesoh','Tissot').replace('Joe see fus','Josephus @@ @@').replace('eggo eemee','egō eimi')
toks=['' if x=='@@' else x for x in disp.split()]; assert len(toks)==len(w),(len(toks),len(w))
out=[{"w":t,"s":round(o[1],2),"e":round(o[2],2)} for t,o in zip(toks,w)]
KW={'jesus','two','words','crowd','stones','kill','john','eight','jerusalem','temple','tabernacles','treasury','abraham','father','abraham\'s','children','works','day','glad','laugh','fifty','years','dead','thousand','verily','before','was','am','took','cast','why','fifteen','hundred','burning','bush','moses','god','name','greek','bible','egō','eimi','same','law','blasphemeth','lord','congregation','stone','perfectly','hid','midst','tissot','beams','herod','site','josephus','finished','sixty','three','solomon','porch','again','man','makest','thyself','garden','night','soldiers','lanterns','torches','nazareth','backward','fell','ground','armed','men','take','follow'}
phr=[];cur=[]
for k,o in enumerate(out):
    base=o["w"].strip('.,?!:;\'').lower()
    base=re.sub(r"'s$","",base)
    o["k"]=1 if base in KW else 0
    if o['w']=='':
        continue
    cur.append(o)
    nxt=out[k+1]["s"] if k+1<len(out) else 999
    nw=out[k+1]['w'] if k+1<len(out) else ''
    if re.search(r'[.?,!:;]$',o["w"]) or len(cur)>=4 or nxt-o["e"]>0.35 or (k+1<len(out) and sum(len(x['w'])+1 for x in cur)+len(nw)>21):
        phr.append(cur);cur=[]
if cur: phr.append(cur)
# fix end times of words followed by blanks (Josephus spans 3 tokens)
for p in phr:
    for o in p:
        if o['w']=='Josephus': o['e']=round(w[[i for i,t in enumerate(toks) if t=='Josephus'][0]+2][2],2)
open('/home/claude/w/rem/src/caps.ts','w').write('export const CAPS:{w:string;s:number;e:number;k:number}[][]='+json.dumps(phr,ensure_ascii=False)+';\n')
print(len(phr), max(sum(len(x['w'])+1 for x in p) for p in phr))
for p in phr: print(p[0]['s'], ' '.join(x['w'] for x in p))
