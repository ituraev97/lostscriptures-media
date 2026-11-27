import React from 'react';
import { AbsoluteFill, staticFile, useCurrentFrame } from 'remotion';
import { loadFont } from '@remotion/fonts';
import { W, H, FPS, CX, SL, SR, G, GL, CR, RED, CIN, CORI, MONO, P, eio, eout, eback, lerp, env, clamp, shake } from './lib';
import { Shot, Clip, PhotoShade, Credit, Pin, Pic, Cam } from './Photo';
import { Logo } from './Wall';
import { CAPS } from './caps';

loadFont({ family: 'Cin', url: staticFile('cinzel-latin-700-normal.woff2'), weight: '700' });
loadFont({ family: 'Cin', url: staticFile('cinzel-latin-400-normal.woff2'), weight: '400' });
loadFont({ family: 'CorI', url: staticFile('cormorant-garamond-latin-600-italic.woff2'), weight: '600', style: 'normal' });
loadFont({ family: 'Inter', url: staticFile('inter-latin-800-normal.woff2'), weight: '800' });


const pd = ' · public domain';
export const DUR = 109.6;
const SANS = 'Inter, sans-serif';
const GRK = '"DejaVu Serif", serif';
const TIS = 'James Tissot', SCH = 'Julius Schnorr von Carolsfeld';
const STONES: Pic = { src: 'stones.jpg', w: 2446, h: 1796, bg: 'stones_bg.jpg', credit: TIS + ', The Jews Took Up Stones to Cast at Him (1886–94)' + pd };
const TREAS: Pic = { src: 'treasury.jpg', w: 2554, h: 1796, bg: 'treasury_bg.jpg', credit: TIS + ', Jesus Speaking in the Treasury (1886–94)' + pd };
const GODW: Pic = { src: 'godswords.jpg', w: 2539, h: 1877, bg: 'godswords_bg.jpg', credit: TIS + ', He That Is of God Heareth God’s Words (1886–94)' + pd };
const PORCH: Pic = { src: 'porch.jpg', w: 2524, h: 1795, bg: 'porch_bg.jpg', credit: TIS + ', Jesus Walking in Solomon’s Porch (1886–94)' + pd };
const FELL: Pic = { src: 'fell.jpg', w: 2600, h: 1887, bg: 'fell_bg.jpg', credit: TIS + ', They Went Backward and Fell to the Ground (1886–94)' + pd };
const MULT: Pic = { src: 'multitude.jpg', w: 2092, h: 2600, bg: 'multitude_bg.jpg', credit: TIS + ', Judas and with Him a Great Multitude (1886–94)' + pd };
const KISS: Pic = { src: 'kiss.jpg', w: 1820, h: 1520, bg: 'kiss_bg.jpg', credit: TIS + ', Judas Betraying Jesus with a Kiss (1886–94)' + pd };
const ROB: Pic = { src: 'roberts.jpg', w: 2367, h: 1133, bg: 'roberts_bg.jpg', credit: 'David Roberts, Jerusalem (1842)' + pd };
const BUSH: Pic = { src: 'bush.jpg', w: 2600, h: 2159, bg: 'bush_bg.jpg', credit: SCH + ', Moses Called at the Burning Bush (1860)' + pd };
const ABRAM: Pic = { src: 'abram.jpg', w: 2600, h: 2178, bg: 'abram_bg.jpg', credit: SCH + ', Abram Receives the Promise (1860)' + pd };
const KK = 'The King of Kings (1927)' + pd;

type S = { t0: number; t1: number; pic?: Pic; from?: Cam; to?: Cam; mode?: 'cover' | 'fit'; clip?: string; at?: number; vh?: number; credit?: string };
const SH: S[] = [
  { t0: 0, t1: 2.6, pic: STONES, from: [.22, .45, 2.0], to: [.2, .42, 1.55] },
  { t0: 2.45, t1: 4.5, clip: 'k1.mp4', at: 0.3, vh: 814, credit: KK },
  { t0: 4.35, t1: 6.3, pic: ROB, from: [.55, .35, 1.5], to: [.62, .3, 1.25] },
  { t0: 6.15, t1: 9.4, clip: 'k7.mp4', at: 0, vh: 814, credit: KK },
  { t0: 9.25, t1: 12.0, pic: TREAS, from: [.5, .55, 1.15], to: [.55, .6, 1.45] },
  { t0: 11.85, t1: 14.3, pic: TREAS, from: [.47, .3, 2.0], to: [.5, .32, 1.6] },
  { t0: 14.15, t1: 18.7, pic: ABRAM, mode: 'fit', from: [.5, .5, 1.0], to: [.5, .5, 1.12] },
  { t0: 18.55, t1: 23.1, pic: ABRAM, from: [.62, .3, 1.4], to: [.45, .15, 1.75] },
  { t0: 22.95, t1: 27.9, clip: 'k2.mp4', at: 0, vh: 814, credit: KK },
  { t0: 27.75, t1: 31.0, pic: ABRAM, from: [.3, .55, 1.7], to: [.3, .5, 1.3] },
  { t0: 30.85, t1: 35.4, pic: GODW, from: [.13, .4, 1.4], to: [.13, .35, 1.9] },
  { t0: 35.25, t1: 38.0, pic: GODW, from: [.13, .28, 2.4], to: [.13, .28, 2.9] },
  { t0: 37.95, t1: 40.4, pic: STONES, from: [.7, .55, 1.4], to: [.72, .55, 1.95] },
  { t0: 40.25, t1: 43.1, clip: 'k1.mp4', at: 2.6, vh: 814, credit: KK },
  { t0: 42.95, t1: 46.0, pic: BUSH, mode: 'fit', from: [.5, .5, 1.0], to: [.5, .5, 1.12] },
  { t0: 45.85, t1: 49.6, pic: BUSH, from: [.25, .3, 1.8], to: [.3, .25, 2.2] },
  { t0: 49.45, t1: 55.0, pic: BUSH, from: [.62, .45, 1.6], to: [.6, .4, 1.3] },
  { t0: 54.85, t1: 60.9, pic: STONES, from: [.75, .6, 2.2], to: [.7, .55, 1.7] },
  { t0: 60.75, t1: 62.6, clip: 'k1.mp4', at: 4.0, vh: 814, credit: KK },
  { t0: 62.45, t1: 66.9, pic: STONES, from: [.2, .5, 1.6], to: [.15, .45, 1.3] },
  { t0: 66.75, t1: 69.4, pic: STONES, mode: 'fit', from: [.5, .5, 1.0], to: [.5, .5, 1.1] },
  { t0: 69.25, t1: 72.4, clip: 'k7.mp4', at: 0.5, vh: 814, credit: KK },
  { t0: 72.25, t1: 75.4, pic: ROB, from: [.75, .3, 1.8], to: [.7, .32, 1.5] },
  { t0: 75.25, t1: 79.0, pic: PORCH, from: [.6, .4, 1.2], to: [.62, .4, 1.5] },
  { t0: 78.85, t1: 84.0, pic: PORCH, from: [.7, .42, 1.6], to: [.7, .4, 1.9] },
  { t0: 83.85, t1: 86.8, pic: MULT, from: [.5, .6, 1.15], to: [.5, .75, 1.35] },
  { t0: 86.65, t1: 90.6, clip: 'k6.mp4', at: 0, vh: 814, credit: KK },
  { t0: 90.45, t1: 94.0, clip: 'k5.mp4', at: 0.5, vh: 814, credit: KK },
  { t0: 93.85, t1: 96.6, pic: FELL, from: [.4, .4, 1.45], to: [.42, .42, 1.15] },
  { t0: 96.45, t1: 99.7, pic: STONES, from: [.7, .55, 1.5], to: [.75, .55, 1.2] },
  { t0: 99.55, t1: 102.2, pic: FELL, from: [.75, .6, 1.6], to: [.65, .55, 1.3] },
  { t0: 102.05, t1: 104.0, pic: KISS, from: [.35, .4, 1.4], to: [.35, .4, 1.7] },
  { t0: 103.85, t1: DUR + .1, pic: FELL, mode: 'fit', from: [.5, .5, 1.0], to: [.5, .5, 1.1] },
];
const CH: [number, string][] = [[0, 'two words'], [12.0, 'abraham'], [31.0, 'i am'], [40.4, 'the bush'], [54.95, 'the law'], [66.9, 'again'], [84.0, 'the garden']];

const goldText: React.CSSProperties = { background: 'linear-gradient(180deg,#FFF4C8 0%,#F2CF73 40%,#C99130 75%,#8A5E20 100%)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent', filter: 'drop-shadow(0 0 18px rgba(240,190,100,.45)) drop-shadow(0 5px 6px rgba(0,0,0,.85))' };
const abs = (x: number, y: number, w?: number): React.CSSProperties => ({ position: 'absolute', left: x, top: y, width: w });
const Title: React.FC<{ t: number; t0: number; t1: number; y: number; lines: string[]; size?: number; style?: ('g' | 'c' | 'r')[]; from?: 'up' | 'zoom' | 'slam' }> = ({ t, t0, t1, y, lines, size = 96, style, from = 'zoom' }) => {
  const a = env(t, t0, t1, .22, .3); if (a <= 0) return null;
  const k = P(t, t0, t0 + .5);
  const sc = from === 'slam' ? lerp(1.9, 1, eout(P(t, t0, t0 + .2))) : from === 'zoom' ? lerp(1.12, 1, eout(k)) : 1;
  const dy = from === 'up' ? (1 - eout(k)) * 50 : 0;
  return <div style={{ ...abs(SL, y + dy, SR - SL), textAlign: 'center', opacity: a, scale: String(sc), transformOrigin: 'center' }}>
    <div style={{ position: 'absolute', left: -120, right: -120, top: -size * .55, bottom: -size * .55, background: 'radial-gradient(ellipse at 50% 50%, rgba(4,4,9,.82) 0%, rgba(4,4,9,.55) 45%, rgba(4,4,9,0) 72%)' }} />
    {lines.map((l, i) => { const s = style?.[i] ?? 'g'; return <div key={i} style={{ position: 'relative', fontFamily: CIN, fontWeight: 700, fontSize: size, lineHeight: 1.08, letterSpacing: 2, ...(s === 'g' ? goldText : s === 'r' ? { color: '#ff6a5a', textShadow: '0 0 30px rgba(220,40,30,.6), 0 4px 10px rgba(0,0,0,.9)' } : { color: CR, textShadow: '0 4px 18px rgba(0,0,0,.95)' }) }}>{l}</div>; })}
  </div>;
};
const Sub: React.FC<{ s: string; y: number; a: number; size?: number; color?: string }> = ({ s, y, a, size = 44, color = CR }) =>
  a <= 0 ? null : <div style={{ ...abs(SL, y + (1 - eout(a)) * 14, SR - SL), textAlign: 'center', opacity: a, fontFamily: CORI, fontWeight: 600, fontSize: size, color, textShadow: '0 2px 14px rgba(0,0,0,1), 0 0 30px rgba(0,0,0,.8)' }}><div style={{ position: 'absolute', left: -60, right: -60, top: -size * .45, bottom: -size * .45, background: 'radial-gradient(ellipse at 50% 50%, rgba(4,4,9,.7) 0%, rgba(4,4,9,.4) 50%, rgba(4,4,9,0) 75%)' }} /><span style={{ position: 'relative' }}>{s}</span></div>;
const Chip: React.FC<{ s: string; y: number; a: number; size?: number; color?: string; border?: string }> = ({ s, y, a, size = 28, color = GL, border = G }) =>
  a <= 0 ? null : <div style={{ position: 'absolute', left: CX, top: y, translate: '-50% 0', opacity: a, scale: String(lerp(.8, 1, eback(clamp(a)))), padding: '12px 28px', borderRadius: 40, background: 'rgba(10,8,18,.9)', border: `2.5px solid ${border}`, fontFamily: CIN, fontWeight: 700, fontSize: size, letterSpacing: 3, color, whiteSpace: 'nowrap', boxShadow: '0 8px 30px rgba(0,0,0,.6)' }}>{s}</div>;
const Stamp: React.FC<{ s: string; y: number; t: number; t0: number; t1: number; color?: string; size?: number; rot?: number }> = ({ s, y, t, t0, t1, color = G, size = 56, rot = -4 }) => {
  const a = env(t, t0, t1, .1, .25); if (a <= 0) return null;
  return <div style={{ position: 'absolute', left: CX, top: y, translate: '-50% 0', rotate: `${rot}deg`, scale: String(lerp(1.9, 1, eout(P(t, t0, t0 + .18)))), opacity: a, border: `5px solid ${color}`, borderRadius: 12, padding: '6px 30px', fontFamily: CIN, fontWeight: 700, fontSize: size, letterSpacing: 5, color, whiteSpace: 'nowrap', background: 'rgba(8,6,12,.72)' }}>{s}</div>;
};
const Counter: React.FC<{ t: number; t0: number; t1: number; n: number; y: number; label: string }> = ({ t, t0, t1, n, y, label }) => {
  const a = env(t, t0, t1, .2, .3); if (a <= 0) return null;
  return <div style={{ ...abs(SL, y, SR - SL), textAlign: 'center', opacity: a }}>
    <div style={{ position: 'absolute', left: -120, right: -120, top: -60, bottom: -60, background: 'radial-gradient(ellipse at 50% 50%, rgba(4,4,9,.8) 0%, rgba(4,4,9,.5) 45%, rgba(4,4,9,0) 72%)' }} />
    <div style={{ position: 'relative', ...goldText, fontFamily: CIN, fontWeight: 700, fontSize: 190, lineHeight: 1, scale: String(lerp(1.4, 1, eout(P(t, t0, t0 + .25)))) }}>{n}</div>
    <div style={{ position: 'relative', fontFamily: CIN, fontWeight: 700, fontSize: 34, letterSpacing: 8, color: CR, textShadow: '0 2px 12px #000' }}>{label}</div>
  </div>;
};
const Hud: React.FC<{ t: number }> = ({ t }) => {
  let ci = 0; CH.forEach(([s], i) => { if (t >= s) ci = i; });
  const y = 245, n = CH.length, gap = 10, sw = (SR - SL - gap * (n - 1)) / n;
  const ca = eout(P(t, CH[ci][0], CH[ci][0] + .4));
  return <>
    <div style={{ ...abs(SL, y - 34), width: 68, height: 68, borderRadius: '50%', boxShadow: '0 0 0 2px rgba(212,175,106,.7)' }}><Logo size={68} /></div>
    <div style={{ position: 'absolute', left: SL + 80, top: y - 36, fontFamily: CIN, fontWeight: 700, fontSize: 29, color: CR }}>The Lost Scriptures</div>
    <div style={{ position: 'absolute', left: SL + 80, top: y + 4, fontFamily: CORI, fontWeight: 600, fontSize: 27, color: 'rgba(243,231,207,.65)' }}>before Abraham was · John 8</div>
    <div style={{ position: 'absolute', left: SR - 300, top: y - 34, width: 300, textAlign: 'right', fontFamily: MONO, fontSize: 22, color: 'rgba(243,231,207,.45)' }}>{`${ci + 1}/${n}`}</div>
    <div style={{ position: 'absolute', left: SR - 300, top: y - 2 + (1 - ca) * 12, width: 300, textAlign: 'right', fontFamily: CORI, fontWeight: 600, fontSize: 32, color: G, opacity: ca }}>{CH[ci][1]}</div>
    {CH.map(([s], i) => { const en = i < n - 1 ? CH[i + 1][0] : DUR - 1; const p = clamp((t - s) / (en - s));
      return <div key={i} style={{ position: 'absolute', left: SL + i * (sw + gap), top: y + 54, width: sw, height: 5, borderRadius: 3, background: 'rgba(243,231,207,.14)' }}><div style={{ width: `${p * 100}%`, height: '100%', borderRadius: 3, background: i === 6 ? RED : G }} /></div>; })}
  </>;
};
const Captions: React.FC<{ t: number }> = ({ t }) => {
  let cur: typeof CAPS[number] | null = null; for (const p of CAPS) if (t >= p[0].s - .05) cur = p;
  if (!cur) return null; const last = cur[cur.length - 1]; if (t > last.e + .8) return null;
  const pa = eout(P(t, cur[0].s - .05, cur[0].s + .12));
  return <div style={{ position: 'absolute', left: SL - 20, top: 350, width: SR - SL + 40, display: 'flex', justifyContent: 'center', flexWrap: 'nowrap', gap: 15, opacity: pa, fontFamily: SANS, fontWeight: 800, fontSize: 52, whiteSpace: 'nowrap' }}>
    {cur.map((o, i) => { const spoken = t >= o.s - .03; const active = spoken && t < o.e + .1; const kw = Boolean(o.k) && spoken; const kp = eout(P(t, o.s - .03, o.s + .18));
      return <span key={i} style={{ position: 'relative', color: kw ? GL : spoken ? '#FFF8EA' : 'rgba(255,248,234,.3)', textShadow: kw ? '0 0 22px rgba(240,200,120,.7), 0 3px 12px rgba(0,0,0,.95)' : '0 3px 16px rgba(0,0,0,.95)', translate: `0 ${active ? -4 * Math.sin(P(t, o.s, o.s + .25) * Math.PI) : 0}px`, scale: String(active ? 1 + .06 * Math.sin(P(t, o.s, o.s + .25) * Math.PI) : 1) }}>
        {o.w}
        {kw && <span style={{ position: 'absolute', left: 0, bottom: -6, height: 5, width: `${kp * 100}%`, background: G, borderRadius: 3 }} />}
      </span>; })}
  </div>;
};



/* parchment quote card */
const Parch: React.FC<{ t: number; t0: number; t1: number; y: number; ref_: string; who: string; lines: string[]; hi: number; size?: number; rot?: number }> = ({ t, t0, t1, y, ref_, who, lines, hi, size = 46, rot = -1.2 }) => {
  const a = env(t, t0, t1, .35, .3); if (a <= 0) return null;
  const r = eout(P(t, t0, t0 + .5)); const h = clamp((t - hi) / .4);
  return <div style={{ position: 'absolute', left: CX - 390, top: y + (1 - r) * 40, width: 780, opacity: a, rotate: `${rot}deg`, borderRadius: 8, padding: '30px 40px 34px', boxSizing: 'border-box',
    background: 'radial-gradient(ellipse at 45% 40%, #efe0bd 0%, #d9c393 60%, #a98d5c 100%)', boxShadow: '0 24px 70px rgba(0,0,0,.85), inset 0 0 60px rgba(90,60,20,.55)', textAlign: 'center' }}>
    <div style={{ fontFamily: CIN, fontWeight: 700, fontSize: 28, letterSpacing: 4, color: '#6b4a22' }}>{ref_}</div>
    <div style={{ fontFamily: CORI, fontWeight: 600, fontSize: 28, color: '#6b4a22', marginTop: 2, marginBottom: 14 }}>{who}</div>
    {lines.map((l, i) => <div key={i} style={{ fontFamily: CORI, fontWeight: 600, fontSize: size, lineHeight: 1.25, color: '#3b2a18' }}>
      <span style={{ background: `rgba(243,212,140,${.75 * h})`, borderRadius: 6, padding: '0 6px', boxShadow: h > 0 ? `0 0 ${24 * h}px rgba(243,212,140,${.8 * h})` : undefined }}>{l}</span></div>)}
  </div>;
};

/* Exodus 3:14 (Greek OT) vs John 8:58 */
const Twin: React.FC<{ t: number; t0: number; t1: number }> = ({ t, t0, t1 }) => {
  const a = env(t, t0, t1, .35, .3); if (a <= 0) return null;
  const r1 = eout(P(t, 50.15, 50.65)), r2 = eout(P(t, 52.6, 53.1)), h = clamp((t - 53.76) / .4);
  const parch: React.CSSProperties = { background: 'radial-gradient(ellipse at 45% 40%, #efe0bd 0%, #d9c393 60%, #a98d5c 100%)', boxShadow: '0 24px 70px rgba(0,0,0,.85), inset 0 0 60px rgba(90,60,20,.55)', borderRadius: 8, padding: '22px 30px 26px', boxSizing: 'border-box', textAlign: 'center', position: 'absolute', left: CX - 400, width: 800 };
  const hl = (s: string, on: number) => <span style={{ background: `rgba(243,212,140,${.85 * on})`, borderRadius: 6, padding: '0 6px', boxShadow: on > 0 ? `0 0 ${22 * on}px rgba(243,212,140,${.8 * on})` : undefined }}>{s}</span>;
  const card = (top: number, r: number, ref_: string, who: string, pre: string, key: string, post: string, en: string, rot: number, on: number) => r <= 0 ? null :
    <div style={{ ...parch, top: top + (1 - r) * 30, opacity: r, rotate: `${rot}deg` }}>
      <div style={{ fontFamily: CIN, fontWeight: 700, fontSize: 26, letterSpacing: 4, color: '#6b4a22' }}>{ref_}</div>
      <div style={{ fontFamily: CORI, fontWeight: 600, fontSize: 26, color: '#6b4a22', marginBottom: 10 }}>{who}</div>
      <div style={{ fontFamily: GRK, fontSize: key.length > 0 && pre.length > 5 ? 42 : 52, lineHeight: 1.3, whiteSpace: 'nowrap', color: '#3b2a18' }}>{pre}{hl(key, on)}{post}</div>
      <div style={{ fontFamily: CORI, fontWeight: 600, fontSize: 32, color: '#5a3d1c', marginTop: 6 }}>{en}</div>
    </div>;
  return <div style={{ position: 'absolute', inset: 0, opacity: a }}>
    {card(600, r1, 'EXODUS 3 : 14', 'the Greek Old Testament · God to Moses', '', 'ἐγώ εἰμι', ' ὁ ὤν', '“I am He who is”', -1.2, Math.max(clamp((t - 51.0) / .4) * (1 - clamp((t - 52.0) / .4)), h))}
    {card(960, r2, 'JOHN 8 : 58', 'Jesus in the Temple', 'πρὶν Ἀβραὰμ γενέσθαι ', 'ἐγὼ εἰμί', '', '“before Abraham was, I am”', 1.2, h)}
  </div>;
};

const HITS: [number, number, number][] = [[1.01, 14, 6], [2.82, 16, 5], [12.98, 8, 7], [23.3, 10, 6], [35.45, 18, 4], [37.32, 12, 5], [38.86, 16, 5], [43.3, 10, 6], [47.47, 14, 5], [50.93, 10, 6], [53.76, 10, 6], [60.09, 16, 5], [77.95, 14, 5], [83.18, 12, 6], [85.38, 8, 7], [86.08, 8, 7], [91.33, 16, 5], [94.56, 14, 5], [95.75, 18, 4], [98.79, 14, 5], [101.52, 16, 5]];
const shotAt = (t: number) => { let s: S = SH[0]; for (const x of SH) if (t >= x.t0 + .15) s = x; return s; };

export const StoryVideo: React.FC = () => {
  const t = useCurrentFrame() / FPS;
  let sx = 0, sy = 0; for (const [h, amp, dec] of HITS) { const [x, y] = shake(t, h, amp, dec); sx += x; sy += y; }
  const cur = shotAt(t);
  const flash = Math.max(env(t, 2.78, 3.1, .03, .3) * .45, env(t, 35.4, 35.8, .03, .4) * .6, env(t, 38.82, 39.15, .03, .3) * .45, env(t, 47.43, 47.8, .03, .35) * .5, env(t, 91.3, 91.7, .03, .4) * .6, env(t, 95.7, 96.1, .03, .35) * .5);
  return <AbsoluteFill style={{ backgroundColor: '#040409', overflow: 'hidden' }}>
    <div style={{ position: 'absolute', inset: 0, translate: `${sx}px ${sy}px`, scale: '1.03' }}>
      {SH.map((s, i) => s.clip ? <Clip key={i} t={t} t0={s.t0} t1={s.t1} clip={s.clip} at={s.at} vw={1080} vh={s.vh!} mode="band" />
        : <Shot key={i} t={t} t0={s.t0} t1={s.t1} pic={s.pic!} from={s.from!} to={s.to} mode={s.mode} />)}
    </div>
    <PhotoShade />
    {/* warm fire for the bush; cold night for the garden */}
    <AbsoluteFill style={{ background: 'radial-gradient(ellipse at 35% 30%, rgba(255,140,50,.35) 0%, rgba(160,60,10,.15) 55%, rgba(0,0,0,0) 100%)', opacity: env(t, 42.95, 49.6, .5, .5) }} />
    <AbsoluteFill style={{ background: 'radial-gradient(ellipse at 50% 55%, rgba(20,30,60,0) 30%, rgba(20,30,60,.55) 100%)', opacity: env(t, 83.9, 104.0, .5, .6) }} />
    {/* dim for panels */}
    <AbsoluteFill style={{ background: 'rgba(4,4,9,.64)', opacity: Math.max(env(t, 49.7, 54.85, .3, .3), env(t, 55.0, 60.85, .3, .3), env(t, 72.3, 75.3, .3, .3)) }} />
    <AbsoluteFill style={{ background: '#FFF6E0', opacity: flash * .7 }} />
    <Credit s={t < DUR - 5.3 ? (cur.credit ?? cur.pic?.credit) : undefined} a={1} />

    {/* ---- two words ---- */}
    <Title t={t} t0={0.21} t1={2.45} y={960} lines={['JESUS SAID', 'TWO WORDS']} size={104} style={['c', 'g']} from="slam" />
    <Title t={t} t0={2.6} t1={4.0} y={980} lines={['THEY PICKED', 'UP STONES']} size={96} style={['c', 'r']} from="slam" />
    <Chip s="JOHN 8 : 31–59" y={1080} a={env(t, 4.1, 5.25, .2, .2)} />
    <Title t={t} t0={5.34} t1={7.0} y={980} lines={['JERUSALEM']} size={106} from="slam" />
    <Sub s="the Temple · the Feast of Tabernacles" y={1110} a={env(t, 6.2, 9.3, .2, .2)} size={44} />
    <Chip s="JOHN 7 : 37" y={1200} a={env(t, 7.4, 9.3, .2, .2)} />
    <Title t={t} t0={9.48} t1={11.9} y={980} lines={['THE TREASURY']} size={96} style={['g']} from="up" />
    <Chip s="JOHN 8 : 20" y={1120} a={env(t, 9.9, 11.9, .2, .2)} />
    {/* ---- abraham ---- */}
    <Title t={t} t0={12.0} t1={14.2} y={970} lines={['“ABRAHAM IS', 'OUR FATHER”']} size={88} style={['c', 'g']} from="slam" />
    <Title t={t} t0={15.36} t1={18.6} y={960} lines={['“IF YE WERE', 'ABRAHAM’S', 'CHILDREN…”']} size={76} style={['c', 'g', 'g']} from="up" />
    <Chip s="JOHN 8 : 39" y={1250} a={env(t, 15.9, 18.6, .2, .2)} />
    <Title t={t} t0={18.78} t1={23.0} y={950} lines={['“ABRAHAM REJOICED', 'TO SEE MY DAY”']} size={66} style={['c', 'g']} from="up" />
    <Sub s="“…and he saw it, and was glad”" y={1140} a={env(t, 21.6, 23.0, .2, .2)} size={46} color={GL} />
    <Chip s="JOHN 8 : 56" y={1220} a={env(t, 19.5, 23.0, .2, .2)} />
    <Stamp s="THEY LAUGH" y={1020} t={t} t0={23.26} t1={24.35} color={RED} size={80} rot={-4} />
    <Title t={t} t0={24.45} t1={27.9} y={950} lines={['“THOU ART NOT', 'YET FIFTY…”']} size={88} style={['c', 'g']} from="slam" />
    <Sub s="“…and hast thou seen Abraham?”" y={1170} a={env(t, 26.2, 27.9, .2, .2)} size={46} color={GL} />
    <Chip s="JOHN 8 : 57" y={1250} a={env(t, 25.0, 27.9, .2, .2)} />
    <Counter t={t} t0={28.4} t1={30.9} n={2000} y={930} label="YEARS SINCE ABRAHAM" />
    {/* ---- i am ---- */}
    <Sub s="and Jesus says" y={1080} a={env(t, 31.0, 32.25, .2, .15)} size={52} color={CR} />
    <Title t={t} t0={32.34} t1={35.35} y={960} lines={['“VERILY, VERILY…', 'BEFORE ABRAHAM WAS,”']} size={62} style={['c', 'g']} from="up" />
    <Title t={t} t0={35.45} t1={36.3} y={900} lines={['I AM']} size={210} style={['g']} from="slam" />
    <Title t={t} t0={36.34} t1={37.1} y={980} lines={['NOT “I WAS”']} size={90} style={['c']} from="slam" />
    <Title t={t} t0={37.13} t1={38.0} y={900} lines={['I AM']} size={210} style={['g']} from="slam" />
    <Chip s="JOHN 8 : 58" y={1180} a={env(t, 35.6, 38.0, .2, .2)} />
    <Title t={t} t0={38.09} t1={40.3} y={960} lines={['THEN TOOK', 'THEY UP', 'STONES']} size={88} style={['c', 'c', 'r']} from="slam" />
    <Chip s="JOHN 8 : 59" y={1270} a={env(t, 38.9, 40.3, .2, .2)} />
    {/* ---- the bush ---- */}
    <Title t={t} t0={40.4} t1={41.4} y={980} lines={['WHY STONES?']} size={100} style={['g']} from="slam" />
    <Sub s="go back 1,500 years…" y={1080} a={env(t, 41.47, 43.05, .15, .15)} size={52} color={CR} />
    <Title t={t} t0={43.1} t1={44.1} y={990} lines={['THE BURNING BUSH']} size={82} style={['g']} from="slam" />
    <Sub s="Moses asks God his name" y={1080} a={env(t, 44.15, 46.0, .2, .2)} size={50} color={CR} />
    <Chip s="EXODUS 3 : 13" y={1170} a={env(t, 44.6, 46.0, .2, .2)} />
    <Title t={t} t0={46.08} t1={49.5} y={930} lines={['“I AM', 'THAT I AM”']} size={120} style={['g', 'g']} from="up" />
    <Chip s="EXODUS 3 : 14" y={1210} a={env(t, 47.0, 49.5, .2, .2)} />
    <Title t={t} t0={48.68} t1={50.0} y={480} lines={['IN THE GREEK BIBLE']} size={46} style={['c']} from="up" />
    <Twin t={t} t0={49.6} t1={54.85} />
    <Stamp s="THE SAME TWO WORDS" y={1340} t={t} t0={53.76} t1={54.85} color={RED} size={46} rot={-3} />
    {/* ---- the law ---- */}
    <Parch t={t} t0={55.0} t1={60.85} y={660} ref_="LEVITICUS 24 : 16" who="the Law of Moses" lines={['“he that blasphemeth', 'the name of the LORD…', 'all the congregation', 'shall certainly stone him”']} hi={58.4} size={50} />
    <Title t={t} t0={60.95} t1={62.6} y={980} lines={['THEY UNDERSTOOD', 'HIM PERFECTLY']} size={76} style={['c', 'g']} from="slam" />
    <Title t={t} t0={62.68} t1={66.85} y={960} lines={['“JESUS', 'HID HIMSELF”']} size={96} style={['c', 'g']} from="up" />
    <Sub s="through the midst of them" y={1190} a={env(t, 65.4, 66.85, .2, .2)} size={46} color={GL} />
    {/* ---- again ---- */}
    <Sub s="Tissot painted builders’ beams" y={480} a={env(t, 67.0, 69.4, .2, .2)} size={46} color={CR} />
    <Pin x={330} y={880} s="BEAMS" a={env(t, 67.9, 69.35, .25, .2)} />
    <Pin x={640} y={1150} s="STONES" a={env(t, 68.4, 69.35, .25, .2)} />
    <Title t={t} t0={69.55} t1={72.2} y={980} lines={['A BUILDING SITE']} size={86} style={['g']} from="slam" />
    <Sub s="Herod’s Temple, still unfinished" y={1110} a={env(t, 69.9, 72.2, .2, .2)} size={46} color={CR} />
    <Parch t={t} t0={72.3} t1={75.3} y={700} ref_="JOSEPHUS · c. AD 93" who="Antiquities of the Jews 20.219" lines={['“And now it was that', 'the temple was finished”']} hi={73.1} size={52} />
    <Chip s="c. AD 63" y={1090} a={env(t, 74.3, 75.3, .2, .2)} size={34} />
    <Title t={t} t0={75.43} t1={77.75} y={960} lines={['TWO CHAPTERS', 'LATER']} size={84} style={['c', 'g']} from="up" />
    <Sub s="Solomon’s porch" y={1170} a={env(t, 76.4, 77.75, .2, .2)} size={50} color={GL} />
    <Title t={t} t0={77.82} t1={79.15} y={980} lines={['STONES AGAIN']} size={100} style={['r']} from="slam" />
    <Chip s="JOHN 10 : 31" y={1120} a={env(t, 78.2, 79.15, .2, .2)} />
    <Sub s="and this time they say why" y={1080} a={env(t, 79.2, 80.8, .2, .2)} size={50} color={CR} />
    <Title t={t} t0={80.91} t1={83.9} y={950} lines={['“THOU, BEING A MAN,', 'MAKEST THYSELF GOD”']} size={64} style={['c', 'g']} from="up" />
    <Chip s="JOHN 10 : 33" y={1130} a={env(t, 81.6, 83.9, .2, .2)} />
    {/* ---- the garden ---- */}
    <Sub s="the last time he says it…" y={1080} a={env(t, 84.0, 85.25, .2, .15)} size={50} color={CR} />
    <Title t={t} t0={85.32} t1={86.0} y={990} lines={['A GARDEN']} size={110} style={['c']} from="slam" />
    <Title t={t} t0={86.08} t1={86.85} y={990} lines={['NIGHT']} size={130} style={['g']} from="slam" />
    <Sub s="lanterns · torches · weapons" y={1050} a={env(t, 86.9, 88.85, .2, .2)} size={50} color={GL} />
    <Chip s="JOHN 18 : 3" y={1140} a={env(t, 87.3, 88.85, .2, .2)} />
    <Title t={t} t0={88.91} t1={90.6} y={980} lines={['“JESUS OF', 'NAZARETH”']} size={88} style={['c', 'g']} from="up" />
    <Title t={t} t0={91.33} t1={92.3} y={960} lines={['“I AM HE”']} size={130} style={['g']} from="slam" />
    <div style={{ ...abs(SL - 40, 930, SR - SL + 80), textAlign: 'center', opacity: env(t, 92.35, 94.0, .2, .25), fontFamily: GRK, fontSize: 130, lineHeight: 1.1, ...goldText, scale: String(lerp(1.3, 1, eout(P(t, 92.35, 92.7)))) }}>ἐγώ εἰμι</div>
    <Chip s="JOHN 18 : 5" y={1140} a={env(t, 92.6, 94.0, .2, .2)} />
    <Title t={t} t0={94.08} t1={96.6} y={910} lines={['THEY WENT', 'BACKWARD', 'AND FELL']} size={90} style={['c', 'g', 'r']} from="slam" />
    <Chip s="JOHN 18 : 6" y={1250} a={env(t, 95.0, 96.6, .2, .2)} />
    <Sub s="once, two words made a crowd pick up…" y={1060} a={env(t, 96.68, 98.7, .2, .15)} size={44} color={CR} />
    <Title t={t} t0={98.79} t1={99.7} y={980} lines={['STONES']} size={130} style={['r']} from="slam" />
    <Title t={t} t0={99.78} t1={102.15} y={950} lines={['THAT NIGHT', 'ARMED MEN', 'ON THE GROUND']} size={80} style={['c', 'g', 'g']} from="up" />
    <Title t={t} t0={102.24} t1={103.85} y={960} lines={['THEN HE LET', 'THEM TAKE HIM']} size={84} style={['c', 'g']} from="up" />
    {/* ---- follow ---- */}
    <AbsoluteFill style={{ background: 'rgba(4,4,9,.72)', opacity: env(t, 103.9, DUR + 1, .4, .1) }} />
    <div style={{ ...abs(CX - 70, 640), width: 140, height: 140, opacity: env(t, 104.0, DUR + 1, .4, .1), borderRadius: '50%', boxShadow: '0 0 0 3px rgba(212,175,106,.8), 0 0 60px rgba(212,175,106,.4)' }}><Logo size={140} /></div>
    <Sub s="@lostscripturesbooks" y={800} a={env(t, 104.15, DUR + 1, .4, .1)} size={40} color={GL} />
    <Title t={t} t0={104.05} t1={DUR + 1} y={880} lines={['FOLLOW']} size={140} from="slam" />
    <Sub s="for more stories from the Bible" y={1060} a={eout(P(t, 104.5, 105.0))} size={50} />
    <Sub s="that most people never hear" y={1125} a={eout(P(t, 106.2, 106.7))} size={50} color={GL} />

    <AbsoluteFill style={{ background: 'radial-gradient(ellipse at 50% 46%, rgba(0,0,0,0) 58%, rgba(0,0,0,.5) 100%)' }} />
    <Hud t={t} /><Captions t={t} />
    <AbsoluteFill style={{ backgroundColor: '#000', opacity: Math.max(1 - P(t, 0, .2), P(t, DUR - .6, DUR)) }} />
  </AbsoluteFill>;
};

/* TikTok cover: grid crops the centre 3:4 (y ≈ 240–1680) — all text inside y 280–1640 */
export const StoryCover: React.FC = () => <AbsoluteFill style={{ backgroundColor: '#040409', overflow: 'hidden' }}>
  <Shot t={1} t0={0} t1={2} pic={STONES} mode="fit" y={1000} from={[.5, .5, 1.5]} fi={0} fo={0} />
  <AbsoluteFill style={{ background: 'linear-gradient(180deg, rgba(4,4,9,.96) 14%, rgba(4,4,9,.75) 31%, rgba(4,4,9,0) 44%, rgba(4,4,9,0) 62%, rgba(4,4,9,.9) 77%, rgba(4,4,9,.97) 90%)' }} />
  <div style={{ ...abs(CX - 34, 300), width: 68, height: 68 }}><Logo size={68} /></div>
  <div style={{ ...abs(90, 390, 900), textAlign: 'center', fontFamily: CIN, fontWeight: 700, fontSize: 40, letterSpacing: 7, color: CR, opacity: .9 }}>JESUS SAID TWO WORDS</div>
  <div style={{ ...abs(90, 450, 900), textAlign: 'center', ...goldText, fontFamily: CIN, fontWeight: 700, fontSize: 100, lineHeight: 1.05, whiteSpace: 'nowrap' }}>THEY PICKED<br />UP STONES</div>
  <div style={{ ...abs(90, 1340, 900), textAlign: 'center', fontFamily: CIN, fontWeight: 700, fontSize: 64, lineHeight: 1.1, color: '#ff6a5a', textShadow: '0 0 30px rgba(220,40,30,.6), 0 4px 10px rgba(0,0,0,.9)' }}>WHICH TWO WORDS?</div>
  <div style={{ ...abs(90, 1530, 900), textAlign: 'center', fontFamily: CORI, fontWeight: 600, fontSize: 40, color: 'rgba(243,231,207,.75)' }}>John 8 · before Abraham was</div>
  <AbsoluteFill style={{ background: 'radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0) 60%, rgba(0,0,0,.55) 100%)' }} />
</AbsoluteFill>;
