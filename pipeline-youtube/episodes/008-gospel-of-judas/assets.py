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
DORE = {"003": "The Murder of Abel", "058": "The Star in the East", "063": "The Sermon on the Mount",
        "067": "The Disciples Plucking Corn on the Sabbath", "082": "The Last Supper", "083": "The Agony in the Garden",
        "084": "Prayer of Jesus in the Garden of Olives", "085": "The Betrayal", "093": "The Ascension"}
for p, what in DORE.items():
    page = 19 + 4 * (int(p) - 1)
    f = glob.glob(os.path.join(SRC, "dore_hi", f"p{page}-*.jpg"))[0]
    im = Image.open(f)
    im = im.crop(plate_box(im))
    credits["dore_" + p] = {"size": save("dore_" + p, im, 0.75), "what": what,
                            "src": "Gustave Doré, engraving for the Bible (1866), from The Doré Bible Gallery", "via": "archive.org/details/dorbiblegaller00doruoft"}

# ---- James Tissot, The Life of Our Saviour Jesus Christ, vol. 3 (1899): leaf -> (page crop, inner crop, title)
TS = "James Tissot, The Life of Our Saviour Jesus Christ (New York, 1899), vol. 3"
TIS = {"tis_61": ((.06, .06, .95, .48), (.0, .11, 1, 1), "Judas Goes to the Chief Priests"),
       "tis_62": ((.13, .08, .89, .48), (.05, .11, .96, 1), "Christ Going to the Mount of Olives at Night"),
       "tis_81": ((.04, .06, .96, .56), (.0, .09, 1, 1), "The Jews' Passover"),
       "tis_102": ((.02, .02, .98, .955), (.07, .02, .99, .905), "Judas and with Him a Great Multitude"),
       "tis_105": ((.17, .31, .84, .62), (.0, .10, .94, 1), "Judas Betraying Jesus with a Kiss")}
for k, (c1, c2, what) in TIS.items():
    im = Image.open(os.path.join(SRC, "tis", "t" + k[4:] + ".jpg")).convert("RGB")
    im = frac(frac(im, c1), c2)
    credits[k] = {"size": save(k, im, 0.35), "what": what, "src": TS, "via": "archive.org/details/lifeofoursaviour03tiss"}

# ---- David Roberts, Egypt & Nubia
RE = "David Roberts, Egypt & Nubia (lithographs by Louis Haghe, 1846-49), in The Holy Land, Syria, Idumea, Arabia, Egypt & Nubia"
VOL = "32882019071193-theholylandsyri"
ROBERTS = {"re_224": ("e224", "Entrance to the caves of Beni Hassan (Minya province)"),
           "re_168": ("e168", "The Libyan chain of mountains, from the temple of Luxor"),
           "re_36": ("e36", "View on the Nile towards the pyramids of Dahshur and Saqqara")}
for k, (f, what) in ROBERTS.items():
    im = Image.open(os.path.join(SRC, "hi", f + ".jpg"))
    if f != "e224": im = im.rotate(-90, expand=True)
    b = plate_box(im, thr=0.035, frac=0.45, pad=0)
    w, h = b[2] - b[0], b[3] - b[1]
    im = im.crop((int(b[0] + w * .025), int(b[1] + h * .025), int(b[2] - w * .025), int(b[3] - h * (.06 if f == "e224" else .14))))
    credits[k] = {"size": save(k, im, 0.35), "what": what, "src": RE, "via": "archive.org/details/" + VOL}

# ---- printed books
BOOKS = {
 "anf_t": ("anf6", (.0, .03, .97, .97), "Title page, The Ante-Nicene Fathers, vol. 1 (Irenaeus tr. A. Roberts & W. H. Rambaut)",
           "The Ante-Nicene Fathers, vol. 1, ed. A. Roberts & J. Donaldson (Buffalo: Christian Literature Publishing Co., 1887)", "antenicenefathers01robe"),
 "anf_31": ("anf375", (.04, .355, .52, .607), "Irenaeus, Against Heresies 1.31 (the Gospel of Judas)",
           "The Ante-Nicene Fathers, vol. 1, ed. A. Roberts & J. Donaldson (Buffalo: Christian Literature Publishing Co., 1887)", "antenicenefathers01robe"),
 "copt_1": ("copt_n16", (.05, .03, .95, .95), "Coptic text of the Pistis Sophia, another Coptic Christian book",
            "Pistis Sophia, Coptic text ed. M. G. Schwartze & J. H. Petermann (Berlin, 1851)", "pistissophiaopus00unse"),
 "copt_2": ("copt_n31", (.05, .03, .95, .95), "Coptic text of the Pistis Sophia, another Coptic Christian book",
            "Pistis Sophia, Coptic text ed. M. G. Schwartze & J. H. Petermann (Berlin, 1851)", "pistissophiaopus00unse"),
}
for k, (f, c, what, s, ident) in BOOKS.items():
    im = frac(Image.open(os.path.join(SRC, "ms", f + ".jpg")).convert("RGB"), c)
    credits[k] = {"size": save(k, im, 0.85), "what": what, "src": s, "via": "archive.org/details/" + ident}

json.dump(credits, open(os.path.join(ROOT, "build", "credits.json"), "w"), indent=1)
print(len(credits), "assets")
