import json,re,sys
w=json.load(open(sys.argv[1]))
disp="""Babylon. 539 BC. The richest city on Earth. And tonight, its king is throwing a party. King Belshazzar invites a thousand of his lords. The wine flows. And then he does something no one should ever do. He sends for the golden cups, stolen from the Temple of God in Jerusalem. And they drink from them. Toasting their idols of gold and silver, of bronze and iron, of wood and stone. In that same hour, the music stops. A hand appears. No arm. No body. Just the fingers of a man's hand, writing on the palace wall. The king turns pale. His knees knock together. He screams for his wise men. Not one of them can read it. Then they bring in an old Jewish exile. Daniel. Daniel looks at the wall, and reads four words. MENE. MENE. TEKEL. UPHARSIN. MENE. God has numbered your kingdom, and brought it to an end. TEKEL. You have been weighed on the scales, and found wanting. PERES. Your kingdom is divided, and given to the Medes and Persians. That very night, Belshazzar was killed. And here's the chilling part. The Greek historian Herodotus wrote that while Babylon was feasting, the Persian army slipped into the city through the riverbed. And took it, almost without a fight. The party never ended. The kingdom did. Follow for more stories from the Bible that most people never hear."""
toks=disp.split()
multi={'539':3,'BC.':2}
out=[];i=0
for t in toks:
    n=multi.get(t,1);seg=w[i:i+n];i+=n
    out.append({"w":t,"s":round(seg[0][1],2),"e":round(seg[-1][2],2)})
assert i==len(w),(i,len(w))
kw={'Babylon.','539','BC.','party.','Belshazzar','golden','cups,','God','Jerusalem.','music','stops.','hand','appears.','arm.','body.','wall.','pale.','Daniel.','four','words.','MENE.','TEKEL.','UPHARSIN.','PERES.','weighed','wanting.','divided,','killed.','chilling','Herodotus','riverbed.','fight.','ended.','did.'}
phr=[];cur=[]
for k,o in enumerate(out):
    o["k"]=1 if o["w"] in kw else 0
    cur.append(o)
    nxt=out[k+1]["s"] if k+1<len(out) else 999
    if re.search(r'[.?,…:—"]$',o["w"]) or len(cur)>=4 or nxt-o["e"]>0.35:
        phr.append(cur);cur=[]
if cur: phr.append(cur)
json.dump(phr,open(sys.argv[2],'w'));print(len(phr))
