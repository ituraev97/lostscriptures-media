import json,re
w=json.load(open('words.json'))
segs=json.load(open('segs.json'))
disp=' '.join(s[0] for s in segs).replace('allo-gay-nays','allogenēs').replace('eighteen seventy one','1871')
toks=disp.split()
out=[];i=0
for t in toks:
    n=3 if t.startswith('1871') else 1;seg=w[i:i+n];i+=n
    out.append({"w":t,"s":round(seg[0][1],2),"e":round(seg[-1][2],2)})
assert i==len(w),(i,len(w))
KW={'ten','healed','one','back','nine','seventeen','jerusalem','samaria','galilee','lepers','far','unclean','alone','mercy','touch','priests','cleansed','face','samaritan','dealings','stranger','allogenēs','greek','1871','stone','temple','foreigner','barrier','death','same','kill','worship','whole','follow','words'}
phr=[];cur=[]
for k,o in enumerate(out):
    o["k"]=1 if o["w"].strip('.,?!:\'').lower() in KW else 0
    cur.append(o)
    nxt=out[k+1]["s"] if k+1<len(out) else 999
    if re.search(r'[.?,!:]$',o["w"]) or len(cur)>=4 or nxt-o["e"]>0.35 or (k+1<len(out) and sum(len(x['w'])+1 for x in cur)+len(out[k+1]['w'])>21):
        phr.append(cur);cur=[]
if cur: phr.append(cur)
open('rem/src/caps.ts','w').write('export const CAPS:{w:string;s:number;e:number;k:number}[][]='+json.dumps(phr,ensure_ascii=False)+';\n')
json.dump(out,open('disp_words.json','w'))
print(len(phr), max(sum(len(x['w'])+1 for x in p) for p in phr), out[-1])
