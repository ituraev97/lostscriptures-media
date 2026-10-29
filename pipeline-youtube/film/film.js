// The Book of Enoch — documentary film, a pure function of t (seconds).
// Reads timeline.json (narration timing from tools/voice.py). Every frame: Ken Burns on public-domain
// plates, warm grade, vignette, dust, grain; quote cards, chapter cards, title and end card.
import * as M from './lib/motion.js';
const { W, H, clamp, lerp, E, TAU } = M;

const GOLD = '#c9a45c', IVORY = '#efe6d2', INK = '#0b0906';
const CROSS = 1.1;          // crossfade seconds between shots

let TL, SHOTS = [], ARK = { n: 0 }, IMGS = {}, GRAIN = [], CREDIT = {}, VIG = [];
const smooth = (x) => { x = clamp(x); return x * x * (3 - 2 * x); };
const h01 = (i, s = 1) => M.hash01(i, s);

// ------------------------------------------------------------------ shots from the timeline
function buildShots() {
  let cur = null;
  for (const e of TL.ev) {
    if (e.vis && (!cur || e.vis !== cur.key || e.kind === 'chapter')) {
      if (cur) cur.t1 = e.t;
      cur = { key: e.vis, t0: e.t, t1: null, i: SHOTS.length };
      SHOTS.push(cur);
    }
  }
  if (cur) cur.t1 = TL.duration;
  // a deterministic camera move per shot
  for (const s of SHOTS) {
    const im = IMGS[s.key];
    const portrait = im && im.height > im.width * 1.05;
    const r = h01(s.i, 7), r2 = h01(s.i, 13), r3 = h01(s.i, 29);
    if (s.key.startsWith('ms_')) {         // a page: slow drift across the lines
      s.z0 = 1.12; s.z1 = 1.3; s.f0 = [0.3 + 0.2 * r, 0.3]; s.f1 = [0.5 + 0.2 * r2, 0.6];
    } else if (portrait) {                 // tall engraving in a wide frame: reveal by a vertical pan
      const down = r > 0.5;
      s.z0 = 1.0 + 0.05 * r2; s.z1 = 1.12 + 0.06 * r3;
      s.f0 = [0.45 + 0.1 * r2, down ? 0.12 : 0.85]; s.f1 = [0.5 + 0.1 * (r3 - 0.5), down ? 0.72 : 0.25];
    } else {                               // landscape: push in or pull back, with a lateral drift
      const pushIn = r > 0.35;
      const zA = 1.1 + 0.04 * r2, zB = 1.28 + 0.08 * r3;
      s.z0 = pushIn ? zA : zB; s.z1 = pushIn ? zB : zA;
      s.f0 = [0.3 + 0.4 * r2, 0.45 + 0.1 * r3]; s.f1 = [0.3 + 0.4 * r3, 0.42 + 0.12 * r2];
    }
  }
}

// cover-fit an image into the frame at zoom z, focus point f (0..1 in image space)
function drawCover(ctx, im, z, f, alpha = 1) {
  if (!im) return;
  const s = Math.max(W / im.width, H / im.height) * z;
  const w = im.width * s, h = im.height * s;
  const x = clamp(W / 2 - f[0] * w, W - w, 0), y = clamp(H / 2 - f[1] * h, H - h, 0);
  ctx.globalAlpha = alpha;
  ctx.drawImage(im, x, y, w, h);
  ctx.globalAlpha = 1;
}

function drawShot(ctx, s, t, alpha) {
  if (s.key === 'film_ark') {
    if (!ARK.n) return;
    const k = clamp(Math.floor((t - s.t0) * ARK.fps), 0, ARK.n - 1);
    const im = IMGS['ark_' + k];
    const p = (t - s.t0) / (s.t1 - s.t0);
    drawCover(ctx, im, 1.0 + 0.06 * p, [0.5, 0.5], alpha);
    return;
  }
  const im = IMGS[s.key];
  const p = clamp((t - s.t0) / (s.t1 - s.t0 + CROSS));
  const e = E.inOutSine(p);
  const z = s.z0 * (s.z1 / s.z0) ** e;           // log-space zoom: constant-rate dolly
  const f = [lerp(s.f0[0], s.f1[0], e), lerp(s.f0[1], s.f1[1], e)];
  drawCover(ctx, im, z, f, alpha);
}

// ------------------------------------------------------------------ grade + texture
function grade(ctx, t, key) {
  const engraving = key && (key.startsWith('dore_') || key === 'film_ark');
  const page = key && key.startsWith('ms_');
  // slow candle-like light that drifts across the frame
  const lx = W * (0.35 + 0.25 * Math.sin(t * 0.07)), ly = H * (0.3 + 0.1 * Math.cos(t * 0.05));
  const flick = 0.06 + 0.02 * Math.sin(t * 2.3) * Math.sin(t * 1.7 + 1);
  const g = ctx.createRadialGradient(lx, ly, 0, lx, ly, W * 0.7);
  g.addColorStop(0, `rgba(255,214,150,${flick})`); g.addColorStop(1, 'rgba(255,214,150,0)');
  ctx.globalCompositeOperation = 'screen'; ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  ctx.globalCompositeOperation = 'source-over';
  // vignette (precomputed)
  ctx.drawImage(page ? VIG[1] : VIG[0], 0, 0);
  // dust motes drifting in the light
  for (let i = 0; i < 30; i++) {
    const sp = 0.004 + 0.01 * h01(i, 3);
    const x = ((h01(i, 1) + t * sp * (h01(i, 9) > 0.5 ? 1 : -1)) % 1 + 1) % 1 * W;
    const y = ((h01(i, 2) - t * sp * 0.6) % 1 + 1) % 1 * H;
    const r = 0.8 + 2.2 * h01(i, 4);
    const a = 0.12 + 0.22 * (0.5 + 0.5 * Math.sin(t * (0.6 + h01(i, 5)) + i));
    ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fillStyle = `rgba(255,232,190,${a})`; ctx.fill();
  }
}

function letterbox(ctx, a) {
  if (a <= 0) return;
  ctx.fillStyle = `rgba(0,0,0,${a})`; ctx.fillRect(0, 0, W, H);
}

// ------------------------------------------------------------------ type
function wrap(ctx, text, maxW) {
  const words = text.split(' '), lines = [];
  let line = '';
  for (const w of words) {
    const test = line ? line + ' ' + w : w;
    if (ctx.measureText(test).width > maxW && line) { lines.push(line); line = w; } else line = test;
  }
  if (line) lines.push(line);
  return lines;
}

function tracked(ctx, str, x, y, track, align = 'center') {
  const chars = [...str];
  const widths = chars.map((c) => ctx.measureText(c).width);
  const total = widths.reduce((a, b) => a + b, 0) + track * (chars.length - 1);
  let cx = align === 'center' ? x - total / 2 : x;
  chars.forEach((c, i) => { ctx.fillText(c, cx, y); cx += widths[i] + track; });
  return total;
}

function quoteCard(ctx, e, t) {
  const lt = t - e.t, end = e.t + e.dur;
  const inA = smooth(lt / 0.7), outA = smooth((end - t) / 0.6);
  const a = Math.min(inA, outA);
  if (a <= 0) return;
  letterbox(ctx, 0.58 * a);
  ctx.save();
  ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic';
  ctx.font = '600 60px GaramondItalic';
  const lines = wrap(ctx, '“' + e.text + '”', 1380);
  const lh = 80, top = H / 2 - (lines.length * lh) / 2 + 30;
  // words appear in step with the narration
  const allWords = lines.join(' ').split(' ').length;
  const prog = clamp((t - e.say + 0.25) / Math.max(0.5, e.sdur)) * allWords;
  let wi = 0;
  lines.forEach((ln, li) => {
    const lw = ctx.measureText(ln).width;
    let x = W / 2 - lw / 2;
    const y = top + li * lh;
    for (const w of ln.split(' ')) {
      const k = smooth(prog - wi + 0.6);
      ctx.globalAlpha = a * (0.22 + 0.78 * k);
      ctx.fillStyle = IVORY;
      ctx.shadowColor = 'rgba(0,0,0,0.8)'; ctx.shadowBlur = 18;
      ctx.fillText(w, x, y + (1 - k) * 8);
      x += ctx.measureText(w + ' ').width;
      wi++;
    }
  });
  ctx.shadowBlur = 0;
  // reference
  ctx.globalAlpha = a * smooth((lt - 0.5) / 0.6);
  ctx.font = '600 24px Cinzel'; ctx.fillStyle = GOLD;
  const ry = top + lines.length * lh + 26;
  const rw = tracked(ctx, e.ref.toUpperCase(), W / 2, ry, 3.5);
  ctx.fillRect(W / 2 - rw / 2 - 70, ry - 9, 46, 1.5); ctx.fillRect(W / 2 + rw / 2 + 24, ry - 9, 46, 1.5);
  ctx.restore();
}

function chapterCard(ctx, e, t) {
  const lt = t - e.t, end = e.t + e.dur;
  const a = Math.min(smooth(lt / 0.6), smooth((end - t) / 0.7));
  if (a <= 0) return;
  letterbox(ctx, 0.7 * a);
  const [num, title] = e.text.split('|');
  ctx.save(); ctx.textBaseline = 'alphabetic';
  const k = E.outCubic(clamp(lt / 1.4));
  if (num) {
    ctx.globalAlpha = a; ctx.fillStyle = GOLD; ctx.font = '600 34px Cinzel';
    tracked(ctx, num, W / 2, H / 2 - 70, 10);
    ctx.fillRect(W / 2 - 160 * k, H / 2 - 46, 320 * k, 1.5);
  }
  ctx.globalAlpha = a; ctx.fillStyle = IVORY; ctx.font = '600 78px Cinzel';
  ctx.shadowColor = 'rgba(0,0,0,0.9)'; ctx.shadowBlur = 24;
  tracked(ctx, title.toUpperCase(), W / 2, H / 2 + 40, lerp(26, 8, k));
  ctx.restore();
}

function titleCard(ctx, e, t) {
  const lt = t - e.t, end = e.t + e.dur;
  const a = Math.min(smooth(lt / 1.2), smooth((end - t) / 1.0));
  if (a <= 0) return;
  letterbox(ctx, 0.45 * a);
  const [title, sub] = e.text.split('|');
  ctx.save(); ctx.textBaseline = 'alphabetic';
  const k = E.outCubic(clamp(lt / 3.2));
  ctx.globalAlpha = a; ctx.fillStyle = GOLD; ctx.font = '600 128px Cinzel';
  ctx.shadowColor = 'rgba(255,200,120,0.45)'; ctx.shadowBlur = 40 * a;
  tracked(ctx, title, W / 2, H / 2 + 10, lerp(36, 14, k));
  ctx.shadowBlur = 0;
  ctx.fillRect(W / 2 - 420 * k, H / 2 + 50, 840 * k, 2);
  ctx.globalAlpha = a * smooth((lt - 1.2) / 1.0); ctx.fillStyle = IVORY; ctx.font = '600 46px GaramondItalic';
  ctx.textAlign = 'center'; ctx.fillText(sub, W / 2, H / 2 + 120);
  ctx.restore();
}

function endCard(ctx, e, t) {
  const lt = t - e.t;
  const a = smooth(lt / 1.2);
  if (a <= 0) return;
  letterbox(ctx, 0.72 * a);
  ctx.save(); ctx.textBaseline = 'alphabetic'; ctx.textAlign = 'center';
  ctx.globalAlpha = a; ctx.fillStyle = GOLD; ctx.font = '600 96px Cinzel';
  tracked(ctx, e.text, W / 2, H / 2 - 20, 14);
  ctx.globalAlpha = a * smooth((lt - 1) / 1); ctx.fillStyle = IVORY; ctx.font = '600 40px GaramondItalic';
  ctx.fillText('Ancient texts. Lost books. The stories behind them.', W / 2, H / 2 + 50);
  ctx.globalAlpha = a * smooth((lt - 2) / 1) * 0.7; ctx.font = '600 17px Cinzel'; ctx.fillStyle = IVORY;
  tracked(ctx, 'ART: GUSTAVE DORÉ (1866) · DAVID ROBERTS (1842–49) · ETHIOPIC TEXT ED. A. DILLMANN (1851)', W / 2, H - 120, 2.2);
  tracked(ctx, 'FILM: NOAH’S ARK (1928) · TRANSLATIONS: R. H. CHARLES (1917), KING JAMES VERSION', W / 2, H - 90, 2.2);
  ctx.restore();
}

// small source caption at the start of each new artwork (attribution + documentary credibility)
function sourceCaption(ctx, s, t) {
  const c = CREDIT[s.key];
  if (!c) return;
  const lt = t - s.t0;
  const a = Math.min(smooth((lt - 0.8) / 0.6), smooth((5.2 - lt) / 0.8));
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha = a * 0.9; ctx.fillStyle = IVORY; ctx.font = '600 19px Cinzel'; ctx.textBaseline = 'alphabetic';
  ctx.shadowColor = 'rgba(0,0,0,0.9)'; ctx.shadowBlur = 8;
  tracked(ctx, c, 96, H - 64, 2.4, 'left');
  ctx.restore();
}
function captionFor(key) {
  if (key.startsWith('dore_')) return 'GUSTAVE DORÉ · ENGRAVING, 1866';
  if (key.startsWith('roberts_')) return 'DAVID ROBERTS · THE HOLY LAND, 1842–49';
  if (key.startsWith('ms_geez')) return 'ETHIOPIC (GE’EZ) TEXT OF 1 ENOCH · ED. A. DILLMANN, 1851';
  if (key === 'ms_charles') return 'R. H. CHARLES · THE BOOK OF ENOCH, OXFORD, 1912';
  if (key === 'film_ark') return 'NOAH’S ARK · 1928';
  return null;
}

// ------------------------------------------------------------------ the film
M.film({
  fonts: ['600 40px Cinzel', '600 40px Garamond', '600 40px GaramondItalic'],
  samples: 1,
  async init() {
    TL = await fetch('timeline.json').then((r) => r.json());
    try { ARK = await fetch('ark/ark.json').then((r) => r.json()); } catch { ARK = { n: 0 }; }
    const keys = [...new Set(TL.ev.map((e) => e.vis).filter((k) => k && k !== 'film_ark'))];
    await Promise.all(keys.map(async (k) => {
      const im = new Image(); im.src = 'img/' + k + '.jpg';
      try { await im.decode(); IMGS[k] = im; } catch { console.error('missing image', k); }
    }));
    await Promise.all(Array.from({ length: ARK.n }, async (_, i) => {
      const im = new Image(); im.src = `ark/f${String(i).padStart(4, '0')}.jpg`;
      try { await im.decode(); IMGS['ark_' + i] = im; } catch { console.error('missing ark frame', i); }
    }));
    for (const k of [...keys, 'film_ark']) { const c = captionFor(k); if (c) CREDIT[k] = c; }
    buildShots();
    for (const dark of [0.78, 0.85]) {
      const cv = document.createElement('canvas'); cv.width = W; cv.height = H; const c = cv.getContext('2d');
      const v = c.createRadialGradient(W / 2, H / 2, H * 0.35, W / 2, H / 2, W * 0.72);
      v.addColorStop(0, 'rgba(0,0,0,0)'); v.addColorStop(1, `rgba(8,5,2,${dark})`);
      c.fillStyle = v; c.fillRect(0, 0, W, H); VIG.push(cv);
    }
    // grain tiles
    for (let g = 0; g < 6; g++) {
      const cv = document.createElement('canvas'); cv.width = 480; cv.height = 270;
      const c = cv.getContext('2d'); const id = c.createImageData(480, 270);
      const rnd = M.mulberry32(g * 977 + 5);
      for (let i = 0; i < id.data.length; i += 4) { const v = 128 + (rnd() - 0.5) * 120; id.data[i] = id.data[i + 1] = id.data[i + 2] = v; id.data[i + 3] = 255; }
      c.putImageData(id, 0, 0); GRAIN.push(cv);
    }
  },
  draw(ctx, u, t) {
    ctx.fillStyle = INK; ctx.fillRect(0, 0, W, H);
    // active shots (crossfade: the next shot fades in over the current one)
    let idx = 0;
    for (let i = 0; i < SHOTS.length; i++) if (SHOTS[i].t0 <= t) idx = i;
    const cur = SHOTS[idx];
    if (cur) {
      const prev = SHOTS[idx - 1];
      const fade = smooth((t - cur.t0) / CROSS);
      if (prev && fade < 1) drawShot(ctx, prev, t, 1);
      drawShot(ctx, cur, t, prev ? fade : smooth(t / 1.5));
      grade(ctx, t, cur.key);
      sourceCaption(ctx, cur, t);
    }
    // cards
    for (const e of TL.ev) {
      if (t < e.t - 0.1 || t > e.t + (e.dur || 0) + 0.1) continue;
      if (e.kind === 'quote') quoteCard(ctx, e, t);
      else if (e.kind === 'chapter') chapterCard(ctx, e, t);
      else if (e.kind === 'title') titleCard(ctx, e, t);
    }
    const end = TL.ev.find((e) => e.kind === 'end');
    if (end && t >= end.t) endCard(ctx, end, t);
    // fade from / to black
    letterbox(ctx, 1 - smooth(t / 1.2));
    letterbox(ctx, smooth((t - (TL.duration - 1.5)) / 1.5));
  },
  post(ctx, u, t) {
    const g = GRAIN[Math.floor(t * 24) % GRAIN.length];
    if (!g) return;
    ctx.globalCompositeOperation = 'overlay'; ctx.globalAlpha = 0.08;
    ctx.drawImage(g, 0, 0, W, H);
    ctx.globalCompositeOperation = 'source-over'; ctx.globalAlpha = 1;
  },
});
