"""Episode 010 (The Ethiopian Bible): prepare images -> film/img/<key>.jpg; writes build/credits.json."""
import json, os
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


def pillar(im):
    """Tall picture -> 16:9 canvas with a blurred, darkened copy behind it (avoids a huge cover-crop zoom)."""
    H = im.height; W = int(H * 16 / 9)
    bg = im.resize((W, int(im.height * W / im.width)), Image.LANCZOS)
    y = (bg.height - H) // 2; bg = bg.crop((0, y, W, y + H)).filter(ImageFilter.GaussianBlur(H / 40))
    bg = Image.fromarray((np.asarray(bg.convert("RGB"), dtype=float) * 0.32).astype(np.uint8))
    bg.paste(im.convert("RGB"), ((W - im.width) // 2, 0))
    return bg


def save(key, im, strength, maxw=2400):
    if key.startswith("bent_"):  # soften the halftone screen of the 1890s photo-engravings
        im = im.filter(ImageFilter.MedianFilter(5)).filter(ImageFilter.GaussianBlur(1.2))
    if (im.height > im.width * 1.25 or key == "bent_213") and not key.startswith(("ms_", "dore_")):
        im = pillar(im); maxw = 3200
    if im.width > maxw:
        im = im.resize((maxw, int(im.height * maxw / im.width)), Image.LANCZOS)
    warm(im, strength).save(os.path.join(OUT, key + ".jpg"), quality=90)
    return im.size


def frac(im, c):
    w, h = im.size
    return im.crop((int(w * c[0]), int(h * c[1]), int(w * c[2]), int(h * c[3])))


def crop(im, manual, **kw):
    if manual:
        return frac(im, manual)
    b = plate_box(im, **kw)
    if b[2] - b[0] < im.width * 0.35 or b[3] - b[1] < im.height * 0.2:
        print("  plate_box failed, using a margin crop")
        return frac(im, (0.06, 0.05, 0.94, 0.88))
    return im.crop(b)


credits = {}

# ---- Gustave Doré (1866): plate number -> PDF page = 19 + 4 * (plate - 1)
DORE = {"004": "The Deluge", "030": "The Return of the Ark", "036": "Solomon", "038": "The Cedars Destined for the Temple",
        "046": "Baruch", "048": "The Vision of Ezekiel"}
for p, what in DORE.items():
    page = 19 + 4 * (int(p) - 1)
    im = Image.open(os.path.join(SRC, "dore", f"p-{page:03d}.jpg"))
    im = im.crop(plate_box(im))
    credits["dore_" + p] = {"size": save("dore_" + p, im, 0.75), "what": what,
                            "src": "Gustave Doré, engraving for the Bible (1866), from The Doré Bible Gallery", "via": "archive.org/details/dorbiblegaller00doruoft"}

# ---- Ethiopian manuscript paintings (British Museum MSS) in Budge, The Queen of Sheba and her only son Menyelek (1922)
BQS = "E. A. Wallis Budge, The Queen of Sheba and Her Only Son Menyelek (London, 1922), plates from Ethiopic manuscripts in the British Museum"
BQ = {"014": "God Almighty, the Ancient of Days, with the four living creatures seen by Ezekiel",
      "102": "Two columns of the Ethiopic (Ge'ez) text of the Kebra Nagast",
      "111": "Moses receiving the Tables of the Law", "131": "Aaron holding his rod which blossomed",
      "141": "The Archangel Gabriel appearing to Zacharias in the sanctuary",
      "151": "An angel bringing food to Mary in the Temple", "161": "Portrait of Mary with the Child",
      "201": "Simeon carrying Christ in his arms", "231": "The Baptism of Christ by John",
      "369": "Christ ascending into heaven", "381": "The Last Judgment"}
BQC = {}  # manual crops (fractions) if the automatic box fails
for p, what in BQ.items():
    im = Image.open(os.path.join(SRC, "bq", f"p-{int(p):03d}.jpg")).convert("RGB")
    im = crop(im, BQC.get(p), thr=0.10, frac=0.30, pad=10)
    credits["bq_" + p] = {"size": save("bq_" + p, im, 0.45), "what": what, "src": BQS, "via": "archive.org/details/queenofshebahero00budgrich"}

# ---- coloured Ethiopian manuscript paintings in Budge, The Lives of Maba' Seyon and Gabra Krestos (1898)
BMS = "E. A. Wallis Budge, The Lives of Mabâ' Seyôn and Gabra Krestôs (London, 1898), plates from Ethiopian manuscript paintings"
BM = {"061": "St George slaying the dragon", "162": "Scenes from the life of Mabâ' Seyôn",
      "166": "Scenes from the life of Mabâ' Seyôn", "178": "Mabâ' Seyôn before a church", "182": "Mabâ' Seyôn and the Eucharist",
      "190": "Mabâ' Seyôn at a church"}
BMC = {}
for p, what in BM.items():
    im = Image.open(os.path.join(SRC, "bm", f"p-{int(p):03d}.jpg")).convert("RGB")
    im = crop(im, BMC.get(p), thr=0.10, frac=0.30, pad=8)
    credits["bm_" + p] = {"size": save("bm_" + p, im, 0.20), "what": what, "src": BMS, "via": "archive.org/details/b28037650"}

# ---- photographs of Aksum in J. Theodore Bent, The Sacred City of the Ethiopians (1893; new ed. 1896)
BENTS = "J. Theodore Bent, The Sacred City of the Ethiopians (London, 1896)"
BENT = {"184": "Church at Aksum", "209": "Ancient monoliths, Aksum", "211": "Monolith with bands, Aksum", "213": "Tall standing monolith, Aksum"}
BENTC = {"211": (0.165, 0.137, 0.80, 0.855), "184": (0.175, 0.282, 0.88, 0.615)}
for p, what in BENT.items():
    im = Image.open(os.path.join(SRC, "bent", f"p-{int(p):03d}.jpg")).convert("RGB")
    im = crop(im, BENTC.get(p), thr=0.12, frac=0.35, pad=8)
    credits["bent_" + p] = {"size": save("bent_" + p, im, 0.45), "what": what, "src": BENTS, "via": "archive.org/details/sacredcityofethi00bent"}

# ---- Ge'ez text of 1 Enoch, ed. A. Dillmann (1851)
for k, f in {"ms_geez_1": "dill_n9", "ms_geez_2": "dill_n10", "ms_geez_3": "dill_n30"}.items():
    im = Image.open(os.path.join(SRC, "ms", f + ".jpg")).convert("RGB")
    im = frac(im, (0.04, 0.03, 0.96, 0.86))  # drop the scanner mark at the foot
    credits[k] = {"size": save(k, im, 0.85), "what": "Ethiopic (Ge'ez) text of 1 Enoch",
                  "src": "A. Dillmann, Liber Henoch aethiopice (Leipzig, 1851)", "via": "archive.org/details/bub_gb_DigVAAAAQAAJ"}

json.dump(credits, open(os.path.join(ROOT, "build", "credits.json"), "w"), indent=1)
print(len(credits), "assets")
