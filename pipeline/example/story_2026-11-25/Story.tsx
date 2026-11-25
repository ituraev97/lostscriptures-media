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

export const DUR = 106.4;
const SANS = 'Inter, sans-serif';
const GRK = '"DejaVu Serif", serif';
const pd = ' · public domain';
const NAIN: Pic = { src: 'nain.jpg', w: 2600, h: 1865, bg: 'nain_bg.jpg', credit: 'James Tissot, The Resurrection of the Widow’s Son at Nain (1886–94)' + pd };
const DELI: Pic = { src: 'd_elijah.jpg', w: 2046, h: 2544, bg: 'd_elijah_bg.jpg', credit: 'Gustave Doré, Elijah’s Ascent in a Chariot of Fire (1866)' + pd };
const DHEAL: Pic = { src: 'd_heal.jpg', w: 2070, h: 2560, bg: 'd_heal_bg.jpg', credit: 'Gustave Doré, Jesus Healing the Sick (1866)' + pd };
const DSERM: Pic = { src: 'd_sermon.jpg', w: 2168, h: 2593, bg: 'd_sermon_bg.jpg', credit: 'Gustave Doré, The Sermon on the Mount (1866)' + pd };
const TELI: Pic = { src: 't_elijah.jpg', w: 1448, h: 2327, bg: 't_elijah_bg.jpg', credit: 'James Tissot, Elijah Dwelleth in a Cave (1896–1902)' + pd };
const TABOR: Pic = { src: 'r_tabor.jpg', w: 2042, h: 1259, bg: 'r_tabor_bg.jpg', credit: 'David Roberts, Mount Tabor from the Plain of Esdraelon (1839)' + pd };
const FM = 'From the Manger to the Cross (1912), filmed in Palestine' + pd;
const KK = 'The King of Kings (1927)' + pd;

type S = { t0: number; t1: number; pic?: Pic; from?: Cam; to?: Cam; mode?: 'cover' | 'fit'; clip?: string; at?: number; vh?: number; credit?: string };
const SH: S[] = [
  { t0: 0, t1: 2.9, pic: NAIN, from: [.6, .55, 1.25], to: [.62, .5, 1.6] },
  { t0: 2.75, t1: 5.6, clip: 'n_jesus.mp4', at: 1.2, vh: 726, credit: FM },
  { t0: 5.45, t1: 7.9, pic: TABOR, from: [.3, .6, 1.0], to: [.45, .55, 1.15] },
  { t0: 7.75, t1: 9.85, pic: TABOR, mode: 'fit', from: [.5, .5, 1.0], to: [.5, .5, 1.12] },
  { t0: 9.7, t1: 12.4, clip: 'fm_road.mp4', at: 0.3, vh: 720, credit: FM },
  { t0: 12.25, t1: 13.75, clip: 'fm_caravan.mp4', at: 1.0, vh: 720, credit: FM },
  { t0: 13.6, t1: 16.0, clip: 'n_proc.mp4', at: 0, vh: 726, credit: FM },
  { t0: 15.85, t1: 17.3, pic: NAIN, from: [.5, .22, 1.7], to: [.5, .28, 1.45] },
  { t0: 17.15, t1: 20.0, clip: 'n_bier.mp4', at: 0.3, vh: 724, credit: FM },
  { t0: 19.85, t1: 22.2, pic: NAIN, from: [.2, .45, 1.9], to: [.17, .4, 2.2] },
  { t0: 22.05, t1: 24.8, pic: NAIN, from: [.62, .45, 2.1], to: [.6, .5, 1.75] },
  { t0: 24.65, t1: 27.4, clip: 'fm_crowd.mp4', at: 0, vh: 720, credit: FM },
  { t0: 27.25, t1: 30.2, pic: NAIN, from: [.9, .82, 1.8], to: [.88, .8, 2.2] },
  { t0: 30.05, t1: 32.6, pic: NAIN, mode: 'fit', from: [.5, .5, 1.0], to: [.5, .5, 1.12] },
  { t0: 32.45, t1: 35.5, clip: 'n_bier.mp4', at: 2.6, vh: 724, credit: FM },
  { t0: 35.35, t1: 37.6, clip: 'kk_halo.mp4', at: 0.5, vh: 818, credit: KK },
  { t0: 37.45, t1: 40.8, pic: NAIN, from: [.52, .52, 1.8], to: [.52, .46, 2.25] },
  { t0: 40.65, t1: 43.2, pic: DHEAL, from: [.5, .55, 1.0], to: [.5, .5, 1.2] },
  { t0: 43.05, t1: 46.95, clip: 'n_jesus.mp4', at: 3.4, vh: 726, credit: FM },
  { t0: 46.8, t1: 49.7, pic: NAIN, from: [.7, .62, 1.8], to: [.7, .56, 2.3] },
  { t0: 49.55, t1: 51.6, pic: NAIN, from: [.66, .55, 2.2], to: [.64, .52, 1.85] },
  { t0: 51.45, t1: 54.3, clip: 'n_jesus.mp4', at: 6.3, vh: 726, credit: FM },
  { t0: 54.15, t1: 57.4, clip: 'n_arise.mp4', at: 2.2, vh: 728, credit: FM },
  { t0: 57.25, t1: 61.6, clip: 'n_arise.mp4', at: 6.0, vh: 728, credit: FM },
  { t0: 61.45, t1: 64.1, pic: NAIN, from: [.6, .5, 2.0], to: [.5, .5, 1.0] },
  { t0: 63.95, t1: 69.6, pic: DSERM, from: [.5, .4, 1.1], to: [.5, .35, 1.3] },
  { t0: 69.45, t1: 71.5, pic: TELI, from: [.4, .3, 1.0], to: [.4, .25, 1.2] },
  { t0: 71.35, t1: 73.85, pic: DELI, from: [.55, .25, 1.35], to: [.5, .2, 1.6] },
  { t0: 73.7, t1: 76.7, pic: TABOR, from: [.35, .5, 1.05], to: [.55, .45, 1.2] },
  { t0: 76.55, t1: 79.0, pic: DELI, from: [.3, .78, 1.5], to: [.32, .72, 1.8] },
  { t0: 78.85, t1: 81.0, clip: 'fm_crowd.mp4', at: 2.5, vh: 720, credit: FM },
  { t0: 80.85, t1: 82.9, pic: NAIN, from: [.12, .2, 2.1], to: [.18, .26, 1.7] },
  { t0: 82.75, t1: 85.1, pic: NAIN, from: [.82, .22, 2.1], to: [.78, .25, 1.75] },
  { t0: 84.95, t1: 88.9, pic: TELI, from: [.35, .35, 1.25], to: [.38, .28, 1.6] },
  { t0: 88.75, t1: 91.5, pic: DELI, mode: 'fit', from: [.5, .5, 1.0], to: [.5, .6, 1.15] },
  { t0: 91.35, t1: 93.3, clip: 'n_arise.mp4', at: 0, vh: 728, credit: FM },
  { t0: 93.15, t1: 95.2, clip: 'n_proc.mp4', at: 2.5, vh: 726, credit: FM },
  { t0: 95.05, t1: 96.5, clip: 'n_proc.mp4', at: 4.6, vh: 726, credit: FM },
  { t0: 96.35, t1: 98.1, clip: 'fm_road.mp4', at: 2.8, vh: 720, credit: FM },
  { t0: 97.95, t1: 101.2, clip: 'n_arise.mp4', at: 7.2, vh: 728, credit: FM },
  { t0: 101.05, t1: DUR + .1, pic: NAIN, mode: 'fit', from: [.5, .5, 1.0], to: [.5, .5, 1.1] },
];
const CH: [number, string][] = [[0, 'the funeral'], [17.2, 'the widow'], [35.6, 'weep not'], [51.9, 'arise'], [61.9, 'the echo'], [93.4, 'two crowds']];
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
    <div style={{ position: 'absolute', left: SL + 80, top: y + 4, fontFamily: CORI, fontWeight: 600, fontSize: 27, color: 'rgba(243,231,207,.65)' }}>the widow of Nain · Luke 7</div>
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


/* The same Greek clause in Luke 7:15 and the Septuagint of 1 Kings (3 Kingdoms) 17:23: kai edōken auton tē mētri autou */
const GL1 = 'καὶ ἔδωκεν αὐτὸν', GL2 = 'τῇ μητρὶ αὐτοῦ';
const Parch: React.FC<{ t: number; t0: number; t1: number; t2: number; hi: number }> = ({ t, t0, t1, t2, hi }) => {
  const a = env(t, t0, t1, .35, .3); if (a <= 0) return null;
  const h = clamp((t - hi) / .35);
  const Leaf: React.FC<{ y: number; ref_: string; who: string; ts: number; rot: number }> = ({ y, ref_, who, ts, rot }) => {
    const r = eout(P(t, ts, ts + .5)); if (r <= 0) return null;
    return <div style={{ position: 'absolute', left: CX - 360, top: y + (1 - r) * 40, width: 720, height: 300, opacity: r, rotate: `${rot}deg`, borderRadius: 8,
      background: 'radial-gradient(ellipse at 45% 40%, #efe0bd 0%, #d9c393 60%, #a98d5c 100%)', boxShadow: '0 24px 70px rgba(0,0,0,.85), inset 0 0 60px rgba(90,60,20,.55)', textAlign: 'center', paddingTop: 26, boxSizing: 'border-box' }}>
      <div style={{ fontFamily: CIN, fontWeight: 700, fontSize: 26, letterSpacing: 4, color: '#6b4a22' }}>{ref_}</div>
      <div style={{ fontFamily: CORI, fontWeight: 600, fontSize: 26, color: '#6b4a22', marginTop: 2 }}>{who}</div>
      {[GL1, GL2].map((l, i) => <div key={i} style={{ fontFamily: GRK, fontWeight: 700, fontSize: 50, lineHeight: 1.35, marginTop: i ? 0 : 14, color: '#3b2a18', whiteSpace: 'nowrap' }}>
        <span style={{ background: `rgba(243,212,140,${.75 * h})`, borderRadius: 6, padding: '0 8px', boxShadow: h > 0 ? `0 0 ${26 * h}px rgba(243,212,140,${.8 * h})` : undefined }}>{l}</span></div>)}
    </div>;
  };
  return <div style={{ position: 'absolute', inset: 0, opacity: a }}>
    <Leaf y={540} ref_="LUKE 7 : 15" who="Jesus at Nain" ts={t0} rot={-1.5} />
    <Leaf y={900} ref_="1 KINGS 17 : 23 · GREEK OLD TESTAMENT" who="Elijah at Zarephath" ts={t2} rot={1.2} />
  </div>;
};

/* mini map: Nain and Shunem on either side of the Hill of Moreh */
const MiniMap: React.FC<{ t: number; t0: number; t1: number }> = ({ t, t0, t1 }) => {
  const a = env(t, t0, t1, .35, .3); if (a <= 0) return null;
  const d = eout(P(t, t0 + .2, t0 + 1.2)), s2 = eout(P(t, t0 + 1.9, t0 + 2.4));
  return <svg style={{ position: 'absolute', left: 0, top: 0, opacity: a }} width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
    <defs><radialGradient id="hill" cx="50%" cy="40%" r="60%"><stop offset="0%" stopColor="#8a7448" /><stop offset="100%" stopColor="#3d3220" /></radialGradient></defs>
    <rect x={150} y={640} width={700} height={560} rx={24} fill="rgba(8,6,12,.82)" stroke={G} strokeWidth={2.5} />
    <ellipse cx={500} cy={920} rx={190 * d} ry={95 * d} fill="url(#hill)" stroke="rgba(243,212,140,.5)" strokeWidth={2} />
    <text x={500} y={930} textAnchor="middle" fontFamily={CORI} fontWeight={600} fontSize={30} fill={CR} opacity={d}>Hill of Moreh</text>
    <circle cx={560} cy={760} r={14 * d} fill={GL} /><text x={590} y={770} fontFamily={CIN} fontWeight={700} fontSize={40} fill={GL} opacity={d}>NAIN</text>
    <circle cx={380} cy={1080} r={14 * s2} fill="#ff6a5a" /><text x={350} y={1092} textAnchor="end" fontFamily={CIN} fontWeight={700} fontSize={40} fill="#ff6a5a" opacity={s2}>SHUNEM</text>
    <path d={`M 560 776 Q 700 930 ${lerp(560, 396, s2)} ${lerp(776, 1076, s2)}`} fill="none" stroke="rgba(243,212,140,.8)" strokeWidth={3} strokeDasharray="10 10" opacity={s2} />
    <text x={500} y={1170} textAnchor="middle" fontFamily={CORI} fontWeight={600} fontSize={28} fill="rgba(243,231,207,.8)" opacity={s2}>two towns on the same hill</text>
  </svg>;
};

const HITS: [number, number, number][] = [[0.25, 12, 6], [3.1, 14, 6], [8.9, 10, 6], [16.3, 14, 5], [20.3, 10, 6], [31.7, 10, 6], [40.0, 12, 6], [44.0, 18, 5], [48.0, 10, 6], [53.4, 24, 4], [55.5, 16, 5], [64.9, 12, 6], [68.4, 12, 6], [75.9, 10, 6], [88.1, 10, 6], [92.4, 18, 5], [97.4, 10, 6], [100.5, 12, 6]];
const shotAt = (t: number) => { let s: S = SH[0]; for (const x of SH) if (t >= x.t0 + .15) s = x; return s; };

export const StoryVideo: React.FC = () => {
  const t = useCurrentFrame() / FPS;
  let sx = 0, sy = 0; for (const [h, amp, dec] of HITS) { const [x, y] = shake(t, h, amp, dec); sx += x; sy += y; }
  const cur = shotAt(t);
  const flash = Math.max(env(t, 44.0, 44.4, .04, .35) * .5, env(t, 53.35, 53.85, .04, .45), env(t, 55.45, 55.9, .04, .4) * .5, env(t, 92.35, 92.8, .04, .4) * .5);
  return <AbsoluteFill style={{ backgroundColor: '#040409', overflow: 'hidden' }}>
    <div style={{ position: 'absolute', inset: 0, translate: `${sx}px ${sy}px`, scale: '1.03' }}>
      {SH.map((s, i) => s.clip ? <Clip key={i} t={t} t0={s.t0} t1={s.t1} clip={s.clip} at={s.at} vw={1080} vh={s.vh!} mode="band" />
        : <Shot key={i} t={t} t0={s.t0} t1={s.t1} pic={s.pic!} from={s.from!} to={s.to} mode={s.mode} />)}
    </div>
    <PhotoShade />
    {/* cold wash on death, warm on life */}
    <AbsoluteFill style={{ background: 'radial-gradient(ellipse at 50% 55%, rgba(20,30,60,0) 30%, rgba(20,30,60,.55) 100%)', opacity: env(t, 17.2, 24.8, .5, .8) }} />
    <AbsoluteFill style={{ background: 'radial-gradient(ellipse at 50% 50%, rgba(255,200,120,.18) 0%, rgba(255,200,120,0) 70%)', opacity: env(t, 53.3, 61.5, .3, .8) }} />
    {/* dim for the manuscript / map panels */}
    <AbsoluteFill style={{ background: 'rgba(4,4,9,.62)', opacity: Math.max(env(t, 65.9, 69.55, .3, .3), env(t, 74.3, 76.65, .3, .3)) }} />
    <AbsoluteFill style={{ background: '#FFF6E0', opacity: flash * .7 }} />
    <Credit s={t < DUR - 5.4 ? (cur.credit ?? cur.pic?.credit) : undefined} a={1} />

    {/* ---- the funeral ---- */}
    <Title t={t} t0={0.3} t1={2.75} y={980} lines={['HE STOPPED', 'A FUNERAL']} size={100} style={['c', 'g']} from="slam" />
    <Title t={t} t0={3.95} t1={5.4} y={1080} lines={['NOBODY', 'ASKED HIM']} size={104} style={['c', 'r']} from="slam" />
    <Chip s="LUKE 7 : 11–17" y={1120} a={env(t, 5.75, 7.7, .25, .25)} />
    <Title t={t} t0={8.9} t1={9.75} y={1000} lines={['NAIN']} size={150} from="slam" />
    <Chip s="A SMALL TOWN IN GALILEE" y={1200} a={env(t, 7.9, 9.75, .25, .25)} size={26} />
    <Sub s="his disciples · and a great crowd" y={1160} a={env(t, 11.3, 13.6, .25, .25)} size={46} color={GL} />
    <Sub s="out of the gate comes another crowd" y={1170} a={env(t, 14.3, 16.0, .25, .2)} size={44} />
    <Stamp s="A FUNERAL" y={1050} t={t} t0={16.3} t1={17.15} color="#ff5a4a" size={84} rot={-4} />
    {/* ---- the widow ---- */}
    <Sub s="“the only son of his mother”" y={1150} a={env(t, 18.2, 19.9, .25, .2)} size={50} />
    <Title t={t} t0={20.3} t1={22.0} y={1060} lines={['“AND SHE', 'WAS A WIDOW”']} size={82} style={['c', 'g']} from="up" />
    <Chip s="NO HUSBAND" y={880} a={env(t, 21.3, 24.7, .2, .25)} size={34} color={CR} border="#9a8a70" />
    <Chip s="NO SON" y={990} a={env(t, 22.2, 24.7, .2, .25)} size={34} color={CR} border="#9a8a70" />
    <Chip s="NO ONE TO PROVIDE" y={1100} a={env(t, 23.1, 24.7, .2, .25)} size={34} color="#ff8a7a" border="#ff5a4a" />
    <Chip s="MISHNAH · KETUBOT 4 : 4" y={1240} a={env(t, 25.1, 27.2, .25, .25)} size={26} />
    <Sub s="even the poorest man must hire…" y={1150} a={env(t, 25.9, 27.25, .25, .2)} size={46} color={GL} />
    <Title t={t} t0={27.5} t1={30.1} y={900} lines={['2 FLUTES']} size={110} from="zoom" />
    <Title t={t} t0={28.8} t1={30.1} y={1040} lines={['1 WAILING WOMAN']} size={70} style={['c']} from="up" />
    <Pin x={720} y={1290} s="FLUTE PLAYER" a={env(t, 27.8, 30.0, .3, .25)} side="l" />
    <Title t={t} t0={31.6} t1={32.5} y={1080} lines={['HALF THE TOWN']} size={92} from="slam" />
    <Sub s="she asked him for nothing" y={1150} a={env(t, 33.1, 34.8, .25, .2)} size={50} color={CR} />
    <Title t={t} t0={34.9} t1={35.45} y={1060} lines={['NO ONE DID']} size={96} style={['r']} from="slam" />
    {/* ---- weep not ---- */}
    <Sub s="“when the Lord saw her”" y={1150} a={env(t, 36.2, 37.5, .2, .2)} size={50} color={GL} />
    <Sub s="“he had compassion on her”" y={1150} a={env(t, 37.8, 39.8, .25, .2)} size={50} />
    <Title t={t} t0={40.0} t1={40.75} y={1040} lines={['“WEEP NOT”']} size={120} from="slam" />
    <Sub s="something no rabbi would do" y={1150} a={env(t, 41.2, 43.1, .25, .2)} size={48} color={GL} />
    <Stamp s="HE TOUCHED THE BIER" y={1050} t={t} t0={44.0} t1={46.6} color={GL} size={60} rot={-3} />
    <Chip s="NUMBERS 19 : 11" y={1230} a={env(t, 45.1, 49.6, .25, .3)} />
    <Title t={t} t0={48.0} t1={49.6} y={920} lines={['UNCLEAN']} size={110} style={['r']} from="slam" />
    <Sub s="for seven days" y={1080} a={env(t, 48.7, 49.6, .15, .2)} size={54} color={CR} />
    <Title t={t} t0={50.6} t1={51.45} y={1080} lines={['“STOOD STILL”']} size={88} from="up" />
    {/* ---- arise ---- */}
    <Sub s="“Young man, I say unto thee,”" y={1080} a={env(t, 51.9, 53.35, .2, .1)} size={54} color={CR} />
    <Title t={t} t0={53.4} t1={54.2} y={1020} lines={['“ARISE”']} size={150} from="slam" />
    <Stamp s="HE SAT UP" y={1060} t={t} t0={55.5} t1={56.5} color={GL} size={90} rot={-4} />
    <Sub s="“and began to speak”" y={1180} a={env(t, 56.4, 57.3, .15, .2)} size={50} color={GL} />
    <Sub s="a line that sounds simple" y={1150} a={env(t, 58.3, 60.1, .25, .2)} size={46} color={CR} />
    <Title t={t} t0={60.3} t1={61.5} y={1040} lines={['“HE DELIVERED HIM', 'TO HIS MOTHER”']} size={64} from="up" />
    <Chip s="LUKE 7 : 15" y={1240} a={env(t, 60.4, 61.5, .2, .2)} />
    {/* ---- the echo ---- */}
    <Title t={t} t0={62.4} t1={64.1} y={1000} lines={['WHAT MOST PEOPLE', 'NEVER NOTICE']} size={74} style={['c', 'g']} from="up" />
    <Stamp s="BORROWED" y={1060} t={t} t0={64.9} t1={65.85} color="#ff5a4a" size={92} rot={4} />
    <Parch t={t} t0={66.0} t1={69.5} t2={66.9} hi={68.4} />
    <Title t={t} t0={68.4} t1={69.5} y={1260} lines={['WORD FOR WORD']} size={64} from="slam" />
    <Title t={t} t0={70.0} t1={71.4} y={1060} lines={['ELIJAH']} size={130} from="slam" />
    <Sub s="raised a widow’s only son" y={1120} a={env(t, 71.4, 73.7, .25, .2)} size={48} color={CR} />
    <Chip s="ZAREPHATH · 1 KINGS 17" y={1220} a={env(t, 72.4, 73.7, .2, .2)} />
    <MiniMap t={t} t0={74.0} t1={76.6} />
    <Title t={t} t0={77.0} t1={78.85} y={1040} lines={['ELISHA']} size={130} from="slam" />
    <Chip s="SHUNEM · 2 KINGS 4" y={1220} a={env(t, 77.5, 78.85, .2, .2)} />
    <Sub s="the crowd got it at once" y={1150} a={env(t, 79.3, 80.8, .2, .2)} size={48} color={GL} />
    <Title t={t} t0={81.0} t1={82.8} y={1040} lines={['“A GREAT PROPHET', 'IS RISEN UP”']} size={70} from="up" />
    <Title t={t} t0={83.3} t1={85.0} y={1040} lines={['“GOD HATH VISITED', 'HIS PEOPLE”']} size={70} from="up" />
    <Chip s="LUKE 7 : 16" y={1250} a={env(t, 81.2, 85.0, .25, .25)} />
    <Sub s="Elijah cried out, and stretched himself on the child" y={1180} a={env(t, 85.4, 87.9, .25, .2)} size={38} color={CR} />
    <Counter t={t} t0={88.1} t1={89.3} n={3} y={900} label="TIMES · 1 KINGS 17 : 21" />
    <Sub s="Elisha lay on the boy · and waited" y={1150} a={env(t, 89.5, 91.3, .25, .2)} size={44} color={CR} />
    <Chip s="2 KINGS 4 : 34–35" y={1240} a={env(t, 89.7, 91.3, .2, .2)} />
    <Title t={t} t0={92.2} t1={93.2} y={1010} lines={['JESUS', 'JUST SPOKE']} size={110} style={['c', 'g']} from="slam" />
    {/* ---- two crowds ---- */}
    <Title t={t} t0={93.5} t1={97.85} y={860} lines={['TWO CROWDS']} size={84} style={['c']} from="up" />
    <Title t={t} t0={95.9} t1={97.85} y={1000} lines={['DEATH']} size={100} style={['r']} from="slam" />
    <Title t={t} t0={97.3} t1={97.95} y={1130} lines={['LIFE']} size={100} from="slam" />
    <Title t={t} t0={99.0} t1={101.0} y={960} lines={['THE FUNERAL', 'TURNED AROUND']} size={80} style={['c', 'g']} from="up" />
    <Sub s="and went home" y={1160} a={env(t, 100.4, 101.0, .2, .2)} size={56} color={GL} />
    {/* ---- follow ---- */}
    <AbsoluteFill style={{ background: 'rgba(4,4,9,.72)', opacity: env(t, 101.0, DUR + 1, .4, .1) }} />
    <div style={{ ...abs(CX - 70, 640), width: 140, height: 140, opacity: env(t, 101.1, DUR + 1, .4, .1), borderRadius: '50%', boxShadow: '0 0 0 3px rgba(212,175,106,.8), 0 0 60px rgba(212,175,106,.4)' }}><Logo size={140} /></div>
    <Sub s="@lostscripturesbooks" y={800} a={env(t, 101.3, DUR + 1, .4, .1)} size={40} color={GL} />
    <Title t={t} t0={101.3} t1={DUR + 1} y={880} lines={['FOLLOW']} size={140} from="slam" />
    <Sub s="for more stories from the Bible" y={1060} a={eout(P(t, 101.8, 102.3))} size={50} />
    <Sub s="that most people never hear" y={1125} a={eout(P(t, 103.8, 104.3))} size={50} color={GL} />

    <AbsoluteFill style={{ background: 'radial-gradient(ellipse at 50% 46%, rgba(0,0,0,0) 58%, rgba(0,0,0,.5) 100%)' }} />
    <Hud t={t} /><Captions t={t} />
    <AbsoluteFill style={{ backgroundColor: '#000', opacity: Math.max(1 - P(t, 0, .2), P(t, DUR - .6, DUR)) }} />
  </AbsoluteFill>;
};

/* TikTok cover: grid crops the centre 3:4 (y ≈ 240–1680) — all text inside y 280–1640 */
export const StoryCover: React.FC = () => <AbsoluteFill style={{ backgroundColor: '#040409', overflow: 'hidden' }}>
  <Shot t={1} t0={0} t1={2} pic={NAIN} from={[.58, .55, 1.15]} fi={0} fo={0} />
  <AbsoluteFill style={{ background: 'linear-gradient(180deg, rgba(4,4,9,.96) 14%, rgba(4,4,9,.8) 34%, rgba(4,4,9,0) 48%, rgba(4,4,9,0) 60%, rgba(4,4,9,.9) 76%, rgba(4,4,9,.97) 90%)' }} />
  <div style={{ ...abs(CX - 34 + 40, 300), width: 68, height: 68 }}><Logo size={68} /></div>
  <div style={{ ...abs(90, 390, 900), textAlign: 'center', fontFamily: CIN, fontWeight: 700, fontSize: 44, letterSpacing: 8, color: CR, opacity: .9 }}>NOBODY ASKED HIM</div>
  <div style={{ ...abs(90, 450, 900), textAlign: 'center', ...goldText, fontFamily: CIN, fontWeight: 700, fontSize: 88, lineHeight: 1.08, whiteSpace: 'nowrap' }}>JESUS STOPPED<br />A FUNERAL</div>
  <div style={{ ...abs(90, 1320, 900), textAlign: 'center', fontFamily: CIN, fontWeight: 700, fontSize: 66, lineHeight: 1.1, color: '#ff6a5a', textShadow: '0 0 30px rgba(220,40,30,.6), 0 4px 10px rgba(0,0,0,.9)' }}>AND TOUCHED<br />THE COFFIN</div>
  <div style={{ ...abs(90, 1530, 900), textAlign: 'center', fontFamily: CORI, fontWeight: 600, fontSize: 40, color: 'rgba(243,231,207,.75)' }}>Luke 7 · the widow of Nain</div>
  <AbsoluteFill style={{ background: 'radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0) 60%, rgba(0,0,0,.55) 100%)' }} />
</AbsoluteFill>;
