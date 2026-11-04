"""Episode 007 (Book of Jasher): prepare images -> film/img/<key>.jpg and film clips -> film/<name>/.
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
DORE = {"003": "The Murder of Abel", "006": "The Tower of Babel", "007": "Abraham Entertains Three Strangers",
        "019": "Moses in the Bulrushes", "020": "The War against Gibeon", "022": "Deborah's Song of Triumph",
        "031": "Saul and David", "032": "David Spares Saul", "033": "Death of Saul", "035": "David Mourning over Absalom", "036": "Solomon",
        "038": "The Cedars Destined for the Temple", "044": "Isaiah", "046": "Baruch"}
SIDEWAYS = {"020"}
for p, what in DORE.items():
    page = 19 + 4 * (int(p) - 1)
    f = glob.glob(os.path.join(SRC, "dore_hi", f"p{page}-*.jpg"))[0]
    im = Image.open(f)
    if p in SIDEWAYS: im = im.rotate(90, expand=True)
    im = im.crop(plate_box(im))
    credits["dore_" + p] = {"size": save("dore_" + p, im, 0.75), "what": what,
                            "src": "Gustave Doré, engraving for the Bible (1866), from The Doré Bible Gallery", "via": "archive.org/details/dorbiblegaller00doruoft"}

# ---- David Roberts, vol. 1 (holylandsyriaidu1to2robe): leaf -> (key, title); plates are printed sideways
RS = "David Roberts, The Holy Land, Syria, Idumea, Arabia, Egypt & Nubia (lithographs by Louis Haghe, 1842-49)"
ROBERTS = {"rd_204": ("r204", "The Dead Sea, looking towards Moab"),
           "rg_213": ("r213", "The Wilderness of Engedi, near the Convent of St. Saba")}
CROP = {"rd_204": (.22, .20, .88, .86), "rg_213": (.11, .13, .94, .89)}
for k, (f, what) in ROBERTS.items():
    im = Image.open(os.path.join(SRC, "hi", f + ".jpg")).rotate(-90, expand=True)
    im = frac(im, CROP[k])
    credits[k] = {"size": save(k, im, 0.35), "what": what, "src": RS, "via": "archive.org/details/holylandsyriaidu1to2robe"}

# ---- printed editions of the Book of Jasher (all before 1930)
BOOKS = {
 "jn40_t": ("hi_a40_10", (.04, .05, .96, .97), "Title page (Hebrew Sefer ha-Yashar and English)",
            "The Book of Jasher, referred to in Joshua and Second Samuel (New York: M. M. Noah & A. S. Gould, 1840)", "archive.org/details/bookofjasherrefe00sefe"),
 "jn40_260": ("hi_a40_293", (.03, .03, .97, .97), "Page 260: chapter 88, the sun stands still",
            "The Book of Jasher, referred to in Joshua and Second Samuel (New York: M. M. Noah & A. S. Gould, 1840)", "archive.org/details/bookofjasherrefe00sefe"),
 "ji29_t": ("hi_i29_2", (.03, .02, .97, .98), "Title page of the Bristol reprint",
            "The Book of Jasher, with Testimonies and Notes ('Alcuin'; Bristol: Philip Rose, 1829)", "archive.org/details/bookofjasherwith00iliv"),
 "ji51_t": ("hi_i51_0", (.0, .0, 1., 1.), "Title page",
            "The Book of Jasher, with Testimonies and Notes ('Alcuin'; London: [Jacob Ilive], 1751)", "archive.org/details/bim_eighteenth-century_the-book-of-jasher_ilive-jacob_1751"),
 "ji51_p1": ("hi_i51_8", (.0, .0, 1., 1.), "Chapter 1",
            "The Book of Jasher, with Testimonies and Notes ('Alcuin'; London: [Jacob Ilive], 1751)", "archive.org/details/bim_eighteenth-century_the-book-of-jasher_ilive-jacob_1751"),
}
for k, (f, c, what, s, via) in BOOKS.items():
    im = Image.open(os.path.join(SRC, "ms", f + ".jpg")).convert("RGB")
    if k == "jn40_t":  # cover the later library date stamp (top right) with the paper colour
        a = np.asarray(im).copy(); h, w = a.shape[:2]
        paper = np.median(a[int(h*.2):int(h*.3), int(w*.75):int(w*.95)].reshape(-1, 3), axis=0)
        a[:int(h*.15), int(w*.70):] = paper; im = Image.fromarray(a)
    im = frac(im, c)
    credits[k] = {"size": save(k, im, 0.85), "what": what, "src": s, "via": via}

json.dump(credits, open(os.path.join(ROOT, "build", "credits.json"), "w"), indent=1)
print(len(credits), "assets")
