# Overrides to PLAYBOOK.md (read first)

0. **Visuals**: read `pipeline/VISUALS.md` — reels are made from REAL public-domain paintings, engravings and silent-film
   footage (Doré, Tissot, Schnorr, Roberts, films before 1930) with `visuals/pd.py` + `template/src/Photo.tsx`. Drawn vector scenes
   (Art.tsx) are no longer used for story beats; only overlays (HUD, captions, titles, pins) stay graphic.

1. **Hosting**: do NOT commit videos to `main`. Host each reel on a FIXED slot branch, force-pushed every day:
   `media-reel-1000`, `media-reel-1300`, `media-reel-1700`, `media-reel-2000` (the ET slot time). Overwriting the same 4 branches
   keeps the repository from growing (old media becomes unreachable and GitHub garbage-collects it). Deleting branches is NOT
   permitted from these sessions, so never create new dated branches.
   ```
   cd ~/lostscriptures-media && B=media-reel-<HHMM>   # the ET slot time
   git checkout -q --orphan tmp-$B && git rm -rq --cached . && git clean -fdq
   mkdir -p r && cp <work>/video.mp4 r/video.mp4 && cp <work>/cover.jpg r/cover.jpg
   git add r && git commit -qm "media: <slug>" && git push -qf origin tmp-$B:$B && git checkout -q -f main
   ```
   URLs: `https://raw.githubusercontent.com/ituraev97/lostscriptures-media/<B>/r/video.mp4` and `.../r/cover.jpg` (check HTTP 200
   and that the size matches the new file; raw.githubusercontent.com may cache for a few minutes, so add `?v=<unix time>` to the
   URLs you give Metricool). Metricool copies the media when the post is created, so tomorrow's overwrite is safe.
2. **Stories list**: the source of truth is `pipeline/STORIES_DONE.md` in this repo (not a Project doc). Append the story
   with its date and platforms, commit to `main` with the session attribution lines (`git fetch origin main && git rebase origin/main` first).
3. **Delivery**: scheduled runs have no live reader; skip SendUserFile and post the Russian summary with SendUserMessage only.
4. **Platforms**: each reel goes to TikTok AND YouTube Shorts in ONE Metricool post (blogId 7718820): providers
   `[{"network":"tiktok"},{"network":"youtube"}]`, `tiktokData {"privacyOption":"PUBLIC_TO_EVERYONE",...}`,
   `youtubeData {"title":"<≤90 chars> #shorts","type":"short","privacy":"public","madeForKids":false,"category":"EDUCATION"}`.
   Owner's decision (2026-11-02): NO AI labels anywhere — never set isAigc or isAiGeneratedContent, and do not write "AI"/"synthetic voice" in captions or descriptions.
5. **Voice check (mandatory)**: before scheduling, run speech recognition (`pip install pocketsphinx`, 16 kHz mono,
   `pocketsphinx.Decoder(samprate=16000)`) on the first 20 s of the final video; at least 3 content words of the script must
   appear. Also confirm the voice WAVs are at the sample rate the mixer expects. If the check fails, fix it; never post a silent or garbled reel.
