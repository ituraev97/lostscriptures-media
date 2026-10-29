# Overrides to PLAYBOOK.md (read first)

1. **Hosting**: do NOT commit videos to `main` (the repo history would grow ~100 MB a day). Host each reel on its own orphan
   branch named after its slot, force-pushed, so old media disappears from history:
   ```
   cd ~/lostscriptures-media && B=media-reel-<YYYYMMDD>-<HHMM>   # the ET slot date/time
   git checkout -q --orphan tmp-$B && git rm -rq --cached . && git clean -fdq
   mkdir -p r && cp <work>/video.mp4 r/video.mp4 && cp <work>/cover.jpg r/cover.jpg
   git add r && git commit -qm "media: <slug>" && git push -qf origin tmp-$B:$B && git checkout -q -f main
   ```
   URLs: `https://raw.githubusercontent.com/ituraev97/lostscriptures-media/<B>/r/video.mp4` and `.../r/cover.jpg` (check HTTP 200).
   Metricool copies the media when the post is created. Housekeeping: delete remote `media-reel-*` branches older than 3 days
   (`git ls-remote --heads origin 'media-reel-*'`, then `git push origin --delete <name>`).
2. **Stories list**: the source of truth is `pipeline/STORIES_DONE.md` in this repo (not a Project doc). Append the story
   with its date and platforms, commit to `main` with the session attribution lines (`git fetch origin main && git rebase origin/main` first).
3. **Delivery**: scheduled runs have no live reader; skip SendUserFile and post the Russian summary with SendUserMessage only.
4. **Platforms**: each reel goes to TikTok AND YouTube Shorts in ONE Metricool post (blogId 7718820): providers
   `[{"network":"tiktok"},{"network":"youtube"}]`, `tiktokData {"privacyOption":"PUBLIC_TO_EVERYONE","isAigc":true,...}`,
   `youtubeData {"title":"<≤90 chars> #shorts","type":"short","privacy":"public","madeForKids":false,"isAiGeneratedContent":true,"category":"EDUCATION"}`.
5. **Voice check (mandatory)**: before scheduling, run speech recognition (`pip install pocketsphinx`, 16 kHz mono,
   `pocketsphinx.Decoder(samprate=16000)`) on the first 20 s of the final video; at least 3 content words of the script must
   appear. Also confirm the voice WAVs are at the sample rate the mixer expects. If the check fails, fix it; never post a silent or garbled reel.
