"""Episode 002 (Jubilees): prepare images -> film/img/<key>.jpg, film clips -> film/<name>/fNNNN.jpg.
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


RV = "David Roberts, The Holy Land, Syria, Idumea, Arabia, Egypt & Nubia (lithographs by Louis Haghe, 1842-49)"
ROBERTS = {  # key: (file, volume id, what it shows)
    "rs_74": ("r3n74", "holylandsyriaidu3to4robe", "Convent of St. Catherine, Mount Sinai"),
    "rs_77": ("r3n77", "holylandsyriaidu3to4robe", "Encampment of the Aulad-Sa'id, Mount Sinai"),
    "rs_86": ("r3n86", "holylandsyriaidu3to4robe", "The chapels on the summit of Mount Sinai"),
    "rs_89": ("r3n89", "holylandsyriaidu3to4robe", "Ascent of the lower range of Sinai"),
    "rs_95": ("r3n95", "holylandsyriaidu3to4robe", "Convent of St. Catherine and the plain, Mount Sinai"),
    "rs_113": ("r3n113", "holylandsyriaidu3to4robe", "Approach to Mount Sinai"),
    "rd_195": ("r1n195", "holylandsyriaidu1to2robe", "Descent to the valley of the Jordan"),
    "rd_204": ("r1n204", "holylandsyriaidu1to2robe", "The Dead Sea"),
    "rd_207": ("r1n207", "holylandsyriaidu1to2robe", "Mar Saba, in the wilderness by the Dead Sea"),
    "rd_213": ("r1n213", "holylandsyriaidu1to2robe", "The wilderness of Engedi and the Dead Sea"),
    "rd_219": ("r1n219", "holylandsyriaidu1to2robe", "Hebron"),
}
DORE = {"019": "Creation of Eve", "023": "The Expulsion from the Garden", "027": "The Murder of Abel", "031": "The Deluge",
        "035": "Noah Cursing Ham", "039": "The Tower of Babel", "043": "Abraham Entertains Three Strangers",
        "063": "The Burial of Sarah", "071": "Isaac Blessing Jacob", "075": "Jacob Tending the Flocks of Laban"}
MS = {"ms_dill_1": ("dillhi_n14", "liberjubilaeorum00dilluoft"), "ms_dill_2": ("dillhi_n20", "liberjubilaeorum00dilluoft"),
      "ms_dill_3": ("dillhi_n30", "liberjubilaeorum00dilluoft"), "ms_dill_4": ("dillhi_n60", "liberjubilaeorum00dilluoft"),
      "ms_ch17": ("ch17hi_n8", "bookofjubileesor01char"), "ms_ch17p": ("ch17hi_n50", "bookofjubileesor01char")}

MANUAL = {"r3n74": (720, 200, 2640, 1640), "r3n86": (688, 200, 2622, 1640), "r1n204": (638, 200, 2613, 1640)}
credits = {}
for k, (f, vol, what) in ROBERTS.items():
    im = Image.open(os.path.join(SRC, "hi", f + ".jpg"))
    if im.height > im.width: im = im.rotate(-90, expand=True)
    b = MANUAL.get(f) or plate_box(im, thr=0.035, frac=0.45, pad=0)
    w, h = b[2] - b[0], b[3] - b[1]
    im = im.crop((int(b[0] + w * .025), int(b[1] + h * .025), int(b[2] - w * .025), int(b[3] - h * .14)))  # drop the printed caption
    credits[k] = {"size": save(k, im, 0.35), "what": what, "src": RV, "via": "archive.org/details/" + vol}
for p, what in DORE.items():
    im = Image.open(os.path.join(SRC, "dore_hi", f"d{p}-{p}.jpg"))
    im = im.crop(plate_box(im))
    credits["dore_" + p] = {"size": save("dore_" + p, im, 0.75), "what": what,
                            "src": "Gustave Doré, engraving for the Bible (1866), from The Doré Bible Gallery", "via": "archive.org/details/dorbiblegaller00doruoft"}
for k, (f, ident) in MS.items():
    im = Image.open(os.path.join(SRC, "ms", f + ".jpg"))
    w, h = im.size
    im = im.crop((int(w * 0.06), int(h * 0.04), int(w * 0.94), int(h * 0.92)))
    if k.startswith("ms_dill"):
        what, src = "Ethiopic (Ge'ez) text of Jubilees", "A. Dillmann, Liber Jubilaeorum (Kiel, 1859)"
    else:
        what, src = ("title page" if k == "ms_ch17" else "page of the translation"), "R. H. Charles, The Book of Jubilees or the Little Genesis (SPCK, 1917)"
    credits[k] = {"size": save(k, im, 0.85), "what": what, "src": src, "via": "archive.org/details/" + ident}

# film clips: The Ten Commandments (1923), Moses on Sinai
for name in ["climb", "tablets"]:
    d = os.path.join(ROOT, "film", name); shutil.rmtree(d, ignore_errors=True); os.makedirs(d)
    fs = sorted(glob.glob(os.path.join(SRC, "film_" + name, "*.jpg")))
    for i, f in enumerate(fs):
        warm(Image.open(f), 0.75).save(os.path.join(d, f"f{i:04d}.jpg"), quality=86)
    json.dump({"n": len(fs), "fps": 12}, open(os.path.join(d, name + ".json"), "w"))
    credits["film_" + name] = {"what": "Moses on Mount Sinai", "src": "The Ten Commandments (Paramount, dir. Cecil B. DeMille, 1923), public domain in the US",
                               "via": "archive.org/details/TheTenCommandments1923NR_201503"}
json.dump(credits, open(os.path.join(ROOT, "build", "credits.json"), "w"), indent=1)
print(len(credits), "assets")
