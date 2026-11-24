import React from 'react';
import { AbsoluteFill, staticFile, useCurrentFrame } from 'remotion';
import { loadFont } from '@remotion/fonts';
import { W, H, FPS, CX, SL, SR, G, GL, CR, RED, CIN, CORI, HEB, MONO, P, eio, eout, eback, lerp, env, clamp, shake } from './lib';
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
const ECCE: Pic = { src: 'ecce.jpg', w: 1025, h: 1788, bg: 'ecce_bg.jpg', credit: 'James Tissot, Ecce Homo (1886–94)' + pd };
const BARAB: Pic = { src: 'barab.jpg', w: 834, h: 806, bg: 'barab_bg.jpg', credit: 'James Tissot, Barabbas (1886–94)' + pd };
const CRUC: Pic = { src: 'crucify.jpg', w: 1191, h: 1906, bg: 'crucify_bg.jpg', credit: 'James Tissot, Let Him Be Crucified! (1886–94)' + pd };
const WASH: Pic = { src: 'wash.jpg', w: 1320, h: 1510, bg: 'wash_bg.jpg', credit: 'James Tissot, Pilate Washes His Hands (1886–94)' + pd };
const WIFE: Pic = { src: 'wife.jpg', w: 1604, h: 1248, bg: 'wife_bg.jpg', credit: 'James Tissot, The Message from Pilate’s Wife (1886–94)' + pd };
const LED: Pic = { src: 'led.jpg', w: 2600, h: 1974, bg: 'led_bg.jpg', credit: 'James Tissot, Jesus Led from Caiaphas to Pilate (1886–94)' + pd };
const GABB: Pic = { src: 'gabb.jpg', w: 1692, h: 1174, bg: 'gabb_bg.jpg', credit: 'James Tissot, Pilate Pronounces Judgment from the Gabbatha (1886–94)' + pd };
const BETR: Pic = { src: 'betray.jpg', w: 2107, h: 2528, bg: 'betray_bg.jpg', credit: 'Gustave Doré, The Betrayal (1866)' + pd };
const CROSS: Pic = { src: 'cross.jpg', w: 2107, h: 2511, bg: 'cross_bg.jpg', credit: 'Gustave Doré, Christ Fainting under the Cross (1866)' + pd };
const JERU: Pic = { src: 'jeru.jpg', w: 2426, h: 1107, bg: 'jeru_bg.jpg', credit: 'David Roberts, Jerusalem from the South (1839)' + pd };
const TEMP: Pic = { src: 'temple.jpg', w: 2411, h: 1128, bg: 'temple_bg.jpg', credit: 'David Roberts, The Temple Mount, Jerusalem (1839)' + pd };
const KK = 'The King of Kings (1927)' + pd;

type S = { t0: number; t1: number; pic?: Pic; from?: Cam; to?: Cam; mode?: 'cover' | 'fit'; clip?: string; at?: number; vh?: number; credit?: string };
const SH: S[] = [
  { t0: 0, t1: 2.75, pic: ECCE, from: [.5, .7, 1.0], to: [.55, .3, 1.25] },
  { t0: 2.6, t1: 5.05, clip: 'kk_two.mp4', at: 4.2, vh: 812, credit: KK },
  { t0: 4.9, t1: 7.25, pic: CRUC, from: [.5, .55, 1.05], to: [.5, .45, 1.3] },
  { t0: 7.1, t1: 9.0, pic: BARAB, mode: 'fit', from: [.5, .5, 1.0], to: [.5, .45, 1.25] },
  { t0: 8.85, t1: 10.7, pic: TEMP, from: [.3, .5, 1.0], to: [.42, .5, 1.12] },
  { t0: 10.55, t1: 13.05, pic: JERU, from: [.25, .45, 1.0], to: [.45, .4, 1.1] },
  { t0: 12.9, t1: 15.3, pic: BETR, from: [.45, .45, 1.0], to: [.42, .38, 1.35] },
  { t0: 15.15, t1: 17.7, clip: 'kk_hall.mp4', at: 0.5, vh: 812, credit: KK },
  { t0: 17.55, t1: 21.95, pic: GABB, from: [.75, .35, 1.0], to: [.82, .3, 1.25] },
  { t0: 21.8, t1: 24.95, pic: BARAB, mode: 'fit', from: [.5, .5, 1.0], to: [.5, .48, 1.18] },
  { t0: 24.8, t1: 29.35, clip: 'kk_three.mp4', at: 2.1, vh: 812, credit: KK },
  { t0: 29.2, t1: 32.85, clip: 'kk_two.mp4', at: 4.1, vh: 812, credit: KK },
  { t0: 32.7, t1: 36.1, pic: LED, from: [.3, .5, 1.0], to: [.6, .45, 1.15] },
  { t0: 35.95, t1: 38.45, clip: 'kk_wife.mp4', at: 6.7, vh: 812, credit: KK },
  { t0: 38.3, t1: 41.35, pic: WIFE, from: [.4, .5, 1.0], to: [.38, .4, 1.3] },
  { t0: 41.2, t1: 44.6, pic: WIFE, from: [.4, .32, 1.3], to: [.4, .28, 1.5] },
  { t0: 44.45, t1: 46.75, clip: 'kk_mob.mp4', at: 0, vh: 812, credit: KK },
  { t0: 46.6, t1: 49.45, pic: ECCE, from: [.45, .85, 1.3], to: [.5, .8, 1.6] },
  { t0: 49.35, t1: 50.85, clip: 'kk_roar.mp4', at: 5.45, vh: 812, credit: KK },
  { t0: 50.7, t1: 54.3, pic: CRUC, from: [.5, .3, 1.5], to: [.5, .4, 1.15] },
  { t0: 54.15, t1: 56.15, clip: 'kk_wash.mp4', at: 7.4, vh: 812, credit: KK },
  { t0: 56.0, t1: 58.65, pic: WASH, from: [.5, .5, 1.0], to: [.45, .4, 1.3] },
  { t0: 58.5, t1: 60.5, clip: 'kk_wide.mp4', at: 0.3, vh: 812, credit: KK },
  { t0: 60.35, t1: 62.75, pic: CROSS, from: [.5, .5, 1.0], to: [.5, .45, 1.18] },
  { t0: 62.6, t1: 65.25, pic: TEMP, from: [.45, .5, 1.0], to: [.55, .45, 1.15] },
  { t0: 65.1, t1: 68.3, pic: JERU, from: [.7, .5, 1.1], to: [.5, .3, 1.3] },
  { t0: 68.15, t1: 72.45, pic: GABB, mode: 'fit', from: [.5, .5, 1.0], to: [.5, .5, 1.1] },
  { t0: 72.3, t1: 77.2, pic: BARAB, mode: 'fit', from: [.5, .5, 1.0], to: [.48, .45, 1.2] },
  { t0: 77.05, t1: 82.15, pic: LED, from: [.75, .5, 1.05], to: [.55, .5, 1.2] },
  { t0: 82.0, t1: 85.35, pic: TEMP, from: [.6, .4, 1.15], to: [.7, .35, 1.3] },
  { t0: 85.2, t1: 87.1, clip: 'kk_three.mp4', at: 3.0, vh: 812, credit: KK },
  { t0: 86.95, t1: 91.15, pic: ECCE, mode: 'fit', from: [.5, .5, 1.0], to: [.5, .4, 1.2] },
  { t0: 91.0, t1: 93.15, pic: BARAB, mode: 'fit', from: [.5, .5, 1.1], to: [.5, .5, 1.22] },
  { t0: 93.0, t1: 95.35, pic: CROSS, from: [.55, .55, 1.2], to: [.5, .5, 1.05] },
  { t0: 95.2, t1: 97.75, pic: LED, from: [.3, .55, 1.15], to: [.4, .5, 1.3] },
  { t0: 97.6, t1: 101.2, pic: CRUC, mode: 'fit', from: [.5, .5, 1.0], to: [.5, .45, 1.2] },
  { t0: 101.05, t1: DUR + .1, pic: GABB, mode: 'fit', from: [.5, .5, 1.0], to: [.5, .5, 1.1] },
];
const CH: [number, string][] = [[0, 'two prisoners'], [17.6, 'barabbas'], [36.0, 'the dream'], [44.6, 'the choice'], [62.7, 'the name'], [87.0, 'his place']];
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
const Hud: React.FC<{ t: number }> = ({ t }) => {
  let ci = 0; CH.forEach(([s], i) => { if (t >= s) ci = i; });
  const y = 245, n = CH.length, gap = 10, sw = (SR - SL - gap * (n - 1)) / n;
  const ca = eout(P(t, CH[ci][0], CH[ci][0] + .4));
  return <>
    <div style={{ ...abs(SL, y - 34), width: 68, height: 68, borderRadius: '50%', boxShadow: '0 0 0 2px rgba(212,175,106,.7)' }}><Logo size={68} /></div>
    <div style={{ position: 'absolute', left: SL + 80, top: y - 36, fontFamily: CIN, fontWeight: 700, fontSize: 29, color: CR }}>The Lost Scriptures</div>
    <div style={{ position: 'absolute', left: SL + 80, top: y + 4, fontFamily: CORI, fontWeight: 600, fontSize: 27, color: 'rgba(243,231,207,.65)' }}>jesus or barabbas · Matthew 27</div>
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

/* Matthew 27:17 in Greek, the reading with the name (NA28 prints [Ἰησοῦν τὸν] in brackets), drawn as a parchment leaf in uncials */
const MS = [['ΤΙΝΑ ΘΕΛΕΤΕ ΑΠΟ'], ['ΛΥΣΩ ΥΜΙΝ'], ['', 'ΙΗΣΟΥΝ ΤΟΝ'], ['', 'ΒΑΡΑΒΒΑΝ'], ['Η ΙΗΣΟΥΝ ΤΟΝ'], ['ΛΕΓΟΜΕΝΟΝ'], ['ΧΡΙΣΤΟΝ']];
const Parch: React.FC<{ t: number; t0: number; t1: number; hi: number }> = ({ t, t0, t1, hi }) => {
  const a = env(t, t0, t1, .35, .3); if (a <= 0) return null;
  const h = clamp((t - hi) / .3);
  return <div style={{ position: 'absolute', left: CX - 330, top: 560, width: 660, height: 680, opacity: a, scale: String(lerp(.92, 1, eout(P(t, t0, t0 + .6)))), rotate: '-1.5deg', borderRadius: 8,
    background: 'radial-gradient(ellipse at 45% 40%, #efe0bd 0%, #d9c393 60%, #a98d5c 100%)', boxShadow: '0 30px 80px rgba(0,0,0,.85), inset 0 0 70px rgba(90,60,20,.55)', padding: '50px 40px', boxSizing: 'border-box' }}>
    {MS.map((l, i) => {
      const reveal = clamp((t - t0 - .3 - i * .22) / .35);
      const isHi = l[0] === '';
      return <div key={i} style={{ fontFamily: GRK, fontWeight: 700, fontSize: 50, letterSpacing: 4, lineHeight: 1.6, textAlign: 'center', color: '#3b2a18', opacity: reveal, whiteSpace: 'nowrap' }}>
        {isHi ? <span style={{ color: h > 0 ? `rgb(${Math.round(lerp(59, 150, h))},${Math.round(lerp(42, 20, h))},${Math.round(lerp(24, 20, h))})` : undefined, background: `rgba(243,212,140,${.6 * h})`, borderRadius: 6, padding: '0 6px', boxShadow: h > 0 ? `0 0 ${30 * h}px rgba(243,212,140,${.8 * h})` : undefined }}>{l[1]}</span> : l[0]}
      </div>;
    })}
  </div>;
};

const HITS: [number, number, number][] = [[0.2, 10, 6], [2.6, 12, 6], [5.2, 14, 6], [7.3, 12, 6], [13.9, 10, 6], [23.9, 18, 5], [27.9, 14, 5], [33.1, 10, 6], [49.5, 24, 4], [53.2, 12, 6], [59.1, 12, 6], [71.1, 18, 5], [82.2, 12, 6], [89.0, 14, 5], [93.8, 10, 6], [99.2, 14, 5]];
const shotAt = (t: number) => { let s: S = SH[0]; for (const x of SH) if (t >= x.t0 + .15) s = x; return s; };

export const StoryVideo: React.FC = () => {
  const t = useCurrentFrame() / FPS;
  let sx = 0, sy = 0; for (const [h, amp, dec] of HITS) { const [x, y] = shake(t, h, amp, dec); sx += x; sy += y; }
  const cur = shotAt(t);
  const flash = Math.max(env(t, 23.85, 24.3, .05, .4) * .6, env(t, 49.45, 49.95, .04, .45), env(t, 71.05, 71.5, .04, .4) * .5, env(t, 89.0, 89.45, .04, .4) * .4);
  return <AbsoluteFill style={{ backgroundColor: '#040409', overflow: 'hidden' }}>
    <div style={{ position: 'absolute', inset: 0, translate: `${sx}px ${sy}px`, scale: '1.03' }}>
      {SH.map((s, i) => s.clip ? <Clip key={i} t={t} t0={s.t0} t1={s.t1} clip={s.clip} at={s.at} vw={1080} vh={s.vh!} mode="band" />
        : <Shot key={i} t={t} t0={s.t0} t1={s.t1} pic={s.pic!} from={s.from!} to={s.to} mode={s.mode} />)}
    </div>
    <PhotoShade />
    {/* red wash on the verdict */}
    <AbsoluteFill style={{ background: 'radial-gradient(ellipse at 50% 55%, rgba(120,10,20,0) 30%, rgba(120,10,20,.55) 100%)', opacity: env(t, 49.4, 54.2, .15, .8) }} />
    {/* dim for the manuscript / Aramaic panels */}
    <AbsoluteFill style={{ background: 'rgba(4,4,9,.6)', opacity: Math.max(env(t, 68.3, 72.4, .3, .3), env(t, 77.2, 81.9, .3, .3) * .8, env(t, 82.1, 85.2, .3, .3)) }} />
    <AbsoluteFill style={{ background: '#FFF6E0', opacity: flash * .7 }} />
    <Credit s={t < DUR - 5.4 ? (cur.credit ?? cur.pic?.credit) : undefined} a={1} />

    {/* ---- hook ---- */}
    <Title t={t} t0={0.25} t1={2.6} y={1000} lines={['TWO PRISONERS']} size={92} from="slam" />
    <Title t={t} t0={5.2} t1={7.1} y={990} lines={['BOTH NAMED', 'JESUS']} size={104} style={['c', 'g']} from="slam" />
    <Title t={t} t0={7.3} t1={8.85} y={1150} lines={['WHICH ONE?']} size={110} from="slam" />
    <Chip s="MATTHEW 27 : 15–26" y={1120} a={env(t, 8.95, 10.6, .25, .25)} />
    <Chip s="PASSOVER · JERUSALEM" y={1080} a={env(t, 11.0, 12.95, .25, .25)} />
    <Stamp s="ARRESTED" y={1080} t={t} t0={13.9} t1={15.2} color="#ff5a4a" size={70} rot={-4} />
    <Chip s="PONTIUS PILATE · ROMAN GOVERNOR" y={1200} a={env(t, 16.4, 17.6, .2, .25)} size={26} />
    <Sub s="one prisoner released at the feast" y={1150} a={env(t, 18.3, 21.8, .3, .3)} size={46} color={GL} />
    <Chip s="“WHOM THEY WOULD” · MATTHEW 27 : 15" y={1240} a={env(t, 20.6, 21.8, .2, .25)} size={24} />
    {/* ---- barabbas ---- */}
    <Sub s="“a notable prisoner”" y={1060} a={env(t, 22.5, 23.8, .2, .2)} size={52} />
    <Title t={t} t0={23.9} t1={24.85} y={1000} lines={['BARABBAS']} size={120} from="slam" />
    <Chip s="MARK 15 : 7" y={1220} a={env(t, 25.0, 29.2, .25, .3)} />
    <Sub s="bound with the rebels" y={1120} a={env(t, 25.8, 27.7, .25, .2)} size={48} color={CR} />
    <Stamp s="MURDER" y={1080} t={t} t0={27.9} t1={29.25} color="#ff5a4a" size={84} rot={4} />
    <Title t={t} t0={31.0} t1={32.75} y={1110} lines={['“WHOM WILL YE', 'THAT I RELEASE?”']} size={60} from="up" />
    <Title t={t} t0={33.1} t1={35.95} y={940} lines={['BARABBAS', 'OR', 'JESUS']} size={96} style={['r', 'c', 'g']} from="zoom" />
    <Sub s="“which is called Christ”" y={1290} a={env(t, 34.6, 35.95, .2, .25)} size={44} color={GL} />
    {/* ---- the dream ---- */}
    <Sub s="a message from his own wife" y={1170} a={env(t, 36.6, 38.3, .25, .25)} size={48} color={GL} />
    <Title t={t} t0={39.0} t1={41.2} y={1100} lines={['“THAT JUST MAN”']} size={78} from="up" />
    <Title t={t} t0={42.2} t1={44.45} y={1100} lines={['“…IN A DREAM', 'BECAUSE OF HIM”']} size={64} from="up" />
    <Chip s="MATTHEW 27 : 19" y={1290} a={env(t, 39.2, 44.4, .3, .3)} />
    {/* ---- the choice ---- */}
    <Sub s="the chief priests work the crowd" y={1150} a={env(t, 44.9, 46.6, .25, .25)} size={46} color={CR} />
    <Title t={t} t0={46.7} t1={48.3} y={1000} lines={['WHICH OF', 'THE TWO?']} size={100} style={['c', 'g']} from="slam" />
    <Stamp s="BARABBAS!" y={950} t={t} t0={49.5} t1={50.75} color="#ff5a4a" size={110} rot={-5} />
    <Title t={t} t0={52.8} t1={54.15} y={1080} lines={['“LET HIM BE', 'CRUCIFIED”']} size={84} style={['c', 'r']} from="slam" />
    <Title t={t} t0={56.1} t1={58.5} y={1110} lines={['“I AM INNOCENT', 'OF THE BLOOD”']} size={66} from="up" />
    <Chip s="MATTHEW 27 : 24" y={1290} a={env(t, 56.3, 58.45, .3, .3)} />
    <Stamp s="FREE" y={1050} t={t} t0={59.55} t1={60.4} color={GL} size={96} rot={-3} />
    <Sub s="led away to the cross" y={1170} a={env(t, 61.0, 62.6, .25, .25)} size={50} color={CR} />
    {/* ---- the name ---- */}
    <Title t={t} t0={62.75} t1={65.0} y={1000} lines={['WHAT MOST PEOPLE', 'NEVER HEAR']} size={74} style={['c', 'g']} from="up" />
    <Counter t={t} t0={65.6} t1={68.15} n={250} y={860} label="AD · ORIGEN" />
    <Chip s="ORIGEN · COMMENTARY ON MATTHEW" y={1210} a={env(t, 67.4, 68.2, .2, .25)} size={24} />
    <Parch t={t} t0={68.4} t1={72.35} hi={71.1} />
    <Chip s="MATTHEW 27 : 17 · IN GREEK" y={1270} a={env(t, 68.8, 71.1, .3, .2)} size={26} />
    <Title t={t} t0={71.1} t1={72.3} y={1275} lines={['JESUS BARABBAS']} size={72} from="slam" />
    <Sub s="he suspected scribes dropped the name" y={1090} a={env(t, 72.6, 74.6, .25, .25)} size={44} color={CR} />
    <Sub s="so a sinner would not bear the name of Jesus" y={1160} a={env(t, 74.6, 77.0, .25, .25)} size={40} color={GL} />
    <Chip s="CODEX KORIDETHI · OLD SYRIAC · ARMENIAN" y={980} a={env(t, 77.5, 81.9, .3, .3)} size={24} />
    <Title t={t} t0={79.7} t1={81.95} y={1080} lines={['“JESUS BARABBAS”']} size={72} from="up" />
    <Chip s="NRSV · NIV · CEB" y={1220} a={env(t, 80.2, 81.95, .25, .25)} />
    <div style={{ ...abs(SL, 820, SR - SL), textAlign: 'center', opacity: env(t, 82.3, 85.15, .3, .3) }}>
      <div style={{ fontFamily: HEB, fontWeight: 700, fontSize: 150, direction: 'rtl', ...goldText }}>בר אבא</div>
      <div style={{ fontFamily: CIN, fontWeight: 700, fontSize: 38, letterSpacing: 6, color: CR, marginTop: 10, whiteSpace: 'nowrap', textShadow: '0 2px 12px #000' }}>BAR-ABBA · ARAMAIC</div>
    </div>
    <Title t={t} t0={84.1} t1={85.15} y={1160} lines={['“SON OF THE FATHER”']} size={64} from="slam" />
    <Sub s="Pilate’s choice" y={1150} a={env(t, 85.4, 86.9, .2, .2)} size={52} color={GL} />
    <Title t={t} t0={87.1} t1={91.0} y={860} lines={['JESUS,', 'SON OF THE FATHER']} size={66} style={['r', 'c']} from="up" />
    <Title t={t} t0={88.9} t1={91.0} y={1100} lines={['OR JESUS,', 'THE SON OF THE FATHER']} size={62} style={['g', 'g']} from="up" />
    {/* ---- his place ---- */}
    <Title t={t} t0={91.3} t1={93.0} y={1020} lines={['THE GUILTY', 'WALKED FREE']} size={86} style={['c', 'g']} from="slam" />
    <Title t={t} t0={93.2} t1={95.2} y={1020} lines={['THE INNOCENT', 'DIED IN HIS PLACE']} size={74} style={['c', 'r']} from="slam" />
    <Sub s="word for word" y={1150} a={env(t, 97.6, 99.1, .2, .2)} size={52} color={GL} />
    <Title t={t} t0={99.2} t1={101.0} y={1010} lines={['“JESUS TOOK', 'MY PLACE”']} size={92} from="slam" />
    {/* ---- follow ---- */}
    <AbsoluteFill style={{ background: 'rgba(4,4,9,.72)', opacity: env(t, 101.0, DUR + 1, .4, .1) }} />
    <div style={{ ...abs(CX - 70, 640), width: 140, height: 140, opacity: env(t, 101.1, DUR + 1, .4, .1), borderRadius: '50%', boxShadow: '0 0 0 3px rgba(212,175,106,.8), 0 0 60px rgba(212,175,106,.4)' }}><Logo size={140} /></div>
    <Sub s="@lostscripturesbooks" y={800} a={env(t, 101.3, DUR + 1, .4, .1)} size={40} color={GL} />
    <Title t={t} t0={101.2} t1={DUR + 1} y={880} lines={['FOLLOW']} size={140} from="slam" />
    <Sub s="for more stories from the Bible" y={1060} a={eout(P(t, 101.8, 102.3))} size={50} />
    <Sub s="that most people never hear" y={1125} a={eout(P(t, 103.4, 103.9))} size={50} color={GL} />

    <AbsoluteFill style={{ background: 'radial-gradient(ellipse at 50% 46%, rgba(0,0,0,0) 58%, rgba(0,0,0,.5) 100%)' }} />
    <Hud t={t} /><Captions t={t} />
    <AbsoluteFill style={{ backgroundColor: '#000', opacity: Math.max(1 - P(t, 0, .2), P(t, DUR - .6, DUR)) }} />
  </AbsoluteFill>;
};

/* TikTok cover: grid crops the centre 3:4 (y ≈ 240–1680) — all text inside y 280–1640 */
export const StoryCover: React.FC = () => <AbsoluteFill style={{ backgroundColor: '#040409', overflow: 'hidden' }}>
  <Shot t={1} t0={0} t1={2} pic={CRUC} from={[.5, .5, 1.0]} fi={0} fo={0} />
  <AbsoluteFill style={{ background: 'linear-gradient(180deg, rgba(4,4,9,.96) 12%, rgba(4,4,9,.6) 32%, rgba(4,4,9,0) 44%, rgba(4,4,9,0) 60%, rgba(4,4,9,.9) 76%, rgba(4,4,9,.97) 90%)' }} />
  <div style={{ ...abs(CX - 34 + 40, 300), width: 68, height: 68 }}><Logo size={68} /></div>
  <div style={{ ...abs(90, 390, 900), textAlign: 'center', fontFamily: CIN, fontWeight: 700, fontSize: 40, letterSpacing: 8, color: CR, opacity: .9 }}>PILATE HAD TWO PRISONERS</div>
  <div style={{ ...abs(90, 450, 900), textAlign: 'center', ...goldText, fontFamily: CIN, fontWeight: 700, fontSize: 116, lineHeight: 1.02 }}>BOTH NAMED<br />JESUS</div>
  <div style={{ ...abs(90, 1320, 900), textAlign: 'center', fontFamily: CIN, fontWeight: 700, fontSize: 66, lineHeight: 1.1, color: '#ff6a5a', textShadow: '0 0 30px rgba(220,40,30,.6), 0 4px 10px rgba(0,0,0,.9)' }}>THE CROWD<br />CHOSE THE OTHER</div>
  <div style={{ ...abs(90, 1530, 900), textAlign: 'center', fontFamily: CORI, fontWeight: 600, fontSize: 40, color: 'rgba(243,231,207,.75)' }}>Matthew 27 · “Barabbas, or Jesus?”</div>
  <AbsoluteFill style={{ background: 'radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0) 60%, rgba(0,0,0,.55) 100%)' }} />
</AbsoluteFill>;
