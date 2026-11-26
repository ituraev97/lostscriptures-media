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
export const DUR = 108.6;
const SANS = 'Inter, sans-serif';
const GRK = '"DejaVu Serif", serif';
const TIS = 'James Tissot', DORE = 'Gustave Doré';
const ROADP: Pic = { src: 'road.jpg', w: 2259, h: 1496, bg: 'road_bg.jpg', credit: TIS + ', The Disciples on the Road to Emmaus (1886–94)' + pd };
const VANISH: Pic = { src: 'vanish.jpg', w: 935, h: 1484, bg: 'vanish_bg.jpg', credit: TIS + ', And He Vanished out of Their Sight (1886–94)' + pd };
const LAND: Pic = { src: 'land.jpg', w: 1062, h: 619, bg: 'land_bg.jpg', credit: TIS + ', The Life of Our Saviour (1899), Judean hills' + pd };
const DOREP: Pic = { src: 'dore.jpg', w: 2062, h: 2598, bg: 'dore_bg.jpg', credit: DORE + ', The Journey to Emmaus (1866)' + pd };
const ELEVEN: Pic = { src: 'eleven.jpg', w: 2165, h: 1003, bg: 'eleven_bg.jpg', credit: TIS + ', Christ Appears to the Eleven (1886–94)' + pd };
const EXPUL: Pic = { src: 'expul.jpg', w: 2029, h: 2600, bg: 'expul_bg.jpg', credit: DORE + ', The Expulsion from the Garden (1866)' + pd };
const JER: Pic = { src: 'jer.jpg', w: 2600, h: 1583, bg: 'jer_bg.jpg', credit: 'David Roberts, Jerusalem from the Road Leading to Bethany (1841)' + pd };
const OLIVE: Pic = { src: 'olive.jpg', w: 2600, h: 1596, bg: 'olive_bg.jpg', credit: 'David Roberts, Jerusalem from the Mount of Olives (1841)' + pd };
const ABIDE: Pic = { src: 'abide.jpg', w: 2600, h: 1921, bg: 'abide_bg.jpg', credit: 'Julius Schnorr von Carolsfeld, Jesus Appears to Two Disciples on the Way to Emmaus (1860)' + pd };
const COMMUN: Pic = { src: 'commun.jpg', w: 1531, h: 891, bg: 'commun_bg.jpg', credit: TIS + ', The Communion of the Apostles (1886–94)' + pd };
const WOMEN: Pic = { src: 'women.jpg', w: 2097, h: 1109, bg: 'women_bg.jpg', credit: TIS + ', Christ Appears to the Holy Women (1886–94)' + pd };
const KK = 'The King of Kings (1927)' + pd;

type S = { t0: number; t1: number; pic?: Pic; from?: Cam; to?: Cam; mode?: 'cover' | 'fit'; clip?: string; at?: number; vh?: number; credit?: string };
const SH: S[] = [
  { t0: 0, t1: 2.3, pic: DOREP, from: [.33, .42, 2.1], to: [.33, .4, 1.65] },
  { t0: 2.15, t1: 4.4, pic: ROADP, from: [.5, .62, 1.25], to: [.5, .55, 1.6] },
  { t0: 4.25, t1: 7.6, pic: ABIDE, from: [.27, .2, 2.4], to: [.27, .24, 1.8] },
  { t0: 7.45, t1: 9.1, clip: 'c1.mp4', at: 0, vh: 774, credit: KK },
  { t0: 8.95, t1: 12.0, pic: JER, from: [.3, .5, 1.1], to: [.6, .4, 1.35] },
  { t0: 11.85, t1: 14.4, pic: LAND, from: [.35, .5, 1.1], to: [.65, .5, 1.3] },
  { t0: 14.25, t1: 16.6, pic: ROADP, from: [.35, .55, 1.9], to: [.4, .5, 2.3] },
  { t0: 16.45, t1: 18.9, pic: DOREP, mode: 'fit', from: [.5, .5, 1.0], to: [.45, .45, 1.12] },
  { t0: 18.75, t1: 22.0, clip: 'c2.mp4', at: 0, vh: 774, credit: KK },
  { t0: 21.85, t1: 25.4, pic: DOREP, from: [.33, .35, 2.6], to: [.33, .33, 3.2] },
  { t0: 25.25, t1: 29.4, pic: ABIDE, from: [.62, .28, 2.3], to: [.66, .3, 2.8] },
  { t0: 29.25, t1: 32.0, pic: ROADP, from: [.5, .6, 1.2], to: [.55, .55, 1.45] },
  { t0: 31.85, t1: 34.6, pic: DOREP, from: [.35, .55, 1.6], to: [.3, .5, 1.3] },
  { t0: 34.45, t1: 38.2, pic: OLIVE, from: [.72, .35, 1.45], to: [.6, .4, 1.15] },
  { t0: 38.05, t1: 41.5, clip: 'c6.mp4', at: 0, vh: 814, credit: KK },
  { t0: 41.35, t1: 43.8, pic: ABIDE, from: [.27, .22, 2.2], to: [.27, .26, 2.7] },
  { t0: 43.65, t1: 47.9, pic: ROADP, mode: 'fit', from: [.5, .5, 1.0], to: [.5, .5, 1.12] },
  { t0: 47.75, t1: 52.9, pic: DOREP, from: [.5, .5, 1.0], to: [.6, .58, 1.3] },
  { t0: 52.75, t1: 55.5, pic: ABIDE, mode: 'fit', from: [.5, .5, 1.0], to: [.5, .5, 1.1] },
  { t0: 55.35, t1: 58.5, pic: ABIDE, from: [.75, .4, 1.7], to: [.62, .35, 1.4] },
  { t0: 58.35, t1: 60.0, clip: 'c3.mp4', at: 0, vh: 798, credit: KK },
  { t0: 59.85, t1: 61.6, clip: 'c4.mp4', at: 0.3, vh: 814, credit: KK },
  { t0: 61.45, t1: 64.0, pic: COMMUN, from: [.5, .5, 1.1], to: [.4, .45, 1.45] },
  { t0: 63.85, t1: 66.5, pic: VANISH, from: [.5, .55, 1.45], to: [.5, .5, 1.15] },
  { t0: 66.35, t1: 68.5, clip: 'c2.mp4', at: 1.0, vh: 774, credit: KK },
  { t0: 68.35, t1: 70.5, pic: VANISH, mode: 'fit', from: [.5, .5, 1.0], to: [.5, .5, 1.1] },
  { t0: 70.35, t1: 75.9, pic: EXPUL, from: [.45, .35, 1.25], to: [.5, .5, 1.1] },
  { t0: 75.75, t1: 78.6, pic: EXPUL, from: [.5, .78, 2.3], to: [.5, .76, 1.85] },
  { t0: 78.45, t1: 82.4, pic: VANISH, from: [.5, .6, 1.6], to: [.5, .55, 2.05] },
  { t0: 82.25, t1: 84.9, pic: ROADP, from: [.5, .5, 1.6], to: [.5, .55, 1.2] },
  { t0: 84.75, t1: 88.2, pic: JER, from: [.6, .35, 1.45], to: [.5, .4, 1.1] },
  { t0: 88.05, t1: 91.9, clip: 'c5.mp4', at: 0, vh: 700, credit: KK },
  { t0: 91.75, t1: 94.1, pic: ELEVEN, from: [.5, .4, 1.1], to: [.5, .35, 1.45] },
  { t0: 93.95, t1: 97.0, pic: DOREP, from: [.33, .38, 2.2], to: [.33, .37, 2.8] },
  { t0: 96.85, t1: 99.3, pic: ABIDE, from: [.27, .22, 2.0], to: [.27, .25, 2.5] },
  { t0: 99.15, t1: 103.4, pic: VANISH, from: [.5, .55, 1.3], to: [.5, .5, 1.0] },
  { t0: 103.25, t1: DUR + .1, pic: DOREP, mode: 'fit', from: [.5, .5, 1.0], to: [.5, .5, 1.1] },
];
const CH: [number, string][] = [[0, 'the road'], [22.0, 'eyes holden'], [41.5, 'the stranger'], [52.8, 'the bread'], [68.4, 'genesis 3'], [82.4, 'the way back']];

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
    <div style={{ position: 'absolute', left: SL + 80, top: y + 4, fontFamily: CORI, fontWeight: 600, fontSize: 27, color: 'rgba(243,231,207,.65)' }}>the road to Emmaus · Luke 24</div>
    <div style={{ position: 'absolute', left: SR - 300, top: y - 34, width: 300, textAlign: 'right', fontFamily: MONO, fontSize: 22, color: 'rgba(243,231,207,.45)' }}>{`${ci + 1}/${n}`}</div>
    <div style={{ position: 'absolute', left: SR - 300, top: y - 2 + (1 - ca) * 12, width: 300, textAlign: 'right', fontFamily: CORI, fontWeight: 600, fontSize: 32, color: G, opacity: ca }}>{CH[ci][1]}</div>
    {CH.map(([s], i) => { const en = i < n - 1 ? CH[i + 1][0] : DUR - 1; const p = clamp((t - s) / (en - s));
      return <div key={i} style={{ position: 'absolute', left: SL + i * (sw + gap), top: y + 54, width: sw, height: 5, borderRadius: 3, background: 'rgba(243,231,207,.14)' }}><div style={{ width: `${p * 100}%`, height: '100%', borderRadius: 3, background: i === 3 ? RED : G }} /></div>; })}
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


/* four verbs, lit as they are spoken */
const FV: [string, number][] = [['TOOK', 58.57], ['BLESSED', 59.2], ['BROKE', 59.78], ['GAVE', 60.7]];
const FourVerbs: React.FC<{ t: number; t0: number; t1: number }> = ({ t, t0, t1 }) => {
  const a = env(t, t0, t1, .3, .3); if (a <= 0) return null;
  const same = eout(P(t, 61.65, 62.1));
  return <div style={{ position: 'absolute', inset: 0, opacity: a }}>
    <div style={{ position: 'absolute', left: SL, top: 640, width: SR - SL, textAlign: 'center', fontFamily: CIN, fontWeight: 700, fontSize: 30, letterSpacing: 6, color: CR, textShadow: '0 2px 12px #000' }}>LUKE 24 : 30</div>
    {FV.map(([w, s], i) => { const k = eout(P(t, s - .03, s + .22));
      return <div key={i} style={{ position: 'absolute', left: SL, width: SR - SL, top: 720 + i * 120, textAlign: 'center', fontFamily: CIN, fontWeight: 700, fontSize: 92, lineHeight: 1, opacity: .15 + .85 * k, scale: String(lerp(1.3, 1, k)), ...(k > 0 ? goldText : { color: CR }) }}>{w}</div>; })}
    {same > 0 && <div style={{ position: 'absolute', left: CX, top: 1225, translate: '-50% 0', opacity: same, padding: '12px 26px', borderRadius: 40, background: 'rgba(10,8,18,.9)', border: `2.5px solid ${RED}`, fontFamily: CIN, fontWeight: 700, fontSize: 26, letterSpacing: 2, color: '#ff8a7a', whiteSpace: 'nowrap' }}>= LUKE 22 : 19 · THE LAST SUPPER</div>}
  </div>;
};

/* Genesis 3:7 (Greek OT) vs Luke 24:31 */
const Twin: React.FC<{ t: number; t0: number; t1: number }> = ({ t, t0, t1 }) => {
  const a = env(t, t0, t1, .35, .3); if (a <= 0) return null;
  const r1 = eout(P(t, 70.9, 71.4)), r2 = eout(P(t, 73.6, 74.1)), h = clamp((t - 74.0) / .5);
  const parch: React.CSSProperties = { background: 'radial-gradient(ellipse at 45% 40%, #efe0bd 0%, #d9c393 60%, #a98d5c 100%)', boxShadow: '0 24px 70px rgba(0,0,0,.85), inset 0 0 60px rgba(90,60,20,.55)', borderRadius: 8, padding: '22px 30px 26px', boxSizing: 'border-box', textAlign: 'center', position: 'absolute', left: CX - 400, width: 800 };
  const hl = (s: string) => <span style={{ background: `rgba(243,212,140,${.8 * h})`, borderRadius: 6, padding: '0 6px', boxShadow: h > 0 ? `0 0 ${22 * h}px rgba(243,212,140,${.8 * h})` : undefined }}>{s}</span>;
  const card = (top: number, r: number, ref_: string, who: string, pre: string, post: string, en: string, rot: number) => r <= 0 ? null :
    <div style={{ ...parch, top: top + (1 - r) * 30, opacity: r, rotate: `${rot}deg` }}>
      <div style={{ fontFamily: CIN, fontWeight: 700, fontSize: 26, letterSpacing: 4, color: '#6b4a22' }}>{ref_}</div>
      <div style={{ fontFamily: CORI, fontWeight: 600, fontSize: 26, color: '#6b4a22', marginBottom: 10 }}>{who}</div>
      <div style={{ fontFamily: GRK, fontSize: 40, lineHeight: 1.3, color: '#3b2a18' }}>{pre}{hl('διηνοίχθησαν οἱ ὀφθαλμοὶ')}{post}</div>
      <div style={{ fontFamily: CORI, fontWeight: 600, fontSize: 32, color: '#5a3d1c', marginTop: 6 }}>{en}</div>
    </div>;
  return <div style={{ position: 'absolute', inset: 0, opacity: a }}>
    {card(600, r1, 'GENESIS 3 : 7', 'Greek Old Testament (Septuagint)', 'καὶ ', ' τῶν δύο', '“and the eyes of them both were opened”', -1.2)}
    {card(960, r2, 'LUKE 24 : 31', 'Gospel of Luke, Greek', 'αὐτῶν δὲ ', '', '“and their eyes were opened”', 1.2)}
  </div>;
};

const HITS: [number, number, number][] = [[0.25, 12, 6], [6.0, 14, 5], [15.58, 10, 6], [21.35, 14, 5], [26.14, 14, 5], [40.63, 10, 6], [41.62, 16, 5], [51.93, 12, 6], [58.57, 8, 7], [59.2, 8, 7], [59.78, 8, 7], [60.7, 8, 7], [64.76, 16, 4], [66.7, 14, 5], [75.13, 10, 6], [77.96, 12, 6], [81.75, 10, 6], [93.46, 10, 6], [97.18, 16, 5], [102.13, 12, 6]];
const shotAt = (t: number) => { let s: S = SH[0]; for (const x of SH) if (t >= x.t0 + .15) s = x; return s; };

export const StoryVideo: React.FC = () => {
  const t = useCurrentFrame() / FPS;
  let sx = 0, sy = 0; for (const [h, amp, dec] of HITS) { const [x, y] = shake(t, h, amp, dec); sx += x; sy += y; }
  const cur = shotAt(t);
  const flash = Math.max(env(t, 6.0, 6.4, .04, .35) * .3, env(t, 64.7, 65.2, .04, .45) * .8, env(t, 66.65, 67.1, .04, .45) * .5, env(t, 102.1, 102.5, .04, .35) * .4);
  return <AbsoluteFill style={{ backgroundColor: '#040409', overflow: 'hidden' }}>
    <div style={{ position: 'absolute', inset: 0, translate: `${sx}px ${sy}px`, scale: '1.03' }}>
      {SH.map((s, i) => s.clip ? <Clip key={i} t={t} t0={s.t0} t1={s.t1} clip={s.clip} at={s.at} vw={1080} vh={s.vh!} mode="band" />
        : <Shot key={i} t={t} t0={s.t0} t1={s.t1} pic={s.pic!} from={s.from!} to={s.to} mode={s.mode} />)}
    </div>
    <PhotoShade />
    {/* cold wash for 'eyes holden' and the dark walk back; warm for evening and the reveal */}
    <AbsoluteFill style={{ background: 'radial-gradient(ellipse at 50% 55%, rgba(20,30,60,0) 30%, rgba(20,30,60,.55) 100%)', opacity: Math.max(env(t, 22.0, 29.3, .5, .6), env(t, 84.8, 88.2, .4, .5)) }} />
    <AbsoluteFill style={{ background: 'radial-gradient(ellipse at 50% 40%, rgba(255,190,120,.3) 0%, rgba(255,190,120,0) 70%)', opacity: Math.max(env(t, 55.4, 61.6, .5, .5), env(t, 64.7, 68.4, .3, .6), env(t, 82.3, 84.8, .4, .4), env(t, 99.2, 103.4, .4, .4)) }} />
    {/* dim for panels */}
    <AbsoluteFill style={{ background: 'rgba(4,4,9,.62)', opacity: Math.max(env(t, 58.4, 63.8, .3, .3), env(t, 70.45, 75.85, .3, .3), env(t, 88.2, 93.9, .3, .3)) }} />
    <AbsoluteFill style={{ background: '#FFF6E0', opacity: flash * .7 }} />
    <Credit s={t < DUR - 5.3 ? (cur.credit ?? cur.pic?.credit) : undefined} a={1} />

    {/* ---- the road ---- */}
    <Title t={t} t0={0.3} t1={2.1} y={980} lines={['TWO DISCIPLES', 'WALKED WITH JESUS']} size={62} style={['c', 'g']} from="slam" />
    <Counter t={t} t0={2.2} t1={4.6} n={7} y={930} label="MILES · TALKING ABOUT HIM" />
    <Title t={t} t0={5.9} t1={7.5} y={1010} lines={['NO IDEA']} size={130} style={['r']} from="slam" />
    <Sub s="who he was" y={1170} a={env(t, 6.3, 7.5, .2, .2)} size={52} />
    <Chip s="LUKE 24 : 13–35" y={1110} a={env(t, 7.65, 9.0, .2, .2)} />
    <Title t={t} t0={9.15} t1={11.9} y={1000} lines={['SUNDAY']} size={120} from="slam" />
    <Sub s="the third day after the crucifixion" y={1150} a={env(t, 9.6, 11.9, .2, .2)} size={44} />
    <Title t={t} t0={12.15} t1={14.3} y={1000} lines={['EMMAUS']} size={124} from="slam" />
    <Chip s="“THREESCORE FURLONGS” · ≈ 7 MILES" y={1150} a={env(t, 13.0, 14.3, .2, .2)} size={26} />
    <Sub s="one of them is named" y={1060} a={env(t, 14.45, 15.5, .15, .15)} size={52} color={CR} />
    <Title t={t} t0={15.58} t1={16.5} y={1020} lines={['CLEOPAS']} size={120} from="slam" />
    <Sub s="a stranger falls into step" y={1150} a={env(t, 16.65, 18.8, .2, .2)} size={52} color={CR} />
    <Sub s="Luke tells us exactly who it is" y={1060} a={env(t, 18.95, 21.2, .2, .2)} size={48} color={CR} />
    <Title t={t} t0={21.35} t1={22.0} y={1010} lines={['JESUS HIMSELF']} size={96} from="slam" />
    {/* ---- eyes holden ---- */}
    <Title t={t} t0={22.1} t1={25.3} y={960} lines={['“THEIR EYES', 'WERE HOLDEN”']} size={92} style={['c', 'g']} from="up" />
    <Chip s="LUKE 24 : 16" y={1200} a={env(t, 22.6, 25.3, .2, .2)} />
    <Stamp s="HELD SHUT" y={1000} t={t} t0={26.14} t1={27.0} color={RED} size={92} rot={-4} />
    <Sub s="not a disguise" y={1040} a={env(t, 27.0, 28.0, .15, .15)} size={60} color={CR} />
    <Sub s="something kept them from seeing" y={1040} a={env(t, 28.05, 29.3, .15, .2)} size={50} color={GL} />
    <Title t={t} t0={29.5} t1={32.0} y={940} lines={['“ART THOU ONLY', 'A STRANGER IN', 'JERUSALEM?”']} size={70} style={['c', 'c', 'g']} from="up" />
    <Chip s="LUKE 24 : 18" y={1210} a={env(t, 30.0, 32.0, .2, .2)} />
    <Title t={t} t0={32.15} t1={34.6} y={1000} lines={['THEY TELL JESUS', 'THE STORY OF JESUS']} size={66} style={['c', 'g']} from="up" />
    <Title t={t} t0={34.75} t1={38.0} y={920} lines={['“WE TRUSTED THAT', 'IT HAD BEEN HE', 'WHICH SHOULD HAVE', 'REDEEMED ISRAEL”']} size={62} style={['c', 'c', 'g', 'g']} from="up" />
    <Chip s="LUKE 24 : 21" y={1230} a={env(t, 35.3, 38.0, .2, .2)} />
    <Stamp s="PAST TENSE" y={1000} t={t} t0={38.9} t1={40.4} color={RED} size={84} rot={-4} />
    <Title t={t} t0={40.63} t1={41.5} y={1000} lines={['HOPE DIED', 'ON FRIDAY']} size={84} style={['c', 'r']} from="slam" />
    {/* ---- the stranger ---- */}
    <Title t={t} t0={41.62} t1={43.7} y={960} lines={['“O FOOLS, AND', 'SLOW OF HEART', 'TO BELIEVE”']} size={74} style={['c', 'g', 'g']} from="slam" />
    <Chip s="LUKE 24 : 25" y={1230} a={env(t, 42.0, 43.7, .2, .2)} />
    <Title t={t} t0={43.85} t1={47.8} y={960} lines={['MOSES', '& ALL', 'THE PROPHETS']} size={84} style={['g', 'c', 'g']} from="up" />
    <Chip s="LUKE 24 : 27" y={1260} a={env(t, 44.5, 47.8, .2, .2)} />
    <Title t={t} t0={47.95} t1={51.8} y={970} lines={['THE GREATEST', 'BIBLE STUDY', 'EVER GIVEN']} size={80} style={['c', 'g', 'g']} from="up" />
    <Stamp s="0 VERSES RECORDED" y={1030} t={t} t0={51.93} t1={52.8} color={RED} size={60} rot={-4} />
    <Sub s="“he made as though he would have gone further”" y={1100} a={env(t, 52.95, 55.3, .2, .2)} size={40} />
    <Chip s="LUKE 24 : 28" y={1180} a={env(t, 53.4, 55.3, .2, .2)} />
    <Title t={t} t0={55.5} t1={58.3} y={980} lines={['“ABIDE WITH US”']} size={88} from="slam" />
    <Sub s="for it is toward evening" y={1120} a={env(t, 56.8, 58.3, .2, .2)} size={52} color={GL} />
    {/* ---- the bread ---- */}
    <FourVerbs t={t} t0={58.45} t1={63.75} />
    <Title t={t} t0={64.76} t1={66.6} y={940} lines={['“THEIR EYES', 'WERE OPENED,', 'AND THEY KNEW HIM”']} size={62} style={['c', 'g', 'g']} from="slam" />
    <Chip s="LUKE 24 : 31" y={1210} a={env(t, 65.2, 66.6, .2, .2)} />
    <Title t={t} t0={66.7} t1={68.3} y={1010} lines={['VANISHED']} size={124} style={['c']} from="slam" />
    <Sub s="out of their sight" y={1160} a={env(t, 67.3, 68.3, .15, .2)} size={52} color={GL} />
    {/* ---- genesis 3 ---- */}
    <Title t={t} t0={68.45} t1={70.4} y={1000} lines={['THE DETAIL', 'MOST PEOPLE MISS']} size={70} style={['c', 'g']} from="up" />
    <Twin t={t} t0={70.45} t1={75.85} />
    <Title t={t} t0={76.1} t1={78.5} y={1000} lines={['ADAM & EVE']} size={110} style={['c']} from="slam" />
    <Sub s="eyes opened to shame" y={1150} a={env(t, 77.96, 78.5, .1, .15)} size={54} color="#ff8a7a" />
    <Title t={t} t0={78.7} t1={81.6} y={1000} lines={['ANOTHER MEAL']} size={96} style={['c']} from="up" />
    <Sub s="eyes opened again — to see him" y={1140} a={env(t, 80.0, 82.3, .2, .2)} size={50} color={GL} />
    <Title t={t} t0={81.75} t1={82.35} y={1000} lines={['TO SEE HIM']} size={110} from="slam" />
    {/* ---- the way back ---- */}
    <Title t={t} t0={82.5} t1={84.8} y={950} lines={['“DID NOT OUR', 'HEART BURN', 'WITHIN US?”']} size={76} style={['c', 'g', 'g']} from="up" />
    <Chip s="LUKE 24 : 32" y={1230} a={env(t, 83.0, 84.8, .2, .2)} />
    <Title t={t} t0={84.95} t1={88.1} y={980} lines={['THAT SAME HOUR']} size={84} style={['c']} from="up" />
    <Sub s="seven miles back, in the dark" y={1110} a={env(t, 85.8, 88.1, .2, .2)} size={50} color={GL} />
    <Chip s="LUKE 24 : 33" y={1190} a={env(t, 86.4, 88.1, .2, .2)} />
    <Parch t={t} t0={88.3} t1={93.85} y={700} ref_="HEGESIPPUS · c. 170 AD" who="quoted by Eusebius, Church History 3.11" lines={['Clopas was', 'the brother of Joseph.']} hi={93.4} size={54} />
    <Sub s="if that is him…" y={1070} a={env(t, 94.1, 97.0, .2, .2)} size={52} color={CR} />
    <Title t={t} t0={97.18} t1={99.2} y={980} lines={['HIS OWN UNCLE']} size={96} from="slam" />
    <Stamp s="UNRECOGNIZED" y={1140} t={t} t0={98.0} t1={99.2} color={RED} size={60} rot={-3} />
    <Title t={t} t0={99.35} t1={103.3} y={950} lines={['THEY KNEW HIM', 'IN THE BREAKING', 'OF BREAD']} size={76} style={['c', 'g', 'g']} from="up" />
    <Chip s="LUKE 24 : 35" y={1230} a={env(t, 100.0, 103.3, .2, .2)} />
    {/* ---- follow ---- */}
    <AbsoluteFill style={{ background: 'rgba(4,4,9,.72)', opacity: env(t, 103.35, DUR + 1, .4, .1) }} />
    <div style={{ ...abs(CX - 70, 640), width: 140, height: 140, opacity: env(t, 103.45, DUR + 1, .4, .1), borderRadius: '50%', boxShadow: '0 0 0 3px rgba(212,175,106,.8), 0 0 60px rgba(212,175,106,.4)' }}><Logo size={140} /></div>
    <Sub s="@lostscripturesbooks" y={800} a={env(t, 103.6, DUR + 1, .4, .1)} size={40} color={GL} />
    <Title t={t} t0={103.4} t1={DUR + 1} y={880} lines={['FOLLOW']} size={140} from="slam" />
    <Sub s="for more stories from the Bible" y={1060} a={eout(P(t, 103.9, 104.4))} size={50} />
    <Sub s="that most people never hear" y={1125} a={eout(P(t, 105.6, 106.1))} size={50} color={GL} />

    <AbsoluteFill style={{ background: 'radial-gradient(ellipse at 50% 46%, rgba(0,0,0,0) 58%, rgba(0,0,0,.5) 100%)' }} />
    <Hud t={t} /><Captions t={t} />
    <AbsoluteFill style={{ backgroundColor: '#000', opacity: Math.max(1 - P(t, 0, .2), P(t, DUR - .6, DUR)) }} />
  </AbsoluteFill>;
};

/* TikTok cover: grid crops the centre 3:4 (y ≈ 240–1680) — all text inside y 280–1640 */
export const StoryCover: React.FC = () => <AbsoluteFill style={{ backgroundColor: '#040409', overflow: 'hidden' }}>
  <Shot t={1} t0={0} t1={2} pic={DOREP} mode="fit" y={1000} from={[.36, .42, 1.55]} fi={0} fo={0} />
  <AbsoluteFill style={{ background: 'linear-gradient(180deg, rgba(4,4,9,.96) 14%, rgba(4,4,9,.75) 31%, rgba(4,4,9,0) 44%, rgba(4,4,9,0) 62%, rgba(4,4,9,.9) 77%, rgba(4,4,9,.97) 90%)' }} />
  <div style={{ ...abs(CX - 34, 300), width: 68, height: 68 }}><Logo size={68} /></div>
  <div style={{ ...abs(90, 390, 900), textAlign: 'center', fontFamily: CIN, fontWeight: 700, fontSize: 40, letterSpacing: 7, color: CR, opacity: .9 }}>THEY WALKED</div>
  <div style={{ ...abs(90, 450, 900), textAlign: 'center', ...goldText, fontFamily: CIN, fontWeight: 700, fontSize: 104, lineHeight: 1.05, whiteSpace: 'nowrap' }}>7 MILES<br />WITH JESUS</div>
  <div style={{ ...abs(90, 1330, 900), textAlign: 'center', fontFamily: CIN, fontWeight: 700, fontSize: 62, lineHeight: 1.1, color: '#ff6a5a', textShadow: '0 0 30px rgba(220,40,30,.6), 0 4px 10px rgba(0,0,0,.9)' }}>AND DIDN’T<br />KNOW HIM. WHY?</div>
  <div style={{ ...abs(90, 1530, 900), textAlign: 'center', fontFamily: CORI, fontWeight: 600, fontSize: 40, color: 'rgba(243,231,207,.75)' }}>Luke 24 · the road to Emmaus</div>
  <AbsoluteFill style={{ background: 'radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0) 60%, rgba(0,0,0,.55) 100%)' }} />
</AbsoluteFill>;
