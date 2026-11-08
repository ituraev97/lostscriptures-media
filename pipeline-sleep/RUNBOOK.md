# The Lost Scriptures — "Fall Asleep to…" daily reading (main YouTube format since 2026-11-09)

One calm long reading per day (45–95 min; hard limit: final file ≤ 94 MB), plus 1 YouTube Short (30–45 s) and 1 TikTok version (61–100 s)
cut from it. Reference episode: `episodes/001-enoch-watchers/` (published 2026-11-08 21:00 ET).

Why this format: the channel's documentaries got 0–10 views; sleep readings of Enoch/Psalms/Words of Jesus get 100k–3M views even on
small channels and build watch hours fast (Projects doc `claude/research/lost-scriptures-2026-11-07.md` + owner's brief 2026-11-08).

## Owner's rules
- Text: ONLY public domain, read exactly as printed (no retelling). KJV (or World English Bible); R. H. Charles 1917 for Enoch.
  Short intro and goodbye (1–2 sentences each). No end-times prophecy talk, no "banned / they hid it", never "No Ads".
- Voice: Kokoro `am_michael`, speed 0.85 (owner chose sample A). Pauses 0.8–1.2 s between verses, 2 s after a chapter heading,
  3.5 s between chapters.
- NO AI labels anywhere (owner's decision 2026-11-02, confirmed 2026-11-08): never set isAiGeneratedContent / isAigc, never write
  "AI" or "synthetic voice" in titles or descriptions. Not made for kids. Category EDUCATION.
- Picture: dark, calm public-domain plates (Doré, Roberts, Tissot, Schnorr), a crossfade every 2–4 min, no flashes, no subtitles;
  small chapter + source caption; the last ~10 min grow dark (render.py does it).
- Sound: our own synthesized drone bed ~14 dB under the voice, final ≈ −18 LUFS (assemble.py does it).

## Series rotation (see `topics.md`, keep it updated)
Fall Asleep to the Book of Enoch (Parts 1–5) → Psalms for Sleep (KJV books of ~40 psalms) → Fall Asleep to the Words of Jesus (KJV)
→ then Jubilees (Charles 1917), Gospel of Thomas (Grenfell & Hunt sayings only, PD), Proverbs, Ecclesiastes, Job, Song of Songs…
Titles follow the leaders: "Fall Asleep to …", "When You Can't Sleep, Listen to …", "Sleep to the Psalms Tonight"; a familiar word
first (Enoch, Psalms, Jesus). Daily demand check: WebSearch / YouTube for "bible for sleep", "psalms for sleep", "book of enoch sleep".

## 0. Setup (fresh container)
```
cd /home/claude && git clone --depth 1 https://github.com/ituraev97/lostscriptures-media && mkdir -p work && cp -r lostscriptures-media/pipeline-sleep/tools work/ && cd work
pip install --break-system-packages -q kokoro-onnx soundfile scipy numpy pillow pocketsphinx
mkdir -p /home/claude/tts && cd /home/claude/tts && curl -sSLO https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files-v1.0/kokoro-v1.0.onnx \
  && curl -sSLO https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files-v1.0/voices-v1.0.bin && mv kokoro-v1.0.onnx kokoro.onnx && mv voices-v1.0.bin voices.bin && cd /home/claude/work
mkdir -p fonts_pkg && (cd fonts_pkg && npm init -y >/dev/null && npm i @fontsource/cinzel @fontsource/cormorant-garamond)
cp ../lostscriptures-media/pipeline/visuals/pd.py tools/
```

## 1. Text → `ep.json`
- KJV: `python3 tools/kjv.py ep.json --title "…" --part "Psalms 42-72"` (or `--part "Matthew 5-7" --part "John 14-17"`). Edit intro/outro.
- Enoch: Part 1 = `episodes/001-enoch-watchers/ep1.json`. Parts 2–5 (37–71 Parables, 72–82 Astronomical Book, 83–90 Dream Visions,
  91–108 Epistle): the only clean-enough Charles 1917 text reachable is the OCR `archive.org/download/book-of-enoch_1917/BookOfEnoch_1917_djvu.txt`.
  Clean it chapter by chapter BY READING IT (fix `|`→`I`, `t…t` dagger marks, merged words, page headers "www.globalgrey.co.uk",
  footnotes), keep verse numbers, check every chapter has the expected verse count, read the cleaned text once more before synthesis.
  Format: `{"title","intro","outro","chapters":[{"chapter":37,"title":"Chapter thirty-seven.","verses":[{"v":"1","t":"…"}]}]}`.
- Length: 45–95 min of reading ≈ 6,000–12,500 words. Split longer books into parts.

## 2. Voice (long, resumable — run in the background, re-run if interrupted)
`python3 tools/synth.py ep.json build --voice am_michael --speed 0.85` → `build/vo/<block>.wav` (48 kHz) + verse timings.
Then `python3 tools/assemble.py ep.json build` → `build/mix.wav` (≈ −18 LUFS) and `build/timeline.json`.
MANDATORY voice check: all `build/vo/*.wav` are 48000 Hz, and pocketsphinx on 40 s of `build/mix.wav` (from 6 s) recovers the intro
and first verse words (≥ 6 content words). Never publish a reading without clear narration.

## 3. Pictures → `plan.json`
- Find plates with `pd.py find/browse/get` (sources in `pipeline/VISUALS.md`; 001 used Roberts, Doré Paradise Lost, Doré Paradiso).
  ~1 plate per 2–3 min. LOOK at every page and crop exactly (no paper, captions or plate numbers); save crops to `img/crop/NN.jpg`.
  Prefer dark, calm, majestic plates; no nudity, no gore, nothing violent in close-up. Roberts plates are printed sideways (rotate −90°).
- `plan.json` (see 001's `plan1.json`): `schedule` = every block (intro, chNN, outro) with the images that START in it and its caption;
  `credits` per image; `text_credit`; `crf` 30, `abr` "64k", `fade_img` 3, `fade_cap` .6, `dim_last` 600.
- Look at `build/states/*.png` (a contact sheet) before the full render; fix crops.

## 4. Render (≈ 1 min of render per minute of video; background)
`FONTS=fonts_pkg/node_modules/@fontsource python3 tools/render.py plan.json build out/video.mp4` → "FINAL … MB".
Must be ≤ 94 MB (GitHub hosting). If bigger: raise `crf` to 32, `abr` 56k, or shorten the episode. Check duration, 1080p, audio,
a 1-frame-per-150-s contact sheet (LOOK), and the voice check on the final file.

## 5. Shorts (from the same voice files)
- YouTube Short 30–45 s: 2–3 strong verses + `build/cta_yt.wav` ("The full reading of … is on our channel. Sleep well.").
- TikTok 61–100 s: a whole short passage + `cta_tt.wav` ("Follow, and fall asleep to the next part tomorrow night.").
- Config like 001's `short_yt.json` / `short_tt.json`; `python3 tools/short.py short_yt.json out/short_yt.mp4`. LOOK at a contact sheet.

## 6. Thumbnails
Night style of 001 (`out/thumb_A.jpg`, `thumb_B.jpg` in the media branch): dark plate, logo + "THE LOST SCRIPTURES",
gold 3-line title ("FALL ASLEEP TO / THE BOOK / OF ENOCH"), italic subtitle, a duration chip ("1 HOUR"). Make A and B.

## 7. Host and schedule
- Branch `media-sleep` (fixed name, orphan, force-pushed; deleting branches or creating releases is NOT permitted from these sessions):
  files `s/video.mp4`, `s/thumb.jpg`, `s/thumb_B.jpg`, `s/short_yt.mp4`, `s/short_tt.mp4`. Check every raw URL returns HTTP 200 with the
  right size (append `?v=<unix time>` to the URLs you give Metricool to avoid a stale cache).
- Metricool (blogId 7718820, timezone America/New_York, autoPublish true), target date = tomorrow (ET):
  - long: 21:00 ET, providers youtube, youtubeData {title, type "video", privacy "public", madeForKids false, category "EDUCATION", tags 12–16},
    videoThumbnailUrl = thumb.jpg (retry once without it if rejected); text = description (2-line summary, "Dim the lights…",
    CHAPTERS with m:ss / h:mm:ss from build/timeline.json (first 0:00, each ≥ 10 s apart), TEXT source, ART credits, "Next: …", 5 hashtags).
  - YouTube Short: 22:30 ET, type "short", title ends " #shorts".
  - TikTok version: 22:30 ET, providers tiktok, tiktokData {title, privacyOption "PUBLIC_TO_EVERYONE"}.
  Before creating, call getScheduledPosts for that date: if a long YouTube video is already there, skip the long one.

## 8. Record
On `main`: `episodes/NNN-<slug>/` with ep.json, plan.json, crops, short configs, youtube_metadata.md; update `topics.md`.
Never commit video or audio files to `main`. `git fetch origin main && git rebase origin/main` before pushing.
