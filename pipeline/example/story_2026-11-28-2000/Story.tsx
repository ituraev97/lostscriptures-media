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
export const DUR = 104.5;
const SANS = 'Inter, sans-serif';
const TIS = 'James Tissot', DOR = 'Gustave Doré', ROB = 'David Roberts';
const MAN: Pic = { src: 'man.jpg', w: 1108, h: 1903, bg: 'man_bg.jpg', credit: TIS + ', The Man with an Infirmity of Thirty-Eight Years (1886–94)' + pd };
const POOL: Pic = { src: 'pool.jpg', w: 1324, h: 2117, bg: 'pool_bg.jpg', credit: TIS + ', The Pool of Bethesda (1886–94)' + pd };
const RBETH: Pic = { src: 'rbeth.jpg', w: 2442, h: 1615, bg: 'rbeth_bg.jpg', credit: ROB + ', The Pool of Bethesda (1842)' + pd };
const HEAL: Pic = { src: 'heal.jpg', w: 2046, h: 2586, bg: 'heal_bg.jpg', credit: DOR + ', Jesus Healing the Sick (1866)' + pd };
const PHAR: Pic = { src: 'phar.jpg', w: 2570, h: 1694, bg: 'phar_bg.jpg', credit: TIS + ', The Pharisees and Sadducees Come to Tempt Jesus (1886–94)' + pd };
const ACC: Pic = { src: 'accuse.jpg', w: 1463, h: 1102, bg: 'accuse_bg.jpg', credit: TIS + ', The Pharisees Accusing Jesus (1886–94)' + pd };
const RJER: Pic = { src: 'rjer.jpg', w: 2536, h: 1662, bg: 'rjer_bg.jpg', credit: ROB + ', Jerusalem from the Road to Bethany (1842)' + pd };
const RNORTH: Pic = { src: 'rnorth.jpg', w: 2485, h: 1580, bg: 'rnorth_bg.jpg', credit: ROB + ', Jerusalem from the North (1842)' + pd };
const KK = 'The King of Kings (1927)' + pd;

type S = { t0: number; t1: number; pic?: Pic; from?: Cam; to?: Cam; mode?: 'cover' | 'fit'; clip?: string; at?: number; vh?: number; credit?: string };
const SH: S[] = [
  { t0: 0, t1: 2.4, clip: 'k3.mp4', at: 2, vh: 816, credit: KK },
  { t0: 2.25, t1: 4.4, pic: MAN, from: [.62, .4, 1.35], to: [.62, .44, 1.7] },
  { t0: 4.25, t1: 6.6, pic: ACC, from: [.45, .4, 1.05], to: [.55, .4, 1.2] },
  { t0: 6.45, t1: 8.3, clip: 'k4.mp4', at: 3.3, vh: 814, credit: KK },
  { t0: 8.15, t1: 10.0, pic: RJER, from: [.25, .4, 1.3], to: [.45, .4, 1.2] },
  { t0: 9.85, t1: 13.4, pic: RBETH, from: [.55, .55, 1.2], to: [.45, .62, 1.45] },
  { t0: 13.25, t1: 15.1, pic: POOL, mode: 'fit', from: [.5, .5, 1.0], to: [.5, .5, 1.1] },
  { t0: 14.95, t1: 18.2, clip: 'k1.mp4', at: 0, vh: 816, credit: KK },
  { t0: 18.05, t1: 21.0, pic: HEAL, from: [.45, .6, 1.3], to: [.35, .65, 1.6] },
  { t0: 20.85, t1: 23.1, pic: POOL, from: [.5, .22, 1.5], to: [.5, .3, 1.25] },
  { t0: 22.95, t1: 26.5, pic: POOL, from: [.4, .82, 1.7], to: [.42, .78, 1.35] },
  { t0: 26.35, t1: 29.6, pic: POOL, mode: 'fit', from: [.5, .5, 1.05], to: [.5, .5, 1.15] },
  { t0: 29.45, t1: 32.75, pic: MAN, from: [.6, .42, 2.0], to: [.6, .45, 2.4] },
  { t0: 32.6, t1: 35.8, clip: 'k3.mp4', at: 5, vh: 816, credit: KK },
  { t0: 35.65, t1: 38.0, pic: MAN, mode: 'fit', from: [.5, .5, 1.0], to: [.5, .5, 1.1] },
  { t0: 37.85, t1: 40.4, clip: 'k6.mp4', at: 0, vh: 814, credit: KK },
  { t0: 40.25, t1: 44.9, clip: 'k2.mp4', at: 0.3, vh: 816, credit: KK },
  { t0: 44.75, t1: 49.1, pic: POOL, from: [.15, .52, 1.6], to: [.75, .5, 1.6] },
  { t0: 48.95, t1: 52.6, pic: MAN, from: [.5, .7, 1.5], to: [.62, .45, 1.9] },
  { t0: 52.45, t1: 54.2, clip: 'k3.mp4', at: 8, vh: 816, credit: KK },
  { t0: 54.05, t1: 55.9, pic: RBETH, from: [.5, .75, 1.7], to: [.5, .75, 1.9] },
  { t0: 55.75, t1: 58.3, pic: MAN, from: [.62, .44, 2.3], to: [.5, .5, 1.0] },
  { t0: 58.15, t1: 61.0, pic: HEAL, mode: 'fit', from: [.5, .5, 1.0], to: [.5, .5, 1.12] },
  { t0: 60.85, t1: 62.4, pic: PHAR, from: [.75, .55, 1.35], to: [.72, .55, 1.5] },
  { t0: 62.25, t1: 66.3, pic: PHAR, from: [.2, .55, 1.4], to: [.6, .55, 1.4] },
  { t0: 66.15, t1: 68.6, pic: ACC, from: [.8, .45, 1.4], to: [.6, .45, 1.2] },
  { t0: 68.45, t1: 71.1, pic: RNORTH, from: [.5, .35, 1.25], to: [.55, .35, 1.45] },
  { t0: 70.95, t1: 74.3, clip: 'k3.mp4', at: 8.8, vh: 816, credit: KK },
  { t0: 74.15, t1: 77.4, pic: ACC, from: [.5, .35, 1.6], to: [.5, .35, 2.0] },
  { t0: 77.25, t1: 80.2, pic: MAN, from: [.62, .44, 1.8], to: [.62, .44, 2.2] },
  { t0: 80.05, t1: 82.9, clip: 'k4.mp4', at: 3.2, vh: 814, credit: KK },
  { t0: 82.75, t1: 86.3, pic: RBETH, from: [.3, .45, 1.4], to: [.5, .5, 1.2] },
  { t0: 86.15, t1: 93.3, pic: RBETH, mode: 'fit', from: [.5, .5, 1.0], to: [.5, .5, 1.1] },
  { t0: 93.15, t1: 97.6, pic: MAN, mode: 'fit', from: [.5, .5, 1.0], to: [.5, .5, 1.15] },
  { t0: 97.45, t1: DUR + .1, pic: POOL, mode: 'fit', from: [.5, .5, 1.0], to: [.5, .5, 1.1] },
];
const CH: [number, string][] = [[0, 'the man'], [8.3, 'bethesda'], [29.7, 'the question'], [52.9, 'rise'], [61.1, 'the sabbath'], [74.4, 'the report'], [83.1, 'the dig']];

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
    <div style={{ position: 'absolute', left: SL + 80, top: y + 4, fontFamily: CORI, fontWeight: 600, fontSize: 27, color: 'rgba(243,231,207,.65)' }}>the pool of Bethesda · John 5</div>
    <div style={{ position: 'absolute', left: SR - 300, top: y - 34, width: 300, textAlign: 'right', fontFamily: MONO, fontSize: 22, color: 'rgba(243,231,207,.45)' }}>{`${ci + 1}/${n}`}</div>
    <div style={{ position: 'absolute', left: SR - 300, top: y - 2 + (1 - ca) * 12, width: 300, textAlign: 'right', fontFamily: CORI, fontWeight: 600, fontSize: 32, color: G, opacity: ca }}>{CH[ci][1]}</div>
    {CH.map(([s], i) => { const en = i < n - 1 ? CH[i + 1][0] : DUR - 1; const p = clamp((t - s) / (en - s));
      return <div key={i} style={{ position: 'absolute', left: SL + i * (sw + gap), top: y + 54, width: sw, height: 5, borderRadius: 3, background: 'rgba(243,231,207,.14)' }}><div style={{ width: `${p * 100}%`, height: '100%', borderRadius: 3, background: i === 5 ? RED : G }} /></div>; })}
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



/* John 5:4 — the manuscripts */
const Mss: React.FC<{ t: number; t0: number; t1: number }> = ({ t, t0, t1 }) => {
  const a = env(t, t0, t1, .35, .3); if (a <= 0) return null;
  const r = eout(P(t, t0, t0 + .5)); const strike = eout(P(t, 28.3, 28.75));
  const rows: [string, string][] = [['PAPYRUS 66', 'c. 200 AD'], ['PAPYRUS 75', 'c. 200 AD'], ['CODEX SINAITICUS', '4th century'], ['CODEX VATICANUS', '4th century']];
  return <div style={{ position: 'absolute', left: CX - 390, top: 600 + (1 - r) * 40, width: 780, opacity: a, rotate: '-1deg', borderRadius: 8, padding: '28px 40px 30px', boxSizing: 'border-box',
    background: 'radial-gradient(ellipse at 45% 40%, #efe0bd 0%, #d9c393 60%, #a98d5c 100%)', boxShadow: '0 24px 70px rgba(0,0,0,.85), inset 0 0 60px rgba(90,60,20,.55)', textAlign: 'center' }}>
    <div style={{ position: 'relative', display: 'inline-block', fontFamily: CIN, fontWeight: 700, fontSize: 52, letterSpacing: 4, color: '#3b2a18' }}>JOHN 5 : 4
      <div style={{ position: 'absolute', left: -14, top: '52%', height: 7, width: `calc(${strike * 100}% + 28px)`, background: '#b0281c', borderRadius: 4, rotate: '-3deg' }} /></div>
    <div style={{ fontFamily: CORI, fontWeight: 600, fontSize: 34, color: '#6b4a22', margin: '6px 0 16px' }}>“an angel went down… and troubled the water”</div>
    {rows.map(([n, d], i) => { const k = eout(P(t, 27.0 + i * .3, 27.35 + i * .3));
      return <div key={i} style={{ display: 'flex', justifyContent: 'space-between', opacity: k, translate: `${(1 - k) * 30}px 0`, borderTop: '1.5px solid rgba(90,60,20,.35)', padding: '8px 6px', fontFamily: CIN, fontWeight: 700, fontSize: 30, color: '#3b2a18' }}>
        <span>{n}</span><span style={{ fontFamily: CORI, fontSize: 32, color: '#6b4a22' }}>{d}</span></div>; })}
    <div style={{ marginTop: 12, fontFamily: CIN, fontWeight: 700, fontSize: 30, letterSpacing: 3, color: '#9a2418', opacity: strike }}>VERSE NOT THERE</div>
  </div>;
};

/* the twin pools and five porches */
const Pools: React.FC<{ t: number; t0: number; t1: number }> = ({ t, t0, t1 }) => {
  const a = env(t, t0, t1, .4, .35); if (a <= 0) return null;
  const x0 = 190, y0 = 700, w = 620, h = 580, my = y0 + h * .47;
  const draw = eout(P(t, 87.3, 88.2)), wall = eout(P(t, 88.55, 89.1));
  const side = (i: number) => eout(P(t, 89.72 + i * .2, 89.95 + i * .2)), mid = eout(P(t, 90.85, 91.3));
  const por = (x: number, y: number, ww: number, hh: number, k: number, key: number) => <rect key={key} x={x} y={y} width={ww} height={hh} rx={6} fill={`rgba(243,212,140,${.85 * k})`} stroke={G} strokeWidth={k > 0 ? 3 : 0} style={{ filter: k > 0 ? 'url(#gl)' : undefined }} />;
  const pw = 26;
  return <div style={{ position: 'absolute', inset: 0, opacity: a }}>
    <AbsoluteFill style={{ background: 'rgba(4,4,9,.6)' }} />
    <svg width={W} height={H} style={{ position: 'absolute', left: 0, top: 0 }}>
      <defs><filter id="gl"><feGaussianBlur stdDeviation="6" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
        <linearGradient id="wa" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#2c5a72" /><stop offset="1" stopColor="#123045" /></linearGradient></defs>
      <rect x={x0} y={y0} width={w} height={(my - y0 - 12) * draw} fill="url(#wa)" opacity={.85} stroke="#c9b48a" strokeWidth={3} />
      <rect x={x0} y={my + 12} width={w} height={(y0 + h - my - 12) * draw} fill="url(#wa)" opacity={.85} stroke="#c9b48a" strokeWidth={3} />
      <rect x={x0 - 10} y={my - 12} width={(w + 20) * wall} height={24} fill="#d9c393" />
      {por(x0 - pw - 10, y0 - pw - 10, w + 2 * pw + 20, pw, side(0), 1)}
      {por(x0 + w + 10, y0 - 10, pw, h + 20, side(1), 2)}
      {por(x0 - pw - 10, y0 + h + 10, w + 2 * pw + 20, pw, side(2), 3)}
      {por(x0 - pw - 10, y0 - 10, pw, h + 20, side(3), 4)}
      {por(x0 - 10, my - 13, w + 20, 26, mid, 5)}
    </svg>
    <div style={{ position: 'absolute', left: CX - 200, top: y0 + (my - y0) / 2 - 30, width: 400, textAlign: 'center', fontFamily: CIN, fontWeight: 700, fontSize: 40, letterSpacing: 4, color: CR, opacity: draw * (1 - mid) }}>NORTH POOL</div>
    <div style={{ position: 'absolute', left: CX - 200, top: my + (y0 + h - my) / 2 - 30, width: 400, textAlign: 'center', fontFamily: CIN, fontWeight: 700, fontSize: 40, letterSpacing: 4, color: CR, opacity: draw * (1 - mid) }}>SOUTH POOL</div>
    {[0, 1, 2, 3].map(i => <div key={i} style={{ position: 'absolute', left: [CX - 30, x0 + w + 46, CX - 30, x0 - 110][i], top: [y0 - 110, my - 60, y0 + h + 44, my - 60][i], width: 60, textAlign: 'center', fontFamily: CIN, fontWeight: 700, fontSize: 56, color: GL, opacity: side(i), textShadow: '0 0 20px rgba(240,190,100,.8)' }}>{i + 1}</div>)}
    <div style={{ position: 'absolute', left: CX - 40, top: my - 36, width: 80, height: 72, borderRadius: 36, background: '#0a0812', border: `3px solid ${G}`, textAlign: 'center', fontFamily: CIN, fontWeight: 700, fontSize: 52, lineHeight: '72px', color: GL, opacity: mid, scale: String(lerp(1.8, 1, eout(P(t, 90.85, 91.1)))) }}>5</div>
  </div>;
};

const HITS: [number, number, number][] = [[0.2, 10, 6], [2.25, 16, 5], [5.79, 12, 6], [12.68, 14, 5], [23.26, 14, 5], [28.31, 12, 6], [31.51, 16, 5], [36.0, 12, 6], [40.25, 12, 6], [51.69, 12, 6], [55.99, 20, 4], [61.7, 14, 5], [76.6, 16, 5], [78.46, 14, 5], [81.82, 14, 5], [83.33, 12, 6], [92.25, 14, 5], [95.52, 12, 6], [97.54, 10, 6]];
const shotAt = (t: number) => { let s: S = SH[0]; for (const x of SH) if (t >= x.t0 + .15) s = x; return s; };

export const StoryVideo: React.FC = () => {
  const t = useCurrentFrame() / FPS;
  let sx = 0, sy = 0; for (const [h, amp, dec] of HITS) { const [x, y] = shake(t, h, amp, dec); sx += x; sy += y; }
  const cur = shotAt(t);
  const flash = Math.max(env(t, 2.22, 2.6, .03, .3) * .45, env(t, 23.22, 23.6, .03, .3) * .5, env(t, 55.95, 56.4, .03, .4) * .7, env(t, 76.56, 76.95, .03, .35) * .45, env(t, 92.2, 92.6, .03, .35) * .4);
  return <AbsoluteFill style={{ backgroundColor: '#040409', overflow: 'hidden' }}>
    <div style={{ position: 'absolute', inset: 0, translate: `${sx}px ${sy}px`, scale: '1.03' }}>
      {SH.map((s, i) => s.clip ? <Clip key={i} t={t} t0={s.t0} t1={s.t1} clip={s.clip} at={s.at} vw={1080} vh={s.vh!} mode="band" />
        : <Shot key={i} t={t} t0={s.t0} t1={s.t1} pic={s.pic!} from={s.from!} to={s.to} mode={s.mode} />)}
    </div>
    <PhotoShade />
    {/* water light for the angel */}
    <AbsoluteFill style={{ background: 'radial-gradient(ellipse at 45% 70%, rgba(150,210,255,.3) 0%, rgba(40,90,140,.12) 50%, rgba(0,0,0,0) 100%)', opacity: env(t, 22.95, 26.5, .5, .5) }} />
    {/* warm healing glow */}
    <AbsoluteFill style={{ background: 'radial-gradient(ellipse at 50% 45%, rgba(255,200,110,.32) 0%, rgba(160,90,20,.1) 55%, rgba(0,0,0,0) 100%)', opacity: Math.max(env(t, 55.9, 61.0, .3, .5), env(t, 93.2, 97.6, .5, .5)) }} />
    {/* cold for the report */}
    <AbsoluteFill style={{ background: 'radial-gradient(ellipse at 50% 55%, rgba(20,30,60,0) 30%, rgba(20,30,60,.5) 100%)', opacity: env(t, 74.15, 82.9, .5, .5) }} />
    {/* dim for panels */}
    <AbsoluteFill style={{ background: 'rgba(4,4,9,.62)', opacity: Math.max(env(t, 26.5, 29.6, .3, .3), env(t, 41.4, 48.9, .3, .3)) }} />
    <AbsoluteFill style={{ background: '#FFF6E0', opacity: flash * .7 }} />
    <Credit s={t < DUR - 7 ? (cur.credit ?? cur.pic?.credit) : undefined} a={1} />

    {/* ---- the man ---- */}
    <Title t={t} t0={0.26} t1={2.2} y={980} lines={['JESUS HEALED', 'A MAN']} size={84} style={['c']} from="up" />
    <Title t={t} t0={2.25} t1={4.25} y={920} lines={['AFTER', '38 YEARS']} size={120} style={['c', 'g']} from="slam" />
    <Title t={t} t0={4.4} t1={6.6} y={940} lines={['HE WENT STRAIGHT', 'TO THE AUTHORITIES']} size={70} style={['c', 'r']} from="slam" />
    <Sub s="…and told them who did it" y={1060} a={env(t, 6.8, 8.2, .2, .2)} size={50} color={GL} />
    {/* ---- bethesda ---- */}
    <Chip s="JOHN 5 : 1–18" y={1080} a={env(t, 8.34, 9.7, .2, .2)} />
    <Title t={t} t0={9.81} t1={10.9} y={960} lines={['JERUSALEM']} size={110} from="slam" />
    <Sub s="by the sheep gate…" y={1060} a={env(t, 10.95, 12.6, .2, .2)} size={50} color={CR} />
    <Title t={t} t0={12.68} t1={13.4} y={960} lines={['BETHESDA']} size={130} style={['g']} from="slam" />
    <Title t={t} t0={13.45} t1={15.05} y={930} lines={['“HAVING', 'FIVE PORCHES”']} size={90} style={['c', 'g']} from="up" />
    <Chip s="JOHN 5 : 2" y={1170} a={env(t, 13.8, 15.05, .2, .2)} />
    <Title t={t} t0={15.15} t1={17.2} y={960} lines={['A GREAT', 'MULTITUDE']} size={96} style={['c', 'g']} from="up" />
    <Title t={t} t0={17.3} t1={19.1} y={880} lines={['BLIND', 'LAME', 'WITHERED']} size={96} style={['c', 'c', 'r']} from="slam" />
    <Sub s="all waiting for the water to move" y={1080} a={env(t, 19.15, 21.0, .2, .2)} size={48} color={GL} />
    <Chip s="THE KING JAMES BIBLE" y={1080} a={env(t, 21.15, 22.3, .2, .2)} size={30} />
    <Title t={t} t0={22.32} t1={23.15} y={980} lines={['SAYS WHY']} size={100} style={['g']} from="slam" />
    <Title t={t} t0={23.26} t1={24.15} y={960} lines={['AN ANGEL']} size={120} style={['g']} from="slam" />
    <Sub s="troubled the water…" y={1000} a={env(t, 24.2, 25.0, .2, .15)} size={54} color={CR} />
    <Title t={t} t0={25.05} t1={26.5} y={930} lines={['FIRST ONE IN', 'WAS HEALED']} size={84} style={['c', 'g']} from="up" />
    <Mss t={t} t0={26.55} t1={29.65} />
    {/* ---- the question ---- */}
    <Sub s="one man had been lying there…" y={1060} a={env(t, 29.8, 31.4, .2, .2)} size={48} color={CR} />
    <Counter t={t} t0={31.51} t1={32.75} n={38} y={880} label="YEARS" />
    <Sub s="Jesus saw him…" y={1060} a={env(t, 32.95, 34.5, .2, .2)} size={52} color={CR} />
    <Title t={t} t0={34.55} t1={35.8} y={960} lines={['A STRANGE', 'QUESTION']} size={92} style={['c', 'g']} from="up" />
    <Title t={t} t0={35.95} t1={38.05} y={900} lines={['“WILT THOU', 'BE MADE', 'WHOLE?”']} size={106} style={['c', 'g', 'g']} from="slam" />
    <Chip s="JOHN 5 : 6" y={1270} a={env(t, 36.3, 38.0, .2, .2)} />
    <Title t={t} t0={38.18} t1={39.35} y={980} lines={['WHY ASK THAT?']} size={88} style={['g']} from="slam" />
    <Title t={t} t0={39.4} t1={40.2} y={980} lines={['THE MAN…']} size={90} style={['c']} from="up" />
    <Stamp s="NEVER SAYS YES" y={1000} t={t} t0={40.25} t1={41.4} color={RED} size={70} rot={-4} />
    <Parch t={t} t0={41.45} t1={48.95} y={600} ref_="JOHN 5 : 7" who="the man at the pool" lines={['“Sir, I have no man,', 'when the water is troubled,', 'to put me into the pool:', 'but while I am coming,', 'another steppeth down', 'before me.”']} hi={41.5} size={48} />
    <Title t={t} t0={49.23} t1={51.6} y={940} lines={['38 YEARS', 'NO ONE TO CARRY HIM']} size={74} style={['g', 'c']} from="up" />
    <Title t={t} t0={51.69} t1={52.75} y={960} lines={['FOUR STEPS']} size={120} style={['r']} from="slam" />
    {/* ---- rise ---- */}
    <Title t={t} t0={53.76} t1={54.5} y={980} lines={['NO TOUCH']} size={110} style={['c']} from="slam" />
    <Title t={t} t0={54.9} t1={55.9} y={980} lines={['NO POOL']} size={110} style={['c']} from="slam" />
    <Title t={t} t0={55.99} t1={56.5} y={940} lines={['RISE']} size={190} style={['g']} from="slam" />
    <Title t={t} t0={56.5} t1={58.3} y={920} lines={['RISE, TAKE UP', 'THY BED,', 'AND WALK']} size={92} style={['g', 'c', 'g']} from="up" />
    <Chip s="JOHN 5 : 8" y={1250} a={env(t, 56.8, 58.3, .2, .2)} />
    <Title t={t} t0={58.49} t1={60.2} y={980} lines={['IMMEDIATELY']} size={100} style={['g']} from="slam" />
    <Sub s="the man was made whole" y={1110} a={env(t, 59.4, 61.0, .2, .2)} size={54} color={GL} />
    {/* ---- the sabbath ---- */}
    <Stamp s="THE SABBATH" y={1000} t={t} t0={61.7} t1={62.5} color={RED} size={84} rot={-4} />
    <Sub s="the leaders stopped him" y={1060} a={env(t, 62.5, 63.45, .2, .15)} size={52} color={CR} />
    <Title t={t} t0={63.53} t1={66.3} y={920} lines={['“IT IS NOT LAWFUL', 'FOR THEE TO', 'CARRY THY BED”']} size={74} style={['c', 'c', 'r']} from="up" />
    <Chip s="JOHN 5 : 10" y={1190} a={env(t, 64.0, 66.3, .2, .2)} />
    <Title t={t} t0={66.46} t1={68.6} y={940} lines={['HE DIDN’T EVEN KNOW', 'WHO HEALED HIM']} size={58} style={['c', 'g']} from="up" />
    <Chip s="JOHN 5 : 13" y={1110} a={env(t, 67.0, 68.6, .2, .2)} />
    <Sub s="later, in the temple…" y={1060} a={env(t, 68.8, 71.1, .2, .2)} size={52} color={CR} />
    <Title t={t} t0={71.26} t1={72.35} y={960} lines={['“SIN NO MORE”']} size={104} style={['g']} from="slam" />
    <Title t={t} t0={72.42} t1={74.3} y={920} lines={['“LEST A WORSE', 'THING COME', 'UNTO THEE”']} size={82} style={['c', 'c', 'r']} from="up" />
    <Chip s="JOHN 5 : 14" y={1210} a={env(t, 72.8, 74.3, .2, .2)} />
    {/* ---- the report ---- */}
    <Title t={t} t0={74.48} t1={76.5} y={960} lines={['AND THE MAN', 'WENT AND TOLD THEM']} size={60} style={['c', 'g']} from="up" />
    <Stamp s="IT WAS JESUS" y={1000} t={t} t0={76.6} t1={77.45} color={RED} size={84} rot={-4} />
    <Chip s="JOHN 5 : 15" y={1150} a={env(t, 76.7, 77.45, .2, .2)} />
    <Title t={t} t0={77.55} t1={78.42} y={960} lines={['GRATITUDE?']} size={110} style={['g']} from="slam" />
    <Title t={t} t0={78.46} t1={79.45} y={960} lines={['OR BETRAYAL?']} size={104} style={['r']} from="slam" />
    <Sub s="John doesn’t say." y={1060} a={env(t, 79.5, 80.85, .2, .2)} size={56} color={CR} />
    <Title t={t} t0={80.91} t1={82.9} y={920} lines={['FROM THAT DAY', 'THEY SOUGHT', 'TO KILL HIM']} size={86} style={['c', 'c', 'r']} from="up" />
    <Chip s="JOHN 5 : 16–18" y={1230} a={env(t, 81.4, 82.9, .2, .2)} />
    {/* ---- the dig ---- */}
    <Title t={t} t0={83.33} t1={84.3} y={960} lines={['THE 1880s']} size={120} style={['g']} from="slam" />
    <Sub s="beside the Church of Saint Anne" y={1060} a={env(t, 84.35, 86.1, .2, .2)} size={50} color={CR} />
    <Stamp s="DUG UP" y={1000} t={t} t0={86.19} t1={87.2} color={G} size={96} rot={-4} />
    <Pools t={t} t0={87.2} t1={93.25} />
    <Title t={t} t0={87.3} t1={89.6} y={475} lines={['TWO GREAT POOLS']} size={64} style={['g']} from="up" />
    <Title t={t} t0={89.65} t1={92.2} y={475} lines={['FOUR SIDES + THE MIDDLE']} size={54} style={['c']} from="up" />
    <Title t={t} t0={92.25} t1={93.25} y={475} lines={['FIVE PORCHES']} size={84} style={['g']} from="slam" />
    <Sub s="and the question is still there" y={1060} a={env(t, 93.6, 95.4, .2, .2)} size={50} color={CR} />
    <Title t={t} t0={95.52} t1={97.45} y={900} lines={['“WILT THOU', 'BE MADE', 'WHOLE?”']} size={106} style={['c', 'g', 'g']} from="slam" />
    {/* ---- follow ---- */}
    <AbsoluteFill style={{ background: 'rgba(4,4,9,.72)', opacity: env(t, 97.4, DUR + 1, .4, .1) }} />
    <div style={{ ...abs(CX - 70, 640), width: 140, height: 140, opacity: env(t, 97.5, DUR + 1, .4, .1), borderRadius: '50%', boxShadow: '0 0 0 3px rgba(212,175,106,.8), 0 0 60px rgba(212,175,106,.4)' }}><Logo size={140} /></div>
    <Sub s="@lostscripturesbooks" y={800} a={env(t, 97.6, DUR + 1, .4, .1)} size={40} color={GL} />
    <Title t={t} t0={97.54} t1={DUR + 1} y={880} lines={['FOLLOW']} size={140} from="slam" />
    <Sub s="for more stories from the Bible" y={1060} a={eout(P(t, 98.3, 98.8))} size={50} />
    <Sub s="that most people never hear" y={1125} a={eout(P(t, 99.9, 100.4))} size={50} color={GL} />

    <AbsoluteFill style={{ background: 'radial-gradient(ellipse at 50% 46%, rgba(0,0,0,0) 58%, rgba(0,0,0,.5) 100%)' }} />
    <Hud t={t} /><Captions t={t} />
    <AbsoluteFill style={{ backgroundColor: '#000', opacity: Math.max(1 - P(t, 0, .2), P(t, DUR - .6, DUR)) }} />
  </AbsoluteFill>;
};

/* TikTok cover: grid crops the centre 3:4 (y ≈ 240–1680) — all text inside y 280–1640 */
export const StoryCover: React.FC = () => <AbsoluteFill style={{ backgroundColor: '#040409', overflow: 'hidden' }}>
  <Shot t={1} t0={0} t1={2} pic={MAN} mode="cover" from={[.6, .45, 1.25]} fi={0} fo={0} />
  <AbsoluteFill style={{ background: 'linear-gradient(180deg, rgba(4,4,9,.96) 14%, rgba(4,4,9,.75) 31%, rgba(4,4,9,0) 44%, rgba(4,4,9,0) 62%, rgba(4,4,9,.9) 77%, rgba(4,4,9,.97) 90%)' }} />
  <div style={{ ...abs(CX - 34 + 40, 300), width: 68, height: 68 }}><Logo size={68} /></div>
  <div style={{ ...abs(90, 390, 900), textAlign: 'center', fontFamily: CIN, fontWeight: 700, fontSize: 40, letterSpacing: 6, color: CR, opacity: .9 }}>HEALED AFTER 38 YEARS</div>
  <div style={{ ...abs(90, 450, 900), textAlign: 'center', ...goldText, fontFamily: CIN, fontWeight: 700, fontSize: 100, lineHeight: 1.05, whiteSpace: 'nowrap' }}>HE REPORTED<br />JESUS</div>
  <div style={{ ...abs(90, 1340, 900), textAlign: 'center', fontFamily: CIN, fontWeight: 700, fontSize: 64, lineHeight: 1.1, color: '#ff6a5a', textShadow: '0 0 30px rgba(220,40,30,.6), 0 4px 10px rgba(0,0,0,.9)' }}>JOHN 5 : 15</div>
  <div style={{ ...abs(90, 1530, 900), textAlign: 'center', fontFamily: CORI, fontWeight: 600, fontSize: 40, color: 'rgba(243,231,207,.75)' }}>the man at the pool of Bethesda</div>
  <AbsoluteFill style={{ background: 'radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0) 60%, rgba(0,0,0,.55) 100%)' }} />
</AbsoluteFill>;
