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
export const DUR = 108.0;
const SANS = 'Inter, sans-serif';
const GRK = '"DejaVu Serif", serif';
const TIS = 'James Tissot', DOR = 'Gustave Doré';
const ZAC: Pic = { src: 'zac.jpg', w: 2504, h: 1618, bg: 'zac_bg.jpg', credit: TIS + ', Zacchaeus in the Sycomore Tree (1886–94)' + pd };
const CROWD: Pic = { src: 'crowd.jpg', w: 2600, h: 1593, bg: 'crowd_bg.jpg', credit: TIS + ', The Life of Our Saviour (1886–94)' + pd };
const BLIND: Pic = { src: 'blind.jpg', w: 2600, h: 1507, bg: 'blind_bg.jpg', credit: TIS + ', The Healing of the Two Blind Men at Jericho (1886–94)' + pd };
const PHAR: Pic = { src: 'pharpub.jpg', w: 1848, h: 2600, bg: 'pharpub_bg.jpg', credit: TIS + ', The Pharisee and the Publican (1886–94)' + pd };
const KED: Pic = { src: 'kedron.jpg', w: 2599, h: 1349, bg: 'kedron_bg.jpg', credit: TIS + ', the road from Jericho to Jerusalem (1886–94)' + pd };
const MAT: Pic = { src: 'matthew.jpg', w: 1005, h: 1707, bg: 'matthew_bg.jpg', credit: TIS + ', The Calling of Saint Matthew (1886–94)' + pd };
const JER: Pic = { src: 'jericho_r.jpg', w: 2338, h: 1339, bg: 'jericho_r_bg.jpg', credit: 'David Roberts, Jericho (1842)' + pd };
const ENTRY: Pic = { src: 'entry.jpg', w: 1937, h: 2593, bg: 'entry_bg.jpg', credit: DOR + ', Christ’s Entry into Jerusalem (1866)' + pd };
const DPUB: Pic = { src: 'dpub.jpg', w: 1965, h: 2600, bg: 'dpub_bg.jpg', credit: DOR + ', The Pharisee and the Publican (1866)' + pd };
const CROSS: Pic = { src: 'dcross.jpg', w: 2081, h: 2571, bg: 'dcross_bg.jpg', credit: DOR + ', The Crucifixion (1866)' + pd };
const TAB: Pic = { src: 'tables_r.jpg', w: 2600, h: 2131, bg: 'tables_r_bg.jpg', credit: 'Julius Schnorr von Carolsfeld, Moses Brings the Law to Israel (1860)' + pd };
const KK = 'The King of Kings (1927)' + pd;

type S = { t0: number; t1: number; pic?: Pic; from?: Cam; to?: Cam; mode?: 'cover' | 'fit'; clip?: string; at?: number; vh?: number; credit?: string };
const SH: S[] = [
  { t0: 0, t1: 2.6, clip: 'k1.mp4', at: 0.3, vh: 816, credit: KK },
  { t0: 2.45, t1: 4.7, pic: ZAC, from: [.55, .4, 2.4], to: [.55, .42, 1.8] },
  { t0: 4.55, t1: 6.5, clip: 'k5.mp4', at: 0, vh: 814, credit: KK },
  { t0: 6.35, t1: 9.2, pic: JER, from: [.3, .55, 1.4], to: [.55, .55, 1.25] },
  { t0: 9.05, t1: 10.8, pic: KED, from: [.5, .5, 1.3], to: [.55, .45, 1.1] },
  { t0: 10.65, t1: 14.0, pic: BLIND, from: [.15, .3, 1.7], to: [.2, .35, 1.3] },
  { t0: 13.85, t1: 16.0, pic: MAT, mode: 'fit', from: [.5, .5, 1.0], to: [.5, .5, 1.1] },
  { t0: 15.85, t1: 20.2, pic: MAT, from: [.75, .35, 1.3], to: [.7, .4, 1.6] },
  { t0: 20.05, t1: 22.9, pic: ZAC, from: [.56, .5, 2.6], to: [.56, .45, 2.1] },
  { t0: 22.75, t1: 25.0, pic: PHAR, from: [.8, .5, 1.5], to: [.8, .45, 1.9] },
  { t0: 24.85, t1: 27.6, pic: DPUB, from: [.78, .45, 1.5], to: [.72, .5, 1.2] },
  { t0: 27.45, t1: 31.6, clip: 'k2.mp4', at: 0, vh: 816, credit: KK },
  { t0: 31.45, t1: 33.0, pic: CROWD, from: [.5, .5, 1.2], to: [.45, .5, 1.4] },
  { t0: 32.85, t1: 36.8, pic: ZAC, mode: 'fit', from: [.5, .5, 1.0], to: [.5, .5, 1.12] },
  { t0: 36.65, t1: 39.4, pic: ZAC, from: [.25, .72, 2.0], to: [.27, .66, 1.6] },
  { t0: 39.25, t1: 41.3, clip: 'k4.mp4', at: 1.0, vh: 816, credit: KK },
  { t0: 41.15, t1: 45.4, pic: ZAC, from: [.28, .66, 1.6], to: [.55, .38, 1.6] },
  { t0: 45.25, t1: 47.2, pic: ZAC, from: [.48, .32, 2.6], to: [.48, .32, 3.1] },
  { t0: 47.05, t1: 51.0, clip: 'k6.mp4', at: 0, vh: 814, credit: KK },
  { t0: 50.85, t1: 54.4, clip: 'k5.mp4', at: 2.0, vh: 814, credit: KK },
  { t0: 54.25, t1: 56.9, pic: ZAC, from: [.55, .45, 1.8], to: [.55, .4, 2.2] },
  { t0: 56.75, t1: 58.8, pic: BLIND, from: [.6, .62, 1.5], to: [.62, .6, 1.8] },
  { t0: 58.65, t1: 64.3, pic: PHAR, mode: 'fit', from: [.5, .5, 1.0], to: [.5, .5, 1.1] },
  { t0: 64.15, t1: 66.0, pic: ZAC, from: [.48, .32, 2.2], to: [.48, .32, 2.7] },
  { t0: 65.85, t1: 70.0, pic: TAB, from: [.45, .2, 1.6], to: [.45, .28, 1.25] },
  { t0: 69.85, t1: 73.6, pic: TAB, from: [.7, .5, 1.3], to: [.6, .6, 1.6] },
  { t0: 73.45, t1: 77.6, pic: DPUB, from: [.25, .75, 1.7], to: [.25, .7, 2.1] },
  { t0: 77.45, t1: 79.0, clip: 'k5.mp4', at: 3.5, vh: 814, credit: KK },
  { t0: 78.85, t1: 83.9, pic: ZAC, mode: 'fit', from: [.5, .5, 1.05], to: [.5, .5, 1.2] },
  { t0: 83.75, t1: 85.7, clip: 'k3.mp4', at: 0, vh: 816, credit: KK },
  { t0: 85.55, t1: 87.7, pic: ZAC, from: [.52, .38, 2.0], to: [.52, .38, 1.6] },
  { t0: 87.55, t1: 91.6, pic: CROWD, from: [.3, .5, 1.4], to: [.5, .5, 1.1] },
  { t0: 91.45, t1: 95.6, pic: JER, from: [.75, .75, 2.0], to: [.7, .7, 1.6] },
  { t0: 95.45, t1: 98.5, pic: ENTRY, from: [.4, .4, 1.25], to: [.42, .35, 1.05] },
  { t0: 98.35, t1: 101.5, pic: CROSS, from: [.5, .3, 1.4], to: [.5, .3, 1.8] },
  { t0: 101.35, t1: 103.4, pic: CROSS, from: [.62, .33, 2.0], to: [.62, .33, 2.4] },
  { t0: 103.25, t1: DUR + .1, pic: ZAC, mode: 'fit', from: [.5, .5, 1.0], to: [.5, .5, 1.1] },
];
const CH: [number, string][] = [[0, 'the hated man'], [6.4, 'jericho'], [27.6, 'the tree'], [47.2, 'the crowd'], [54.4, 'fourfold'], [77.7, 'abraham'], [91.6, 'the road']];

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
    <div style={{ position: 'absolute', left: SL + 80, top: y + 4, fontFamily: CORI, fontWeight: 600, fontSize: 27, color: 'rgba(243,231,207,.65)' }}>the most hated man · Luke 19</div>
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


/* Leviticus 6:5 vs Exodus 22:1 */
const Twin: React.FC<{ t: number; t0: number; t1: number }> = ({ t, t0, t1 }) => {
  const a = env(t, t0, t1, .35, .3); if (a <= 0) return null;
  const r1 = eout(P(t, 66.0, 66.5)), r2 = eout(P(t, 70.09, 70.6));
  const h1 = clamp((t - 69.45) / .4), h2 = clamp((t - 72.4) / .4);
  const parch: React.CSSProperties = { background: 'radial-gradient(ellipse at 45% 40%, #efe0bd 0%, #d9c393 60%, #a98d5c 100%)', boxShadow: '0 24px 70px rgba(0,0,0,.85), inset 0 0 60px rgba(90,60,20,.55)', borderRadius: 8, padding: '22px 30px 26px', boxSizing: 'border-box', textAlign: 'center', position: 'absolute', left: CX - 400, width: 800 };
  const hl = (s: string, on: number) => <span style={{ background: `rgba(243,212,140,${.85 * on})`, borderRadius: 6, padding: '0 6px', boxShadow: on > 0 ? `0 0 ${22 * on}px rgba(243,212,140,${.8 * on})` : undefined }}>{s}</span>;
  const card = (top: number, r: number, ref_: string, who: string, pre: string, key: string, en: string, rot: number, on: number) => r <= 0 ? null :
    <div style={{ ...parch, top: top + (1 - r) * 30, opacity: r, rotate: `${rot}deg` }}>
      <div style={{ fontFamily: CIN, fontWeight: 700, fontSize: 26, letterSpacing: 4, color: '#6b4a22' }}>{ref_}</div>
      <div style={{ fontFamily: CORI, fontWeight: 600, fontSize: 28, color: '#6b4a22', marginBottom: 8 }}>{who}</div>
      <div style={{ fontFamily: CORI, fontWeight: 600, fontSize: 44, lineHeight: 1.22, color: '#3b2a18' }}>{pre}<br />{hl(key, on)}</div>
      <div style={{ fontFamily: CIN, fontWeight: 700, fontSize: 30, letterSpacing: 2, color: '#7a2a1c', marginTop: 10 }}>{en}</div>
    </div>;
  return <div style={{ position: 'absolute', inset: 0, opacity: a }}>
    {card(560, r1, 'LEVITICUS 6 : 5', 'a man who confesses a wrong', '“he shall even restore it…', 'and shall add the fifth part”', '= REPAY + 20%', -1.2, h1)}
    {card(960, r2, 'EXODUS 22 : 1', 'a thief who stole a sheep and sold it', '“he shall restore…', 'four sheep for a sheep”', '= REPAY × 4', 1.2, h2)}
  </div>;
};

const HITS: [number, number, number][] = [[0.2, 10, 6], [2.74, 16, 5], [3.78, 12, 6], [7.76, 14, 5], [15.29, 16, 5], [20.51, 12, 6], [26.85, 14, 5], [34.37, 12, 6], [38.68, 16, 5], [40.77, 14, 5], [47.79, 12, 6], [50.46, 14, 5], [54.61, 12, 6], [63.3, 18, 4], [64.38, 12, 5], [72.47, 14, 5], [76.88, 16, 5], [83.24, 14, 5], [84.96, 12, 6], [87.0, 14, 5], [100.74, 16, 5], [103.42, 10, 6]];
const shotAt = (t: number) => { let s: S = SH[0]; for (const x of SH) if (t >= x.t0 + .15) s = x; return s; };

export const StoryVideo: React.FC = () => {
  const t = useCurrentFrame() / FPS;
  let sx = 0, sy = 0; for (const [h, amp, dec] of HITS) { const [x, y] = shake(t, h, amp, dec); sx += x; sy += y; }
  const cur = shotAt(t);
  const flash = Math.max(env(t, 2.7, 3.05, .03, .3) * .45, env(t, 38.64, 39.0, .03, .3) * .5, env(t, 63.26, 63.7, .03, .4) * .6, env(t, 76.84, 77.2, .03, .35) * .45, env(t, 100.7, 101.1, .03, .35) * .5);
  return <AbsoluteFill style={{ backgroundColor: '#040409', overflow: 'hidden' }}>
    <div style={{ position: 'absolute', inset: 0, translate: `${sx}px ${sy}px`, scale: '1.03' }}>
      {SH.map((s, i) => s.clip ? <Clip key={i} t={t} t0={s.t0} t1={s.t1} clip={s.clip} at={s.at} vw={1080} vh={s.vh!} mode="band" />
        : <Shot key={i} t={t} t0={s.t0} t1={s.t1} pic={s.pic!} from={s.from!} to={s.to} mode={s.mode} />)}
    </div>
    <PhotoShade />
    {/* warm Jericho sun */}
    <AbsoluteFill style={{ background: 'radial-gradient(ellipse at 60% 30%, rgba(255,170,70,.28) 0%, rgba(160,80,10,.12) 55%, rgba(0,0,0,0) 100%)', opacity: Math.max(env(t, 6.35, 14.0, .5, .5), env(t, 91.45, 95.6, .5, .5)) }} />
    {/* cold for the cross */}
    <AbsoluteFill style={{ background: 'radial-gradient(ellipse at 50% 55%, rgba(20,30,60,0) 30%, rgba(20,30,60,.5) 100%)', opacity: env(t, 98.35, 103.4, .5, .5) }} />
    {/* dim for panels */}
    <AbsoluteFill style={{ background: 'rgba(4,4,9,.62)', opacity: Math.max(env(t, 15.9, 20.1, .3, .3), env(t, 58.7, 64.25, .3, .3), env(t, 65.95, 73.55, .3, .3)) }} />
    <AbsoluteFill style={{ background: '#FFF6E0', opacity: flash * .7 }} />
    <Credit s={t < DUR - 4.8 ? (cur.credit ?? cur.pic?.credit) : undefined} a={1} />

    {/* ---- the hated man ---- */}
    <Title t={t} t0={0.21} t1={2.5} y={960} lines={['A WHOLE CITY', 'CAME OUT']} size={100} style={['c', 'g']} from="slam" />
    <Title t={t} t0={2.65} t1={4.6} y={930} lines={['HE PICKED', 'THE MOST', 'HATED MAN']} size={100} style={['c', 'g', 'r']} from="slam" />
    <Title t={t} t0={4.74} t1={6.35} y={960} lines={['…AND INVITED', 'HIMSELF TO DINNER']} size={70} style={['c', 'g']} from="up" />
    {/* ---- jericho ---- */}
    <Chip s="LUKE 19 : 1–10" y={1080} a={env(t, 6.45, 7.65, .2, .2)} />
    <Title t={t} t0={7.76} t1={10.6} y={960} lines={['JERICHO']} size={120} from="slam" />
    <Sub s="the last stop before Jerusalem" y={1110} a={env(t, 8.55, 10.6, .2, .2)} size={46} />
    <Title t={t} t0={10.8} t1={13.9} y={940} lines={['PALMS', 'BALSAM', 'PILGRIMS']} size={84} style={['g', 'g', 'c']} from="up" />
    <Sub s="money on the move" y={1250} a={env(t, 12.1, 13.9, .2, .2)} size={46} color={GL} />
    <Title t={t} t0={14.05} t1={15.2} y={990} lines={['THE CHIEF TAX MAN']} size={74} style={['c']} from="up" />
    <Title t={t} t0={15.29} t1={16.0} y={960} lines={['ZACCHAEUS']} size={120} style={['g']} from="slam" />
    <div style={{ ...abs(SL - 40, 880, SR - SL + 80), textAlign: 'center', opacity: env(t, 16.1, 20.0, .2, .25), fontFamily: GRK, fontSize: 100, lineHeight: 1.1, ...goldText, scale: String(lerp(1.25, 1, eout(P(t, 16.1, 16.45)))) }}>ἀρχιτελώνης</div>
    <Sub s="“chief among the publicans”" y={1020} a={env(t, 16.4, 20.0, .2, .2)} size={50} color={CR} />
    <Chip s="ONLY HERE IN THE NEW TESTAMENT" y={1120} a={env(t, 17.74, 20.0, .2, .2)} size={26} />
    <Stamp s="RICH" y={1000} t={t} t0={20.5} t1={21.2} color={G} size={110} rot={-5} />
    <Title t={t} t0={21.24} t1={24.9} y={940} lines={['COLLECTED', 'FOR ROME']} size={90} style={['c', 'g']} from="up" />
    <Sub s="and kept whatever he squeezed out above it" y={1160} a={env(t, 23.1, 24.9, .2, .2)} size={40} color={GL} />
    <Title t={t} t0={26.1} t1={27.5} y={960} lines={['A TRAITOR', 'AND A THIEF']} size={96} style={['c', 'r']} from="slam" />
    {/* ---- the tree ---- */}
    <Sub s="Jesus is passing through…" y={1080} a={env(t, 27.7, 29.55, .2, .2)} size={50} color={CR} />
    <Title t={t} t0={29.65} t1={31.6} y={960} lines={['HE CAN’T SEE', 'OVER THE CROWD']} size={76} style={['c', 'g']} from="up" />
    <Title t={t} t0={31.69} t1={33.0} y={960} lines={['“LITTLE OF', 'STATURE”']} size={96} style={['c', 'g']} from="slam" />
    <Chip s="LUKE 19 : 3" y={1190} a={env(t, 32.0, 33.0, .2, .2)} />
    <Title t={t} t0={33.02} t1={34.3} y={960} lines={['THE RICHEST', 'MAN IN TOWN']} size={84} style={['c', 'g']} from="up" />
    <Stamp s="RAN AHEAD" y={1000} t={t} t0={34.37} t1={35.25} color={RED} size={74} rot={-4} />
    <Title t={t} t0={35.36} t1={36.8} y={475} lines={['UP A SYCOMORE TREE']} size={66} style={['g']} from="slam" />
    <Pin x={600} y={860} s="ZACCHAEUS" a={env(t, 34.4, 36.75, .25, .2)} />
    <Chip s="LUKE 19 : 4" y={1440-170} a={env(t, 35.8, 36.8, .2, .2)} />
    <Sub s="when Jesus came to the place…" y={1080} a={env(t, 36.9, 38.5, .2, .15)} size={50} color={CR} />
    <Title t={t} t0={38.59} t1={39.4} y={980} lines={['HE LOOKED UP']} size={100} style={['g']} from="slam" />
    <Title t={t} t0={39.5} t1={40.7} y={980} lines={['BY NAME']} size={120} style={['g']} from="slam" />
    <Title t={t} t0={40.77} t1={43.1} y={940} lines={['“ZACCHAEUS,', 'MAKE HASTE…”']} size={92} style={['g', 'c']} from="slam" />
    <Title t={t} t0={43.2} t1={45.4} y={940} lines={['“TO DAY I MUST', 'ABIDE AT', 'THY HOUSE”']} size={78} style={['c', 'g', 'g']} from="up" />
    <Chip s="LUKE 19 : 5" y={1250} a={env(t, 43.6, 45.4, .2, .2)} />
    <Title t={t} t0={45.5} t1={47.15} y={960} lines={['NOBODY HAD', 'INTRODUCED THEM']} size={80} style={['c', 'g']} from="up" />
    {/* ---- the crowd ---- */}
    <Stamp s="THEY MURMURED" y={1000} t={t} t0={47.79} t1={48.6} color={RED} size={64} rot={-4} />
    <Title t={t} t0={48.62} t1={50.95} y={940} lines={['“GUEST WITH A MAN', 'THAT IS', 'A SINNER”']} size={74} style={['c', 'c', 'r']} from="up" />
    <Chip s="LUKE 19 : 7" y={1230} a={env(t, 49.2, 50.95, .2, .2)} />
    <Sub s="to eat at a man’s table…" y={1080} a={env(t, 51.05, 52.85, .2, .2)} size={50} color={CR} />
    <Title t={t} t0={52.91} t1={54.35} y={960} lines={['…WAS TO STAND', 'WITH HIM']} size={86} style={['c', 'g']} from="up" />
    {/* ---- fourfold ---- */}
    <Title t={t} t0={54.61} t1={55.75} y={980} lines={['HE STOOD UP']} size={100} style={['g']} from="slam" />
    <Title t={t} t0={55.8} t1={58.85} y={930} lines={['“THE HALF', 'OF MY GOODS', 'TO THE POOR”']} size={86} style={['c', 'g', 'g']} from="up" />
    <Chip s="LUKE 19 : 8" y={1240} a={env(t, 56.4, 58.85, .2, .2)} />
    <Parch t={t} t0={58.95} t1={64.25} y={640} ref_="LUKE 19 : 8" who="Zacchaeus" lines={['“if I have taken any thing', 'from any man', 'by false accusation,', 'I restore him fourfold”']} hi={63.25} size={50} />
    <Title t={t} t0={64.38} t1={65.0} y={960} lines={['FOURFOLD']} size={130} style={['r']} from="slam" />
    <Title t={t} t0={65.0} t1={65.95} y={970} lines={['WHY THAT NUMBER?']} size={86} style={['g']} from="slam" />
    <Title t={t} t0={65.9} t1={67.6} y={470} lines={['THE LAW OF MOSES']} size={50} style={['c']} from="up" />
    <Twin t={t} t0={65.95} t1={73.55} />
    <Title t={t} t0={73.7} t1={75.7} y={960} lines={['HE DIDN’T WAIT', 'TO BE CAUGHT']} size={82} style={['c', 'g']} from="up" />
    <Title t={t} t0={75.78} t1={77.6} y={920} lines={['HE SENTENCED', 'HIMSELF', 'AS A THIEF']} size={88} style={['c', 'g', 'r']} from="slam" />
    {/* ---- abraham ---- */}
    <Sub s="and Jesus said" y={1080} a={env(t, 77.75, 78.95, .2, .15)} size={52} color={CR} />
    <Title t={t} t0={79.03} t1={81.25} y={930} lines={['“THIS DAY IS', 'SALVATION COME', 'TO THIS HOUSE”']} size={78} style={['c', 'g', 'g']} from="up" />
    <Title t={t} t0={81.32} t1={83.95} y={950} lines={['“HE ALSO IS A', 'SON OF ABRAHAM”']} size={78} style={['c', 'g']} from="up" />
    <Chip s="LUKE 19 : 9" y={1150} a={env(t, 81.8, 83.95, .2, .2)} />
    <Title t={t} t0={84.04} t1={85.7} y={960} lines={['THE CROWD:', '“A SINNER”']} size={90} style={['c', 'r']} from="slam" />
    <Title t={t} t0={85.75} t1={87.7} y={950} lines={['JESUS:', '“A SON OF ABRAHAM”']} size={76} style={['c', 'g']} from="slam" />
    <Title t={t} t0={87.79} t1={91.55} y={920} lines={['“TO SEEK', 'AND TO SAVE', 'THAT WHICH', 'WAS LOST”']} size={80} style={['c', 'g', 'g', 'g']} from="up" />
    <Chip s="LUKE 19 : 10" y={1300} a={env(t, 88.4, 91.55, .2, .2)} />
    {/* ---- the road ---- */}
    <Sub s="Jericho today" y={1080} a={env(t, 91.7, 93.25, .2, .2)} size={50} color={CR} />
    <Title t={t} t0={93.3} t1={95.6} y={950} lines={['“ZACCHAEUS’', 'SYCAMORE”']} size={92} style={['g', 'g']} from="up" />
    <Sub s="the road climbs…" y={1080} a={env(t, 95.75, 97.35, .2, .2)} size={50} color={CR} />
    <Title t={t} t0={97.45} t1={98.55} y={980} lines={['JERUSALEM']} size={110} style={['g']} from="slam" />
    <Sub s="within days…" y={1080} a={env(t, 98.65, 99.85, .2, .15)} size={50} color={CR} />
    <Title t={t} t0={99.91} t1={101.5} y={950} lines={['BETWEEN', 'TWO THIEVES']} size={96} style={['c', 'r']} from="slam" />
    <Chip s="LUKE 23 : 33" y={1170} a={env(t, 100.3, 101.5, .2, .2)} />
    <Title t={t} t0={101.6} t1={103.3} y={950} lines={['HE SAVED', 'ONE OF THEM TOO']} size={80} style={['c', 'g']} from="up" />
    <Chip s="LUKE 23 : 43" y={1150} a={env(t, 102.0, 103.3, .2, .2)} />
    {/* ---- follow ---- */}
    <AbsoluteFill style={{ background: 'rgba(4,4,9,.72)', opacity: env(t, 103.3, DUR + 1, .4, .1) }} />
    <div style={{ ...abs(CX - 70, 640), width: 140, height: 140, opacity: env(t, 103.4, DUR + 1, .4, .1), borderRadius: '50%', boxShadow: '0 0 0 3px rgba(212,175,106,.8), 0 0 60px rgba(212,175,106,.4)' }}><Logo size={140} /></div>
    <Sub s="@lostscripturesbooks" y={800} a={env(t, 103.5, DUR + 1, .4, .1)} size={40} color={GL} />
    <Title t={t} t0={103.42} t1={DUR + 1} y={880} lines={['FOLLOW']} size={140} from="slam" />
    <Sub s="for more stories from the Bible" y={1060} a={eout(P(t, 103.9, 104.4))} size={50} />
    <Sub s="that most people never hear" y={1125} a={eout(P(t, 105.5, 106.0))} size={50} color={GL} />

    <AbsoluteFill style={{ background: 'radial-gradient(ellipse at 50% 46%, rgba(0,0,0,0) 58%, rgba(0,0,0,.5) 100%)' }} />
    <Hud t={t} /><Captions t={t} />
    <AbsoluteFill style={{ backgroundColor: '#000', opacity: Math.max(1 - P(t, 0, .2), P(t, DUR - .6, DUR)) }} />
  </AbsoluteFill>;
};

/* TikTok cover: grid crops the centre 3:4 (y ≈ 240–1680) — all text inside y 280–1640 */
export const StoryCover: React.FC = () => <AbsoluteFill style={{ backgroundColor: '#040409', overflow: 'hidden' }}>
  <Shot t={1} t0={0} t1={2} pic={ZAC} mode="cover" y={0} from={[.5, 0, 1.35]} fi={0} fo={0} />
  <AbsoluteFill style={{ background: 'linear-gradient(180deg, rgba(4,4,9,.96) 14%, rgba(4,4,9,.75) 31%, rgba(4,4,9,0) 44%, rgba(4,4,9,0) 62%, rgba(4,4,9,.9) 77%, rgba(4,4,9,.97) 90%)' }} />
  <div style={{ ...abs(CX - 34, 300), width: 68, height: 68 }}><Logo size={68} /></div>
  <div style={{ ...abs(90, 390, 900), textAlign: 'center', fontFamily: CIN, fontWeight: 700, fontSize: 40, letterSpacing: 6, color: CR, opacity: .9 }}>JESUS INVITED HIMSELF TO</div>
  <div style={{ ...abs(90, 450, 900), textAlign: 'center', ...goldText, fontFamily: CIN, fontWeight: 700, fontSize: 96, lineHeight: 1.05, whiteSpace: 'nowrap' }}>THE MOST<br />HATED MAN</div>
  <div style={{ ...abs(90, 1340, 900), textAlign: 'center', fontFamily: CIN, fontWeight: 700, fontSize: 64, lineHeight: 1.1, color: '#ff6a5a', textShadow: '0 0 30px rgba(220,40,30,.6), 0 4px 10px rgba(0,0,0,.9)' }}>IN JERICHO</div>
  <div style={{ ...abs(90, 1530, 900), textAlign: 'center', fontFamily: CORI, fontWeight: 600, fontSize: 40, color: 'rgba(243,231,207,.75)' }}>Luke 19 · Zacchaeus in the tree</div>
  <AbsoluteFill style={{ background: 'radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0) 60%, rgba(0,0,0,.55) 100%)' }} />
</AbsoluteFill>;
