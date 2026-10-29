#!/bin/bash
# resumable: 60 s chunks -> concat -> mux with the mastered mix -> out/final_master.mp4
cd "$(dirname "$0")/.."
export PLAYWRIGHT_BROWSERS_PATH=/opt/pw-browsers
mkdir -p out/chunks
DUR=$(python3 -c "import json;print(json.load(open('film/film.json'))['duration'])")
N=$(python3 -c "import math;print(math.ceil($DUR/60))")
for ((i=0; i<N; i++)); do
  A=$((i*60)); B=$(((i+1)*60)); C=out/chunks/c$(printf %03d $i).mp4
  [ -f $C ] && continue
  node render.mjs --film film --video-only --fps 30 --noblur --workers 2 --range $A:$B > out/chunks/log_$i.txt 2>&1 || { echo "chunk $i FAILED"; tail -3 out/chunks/log_$i.txt; exit 1; }
  mv out/film/range_$A-$B.mp4 $C && echo "chunk $((i+1))/$N done"
done
ls out/chunks/c*.mp4 | sed "s#^out/chunks/#file '#; s#\$#'#" > out/chunks/list.txt
ffmpeg -loglevel error -y -f concat -safe 0 -i out/chunks/list.txt -c copy out/video_full.mp4
ffmpeg -loglevel error -y -i out/video_full.mp4 -i build/mix.wav -c:v copy -c:a aac -b:a 192k -ar 48000 -shortest -movflags +faststart out/final_master.mp4
echo "FINAL $(ffprobe -v error -show_entries format=duration -of csv=p=0 out/final_master.mp4)"
