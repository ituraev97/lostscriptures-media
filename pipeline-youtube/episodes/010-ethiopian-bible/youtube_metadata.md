# The Lost Scriptures — 010: The Ethiopian Bible

## Title
Why Does the Ethiopian Bible Have 81 Books?

## Scheduling
- Metricool, YouTube video, 2026-11-07 14:00 America/New_York (2026-11-08 00:00 Tashkent)
- Post id 419669730, uuid -5840043175110095203, custom thumbnail A accepted
- Planner: https://app.metricool.com/planner/calendar?blogId=7718820&openWithPostUuid=-5840043175110095203
- Final file: 11:00, 1920×1080, 85.8 MB (two-pass 900k), −14.4 LUFS, voice check PASS (before render and on final)
- Media hosted on branch `media-long` (long/video.mp4, long/thumb.jpg = A, long/thumb_B.jpg = B)

## Settings
- Audience: Not made for kids · Category: Education · Privacy: public · no AI label (owner's decision; isAiGeneratedContent not sent)
- Thumbnail A: THE ETHIOPIAN BIBLE / 81 BOOKS / NOT 66 / WHY IT HAS MORE BOOKS (coloured Ethiopian painting, Budge 1898) — first thumbnail in colour (`img`/`color` options added to tools/thumb2.py)
- Thumbnail B (YouTube Test & Compare): ENOCH / SURVIVED HERE / THE BIBLE WITH 81 BOOKS (Ethiopian icon of Mary, Budge 1922)

## Tags
ethiopian bible, ethiopian bible 81 books, why does the ethiopian bible have 81 books, ethiopian orthodox bible, book of enoch, book of jubilees, garima gospels, kebra nagast, ark of the covenant ethiopia, meqabyan, lost books of the bible, books removed from the bible, biblical canon, bible history, apocrypha

## Description
See description.txt (posted verbatim).

## Notes for next runs
- New PD sources (archive.org): Budge 1898 `b28037650` — coloured Ethiopian paintings (PDF pp. 148–346, every ~4 pp.; 61 St George, 63 Virgin & Child b/w); Budge 1922 `queenofshebahero00budgrich` — 31 plates of British Museum Ethiopic MS paintings, PDF p. 14, 102 (Ge'ez text), then 111, 121 … every 10 pp. (many printed sideways: 121, 181, 211–271, 299–349, 387); Bent 1896 `sacredcityofethi00bent` — Aksum photos PDF pp. 184 (church), 207–221 (stelae, altars).
- pdftoppm on these JPX PDFs is slow (~5 s/page at 300 dpi); render only chosen pages.
- assets.py: `pillar()` puts tall pictures on a 16:9 blurred ground (cover-fit zoomed the halftone photos to mush); bent_ images get a median filter against the halftone screen.
- film.js: opening fade shortened to 0.35 s so the 0:00.5 frame reads (growth QA rule). New caption keys bq_, bm_, bent_.
- `ms_dill*` keys are captioned as Jubilees (1859) in film.js — use `ms_geez_*` for Dillmann's Enoch.
- render_all.sh died once when the calling shell was killed: start it with `setsid nohup … & disown`. Playwright needed the chromium_headless_shell-1217 symlink again.
