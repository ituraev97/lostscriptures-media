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

export const DUR = 110.0;
const SANS = 'Inter, sans-serif';
const GRK = '"DejaVu Serif", serif';
const pd = ' · public domain';
const TIS = 'James Tissot', DORE = 'Gustave Doré';
const THIEF: Pic = { src: 'thief.jpg', w: 1519, h: 2600, bg: 'thief_bg.jpg', credit: TIS + ', The Penitent Thief (1886–94)' + pd };
const WOMEN: Pic = { src: 'women.jpg', w: 2140, h: 1631, bg: 'women_bg.jpg', credit: TIS + ', The Holy Women Look On from Afar (1886–94)' + pd };
const WATCH: Pic = { src: 'watch.jpg', w: 2115, h: 1177, bg: 'watch_bg.jpg', credit: TIS + ', And Sitting Down They Watched Him There (1886–94)' + pd };
const CALV: Pic = { src: 'calv.jpg', w: 2141, h: 1069, bg: 'calv_bg.jpg', credit: TIS + ', Calvary Seen from the Walls of Herod’s Palace (1886–94)' + pd };
const CROWD: Pic = { src: 'crowd.jpg', w: 1108, h: 1956, bg: 'crowd_bg.jpg', credit: TIS + ', Let Him Be Crucified (1886–94)' + pd };
const PROC: Pic = { src: 'proc.jpg', w: 2183, h: 1607, bg: 'proc_bg.jpg', credit: TIS + ', The Procession Arriving at Calvary (1886–94)' + pd };
const JUDG: Pic = { src: 'judg.jpg', w: 1937, h: 1319, bg: 'judg_bg.jpg', credit: TIS + ', Pilate Pronounces Judgment from the Gabbatha (1886–94)' + pd };
const ELEV: Pic = { src: 'elev.jpg', w: 2184, h: 1449, bg: 'elev_bg.jpg', credit: TIS + ', The Elevation of the Cross (1886–94)' + pd };
const DISC: Pic = { src: 'disc.jpg', w: 1986, h: 1337, bg: 'disc_bg.jpg', credit: TIS + ', The Disciples Watch from Afar (1886–94)' + pd };
const BARAB: Pic = { src: 'barab.jpg', w: 787, h: 813, bg: 'barab_bg.jpg', credit: TIS + ', Barabbas (1886–94)' + pd };
const DCRUC: Pic = { src: 'dcruc.jpg', w: 2046, h: 2545, bg: 'dcruc_bg.jpg', credit: DORE + ', The Crucifixion (1866)' + pd };
const DCLOSE: Pic = { src: 'dclose.jpg', w: 2071, h: 2495, bg: 'dclose_bg.jpg', credit: DORE + ', Close of the Crucifixion (1866)' + pd };
const DFAINT: Pic = { src: 'dfaint.jpg', w: 2046, h: 2511, bg: 'dfaint_bg.jpg', credit: DORE + ', Christ Fainting under the Cross (1866)' + pd };
const EDEN: Pic = { src: 'eden.jpg', w: 2169, h: 2593, bg: 'eden_bg.jpg', credit: DORE + ', The Expulsion from the Garden (1866)' + pd };
const JER: Pic = { src: 'jer.jpg', w: 2500, h: 1604, bg: 'jer_bg.jpg', credit: 'David Roberts, Jerusalem from the Mount of Olives (1841)' + pd };
const KK = 'The King of Kings (1927)' + pd;

type S = { t0: number; t1: number; pic?: Pic; from?: Cam; to?: Cam; mode?: 'cover' | 'fit'; clip?: string; at?: number; vh?: number; credit?: string };
const SH: S[] = [
  { t0: 0, t1: 2.6, pic: THIEF, from: [.6, .14, 1.5], to: [.6, .24, 1.25] },
  { t0: 2.45, t1: 5.0, clip: 'kk_t2.mp4', at: 0, vh: 812, credit: KK },
  { t0: 4.85, t1: 7.8, pic: DCRUC, from: [.5, .3, 1.5], to: [.5, .35, 1.2] },
  { t0: 7.65, t1: 9.4, pic: JER, from: [.5, .45, 1.1], to: [.6, .4, 1.3] },
  { t0: 9.25, t1: 11.0, clip: 'kk_wide.mp4', at: 6.0, vh: 810, credit: KK },
  { t0: 10.85, t1: 12.3, pic: ELEV, from: [.4, .3, 1.3], to: [.45, .25, 1.5] },
  { t0: 12.15, t1: 13.7, pic: THIEF, from: [.27, .12, 2.3], to: [.27, .13, 2.7] },
  { t0: 13.55, t1: 15.1, pic: THIEF, from: [.74, .08, 2.3], to: [.74, .1, 2.7] },
  { t0: 14.95, t1: 17.4, pic: JUDG, from: [.5, .5, 1.1], to: [.35, .6, 1.4] },
  { t0: 17.25, t1: 19.1, clip: 'kk_t1.mp4', at: 0, vh: 812, credit: KK },
  { t0: 18.95, t1: 21.5, pic: BARAB, mode: 'fit', from: [.5, .5, 1.0], to: [.5, .45, 1.15] },
  { t0: 21.35, t1: 23.0, clip: 'kk_priests.mp4', at: 1.0, vh: 812, credit: KK },
  { t0: 22.85, t1: 24.2, pic: WATCH, from: [.5, .5, 1.2], to: [.45, .5, 1.45] },
  { t0: 24.05, t1: 26.1, clip: 'kk_t1.mp4', at: 7.0, vh: 812, credit: KK },
  { t0: 25.95, t1: 28.8, pic: DCLOSE, from: [.5, .25, 1.6], to: [.45, .25, 2.0] },
  { t0: 28.65, t1: 30.6, clip: 'kk_crowd.mp4', at: 3.0, vh: 812, credit: KK },
  { t0: 30.45, t1: 33.5, pic: DCRUC, mode: 'fit', from: [.5, .5, 1.0], to: [.5, .45, 1.12] },
  { t0: 33.35, t1: 36.2, pic: WOMEN, from: [.45, .2, 1.6], to: [.45, .25, 1.25] },
  { t0: 36.05, t1: 39.1, pic: ELEV, mode: 'fit', from: [.5, .5, 1.0], to: [.5, .5, 1.12] },
  { t0: 38.95, t1: 40.7, clip: 'kk_t3.mp4', at: 0, vh: 812, credit: KK },
  { t0: 40.55, t1: 43.9, pic: DCLOSE, mode: 'fit', from: [.5, .5, 1.0], to: [.5, .45, 1.15] },
  { t0: 43.75, t1: 45.4, clip: 'kk_t2.mp4', at: 8.0, vh: 812, credit: KK },
  { t0: 45.25, t1: 49.3, pic: THIEF, from: [.74, .08, 2.0], to: [.74, .1, 2.4] },
  { t0: 49.15, t1: 51.6, clip: 'kk_t2.mp4', at: 0.5, vh: 812, credit: KK },
  { t0: 51.45, t1: 53.1, pic: THIEF, from: [.5, .25, 1.3], to: [.5, .2, 1.6] },
  { t0: 52.95, t1: 56.6, pic: THIEF, mode: 'fit', from: [.5, .5, 1.0], to: [.5, .45, 1.1] },
  { t0: 56.45, t1: 58.7, pic: DFAINT, from: [.45, .45, 1.3], to: [.5, .4, 1.6] },
  { t0: 58.55, t1: 60.2, pic: THIEF, from: [.66, .06, 2.6], to: [.66, .05, 3.0] },
  { t0: 60.05, t1: 63.2, pic: THIEF, from: [.72, .08, 2.2], to: [.62, .18, 1.4] },
  { t0: 63.05, t1: 64.6, clip: 'kk_wide2.mp4', at: 2.0, vh: 814, credit: KK },
  { t0: 64.45, t1: 69.0, pic: DCRUC, from: [.5, .2, 2.0], to: [.5, .25, 1.3] },
  { t0: 68.85, t1: 72.5, pic: JER, from: [.3, .6, 1.3], to: [.25, .65, 1.6] },
  { t0: 72.35, t1: 75.2, pic: EDEN, from: [.4, .35, 1.4], to: [.45, .3, 1.7] },
  { t0: 75.05, t1: 78.4, pic: DISC, from: [.5, .5, 1.1], to: [.55, .5, 1.35] },
  { t0: 78.25, t1: 83.9, pic: CALV, from: [.3, .5, 1.0], to: [.5, .5, 1.15] },
  { t0: 83.75, t1: 89.6, pic: PROC, from: [.5, .4, 1.0], to: [.55, .35, 1.2] },
  { t0: 89.45, t1: 93.3, clip: 'kk_prep.mp4', at: 8.0, vh: 812, credit: KK },
  { t0: 93.15, t1: 97.0, pic: CROWD, from: [.5, .4, 1.1], to: [.5, .5, 1.3] },
  { t0: 96.85, t1: 98.6, clip: 'kk_t2.mp4', at: 0.3, vh: 812, credit: KK },
  { t0: 98.45, t1: 100.4, clip: 'kk_t1.mp4', at: 8.0, vh: 812, credit: KK },
  { t0: 100.25, t1: 102.0, clip: 'kk_wide.mp4', at: 6.5, vh: 810, credit: KK },
  { t0: 101.85, t1: 104.5, pic: THIEF, from: [.6, .2, 1.6], to: [.5, .4, 1.0] },
  { t0: 104.35, t1: DUR + .1, pic: THIEF, mode: 'fit', from: [.5, .5, 1.0], to: [.5, .5, 1.1] },
];
const CH: [number, string][] = [[0, 'the promise'], [9.3, 'golgotha'], [28.8, 'both mocked'], [43.8, 'nine words'], [69.0, 'paradise'], [78.4, 'the comma'], [93.2, 'the names']];
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
    <div style={{ position: 'absolute', left: SL + 80, top: y + 4, fontFamily: CORI, fontWeight: 600, fontSize: 27, color: 'rgba(243,231,207,.65)' }}>the penitent thief · Luke 23</div>
    <div style={{ position: 'absolute', left: SR - 300, top: y - 34, width: 300, textAlign: 'right', fontFamily: MONO, fontSize: 22, color: 'rgba(243,231,207,.45)' }}>{`${ci + 1}/${n}`}</div>
    <div style={{ position: 'absolute', left: SR - 300, top: y - 2 + (1 - ca) * 12, width: 300, textAlign: 'right', fontFamily: CORI, fontWeight: 600, fontSize: 32, color: G, opacity: ca }}>{CH[ci][1]}</div>
    {CH.map(([s], i) => { const en = i < n - 1 ? CH[i + 1][0] : DUR - 1; const p = clamp((t - s) / (en - s));
      return <div key={i} style={{ position: 'absolute', left: SL + i * (sw + gap), top: y + 54, width: sw, height: 5, borderRadius: 3, background: 'rgba(243,231,207,.14)' }}><div style={{ width: `${p * 100}%`, height: '100%', borderRadius: 3, background: i === 2 ? RED : G }} /></div>; })}
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


/* nine words, counted as they are spoken */
const NW: [string, number][] = [['LORD,', 53.16], ['REMEMBER', 53.69], ['ME', 54.10], ['WHEN', 54.52], ['THOU', 54.78], ['COMEST', 55.08], ['INTO', 55.53], ['THY', 55.69], ['KINGDOM', 55.89]];
const NineWords: React.FC<{ t: number; t0: number; t1: number }> = ({ t, t0, t1 }) => {
  const a = env(t, t0, t1, .3, .3); if (a <= 0) return null;
  let n = 0; NW.forEach(([, s]) => { if (t >= s - .03) n++; });
  const rows = [[0, 1, 2], [3, 4, 5], [6, 7, 8]];
  return <div style={{ position: 'absolute', inset: 0, opacity: a }}>
    <div style={{ position: 'absolute', left: SL, top: 600, width: SR - SL, textAlign: 'center', fontFamily: CIN, fontWeight: 700, fontSize: 30, letterSpacing: 6, color: CR, textShadow: '0 2px 12px #000' }}>LUKE 23 : 42</div>
    {rows.map((r, ri) => <div key={ri} style={{ position: 'absolute', left: SL - 20, width: SR - SL + 40, top: 700 + ri * 125, display: 'flex', justifyContent: 'center', gap: 20 }}>
      {r.map(i => { const [w, s] = NW[i]; const k = eout(P(t, s - .03, s + .22));
        return <span key={i} style={{ fontFamily: CIN, fontWeight: 700, fontSize: 60, lineHeight: 1, opacity: .18 + .82 * k, scale: String(lerp(1.25, 1, k)), ...(k > 0 ? goldText : { color: CR }) }}>{w}</span>; })}
    </div>)}
    <div style={{ position: 'absolute', left: CX - 90, top: 1110, width: 180, textAlign: 'center' }}>
      <div style={{ fontFamily: CIN, fontWeight: 700, fontSize: 120, lineHeight: 1, color: n === 9 ? GL : CR, textShadow: '0 0 30px rgba(240,190,100,.5), 0 4px 12px #000', scale: String(1 + .15 * Math.max(0, 1 - (t - (NW[Math.max(0, n - 1)][1])) / .25)) }}>{n}</div>
      <div style={{ fontFamily: CIN, fontWeight: 700, fontSize: 24, letterSpacing: 6, color: CR, opacity: .8 }}>WORDS</div>
    </div>
  </div>;
};

/* the comma: uncial line, then the two readings */
const UNC = 'ΑΜΗΝΣΟΙΛΕΓΩΣΗΜΕΡΟΝΜΕΤΕΜΟΥΕΣΗΕΝΤΩΠΑΡΑΔΕΙΣΩ';
const Comma: React.FC<{ t: number; t0: number; t1: number }> = ({ t, t0, t1 }) => {
  const a = env(t, t0, t1, .35, .3); if (a <= 0) return null;
  const u = eout(P(t, 81.4, 81.9)), r1 = eout(P(t, 83.95, 84.4)), mv = eio(P(t, 84.75, 85.35)), r2 = eout(P(t, 86.0, 86.4)), most = eout(P(t, 89.7, 90.1));
  const parch: React.CSSProperties = { background: 'radial-gradient(ellipse at 45% 40%, #efe0bd 0%, #d9c393 60%, #a98d5c 100%)', boxShadow: '0 24px 70px rgba(0,0,0,.85), inset 0 0 60px rgba(90,60,20,.55)', borderRadius: 8 };
  const line = (pre: string, post: string, x: number) => <div style={{ fontFamily: CORI, fontWeight: 600, fontSize: 44, lineHeight: 1.3, color: '#F3E7CF', textShadow: '0 2px 12px #000', position: 'relative' }}>
    {pre}<span style={{ position: 'relative' }}>{x < .5 ? <span style={{ color: '#ff6a5a', fontSize: 64 }}>,</span> : null}</span> <span style={{ color: GL }}>to day</span>{x >= .5 ? <span style={{ color: '#ff6a5a', fontSize: 64 }}>,</span> : null} {post}</div>;
  return <div style={{ position: 'absolute', inset: 0, opacity: a }}>
    <div style={{ position: 'absolute', left: SL, top: 600, width: SR - SL, textAlign: 'center', fontFamily: CIN, fontWeight: 700, fontSize: 64, color: CR, textShadow: '0 4px 18px #000', opacity: eout(P(t, t0, t0 + .4)) }}>ONE COMMA</div>
    {u > 0 && <div style={{ position: 'absolute', left: CX - 400, top: 720 + (1 - u) * 30, width: 800, padding: '26px 30px', boxSizing: 'border-box', opacity: u * (1 - .6 * r1), ...parch, rotate: '-1deg' }}>
      <div style={{ fontFamily: CIN, fontWeight: 700, fontSize: 22, letterSpacing: 4, color: '#6b4a22', textAlign: 'center', marginBottom: 10 }}>LUKE 23 : 43 · AS THE OLD SCRIBES WROTE IT</div>
      <div style={{ fontFamily: GRK, fontSize: 46, letterSpacing: 3, color: '#3b2a18', wordBreak: 'break-all', lineHeight: 1.25, textAlign: 'center' }}>{UNC}</div>
      <div style={{ fontFamily: CORI, fontWeight: 600, fontSize: 28, color: '#6b4a22', textAlign: 'center', marginTop: 8 }}>no spaces · no commas</div>
    </div>}
    {r1 > 0 && <div style={{ position: 'absolute', left: SL - 10, top: 1010 + (1 - r1) * 30, width: SR - SL + 20, textAlign: 'center', opacity: r1, padding: '20px 0', background: 'radial-gradient(ellipse at 50% 50%, rgba(4,4,9,.85) 0%, rgba(4,4,9,.6) 55%, rgba(4,4,9,0) 75%)' }}>
      {line('“I say unto thee', 'shalt thou be with me in paradise”', mv)}
      {r2 > 0 && <div style={{ marginTop: 18, opacity: r2, fontFamily: CIN, fontWeight: 700, fontSize: 32, letterSpacing: 3, color: mv > .5 ? '#ff6a5a' : GL }}>{mv > .5 ? 'TODAY = WHEN HE SPOKE' : 'TODAY = WHEN HE ARRIVES'}</div>}
      {most > 0 && <div style={{ marginTop: 12, opacity: most, fontFamily: CORI, fontWeight: 600, fontSize: 36, color: CR }}>most translations: comma before “to day”</div>}
    </div>}
  </div>;
};

const HITS: [number, number, number][] = [[0.25, 12, 6], [2.5, 14, 6], [6.7, 14, 5], [10.0, 12, 6], [14.25, 10, 6], [17.6, 16, 5], [18.4, 10, 6], [22.2, 10, 6], [26.3, 16, 5], [32.8, 14, 5], [37.2, 10, 6], [42.95, 16, 5], [45.4, 12, 6], [53.16, 10, 6], [55.9, 14, 5], [57.6, 10, 6], [64.65, 16, 4], [68.0, 20, 4], [78.9, 14, 5], [85.0, 12, 6], [97.2, 12, 6], [98.9, 12, 6], [103.5, 14, 5]];
const shotAt = (t: number) => { let s: S = SH[0]; for (const x of SH) if (t >= x.t0 + .15) s = x; return s; };

export const StoryVideo: React.FC = () => {
  const t = useCurrentFrame() / FPS;
  let sx = 0, sy = 0; for (const [h, amp, dec] of HITS) { const [x, y] = shake(t, h, amp, dec); sx += x; sy += y; }
  const cur = shotAt(t);
  const flash = Math.max(env(t, 2.45, 2.9, .04, .35) * .4, env(t, 64.6, 65.1, .04, .45) * .5, env(t, 67.95, 68.5, .04, .45) * .8, env(t, 103.45, 103.9, .04, .35) * .4);
  return <AbsoluteFill style={{ backgroundColor: '#040409', overflow: 'hidden' }}>
    <div style={{ position: 'absolute', inset: 0, translate: `${sx}px ${sy}px`, scale: '1.03' }}>
      {SH.map((s, i) => s.clip ? <Clip key={i} t={t} t0={s.t0} t1={s.t1} clip={s.clip} at={s.at} vw={1080} vh={s.vh!} mode="band" />
        : <Shot key={i} t={t} t0={s.t0} t1={s.t1} pic={s.pic!} from={s.from!} to={s.to} mode={s.mode} />)}
    </div>
    <PhotoShade />
    {/* darkness wash for the hours on the cross, warm for paradise */}
    <AbsoluteFill style={{ background: 'radial-gradient(ellipse at 50% 55%, rgba(20,30,60,0) 30%, rgba(20,30,60,.55) 100%)', opacity: Math.max(env(t, 21.4, 28.8, .5, .6), env(t, 40.6, 43.9, .4, .5)) }} />
    <AbsoluteFill style={{ background: 'radial-gradient(ellipse at 50% 40%, rgba(255,210,140,.28) 0%, rgba(255,210,140,0) 70%)', opacity: Math.max(env(t, 64.5, 75.2, .5, .8), env(t, 102.0, 104.5, .4, .4)) }} />
    {/* dim for panels */}
    <AbsoluteFill style={{ background: 'rgba(4,4,9,.62)', opacity: Math.max(env(t, 30.6, 33.45, .3, .3), env(t, 36.15, 38.95, .3, .3), env(t, 53.0, 56.55, .3, .3), env(t, 78.35, 92.9, .3, .3), env(t, 93.25, 96.85, .3, .3)) }} />
    <AbsoluteFill style={{ background: '#FFF6E0', opacity: flash * .7 }} />
    <Credit s={t < DUR - 5.4 ? (cur.credit ?? cur.pic?.credit) : undefined} a={1} />

    {/* ---- the promise ---- */}
    <Title t={t} t0={0.3} t1={2.4} y={980} lines={['THE FIRST MAN', 'PROMISED PARADISE']} size={62} style={['c', 'g']} from="slam" />
    <Title t={t} t0={2.55} t1={4.8} y={1020} lines={['A CRIMINAL']} size={118} style={['r']} from="slam" />
    <Sub s="dying on the cross next to him" y={1170} a={env(t, 3.9, 4.8, .2, .2)} size={46} />
    <Title t={t} t0={6.55} t1={7.7} y={1020} lines={['NINE WORDS']} size={124} from="slam" />
    <Chip s="LUKE 23 : 32–43" y={1110} a={env(t, 7.95, 9.25, .2, .2)} />
    {/* ---- golgotha ---- */}
    <Title t={t} t0={9.45} t1={10.9} y={1000} lines={['GOLGOTHA']} size={120} from="slam" />
    <Sub s="three crosses" y={1160} a={env(t, 10.05, 10.9, .15, .2)} size={52} color={CR} />
    <Sub s="Jesus in the middle" y={1160} a={env(t, 11.15, 12.25, .15, .2)} size={52} color={GL} />
    <Chip s="“TWO OTHER, MALEFACTORS” · LUKE 23 : 32" y={1210} a={env(t, 14.2, 15.0, .2, .15)} size={24} />
    <Title t={t} t0={15.3} t1={17.3} y={1000} lines={['MARK & MATTHEW']} size={80} style={['c']} from="up" />
    <Sub s="use a sharper Greek word" y={1120} a={env(t, 16.1, 17.3, .2, .2)} size={46} />
    <Title t={t} t0={17.6} t1={18.4} y={1000} lines={['λῃσταί']} size={110} style={['g']} from="slam" />
    <Stamp s="BANDITS" y={1060} t={t} t0={18.4} t1={19.05} color="#ff5a4a" size={92} rot={-4} />
    <Sub s="the same word John uses for…" y={1180} a={env(t, 19.15, 20.7, .2, .15)} size={44} />
    <Title t={t} t0={20.75} t1={21.4} y={1010} lines={['BARABBAS']} size={110} style={['r']} from="slam" />
    <Chip s="JOHN 18 : 40" y={1150} a={env(t, 20.9, 21.4, .1, .15)} />
    <Title t={t} t0={21.7} t1={22.95} y={1030} lines={['THE RULERS MOCK']} size={76} style={['c']} from="up" />
    <Title t={t} t0={23.1} t1={24.2} y={1030} lines={['THE SOLDIERS MOCK']} size={72} style={['c']} from="up" />
    <Sub s="then one of the dying men joins in" y={1150} a={env(t, 24.3, 26.0, .2, .2)} size={46} color={GL} />
    <Title t={t} t0={26.25} t1={28.75} y={960} lines={['“IF THOU BE CHRIST,', 'SAVE THYSELF', 'AND US”']} size={70} style={['c', 'g', 'g']} from="slam" />
    <Chip s="LUKE 23 : 39" y={1240} a={env(t, 26.7, 28.75, .2, .2)} />
    {/* ---- both mocked ---- */}
    <Title t={t} t0={29.0} t1={30.5} y={1040} lines={['THE STRANGE PART']} size={80} style={['r']} from="up" />
    <Title t={t} t0={30.7} t1={33.4} y={860} lines={['“THE THIEVES ALSO…', 'CAST THE SAME', 'IN HIS TEETH”']} size={60} style={['c', 'g', 'g']} from="up" />
    <Chip s="MATTHEW 27 : 44" y={1080} a={env(t, 31.0, 33.4, .2, .2)} />
    <Chip s="MARK 15 : 32 · “REVILED HIM”" y={1160} a={env(t, 32.8, 33.4, .15, .2)} size={26} border={RED} color="#ff8a7a" />
    <Title t={t} t0={33.7} t1={36.1} y={980} lines={['SO HOW DOES ONE', 'END UP IN', 'PARADISE?']} size={74} style={['c', 'c', 'g']} from="up" />
    <Parch t={t} t0={36.2} t1={38.9} y={760} ref_="JEROME · JOHN CHRYSOSTOM" who="church writers, c. 400 AD" lines={['At first, both men mocked.', 'Then one of them', 'changed his mind.']} hi={39.3} size={48} />
    <Title t={t} t0={39.3} t1={40.6} y={1000} lines={['BOTH MOCKED']} size={96} style={['c']} from="slam" />
    <Sub s="hanging there for hours…" y={1150} a={env(t, 40.9, 42.4, .2, .2)} size={52} color={CR} />
    <Stamp s="ONE CHANGED" y={1040} t={t} t0={42.95} t1={43.85} color={GL} size={80} rot={-3} />
    {/* ---- nine words ---- */}
    <Sub s="he turns on the other man" y={1150} a={env(t, 43.95, 45.25, .2, .2)} size={50} color={CR} />
    <Title t={t} t0={45.4} t1={47.0} y={1000} lines={['“DOST NOT THOU', 'FEAR GOD?”']} size={84} style={['c', 'g']} from="slam" />
    <Sub s="“we receive the due reward of our deeds”" y={1150} a={env(t, 47.15, 49.25, .2, .2)} size={42} />
    <Title t={t} t0={49.4} t1={51.4} y={980} lines={['“THIS MAN HATH', 'DONE NOTHING', 'AMISS”']} size={76} style={['c', 'g', 'g']} from="up" />
    <Chip s="LUKE 23 : 40–41" y={1240} a={env(t, 49.8, 51.4, .2, .2)} />
    <Sub s="then he turns to Jesus" y={1150} a={env(t, 51.55, 52.95, .2, .2)} size={52} color={GL} />
    <NineWords t={t} t0={52.95} t1={56.55} />
    <Title t={t} t0={56.75} t1={58.5} y={1020} lines={['A BEATEN MAN']} size={96} style={['c']} from="up" />
    <Sub s="nailed to wood" y={1150} a={env(t, 57.6, 58.5, .15, .2)} size={52} color={CR} />
    <Chip s="“THIS IS THE KING OF THE JEWS” · LUKE 23 : 38" y={1100} a={env(t, 58.7, 60.1, .2, .2)} size={24} />
    <Title t={t} t0={60.35} t1={61.6} y={1030} lines={['HE CALLS HIM', 'LORD']} size={92} style={['c', 'g']} from="slam" />
    <Sub s="and talks about his kingdom" y={1170} a={env(t, 61.7, 63.0, .2, .2)} size={48} color={GL} />
    <Title t={t} t0={63.3} t1={64.5} y={1030} lines={['JESUS ANSWERS']} size={84} style={['c']} from="up" />
    <Title t={t} t0={64.65} t1={68.85} y={900} lines={['“VERILY I SAY', 'UNTO THEE,', 'TO DAY SHALT THOU', 'BE WITH ME', 'IN PARADISE”']} size={66} style={['c', 'c', 'g', 'g', 'g']} from="up" />
    <Chip s="LUKE 23 : 43" y={1290} a={env(t, 66.4, 68.85, .2, .2)} />
    {/* ---- paradise ---- */}
    <Title t={t} t0={69.1} t1={70.3} y={1010} lines={['PARADISE']} size={124} from="slam" />
    <Chip s="OLD PERSIAN · PAIRIDAEZA" y={1150} a={env(t, 70.3, 72.45, .2, .2)} size={28} />
    <Sub s="a walled royal garden" y={1240} a={env(t, 71.35, 72.45, .2, .2)} size={50} color={GL} />
    <Title t={t} t0={72.65} t1={75.0} y={1000} lines={['THE GARDEN', 'OF EDEN']} size={92} style={['c', 'g']} from="up" />
    <Chip s="GENESIS 2 : 8 · GREEK OLD TESTAMENT" y={1230} a={env(t, 73.4, 75.0, .2, .2)} size={24} />
    <Sub s="no baptism" y={1040} a={env(t, 75.4, 76.35, .15, .15)} size={60} color={CR} />
    <Sub s="no time left" y={1040} a={env(t, 76.45, 77.25, .15, .15)} size={60} color={CR} />
    <Title t={t} t0={77.35} t1={78.35} y={1000} lines={['JUST A REQUEST']} size={86} from="slam" />
    {/* ---- the comma ---- */}
    <Comma t={t} t0={78.45} t1={92.9} />
    {/* ---- the names ---- */}
    <Parch t={t} t0={93.3} t1={96.8} y={720} ref_="GOSPEL OF NICODEMUS" who="also called the Acts of Pilate · written centuries later" lines={['The two men crucified', 'with Jesus are given', 'names.']} hi={96.0} size={50} rot={1.2} />
    <Title t={t} t0={97.2} t1={98.55} y={1000} lines={['DISMAS']} size={130} from="slam" />
    <Sub s="the good thief" y={1160} a={env(t, 97.7, 98.55, .15, .2)} size={52} color={GL} />
    <Title t={t} t0={98.75} t1={100.3} y={1000} lines={['GESTAS']} size={130} style={['r']} from="slam" />
    <Sub s="who never asked" y={1160} a={env(t, 99.3, 100.3, .15, .2)} size={52} color={CR} />
    <Title t={t} t0={100.5} t1={101.95} y={1010} lines={['HE CAME A BANDIT']} size={80} style={['c']} from="up" />
    <Title t={t} t0={102.15} t1={104.35} y={960} lines={['HE LEFT WITH', 'A PROMISE']} size={92} style={['c', 'g']} from="up" />
    {/* ---- follow ---- */}
    <AbsoluteFill style={{ background: 'rgba(4,4,9,.72)', opacity: env(t, 104.45, DUR + 1, .4, .1) }} />
    <div style={{ ...abs(CX - 70, 640), width: 140, height: 140, opacity: env(t, 104.55, DUR + 1, .4, .1), borderRadius: '50%', boxShadow: '0 0 0 3px rgba(212,175,106,.8), 0 0 60px rgba(212,175,106,.4)' }}><Logo size={140} /></div>
    <Sub s="@lostscripturesbooks" y={800} a={env(t, 104.7, DUR + 1, .4, .1)} size={40} color={GL} />
    <Title t={t} t0={104.6} t1={DUR + 1} y={880} lines={['FOLLOW']} size={140} from="slam" />
    <Sub s="for more stories from the Bible" y={1060} a={eout(P(t, 105.3, 105.8))} size={50} />
    <Sub s="that most people never hear" y={1125} a={eout(P(t, 106.8, 107.3))} size={50} color={GL} />

    <AbsoluteFill style={{ background: 'radial-gradient(ellipse at 50% 46%, rgba(0,0,0,0) 58%, rgba(0,0,0,.5) 100%)' }} />
    <Hud t={t} /><Captions t={t} />
    <AbsoluteFill style={{ backgroundColor: '#000', opacity: Math.max(1 - P(t, 0, .2), P(t, DUR - .6, DUR)) }} />
  </AbsoluteFill>;
};

/* TikTok cover: grid crops the centre 3:4 (y ≈ 240–1680) — all text inside y 280–1640 */
export const StoryCover: React.FC = () => <AbsoluteFill style={{ backgroundColor: '#040409', overflow: 'hidden' }}>
  <Shot t={1} t0={0} t1={2} pic={THIEF} mode="fit" y={1000} from={[.62, .1, 1.45]} fi={0} fo={0} />
  <AbsoluteFill style={{ background: 'linear-gradient(180deg, rgba(4,4,9,.96) 14%, rgba(4,4,9,.75) 31%, rgba(4,4,9,0) 44%, rgba(4,4,9,0) 62%, rgba(4,4,9,.9) 77%, rgba(4,4,9,.97) 90%)' }} />
  <div style={{ ...abs(CX - 34, 300), width: 68, height: 68 }}><Logo size={68} /></div>
  <div style={{ ...abs(90, 390, 900), textAlign: 'center', fontFamily: CIN, fontWeight: 700, fontSize: 40, letterSpacing: 7, color: CR, opacity: .9 }}>JESUS PROMISED A</div>
  <div style={{ ...abs(90, 450, 900), textAlign: 'center', ...goldText, fontFamily: CIN, fontWeight: 700, fontSize: 104, lineHeight: 1.05, whiteSpace: 'nowrap' }}>CRIMINAL<br />PARADISE</div>
  <div style={{ ...abs(90, 1330, 900), textAlign: 'center', fontFamily: CIN, fontWeight: 700, fontSize: 62, lineHeight: 1.1, color: '#ff6a5a', textShadow: '0 0 30px rgba(220,40,30,.6), 0 4px 10px rgba(0,0,0,.9)' }}>WITH JUST<br />NINE WORDS. WHY?</div>
  <div style={{ ...abs(90, 1530, 900), textAlign: 'center', fontFamily: CORI, fontWeight: 600, fontSize: 40, color: 'rgba(243,231,207,.75)' }}>Luke 23 · Golgotha</div>
  <AbsoluteFill style={{ background: 'radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0) 60%, rgba(0,0,0,.55) 100%)' }} />
</AbsoluteFill>;
