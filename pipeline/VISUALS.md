# Reels visuals — real public-domain pictures and film (overrides PLAYBOOK "vector look")

Owner's decision (2026-11-02): reels are built from REAL pictures and footage, not drawn vector scenes. Every beat shows a
public-domain painting, engraving, lithograph, old photograph or silent-film shot of the story. Vector graphics stay only
as overlays: HUD, kinetic captions, titles, stamps, chips, pins, counters, simple map lines.

## Sources (all archive.org; the shell reaches it. Wikimedia/museums/LoC are blocked)
| What | archive.org item | Notes |
|---|---|---|
| Gustave Doré, full Bible (1866), ~230 plates | `bnf-bpt6k1044316d` (Old Test. 1: Genesis–Esther…), `bnf-bpt6k10443187` (vol. 2: Job–Revelation) | French captions under each plate ("MORT D'ABSALON"); plates are every ~6 leaves. Best for drama. |
| Doré Bible Gallery (100 plates, English text) | `dorbiblegaller00doruoft` | |
| James Tissot, Old Testament (1904), colour | `oldtestamentthre0001unse` (Genesis–Ruth…), `oldtestamentthre0002unse` (Samuel–Kings…) | Colour plates + b/w drawings; English captions ("ABSALOM HANGING ON THE OAK TREE"). Published 1904 → US public domain. |
| James Tissot, Life of Our Saviour (1899), colour | `lifeofoursaviour01tiss`, `lifeofoursaviour02tiss_0`, `lifeofoursaviour03tiss_0` | New Testament. |
| Julius Schnorr von Carolsfeld, Die Bibel in Bildern (1860), 240 woodcuts | `diebibelinbilder00schn` | German captions. |
| David Roberts, The Holy Land (1842–49) | `holylandsyriaidu1to2robe`, `holylandsyriaidu3to4robe` | Places (Jerusalem, Petra, Sinai, Dead Sea…). Plates printed sideways: rotate −90° before cropping. |
| Films (pre-1930, US public domain) | `THEKINGOFKINGS1927SilentFilm`, `noahs-ark-1928-tmdb104430`, `FromTheMangerToTheCross1912` (filmed in Egypt/Palestine), `INTOLERANCE_201407` (Babylon sets), Ten Commandments 1923 / Ben-Hur 1925 (search) | No intertitle cards, no close-up suffering. |

Never use photos of real museum objects from modern sites, modern films/TV, stock sites or AI images.

## Tool: `pipeline/visuals/pd.py`
```
python3 pd.py find <item> '<regex>'                 # leaves whose OCR text (captions!) matches, e.g. 'ABSALOM.{0,30}OAK' or "mort d.absalon"
python3 pd.py browse <item> <from> <to> -o s.jpg    # contact sheet of a leaf range — LOOK at it
python3 pd.py get <item> <leaf> -o page.jpg         # hi-res page
python3 pd.py crop page.jpg x0 y0 x1 y1 -o pic.jpg  # crop the picture out of the page (fractions); no captions, no paper margin
python3 pd.py prep pic.jpg public <name> --sepia .7 # engravings .6–.75, Tissot/colour .1–.2, Roberts .35 → prints the Pic JSON for Photo.tsx
python3 pd.py film-sheet <item> --every 30 --start S --end E -o f.jpg   # find shots (timestamps on the sheet)
python3 pd.py film <item> <start_s> <dur_s> -o public/clip1.mp4         # silent clip, bars removed, 1080 wide
```
ALWAYS look at the cropped picture before using it, and name a scene only for what it really shows.

## Remotion: `template/src/Photo.tsx`
- `<Shot t t0 t1 pic={…} from={[fx,fy,zoom]} to={[…]} mode="cover"|"fit" />` — slow camera move (log-space zoom) to the detail being
  narrated. `cover` fills 9:16 (pan across a landscape plate); `fit` shows the whole picture over its blurred backdrop.
- `<Clip t t0 t1 clip="clip1.mp4" vw={1080} vh={…} mode="band" />` — film across the width over a dark enlarged copy (sharp).
  Use `mode="cover"` only for sharp, high-resolution sources.
- `<PhotoShade/>` above all shots (legibility for HUD/captions), `<Credit s={pic.credit} a/>` for the current picture,
  `<Pin x y s a/>` to point at a person/object in the picture.
- Reference demo (10 s, Absalom): `example/photo_demo/Demo.tsx`.

## Rhythm and quality
- A new shot or a new camera move every 2–4 s; 18–30 shots per reel; mix 2–4 painters/engravers + 1–3 film shots + Roberts places.
- Crossfades 0.25–0.35 s, hard cuts on hits with screen shake; a slow push-in on faces; reveal details with pins/titles.
- Titles/stamps sit inside the safe zone (x 70–930, y 470–1410) on darker parts of the picture.
- Cover still: the strongest picture, cropped 3:4-safe, gold hook text, red payoff (as before).
- Description/caption: add "Art: Doré (1866), Tissot (1904)… public domain" in the TikTok text and the Shorts description.
