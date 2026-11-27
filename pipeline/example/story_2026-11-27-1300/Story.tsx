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
export const DUR = 109.0;
const SANS = 'Inter, sans-serif';
const GRK = '"DejaVu Serif", serif';
const TIS = 'James Tissot', DORE_ = 'Gustave Doré';
const DORE: Pic = { src: 'dore.jpg', w: 2080, h: 2600, bg: 'dore_bg.jpg', credit: DORE_ + ', Jesus Drives the Merchants from the Temple (1866)' + pd };
const SCHN: Pic = { src: 'schn.jpg', w: 2600, h: 2126, bg: 'schn_bg.jpg', credit: 'Julius Schnorr von Carolsfeld, Jesus Cleanses the Temple, John 2 (1860)' + pd };
const TSELL: Pic = { src: 'tsell.jpg', w: 2600, h: 1593, bg: 'tsell_bg.jpg', credit: TIS + ', Christ Driving Out Them That Sold in the Temple (1886–94)' + pd };
const PORCH: Pic = { src: 'porch.jpg', w: 2524, h: 1775, bg: 'porch_bg.jpg', credit: TIS + ', Jesus Walking in Solomon’s Porch (1886–94)' + pd };
const WITN: Pic = { src: 'witn.jpg', w: 2600, h: 1311, bg: 'witn_bg.jpg', credit: TIS + ', The False Witnesses before Caiaphas (1886–94)' + pd };
const JER: Pic = { src: 'jer.jpg', w: 2600, h: 1117, bg: 'jer_bg.jpg', credit: 'David Roberts, Jerusalem from the Mount of Olives (1841)' + pd };
const SCFA: Pic = { src: 'scfa.jpg', w: 1782, h: 2600, bg: 'scfa_bg.jpg', credit: TIS + ', The Scourging on the Front (1886–94)' + pd };
const SCBA: Pic = { src: 'scba.jpg', w: 1600, h: 2600, bg: 'scba_bg.jpg', credit: TIS + ', The Scourging on the Back (1886–94)' + pd };
const PHAR: Pic = { src: 'phar.jpg', w: 1695, h: 2600, bg: 'phar_bg.jpg', credit: TIS + ', The Pharisee and the Publican (1886–94)' + pd };
const PRES: Pic = { src: 'pres.jpg', w: 1144, h: 1789, bg: 'pres_bg.jpg', credit: TIS + ', The Presentation of Jesus in the Temple (1886–94)' + pd };
const CRUC: Pic = { src: 'cruc.jpg', w: 2059, h: 2511, bg: 'cruc_bg.jpg', credit: DORE_ + ', The Crucifixion (1866)' + pd };
const RISEN: Pic = { src: 'risen.jpg', w: 1850, h: 2600, bg: 'risen_bg.jpg', credit: TIS + ', Christ Appearing to Saint Peter (1886–94)' + pd };
const KK = 'The King of Kings (1927)' + pd;

type S = { t0: number; t1: number; pic?: Pic; from?: Cam; to?: Cam; mode?: 'cover' | 'fit'; clip?: string; at?: number; vh?: number; credit?: string };
const SH: S[] = [
  { t0: 0, t1: 2.9, pic: DORE, from: [.5, .2, 2.3], to: [.5, .22, 1.75] },
  { t0: 2.75, t1: 5.3, clip: 'c6.mp4', at: 0, vh: 814, credit: KK },
  { t0: 5.15, t1: 8.0, clip: 'c1.mp4', at: 0.4, vh: 814, credit: KK },
  { t0: 7.85, t1: 10.4, pic: TSELL, from: [.3, .6, 1.3], to: [.42, .55, 1.6] },
  { t0: 10.25, t1: 12.6, clip: 'c3.mp4', at: 0.55, vh: 814, credit: KK },
  { t0: 12.45, t1: 15.9, pic: PORCH, from: [.3, .5, 1.1], to: [.5, .5, 1.3] },
  { t0: 15.75, t1: 19.5, pic: SCHN, from: [.72, .3, 2.3], to: [.68, .35, 1.8] },
  { t0: 19.35, t1: 22.6, clip: 'c4.mp4', at: 0, vh: 814, credit: KK },
  { t0: 22.45, t1: 25.4, pic: SCHN, from: [.3, .6, 2.6], to: [.3, .55, 2.0] },
  { t0: 25.25, t1: 28.4, pic: DORE, from: [.5, .22, 2.9], to: [.5, .25, 2.2] },
  { t0: 28.25, t1: 31.7, clip: 'c5.mp4', at: 1.0, vh: 814, credit: KK },
  { t0: 31.55, t1: 35.2, clip: 'c6.mp4', at: 0.8, vh: 814, credit: KK },
  { t0: 35.05, t1: 37.9, pic: TSELL, from: [.78, .5, 2.0], to: [.72, .5, 1.6] },
  { t0: 37.75, t1: 42.0, pic: PRES, from: [.45, .55, 1.15], to: [.35, .6, 1.45] },
  { t0: 41.85, t1: 43.65, clip: 'c7.mp4', at: 0, vh: 814, credit: KK },
  { t0: 43.5, t1: 46.0, pic: SCHN, from: [.6, .12, 2.4], to: [.62, .15, 2.0] },
  { t0: 45.85, t1: 49.6, pic: DORE, mode: 'fit', from: [.5, .5, 1.0], to: [.5, .5, 1.1] },
  { t0: 49.45, t1: 52.4, clip: 'c9.mp4', at: 1.05, vh: 814, credit: KK },
  { t0: 52.25, t1: 56.6, pic: JER, from: [.78, .3, 1.7], to: [.72, .35, 1.3] },
  { t0: 56.45, t1: 60.0, clip: 'c1.mp4', at: 0, vh: 814, credit: KK },
  { t0: 59.85, t1: 63.2, pic: PORCH, from: [.2, .45, 1.8], to: [.3, .45, 2.1] },
  { t0: 63.05, t1: 66.4, pic: PHAR, from: [.5, .4, 1.15], to: [.5, .35, 1.4] },
  { t0: 66.25, t1: 68.8, clip: 'c4.mp4', at: 0.5, vh: 814, credit: KK },
  { t0: 68.65, t1: 72.2, pic: SCHN, mode: 'fit', from: [.5, .5, 1.0], to: [.5, .5, 1.1] },
  { t0: 72.05, t1: 76.6, pic: DORE, from: [.5, .2, 3.2], to: [.5, .22, 2.6] },
  { t0: 76.45, t1: 79.0, pic: SCFA, mode: 'fit', from: [.5, .5, 1.0], to: [.5, .5, 1.12] },
  { t0: 78.85, t1: 81.8, pic: SCBA, from: [.5, .38, 1.5], to: [.5, .32, 1.25] },
  { t0: 81.65, t1: 84.8, pic: SCFA, from: [.5, .4, 1.3], to: [.5, .45, 1.1] },
  { t0: 84.65, t1: 88.6, pic: WITN, from: [.3, .5, 1.3], to: [.5, .5, 1.1] },
  { t0: 88.45, t1: 92.4, pic: CRUC, from: [.55, .3, 1.7], to: [.55, .35, 1.3] },
  { t0: 92.25, t1: 96.0, pic: JER, from: [.6, .4, 1.3], to: [.75, .3, 1.75] },
  { t0: 95.85, t1: 99.0, pic: SCHN, from: [.3, .55, 1.7], to: [.3, .58, 2.3] },
  { t0: 98.85, t1: 101.9, pic: SCBA, mode: 'fit', from: [.5, .5, 1.0], to: [.5, .5, 1.1] },
  { t0: 101.75, t1: 103.8, pic: RISEN, from: [.25, .35, 1.9], to: [.25, .35, 1.5] },
  { t0: 103.65, t1: DUR + .1, pic: RISEN, mode: 'fit', from: [.5, .5, 1.0], to: [.5, .5, 1.1] },
];
const CH: [number, string][] = [[0, 'the market'], [23.4, 'the whip'], [35.2, 'the doves'], [49.6, 'the sign'], [68.8, 'the word'], [92.4, 'three days']];

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
    <div style={{ position: 'absolute', left: SL + 80, top: y + 4, fontFamily: CORI, fontWeight: 600, fontSize: 27, color: 'rgba(243,231,207,.65)' }}>the whip in the Temple · John 2</div>
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

/* the Greek word, big */
const WordPanel: React.FC<{ t: number; t0: number; t1: number }> = ({ t, t0, t1 }) => {
  const a = env(t, t0, t1, .3, .3); if (a <= 0) return null;
  const w = eout(P(t, 72.1, 72.5)), la = eout(P(t, 76.7, 77.1));
  return <div style={{ position: 'absolute', inset: 0, opacity: a }}>
    <div style={{ position: 'absolute', left: SL, top: 640, width: SR - SL, textAlign: 'center', fontFamily: CIN, fontWeight: 700, fontSize: 30, letterSpacing: 6, color: CR, textShadow: '0 2px 12px #000' }}>JOHN 2 : 15 · THE WHIP</div>
    <div style={{ position: 'absolute', left: SL - 40, top: 720, width: SR - SL + 80, textAlign: 'center', fontFamily: GRK, fontSize: 112, lineHeight: 1.1, opacity: w, scale: String(lerp(1.4, 1, w)), ...goldText }}>φραγέλλιον</div>
    <div style={{ position: 'absolute', left: SL, top: 870, width: SR - SL, textAlign: 'center', fontFamily: CORI, fontWeight: 600, fontSize: 44, color: CR, opacity: w, textShadow: '0 2px 12px #000' }}>phragellion</div>
    {la > 0 && <div style={{ position: 'absolute', left: SL, top: 1120, width: SR - SL, textAlign: 'center', opacity: la }}>
      <div style={{ fontFamily: CORI, fontWeight: 600, fontSize: 40, color: CR, textShadow: '0 2px 12px #000' }}>from the Latin</div>
      <div style={{ fontFamily: CIN, fontWeight: 700, fontSize: 84, color: '#ff6a5a', textShadow: '0 0 30px rgba(220,40,30,.6), 0 4px 10px rgba(0,0,0,.9)', scale: String(lerp(1.3, 1, la)) }}>FLAGELLUM</div>
    </div>}
  </div>;
};

/* John 2:15 vs Mark 15:15 */
const Twin: React.FC<{ t: number; t0: number; t1: number }> = ({ t, t0, t1 }) => {
  const a = env(t, t0, t1, .35, .3); if (a <= 0) return null;
  const r1 = eout(P(t, 81.8, 82.3)), r2 = eout(P(t, 82.4, 82.9)), h = clamp((t - 83.6) / .4);
  const parch: React.CSSProperties = { background: 'radial-gradient(ellipse at 45% 40%, #efe0bd 0%, #d9c393 60%, #a98d5c 100%)', boxShadow: '0 24px 70px rgba(0,0,0,.85), inset 0 0 60px rgba(90,60,20,.55)', borderRadius: 8, padding: '22px 30px 26px', boxSizing: 'border-box', textAlign: 'center', position: 'absolute', left: CX - 400, width: 800 };
  const hl = (s: string) => <span style={{ background: `rgba(243,212,140,${.8 * h})`, borderRadius: 6, padding: '0 6px', boxShadow: h > 0 ? `0 0 ${22 * h}px rgba(243,212,140,${.8 * h})` : undefined }}>{s}</span>;
  const card = (top: number, r: number, ref_: string, who: string, pre: string, key: string, post: string, en: string, rot: number) => r <= 0 ? null :
    <div style={{ ...parch, top: top + (1 - r) * 30, opacity: r, rotate: `${rot}deg` }}>
      <div style={{ fontFamily: CIN, fontWeight: 700, fontSize: 26, letterSpacing: 4, color: '#6b4a22' }}>{ref_}</div>
      <div style={{ fontFamily: CORI, fontWeight: 600, fontSize: 26, color: '#6b4a22', marginBottom: 10 }}>{who}</div>
      <div style={{ fontFamily: GRK, fontSize: 42, lineHeight: 1.3, color: '#3b2a18' }}>{pre}{hl(key)}{post}</div>
      <div style={{ fontFamily: CORI, fontWeight: 600, fontSize: 32, color: '#5a3d1c', marginTop: 6 }}>{en}</div>
    </div>;
  return <div style={{ position: 'absolute', inset: 0, opacity: a }}>
    {card(600, r1, 'JOHN 2 : 15', 'Jesus in the Temple', 'ποιήσας ', 'φραγέλλιον', '', '“when he had made a scourge”', -1.2)}
    {card(960, r2, 'MARK 15 : 15', 'Pilate, three years later', 'τὸν Ἰησοῦν ', 'φραγελλώσας', '', '“when he had scourged Jesus”', 1.2)}
  </div>;
};

const HITS: [number, number, number][] = [[1.17, 14, 6], [3.17, 12, 6], [19.46, 8, 7], [23.72, 14, 5], [28.56, 16, 5], [30.25, 8, 7], [33.75, 16, 5], [42.43, 10, 6], [46.13, 10, 6], [53.43, 16, 5], [67.99, 12, 6], [72.17, 12, 6], [78.15, 12, 6], [81.05, 16, 5], [83.7, 10, 6], [90.95, 10, 6], [93.7, 14, 5], [99.04, 16, 5], [102.03, 12, 6]];
const shotAt = (t: number) => { let s: S = SH[0]; for (const x of SH) if (t >= x.t0 + .15) s = x; return s; };

export const StoryVideo: React.FC = () => {
  const t = useCurrentFrame() / FPS;
  let sx = 0, sy = 0; for (const [h, amp, dec] of HITS) { const [x, y] = shake(t, h, amp, dec); sx += x; sy += y; }
  const cur = shotAt(t);
  const flash = Math.max(env(t, 1.12, 1.45, .03, .3) * .5, env(t, 23.66, 24.0, .03, .3) * .4, env(t, 28.5, 28.85, .03, .3) * .45, env(t, 53.4, 53.8, .03, .4) * .4, env(t, 81.0, 81.35, .03, .3) * .5, env(t, 99.0, 99.4, .03, .35) * .55, env(t, 102.0, 102.6, .04, .5) * .7);
  return <AbsoluteFill style={{ backgroundColor: '#040409', overflow: 'hidden' }}>
    <div style={{ position: 'absolute', inset: 0, translate: `${sx}px ${sy}px`, scale: '1.03' }}>
      {SH.map((s, i) => s.clip ? <Clip key={i} t={t} t0={s.t0} t1={s.t1} clip={s.clip} at={s.at} vw={1080} vh={s.vh!} mode="band" />
        : <Shot key={i} t={t} t0={s.t0} t1={s.t1} pic={s.pic!} from={s.from!} to={s.to} mode={s.mode} />)}
    </div>
    <PhotoShade />
    {/* cold for the trial and scourging; fire for AD 70; warm for the third day */}
    <AbsoluteFill style={{ background: 'radial-gradient(ellipse at 50% 55%, rgba(20,30,60,0) 30%, rgba(20,30,60,.55) 100%)', opacity: Math.max(env(t, 76.4, 92.3, .5, .6), env(t, 98.9, 101.8, .3, .4)) }} />
    <AbsoluteFill style={{ background: 'radial-gradient(ellipse at 60% 40%, rgba(255,90,30,.42) 0%, rgba(160,30,10,.25) 55%, rgba(60,10,5,.5) 100%)', opacity: env(t, 92.3, 96.0, .6, .5) }} />
    <AbsoluteFill style={{ background: 'radial-gradient(ellipse at 50% 40%, rgba(255,210,150,.32) 0%, rgba(255,190,120,0) 70%)', opacity: Math.max(env(t, 37.0, 42.0, .5, .5), env(t, 101.8, 103.8, .3, .5)) }} />
    {/* dim for panels */}
    <AbsoluteFill style={{ background: 'rgba(4,4,9,.64)', opacity: Math.max(env(t, 60.0, 63.15, .3, .3), env(t, 70.7, 78.0, .3, .3), env(t, 81.7, 84.75, .3, .3)) }} />
    <AbsoluteFill style={{ background: '#FFF6E0', opacity: flash * .7 }} />
    <Credit s={t < DUR - 5.3 ? (cur.credit ?? cur.pic?.credit) : undefined} a={1} />

    {/* ---- the market ---- */}
    <Title t={t} t0={0.25} t1={2.75} y={960} lines={['JESUS MADE', 'A WHIP']} size={104} style={['c', 'g']} from="slam" />
    <Sub s="with his own hands" y={1200} a={env(t, 1.8, 2.75, .15, .2)} size={52} color={GL} />
    <Title t={t} t0={3.17} t1={5.1} y={1000} lines={['AND DROVE', 'THEM OUT']} size={96} style={['c', 'r']} from="slam" />
    <Chip s="JOHN 2 : 13–22" y={1080} a={env(t, 5.25, 6.3, .2, .2)} />
    <Title t={t} t0={6.4} t1={8.0} y={980} lines={['PASSOVER']} size={116} from="slam" />
    <Sub s="Jerusalem · the Temple courts" y={1130} a={env(t, 7.0, 9.2, .2, .2)} size={46} />
    <Chip s="OXEN · SHEEP · DOVES" y={1060} a={env(t, 9.4, 12.4, .2, .2)} size={32} />
    <Sub s="and the money changers" y={1160} a={env(t, 11.75, 13.5, .2, .2)} size={52} color={GL} />
    <Title t={t} t0={13.6} t1={15.9} y={990} lines={['THE TEMPLE TAX']} size={84} style={['c']} from="up" />
    <Title t={t} t0={15.0} t1={17.5} y={1150} lines={['ONE COIN']} size={84} from="slam" />
    <Chip s="THE SILVER SHEKEL OF TYRE" y={1060} a={env(t, 16.1, 18.2, .2, .2)} size={28} />
    <Stamp s="FOR A FEE" y={1040} t={t} t0={19.46} t1={20.3} color={RED} size={92} rot={-4} />
    <Sub s="no other gospel describes this" y={1080} a={env(t, 21.3, 23.4, .2, .2)} size={46} color={CR} />
    {/* ---- the whip ---- */}
    <Title t={t} t0={23.7} t1={25.4} y={960} lines={['“A SCOURGE', 'OF SMALL CORDS”']} size={78} style={['g', 'g']} from="slam" />
    <Chip s="JOHN 2 : 15" y={1190} a={env(t, 24.1, 25.4, .2, .2)} />
    <Sub s="not a stick he grabbed" y={1080} a={env(t, 25.5, 26.6, .15, .15)} size={54} color={CR} />
    <Title t={t} t0={26.7} t1={28.3} y={1000} lines={['CORD BY CORD']} size={96} from="slam" />
    <Title t={t} t0={28.56} t1={31.6} y={940} lines={['HE DROVE', 'THEM ALL OUT']} size={92} style={['c', 'g']} from="slam" />
    <Sub s="the sheep, and the oxen" y={1170} a={env(t, 30.2, 31.6, .15, .2)} size={50} color={GL} />
    <Title t={t} t0={31.87} t1={33.7} y={980} lines={['POURED OUT', 'THE MONEY']} size={88} style={['g', 'c']} from="slam" />
    <Stamp s="TABLES OVERTURNED" y={1040} t={t} t0={33.75} t1={35.1} color={RED} size={60} rot={-4} />
    {/* ---- the doves ---- */}
    <Sub s="but watch what he does with the doves" y={1080} a={env(t, 35.25, 36.95, .2, .2)} size={44} color={CR} />
    <Title t={t} t0={37.05} t1={39.15} y={980} lines={['DOVES']} size={124} from="slam" />
    <Sub s="the sacrifice of the poor" y={1140} a={env(t, 37.5, 39.15, .2, .2)} size={50} color={GL} />
    <Chip s="LEVITICUS 12 : 8" y={1215} a={env(t, 37.9, 39.15, .2, .2)} />
    <Title t={t} t0={39.25} t1={42.0} y={960} lines={['MARY HERSELF', 'OFFERED TWO']} size={80} style={['c', 'g']} from="up" />
    <Chip s="LUKE 2 : 24" y={1180} a={env(t, 39.9, 42.0, .2, .2)} />
    <Title t={t} t0={42.15} t1={43.8} y={980} lines={['HE DOESN’T', 'SMASH THE CAGES']} size={74} style={['c', 'g']} from="slam" />
    <Title t={t} t0={43.95} t1={46.0} y={990} lines={['“TAKE THESE', 'THINGS HENCE”']} size={84} style={['c', 'g']} from="up" />
    <Title t={t} t0={46.13} t1={49.5} y={920} lines={['“MAKE NOT', 'MY FATHER’S HOUSE', 'AN HOUSE OF', 'MERCHANDISE”']} size={66} style={['c', 'g', 'c', 'g']} from="slam" />
    <Chip s="JOHN 2 : 16" y={1240} a={env(t, 46.6, 49.5, .2, .2)} />
    {/* ---- the sign ---- */}
    <Sub s="the leaders demand a sign" y={1080} a={env(t, 49.7, 51.2, .2, .2)} size={50} color={CR} />
    <Title t={t} t0={51.25} t1={53.3} y={990} lines={['“BY WHAT', 'AUTHORITY?”']} size={92} style={['c', 'g']} from="slam" />
    <Title t={t} t0={53.43} t1={54.75} y={1000} lines={['“DESTROY', 'THIS TEMPLE”']} size={100} style={['r', 'r']} from="slam" />
    <Title t={t} t0={54.8} t1={56.6} y={960} lines={['“…IN THREE DAYS', 'I WILL RAISE IT UP”']} size={70} style={['g', 'g']} from="up" />
    <Chip s="JOHN 2 : 19" y={1150} a={env(t, 55.2, 56.6, .2, .2)} />
    <Counter t={t} t0={56.76} t1={60.0} n={46} y={930} label="YEARS IN BUILDING" />
    <Chip s="JOHN 2 : 20" y={1200} a={env(t, 57.4, 60.0, .2, .2)} />
    <Parch t={t} t0={60.05} t1={63.15} y={700} ref_="JOSEPHUS · c. AD 93" who="Antiquities of the Jews 15.380" lines={['Herod began to rebuild', 'the Temple in the', 'eighteenth year of his reign']} hi={61.6} size={50} />
    <Title t={t} t0={63.29} t1={66.4} y={960} lines={['≈ 20 BC + 46', '= AD 27']} size={88} style={['c', 'g']} from="up" />
    <Sub s="right where John sets the scene" y={1190} a={env(t, 64.7, 66.4, .2, .2)} size={46} color={GL} />
    <Title t={t} t0={66.55} t1={68.75} y={960} lines={['“THE TEMPLE', 'OF HIS BODY”']} size={92} style={['c', 'g']} from="slam" />
    <Chip s="JOHN 2 : 21" y={1190} a={env(t, 67.1, 68.75, .2, .2)} />
    {/* ---- the word ---- */}
    <Title t={t} t0={68.85} t1={70.6} y={1000} lines={['THE DETAIL', 'MOST PEOPLE MISS']} size={70} style={['c', 'g']} from="up" />
    <WordPanel t={t} t0={70.75} t1={77.95} />
    <Stamp s="ONCE IN THE NEW TESTAMENT" y={1000} t={t} t0={73.62} t1={76.5} color={G} size={40} rot={-3} />
    <Stamp s="A ROMAN SCOURGE" y={1330} t={t} t0={77.75} t1={78.9} color={RED} size={48} rot={-3} />
    <Sub s="three years later" y={1060} a={env(t, 79.1, 80.1, .15, .15)} size={52} color={CR} />
    <Title t={t} t0={80.11} t1={81.0} y={1000} lines={['PILATE']} size={120} style={['c']} from="slam" />
    <Stamp s="SCOURGED" y={1020} t={t} t0={81.05} t1={81.7} color={RED} size={100} rot={-4} />
    <Twin t={t} t0={81.75} t1={84.75} />
    <Stamp s="THE SAME WORD" y={1360} t={t} t0={83.7} t1={84.7} color={RED} size={46} rot={-3} />
    <Title t={t} t0={84.9} t1={88.5} y={950} lines={['AT HIS TRIAL']} size={92} style={['c']} from="up" />
    <Sub s="“I will destroy this temple…”" y={1090} a={env(t, 86.6, 88.5, .2, .2)} size={52} color={GL} />
    <Chip s="MARK 14 : 58" y={1180} a={env(t, 87.0, 88.5, .2, .2)} />
    <Title t={t} t0={88.65} t1={90.45} y={990} lines={['AT THE CROSS']} size={96} style={['c']} from="up" />
    <Title t={t} t0={90.5} t1={92.3} y={960} lines={['“THOU THAT', 'DESTROYEST', 'THE TEMPLE”']} size={80} style={['c', 'r', 'c']} from="slam" />
    <Chip s="MARK 15 : 29" y={1250} a={env(t, 90.9, 92.3, .2, .2)} />
    <Title t={t} t0={92.5} t1={95.9} y={970} lines={['AD 70']} size={150} style={['r']} from="slam" />
    <Sub s="Rome burns Herod’s temple to the ground" y={1160} a={env(t, 93.7, 95.9, .2, .2)} size={42} color={CR} />
    <Sub s="a whip for the sellers…" y={1080} a={env(t, 96.1, 98.0, .2, .2)} size={52} color={CR} />
    <Title t={t} t0={99.04} t1={100.05} y={980} lines={['THE WHIP', 'WAS FOR HIM']} size={96} style={['c', 'r']} from="slam" />
    <Sub s="and the temple he promised to raise…" y={1080} a={env(t, 100.15, 101.95, .2, .2)} size={44} color={CR} />
    <Title t={t} t0={102.03} t1={103.6} y={960} lines={['ROSE', 'ON THE THIRD DAY']} size={96} style={['g', 'c']} from="slam" />
    {/* ---- follow ---- */}
    <AbsoluteFill style={{ background: 'rgba(4,4,9,.72)', opacity: env(t, 103.65, DUR + 1, .4, .1) }} />
    <div style={{ ...abs(CX - 70, 640), width: 140, height: 140, opacity: env(t, 103.75, DUR + 1, .4, .1), borderRadius: '50%', boxShadow: '0 0 0 3px rgba(212,175,106,.8), 0 0 60px rgba(212,175,106,.4)' }}><Logo size={140} /></div>
    <Sub s="@lostscripturesbooks" y={800} a={env(t, 103.9, DUR + 1, .4, .1)} size={40} color={GL} />
    <Title t={t} t0={103.7} t1={DUR + 1} y={880} lines={['FOLLOW']} size={140} from="slam" />
    <Sub s="for more stories from the Bible" y={1060} a={eout(P(t, 104.2, 104.7))} size={50} />
    <Sub s="that most people never hear" y={1125} a={eout(P(t, 105.8, 106.3))} size={50} color={GL} />

    <AbsoluteFill style={{ background: 'radial-gradient(ellipse at 50% 46%, rgba(0,0,0,0) 58%, rgba(0,0,0,.5) 100%)' }} />
    <Hud t={t} /><Captions t={t} />
    <AbsoluteFill style={{ backgroundColor: '#000', opacity: Math.max(1 - P(t, 0, .2), P(t, DUR - .6, DUR)) }} />
  </AbsoluteFill>;
};

/* TikTok cover: grid crops the centre 3:4 (y ≈ 240–1680) — all text inside y 280–1640 */
export const StoryCover: React.FC = () => <AbsoluteFill style={{ backgroundColor: '#040409', overflow: 'hidden' }}>
  <Shot t={1} t0={0} t1={2} pic={DORE} mode="fit" y={1000} from={[.5, .32, 1.45]} fi={0} fo={0} />
  <AbsoluteFill style={{ background: 'linear-gradient(180deg, rgba(4,4,9,.96) 14%, rgba(4,4,9,.75) 31%, rgba(4,4,9,0) 44%, rgba(4,4,9,0) 62%, rgba(4,4,9,.9) 77%, rgba(4,4,9,.97) 90%)' }} />
  <div style={{ ...abs(CX - 34, 300), width: 68, height: 68 }}><Logo size={68} /></div>
  <div style={{ ...abs(90, 390, 900), textAlign: 'center', fontFamily: CIN, fontWeight: 700, fontSize: 40, letterSpacing: 7, color: CR, opacity: .9 }}>WITH HIS OWN HANDS</div>
  <div style={{ ...abs(90, 450, 900), textAlign: 'center', ...goldText, fontFamily: CIN, fontWeight: 700, fontSize: 104, lineHeight: 1.05, whiteSpace: 'nowrap' }}>JESUS MADE<br />A WHIP</div>
  <div style={{ ...abs(90, 1330, 900), textAlign: 'center', fontFamily: CIN, fontWeight: 700, fontSize: 62, lineHeight: 1.1, color: '#ff6a5a', textShadow: '0 0 30px rgba(220,40,30,.6), 0 4px 10px rgba(0,0,0,.9)' }}>THEN IT CAME<br />BACK FOR HIM</div>
  <div style={{ ...abs(90, 1530, 900), textAlign: 'center', fontFamily: CORI, fontWeight: 600, fontSize: 40, color: 'rgba(243,231,207,.75)' }}>John 2 · the cleansing of the Temple</div>
  <AbsoluteFill style={{ background: 'radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0) 60%, rgba(0,0,0,.55) 100%)' }} />
</AbsoluteFill>;
