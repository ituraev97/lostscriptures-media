# The Lost Scriptures — YouTube long-form documentary runbook

One ~10-minute documentary (1920×1080, 30 fps, −14 LUFS) about a lost book, an apocryphal text or the history of a biblical text, for a US audience. Reference episode: `episodes/001-book-of-enoch/` (script, assets, metadata, thumbnails). The visual style and the brand are fixed; only the story changes.

## 0. Setup (fresh container, ~3 min)

```
cd /home/claude && cp -r lostscriptures-media/pipeline-youtube work && cd work
npm init -y >/dev/null && npm i -D playwright@1.59 && (ls /opt/pw-browsers/ ; ls node_modules/playwright-core/package.json)
# Playwright looks for chromium_headless_shell-<its build>. If that folder is missing, symlink the installed one:
#   ln -s /opt/pw-browsers/chromium_headless_shell-1243 /opt/pw-browsers/chromium_headless_shell-<build it asks for>
pip install --break-system-packages -q kokoro-onnx soundfile librosa scipy numpy pillow
mkdir -p /home/claude/tts && cd /home/claude/tts && \
  curl -sSLO https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files-v1.0/kokoro-v1.0.onnx && \
  curl -sSLO https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files-v1.0/voices-v1.0.bin && \
  mv kokoro-v1.0.onnx kokoro.onnx && mv voices-v1.0.bin voices.bin && cd /home/claude/work
mkdir -p fonts_pkg && (cd fonts_pkg && npm init -y >/dev/null && npm i @fontsource/cinzel @fontsource/cormorant-garamond)
export PLAYWRIGHT_BROWSERS_PATH=/opt/pw-browsers
```

## 1. Topic

Read `topics.md`. Pick the first backlog topic not done, or a better one the research supports. Never repeat a done topic. Check demand with WebSearch (what people search about it, recent news or archaeology).

## 2. Research and script (`script.py` at the work root)

- Sources: scholarly and reference sources you actually opened (encyclopedias, university pages, museum pages, Bible Odyssey, the texts themselves). Keep the list with URLs for the description.
- Quote on screen ONLY public-domain translations: KJV; R. H. Charles (Enoch 1912/1917, Jubilees 1902/1917, Apocrypha & Pseudepigrapha 1913); M. R. James, The Apocryphal New Testament (1924); Grenfell & Hunt (Oxyrhynchus, 1897–1904); other translations published in 1930 or earlier. Modern translations (Nag Hammadi Library, NRSV, Lambdin's Thomas, etc.) are copyrighted: summarise them in your own words, never quote. Get PD texts from archive.org (`archive.org/advancedsearch.php?...&output=json`, then `/download/<id>/<id>_djvu.txt`).
- Tone: storyteller with sources. "The text says…", "scholars date…". Never "banned", "they hid it", "the church suppressed". Present debates as debates. No claims you cannot source.
- Format: list `S` of `(kind, text, visual_key)`, kinds `vo`, `quote` ("quote|reference"), `title` ("TITLE|subtitle"), `chapter` ("NUMERAL|Title"; the close uses "|Title"), `end` ("THE LOST SCRIPTURES"). 1300–1500 words of narration ≈ 10 min. Cold open 30–40 s with three surprising facts, title card, 8–10 chapters, 2–4 quotes, close with the open question, then name three other lost books and ask which to open next.
- Spell hard names for the voice if needed (check `kokoro.tokenizer.phonemize`).

## 3. Images (`assets.py` for the episode, see 001's)

All public domain, fetched from archive.org (Wikimedia answers 429 from these sessions; museum, LoC, NASA and stock sites are blocked):
- **Gustave Doré, Bible engravings (1866)**: `dorbiblegaller00doruoft` (PDF 70 MB). `pdftoppm -r 150 -jpeg -f N -l N dore.pdf` for page N. Plates in order start at pages 019 (Creation of Eve), 023 (Expulsion), 027 (Murder of Abel), 031 (The Deluge), 035 (Noah cursing Ham), 039 (Tower of Babel), 043 (Abraham and the three angels), 047 (Destruction of Sodom)… then every ~4 pages; the full title list is in `dorbiblegaller00doruoft_djvu.txt`. ALWAYS make a contact sheet and LOOK before using a plate; never label a scene as something it is not (e.g. do not use the Ascension of Christ for Enoch).
- **David Roberts, The Holy Land (1842–49)**: `holylandsyriaidu1to2robe`, `holylandsyriaidu3to4robe`. Hi-res page: `https://archive.org/download/<id>/page/n<N-1>_w1800.jpg`. Plates are printed sideways: rotate with `im.rotate(-90, expand=True)` and crop margins and captions (see `plate_box` in 001's assets.py).
- **Printed manuscripts**: Ethiopic Enoch (Dillmann 1851 `bub_gb_DigVAAAAQAAJ`, Charles 1906 `ethiopicversiono00charuoft`); search archive.org for Hebrew, Greek, Coptic or Syriac editions printed before 1930 for other texts. Crop the "Digitized by Google" mark.
- **Films published 1930 or earlier** (US public domain), audio removed: Noah's Ark (1928) `noahs-ark-1928-tmdb104430`, The King of Kings (1927) `THEKINGOFKINGS1927SilentFilm`, Ben-Hur (1925), The Ten Commandments (1923). Extract short frame runs into `film/ark/f0000.jpg…` + `ark.json {"n","fps"}`; the visual key `film_ark` plays them. Never show suffering close-up.
- Bake the warm grade into the images (multiply sepia: 75% engravings and film frames, 35% lithographs, 85% manuscript pages) as 001 did after `assets.py`; film.js no longer multiplies per frame.
- Update `captionFor()` in `film/film.js` if you add a new kind of source, so every image is credited on screen.

## 4. Voice, timeline, sound, picture

```
python3 tools/voice.py            # Kokoro am_michael ×0.96 pitch, speed 0.9 -> build/vo, film/timeline.json, build/captions_en.srt
python3 -c "import json;d=json.load(open('film/timeline.json'));json.dump({'title':'<Title>','duration':d['duration'],'formats':['16x9'],'poster':30},open('film/film.json','w'))"
python3 tools/mix.py              # synthesized score + booms + ducked narration, -14 LUFS -> build/mix.wav
node render.mjs --film film --at 3,40,90,150,240,330,420,500 --noblur --workers 2   # LOOK at the stills, fix, repeat
bash tools/render_all.sh          # 60 s chunks (resumable), ~4.5 min per chunk -> out/final_master.mp4
```
Run `tools/render_all.sh` with `run_in_background` and wait for the "FINAL" line; if the run is interrupted, run it again (finished chunks are kept). Check: duration, 1920×1080, audio present, `ffmpeg -af ebur128` ≈ −14 LUFS, and a 1-frame-per-15-s contact sheet you LOOK at.

## 5. Deliverable for YouTube (≤ 95 MB, required by GitHub hosting)

```
ffmpeg -y -i out/final_master.mp4 -vf hqdn3d=3:2:5:4 -c:v libx264 -preset veryfast -b:v 1150k -pass 1 -an -f mp4 /dev/null
ffmpeg -y -i out/final_master.mp4 -vf hqdn3d=3:2:5:4 -c:v libx264 -preset veryfast -b:v 1150k -pass 2 -pix_fmt yuv420p -c:a aac -b:a 128k -movflags +faststart out/video.mp4
```
Thumbnails: write `thumb.json` (see 001) and run `python3 tools/thumb2.py thumb.json` (house style: logo, gold Cinzel hook, red payoff, Doré plate). Hook must be TRUE about the text. Convert to `out/thumb.jpg` (A); keep B for YouTube "Test & Compare".

## 6. Host and schedule

- Hosting branch `media-long` (orphan, force-pushed; never put videos on `main`):
```
cd /home/claude/lostscriptures-media && git checkout --orphan media-long-tmp && git rm -rq --cached . && git clean -fdq -e pipeline-youtube
mkdir -p long && cp ../work/out/video.mp4 long/video.mp4 && cp ../work/out/thumb.jpg long/thumb.jpg
git add long && git commit -qm "media: <slug>" && git push -f origin media-long-tmp:media-long && git checkout -q main
```
  URLs: `https://raw.githubusercontent.com/ituraev97/lostscriptures-media/media-long/long/video.mp4` and `.../long/thumb.jpg` (check HTTP 200 and the right size). Metricool copies the file at scheduling time, so the branch can be overwritten the next day.
- Metricool: `createScheduledPost`, blogId 7718820, providers `[{"network":"youtube"}]`, autoPublish true, text = description, `youtubeData {title, type "video", privacy "public", madeForKids false, category "EDUCATION", isAiGeneratedContent true, tags [12–18]}`, `videoThumbnailUrl` = thumb URL (if rejected with VIDEO_THUMBNAIL_NOT_APPLICABLE, retry once without it), publicationDate 14:00 America/New_York on the target date.
- Description: 2-line hook summary; "CHAPTERS" with m:ss from `film/timeline.json` (0:00 first); "SOURCES & TRANSLATIONS"; "ART & FOOTAGE (public domain)" with every source; "Narration voice and music are synthetic."; the closing question; 5–7 hashtags. Title ≤ 70 characters, keyword first, true.

## 7. Record

On `main`: add `episodes/<NNN>-<slug>/` with script.py, assets.py, thumb.json, youtube_metadata.md, sources.md; move the topic in `topics.md` from backlog to done with the date. Commit with the session attribution lines; `git fetch origin main && git rebase origin/main` before pushing (other runs push too).
