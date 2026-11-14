# The Lost Scriptures — TikTok Bible quiz (shop format, owner's decision 2026-11-14)

Short quiz (18–30 s) that ends on a book from our Shopify store (the same catalog as the TikTok Shop of @lostscripturesbooks).
TikTok gets 2 quizzes + 2 story reels a day: quizzes at 10:00 and 17:00 ET, stories at 13:00 and 20:00 ET.
Reference: `example/q1.json` (Methuselah). Renderer: `quiz.py` (PIL frames + Kokoro am_michael + synthesized SFX/bed, −14 LUFS).

## 1. Question
- A real Bible fact people half-know, with a twist: "Who…/How many…/Which…/What did Jesus say when…". Mix easy-but-tricky and surprising.
  What performs on the account: provocative Jesus questions (the "Jesus called her a dog" story got 10.2K views), women and kings of
  the Old Testament, "why" questions.
- Verify the answer in the KJV (raw.githubusercontent.com/thiagobodruk/bible/master/json/en_kjv.json) and cite book chapter:verse.
  Three wrong options must be plausible and clearly wrong by the text. Vary which letter is correct (check `quiz_log.md`).
- Never repeat a question from `quiz_log.md`. No end-times, no "banned/hidden", nothing mocking a faith.
- Hook (red line) varies: "ONLY 1 IN 10 GET THIS RIGHT", "MOST CHRISTIANS MISS THIS", "BIBLE QUIZ · LEVEL HARD", "NO GOOGLE" …

## 2. Book for the card (Shopify, connected via the Shopify tools)
- search_products for a book matching the question (Psalms → a Psalms book; Gospels → a study Bible or Gospel study; general → a Bible
  edition), status ACTIVE, inventory > 0. Card: `product_short` (2–4 words for the drawn cover) + `product_title` (title without
  "(Paperback)" and author list if long). Spoken CTA: "<short why>. <Book> is in our shop." Never invent a product, price or discount.
- Product images cannot be downloaded from this environment (cdn.shopify.com blocked), so the card draws a book with the title.

## 3. Build
```
cd ~/lostscriptures-media/pipeline-quiz   # fonts: fonts_pkg as in pipeline-sleep/RUNBOOK.md step 0; Kokoro model in /home/claude/tts
python3 ../pipeline/visuals/pd.py get <item> <leaf> -o page.jpg && python3 ../pipeline/visuals/pd.py crop page.jpg x0 y0 x1 y1 -o bg.jpg   # a plate that fits the question; LOOK at it
FONTS=<fonts_pkg>/node_modules/@fontsource python3 quiz.py q.json out/quiz.mp4
ffmpeg -i out/quiz.mp4 -vf "fps=1.2,scale=216:-1,tile=8x3" -frames:v 1 out/sheet.jpg   # LOOK: text inside x 70–930, readable, answer correct
```
Voice check (pocketsphinx on the first 8 s must recover question words). Cover still = a frame at ~1 s.

## 4. Host and post
Fixed slot branch `media-reel-<HHMM>` as in `pipeline/HOSTING_OVERRIDE.md` rule 1. Metricool createScheduledPost, blogId 7718820,
providers tiktok only, tiktokData {"title": "<question?>", "privacyOption": "PUBLIC_TO_EVERYONE"}, text = question + "Answer in the
video 👀 Comment your guess." + "📖 <Book> — in our shop" + 4–5 hashtags (#bible #biblequiz #bibletrivia #christiantiktok #jesus).
No AI labels, no "AI" wording. Append the question to `quiz_log.md` and commit (never video files on main).
