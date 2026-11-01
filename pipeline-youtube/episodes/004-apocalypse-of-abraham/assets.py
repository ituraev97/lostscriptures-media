"""Episode 004 (Apocalypse of Abraham): prepare images -> film/img/<key>.jpg and film clips -> film/<name>/.
Rotates Roberts plates upright, crops paper margins and captions, bakes the warm sepia grade.
Also writes build/credits.json (what each key is and where it came from)."""
import glob, json, os, shutil
import numpy as np
from PIL import Image, ImageDraw, ImageFilter

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

# ---- Gustave Doré (1866)
DORE = {"001": (19, "The Creation of Eve"), "002": (23, "The Expulsion from the Garden"), "006": (39, "The Tower of Babel"),
        "007": (43, "Abraham Entertains Three Strangers"), "011": (59, "The Trial of the Faith of Abraham"),
        "038": (167, "The Cedars Destined for the Temple"), "041": (179, "Elijah's Ascent in a Chariot of Fire"),
        "044": (191, "Isaiah"), "050": (215, "The Fiery Furnace"), "055": (235, "Daniel Confounding the Priests of Bel"),
        "056": (239, "Heliodorus Punished in the Temple"), "100": (415, "Death on the Pale Horse")}
for p, (page, what) in DORE.items():
    f = glob.glob(os.path.join(SRC, "dore_hi", f"p{page}-*.jpg"))[0]
    im = Image.open(f)
    im = im.crop(plate_box(im))
    credits["dore_" + p] = {"size": save("dore_" + p, im, 0.75), "what": what,
                            "src": "Gustave Doré, engraving for the Bible (1866), from The Doré Bible Gallery", "via": "archive.org/details/dorbiblegaller00doruoft"}

# ---- David Roberts, Sinai plates (vol. 3)
RS = "David Roberts, The Holy Land, Syria, Idumea, Arabia, Egypt & Nubia (lithographs by Louis Haghe, 1842-49)"
ROBERTS = {"rs_77": ("s77", True, (.12, .12, .91, .86), "Encampment of the Aulad-Said, Mount Sinai"),
           "rs_80": ("s80", False, (.14, .14, .85, .76), "Rock of Moses, Wady-el-Leja, Mount Horeb"),
           "rs_86": ("s86", True, (.22, .22, .85, .80), "The Christian and Mahometan chapels on the summit of Mount Sinai"),
           "rs_89": ("s89", True, (.12, .12, .89, .86), "Ascent of the lower range of Sinai"),
           "rs_92": ("s92", False, (.17, .14, .82, .78), "Ascent to the summit of Mount Sinai"),
           "rs_101": ("s101", False, (.11, .10, .88, .86), "Convent of St. Catherine, with Mount Horeb")}
for k, (f, rot, c, what) in ROBERTS.items():  # crop boxes measured on a 10% grid of each upright scan
    im = Image.open(os.path.join(SRC, "hi", f + ".jpg"))
    if rot: im = im.rotate(-90, expand=True)
    w, h = im.size
    im = im.crop((int(w * c[0]), int(h * c[1]), int(w * c[2]), int(h * c[3])))
    credits[k] = {"size": save(k, im, 0.35), "what": what, "src": RS, "via": "archive.org/details/holylandsyriaidu3to4robe"}

# ---- printed editions
def page(path, c, k, what, src, via, strength=0.85, fix=None):
    im = Image.open(path).convert("RGB")
    if fix: fix(im)
    w, h = im.size
    im = im.crop((int(w * c[0]), int(h * c[1]), int(w * c[2]), int(h * c[3])))
    credits[k] = {"size": save(k, im, strength), "what": what, "src": src, "via": via}

TIKH = "N. S. Tikhonravov, Pamyatniki otrechennoi russkoi literatury, vol. 1 (Moscow, 1863), Slavonic text of the Apocalypse of Abraham from Codex Sylvester (14th century)"
page(os.path.join(SRC, "ms", "T-025.jpg"), (.03, .04, .49, .93), "tikh_l", "Opening of the Apocalypse of Abraham, Slavonic text", TIKH, "archive.org/details/20200408_20200408_1154")
page(os.path.join(SRC, "ms", "T-025.jpg"), (.52, .04, .98, .93), "tikh_r", "Apocalypse of Abraham, Slavonic text, p. 33", TIKH, "archive.org/details/20200408_20200408_1154")

def no_dot(im):  # a blue library sticker dot on the scan of the title page
    d = ImageDraw.Draw(im); w, h = im.size
    g = np.asarray(im, dtype=float)
    blue = (g[:, :, 2] - g[:, :, 0]) > 40
    ys, xs = np.where(blue)
    if len(xs):
        paper = tuple(int(v) for v in np.median(g[h // 2 - 50:h // 2 + 50, 40:120].reshape(-1, 3), axis=0))
        d.ellipse((xs.min() - 12, ys.min() - 12, xs.max() + 12, ys.max() + 12), fill=paper)

BOX = "G. H. Box with J. I. Landsman, The Apocalypse of Abraham, translated from the Slavonic (SPCK, London, 1918; 2nd impression 1919)"
page(os.path.join(SRC, "box", "B6.jpg"), (.04, .02, .96, .52), "box_t", "Title page", BOX, "archive.org/details/apocalypseofabra00boxg", fix=no_dot)
page(os.path.join(SRC, "box", "B38.jpg"), (.04, .03, .96, .97), "box_35", "Chapter I, p. 35", BOX, "archive.org/details/apocalypseofabra00boxg")
page(os.path.join(SRC, "box", "B47.jpg"), (.04, .03, .96, .97), "box_44", "Part II, p. 44", BOX, "archive.org/details/apocalypseofabra00boxg")
page(os.path.join(SRC, "box", "W6.jpg"), (.0, .08, 1.0, .42), "bon_t", "Title page",
     "G. Nathanael Bonwetsch, Die Apokalypse Abrahams (Leipzig, 1897)", "archive.org/details/dieapokalypseabr0000unse")

# ---- film clip: The Ten Commandments (1923), Moses climbing Sinai (frames 1-96 of the 2234 s run)
for name in ["climb"]:
    d = os.path.join(ROOT, "film", name); shutil.rmtree(d, ignore_errors=True); os.makedirs(d)
    fs = sorted(glob.glob(os.path.join(SRC, "film_" + name, "*.jpg")))[:96]
    for i, f in enumerate(fs):
        warm(Image.open(f), 0.75).save(os.path.join(d, f"f{i:04d}.jpg"), quality=86)
    json.dump({"n": len(fs), "fps": 12}, open(os.path.join(d, name + ".json"), "w"))
    credits["film_" + name] = {"what": "Moses climbing Mount Sinai", "src": "The Ten Commandments (Paramount, dir. Cecil B. DeMille, 1923), public domain in the US",
                               "via": "archive.org/details/TheTenCommandments1923NR_201503"}
json.dump(credits, open(os.path.join(ROOT, "build", "credits.json"), "w"), indent=1)
print(len(credits), "assets")
