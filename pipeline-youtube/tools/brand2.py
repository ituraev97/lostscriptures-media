"""Channel assets on the EXISTING Lost Scriptures identity (logo from the reels kit):
avatar 800, watermark 150, wordmark, banner 2560x1440, logo on transparent ground (rendered from the SVG)."""
import os, random, subprocess
from PIL import Image, ImageDraw, ImageFilter, ImageFont, ImageChops

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
KIT = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "brand")
OUT = os.path.join(ROOT, "brand2"); os.makedirs(OUT, exist_ok=True)
FS = os.path.join(ROOT, "fonts_pkg/node_modules/@fontsource")
cinzel = lambda s, w=700: ImageFont.truetype(f"{FS}/cinzel/files/cinzel-latin-{w}-normal.woff", s)
corm_i = lambda s, w=600: ImageFont.truetype(f"{FS}/cormorant-garamond/files/cormorant-garamond-latin-{w}-italic.woff", s)

WINE, WINE_L, WINE_D = (92, 15, 31), (122, 26, 44), (74, 11, 24)
GOLD_T, GOLD, GOLD_B = (240, 210, 143), (212, 175, 106), (169, 130, 63)
CREAM = (243, 231, 207); NIGHT = (4, 4, 9)

logo = Image.open(f"{KIT}/logo_square.png").convert("RGB")
logo.resize((800, 800), Image.LANCZOS).save(f"{OUT}/avatar_800.png")

# transparent logo: the circle cut out of the square (corners outside the gold ring dropped)
def round_logo(size):
    L = logo.resize((size, size), Image.LANCZOS).convert("RGBA")
    m = Image.new("L", (size * 4, size * 4), 0)
    ImageDraw.Draw(m).ellipse([size * 4 * (24 / 640), size * 4 * (24 / 640), size * 4 * (616 / 640), size * 4 * (616 / 640)], fill=255)
    L.putalpha(m.resize((size, size), Image.LANCZOS)); return L
round_logo(1080).save(f"{OUT}/logo_round.png")
round_logo(150).save(f"{OUT}/watermark_150.png")


def gold_text(canvas, xy, text, font, anchor="mm", glow=True):
    """text filled with the house gold gradient (#FFF4C8 → #F2CF73 → #C99130 → #8A5E20) plus a soft glow."""
    W, H = canvas.size
    mask = Image.new("L", (W, H), 0); ImageDraw.Draw(mask).text(xy, text, font=font, fill=255, anchor=anchor)
    bb = mask.getbbox()
    grad = Image.new("RGB", (W, H)); gd = ImageDraw.Draw(grad)
    stops = [(0, (255, 244, 200)), (.4, (242, 207, 115)), (.75, (201, 145, 48)), (1, (138, 94, 32))]
    y0, y1 = bb[1], bb[3]
    for y in range(y0, y1 + 1):
        k = (y - y0) / max(1, y1 - y0)
        for (a, ca), (b, cb) in zip(stops, stops[1:]):
            if a <= k <= b:
                f = (k - a) / (b - a); c = tuple(int(ca[i] + (cb[i] - ca[i]) * f) for i in range(3)); break
        gd.line([(0, y), (W, y)], fill=c)
    if glow:
        g = mask.filter(ImageFilter.GaussianBlur(18)).point(lambda v: int(v * 0.45))
        canvas.paste(Image.new("RGB", (W, H), (240, 190, 100)), (0, 0), g)
        sh = mask.filter(ImageFilter.GaussianBlur(5)).point(lambda v: int(v * 0.7))
        canvas.paste(Image.new("RGB", (W, H), (0, 0, 0)), (0, 6), sh)
    canvas.paste(grad, (0, 0), mask)


# wordmark (on night ground; PNG with transparency is made from a mask)
wm = Image.new("RGB", (2400, 560), NIGHT)
gold_text(wm, (1200, 220), "THE LOST SCRIPTURES", cinzel(170))
ImageDraw.Draw(wm).text((1200, 430), "Stories from the Bible that most people never hear", font=corm_i(78), fill=CREAM, anchor="mm")
wm.save(f"{OUT}/wordmark.png")

# banner: the reels' night ground (radial #1b1630 → #0b0a16 → #040409), gold dust, logo, gold wordmark
W, H = 2560, 1440
ban = Image.new("RGB", (W, H), NIGHT)
rad = Image.new("L", (W, H), 0); ImageDraw.Draw(rad).ellipse([280, 120, W - 280, H - 120], fill=255)
rad = rad.filter(ImageFilter.GaussianBlur(260))
ban.paste(Image.new("RGB", (W, H), (27, 22, 48)), (0, 0), rad)
inner = Image.new("L", (W, H), 0); ImageDraw.Draw(inner).ellipse([760, 420, W - 760, H - 420], fill=170)
ban.paste(Image.new("RGB", (W, H), (58, 10, 16)), (0, 0), inner.filter(ImageFilter.GaussianBlur(200)))
d = ImageDraw.Draw(ban)
rnd = random.Random(7)
for _ in range(240):
    x, y, r = rnd.uniform(0, W), rnd.uniform(0, H), rnd.uniform(1, 3.4)
    a = rnd.uniform(.15, .55)
    d.ellipse([x - r, y - r, x + r, y + r], fill=tuple(int(NIGHT[i] + (c - NIGHT[i]) * a) for i, c in enumerate((240, 205, 140))))
lg = round_logo(330)
ban.paste(lg, (515, 720 - 165), lg)
gold_text(ban, (1490, 672), "THE LOST SCRIPTURES", cinzel(100))
d = ImageDraw.Draw(ban)
d.line([1090, 748, 1890, 748], fill=GOLD, width=3)
d.text((1490, 808), "Stories from the Bible that most people never hear", font=corm_i(54), fill=CREAM, anchor="mm")
ban.save(f"{OUT}/banner_2560x1440.jpg", quality=92)
print("ok")
