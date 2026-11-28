import json,re
w=json.load(open('words.json')); segs=json.load(open('segs.json'))
toks=' '.join(s[0] for s in segs).split()
out=[];i=0
for tk in toks:
    n=len([x for x in re.sub(r"[^a-z' ]",' ',tk.lower().replace('-',' ')).split()]) or 1
    out.append({"w":tk.replace('thirty-eight','38').replace('Thirty-eight','38').replace('eighteen-eighties','1880s'),"s":round(w[i][1],2),"e":round(w[i+n-1][2],2)}); i+=n
assert i==len(w),(i,len(w))
KW={'jesus','healed','thirty-eight','pool','authorities','who','john','five','jerusalem','sheep','gate','bethesda','porches','multitude','blind','lame','withered','water','move','king','james','angel','troubled','first','oldest','manuscripts','verse','one','man','strange','question','whole','why','never','yes','sir','no','steppeth','carry','four','steps','touch','rise','bed','walk','immediately','sabbath','leaders','lawful','know','temple','sin','worse','gratitude','betrayal','kill','eighteen-eighties','saint','anne','dug','two','great','pools','wall','sides','middle','still','follow'}
phr=[];cur=[]
for k,o in enumerate(out):
    base=o["w"].strip('.,?!:;\'').lower()
    o["k"]=1 if (base in KW or base in ('38','1880s')) else 0
    cur.append(o)
    nxt=out[k+1]["s"] if k+1<len(out) else 999
    nw=out[k+1]['w'] if k+1<len(out) else ''
    if re.search(r'[.?,!:;]$',o["w"]) or len(cur)>=4 or nxt-o["e"]>0.35 or (k+1<len(out) and sum(len(x['w'])+1 for x in cur)+len(nw)>21):
        phr.append(cur);cur=[]
if cur: phr.append(cur)
json.dump(phr,open('caps.json','w'))
print(len(phr), max(sum(len(x['w'])+1 for x in p) for p in phr))
# segment timing table
i=0
for j,s in enumerate(segs):
    ws=[o for o in out[i:i+len(s[0].split())]]; i+=len(s[0].split())
    print(j, ws[0]['s'], ws[-1]['e'], ' '.join(f"{o['w']}@{o['s']}" for o in ws))
