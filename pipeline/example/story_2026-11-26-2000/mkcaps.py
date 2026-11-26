import json,re
w=json.load(open('words.json')); segs=json.load(open('segs.json'))
disp=' '.join(s[0] for s in segs)
DM={'Emayus.':'Emmaus.','Emayus,':'Emmaus,','Kleeopas.':'Cleopas.','Kleeopas?':'Cleopas?','Hejuh-sippus':'Hegesippus'}
toks=[DM.get(x,x) for x in disp.split()]; assert len(toks)==len(w),(len(toks),len(w))
out=[{"w":t,"s":round(o[1],2),"e":round(o[2],2)} for t,o in zip(toks,w)]
KW={'jesus','seven','miles','idea','luke','twenty','four','sunday','jerusalem','emmaus','cleopas','stranger','himself','eyes','holden','held','shut','disguise','seeing','story','trusted','redeemed','israel','past','tense','hope','friday','fools','slow','heart','moses','prophets','scriptures','bible','study','verse','further','abide','evening','bread','blessed','broke','gave','four','actions','last','supper','opened','knew','vanished','sight','detail','greek','genesis','three','adam','eve','shame','meal','see','burn','hour','dark','back','hegesippus','clopas','brother','joseph','uncle','unrecognized','day','follow'}
phr=[];cur=[]
for k,o in enumerate(out):
    o["k"]=1 if o["w"].strip('.,?!:\'').lower().replace("'s","").replace("jesus'","jesus") in KW else 0
    cur.append(o)
    nxt=out[k+1]["s"] if k+1<len(out) else 999
    if re.search(r'[.?,!:]$',o["w"]) or len(cur)>=4 or nxt-o["e"]>0.35 or (k+1<len(out) and sum(len(x['w'])+1 for x in cur)+len(out[k+1]['w'])>21):
        phr.append(cur);cur=[]
if cur: phr.append(cur)
open('/root/w/rem/src/caps.ts','w').write('export const CAPS:{w:string;s:number;e:number;k:number}[][]='+json.dumps(phr,ensure_ascii=False)+';\n')
print(len(phr), max(sum(len(x['w'])+1 for x in p) for p in phr), out[-1])
