"""Prepare images: rotate Roberts plates upright, crop paper margins/captions, save to film/img/<key>.jpg.
Also writes build/credits.json (what each key is and where it came from)."""
import json, os
import numpy as np
from PIL import Image, ImageFilter

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, "src")
OUT = os.path.join(ROOT, "film", "img"); os.makedirs(OUT, exist_ok=True)

R1, R3 = "aidu1t", "aidu3t"
ROBERTS = {  # key: (file, rotate)
    "a": (f"{R3}_090", -90), "b": (f"{R1}_102", -90), "c": (f"{R3}_226", -90), "d": (f"{R3}_048", -90),
    "e": (f"{R1}_256", -90), "f": (f"{R1}_238", -90), "g": (f"{R3}_250", -90), "h": (f"{R1}_244", -90),
    "i": (f"{R3}_066", -90), "j": (f"{R3}_078", -90), "k": (f"{R3}_214", -90), "l": (f"{R1}_180", -90),
    "m": (f"{R1}_084", -90), "n": (f"{R1}_150", -90), "o": (f"{R1}_114", -90), "p": (f"{R1}_174", -90),
    "q": (f"{R3}_054", -90), "r": (f"{R1}_066", -90), "s": (f"{R1}_208", -90),
}
DORE = ["019", "023", "027", "031", "043", "147", "151", "159", "171", "175", "179", "183", "191", "195", "227", "239", "271", "411"]
MS = {"ms_geez_1": "dill_10", "ms_geez_2": "dill_30", "ms_geez_3": "dill_50", "ms_charles": "charles1912_6"}


def plate_box(im, thr=0.12, pad=6, frac=0.25):
    """bounding box of the printed picture: rows/cols whose darkness differs from paper"""
    g = np.asarray(im.convert("L").filter(ImageFilter.GaussianBlur(3)), dtype=float) / 255
    paper = np.median(np.concatenate([g[:20].ravel(), g[-20:].ravel(), g[:, :20].ravel(), g[:, -20:].ravel()]))
    ink = (paper - g) > thr
    rows = ink.mean(axis=1) > frac
    cols = ink.mean(axis=0) > frac
    # largest contiguous run (the plate, not the caption line)
    def run(m):
        best, cur, s = (0, len(m)), 0, 0
        bl = 0
        for i, v in enumerate(m):
            if v:
                if cur == 0: s = i
                cur += 1
                if cur > bl: bl, best = cur, (s, i + 1)
            else: cur = 0
        return best
    y0, y1 = run(rows); x0, x1 = run(cols)
    return (max(0, x0 + pad), max(0, y0 + pad), min(im.width, x1 - pad), min(im.height, y1 - pad))


def save(key, im, maxw=2400):
    if im.width > maxw:
        im = im.resize((maxw, int(im.height * maxw / im.width)), Image.LANCZOS)
    im.convert("RGB").save(os.path.join(OUT, key + ".jpg"), quality=90)
    return im.size


credits = {}
for k, (f, rot) in ROBERTS.items():
    im = Image.open(os.path.join(SRC, "hi", f + ".jpg"))
    if rot: im = im.rotate(rot, expand=True)
    im = im.crop(plate_box(im, thr=0.05, frac=0.06))
    credits["roberts_" + k] = {"size": save("roberts_" + k, im), "src": "David Roberts, The Holy Land, Syria, Idumea, Arabia, Egypt & Nubia (lithographs by Louis Haghe, 1842-49; 1855 ed.)", "via": "archive.org/details/holylandsyriaidu" + ("1to2robe" if f.startswith(R1) else "3to4robe")}
for p in DORE:
    im = Image.open(os.path.join(SRC, "dore_hi", f"d{p}-{p}.jpg"))
    im = im.crop(plate_box(im))
    credits["dore_" + p] = {"size": save("dore_" + p, im), "src": "Gustave Doré, engraving for the Bible (1866), from The Doré Bible Gallery (1890)", "via": "archive.org/details/dorbiblegaller00doruoft"}
for k, f in MS.items():
    im = Image.open(os.path.join(SRC, "ms", f + ".jpg"))
    w, h = im.size
    im = im.crop((int(w * 0.06), int(h * (0.0 if f.startswith('charles') else 0.04)), int(w * 0.94), int(h * 0.9)))  # drop the scanner watermark
    credits[k] = {"size": save(k, im), "src": "Ethiopic text of 1 Enoch, ed. A. Dillmann, Liber Henoch aethiopice (1851)" if f.startswith("dill") else "R. H. Charles, The Book of Enoch (Oxford, 1912), title page",
                  "via": "archive.org/details/bub_gb_DigVAAAAQAAJ" if f.startswith("dill") else "archive.org/details/bookofenochor1en00char"}
credits["film_ark"] = {"src": "Noah's Ark (Warner Bros., dir. Michael Curtiz, 1928), public domain", "via": "archive.org/details/noahs-ark-1928-tmdb104430"}
json.dump(credits, open(os.path.join(ROOT, "build", "credits.json"), "w"), indent=1)
print(len(credits), "assets")
