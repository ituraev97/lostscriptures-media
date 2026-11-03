"""Episode 006 (Book of Giants): prepare images -> film/img/<key>.jpg and film clips -> film/<name>/.
Crops plates out of their pages, bakes the warm sepia grade. Also writes build/credits.json."""
import glob, json, os, shutil
import numpy as np
from PIL import Image, ImageFilter

ROOT = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.join(ROOT, "src")
OUT = os.path.join(ROOT, "film", "img"); os.makedirs(OUT, exist_ok=True)
os.makedirs(os.path.join(ROOT, "build"), exist_ok=True)
TONE = np.array([255, 222, 170], dtype=float) / 255.0


def warm(im, strength):
    a = np.asarray(im.convert("RGB"), dtype=float)
    m = 1 - strength + strength * TONE
    return Image.fromarray(np.clip(a * m, 0, 255).astype(np.uint8))


def plate_box(im, thr=0.12, pad=6, frac=0.25):
    g = np.asarray(im.convert("L").filter(ImageFilter.GaussianBlur(3)), dtype=float) / 255
    paper = np.median(np.concatenate([g[:20].ravel(), g[-20:].ravel(), g[:, :20].ravel(), g[:, -20:].ravel()]))
    ink = (paper - g) > thr
    rows = ink.mean(axis=1) > frac
    cols = ink.mean(axis=0) > frac
    def run(m):
        best, cur, s, bl = (0, len(m)), 0, 0, 0
        for i, v in enumerate(m):
            if v:
                if cur == 0: s = i
                cur += 1
                if cur > bl: bl, best = cur, (s, i + 1)
            else: cur = 0
        return best
    y0, y1 = run(rows); x0, x1 = run(cols)
    return (max(0, x0 + pad), max(0, y0 + pad), min(im.width, x1 - pad), min(im.height, y1 - pad))


def save(key, im, strength, maxw=2400):
    if im.width > maxw:
        im = im.resize((maxw, int(im.height * maxw / im.width)), Image.LANCZOS)
    warm(im, strength).save(os.path.join(OUT, key + ".jpg"), quality=90)
    return im.size


def frac(im, c):
    w, h = im.size
    return im.crop((int(w * c[0]), int(h * c[1]), int(w * c[2]), int(h * c[3])))


credits = {}

# ---- Gustave Doré (1866): plate number -> PDF page = 19 + 4 * (plate - 1)
DORE = {"004": "The Deluge", "005": "Noah Cursing Ham", "006": "The Tower of Babel", "008": "The Destruction of Sodom",
        "017": "Joseph Interpreting Pharaoh's Dream", "040": "Elijah Destroying the Messengers of Ahaziah",
        "045": "The Destruction of Sennacherib's Host", "046": "Baruch", "049": "Daniel",
        "054": "Jonah Calling Nineveh to Repentance", "096": "The Deliverance of St. Peter", "100": "Death on the Pale Horse"}
for p, what in DORE.items():
    page = 19 + 4 * (int(p) - 1)
    f = glob.glob(os.path.join(SRC, "dore_hi", f"p{page}-*.jpg"))[0]
    im = Image.open(f)
    im = im.crop(plate_box(im))
    credits["dore_" + p] = {"size": save("dore_" + p, im, 0.75), "what": what,
                            "src": "Gustave Doré, engraving for the Bible (1866), from The Doré Bible Gallery", "via": "archive.org/details/dorbiblegaller00doruoft"}

# ---- David Roberts, vol. 1 (holylandsyriaidu1to2robe): leaf -> (key, title); plates are printed sideways
RS = "David Roberts, The Holy Land, Syria, Idumea, Arabia, Egypt & Nubia (lithographs by Louis Haghe, 1842-49)"
ROBERTS = {"rt_155": ("r155", "The Sea of Tiberias, looking towards Bashan"),
           "rh_161": ("r161", "The Lake of Tiberias, looking towards Mount Hermon"),
           "rd_204": ("r204", "The Dead Sea, looking towards Moab"),
           "rg_213": ("r213", "The Wilderness of Engedi, near the Convent of St. Saba")}
CROP = {"rt_155": (.10, .09, .91, .86), "rh_161": (.11, .07, .95, .85), "rd_204": (.22, .20, .88, .86), "rg_213": (.11, .13, .94, .89)}  # measured on the upright scans
for k, (f, what) in ROBERTS.items():
    im = Image.open(os.path.join(SRC, "hi", f + ".jpg")).rotate(-90, expand=True)
    im = frac(im, CROP[k]) if k in CROP else im.crop(plate_box(im, thr=0.05, frac=0.06))
    credits[k] = {"size": save(k, im, 0.35), "what": what, "src": RS, "via": "archive.org/details/holylandsyriaidu1to2robe"}

# ---- A. von Le Coq, Chotscho (Berlin, 1913): Manichaean finds from Kocho (Turfan oasis)
CH = "A. von Le Coq, Chotscho: Facsimile-Wiedergaben der wichtigeren Funde der ersten Königlich Preussischen Expedition nach Turfan (Berlin, 1913)"
CHOT = {"ch_32": ("ch32", (.07, .12, .94, .86), "Manichaean wall painting from Kocho (plate 1)", 0.35),
        "ch_40": ("ch40", (.05, .07, .95, .93), "Manichaean temple banners (plate 3)", 0.35),
        "ch_44": ("ch44", (.10, .06, .90, .80), "Remains of Manichaean paintings on silk and paper (plate 4)", 0.35),
        "ch_45": ("ch45", (.20, .045, .80, .365), "Manichaean miniature fragment with Old Turkic text (plate 5)", 0.35),
        "ch_296": ("ch296", (.13, .055, .48, .21), "The ruins of Kocho, photograph (plate 68)", 0.6)}
for k, (f, c, what, s) in CHOT.items():
    im = frac(Image.open(os.path.join(SRC, "ms", f + ".jpg")).convert("RGB"), c)
    credits[k] = {"size": save(k, im, s), "what": what, "src": CH, "via": "archive.org/details/chotscho00leco"}

# ---- M. R. James, The Lost Apocrypha of the Old Testament (London: SPCK, 1920)
JM = "M. R. James, The Lost Apocrypha of the Old Testament (London: SPCK, 1920)"
for k, f, c, what in [("jm_gel", "jm16", (.05, .06, .95, .80), "p. xiii, the Gelasian list (Ogias)"),
                      ("jm_og", "jm57", (.05, .538, .95, .97), "p. 40, the entry on the Book of Og")]:
    im = frac(Image.open(os.path.join(SRC, "ms", f + ".jpg")).convert("RGB"), c)
    credits[k] = {"size": save(k, im, 0.85), "what": what, "src": JM, "via": "archive.org/details/lostapocryphaofo00jameuoft"}

# ---- film clips: Noah's Ark (Warner Bros., 1928): the wave over the city, and the flooded city (wide shots)
for name, run, rng in [("wave", "c", (40, 72)), ("city", "b", (48, 96))]:
    d = os.path.join(ROOT, "film", name); shutil.rmtree(d, ignore_errors=True); os.makedirs(d)
    fs = sorted(glob.glob(os.path.join(SRC, "film_ark_" + run, "*.jpg")))[rng[0]:rng[1]]
    for i, f in enumerate(fs):
        warm(Image.open(f), 0.75).save(os.path.join(d, f"f{i:04d}.jpg"), quality=86)
    json.dump({"n": len(fs), "fps": 12}, open(os.path.join(d, name + ".json"), "w"))
    credits["film_" + name] = {"what": {"wave": "The Flood breaks over the city", "city": "The flooded city"}[name],
                               "src": "Noah's Ark (Warner Bros., dir. Michael Curtiz, 1928), public domain in the US",
                               "via": "archive.org/details/noahs-ark-1928-tmdb104430"}
json.dump(credits, open(os.path.join(ROOT, "build", "credits.json"), "w"), indent=1)
print(len(credits), "assets")
