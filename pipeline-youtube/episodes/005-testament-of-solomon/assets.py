"""Episode 005 (Testament of Solomon): prepare images -> film/img/<key>.jpg and film clips -> film/<name>/.
Rotates Roberts plates upright, crops paper margins and captions, bakes the warm sepia grade.
Also writes build/credits.json (what each key is and where it came from)."""
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


credits = {}

# ---- Gustave Doré (1866): plate number -> PDF page = 19 + 4 * (plate - 1)
DORE = {"008": (47, "The Destruction of Sodom"), "036": (159, "Solomon"), "037": (163, "The Judgment of Solomon"),
        "038": (167, "The Cedars Destined for the Temple"), "041": (179, "Elijah's Ascent in a Chariot of Fire"),
        "051": (219, "Belshazzar's Feast"), "056": (239, "Heliodorus Punished in the Temple"),
        "064": (271, "Christ Stilling the Tempest"), "065": (275, "The Dumb Man Possessed"),
        "096": (399, "The Deliverance of St. Peter")}
for p, (page, what) in DORE.items():
    f = glob.glob(os.path.join(SRC, "dore_hi", f"p{page}-*.jpg"))[0]
    im = Image.open(f)
    im = im.crop(plate_box(im))
    credits["dore_" + p] = {"size": save("dore_" + p, im, 0.75), "what": what,
                            "src": "Gustave Doré, engraving for the Bible (1866), from The Doré Bible Gallery", "via": "archive.org/details/dorbiblegaller00doruoft"}

# ---- David Roberts: Jerusalem plates (vol. 1) and the Sinai encampment (vol. 3)
RS = "David Roberts, The Holy Land, Syria, Idumea, Arabia, Egypt & Nubia (lithographs by Louis Haghe, 1842-49)"
ROBERTS = {"rj_65": ("j65", (.07, .09, .95, .80), "Jerusalem, from the road leading to Bethany", "holylandsyriaidu1to2robe"),
           "rj_71": ("j71", (.10, .10, .93, .83), "Mosque of Omar, on the ancient site of the Temple", "holylandsyriaidu1to2robe"),
           "rj_77": ("j77", (.09, .09, .93, .81), "Jerusalem from the south", "holylandsyriaidu1to2robe"),
           "rj_92": ("j92", (.17, .14, .91, .77), "The Golden Gate", "holylandsyriaidu1to2robe"),
           "rj_101": ("j101", (.06, .08, .95, .81), "Jerusalem, from the Mount of Olives", "holylandsyriaidu1to2robe"),
           "rj_113": ("j113", (.09, .09, .93, .81), "Jerusalem from the north", "holylandsyriaidu1to2robe"),
           "rs_77": ("s77", (.12, .12, .91, .86), "Encampment of the Aulad-Said, Mount Sinai", "holylandsyriaidu3to4robe")}
for k, (f, c, what, via) in ROBERTS.items():  # crop boxes measured on each upright scan
    im = Image.open(os.path.join(SRC, "hi", f + ".jpg")).rotate(-90, expand=True)
    w, h = im.size
    im = im.crop((int(w * c[0]), int(h * c[1]), int(w * c[2]), int(h * c[3])))
    credits[k] = {"size": save(k, im, 0.35), "what": what, "src": RS, "via": "archive.org/details/" + via}

# ---- printed editions
def page(path, c, k, what, src, via, strength=0.85):
    im = Image.open(path).convert("RGB")
    w, h = im.size
    im = im.crop((int(w * c[0]), int(h * c[1]), int(w * c[2]), int(h * c[3])))
    credits[k] = {"size": save(k, im, strength), "what": what, "src": src, "via": via}

MC = "C. C. McCown, The Testament of Solomon, edited from manuscripts (Leipzig: Hinrichs, 1922)"
CONY = "F. C. Conybeare, \"The Testament of Solomon\", Jewish Quarterly Review 11 (October 1898)"
page(os.path.join(SRC, "ms", "M-009.jpg"), (.0, .135, 1.0, .85), "mc_t", "Title page", MC, "archive.org/details/cu31924028957400")
page(os.path.join(SRC, "ms", "M-160.jpg"), (.0, .04, 1.0, .62), "mc_g", "Greek text, p. 6*", MC, "archive.org/details/cu31924028957400")
page(os.path.join(SRC, "ms", "C-02.jpg"), (.08, .04, .92, .96), "cony_1", "First page of the article", CONY, "archive.org/details/jstor-1450398")
page(os.path.join(SRC, "ms", "C-16.jpg"), (.06, .33, .94, .97), "cony_16", "Opening of the translation, p. 15", CONY, "archive.org/details/jstor-1450398")

# ---- film clip: The Ten Commandments (1923), the parting of the Red Sea (wide shot, frames 1-64 of the 2125.5 s run)
for name in ["redsea"]:
    d = os.path.join(ROOT, "film", name); shutil.rmtree(d, ignore_errors=True); os.makedirs(d)
    fs = sorted(glob.glob(os.path.join(SRC, "film_" + name, "*.jpg")))[:64]
    for i, f in enumerate(fs):
        warm(Image.open(f), 0.75).save(os.path.join(d, f"f{i:04d}.jpg"), quality=86)
    json.dump({"n": len(fs), "fps": 12}, open(os.path.join(d, name + ".json"), "w"))
    credits["film_" + name] = {"what": "The parting of the Red Sea", "src": "The Ten Commandments (Paramount, dir. Cecil B. DeMille, 1923), public domain in the US",
                               "via": "archive.org/details/TheTenCommandments1923NR_201503"}
json.dump(credits, open(os.path.join(ROOT, "build", "credits.json"), "w"), indent=1)
print(len(credits), "assets")
