import json,re
w=json.load(open('words.json')); segs=json.load(open('segs.json'))
disp=' '.join(s[0] for s in segs)
DM={'frahghellion,':'phragellion,','B':'B.C.','C.':'','twenty':'20','Forty':'Forty','six':'six'}
toks=[DM.get(x,x) for x in disp.split()]; assert len(toks)==len(w),(len(toks),len(w))
out=[{"w":t,"s":round(o[1],2),"e":round(o[2],2)} for t,o in zip(toks,w)]
KW={'jesus','whip','hands','temple','john','two','passover','jerusalem','oxen','sheep','doves','tables','money','changers','tax','shekel','tyre','fee','gospel','scourge','cords','stick','cord','drove','poured','overthrew','sacrifice','poor','mary','cages','hence','father','merchandise','sign','authority','destroy','three','days','raise','forty','six','years','josephus','herod','20','b.','c.','scene','body','detail','greek','phragellion','once','latin','flagellum','roman','pilate','scourged','mark','matthew','same','word','trial','cross','shouted','destroyest','rome','burns','ground','braided','him','rose','third','day','follow'}
phr=[];cur=[]
for k,o in enumerate(out):
    o["k"]=1 if o["w"].strip('.,?!:\'').lower().replace("'s","").replace("jesus'","jesus") in KW else 0
    if o['w']=='':
        continue
    cur.append(o)
    nxt=out[k+1]["s"] if k+1<len(out) else 999
    if re.search(r'[.?,!:]$',o["w"]) or len(cur)>=4 or nxt-o["e"]>0.35 or (k+1<len(out) and sum(len(x['w'])+1 for x in cur)+len(out[k+1]['w'])>21):
        phr.append(cur);cur=[]
if cur: phr.append(cur)
open('/home/claude/w/rem/src/caps.ts','w').write('export const CAPS:{w:string;s:number;e:number;k:number}[][]='+json.dumps(phr,ensure_ascii=False)+';\n')
print(len(phr), max(sum(len(x['w'])+1 for x in p) for p in phr), out[-1])
