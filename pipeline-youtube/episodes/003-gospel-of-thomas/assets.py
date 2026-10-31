"""Episode 003 (Gospel of Thomas): prepare images -> film/img/<key>.jpg.
Rotates Roberts plates upright, crops paper margins and captions, bakes the warm sepia grade.
Also writes build/credits.json (what each key is and where it came from)."""
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


RE = "David Roberts, Egypt & Nubia (lithographs by Louis Haghe, 1846-49), in The Holy Land, Syria, Idumea, Arabia, Egypt & Nubia"
VOL = "32882019071193-theholylandsyri"
ROBERTS = {  # key: (file, what it shows)
    "re_32": ("e32", "The pyramids of Giza from the Nile"),
    "re_36": ("e36", "View on the Nile towards the pyramids of Dahshur and Saqqara"),
    "re_92": ("e92", "Ruins of Luxor from the south-west"),
    "re_96": ("e96", "General view of the ruins of Luxor from the Nile"),
    "re_168": ("e168", "The Libyan chain of mountains, from the temple of Luxor"),
    "re_194": ("e194", "Gateway at Dendera"),
    "re_198": ("e198", "Portico of the temple of Dendera"),
    "re_208": ("e208", "General view of the ruins of Karnak"),
    "re_224": ("e224", "Entrance to the caves of Beni Hassan"),
}
DORE = {"059": "The Flight into Egypt", "061": "Jesus Questioning the Doctors", "062": "Jesus Healing the Sick",
        "063": "The Sermon on the Mount", "066": "Christ in the Synagogue", "067": "The Disciples Plucking Corn on the Sabbath",
        "078": "Jesus and the Woman of Samaria", "082": "The Last Supper", "092": "The Journey to Emmaus"}
PAP = {  # key: (file, what, src, archive id, crop fractions l,t,r,b)
    "pox1_v": ("hi_logiaiesousaying00gren_n5", "Oxyrhynchus Papyrus 1, verso (Logia leaf, c. AD 200)",
               "B. P. Grenfell & A. S. Hunt, Logia Iesou: Sayings of Our Lord (1897), plate", "logiaiesousaying00gren", (.05, .04, .95, .87)),
    "pox1_r": ("hi_logiaiesousaying00gren_n6", "Oxyrhynchus Papyrus 1, recto (Logia leaf, c. AD 200)",
               "B. P. Grenfell & A. S. Hunt, Logia Iesou: Sayings of Our Lord (1897), plate", "logiaiesousaying00gren", (.05, .04, .95, .87)),
    "pox1_t": ("hi_logiaiesousaying00gren_n10", "Title page",
               "B. P. Grenfell & A. S. Hunt, Logia Iesou: Sayings of Our Lord (1897)", "logiaiesousaying00gren", (.06, .02, .94, .9)),
    "pox654": ("hi_newsayingsofjesu00unknuoft_n7", "Oxyrhynchus Papyrus 654 (sayings on the back of a land survey list)",
               "B. P. Grenfell & A. S. Hunt, New Sayings of Jesus and Fragment of a Lost Gospel (1904), frontispiece", "newsayingsofjesu00unknuoft", (.08, .04, .92, .9)),
    "ns_t": ("hi_newsayingsofjesu00unknuoft_n8", "Title page",
             "B. P. Grenfell & A. S. Hunt, New Sayings of Jesus and Fragment of a Lost Gospel (1904)", "newsayingsofjesu00unknuoft", (.08, .03, .92, .9)),
    "copt_1": ("copt_n16", "Coptic text of the Pistis Sophia, another Coptic Christian book",
               "Pistis Sophia, Coptic text ed. M. G. Schwartze & J. H. Petermann (Berlin, 1851)", "pistissophiaopus00unse", (.05, .03, .95, .95)),
    "copt_2": ("copt_n31", "Coptic text of the Pistis Sophia, another Coptic Christian book",
               "Pistis Sophia, Coptic text ed. M. G. Schwartze & J. H. Petermann (Berlin, 1851)", "pistissophiaopus00unse", (.05, .03, .95, .95)),
}

MANUAL = {}
credits = {}
for k, (f, what) in ROBERTS.items():
    im = Image.open(os.path.join(SRC, "hi", f + ".jpg"))
    if im.height > im.width and f not in ("e224",): im = im.rotate(-90, expand=True)
    b = MANUAL.get(f) or plate_box(im, thr=0.035, frac=0.45, pad=0)
    w, h = b[2] - b[0], b[3] - b[1]
    top = .06 if f in ("e194", "e198") else .025
    im = im.crop((int(b[0] + w * .025), int(b[1] + h * top), int(b[2] - w * .025), int(b[3] - h * (.06 if f == "e224" else .14))))  # drop the printed caption
    credits[k] = {"size": save(k, im, 0.35), "what": what, "src": RE, "via": "archive.org/details/" + VOL}
for p, what in DORE.items():
    f = glob.glob(os.path.join(SRC, "dore_hi", f"d{p}-*.jpg"))[0]
    im = Image.open(f)
    im = im.crop(plate_box(im))
    credits["dore_" + p] = {"size": save("dore_" + p, im, 0.75), "what": what,
                            "src": "Gustave Doré, engraving for the Bible (1866), from The Doré Bible Gallery", "via": "archive.org/details/dorbiblegaller00doruoft"}
for k, (f, what, src, ident, c) in PAP.items():
    im = Image.open(os.path.join(SRC, "pap", f + ".jpg"))
    w, h = im.size
    im = im.crop((int(w * c[0]), int(h * c[1]), int(w * c[2]), int(h * c[3])))
    credits[k] = {"size": save(k, im, 0.85 if k.startswith("copt") or k.endswith("_t") else 0.6), "what": what, "src": src, "via": "archive.org/details/" + ident}
json.dump(credits, open(os.path.join(ROOT, "build", "credits.json"), "w"), indent=1)
print(len(credits), "assets")
