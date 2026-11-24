import json,re
w=json.load(open('words.json'))
segs=json.load(open('segs.json'))
disp=' '.join(s[0] for s in segs).replace('Pylate','Pilate').replace('Orijen','Origen').replace('two fifty','250')
toks=disp.split()
out=[];i=0
for t in toks:
    n=2 if t.startswith('250') else 1;seg=w[i:i+n];i+=n
    out.append({"w":t,"s":round(seg[0][1],2),"e":round(seg[-1][2],2)})
assert i==len(w),(i,len(w))
KW={'two','prisoners','jesus','jesus?','want','passover','jerusalem','pilate','pilate.','barabbas','barabbas.','barabbas!','barabbas?','murder','christ','christ?','wife','dream','just','crowd','name','name.','crucified','hands','innocent','blood','free','cross','origen','250','sinner','manuscripts','print','aramaic','father','father.','guilty','place','place.','follow','word'}
phr=[];cur=[]
for k,o in enumerate(out):
    o["k"]=1 if o["w"].strip('.,?!:\'').lower() in {x.strip('.,?!') for x in KW} else 0
    cur.append(o)
    nxt=out[k+1]["s"] if k+1<len(out) else 999
    if re.search(r'[.?,!:]$',o["w"]) or len(cur)>=4 or nxt-o["e"]>0.35 or (k+1<len(out) and sum(len(x['w'])+1 for x in cur)+len(out[k+1]['w'])>21):
        phr.append(cur);cur=[]
if cur: phr.append(cur)
open('/root/work/rem/src/caps.ts','w').write('export const CAPS:{w:string;s:number;e:number;k:number}[][]='+json.dumps(phr,ensure_ascii=False)+';\n')
print(len(phr), max(sum(len(x['w'])+1 for x in p) for p in phr), out[-1])
