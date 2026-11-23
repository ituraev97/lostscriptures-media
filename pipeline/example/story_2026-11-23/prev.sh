#!/bin/bash
# usage: prev.sh outdir t1 t2 ...
cd /root/work/rem; B=$(cat ../browser.txt); D=$1; shift; mkdir -p out/$D
for f in "$@"; do n=$(python3 -c "print(round($f*30))"); timeout 120 npx remotion still build Story out/$D/f$(printf %05d $n).jpg --frame=$n --image-format=jpeg --browser-executable=$B --log=error > /dev/null 2>&1 & while [ $(jobs -r | wc -l) -ge 3 ]; do sleep 1; done; done; wait
python3 - "$D" <<'PY'
import sys,glob
from PIL import Image, ImageDraw
fs=sorted(glob.glob(f'out/{sys.argv[1]}/*.jpg')); cols=8; tw,th=270,480
S=Image.new('RGB',(cols*tw,((len(fs)+cols-1)//cols)*(th+20)),(30,30,30)); d=ImageDraw.Draw(S)
for i,f in enumerate(fs):
  im=Image.open(f).resize((tw,th)); x,y=(i%cols)*tw,(i//cols)*(th+20)
  S.paste(im,(x,y+20)); d.text((x+4,y+4),f'{int(f[-9:-4])/30:.1f}s',fill=(255,220,120))
  dd=ImageDraw.Draw(S); s=.25
  dd.rectangle([x+70*s,y+20+470*s,x+930*s,y+20+1410*s],outline=(0,255,0))
S.save(f'out/sheet_{sys.argv[1]}.jpg',quality=85)
PY
