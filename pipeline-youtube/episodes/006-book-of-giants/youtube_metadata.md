# The Lost Scriptures — 006: The Book of Giants

## Title
The Book of Giants: Gilgamesh, the Nephilim and the Dead Sea Scrolls

## Scheduling
- Metricool, YouTube video, 2026-11-03 14:00 America/New_York (2026-11-04 00:00 Tashkent), post id 414851268, uuid 3029199805762323741, custom thumbnail A accepted
- Planner: https://app.metricool.com/planner/calendar?blogId=7718820&openWithPostUuid=3029199805762323741
- Media hosted on branch `media-long` (long/video.mp4, long/thumb.jpg = A, long/thumb_B.jpg = B)
- Final file: 11:16, 1920×1080, 87.9 MB (two-pass 900k), −14.4 LUFS, voice check PASS (before render and on final)

## Settings
- Audience: Not made for kids · Category: Education · Privacy: public · no AI label (owner's decision)
- Thumbnail A: GILGAMESH WAS A GIANT / IN A DEAD SEA SCROLL (Doré, The Deluge)
- Thumbnail B (YouTube Test & Compare): THE GIANTS DREAMED / OF THE FLOOD (Doré, Destruction of Sennacherib's Host)

## Tags
book of giants, dead sea scrolls, nephilim, gilgamesh, book of enoch, watchers, giants in the bible, genesis 6, qumran, manichaeism, mani, lost books of the bible, apocrypha, pseudepigrapha, bible history, ancient manuscripts, lost scriptures

## Description
See description.txt (posted verbatim).

## Notes for next runs
- Setup: playwright@1.59 wants chromium_headless_shell-1217 → symlink to -1243 (done this run).
- Two-pass encode of an 11-min film takes >10 min: run it in the background (nohup) and poll.
- Hosting: pushed media-long from a fresh `git init` temp dir (orphan branch, force push) instead of switching branches in the main clone — avoids untracked-file conflicts.
- New caption keys in film.js: ch_ (Le Coq, Chotscho 1913), jm_ (M. R. James 1920), rh_/rt_/rg_ (Roberts Holy Land; NOTE `re_` is captioned "Egypt & Nubia", don't use it for Holy Land plates), film_wave/film_city (Noah's Ark 1928).
- Noah's Ark (1928) `noahs-ark-1928-tmdb104430` flood wide shots: wave over the city 5248.3–5251 s; flooded city wide 5474–5478 s; mountainside torrent 5200 s (crowds, avoid close).
- Roberts vol. 1 (`holylandsyriaidu1to2robe`): leaf 155 Sea of Tiberias towards Bashan, 161 Tiberias towards Hermon, 204 Dead Sea towards Moab, 213 Wilderness of Engedi (plate leaf position varies: check the printed caption).
- Chotscho (`chotscho00leco`, 1913, PD): leaf 32 Manichaean wall painting (Taf. 1), 40 temple banners (Taf. 3), 44 paintings on silk/paper (Taf. 4), 45 miniature with Turkic text (Taf. 5), 296 ruin photos (Taf. 68). Le Coq's "Die manichaeischen Miniaturen" scan on archive.org is a 1973 Graz reprint — not used.
- Doré plate numbers: the gallery list is 1-based from Creation of Eve (Joseph Interpreting = 017, p. 83; Moses in the Bulrushes = 019, p. 91).
- Promised next (end of 006): Gospel of Judas, Book of Jasher, Ethiopian Bible.
