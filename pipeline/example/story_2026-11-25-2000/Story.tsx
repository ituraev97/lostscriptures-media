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

export const DUR = 108.7;
const SANS = 'Inter, sans-serif';
const GRK = '"DejaVu Serif", serif';
const pd = ' · public domain';
const ROOF: Pic = { src: 'roof.jpg', w: 1502, h: 2114, bg: 'roof_bg.jpg', credit: 'James Tissot, The Palsied Man Let Down Through the Roof (1886–94)' + pd };
const DOOR: Pic = { src: 'door.jpg', w: 1732, h: 2376, bg: 'door_bg.jpg', credit: 'James Tissot, All the City Was Gathered Together at the Door (1886–94)' + pd };
const SYN: Pic = { src: 'syn.jpg', w: 1443, h: 1732, bg: 'syn_bg.jpg', credit: 'James Tissot, The Man with an Unclean Spirit in the Synagogue (1886–94)' + pd };
const SIMON: Pic = { src: 'simon.jpg', w: 1536, h: 1320, bg: 'simon_bg.jpg', credit: 'James Tissot, Healing of Simon’s Wife’s Mother, Capernaum (1886–94)' + pd };
const PUB: Pic = { src: 'publican.jpg', w: 2170, h: 2600, bg: 'publican_bg.jpg', credit: 'Gustave Doré, The Pharisee and the Publican (1866)' + pd };
const ADUL: Pic = { src: 'adultery.jpg', w: 2105, h: 2548, bg: 'adultery_bg.jpg', credit: 'Gustave Doré, Jesus and the Woman Taken in Adultery (1866)' + pd };
const REND: Pic = { src: 'rend.jpg', w: 2600, h: 1419, bg: 'rend_bg.jpg', credit: 'James Tissot, The High Priest Rends His Clothes (1886–94)' + pd };
const ANNAS: Pic = { src: 'annas.jpg', w: 1587, h: 1235, bg: 'annas_bg.jpg', credit: 'James Tissot, Annas and Caiaphas (1886–94)' + pd };
const SEA: Pic = { src: 'sea.jpg', w: 2444, h: 1665, bg: 'sea_bg.jpg', credit: 'David Roberts, The Sea of Tiberias, Looking Towards Bashan (1839)' + pd };
const TIB: Pic = { src: 'tiberias.jpg', w: 2415, h: 1594, bg: 'tiberias_bg.jpg', credit: 'David Roberts, Tiberias, Looking Towards Hermon (1839)' + pd };
const FM = 'From the Manger to the Cross (1912), filmed in Palestine' + pd;
const KK = 'The King of Kings (1927)' + pd;

type S = { t0: number; t1: number; pic?: Pic; from?: Cam; to?: Cam; mode?: 'cover' | 'fit'; clip?: string; at?: number; vh?: number; credit?: string };
const SH: S[] = [
  { t0: 0, t1: 2.6, pic: ROOF, from: [.5, .14, 1.6], to: [.5, .28, 1.3] },
  { t0: 2.45, t1: 4.9, pic: ROOF, from: [.5, .4, 1.9], to: [.5, .36, 2.3] },
  { t0: 4.75, t1: 7.0, clip: 'kk_heal.mp4', at: 0, vh: 814, credit: KK },
  { t0: 6.85, t1: 9.3, pic: ROOF, mode: 'fit', from: [.5, .5, 1.0], to: [.5, .5, 1.1] },
  { t0: 9.15, t1: 11.5, pic: SEA, from: [.3, .5, 1.0], to: [.45, .5, 1.15] },
  { t0: 11.35, t1: 14.0, pic: TIB, from: [.45, .55, 1.1], to: [.4, .5, 1.3] },
  { t0: 13.85, t1: 16.9, pic: DOOR, from: [.5, .6, 1.15], to: [.55, .7, 1.35] },
  { t0: 16.75, t1: 19.3, clip: 'fm_walk.mp4', at: 0, vh: 724, credit: FM },
  { t0: 19.15, t1: 21.7, pic: DOOR, from: [.75, .82, 1.8], to: [.7, .78, 2.1] },
  { t0: 21.55, t1: 23.5, pic: SIMON, from: [.3, .55, 1.4], to: [.3, .45, 1.7] },
  { t0: 23.35, t1: 26.0, pic: SIMON, from: [.6, .3, 1.6], to: [.5, .2, 1.9] },
  { t0: 25.85, t1: 29.7, pic: SIMON, mode: 'fit', from: [.5, .5, 1.0], to: [.5, .5, 1.1] },
  { t0: 29.55, t1: 31.6, pic: ROOF, from: [.5, .08, 2.4], to: [.5, .12, 2.0] },
  { t0: 31.45, t1: 33.6, pic: ROOF, from: [.3, .66, 1.8], to: [.3, .6, 2.2] },
  { t0: 33.45, t1: 36.7, pic: ROOF, from: [.5, .22, 1.25], to: [.5, .42, 1.7] },
  { t0: 36.55, t1: 38.9, clip: 'fm_street.mp4', at: 1, vh: 724, credit: FM },
  { t0: 38.75, t1: 40.5, pic: ROOF, from: [.62, .55, 2.0], to: [.72, .55, 2.3] },
  { t0: 40.35, t1: 43.7, clip: 'kk_plead.mp4', at: 0, vh: 814, credit: KK },
  { t0: 43.55, t1: 46.3, clip: 'kk_heal.mp4', at: 2.5, vh: 814, credit: KK },
  { t0: 46.15, t1: 47.7, pic: ROOF, from: [.5, .37, 2.5], to: [.5, .37, 2.9] },
  { t0: 47.55, t1: 51.0, pic: SYN, from: [.5, .72, 1.2], to: [.5, .62, 1.4] },
  { t0: 50.85, t1: 56.4, pic: SYN, mode: 'fit', from: [.5, .5, 1.0], to: [.5, .5, 1.12] },
  { t0: 56.25, t1: 58.4, pic: ADUL, from: [.22, .5, 1.5], to: [.25, .45, 1.8] },
  { t0: 58.25, t1: 60.3, pic: ANNAS, from: [.32, .42, 1.05], to: [.32, .4, 1.25] },
  { t0: 60.15, t1: 62.4, pic: PUB, from: [.75, .55, 1.6], to: [.75, .45, 1.95] },
  { t0: 62.25, t1: 64.0, clip: 'kk_caiaphas.mp4', at: 0.3, vh: 814, credit: KK },
  { t0: 63.85, t1: 68.7, pic: PUB, from: [.5, .32, 1.15], to: [.5, .3, 1.35] },
  { t0: 68.55, t1: 71.2, pic: ADUL, from: [.6, .42, 1.6], to: [.6, .36, 1.9] },
  { t0: 71.05, t1: 74.4, pic: ROOF, mode: 'fit', from: [.5, .5, 1.0], to: [.5, .5, 1.1] },
  { t0: 74.25, t1: 77.2, clip: 'kk_boy.mp4', at: 0, vh: 814, credit: KK },
  { t0: 77.05, t1: 79.3, clip: 'kk_boy.mp4', at: 4.0, vh: 814, credit: KK },
  { t0: 79.15, t1: 83.2, pic: ADUL, from: [.6, .48, 1.2], to: [.6, .38, 1.5] },
  { t0: 83.05, t1: 86.5, clip: 'kk_heal.mp4', at: 5.0, vh: 814, credit: KK },
  { t0: 86.35, t1: 89.2, pic: ROOF, from: [.5, .42, 1.6], to: [.5, .5, 1.0] },
  { t0: 89.05, t1: 90.8, clip: 'fm_walk.mp4', at: 3.0, vh: 724, credit: FM },
  { t0: 90.65, t1: 93.0, pic: DOOR, from: [.62, .4, 1.6], to: [.66, .36, 1.9] },
  { t0: 92.85, t1: 95.4, pic: ANNAS, from: [.7, .45, 1.0], to: [.7, .42, 1.15] },
  { t0: 95.25, t1: 98.0, pic: REND, mode: 'fit', from: [.5, .5, 1.0], to: [.6, .5, 1.25] },
  { t0: 97.85, t1: 100.2, pic: REND, from: [.3, .5, 1.3], to: [.42, .5, 1.12] },
  { t0: 100.05, t1: 103.4, pic: ROOF, from: [.5, .15, 1.8], to: [.5, .22, 1.35] },
  { t0: 103.25, t1: DUR + .1, pic: ROOF, mode: 'fit', from: [.5, .5, 1.0], to: [.5, .5, 1.1] },
];
const CH: [number, string][] = [[0, 'the roof'], [17.2, 'the four'], [40.5, 'forgiven'], [56.4, 'blasphemy'], [68.7, 'which is easier'], [93.0, 'the trial']];
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
    <div style={{ position: 'absolute', left: SL + 80, top: y + 4, fontFamily: CORI, fontWeight: 600, fontSize: 27, color: 'rgba(243,231,207,.65)' }}>the roof broken up · Mark 2</div>
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

/* Capernaum roof: beams, branches, packed mud on basalt walls */
const RoofLayers: React.FC<{ t: number; t0: number; t1: number }> = ({ t, t0, t1 }) => {
  const a = env(t, t0, t1, .35, .3); if (a <= 0) return null;
  const w0 = eout(P(t, t0, t0 + .5)), b = eout(P(t, 27.75, 28.15)), br = eout(P(t, 28.15, 28.6)), m = eout(P(t, 28.95, 29.3));
  const x0 = 170, x1 = 830;
  return <svg style={{ position: 'absolute', left: 0, top: 0, opacity: a }} width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
    <defs>
      <pattern id="bas" width="60" height="40" patternUnits="userSpaceOnUse"><rect width="60" height="40" fill="#2a2a2e" /><rect x="2" y="2" width="56" height="17" rx="5" fill="#3a3a40" /><rect x="-28" y="21" width="56" height="17" rx="5" fill="#34343a" /><rect x="32" y="21" width="56" height="17" rx="5" fill="#3d3d44" /></pattern>
      <linearGradient id="mud" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#b08a5a" /><stop offset="1" stopColor="#7a5a36" /></linearGradient>
      <linearGradient id="beam" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#8a5a2b" /><stop offset="1" stopColor="#4e2f14" /></linearGradient>
    </defs>
    <rect x={130} y={560} width={740} height={720} rx={24} fill="rgba(8,6,12,.82)" stroke={G} strokeWidth={2.5} />
    {/* basalt walls */}
    <g opacity={w0}><rect x={x0} y={960} width={110} height={280} fill="url(#bas)" stroke="#555" /><rect x={x1 - 110} y={960} width={110} height={280} fill="url(#bas)" stroke="#555" />
      <text x={CX} y={1210} textAnchor="middle" fontFamily={CIN} fontWeight={700} fontSize={34} fill={CR}>BLACK BASALT WALLS</text></g>
    {/* beams */}
    <g opacity={b} transform={`translate(0 ${(1 - b) * -30})`}>
      <rect x={x0 - 10} y={910} width={x1 - x0 + 20} height={46} rx={6} fill="url(#beam)" />
      {[0, 1, 2, 3, 4, 5, 6].map(i => <circle key={i} cx={x0 + 40 + i * 95} cy={933} r={10} fill="#3a2410" />)}
      <text x={CX} y={945} textAnchor="middle" fontFamily={CIN} fontWeight={700} fontSize={30} fill={GL} stroke="#2a1608" strokeWidth={6} paintOrder="stroke">WOODEN BEAMS</text></g>
    {/* branches */}
    <g opacity={br} transform={`translate(0 ${(1 - br) * -30})`}>
      <rect x={x0 - 10} y={862} width={x1 - x0 + 20} height={48} rx={4} fill="#3e4420" />
      {Array.from({ length: 26 }).map((_, i) => <path key={i} d={`M ${x0 - 5 + i * 26} 902 q 14 -26 30 -10 q 10 -20 24 -4`} stroke={i % 2 ? '#7d8a3a' : '#9a8a48'} strokeWidth={6} fill="none" strokeLinecap="round" />)}
      <text x={CX} y={898} textAnchor="middle" fontFamily={CIN} fontWeight={700} fontSize={30} fill={GL} stroke="#1c2008" strokeWidth={6} paintOrder="stroke">BRANCHES</text></g>
    {/* mud */}
    <g opacity={m} transform={`translate(0 ${(1 - m) * -30})`}>
      <path d={`M ${x0 - 10} 862 L ${x0 - 10} 790 Q ${CX} 762 ${x1 + 10} 790 L ${x1 + 10} 862 Z`} fill="url(#mud)" />
      <text x={CX} y={838} textAnchor="middle" fontFamily={CIN} fontWeight={700} fontSize={36} fill="#2b1a0c">PACKED MUD</text></g>
    <text x={CX} y={650} textAnchor="middle" fontFamily={CIN} fontWeight={700} fontSize={40} fill={CR} opacity={w0}>A CAPERNAUM ROOF</text>
    <text x={CX} y={700} textAnchor="middle" fontFamily={CORI} fontWeight={600} fontSize={30} fill="rgba(243,231,207,.75)" opacity={w0}>light enough to dig through</text>
  </svg>;
};

/* which is easier: two cards */
const Easier: React.FC<{ t: number; t0: number; t1: number }> = ({ t, t0, t1 }) => {
  const a = env(t, t0, t1, .35, .3); if (a <= 0) return null;
  const c1 = eout(P(t, 71.25, 71.7)), c2 = eout(P(t, 72.95, 73.4)), l1 = eout(P(t, 76.2, 76.55)), l2 = eout(P(t, 78.1, 78.45));
  const dim1 = lerp(1, .55, eout(P(t, 77.2, 77.6)));
  const Card: React.FC<{ x: number; c: number; q: string[]; lab: string; l: number; col: string; op: number }> = ({ x, c, q, lab, l, col, op }) => c <= 0 ? null :
    <div style={{ position: 'absolute', left: x, top: 820 + (1 - c) * 40, width: 380, opacity: c * op }}>
      <div style={{ height: 250, borderRadius: 18, background: 'rgba(10,8,18,.9)', border: `3px solid ${G}`, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', boxShadow: '0 16px 50px rgba(0,0,0,.7)' }}>
        {q.map((s, i) => <div key={i} style={{ fontFamily: CIN, fontWeight: 700, fontSize: 40, lineHeight: 1.15, ...goldText }}>{s}</div>)}
      </div>
      {l > 0 && <div style={{ marginTop: 22, textAlign: 'center', opacity: l, scale: String(lerp(1.5, 1, l)), fontFamily: CIN, fontWeight: 700, fontSize: 30, letterSpacing: 2, color: col, textShadow: '0 2px 12px #000' }}>{lab}</div>}
    </div>;
  return <div style={{ position: 'absolute', inset: 0, opacity: a }}>
    <div style={{ position: 'absolute', left: SL, top: 660, width: SR - SL, textAlign: 'center', fontFamily: CIN, fontWeight: 700, fontSize: 62, color: CR, textShadow: '0 4px 18px #000', opacity: eout(P(t, t0, t0 + .4)) }}>WHICH IS EASIER?</div>
    <Card x={95} c={c1} q={['“THY SINS', 'BE FORGIVEN”']} lab="NOBODY CAN CHECK" l={l1} col="#ff6a5a" op={dim1} />
    <Card x={525} c={c2} q={['“ARISE,', 'AND WALK”']} lab="EVERYONE CAN" l={l2} col={GL} op={1} />
    <div style={{ position: 'absolute', left: CX - 30, top: 920, width: 60, textAlign: 'center', fontFamily: CORI, fontWeight: 600, fontSize: 44, color: CR, opacity: c2 }}>or</div>
  </div>;
};

const HITS: [number, number, number][] = [[0.25, 12, 6], [1.4, 14, 6], [5.8, 16, 5], [9.4, 10, 6], [15.3, 12, 6], [22.9, 14, 5], [25.5, 10, 6], [30.8, 16, 5], [31.7, 10, 6], [39.8, 14, 5], [43.9, 18, 4], [46.4, 10, 6], [59.2, 16, 5], [61.5, 10, 6], [66.8, 10, 6], [73.0, 12, 6], [83.4, 24, 4], [86.8, 12, 6], [93.8, 16, 5], [99.0, 16, 5], [102.7, 10, 6]];
const shotAt = (t: number) => { let s: S = SH[0]; for (const x of SH) if (t >= x.t0 + .15) s = x; return s; };

export const StoryVideo: React.FC = () => {
  const t = useCurrentFrame() / FPS;
  let sx = 0, sy = 0; for (const [h, amp, dec] of HITS) { const [x, y] = shake(t, h, amp, dec); sx += x; sy += y; }
  const cur = shotAt(t);
  const flash = Math.max(env(t, 1.35, 1.8, .04, .35) * .4, env(t, 43.85, 44.35, .04, .45) * .7, env(t, 83.35, 83.85, .04, .45), env(t, 99.0, 99.4, .04, .35) * .4);
  return <AbsoluteFill style={{ backgroundColor: '#040409', overflow: 'hidden' }}>
    <div style={{ position: 'absolute', inset: 0, translate: `${sx}px ${sy}px`, scale: '1.03' }}>
      {SH.map((s, i) => s.clip ? <Clip key={i} t={t} t0={s.t0} t1={s.t1} clip={s.clip} at={s.at} vw={1080} vh={s.vh!} mode="band" />
        : <Shot key={i} t={t} t0={s.t0} t1={s.t1} pic={s.pic!} from={s.from!} to={s.to} mode={s.mode} />)}
    </div>
    <PhotoShade />
    {/* dust falling 31.6 -> 34 */}
    {t > 31.5 && t < 34.4 && <AbsoluteFill style={{ opacity: env(t, 31.6, 34.3, .2, .6) }}>{Array.from({ length: 70 }).map((_, i) => {
      const r1 = (Math.sin(i * 12.9898) * 43758.5453) % 1, r2 = (Math.sin(i * 78.233) * 12543.31) % 1;
      const x = Math.abs(r1) * W, sp = 380 + Math.abs(r2) * 520, y = ((t - 31.6) * sp + Math.abs(r2) * 900) % H;
      return <div key={i} style={{ position: 'absolute', left: x, top: y, width: 3 + (i % 4) * 2, height: 3 + (i % 4) * 2, borderRadius: '50%', background: 'rgba(205,180,140,.75)' }} />; })}</AbsoluteFill>}
    {/* light shaft from the opened roof */}
    <AbsoluteFill style={{ background: 'linear-gradient(180deg, rgba(255,235,190,.32) 0%, rgba(255,235,190,.08) 45%, rgba(255,235,190,0) 70%)', opacity: env(t, 29.6, 36.6, .4, .6) }} />
    {/* cold wash for the accusation / trial, warm for arise */}
    <AbsoluteFill style={{ background: 'radial-gradient(ellipse at 50% 55%, rgba(20,30,60,0) 30%, rgba(20,30,60,.5) 100%)', opacity: Math.max(env(t, 56.4, 62.3, .5, .6), env(t, 93.0, 100.1, .5, .6) * .5) }} />
    <AbsoluteFill style={{ background: 'radial-gradient(ellipse at 50% 50%, rgba(255,200,120,.2) 0%, rgba(255,200,120,0) 70%)', opacity: env(t, 83.3, 90.6, .3, .8) }} />
    {/* dim for panels */}
    <AbsoluteFill style={{ background: 'rgba(4,4,9,.62)', opacity: Math.max(env(t, 26.6, 29.9, .3, .3), env(t, 50.95, 56.3, .3, .3), env(t, 63.9, 68.6, .3, .3), env(t, 69.6, 79.2, .3, .3)) }} />
    <AbsoluteFill style={{ background: '#FFF6E0', opacity: flash * .7 }} />
    <Credit s={t < DUR - 5.2 ? (cur.credit ?? cur.pic?.credit) : undefined} a={1} />

    {/* ---- the roof ---- */}
    <Title t={t} t0={0.3} t1={2.4} y={1000} lines={['THEY TORE OPEN', 'A ROOF']} size={96} style={['c', 'g']} from="slam" />
    <Sub s="to reach Jesus" y={1230} a={env(t, 3.4, 4.8, .2, .2)} size={52} color={GL} />
    <Title t={t} t0={5.75} t1={6.85} y={1060} lines={['HE DID NOT', 'HEAL HIM']} size={104} style={['c', 'r']} from="slam" />
    <Sub s="not at first" y={1150} a={env(t, 7.15, 8.2, .15, .2)} size={60} color={CR} />
    <Chip s="MARK 2 : 1–12" y={1110} a={env(t, 8.3, 9.25, .2, .2)} />
    <Title t={t} t0={9.4} t1={11.4} y={1000} lines={['CAPERNAUM']} size={110} from="slam" />
    <Chip s="ON THE SEA OF GALILEE" y={1170} a={env(t, 10.1, 11.4, .2, .2)} size={26} />
    <Sub s="“it was noised that he was in the house”" y={1170} a={env(t, 11.6, 13.8, .25, .2)} size={42} />
    <Title t={t} t0={15.3} t1={16.85} y={980} lines={['NO ROOM']} size={130} style={['r']} from="slam" />
    <Sub s="“no, not so much as about the door”" y={1170} a={env(t, 15.8, 16.85, .2, .2)} size={42} color={CR} />
    {/* ---- the four ---- */}
    <Counter t={t} t0={17.35} t1={19.6} n={4} y={880} label="“BORNE OF FOUR” · MARK 2 : 3" />
    <Chip s="ONE PARALYZED FRIEND · ONE MAT" y={1210} a={env(t, 18.8, 21.6, .2, .25)} size={26} />
    <Sub s="they cannot get near" y={1120} a={env(t, 20.6, 21.6, .15, .2)} size={52} color={CR} />
    <Title t={t} t0={22.0} t1={23.4} y={1020} lines={['THE ROOF']} size={130} from="slam" />
    <Chip s="CAPERNAUM EXCAVATIONS" y={1200} a={env(t, 23.7, 25.8, .2, .25)} size={26} />
    <Title t={t} t0={25.45} t1={26.65} y={1020} lines={['BASALT']} size={120} style={['c']} from="slam" />
    <RoofLayers t={t} t0={26.65} t1={29.9} />
    <Chip s="ἐξορύξαντες · “HAVING DUG OUT”" y={1210} a={env(t, 29.85, 31.5, .2, .2)} size={28} />
    <Title t={t} t0={30.75} t1={31.55} y={1020} lines={['DUG THROUGH']} size={100} from="slam" />
    <Sub s="dirt falls on the crowd" y={1150} a={env(t, 31.8, 33.5, .2, .2)} size={50} color={CR} />
    <Title t={t} t0={34.4} t1={36.6} y={1040} lines={['RIGHT IN FRONT', 'OF JESUS']} size={80} style={['c', 'g']} from="up" />
    <Title t={t} t0={37.4} t1={38.8} y={1020} lines={['“JESUS SAW', 'THEIR FAITH”']} size={84} style={['c', 'g']} from="up" />
    <Sub s="not the sick man’s" y={1080} a={env(t, 38.9, 39.75, .15, .15)} size={54} color={CR} />
    <Title t={t} t0={39.8} t1={40.45} y={1040} lines={['THEIRS']} size={140} from="slam" />
    {/* ---- forgiven ---- */}
    <Sub s="everyone waits for a healing" y={1150} a={env(t, 40.65, 42.25, .2, .2)} size={48} color={GL} />
    <Title t={t} t0={42.3} t1={43.6} y={1060} lines={['INSTEAD…']} size={100} style={['c']} from="up" />
    <Title t={t} t0={43.9} t1={46.25} y={960} lines={['“SON, THY SINS', 'BE FORGIVEN', 'THEE”']} size={80} style={['c', 'g', 'g']} from="slam" />
    <Chip s="MARK 2 : 5" y={1260} a={env(t, 44.4, 46.25, .2, .2)} />
    <Title t={t} t0={46.4} t1={47.6} y={1040} lines={['WHY FIRST?']} size={110} style={['r']} from="slam" />
    <Sub s="sickness was often blamed on sin" y={1110} a={env(t, 48.0, 50.85, .25, .2)} size={46} />
    <Chip s="“WHO DID SIN, THIS MAN, OR HIS PARENTS?” · JOHN 9 : 2" y={1230} a={env(t, 48.9, 50.85, .25, .2)} size={22} />
    <Parch t={t} t0={51.0} t1={56.3} y={700} ref_="BABYLONIAN TALMUD · NEDARIM 41a" who="a saying of Rabbi Alexandri" lines={['“A sick man does not rise', 'from his sickbed', 'until all his sins', 'are forgiven him.”']} hi={55.3} size={50} />
    {/* ---- blasphemy ---- */}
    <Title t={t} t0={56.6} t1={58.35} y={1040} lines={['THE SCRIBES']} size={100} style={['c']} from="up" />
    <Sub s="were sitting there, thinking…" y={1180} a={env(t, 57.1, 58.35, .2, .2)} size={44} color={CR} />
    <Stamp s="BLASPHEMY" y={1050} t={t} t0={59.2} t1={60.25} color="#ff5a4a" size={92} rot={-4} />
    <Title t={t} t0={60.35} t1={62.35} y={980} lines={['“WHO CAN FORGIVE SINS', 'BUT GOD ONLY?”']} size={62} style={['c', 'g']} from="up" />
    <Chip s="MARK 2 : 7" y={1190} a={env(t, 60.6, 62.35, .2, .2)} />
    <Sub s="and they had a point" y={1150} a={env(t, 62.55, 63.8, .2, .2)} size={52} color={GL} />
    <Parch t={t} t0={63.9} t1={68.6} y={760} ref_="ISAIAH 43 : 25" who="God speaking" lines={['“I, even I, am he', 'that blotteth out', 'thy transgressions”']} hi={66.75} size={56} rot={1.2} />
    {/* ---- which is easier ---- */}
    <Title t={t} t0={68.85} t1={69.75} y={1060} lines={['JESUS ASKED']} size={90} style={['c']} from="up" />
    <Easier t={t} t0={69.8} t1={79.2} />
    <Title t={t} t0={79.5} t1={80.75} y={1040} lines={['“THAT YE MAY KNOW”']} size={70} style={['c']} from="up" />
    <Title t={t} t0={80.8} t1={83.25} y={980} lines={['THE SON OF MAN', 'HATH POWER', 'ON EARTH']} size={76} style={['c', 'g', 'g']} from="up" />
    <Chip s="MARK 2 : 10" y={1270} a={env(t, 81.0, 83.25, .2, .2)} />
    <Title t={t} t0={83.4} t1={84.3} y={1010} lines={['“ARISE”']} size={150} from="slam" />
    <Sub s="“take up thy bed, and go thy way”" y={1140} a={env(t, 84.4, 86.4, .2, .2)} size={46} color={CR} />
    <Stamp s="IMMEDIATELY" y={1050} t={t} t0={86.8} t1={88.3} color={GL} size={78} rot={-3} />
    <Title t={t} t0={88.4} t1={90.55} y={1000} lines={['HE WALKED OUT']} size={88} from="slam" />
    <Sub s="before them all" y={1130} a={env(t, 89.6, 90.55, .15, .2)} size={52} color={CR} />
    <Title t={t} t0={90.9} t1={92.9} y={1000} lines={['“WE NEVER SAW IT', 'ON THIS FASHION”']} size={66} style={['c', 'g']} from="up" />
    <Chip s="MARK 2 : 12" y={1200} a={env(t, 91.2, 92.9, .2, .2)} />
    {/* ---- the trial ---- */}
    <Stamp s="BLASPHEMY" y={1000} t={t} t0={93.75} t1={95.35} color="#ff5a4a" size={92} rot={4} />
    <Sub s="came back" y={1150} a={env(t, 94.5, 95.35, .15, .2)} size={56} color={CR} />
    <Chip s="HIS TRIAL · MARK 14 : 63–64" y={1250} a={env(t, 95.6, 97.95, .2, .2)} size={26} />
    <Title t={t} t0={96.6} t1={97.95} y={1000} lines={['“YE HAVE HEARD', 'THE BLASPHEMY”']} size={70} style={['c', 'g']} from="up" />
    <Title t={t} t0={98.95} t1={100.15} y={1020} lines={['“GUILTY', 'OF DEATH”']} size={100} style={['c', 'r']} from="slam" />
    <Title t={t} t0={100.4} t1={103.3} y={960} lines={['IT ALL STARTED', 'WITH A ROOF']} size={84} style={['c', 'g']} from="up" />
    <Sub s="and four friends" y={1180} a={env(t, 101.4, 103.3, .2, .2)} size={52} color={GL} />
    {/* ---- follow ---- */}
    <AbsoluteFill style={{ background: 'rgba(4,4,9,.72)', opacity: env(t, 103.35, DUR + 1, .4, .1) }} />
    <div style={{ ...abs(CX - 70, 640), width: 140, height: 140, opacity: env(t, 103.45, DUR + 1, .4, .1), borderRadius: '50%', boxShadow: '0 0 0 3px rgba(212,175,106,.8), 0 0 60px rgba(212,175,106,.4)' }}><Logo size={140} /></div>
    <Sub s="@lostscripturesbooks" y={800} a={env(t, 103.6, DUR + 1, .4, .1)} size={40} color={GL} />
    <Title t={t} t0={103.6} t1={DUR + 1} y={880} lines={['FOLLOW']} size={140} from="slam" />
    <Sub s="for more stories from the Bible" y={1060} a={eout(P(t, 104.2, 104.7))} size={50} />
    <Sub s="that most people never hear" y={1125} a={eout(P(t, 105.8, 106.3))} size={50} color={GL} />

    <AbsoluteFill style={{ background: 'radial-gradient(ellipse at 50% 46%, rgba(0,0,0,0) 58%, rgba(0,0,0,.5) 100%)' }} />
    <Hud t={t} /><Captions t={t} />
    <AbsoluteFill style={{ backgroundColor: '#000', opacity: Math.max(1 - P(t, 0, .2), P(t, DUR - .6, DUR)) }} />
  </AbsoluteFill>;
};

/* TikTok cover: grid crops the centre 3:4 (y ≈ 240–1680) — all text inside y 280–1640 */
export const StoryCover: React.FC = () => <AbsoluteFill style={{ backgroundColor: '#040409', overflow: 'hidden' }}>
  <Shot t={1} t0={0} t1={2} pic={ROOF} from={[.5, .33, 1.2]} fi={0} fo={0} />
  <AbsoluteFill style={{ background: 'linear-gradient(180deg, rgba(4,4,9,.96) 14%, rgba(4,4,9,.78) 33%, rgba(4,4,9,0) 46%, rgba(4,4,9,0) 62%, rgba(4,4,9,.9) 77%, rgba(4,4,9,.97) 90%)' }} />
  <div style={{ ...abs(CX - 34, 300), width: 68, height: 68 }}><Logo size={68} /></div>
  <div style={{ ...abs(90, 390, 900), textAlign: 'center', fontFamily: CIN, fontWeight: 700, fontSize: 42, letterSpacing: 8, color: CR, opacity: .9 }}>FOUR FRIENDS</div>
  <div style={{ ...abs(90, 450, 900), textAlign: 'center', ...goldText, fontFamily: CIN, fontWeight: 700, fontSize: 92, lineHeight: 1.08, whiteSpace: 'nowrap' }}>TORE OPEN<br />A ROOF</div>
  <div style={{ ...abs(90, 1320, 900), textAlign: 'center', fontFamily: CIN, fontWeight: 700, fontSize: 64, lineHeight: 1.1, color: '#ff6a5a', textShadow: '0 0 30px rgba(220,40,30,.6), 0 4px 10px rgba(0,0,0,.9)' }}>JESUS DIDN’T<br />HEAL HIM. WHY?</div>
  <div style={{ ...abs(90, 1530, 900), textAlign: 'center', fontFamily: CORI, fontWeight: 600, fontSize: 40, color: 'rgba(243,231,207,.75)' }}>Mark 2 · Capernaum</div>
  <AbsoluteFill style={{ background: 'radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0) 60%, rgba(0,0,0,.55) 100%)' }} />
</AbsoluteFill>;
