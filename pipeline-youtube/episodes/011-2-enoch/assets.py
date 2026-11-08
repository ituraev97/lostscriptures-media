"""Episode 011 (2 Enoch, the Book of the Secrets of Enoch): prepare images -> film/img/<key>.jpg; writes build/credits.json."""
import json, os
import numpy as np
from PIL import Image, ImageFilter

ROOT = os.path.dirname(os.path.abspath(__file__))
SRC = "/home/claude/src/hi"
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

# ---- Gustave Doré, Bible (1866): PDF page = 19 + 4 * (plate - 1)
DORE = {"001": "The Creation of Eve", "004": "The Deluge", "041": "Elijah's Ascent in a Chariot of Fire", "048": "The Vision of Ezekiel"}
for p, what in DORE.items():
    page = 19 + 4 * (int(p) - 1)
    im = Image.open(os.path.join(SRC, f"do-{page:03d}.jpg")).convert("RGB")
    im = im.crop(plate_box(im))
    credits["dore_" + p] = {"size": save("dore_" + p, im, 0.75), "what": what,
                            "src": "Gustave Doré, engraving for the Bible (1866), from The Doré Bible Gallery", "via": "archive.org/details/dorbiblegaller00doruoft"}

# ---- Gustave Doré, illustrations for Milton's Paradise Lost (1866); PDF page numbers of paradiselostillu00miltuoft
PLS = "Gustave Doré, illustration for John Milton, Paradise Lost (1866), ed. H. C. Walsh"
PL = {"015": "The fall of the rebel angels", "026": "The rebel angels in flight", "076": "The hosts of heaven", "078": "Satan at the gate of light",
      "113": "The garden of Eden", "114": "Adam and Eve in Eden", "141": "Satan discovered by the angels in Eden",
      "164": "Raphael with Adam and Eve", "173": "The war in heaven", "198": "The rebel angels cast out of heaven",
      "207": "The creation of light", "209": "The creation of the creatures", "210": "The creation of the world", "348": "Building the ark"}
PLC = {"141": (0.045, 0.03, 0.965, 0.875), "210": (0.045, 0.03, 0.965, 0.875)}
for p, what in PL.items():
    im = Image.open(os.path.join(SRC, f"pl-{p}.jpg")).convert("RGB")
    im = crop(im, PLC.get(p), thr=0.12, frac=0.30, pad=8)
    credits["pl_" + p] = {"size": save("pl_" + p, pillar(im), 0.72, maxw=3200), "what": what, "src": PLS, "via": "archive.org/details/paradiselostillu00miltuoft"}

# ---- Gustave Doré, illustrations for Dante's Paradiso (1868), La Divina Commedia (Milan, 1868)
DAS = "Gustave Doré, illustration for Dante, Paradiso, in La Divina Commedia illustrata da Gustavo Doré (1868)"
DA = {"557": "Souls of light in the heaven of Mercury", "585": "Rings of light in the heaven of the Sun", "619": "Spirits in the heaven of Jupiter",
      "623": "Dante and Beatrice ascending", "631": "Angels in the heaven of the fixed stars", "641": "The triumph of Christ",
      "667": "The choirs of angels", "675": "The Primum Mobile", "687": "The Empyrean, the celestial rose", "693": "The Queen of Heaven"}
for p, what in DA.items():
    im = Image.open(os.path.join(SRC, f"da-{p}.jpg")).convert("RGB")
    b = plate_box(im, thr=0.045, frac=0.55, pad=12)
    im = im.crop(b) if (b[2] - b[0] > im.width * 0.4 and b[3] - b[1] > im.height * 0.3) else frac(im, (0.18, 0.20, 0.86, 0.71))
    print("da", p, b, im.size)
    credits["da_" + p] = {"size": save("da_" + p, pillar(im), 0.70, maxw=3200), "what": what, "src": DAS, "via": "archive.org/details/NENC.1.1.6.1_Images"}

# ---- W. R. Morfill & R. H. Charles, The Book of the Secrets of Enoch (Oxford, 1896)
CHS = "W. R. Morfill (tr.) and R. H. Charles (ed.), The Book of the Secrets of Enoch (Oxford: Clarendon Press, 1896)"
CH = {"t": ("ch-t.jpg", (0.08, 0.02, 0.92, 0.60), "Title page"),
      "1": ("ch-1.jpg", (0.04, 0.02, 0.96, 0.55), "Chapter 1: the two men at Enoch's bed"),
      "22": ("ch-22.jpg", (0.04, 0.02, 0.96, 0.60), "Chapters 20-22 with the eighth, ninth and tenth heavens"),
      "x": ("ch-x.jpg", (0.04, 0.40, 0.96, 0.99), "Introduction: the tenth heaven as an interpolation")}
for k, (f, box, what) in CH.items():
    im = Image.open(os.path.join(SRC, f)).convert("RGB")
    im = frac(im, box)
    credits["ms_ch96_" + k] = {"size": save("ms_ch96_" + k, im, 0.80), "what": what, "src": CHS, "via": "archive.org/details/cu31924014633568"}

json.dump(credits, open(os.path.join(ROOT, "build", "credits.json"), "w"), indent=1)
print(len(credits), "assets")
