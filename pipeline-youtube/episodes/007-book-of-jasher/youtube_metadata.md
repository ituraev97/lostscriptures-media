# The Lost Scriptures — 007: The Book of Jasher

## Title
The Book of Jasher: The Lost Book the Bible Quotes Twice

## Scheduling
- Metricool, YouTube video, 2026-11-04 14:00 America/New_York (2026-11-05 00:00 Tashkent), post id 416101373, uuid 5593182338856930343, custom thumbnail A accepted
- Planner: https://app.metricool.com/planner/calendar?blogId=7718820&openWithPostUuid=5593182338856930343
- Media hosted on branch `media-long` (long/video.mp4, long/thumb.jpg = A, long/thumb_B.jpg = B)
- Final file: 11:16, 1920×1080, 87.9 MB (two-pass 900k), −14.4 LUFS, voice check PASS (before render and on final)

## Settings
- Audience: Not made for kids · Category: Education · Privacy: public · no AI label (owner's decision)
- Thumbnail A: THE BIBLE QUOTES IT / NO ONE HAS EVER FOUND IT (Doré, The War against Gibeon)
- Thumbnail B (YouTube Test & Compare): THE SUN STOOD STILL / AND A LOST BOOK RECORDED IT (Doré, Baruch)

## Tags
book of jasher, sefer hayashar, lost books of the bible, joshua 10, sun stood still, 2 samuel 1, song of the bow, book of the upright, apocrypha, bible history, pseudo-jasher, jacob ilive, septuagint, josephus, ancient manuscripts, lost scriptures

## Description
See description.txt (posted verbatim).

## Notes for next runs
- Doré plate 020 (War against Gibeon, PDF p. 95) and 030 are printed sideways: `rotate(90, expand=True)` before plate_box (SIDEWAYS in assets.py). David Mourning over Absalom = 035 (p. 155).
- Roberts vol. 1 plate leaves are `page/n204`, `page/n213` (no -1 offset for these; n203 is the text page).
- archive.org full-text search inside a book: `https://<server>/fulltext/inside.php?item_id=ID&doc=ID&path=<dir>&q="phrase"` (server/dir from /metadata/ID); returned page ≈ leaf + 3 for bookofjasherrefe00sefe.
- New caption keys in film.js: jn40_ (1840 New York Jasher), ji29_t (Bristol 1829), ji51_ (London 1751). PRON additions: Jasher → Jay-sher, Sefer ha-Yashar, Gibeon, Modena, Ilive, Josippon, Charlemagne.
- Kokoro on this box made ~5 lines/min; budget ~12 min for voice.py. Run long ffmpeg jobs with setsid/nohup (a Bash timeout kills the process group).
- Promised next (end of 007): Gospel of Judas, Ethiopian Bible, Book of the Wars of the Lord.
