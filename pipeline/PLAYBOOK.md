# Bible Stories reels — production playbook

Every run starts in a fresh, empty cloud container. Everything needed to rebuild the pipeline lives in this
Project under `reels-pipeline/` (this file, `scripts/*`, `template/*`, `STORIES_DONE.md`). Read them with
the Projects tool (`project_read`) and write them to disk before starting.

## The format (what the owner wants)
- Bible-story reels (English) for the TikTok account @lostscripturesbooks. NO product, NO book CTA, NO shop link. Pure gripping story.
- Ending line is always: "Follow for more stories from the Bible that most people never hear."
- Length 75–110 s. Hook in the first 2 s (place + year, or a shocking line). Cliffhanger rhythm, short sentences.
- Voice: **Kokoro TTS, voice `am_michael`** (American male), lang en-us. Never ElevenLabs.
- Must be "залипательно": something new on screen every 2–4 s, kinetic word-by-word captions, sound effects on
  every beat, synthesized score, screen shakes on hits, one or two big structural moments only.
- Crisp, clean, detailed vector look (gradients, highlights, bevels). No film grain, no blur mush. One hero object per frame.
- Strict TikTok safe zones (1080×1920): top 0–200 covered (search bar), right x>940 for y 700–1700 covered (icons),
  bottom y>1440 covered (caption/description). All text and key art inside x 70–930, y 470–1410.
  HUD (series title + chapter bar) at y≈245, captions at top≈350.
- Account: **The Lost Scriptures — @lostscripturesbooks** (TikTok). Logo = the `Logo` SVG component in `template/src/Wall.tsx`
  (gold open book + 8-point star on wine-red circle). The HUD always shows Logo + "The Lost Scriptures" + a per-episode
  subtitle (`EPISODE` constant, e.g. "the writing on the wall · Daniel 5"). The end card shows the Logo (~140 px) and
  "@lostscripturesbooks" above the big FOLLOW. The cover may carry the small Logo at the top of the 3:4 area.
- Bible-story videos are free content on this account — still no product, no shop link, no "buy the book".

## Research step (every run, before writing)
1. WebSearch (several queries in one turn): what Bible / biblical-history content is going viral on TikTok right now,
   recent articles on TikTok algorithm & retention, trending searches ("bible stories", "dark bible stories",
   "bible stories they don't teach in church", "ancient history", etc.), current events that connect to a Bible story.
2. Choose ONE story not listed in `STORIES_DONE.md`. Prefer: dramatic, visual, little-known or with a shocking twist,
   a strong "one line" hook, and a historical/archaeological angle (Herodotus, Dead Sea Scrolls, inscriptions...).
   Ideas bank: Jael & Sisera, Elisha's bears, Ehud the left-handed assassin, the witch of Endor, Jephthah's vow,
   Samson's last stand, Jezebel, Gideon's 300, Jonah (and Nineveh), the plague of Ashdod, Sennacherib's 185,000,
   Nebuchadnezzar's madness, the fiery furnace, Daniel in the lions' den, Esther & Haman, Lot's wife, Tower of Babel,
   Nephilim, Korah swallowed by the earth, Uzzah touching the Ark, Ananias & Sapphira, Eutychus falls from a window,
   Herod eaten by worms (Acts 12), Paul's shipwreck at Malta, Balaam's donkey, the sun stands still, Absalom's hair.
3. Write SEO package: TikTok title (on-cover text), caption ≤ 150 chars with 2–3 searchable keywords in plain words,
   4–6 hashtags (mix broad #bible #biblestories #christiantiktok + niche), and a pinned comment that asks a question.

## Build pipeline (commands proven to work)
Network: PyPI, npm and GitHub work; huggingface/googleapis are blocked.
```
pip install --break-system-packages kokoro-onnx soundfile pocketsphinx scipy numpy
mkdir kokoro && cd kokoro
curl -LO https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files-v1.0/kokoro-v1.0.onnx
curl -LO https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files-v1.0/voices-v1.0.bin
git clone --depth 1 https://github.com/kapishdima/soundcn   # Kenney CC0 sfx in soundcn/assets/kenney_*
```
1. Script → `segs.json` = list of `[text, pause_seconds, speed]` (speed ~0.95–1.05; pauses 0.15–0.9 for drama).
   Respell hard names phonetically for TTS (e.g. Belshazzar→"Belshazzer", MENE→"Meenee"); check with
   `k.tokenizer.phonemize(text,'en-us')`.
2. `python3 tts_segs.py kokoro segs.json vo.wav am_michael`
3. Speed up: `ffmpeg -i vo.wav -filter:a atempo=1.04 -ar 44100 vo_fast.wav`; 16 kHz raw for alignment:
   `ffmpeg -i vo_fast.wav -ar 16000 -ac 1 -f s16le vo.raw`
4. Forced alignment: write lowercase spoken text to `text.txt` (numbers spelled out), `python3 align5.py vo.raw text.txt words.json`
   (add unknown words with `d.add_word(word, ARPAbet, False)`).
5. Captions: adapt `mkcaps5.py` (display text with real spellings, multi-token map for numbers, keyword set) → caps.json,
   then `src/caps.ts` = `export const CAPS:{w:string;s:number;e:number;k:number}[][]=<json>`.
6. Score + SFX: adapt `wall_audio.py` (numpy/scipy synth: oud Karplus-Strong, doumbek, taiko, booms, gongs, risers,
   whooshes, heartbeat, shimmer + Kenney samples). Change the timing table to the new words.json times. Music
   should drop out / hard-stop at the twist. Writes music.wav + sfx.wav.
7. Mix (−14 LUFS):
```
ffmpeg -i vo_fast.wav -i music.wav -i sfx.wav -filter_complex "[0:a]aresample=44100,loudnorm=I=-16:TP=-2:LRA=9,pan=stereo|c0=c0|c1=c0,apad=whole_dur=DUR,asplit=2[v][vsc];[1:a]volume=-12.5dB[m];[m][vsc]sidechaincompress=threshold=0.05:ratio=4:attack=30:release=450[md];[2:a]volume=-5dB[s];[v][md][s]amix=inputs=3:normalize=0:duration=first,alimiter=limit=0.92,loudnorm=I=-14:TP=-1.5:LRA=11[a]" -map "[a]" -ar 44100 -c:a pcm_s16le mix.wav
```
8. Remotion project: copy `template/` (package.json pins remotion 4.0.539), `npm i`, plus fonts:
   `npm i @fontsource/cinzel @fontsource/cormorant-garamond @fontsource/noto-serif-hebrew` and copy the woff2 files
   (cinzel-latin-700/400-normal, cormorant-garamond-latin-600-normal/italic, noto-serif-hebrew-hebrew-700-normal) into `public/`.
   `src/lib.ts` holds END (duration), safe-zone constants, easing, `T` (word timings from words.json) and `CH` (chapters).
   `src/Art.tsx` = detailed SVG illustrations; `src/Wall.tsx` = scenes + Hud + Captions + Background + `Cover` still.
   Write NEW art and scenes for the new story; reuse primitives (Layer, Title, Label, Sub, Chip, Stamp, Glow, Plate, Hud, Captions).
   Rules: pure function of time; seeded rnd only; SVG blur only via `<filter><feGaussianBlur>` (CSS blur fails headless);
   use `Boolean(x) &&` in JSX (never `0 &&`); zooms in log space; check non-Latin glyphs exist in the font.
9. Preview: `npx remotion bundle src/index.ts --out-dir build`, then for ~30 frames
   `npx remotion still build <Comp> out/prev/fNNNN.jpg --frame=N --image-format=jpeg --browser-executable=/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell`
   and a contact sheet with safe-zone overlay:
   `ffmpeg -pattern_type glob -i 'out/prev/*.jpg' -vf "drawbox=x=0:y=0:w=1080:h=190:color=red@0.22:t=fill,drawbox=x=940:y=700:w=140:h=1000:color=red@0.22:t=fill,drawbox=x=0:y=1440:w=1080:h=480:color=red@0.22:t=fill,scale=270:480,tile=8x2" sheet%d.jpg`
   Look at it, fix overlaps/out-of-zone text, repeat (at least 2 rounds).
10. Render (2 CPU cores → `--concurrency=2`, ~10–15 min):
   `npx remotion render build <Comp> out/noaudio.mp4 --codec=h264 --crf=16 --muted --browser-executable=<same> --concurrency=2`
   then `ffmpeg -i out/noaudio.mp4 -i mix.wav -map 0:v -map 1:a -c:v copy -c:a aac -b:a 256k -shortest -movflags +faststart out/<slug>.mp4`
11. Cover: a dedicated `<Still id="Cover">` 1080×1920. TikTok profile grid crops to the centre 3:4 (y ≈ 240–1680),
   so ALL cover text sits within y 280–1640, x 90–990: small kicker line, a huge 2–4-word gold headline (the hook),
   the hero image, and a red payoff line. Render with `npx remotion still build Cover out/cover.png`.

## Delivery
- Send the mp4 and cover.png with SendUserFile, then one SendUserMessage in **Russian** with: story name, why it
  should perform (what the research showed), the TikTok title, caption, hashtags, pinned comment, and the
  timestamp to choose as cover if they prefer a frame from the video.
- Append the story to `reels-pipeline/STORIES_DONE.md` in the Project (project_read, add a line, project_write).

## Hosting (public URL for Metricool)
Metricool needs a public https URL for the video and the cover. Use the owner's public GitHub repo
`ituraev97/lostscriptures-media` (GitHub releases are NOT allowed from these sessions — commit files instead):
1. `add_repo` tool: owner `ituraev97`, repo `lostscriptures-media`, access `push`; then
   `git clone --depth 1 https://github.com/ituraev97/lostscriptures-media ~/lostscriptures-media` (generous timeout).
2. Folder `<YYYY-MM-DD>-<slug>/` with `video.mp4` (re-encode for size: `ffmpeg -i final.mp4 -c:v libx264 -crf 19 -preset medium
   -pix_fmt yuv420p -c:a copy -movflags +faststart video.mp4`, must stay < 95 MB) and `cover.jpg`
   (`ffmpeg -i cover.png -q:v 2 cover.jpg`; Metricool covers must be jpg/png).
3. `git -C ~/lostscriptures-media config http.postBuffer 524288000`, `git fetch origin main && git rebase origin/main` (other runs
   push too), commit (end message with the session attribution lines), `git push origin main`. If push fails, fetch/rebase and retry once.
4. URLs: `https://raw.githubusercontent.com/ituraev97/lostscriptures-media/main/<folder>/video.mp4` and `.../cover.jpg`.
   Check with `curl -sI <url>` (expect HTTP 200) before scheduling.
5. Housekeeping: in the same commit, `git rm -r` folders older than 7 days (posts are already published by then).
