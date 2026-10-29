# The Lost Scriptures (@lostscripturesbooks) — Bible-story reels kit

Everything needed to make English Bible-story TikTok reels in the house style.

- `PLAYBOOK.md` — the full production guide: format rules, TikTok safe zones, research step, exact commands
  (Kokoro TTS voice am_michael → atempo → pocketsphinx alignment → word captions → synthesized score/SFX →
  -14 LUFS mix → Remotion SVG scenes → render → cover), Metricool + hosting notes.
- `STORIES_DONE.md` — stories already made; never repeat them.
- `scripts/` — tts_segs.py (Kokoro), align5.py (forced alignment), mkcaps5.py (captions), wall_audio.py (music + SFX),
  example_segs.json (script format: [text, pause, speed]).
- `template/` — Remotion 4.0.539 project of the finished reel "The Writing on the Wall" (Daniel 5): lib.ts (timings,
  safe zones, easing), Art.tsx (SVG illustrations), Wall.tsx (scenes, HUD with channel Logo, captions, Cover still),
  caps.ts (example captions). Fonts go in `template/public/` (Cinzel, Cormorant Garamond, Noto Serif Hebrew via @fontsource).
- `brand/` — channel logo (PNG + SVG source).
- `example/` — the reel's cover, spoken text and caption timings.

Prompt for a new chat: "Read README.md and PLAYBOOK.md from this zip and make the next Bible-story reel for
@lostscripturesbooks exactly by the playbook, using template/ as the quality bar. Pick a story not in STORIES_DONE.md."
