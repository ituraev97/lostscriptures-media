"""YouTube thumbnails in the house style of the reels: night ground, gold-gradient Cinzel hook, red payoff line, logo."""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from PIL import Image, ImageDraw, ImageFilter, ImageEnhance
import importlib.util
spec = importlib.util.spec_from_file_location("b2", os.path.join(os.path.dirname(__file__), "brand2.py"))
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
# reuse helpers without re-running the asset build
src = open(os.path.join(os.path.dirname(__file__), "brand2.py")).read().split("# wordmark")[0]
ns = {"__file__": os.path.join(os.path.dirname(__file__), "brand2.py")}; exec(src, ns)
gold_text, cinzel, corm_i, round_logo, CREAM, NIGHT = ns["gold_text"], ns["cinzel"], ns["corm_i"], ns["round_logo"], ns["CREAM"], ns["NIGHT"]
W, H = 1280, 720

def make(key, out, kicker, hook, payoff, focus=0.2):
    im = Image.open(os.path.join(ROOT, "film", "img", f"dore_{key}.jpg")).convert("L")
    im = im.crop((int(im.width * .03), int(im.height * .02), int(im.width * .97), int(im.height * .98)))
    im = ImageEnhance.Contrast(im).enhance(1.4)
    s = max(W * 0.62 / im.width, H / im.height); im = im.resize((int(im.width * s), int(im.height * s)), Image.LANCZOS)
    y = int((im.height - H) * focus); im = im.crop((0, y, im.width, y + H))
    art = Image.merge("RGB", [im.point(lambda v: int(v * .96)), im.point(lambda v: int(v * .78)), im.point(lambda v: int(v * .52))])
    c = Image.new("RGB", (W, H), NIGHT); c.paste(art, (W - art.width, 0))
    fade = Image.new("L", (W, H)); fd = ImageDraw.Draw(fade)
    x0 = W - art.width
    for x in range(W):
        u = max(0.0, min(1.0, (x - x0) / (art.width * 0.38)))
        fd.line([(x, 0), (x, H)], fill=int(255 * (1 - u * u * (3 - 2 * u))))  # seamless fade from the night ground into the plate
    c = Image.composite(Image.new("RGB", (W, H), NIGHT), c, fade)
    lg = round_logo(92); c.paste(lg, (60, 46), lg)
    d = ImageDraw.Draw(c)
    d.text((168, 92), kicker, font=cinzel(34, 700), fill=CREAM, anchor="lm")
    y = 250
    for i, line in enumerate(hook):
        gold_text(c, (60, y), line, cinzel(112 if i == 0 else 88, 700), anchor="lm"); y += 118
    d = ImageDraw.Draw(c)
    d.text((62, y + 30), payoff, font=cinzel(40, 700), fill=(255, 106, 90), anchor="lm")
    c.save(out, quality=92); print("->", out)

if __name__ == "__main__":
    # usage: python3 tools/thumb2.py thumb.json
    # thumb.json: [{"plate": "195", "out": "out/thumbnail_A.jpg", "kicker": "THE BOOK OF ENOCH", "hook": ["LEFT OUT", "OF THE BIBLE"], "payoff": "200 ANGELS. ONE WARNING.", "focus": 0.2}, ...]
    import json
    for t in json.load(open(sys.argv[1])):
        make(t["plate"], os.path.join(ROOT, t["out"]), t["kicker"], t["hook"], t["payoff"], t.get("focus", 0.2))
