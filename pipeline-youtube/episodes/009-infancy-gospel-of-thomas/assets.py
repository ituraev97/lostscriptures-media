"""Episode 009 (Infancy Gospel of Thomas): prepare images -> film/img/<key>.jpg; writes build/credits.json."""
import glob, json, os
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
DORE = {"057": "The Nativity", "058": "The Star in the East", "059": "The Flight into Egypt", "061": "Jesus Questioning the Doctors",
        "062": "Jesus Healing the Sick", "066": "Christ in the Synagogue", "067": "The Disciples Plucking Corn on the Sabbath"}
for p, what in DORE.items():
    page = 19 + 4 * (int(p) - 1)
    f = glob.glob(os.path.join(SRC, "dore_hi", f"p{page}-*.jpg"))[0]
    im = Image.open(f)
    im = im.crop(plate_box(im))
    credits["dore_" + p] = {"size": save("dore_" + p, im, 0.75), "what": what,
                            "src": "Gustave Doré, engraving for the Bible (1866), from The Doré Bible Gallery", "via": "archive.org/details/dorbiblegaller00doruoft"}

# ---- James Tissot, The Life of Our Saviour Jesus Christ, vol. 1 (1899): leaf -> page crop (fractions)
TS = "James Tissot, The Life of Our Saviour Jesus Christ (New York, 1899), vol. 1"
TIS = {"tis_74": ((.075, .035, .935, .872), "Jesus Found in the Temple"),
       "tis_77": ((.556, .245, .925, .728), "The Youth of Jesus"),
       "tis_72": ((.553, .136, .930, .565), "Jesus Sitting in the Midst of the Doctors"),
       "tis_71": ((.398, .192, .940, .505), "Jesus Lost"),
       "tis_38": ((.548, .385, .902, .862), "Saint Joseph"),
       "tis_64": ((.075, .225, .925, .670), "The Sojourn in Egypt")}
for k, (c, what) in TIS.items():
    im = frac(Image.open(os.path.join(SRC, "tis", "t" + k[4:] + ".jpg")).convert("RGB"), c)
    credits[k] = {"size": save(k, im, 0.35), "what": what, "src": TS, "via": "archive.org/details/lifeofoursaviour01tiss"}

# ---- David Roberts, The Holy Land (Nazareth plates, vol. 1-2)
RS = "David Roberts, The Holy Land, Syria, Idumea, Arabia, Egypt & Nubia (lithographs by Louis Haghe, 1842-49)"
ROB = {"rh_131": ("r131", "Nazareth, general view"), "rh_134": ("r134", "The Fountain of the Virgin, Nazareth"),
       "rh_137": ("r137", "The Convent of the Terra Santa, Nazareth")}
for k, (f, what) in ROB.items():
    im = Image.open(os.path.join(SRC, "hi", f + ".jpg")).rotate(-90, expand=True)
    b = plate_box(im, thr=0.035, frac=0.45, pad=0)
    w, h = b[2] - b[0], b[3] - b[1]
    im = im.crop((int(b[0] + w * .03), int(b[1] + h * .03), int(b[2] - w * .03), int(b[3] - h * .10)))
    credits[k] = {"size": save(k, im, 0.35), "what": what, "src": RS, "via": "archive.org/details/holylandsyriaidu1to2robe"}

# ---- printed editions
BOOKS = {
 "tisch_241": ("tisch241", (.04, .12, .96, .97), "Greek text of the Gospel of Thomas (the infancy gospel), ed. C. Tischendorf",
               "C. Tischendorf, Evangelia Apocrypha, 2nd ed. (Leipzig, 1876)", "evangeliaapocryp00tisc"),
 "tisch_242": ("tisch242", (.04, .03, .96, .97), "Greek text of the Gospel of Thomas (the infancy gospel), ed. C. Tischendorf",
               "C. Tischendorf, Evangelia Apocrypha, 2nd ed. (Leipzig, 1876)", "evangeliaapocryp00tisc"),
 "wr_127": ("wr127", (.06, .20, .94, .68), "Title page of the Syriac text, The Gospel of Thomas the Israelite",
            "W. Wright, Contributions to the Apocryphal Literature of the New Testament (London, 1865)", "cu31924029295636"),
 "wr_133": ("wr133", (.05, .04, .95, .96), "Syriac text of the infancy gospel from British Library Add. 14,484 (6th century)",
            "W. Wright, Contributions to the Apocryphal Literature of the New Testament (London, 1865)", "cu31924029295636"),
}
for k, (f, c, what, s, ident) in BOOKS.items():
    im = frac(Image.open(os.path.join(SRC, "ms", f + ".jpg")).convert("RGB"), c)
    credits[k] = {"size": save(k, im, 0.85), "what": what, "src": s, "via": "archive.org/details/" + ident}

json.dump(credits, open(os.path.join(ROOT, "build", "credits.json"), "w"), indent=1)
print(len(credits), "assets")
