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

export const DUR = 106.0;
const SANS = 'Inter, sans-serif';
const GRK = '"DejaVu Serif", serif';
const pd = ' · public domain';
const TEN: Pic = { src: 'ten.jpg', w: 2584, h: 1612, bg: 'ten_bg.jpg', credit: 'James Tissot, The Healing of the Ten Lepers (1886–94)' + pd };
const CAP: Pic = { src: 'capleper.jpg', w: 1464, h: 2600, bg: 'capleper_bg.jpg', credit: 'James Tissot, Healing of the Lepers at Capernaum (1886–94)' + pd };
const MNT: Pic = { src: 'mount.jpg', w: 2166, h: 1636, bg: 'mount_bg.jpg', credit: 'James Tissot, Jesus Healing the Lame and the Blind (1886–94)' + pd };
const SICK: Pic = { src: 'dore262.jpg', w: 2046, h: 2561, bg: 'dore262_bg.jpg', credit: 'Gustave Doré, Jesus Healing the Sick (1866)' + pd };
const SAMN: Pic = { src: 'dore306.jpg', w: 2022, h: 2594, bg: 'dore306_bg.jpg', credit: 'Gustave Doré, The Good Samaritan (1866)' + pd };
const DOCT: Pic = { src: 'dore258.jpg', w: 2083, h: 2593, bg: 'dore258_bg.jpg', credit: 'Gustave Doré, Jesus in the Temple (1866)' + pd };
const NAB: Pic = { src: 'rob173.jpg', w: 2600, h: 1683, bg: 'rob173_bg.jpg', credit: 'David Roberts, Nablous, Ancient Shechem (1839)' + pd };
const SEB: Pic = { src: 'rob179.jpg', w: 2600, h: 1683, bg: 'rob179_bg.jpg', credit: 'David Roberts, Sebaste, Ancient Samaria (1839)' + pd };
const OMAR: Pic = { src: 'rob71.jpg', w: 2600, h: 1645, bg: 'rob71_bg.jpg', credit: 'David Roberts, The Temple Mount, Jerusalem (1839)' + pd };
const JERU: Pic = { src: 'rob77.jpg', w: 2600, h: 1683, bg: 'rob77_bg.jpg', credit: 'David Roberts, Jerusalem from the South (1839)' + pd };
const KK = 'The King of Kings (1927)' + pd, FM = 'From the Manger to the Cross (1912)' + pd;

type S = { t0: number; t1: number; pic?: Pic; from?: Cam; to?: Cam; mode?: 'cover' | 'fit'; clip?: string; at?: number; vh?: number; credit?: string };
const SH: S[] = [
  { t0: 0, t1: 2.65, pic: TEN, from: [.55, .6, 1.0], to: [.66, .6, 1.18] },
  { t0: 2.5, t1: 4.65, pic: CAP, from: [.55, .6, 1.0], to: [.55, .45, 1.3] },
  { t0: 4.5, t1: 8.35, pic: TEN, from: [.2, .45, 1.35], to: [.16, .38, 1.9] },
  { t0: 8.2, t1: 10.2, pic: JERU, from: [.35, .45, 1.0], to: [.5, .42, 1.12] },
  { t0: 10.05, t1: 12.95, clip: 'fm_walk.mp4', at: 0, vh: 724, credit: FM },
  { t0: 12.8, t1: 14.8, pic: SEB, from: [.35, .45, 1.0], to: [.55, .45, 1.1] },
  { t0: 14.65, t1: 17.0, pic: TEN, from: [.72, .55, 1.12], to: [.82, .62, 1.35] },
  { t0: 16.85, t1: 19.2, pic: MNT, from: [.32, .62, 1.25], to: [.26, .58, 1.55] },
  { t0: 19.05, t1: 22.95, pic: SICK, from: [.4, .45, 1.0], to: [.3, .55, 1.3] },
  { t0: 22.8, t1: 24.85, pic: SICK, from: [.25, .75, 1.6], to: [.22, .72, 1.8] },
  { t0: 24.7, t1: 27.05, pic: NAB, from: [.3, .5, 1.0], to: [.45, .5, 1.1] },
  { t0: 26.9, t1: 30.6, clip: 'kk_plead.mp4', at: 0, vh: 814, credit: KK },
  { t0: 30.45, t1: 34.8, pic: TEN, mode: 'fit', from: [.5, .5, 1.0], to: [.35, .45, 1.3] },
  { t0: 34.65, t1: 37.5, clip: 'fm_street.mp4', at: 1.2, vh: 724, credit: FM },
  { t0: 37.35, t1: 39.6, pic: MNT, from: [.62, .62, 1.3], to: [.55, .6, 1.6] },
  { t0: 39.45, t1: 41.95, pic: TEN, from: [.6, .68, 1.45], to: [.6, .6, 1.1] },
  { t0: 41.8, t1: 44.35, pic: SEB, from: [.45, .6, 1.05], to: [.7, .6, 1.3] },
  { t0: 44.2, t1: 46.85, pic: NAB, from: [.6, .6, 1.3], to: [.75, .58, 1.5] },
  { t0: 46.7, t1: 50.85, pic: CAP, from: [.5, .75, 1.0], to: [.5, .52, 1.45] },
  { t0: 50.7, t1: 53.0, pic: TEN, from: [.45, .75, 1.15], to: [.4, .75, 1.32] },
  { t0: 52.85, t1: 56.75, pic: SAMN, from: [.55, .4, 1.0], to: [.55, .32, 1.4] },
  { t0: 56.6, t1: 59.45, pic: NAB, mode: 'fit', from: [.5, .5, 1.0], to: [.45, .5, 1.2] },
  { t0: 59.3, t1: 63.45, pic: TEN, from: [.2, .42, 1.5], to: [.15, .36, 2.0] },
  { t0: 63.3, t1: 67.15, pic: CAP, from: [.5, .42, 1.25], to: [.5, .55, 1.0] },
  { t0: 67.0, t1: 69.9, pic: DOCT, from: [.5, .45, 1.0], to: [.5, .4, 1.2] },
  { t0: 69.75, t1: 72.65, pic: DOCT, from: [.3, .6, 1.5], to: [.35, .55, 1.75] },
  { t0: 72.5, t1: 75.0, pic: OMAR, from: [.3, .5, 1.0], to: [.42, .5, 1.15] },
  { t0: 74.85, t1: 77.25, pic: OMAR, from: [.55, .45, 1.3], to: [.6, .4, 1.55] },
  { t0: 77.1, t1: 81.4, clip: 'kk_temple.mp4', at: 0, vh: 814, credit: KK },
  { t0: 81.25, t1: 86.15, pic: OMAR, from: [.5, .5, 1.1], to: [.5, .5, 1.25] },
  { t0: 86.0, t1: 89.55, pic: DOCT, from: [.5, .35, 1.3], to: [.5, .45, 1.05] },
  { t0: 89.4, t1: 92.05, pic: CAP, from: [.5, .5, 1.3], to: [.5, .62, 1.05] },
  { t0: 91.9, t1: 96.95, pic: SICK, from: [.5, .42, 1.3], to: [.5, .36, 1.6] },
  { t0: 96.8, t1: 100.45, pic: TEN, from: [.3, .5, 1.0], to: [.8, .5, 1.0] },
  { t0: 100.3, t1: DUR + .1, pic: TEN, mode: 'fit', from: [.5, .5, 1.0], to: [.5, .5, 1.12] },
];
const CH: [number, string][] = [[0, 'ten men'], [8.4, 'the lepers'], [34.8, 'the road'], [46.8, 'the one'], [67.1, 'the stone'], [92.0, 'whole']];

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
  a <= 0 ? null : <div style={{ ...abs(SL, y + (1 - eout(a)) * 14, SR - SL), textAlign: 'center', opacity: a, fontFamily: CORI, fontWeight: 600, fontSize: size, color, textShadow: '0 2px 14px rgba(0,0,0,1), 0 0 30px rgba(0,0,0,.8)' }}>{s}</div>;
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
/* the Temple warning inscription (text after Clermont-Ganneau 1871), drawn as a limestone block */
const INS = ['ΜΗΘΕΝΑ ΑΛΛΟΓΕΝΗ ΕΙΣ', 'ΠΟΡΕΥΕΣΘΑΙ ΕΝΤΟΣ ΤΟΥ ΠΕ', 'ΡΙ ΤΟ ΙΕΡΟΝ ΤΡΥΦΑΚΤΟΥ ΚΑΙ', 'ΠΕΡΙΒΟΛΟΥ ΟΣ Δ ΑΝ ΛΗ', 'ΦΘΗ ΕΑΥΤΩΙ ΑΙΤΙΟΣ ΕΣ', 'ΤΑΙ ΔΙΑ ΤΟ ΕΞΑΚΟΛΟΥ', 'ΘΕΙΝ ΘΑΝΑΤΟΝ'];
const Tablet: React.FC<{ t: number; t0: number; t1: number; hi: number }> = ({ t, t0, t1, hi }) => {
  const a = env(t, t0, t1, .35, .3); if (a <= 0) return null;
  const h = clamp((t - hi) / .3) * (1 - clamp((t - t1 + .5) / .5));
  return <div style={{ position: 'absolute', left: CX - 400, top: 560, width: 800, height: 640, opacity: a, scale: String(lerp(.92, 1, eout(P(t, t0, t0 + .6)))), borderRadius: 10,
    background: 'radial-gradient(ellipse at 40% 35%, #d9cfb8 0%, #b9ad92 55%, #8d8269 100%)', boxShadow: '0 30px 80px rgba(0,0,0,.85), inset 0 0 60px rgba(60,45,25,.55)', padding: '46px 40px', boxSizing: 'border-box' }}>
    {INS.map((l, i) => {
      const parts = i === 0 ? ['ΜΗΘΕΝΑ ', 'ΑΛΛΟΓΕΝΗ', ' ΕΙΣ'] : [l];
      const reveal = clamp((t - t0 - .3 - i * .28) / .4);
      return <div key={i} style={{ fontFamily: GRK, fontWeight: 700, fontSize: 37, letterSpacing: 2, lineHeight: 1.75, textAlign: 'center', color: '#4a3c28', textShadow: '1px 1px 0 rgba(255,250,235,.55), -1px -1px 0 rgba(40,28,12,.45)', opacity: reveal, whiteSpace: 'nowrap' }}>
        {parts.map((p, j) => j === 1 ? <span key={j} style={{ color: h > 0 ? `rgba(${Math.round(lerp(74, 150, h))},${Math.round(lerp(60, 20, h))},${Math.round(lerp(40, 20, h))},1)` : undefined, background: `rgba(243,212,140,${.55 * h})`, borderRadius: 6, padding: '0 4px', boxShadow: h > 0 ? `0 0 ${30 * h}px rgba(243,212,140,${.8 * h})` : undefined }}>{p}</span> : <span key={j}>{p}</span>)}
      </div>;
    })}
  </div>;
};

const Hud: React.FC<{ t: number }> = ({ t }) => {
  let ci = 0; CH.forEach(([s], i) => { if (t >= s) ci = i; });
  const y = 245, n = CH.length, gap = 10, sw = (SR - SL - gap * (n - 1)) / n;
  const ca = eout(P(t, CH[ci][0], CH[ci][0] + .4));
  return <>
    <div style={{ ...abs(SL, y - 34), width: 68, height: 68, borderRadius: '50%', boxShadow: '0 0 0 2px rgba(212,175,106,.7)' }}><Logo size={68} /></div>
    <div style={{ position: 'absolute', left: SL + 80, top: y - 36, fontFamily: CIN, fontWeight: 700, fontSize: 29, color: CR }}>The Lost Scriptures</div>
    <div style={{ position: 'absolute', left: SL + 80, top: y + 4, fontFamily: CORI, fontWeight: 600, fontSize: 27, color: 'rgba(243,231,207,.65)' }}>the ten lepers · Luke 17</div>
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
const HITS: [number, number, number][] = [[0.2, 10, 6], [2.6, 12, 6], [7.3, 12, 6], [23.2, 12, 6], [24.0, 14, 6], [40.7, 14, 5], [46.8, 18, 5], [55.4, 22, 5], [62.7, 10, 6], [72.7, 16, 5], [84.85, 20, 5], [96.9, 10, 6]];
const shotAt = (t: number) => { let s: S = SH[0]; for (const x of SH) if (t >= x.t0 + .15) s = x; return s; };

export const StoryVideo: React.FC = () => {
  const t = useCurrentFrame() / FPS;
  let sx = 0, sy = 0; for (const [h, amp, dec] of HITS) { const [x, y] = shake(t, h, amp, dec); sx += x; sy += y; }
  const cur = shotAt(t);
  const flash = Math.max(env(t, 40.65, 41.2, .05, .45), env(t, 55.35, 55.8, .04, .4) * .6, env(t, 72.65, 73.1, .04, .4) * .5);
  return <AbsoluteFill style={{ backgroundColor: '#040409', overflow: 'hidden' }}>
    <div style={{ position: 'absolute', inset: 0, translate: `${sx}px ${sy}px`, scale: '1.03' }}>
      {SH.map((s, i) => s.clip ? <Clip key={i} t={t} t0={s.t0} t1={s.t1} clip={s.clip} at={s.at} vw={1080} vh={s.vh!} mode="band" />
        : <Shot key={i} t={t} t0={s.t0} t1={s.t1} pic={s.pic!} from={s.from!} to={s.to} mode={s.mode} />)}
    </div>
    <PhotoShade />
    {/* red wash on UNCLEAN */}
    <AbsoluteFill style={{ background: 'radial-gradient(ellipse at 50% 55%, rgba(120,10,20,0) 30%, rgba(120,10,20,.55) 100%)', opacity: env(t, 22.9, 26.6, .2, .8) }} />
    <AbsoluteFill style={{ background: '#FFF6E0', opacity: flash * .7 }} />
    <Credit s={t < DUR - 5.6 ? (cur.credit ?? cur.pic?.credit) : undefined} a={1} />

    {/* ---- hook ---- */}
    <Title t={t} t0={0.2} t1={2.55} y={1010} lines={['TEN HEALED.']} size={110} from="slam" />
    <Title t={t} t0={2.6} t1={4.5} y={1010} lines={['ONLY ONE', 'CAME BACK']} size={104} from="slam" />
    <Title t={t} t0={6.75} t1={8.3} y={1000} lines={['WHERE ARE', 'THE NINE?']} size={108} style={['c', 'g']} from="slam" />
    <Chip s="LUKE 17 : 11–19" y={1120} a={env(t, 8.4, 10.15, .25, .25)} />
    <Pin x={345} y={600} s="JESUS" a={env(t, 10.5, 12.2, .3, .3)} />
    <Chip s="SAMARIA" y={1060} a={env(t, 13.0, 14.75, .2, .25)} />
    <Sub s="· on the border with Galilee ·" y={1140} a={env(t, 13.9, 14.75, .2, .25)} size={40} />
    <Counter t={t} t0={15.3} t1={16.95} n={10} y={880} label="LEPERS" />
    <Chip s="“WHICH STOOD AFAR OFF”" y={1150} a={env(t, 16.9, 19.15, .25, .3)} />
    <Chip s="LEVITICUS 13 : 45–46" y={1180} a={env(t, 19.3, 22.85, .3, .3)} />
    <Stamp s="UNCLEAN!" y={900} t={t} t0={23.15} t1={23.95} color="#ff5a4a" size={84} rot={-5} />
    <Stamp s="UNCLEAN!" y={1060} t={t} t0={23.95} t1={24.8} color="#ff5a4a" size={96} rot={4} />
    <Title t={t} t0={25.0} t1={27.0} y={1040} lines={['OUTSIDE', 'THE CAMP']} size={84} style={['c', 'c']} from="up" />
    <Title t={t} t0={29.0} t1={30.55} y={1210} lines={['“HAVE MERCY ON US”']} size={62} from="zoom" />
    <Sub s="no touch. no word of healing." y={1180} a={env(t, 32.0, 34.7, .3, .3)} size={46} color={GL} />
    <Title t={t} t0={35.2} t1={37.45} y={1190} lines={['“GO SHEW YOURSELVES', 'UNTO THE PRIESTS”']} size={52} from="up" />
    <Sub s="still covered in it" y={1150} a={env(t, 38.5, 39.55, .2, .25)} size={50} color={CR} />
    <Title t={t} t0={40.65} t1={41.9} y={1010} lines={['CLEANSED']} size={124} from="slam" />
    <Counter t={t} t0={41.9} t1={46.7} n={9} y={860} label="KEPT WALKING" />
    {/* ---- the one ---- */}
    <Title t={t} t0={46.8} t1={50.8} y={1020} lines={['ONE', 'TURNED BACK']} size={92} style={['g', 'c']} from="slam" />
    <Chip s="“WITH A LOUD VOICE GLORIFIED GOD”" y={1290} a={env(t, 48.3, 50.75, .25, .3)} size={24} />
    <Sub s="fell down on his face at his feet" y={1150} a={env(t, 51.0, 52.95, .25, .25)} size={48} color={GL} />
    <Sub s="Luke adds five words…" y={1150} a={env(t, 53.2, 54.85, .2, .2)} size={50} />
    <Title t={t} t0={55.35} t1={56.7} y={980} lines={['AND HE WAS A', 'SAMARITAN']} size={96} style={['c', 'r']} from="slam" />
    <Chip s="JOHN 4 : 9 · “NO DEALINGS”" y={1170} a={env(t, 56.8, 59.4, .25, .3)} />
    <Chip s="SAMARITAN HEARTLAND · SHECHEM" y={1090} a={env(t, 57.3, 59.4, .25, .3)} size={24} border="#8a6a3a" color={CR} />
    <Counter t={t} t0={61.0} t1={62.25} n={10} y={880} label="CLEANSED" />
    <Title t={t} t0={62.3} t1={63.4} y={1000} lines={['WHERE ARE', 'THE NINE?']} size={108} style={['c', 'g']} from="slam" />
    <Title t={t} t0={66.1} t1={67.1} y={1040} lines={['“THIS STRANGER”']} size={84} from="slam" />
    {/* ---- the stone ---- */}
    <div style={{ ...abs(SL, 900, SR - SL), textAlign: 'center', opacity: env(t, 69.0, 72.6, .3, .3) }}>
      <div style={{ fontFamily: GRK, fontWeight: 700, fontSize: 120, ...goldText }}>ἀλλογενής</div>
      <div style={{ fontFamily: CIN, fontWeight: 700, fontSize: 30, letterSpacing: 5, color: CR, marginTop: 10, whiteSpace: 'nowrap', textShadow: '0 2px 12px #000' }}>ALLOGENĒS · “OF ANOTHER RACE”</div>
    </div>
    <Chip s="NOWHERE ELSE IN THE NEW TESTAMENT" y={1190} a={env(t, 70.6, 72.6, .25, .3)} size={24} />
    <Title t={t} t0={72.65} t1={74.85} y={980} lines={['1871']} size={170} from="slam" />
    <Sub s="carved in stone · Jerusalem" y={1170} a={env(t, 74.6, 77.1, .3, .3)} size={48} color={GL} />
    <Pin x={640} y={880} s="THE TEMPLE MOUNT" side="l" a={env(t, 75.6, 77.1, .3, .25)} />
    <Chip s="THE TEMPLE WARNING INSCRIPTION" y={1160} a={env(t, 77.3, 81.3, .3, .3)} size={26} />
    <Tablet t={t} t0={79.0} t1={86.0} hi={84.85} />
    <Sub s="“No foreigner may pass the barrier… he has himself to blame for his death.”" y={1240} a={env(t, 79.3, 84.7, .3, .3)} size={36} color={CR} />
    <Title t={t} t0={84.85} t1={86.0} y={1235} lines={['THE SAME WORD']} size={70} from="slam" />
    <Title t={t} t0={86.1} t1={89.45} y={980} lines={['THE TEMPLE', 'WOULD KILL HIM']} size={88} style={['c', 'r']} from="up" />
    <Title t={t} t0={89.6} t1={92.0} y={1000} lines={['HE CAME BACK', 'TO WORSHIP']} size={92} from="zoom" />
    <Title t={t} t0={93.2} t1={96.85} y={1000} lines={['“THY FAITH HATH', 'MADE THEE WHOLE”']} size={70} from="up" />
    <Chip s="LUKE 17 : 19" y={1200} a={env(t, 94.0, 96.85, .3, .3)} />
    <Title t={t} t0={96.9} t1={100.35} y={940} lines={['TEN CLEANSED.']} size={80} style={['c']} from="slam" />
    <Title t={t} t0={98.3} t1={100.35} y={1070} lines={['ONE MADE WHOLE.']} size={80} from="slam" />
    {/* ---- follow ---- */}
    <AbsoluteFill style={{ background: 'rgba(4,4,9,.72)', opacity: env(t, 100.3, DUR + 1, .4, .1) }} />
    <div style={{ ...abs(CX - 70, 640), width: 140, height: 140, opacity: env(t, 100.4, DUR + 1, .4, .1), borderRadius: '50%', boxShadow: '0 0 0 3px rgba(212,175,106,.8), 0 0 60px rgba(212,175,106,.4)' }}><Logo size={140} /></div>
    <Sub s="@lostscripturesbooks" y={800} a={env(t, 100.6, DUR + 1, .4, .1)} size={40} color={GL} />
    <Title t={t} t0={100.5} t1={DUR + 1} y={880} lines={['FOLLOW']} size={140} from="slam" />
    <Sub s="for more stories from the Bible" y={1060} a={eout(P(t, 101.0, 101.5))} size={50} />
    <Sub s="that most people never hear" y={1125} a={eout(P(t, 102.6, 103.1))} size={50} color={GL} />

    <AbsoluteFill style={{ background: 'radial-gradient(ellipse at 50% 46%, rgba(0,0,0,0) 58%, rgba(0,0,0,.5) 100%)' }} />
    <Hud t={t} /><Captions t={t} />
    <AbsoluteFill style={{ backgroundColor: '#000', opacity: Math.max(1 - P(t, 0, .2), P(t, DUR - .6, DUR)) }} />
  </AbsoluteFill>;
};

/* TikTok cover: grid crops the centre 3:4 (y ≈ 240–1680) — all text inside y 280–1640 */
export const StoryCover: React.FC = () => <AbsoluteFill style={{ backgroundColor: '#040409', overflow: 'hidden' }}>
  <Shot t={1} t0={0} t1={2} pic={CAP} from={[.5, .55, 1.0]} fi={0} fo={0} />
  <AbsoluteFill style={{ background: 'linear-gradient(180deg, rgba(4,4,9,.96) 12%, rgba(4,4,9,.55) 30%, rgba(4,4,9,0) 42%, rgba(4,4,9,0) 62%, rgba(4,4,9,.9) 78%, rgba(4,4,9,.97) 90%)' }} />
  <div style={{ ...abs(CX - 34 + 40, 300), width: 68, height: 68 }}><Logo size={68} /></div>
  <div style={{ ...abs(90, 390, 900), textAlign: 'center', fontFamily: CIN, fontWeight: 700, fontSize: 40, letterSpacing: 8, color: CR, opacity: .9 }}>JESUS HEALED TEN MEN</div>
  <div style={{ ...abs(90, 450, 900), textAlign: 'center', ...goldText, fontFamily: CIN, fontWeight: 700, fontSize: 124, lineHeight: 1.02 }}>ONLY ONE<br />CAME BACK</div>
  <div style={{ ...abs(90, 1330, 900), textAlign: 'center', fontFamily: CIN, fontWeight: 700, fontSize: 66, lineHeight: 1.1, color: '#ff6a5a', textShadow: '0 0 30px rgba(220,40,30,.6), 0 4px 10px rgba(0,0,0,.9)' }}>AND HE WAS<br />A SAMARITAN</div>
  <div style={{ ...abs(90, 1530, 900), textAlign: 'center', fontFamily: CORI, fontWeight: 600, fontSize: 40, color: 'rgba(243,231,207,.75)' }}>Luke 17 · “where are the nine?”</div>
  <AbsoluteFill style={{ background: 'radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0) 60%, rgba(0,0,0,.55) 100%)' }} />
</AbsoluteFill>;
