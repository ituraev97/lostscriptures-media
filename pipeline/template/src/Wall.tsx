import React from 'react';
import { AbsoluteFill, staticFile, useCurrentFrame } from 'remotion';
import { loadFont } from '@remotion/fonts';
import { W, H, FPS, END, CX, SL, SR, CY, G, GL, CR, RED, FIRE, CIN, CORI, HEB, SANS, MONO, P, eio, eout, eback, lerp, env, rnd, clamp, spring, shake, CH, T } from './lib';
import { Babylon, Hall, Chalice, Idol, Wall, Hand, KingBust, Sage, Hourglass, Scales, CrownSplit, CityMap } from './Art';
import { CAPS } from './caps';

loadFont({ family: 'Cin', url: staticFile('cinzel-latin-700-normal.woff2'), weight: '700' });
loadFont({ family: 'Cin', url: staticFile('cinzel-latin-400-normal.woff2'), weight: '400' });
loadFont({ family: 'CorI', url: staticFile('cormorant-garamond-latin-600-italic.woff2'), weight: '600', style: 'normal' });
loadFont({ family: 'Heb', url: staticFile('noto-serif-hebrew-hebrew-700-normal.woff2'), weight: '700' });

/* ---------------- primitives ---------------- */
const abs = (x: number, y: number, w?: number): React.CSSProperties => ({ position: 'absolute', left: x, top: y, width: w });
const Layer: React.FC<{ a: number; children: React.ReactNode; z?: number; origin?: [number, number]; style?: React.CSSProperties }> = ({ a, children, z = 1, origin = [CX, CY], style }) =>
  a <= 0.001 ? null : <div style={{ position: 'absolute', inset: 0, opacity: a, scale: String(z), transformOrigin: `${origin[0]}px ${origin[1]}px`, ...style }}>{children}</div>;
const goldText: React.CSSProperties = { background: 'linear-gradient(180deg,#FFF4C8 0%,#F2CF73 40%,#C99130 75%,#8A5E20 100%)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent', filter: 'drop-shadow(0 0 20px rgba(240,190,100,.5)) drop-shadow(0 5px 6px rgba(0,0,0,.7))' };
const fireText: React.CSSProperties = { color: '#FFE2A6', textShadow: '0 0 18px rgba(255,170,60,.95), 0 0 50px rgba(255,120,30,.8), 0 0 90px rgba(255,90,20,.55)' };
const Center: React.FC<{ y: number; children: React.ReactNode; w?: number; x?: number }> = ({ y, children, w = SR - SL, x = CX }) => <div style={{ position: 'absolute', left: x - w / 2, top: y, width: w, textAlign: 'center' }}>{children}</div>;
const Title: React.FC<{ t: number; t0: number; t1: number; y: number; lines: string[]; size?: number; style?: ('g' | 'c' | 'r')[]; from?: 'up' | 'zoom' | 'slam' }> = ({ t, t0, t1, y, lines, size = 104, style, from = 'zoom' }) => {
  const a = env(t, t0, t1, .25, .35); if (a <= 0) return null;
  const k = P(t, t0, t0 + .5);
  const sc = from === 'slam' ? lerp(1.9, 1, eout(P(t, t0, t0 + .2))) : from === 'zoom' ? lerp(1.12, 1, eout(k)) : 1;
  const dy = from === 'up' ? (1 - eout(k)) * 50 : 0;
  return <div style={{ ...abs(SL, y + dy, SR - SL), textAlign: 'center', opacity: a, scale: String(sc), transformOrigin: 'center' }}>
    {lines.map((l, i) => { const s = style?.[i] ?? 'g'; return <div key={i} style={{ fontFamily: CIN, fontWeight: 700, fontSize: size, lineHeight: 1.08, letterSpacing: 3, ...(s === 'g' ? goldText : s === 'r' ? { color: '#ff6a5a', textShadow: '0 0 30px rgba(220,40,30,.6), 0 4px 10px rgba(0,0,0,.8)' } : { color: CR, textShadow: '0 4px 18px rgba(0,0,0,.9)' }) }}>{l}</div>; })}
  </div>;
};
const Label: React.FC<{ s: string; x?: number; y: number; a: number; size?: number; color?: string; w?: number; ls?: number }> = ({ s, x = CX, y, a, size = 30, color = G, w = SR - SL, ls = 5 }) =>
  a <= 0 ? null : <div style={{ ...abs(x - w / 2, y + (1 - eout(a)) * 16, w), textAlign: 'center', opacity: a, fontFamily: CIN, fontWeight: 700, fontSize: size, letterSpacing: ls, color, textShadow: '0 2px 14px rgba(0,0,0,.95)' }}>{s}</div>;
const Sub: React.FC<{ s: string; y: number; a: number; size?: number; x?: number; color?: string }> = ({ s, y, a, size = 44, x = CX, color = CR }) =>
  a <= 0 ? null : <div style={{ ...abs(x - 430, y + (1 - eout(a)) * 14, 860), textAlign: 'center', opacity: a, fontFamily: CORI, fontWeight: 600, fontSize: size, color, textShadow: '0 2px 14px rgba(0,0,0,.95)' }}>{s}</div>;
const Chip: React.FC<{ s: string; x?: number; y: number; a: number; size?: number; color?: string; border?: string }> = ({ s, x = CX, y, a, size = 28, color = GL, border = G }) =>
  a <= 0 ? null : <div style={{ position: 'absolute', left: x, top: y, translate: '-50% 0', opacity: a, scale: String(lerp(.8, 1, eback(clamp(a)))), padding: '12px 28px', borderRadius: 40, background: 'rgba(10,8,18,.92)', border: `2.5px solid ${border}`, fontFamily: CIN, fontWeight: 700, fontSize: size, letterSpacing: 3, color, whiteSpace: 'nowrap', boxShadow: '0 8px 30px rgba(0,0,0,.6)' }}>{s}</div>;
const Stamp: React.FC<{ s: string; y: number; t: number; t0: number; t1: number; color?: string; size?: number; rot?: number; x?: number }> = ({ s, y, t, t0, t1, color = G, size = 56, rot = -4, x = CX }) => {
  const a = env(t, t0, t1, .12, .3); if (a <= 0) return null;
  return <div style={{ position: 'absolute', left: x, top: y, translate: '-50% 0', rotate: `${rot}deg`, scale: String(lerp(1.9, 1, eout(P(t, t0, t0 + .2)))), opacity: a, border: `5px solid ${color}`, borderRadius: 12, padding: '6px 30px', fontFamily: CIN, fontWeight: 700, fontSize: size, letterSpacing: 5, color, whiteSpace: 'nowrap', background: 'rgba(8,6,12,.7)' }}>{s}</div>;
};
const Glow: React.FC<{ x: number; y: number; r: number; a: number; col?: string }> = ({ x, y, r, a, col = '255,200,120' }) =>
  a <= 0 ? null : <div style={{ position: 'absolute', left: x - r, top: y - r, width: 2 * r, height: 2 * r, borderRadius: '50%', opacity: a, background: `radial-gradient(circle, rgba(${col},.5) 0%, rgba(${col},0) 70%)` }} />;
/* full-width illustration fading top & bottom */
const Plate: React.FC<{ y?: number; children: React.ReactNode; fade?: [number, number] }> = ({ y = 420, children, fade = [8, 88] }) => {
  const m = `linear-gradient(180deg, transparent 0%, #000 ${fade[0]}%, #000 ${fade[1]}%, transparent 100%)`;
  return <div style={{ ...abs(0, y), WebkitMaskImage: m, maskImage: m }}>{children}</div>;
};
const logZ = (p: number, a: number, b: number) => a * Math.pow(b / a, p);

/* ---------------- scenes ---------------- */
const S1Babylon: React.FC<{ t: number }> = ({ t }) => {
  const a = env(t, 0, 6.75, .3, .4);
  return <Layer a={a} z={logZ(P(t, 0, 6.75), 1, 1.16)} origin={[540, 1150]}>
    <Plate y={430}><Babylon t={t} party={eio(P(t, 5.5, 6.6))} /></Plate>
    <Title t={t} t0={T.babylon} t1={2.5} y={500} lines={['BABYLON']} size={150} from="slam" />
    <Stamp s="539 BC" y={700} t={t} t0={T.y539} t1={2.5} size={60} />
    <Label s="THE RICHEST CITY" y={510} a={env(t, T.richest, 5.6, .3, .3)} size={62} color={GL} ls={4} />
    <Sub s="on Earth" y={600} a={env(t, T.richest + .5, 5.6, .3, .3)} size={56} />
    <Title t={t} t0={T.party - .05} t1={6.75} y={510} lines={['TONIGHT', 'A PARTY']} size={92} style={['c', 'g']} from="up" />
  </Layer>;
};
const S2Hall: React.FC<{ t: number }> = ({ t }) => {
  const a = env(t, 6.55, 14.8, .25, .35);
  const lords = Math.round(eout(P(t, T.thousand - .1, T.thousand + 1.1)) * 1000);
  return <Layer a={a} z={logZ(P(t, 6.6, 14.8), 1, 1.22)} origin={[540, 800]}>
    <Plate y={420}><Hall t={t} cups={eout(P(t, T.wine - .1, T.wine + .6))} dark={eio(P(t, T.something - .2, T.something + .8))} /></Plate>
    <Chip s="KING BELSHAZZAR" y={1320} a={env(t, T.bel, T.something, .3, .3)} size={32} />
    {t > T.thousand - .15 && <Center y={490}><div style={{ ...goldText, fontFamily: CIN, fontWeight: 700, fontSize: 120, lineHeight: 1, opacity: env(t, T.thousand - .15, T.something, .2, .3) }}>{lords.toLocaleString('en-US')}</div></Center>}
    <Label s="LORDS" y={620} a={env(t, T.thousand + .2, T.something, .3, .3)} size={44} color={CR} ls={14} />
    <Label s="THE WINE FLOWS" y={1250} a={env(t, T.wine, T.something, .3, .3)} size={34} color={FIRE} />
    <Title t={t} t0={T.something + .05} t1={14.8} y={560} lines={['SOMETHING', 'NO ONE SHOULD', 'EVER DO']} size={84} style={['c', 'c', 'r']} from="up" />
  </Layer>;
};
const S3Cups: React.FC<{ t: number }> = ({ t }) => {
  const a = env(t, 14.55, 20.8, .3, .35);
  const tilt = -22 * eio(P(t, T.drink, T.drink + .8));
  const pop = (t0: number) => spring(P(t, t0, t0 + 1.2), 10, 5.5);
  return <Layer a={a} z={logZ(P(t, 14.6, 20.8), 1, 1.1)}>
    <Glow x={CX} y={900} r={620} a={1} />
    <div style={{ ...abs(CX - 420, 830), scale: String(pop(15.15)), transformOrigin: '130px 360px' }}><Chalice t={t} width={250} id="c2" tilt={tilt} /></div>
    <div style={{ ...abs(CX + 170, 830), scale: String(pop(15.45)), transformOrigin: '130px 360px' }}><Chalice t={t + .7} width={250} id="c3" tilt={-tilt} /></div>
    <div style={{ ...abs(CX - 210, 620), scale: String(pop(T.golden)), transformOrigin: '210px 560px' }}><Chalice t={t + .3} width={420} id="c1" tilt={tilt * .6} /></div>
    <Label s="THE GOLDEN CUPS" y={500} a={env(t, T.golden, T.stolen, .25, .2)} size={52} color={GL} />
    <Stamp s="STOLEN" y={490} t={t} t0={T.stolen} t1={T.drink} color={RED} size={72} />
    <Label s="FROM THE TEMPLE OF GOD" y={1255} a={env(t, T.temple, T.drink, .3, .3)} size={32} color={CR} />
    <Label s="JERUSALEM" y={1305} a={env(t, T.jeru, T.drink, .3, .3)} size={48} color={GL} ls={10} />
    <Title t={t} t0={T.drink} t1={20.8} y={490} lines={['AND THEY', 'DRINK FROM THEM']} size={70} style={['c', 'g']} from="up" />
  </Layer>;
};
const MATS: [string, string, [string, string, string], boolean][] = [
  ['GOLD', 'gold', ['#F2CF73', '#FFF4C8', '#6E4710'], false],
  ['SILVER', 'silver', ['#c8ccd4', '#ffffff', '#4f535b'], false],
  ['BRONZE', 'bronze', ['#c07a3a', '#f3b885', '#4a2a10'], false],
  ['IRON', 'iron', ['#5f646e', '#a3a9b4', '#1b1d22'], false],
  ['WOOD', 'wood', ['#8f5c30', '#c48d52', '#3a2010'], true],
  ['STONE', 'stone', ['#8a8478', '#bcb6aa', '#3a3630'], false],
];
const S4Idols: React.FC<{ t: number }> = ({ t }) => {
  const a = env(t, 20.6, 26.0, .3, .3);
  const times = [T.gold, T.silver, T.bronze, T.iron, T.wood, T.stone];
  return <Layer a={a}>
    <Label s="TOASTING THEIR IDOLS" y={490} a={eout(P(t, T.idols - .1, T.idols + .3))} size={44} color={CR} />
    {MATS.map(([name, , mat, grain], i) => {
      const t0 = times[i] - .08, s = spring(P(t, t0, t0 + 1.1), 11, 6), col = i % 3, row = Math.floor(i / 3);
      const x = CX + (col - 1) * 290, y = 580 + row * 420;
      if (t < t0) return null;
      const lit = 1 - .45 * P(t, times[i] + .5, times[i] + 1.2);
      return <React.Fragment key={name}>
        <Glow x={x} y={y + 200} r={190} a={.8 * lit} col={i === 0 ? '255,210,120' : i === 1 ? '220,230,255' : '255,180,120'} />
        <div style={{ ...abs(x - 80, y), scale: String(s), transformOrigin: '80px 360px', translate: `0 ${(1 - eout(P(t, t0, t0 + .3))) * -60}px` }}><Idol width={160} mat={mat} grain={grain} id={`id${i}`} /></div>
        <Label s={name} x={x} w={280} y={y + 352} a={eout(P(t, t0, t0 + .25))} size={30} color={i === 0 ? GL : CR} ls={6} />
      </React.Fragment>;
    })}
  </Layer>;
};
const S5Stops: React.FC<{ t: number }> = ({ t }) => {
  const a = env(t, 25.85, 29.4, .2, .35);
  const black = eio(P(t, T.stops - .05, T.stops + .25));
  return <Layer a={a}>
    <div style={{ position: 'absolute', inset: 0, filter: `grayscale(${eio(P(t, 25.9, 27))}) brightness(${lerp(.9, .25, black)})` }}>
      <Plate y={420}><Hall t={T.hour} cups={1} dark={.3} /></Plate>
    </div>
    <Title t={t} t0={T.hour} t1={T.stops - .05} y={700} lines={['IN THAT', 'SAME HOUR']} size={96} style={['c', 'c']} from="up" />
    <Title t={t} t0={T.stops} t1={29.4} y={760} lines={['THE MUSIC', 'STOPS.']} size={112} style={['c', 'r']} from="slam" />
  </Layer>;
};
/* Aramaic, written right-to-left */
const ARAM = ['מנא מנא', 'תקל ופרסין'];
const Writing: React.FC<{ t: number; p1: number; p2: number; y: number; size?: number; glow?: number }> = ({ p1, p2, y, size = 128, glow = 1 }) => (
  <>{[p1, p2].map((p, i) => p <= 0 ? null : <div key={i} style={{ ...abs(SL, y + i * size * 1.25, SR - SL), height: size * 1.3, textAlign: 'center', direction: 'rtl', fontFamily: HEB, fontWeight: 700, fontSize: size, lineHeight: 1.2, ...fireText, opacity: glow, clipPath: `inset(-40px 0 -40px ${(1 - p) * 100}%)` }}>{ARAM[i]}</div>)}</>
);
// approx glyph extent of each line (centered) for the hand to follow
const LINE_W = [440, 620];
const S6Hand: React.FC<{ t: number }> = ({ t }) => {
  const a = env(t, 29.15, 36.6, .3, .35);
  const p1 = eio(P(t, T.fingers, 33.9)), p2 = eio(P(t, 33.95, 35.5));
  const ty = 640, size = 128;
  const writingLine = t < 33.92 ? 0 : 1;
  const p = writingLine ? p2 : p1, lw = LINE_W[writingLine];
  const ex = CX + lw / 2 - p * lw, ey = ty + writingLine * size * 1.25 + 95;
  // before writing: hover drifting in from the right
  const hov = eout(P(t, T.hand, T.fingers));
  const hx = t < T.fingers ? lerp(820, CX + LINE_W[0] / 2, hov) : t > 35.5 ? lerp(ex, 760, eio(P(t, 35.5, 36.4))) : ex;
  const hy = t < T.fingers ? lerp(980, ty + 95, hov) + Math.sin(t * 2.2) * 10 : ey + Math.sin(t * 30) * 3 * (t < 35.5 ? 1 : 0);
  const ha = env(t, T.hand - .05, 36.6, .6, .5);
  const HW = 330, k = HW / 400;
  return <Layer a={a} z={logZ(P(t, 29.2, 36.6), 1, 1.08)}>
    <Plate y={420} fade={[0, 92]}><Wall t={t} /></Plate>
    <Writing t={t} p1={p1} p2={p2} y={ty} size={size} />
    <Glow x={hx} y={hy} r={300} a={ha * .7} col="200,225,255" />
    <div style={{ ...abs(hx - 196 * k, hy - 102 * k), opacity: ha, scale: String(lerp(.85, 1, eout(P(t, T.hand, T.hand + .8)))), transformOrigin: `${196 * k}px ${102 * k}px` }}><Hand t={t} width={HW} /></div>
    <Title t={t} t0={T.hand - .05} t1={T.noarm - .05} y={500} lines={['A HAND APPEARS']} size={76} style={['c']} from="up" />
    <Chip s="NO ARM." x={CX - 200} y={500} a={env(t, T.noarm, T.fingers, .2, .3)} size={40} color={CR} border={RED} />
    <Chip s="NO BODY." x={CX + 200} y={500} a={env(t, T.nobody, T.fingers, .2, .3)} size={40} color={CR} border={RED} />
    <Label s="WRITING ON THE PALACE WALL" y={1330} a={env(t, T.writing - .2, 36.6, .3, .3)} size={32} color={GL} ls={4} />
  </Layer>;
};
const S7King: React.FC<{ t: number }> = ({ t }) => {
  const a = env(t, 36.3, 43.35, .25, .35);
  const kA = env(t, 36.3, 39.6, .25, .3), sA = env(t, 39.35, 43.35, .3, .35);
  const [kx, ky] = shake(t, T.knees, 22, 3.2);
  const knock = t > T.knees ? Math.sin((t - T.knees) * 48) * 5 * Math.exp(-(t - T.knees) * 1.4) : 0;
  return <Layer a={a}>
    <Layer a={kA} z={logZ(P(t, 36.3, 39.6), 1, 1.12)} origin={[CX, 760]}>
      <Glow x={CX} y={820} r={560} a={lerp(1, .35, P(t, T.pale, T.pale + 1))} col="255,170,90" />
      <div style={{ ...abs(CX - 280 + kx + knock, 680 + ky) }}><KingBust t={t} width={560} pale={eio(P(t, T.pale - .1, T.pale + .9))} fear={eio(P(t, T.pale - .2, T.knees))} /></div>
      <Title t={t} t0={T.pale - .05} t1={T.knees - .05} y={480} lines={['THE KING', 'TURNS PALE']} size={72} style={['c', 'c']} from="up" />
      <Title t={t} t0={T.knees} t1={39.6} y={480} lines={['HIS KNEES', 'KNOCK']} size={80} style={['c', 'r']} from="slam" />
    </Layer>
    <Layer a={sA}>
      <Glow x={CX} y={900} r={600} a={.6} col="160,140,255" />
      {[-1, 0, 1].map((d, i) => { const t0 = T.screams + .15 + i * .22; const s = spring(P(t, t0, t0 + 1), 10, 6); return <React.Fragment key={d}>
        <div style={{ ...abs(CX + d * 270 - 115, 700 + Math.abs(d) * 30 + (1 - s) * 80), opacity: clamp(s) }}><Sage t={t} width={230} robe={i === 1 ? ['#3a2a6a', '#140c2a'] : ['#2a4a5a', '#0c1a22']} hat id={`w${i}`} /></div>
        <div style={{ position: 'absolute', left: CX + d * 270, top: 600 + Math.abs(d) * 30, translate: '-50% 0', fontFamily: CIN, fontWeight: 700, fontSize: 96, color: GL, scale: String(spring(P(t, t0 + .4, t0 + 1.3), 12, 6)), textShadow: '0 0 20px rgba(240,200,120,.6)' }}>?</div>
      </React.Fragment>; })}
      <Label s="HIS WISE MEN" y={490} a={env(t, T.screams + .1, 43.35, .3, .3)} size={52} color={CR} />
      <Stamp s="NOT ONE COULD READ IT" y={1290} t={t} t0={T.notone} t1={43.35} color={RED} size={44} />
    </Layer>
  </Layer>;
};
const S8Daniel: React.FC<{ t: number }> = ({ t }) => {
  const a = env(t, 43.15, 49.9, .3, .3);
  const dA = env(t, 43.15, T.looks + .15, .3, .4), wA = env(t, T.looks - .1, 49.9, .5, .3);
  const walk = eout(P(t, 43.2, 45.4));
  return <Layer a={a}>
    <Layer a={dA} z={logZ(P(t, 43.2, 46.7), 1, 1.12)} origin={[CX, 900]}>
      <div style={{ position: 'absolute', left: CX - 220, top: 420, width: 440, height: 1100, background: 'linear-gradient(180deg, rgba(255,230,170,.0) 0%, rgba(255,230,170,.32) 30%, rgba(255,210,140,.12) 100%)', clipPath: 'polygon(35% 0, 65% 0, 100% 100%, 0 100%)' }} />
      <div style={{ ...abs(CX - 170 + (1 - walk) * 260, 640 + Math.sin(walk * 18) * 4 * (1 - walk)) }}><Sage t={t} width={340} robe={['#7a6a52', '#2e261a']} old id="dan" /></div>
      <Sub s="an old Jewish exile" y={500} a={env(t, T.bring + .4, T.daniel - .05, .3, .3)} size={56} />
      <Title t={t} t0={T.daniel} t1={T.looks + .2} y={490} lines={['DANIEL']} size={150} from="slam" />
    </Layer>
    <Layer a={wA} z={logZ(P(t, T.looks, 49.9), 1.1, 1)}>
      <Plate y={420} fade={[0, 92]}><Wall t={t} lamp={.8} /></Plate>
      <Writing t={t} p1={1} p2={1} y={640} glow={.75 + .25 * Math.sin(t * 5)} />
      <Stamp s="FOUR WORDS" y={1150} t={t} t0={T.four} t1={49.9} size={64} rot={-3} />
    </Layer>
  </Layer>;
};
const WORDS: [number, string, string][] = [[T.w1, 'MENE', 'מנא'], [T.w2, 'MENE', 'מנא'], [T.w3, 'TEKEL', 'תקל'], [T.w4, 'UPHARSIN', 'ופרסין']];
const S9Words: React.FC<{ t: number }> = ({ t }) => {
  const a = env(t, 49.8, 55.15, .1, .3);
  let wi = -1; WORDS.forEach(([s], i) => { if (t >= s - .05) wi = i; });
  return <Layer a={a}>
    <div style={{ position: 'absolute', inset: 0, filter: 'brightness(.35)' }}><Plate y={420} fade={[0, 92]}><Wall t={t} lamp={.7} /></Plate></div>
    {wi >= 0 && (() => {
      const [s, en, ar] = WORDS[wi]; const k = P(t, s - .05, s + .2);
      const fs = Math.min(210, 860 / (en.length * .82));
      return <>
        <Glow x={CX} y={860} r={480} a={1 - .4 * P(t, s, s + 1)} col="255,150,60" />
        <Center y={590}><div style={{ fontFamily: HEB, fontWeight: 700, fontSize: 150, lineHeight: 1.2, direction: 'rtl', ...fireText, opacity: eout(k), scale: String(lerp(1.4, 1, eout(k))) }}>{ar}</div></Center>
        <Center y={830}><div style={{ ...goldText, fontFamily: CIN, fontWeight: 700, fontSize: fs, lineHeight: 1.1, scale: String(lerp(2.2, 1, eout(k)) * (1 + .03 * (t - s))), opacity: eout(k) }}>{en}</div></Center>
      </>;
    })()}
    <div style={{ ...abs(SL, 1250, SR - SL), display: 'flex', justifyContent: 'center', gap: 22, fontFamily: CIN, fontWeight: 700, fontSize: 36, letterSpacing: 3 }}>
      {WORDS.map(([s, en], i) => <span key={i} style={{ color: i === wi ? GL : t >= s ? 'rgba(243,231,207,.7)' : 'rgba(243,231,207,.18)' }}>{en}</span>)}
    </div>
    <Label s={`${Math.max(1, wi + 1)} / 4`} y={1320} a={wi >= 0 ? 1 : 0} size={26} color="rgba(243,231,207,.55)" />
  </Layer>;
};
const VerdictHead: React.FC<{ t: number; t0: number; t1: number; word: string; ar: string }> = ({ t, t0, t1, word, ar }) => {
  const a = env(t, t0, t1, .25, .3); if (a <= 0) return null;
  return <div style={{ ...abs(SL, 478, SR - SL), opacity: a, display: 'flex', justifyContent: 'center', alignItems: 'baseline', gap: 26 }}>
    <span style={{ fontFamily: CIN, fontWeight: 700, fontSize: 64, letterSpacing: 6, ...goldText }}>{word}</span>
    <span style={{ fontFamily: HEB, fontWeight: 700, fontSize: 60, ...fireText }}>{ar}</span>
  </div>;
};
const S10Mene: React.FC<{ t: number }> = ({ t }) => {
  const a = env(t, 55.05, 58.9, .25, .3);
  return <Layer a={a} z={logZ(P(t, 55, 58.9), 1, 1.08)}>
    <Glow x={CX} y={820} r={480} a={.9} />
    <div style={abs(CX - 150, 590)}><Hourglass p={eio(P(t, 55.3, 58.3))} width={300} /></div>
    <VerdictHead t={t} t0={T.mene - .1} t1={58.9} word="MENE" ar="מנא" />
    <Title t={t} t0={T.numbered} t1={58.9} y={1060} lines={['NUMBERED']} size={110} from="slam" />
    <Sub s="your kingdom — brought to an end" y={1215} a={env(t, T.end - .1, 58.9, .3, .3)} size={46} />
  </Layer>;
};
const S11Tekel: React.FC<{ t: number }> = ({ t }) => {
  const a = env(t, 58.75, 62.3, .25, .3);
  const sw = t < T.wanting ? Math.sin((t - T.weighed) * 4.2) * .35 * clamp((t - T.weighed) * 2) : 0;
  const tilt = t < T.wanting ? sw : lerp(sw, 1, spring(P(t, T.wanting, T.wanting + 1), 8, 5));
  return <Layer a={a}>
    <Glow x={CX} y={860} r={520} a={.8} />
    <div style={abs(CX - 380, 620)}><Scales tilt={tilt} width={760} /></div>
    <VerdictHead t={t} t0={T.tekel - .1} t1={62.3} word="TEKEL" ar="תקל" />
    <Label s="WEIGHED ON THE SCALES" y={1300} a={env(t, T.weighed, T.wanting - .05, .3, .15)} size={38} color={CR} />
    <Stamp s="FOUND WANTING" y={1280} t={t} t0={T.wanting} t1={62.3} color={RED} size={60} />
  </Layer>;
};
const S12Peres: React.FC<{ t: number }> = ({ t }) => {
  const a = env(t, 62.1, 67.45, .25, .3);
  const p = spring(P(t, T.divided, T.divided + 1.4), 7, 5);
  return <Layer a={a} z={logZ(P(t, 62.1, 67.4), 1, 1.07)}>
    <Glow x={CX} y={880} r={520} a={.8} />
    <div style={abs(CX - 380, 650)}><CrownSplit p={p} width={760} /></div>
    <VerdictHead t={t} t0={T.peres - .1} t1={67.45} word="PERES" ar="פרס" />
    <Title t={t} t0={T.divided} t1={67.45} y={1130} lines={['DIVIDED']} size={96} style={['r']} from="slam" />
    <Chip s="MEDES" x={CX - 220} y={1270} a={env(t, T.medes, 67.45, .25, .3)} size={36} />
    <Chip s="PERSIANS" x={CX + 200} y={1270} a={env(t, T.persians, 67.45, .25, .3)} size={36} />
  </Layer>;
};
const S13Death: React.FC<{ t: number }> = ({ t }) => {
  const a = env(t, 67.25, 71.1, .3, .35);
  const fall = P(t, T.killed - .25, T.killed + .35);
  const cy = lerp(520, 1010, eio(fall) * eio(fall)), rot = lerp(0, 38, eout(fall));
  const bounce = t > T.killed + .35 ? Math.abs(Math.sin((t - T.killed - .35) * 9)) * 30 * Math.exp(-(t - T.killed - .35) * 4) : 0;
  return <Layer a={a}>
    <div style={{ position: 'absolute', inset: 0, filter: `brightness(${lerp(.45, .2, P(t, T.killed, T.killed + .4))}) saturate(.6)` }}><Plate y={420}><Hall t={t} cups={0} dark={1} /></Plate></div>
    <Title t={t} t0={T.night} t1={T.killed - .05} y={700} lines={['THAT VERY', 'NIGHT']} size={100} style={['c', 'c']} from="up" />
    {t > T.killed - .25 && <div style={{ ...abs(CX - 200, cy - bounce), rotate: `${rot}deg` }}><CrownSplit p={0} width={400} /></div>}
    <Title t={t} t0={T.killed} t1={71.1} y={560} lines={['BELSHAZZAR', 'WAS KILLED']} size={86} style={['c', 'r']} from="slam" />
    <AbsoluteFill style={{ background: 'radial-gradient(ellipse at 50% 50%, rgba(160,0,0,0) 35%, rgba(150,0,0,.75) 100%)', opacity: P(t, T.killed - .05, T.killed + .1) * (1 - .6 * P(t, T.killed + .3, 71)) }} />
  </Layer>;
};
const S14Herodotus: React.FC<{ t: number }> = ({ t }) => {
  const a = env(t, 70.85, 83.05, .3, .35);
  const cA = env(t, 70.85, 73.45, .25, .3), hA = env(t, 73.3, 76.3, .3, .35), mA = env(t, 76.0, 83.05, .4, .35);
  const zm = logZ(eio(P(t, 76, 82.8)), 1, 1.22);
  return <Layer a={a}>
    <Layer a={cA}><Title t={t} t0={T.chilling} t1={73.45} y={720} lines={['AND HERE\'S', 'THE CHILLING', 'PART']} size={88} style={['c', 'c', 'r']} from="up" /></Layer>
    <Layer a={hA} z={logZ(P(t, 73.3, 76.3), 1, 1.06)}>
      <div style={{ ...abs(SL + 40, 560 + (1 - eout(P(t, 73.3, 73.9))) * 60, SR - SL - 80), height: 700, borderRadius: 12, background: 'radial-gradient(ellipse at 50% 45%, #f1e3c2 0%, #dcc394 60%, #b8975f 100%)', boxShadow: '0 30px 70px rgba(0,0,0,.7), inset 0 0 60px rgba(90,50,15,.35)' }}>
        <div style={{ position: 'absolute', inset: 16, border: '3px solid rgba(110,70,30,.55)', borderRadius: 6 }} />
        <div style={{ position: 'absolute', inset: 0, padding: '70px 40px', textAlign: 'center' }}>
          <div style={{ fontFamily: CIN, fontWeight: 700, fontSize: 30, letterSpacing: 10, color: '#7a1a1a' }}>GREEK HISTORIAN</div>
          <div style={{ fontFamily: CIN, fontWeight: 700, fontSize: 92, color: '#2b1406', marginTop: 20 }}>HERODOTUS</div>
          <div style={{ width: 260, height: 3, background: 'rgba(110,70,30,.6)', margin: '26px auto' }} />
          <div style={{ fontFamily: CORI, fontWeight: 600, fontSize: 50, color: '#3a1c08' }}>Histories, Book I</div>
          <div style={{ fontFamily: CORI, fontWeight: 600, fontSize: 40, color: '#5a3a1c', marginTop: 40, lineHeight: 1.3, opacity: eout(P(t, T.feasting - .2, T.feasting + .3)) }}>“…while Babylon<br />was feasting…”</div>
        </div>
      </div>
    </Layer>
    <Layer a={mA} z={zm} origin={[560, 1000]}>
      <Plate y={430} fade={[4, 92]}><CityMap t={t} drain={eio(P(t, T.army, T.army + 2.2))} march={P(t, T.army + .5, T.fight)} /></Plate>
      <Label s="BABYLON" x={700} w={300} y={1040} a={env(t, 76.2, 83, .4, .3)} size={26} color={GL} />
      <Label s="EUPHRATES" x={330} w={300} y={600} a={env(t, 76.4, T.army + 1.2, .4, .4)} size={24} color="#9cc0f0" />
      <Chip s="THE PERSIAN ARMY" y={490} a={env(t, T.army, T.riverbed, .3, .25)} size={32} border={RED} />
      <Chip s="THROUGH THE RIVERBED" y={490} a={env(t, T.riverbed, T.fight, .25, .25)} size={32} border="#7aa8e8" />
    </Layer>
    <Stamp s="ALMOST WITHOUT A FIGHT" y={1290} t={t} t0={T.fight} t1={83.05} size={44} color={GL} />
  </Layer>;
};
const S15End: React.FC<{ t: number }> = ({ t }) => {
  const a = env(t, 82.85, 86.55, .3, .35);
  return <Layer a={a} z={logZ(P(t, 82.85, 86.55), 1, 1.1)}>
    <Glow x={CX} y={1000} r={500} a={.7} col="255,170,90" />
    <div style={{ ...abs(CX - 160, 560), rotate: '-96deg', transformOrigin: '180px 380px', filter: 'brightness(.85)' }}><Chalice t={t} width={300} id="spill" /></div>
    <div style={{ position: 'absolute', left: CX - 470, top: 1095, width: 380, height: 40, borderRadius: '50%', background: 'radial-gradient(ellipse, rgba(120,10,25,.95), rgba(90,5,15,0) 70%)', scale: `${lerp(.3, 1, eout(P(t, 82.9, 84.5)))} 1`, transformOrigin: 'right center' }} />
    <Title t={t} t0={T.partyNever} t1={86.55} y={500} lines={['THE PARTY', 'NEVER ENDED.']} size={84} style={['c', 'c']} from="up" />
    <Title t={t} t0={T.kingdom - .05} t1={86.55} y={1170} lines={['THE KINGDOM DID.']} size={80} from="slam" />
  </Layer>;
};
const S16Follow: React.FC<{ t: number }> = ({ t }) => {
  const a = env(t, 86.4, END + 1, .4, .1);
  return <Layer a={a}>
    <div style={{ position: 'absolute', inset: 0, filter: 'brightness(.42)' }}><Plate y={420} fade={[0, 92]}><Wall t={t} lamp={.7} /></Plate></div>
    <Writing t={t} p1={1} p2={1} y={560} size={96} glow={.5} />
    <Title t={t} t0={T.follow} t1={END + 1} y={880} lines={['FOLLOW']} size={140} from="slam" />
    <Sub s="for more stories from the Bible" y={1060} a={eout(P(t, T.follow + .5, T.follow + 1))} size={50} />
    <Sub s="that most people never hear" y={1125} a={eout(P(t, T.follow + 1.4, T.follow + 1.9))} size={50} color={GL} />
  </Layer>;
};

/* ---------------- HUD, captions, background ---------------- */
const EPISODE = 'the writing on the wall · Daniel 5'; // per-episode subtitle under the channel name
/* channel logo — @lostscripturesbooks (open book + 8-point star, gold on wine red) */
export const Logo: React.FC<{ size?: number }> = ({ size = 68 }) => (
  <svg width={size} height={size} viewBox="0 0 640 640" style={{ display: 'block', borderRadius: '50%' }}>
    <defs><radialGradient id="lgBg" cx="50%" cy="42%" r="65%"><stop offset="0" stopColor="#7A1A2C" /><stop offset="1" stopColor="#4A0B18" /></radialGradient>
      <linearGradient id="lgGold" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#F0D28F" /><stop offset=".55" stopColor="#D4AF6A" /><stop offset="1" stopColor="#A9823F" /></linearGradient></defs>
    <circle cx="320" cy="320" r="320" fill="url(#lgBg)" />
    <circle cx="320" cy="320" r="296" fill="none" stroke="url(#lgGold)" strokeWidth="10" />
    <g fill="none" stroke="url(#lgGold)" strokeWidth="14" strokeLinejoin="round" strokeLinecap="round">
      <path d="M320 300 C 270 270, 200 262, 140 270 L 140 450 C 200 442, 270 450, 320 480 Z" />
      <path d="M320 300 C 370 270, 440 262, 500 270 L 500 450 C 440 442, 370 450, 320 480 Z" />
      <path d="M320 300 L 320 480" /></g>
    <g stroke="#D4AF6A" strokeWidth="6" strokeLinecap="round" opacity=".8">
      <path d="M175 310 C 215 306, 255 310, 290 326" /><path d="M175 345 C 215 341, 255 345, 290 361" /><path d="M175 380 C 215 376, 255 380, 290 396" />
      <path d="M465 310 C 425 306, 385 310, 350 326" /><path d="M465 345 C 425 341, 385 345, 350 361" /><path d="M465 380 C 425 376, 385 380, 350 396" /></g>
    <path fill="url(#lgGold)" d="M320 120 L 333 175 L 375 150 L 350 192 L 405 205 L 350 218 L 375 260 L 333 235 L 320 290 L 307 235 L 265 260 L 290 218 L 235 205 L 290 192 L 265 150 L 307 175 Z" />
    <circle cx="320" cy="205" r="14" fill="#5C0F1F" />
  </svg>
);
const Hud: React.FC<{ t: number }> = ({ t }) => {
  let ci = 0; CH.forEach(([s], i) => { if (t >= s) ci = i; });
  const y = 245, n = CH.length, gap = 10, sw = (SR - SL - gap * (n - 1)) / n;
  const ca = eout(P(t, CH[ci][0], CH[ci][0] + .4));
  return <>
    <div style={{ position: 'absolute', left: 0, top: 0, width: W, height: 500, background: 'linear-gradient(180deg, rgba(4,4,10,.94) 0%, rgba(4,4,10,.62) 70%, rgba(4,4,10,0) 100%)' }} />
    <div style={{ ...abs(SL, y - 34), width: 68, height: 68, borderRadius: '50%', boxShadow: '0 0 0 2px rgba(212,175,106,.7)' }}><Logo size={68} /></div>
    <div style={{ position: 'absolute', left: SL + 80, top: y - 36, fontFamily: CIN, fontWeight: 700, fontSize: 29, color: CR }}>The Lost Scriptures</div>
    <div style={{ position: 'absolute', left: SL + 80, top: y + 4, fontFamily: CORI, fontWeight: 600, fontSize: 27, color: 'rgba(243,231,207,.6)' }}>{EPISODE}</div>
    <div style={{ position: 'absolute', left: SR - 300, top: y - 34, width: 300, textAlign: 'right', fontFamily: MONO, fontSize: 22, color: 'rgba(243,231,207,.45)' }}>{`${ci + 1}/${n}`}</div>
    <div style={{ position: 'absolute', left: SR - 300, top: y - 2 + (1 - ca) * 12, width: 300, textAlign: 'right', fontFamily: CORI, fontWeight: 600, fontSize: 32, color: G, opacity: ca }}>{CH[ci][1]}</div>
    {CH.map(([s], i) => { const en = i < n - 1 ? CH[i + 1][0] : END - 1; const p = clamp((t - s) / (en - s));
      return <div key={i} style={{ position: 'absolute', left: SL + i * (sw + gap), top: y + 54, width: sw, height: 5, borderRadius: 3, background: 'rgba(243,231,207,.14)' }}><div style={{ width: `${p * 100}%`, height: '100%', borderRadius: 3, background: i === 4 ? RED : G }} /></div>; })}
  </>;
};
const Captions: React.FC<{ t: number }> = ({ t }) => {
  let cur: typeof CAPS[number] | null = null; for (const p of CAPS) if (t >= p[0].s - .05) cur = p;
  if (!cur) return null; const last = cur[cur.length - 1]; if (t > last.e + .8) return null;
  const pa = eout(P(t, cur[0].s - .05, cur[0].s + .12));
  return <div style={{ position: 'absolute', left: SL - 20, top: 350, width: SR - SL + 40, display: 'flex', justifyContent: 'center', flexWrap: 'nowrap', gap: 15, opacity: pa, fontFamily: SANS, fontWeight: 800, fontSize: 52, whiteSpace: 'nowrap' }}>
    {cur.map((o, i) => { const spoken = t >= o.s - .03; const active = spoken && t < o.e + .1; const kw = Boolean(o.k) && spoken; const kp = eout(P(t, o.s - .03, o.s + .18));
      return <span key={i} style={{ position: 'relative', color: kw ? GL : spoken ? '#FFF8EA' : 'rgba(255,248,234,.28)', textShadow: kw ? '0 0 22px rgba(240,200,120,.7)' : '0 3px 16px rgba(0,0,0,.95)', translate: `0 ${active ? -4 * Math.sin(P(t, o.s, o.s + .25) * Math.PI) : 0}px`, scale: String(active ? 1 + .06 * Math.sin(P(t, o.s, o.s + .25) * Math.PI) : 1) }}>
        {o.w.replace(/—$/, '')}
        {kw && <span style={{ position: 'absolute', left: 0, bottom: -6, height: 5, width: `${kp * 100}%`, background: G, borderRadius: 3 }} />}
      </span>; })}
  </div>;
};
const R0 = rnd(11); const DUST = Array.from({ length: 60 }, () => ({ x: R0() * W, y: R0() * H, r: .8 + R0() * 2, a: .2 + R0() * .5, sp: 6 + R0() * 16, ph: R0() * 6.28 }));
const Background: React.FC<{ t: number }> = ({ t }) => {
  const red = env(t, T.killed - .1, 71, .2, .8);
  return <>
    <AbsoluteFill style={{ background: 'radial-gradient(ellipse at 50% 50%, #1b1630 0%, #0b0a16 45%, #040409 100%)' }} />
    <AbsoluteFill style={{ background: 'radial-gradient(ellipse at 50% 50%, #3a0a10 0%, #120306 60%, #050102 100%)', opacity: red }} />
    <svg width={W} height={H} style={{ position: 'absolute', left: 0, top: 0 }}>
      {DUST.map((d, i) => <circle key={i} cx={d.x + Math.sin(t * .35 + d.ph) * 12} cy={((d.y - t * d.sp) % H + H) % H} r={d.r} fill="#F0CD8C" opacity={d.a * (.6 + .4 * Math.sin(t * 1.2 + d.ph)) * .45} />)}
    </svg>
  </>;
};
const HITS: [number, number, number][] = [[T.babylon, 10, 6], [T.stops, 18, 5], [T.w1, 16, 6], [T.w2, 16, 6], [T.w3, 18, 6], [T.w4, 22, 5], [T.wanting, 12, 6], [T.divided, 14, 6], [T.killed, 26, 4], [T.kingdom, 16, 5]];

export const WallVideo: React.FC = () => {
  const frame = useCurrentFrame(); const t = frame / FPS;
  let sx = 0, sy = 0; for (const [h, amp, dec] of HITS) { const [x, y] = shake(t, h, amp, dec); sx += x; sy += y; }
  return (
    <AbsoluteFill style={{ backgroundColor: '#040409', overflow: 'hidden' }}>
      <Background t={t} />
      <div style={{ position: 'absolute', inset: 0, translate: `${sx}px ${sy}px` }}>
        <S1Babylon t={t} /><S2Hall t={t} /><S3Cups t={t} /><S4Idols t={t} /><S5Stops t={t} /><S6Hand t={t} /><S7King t={t} /><S8Daniel t={t} />
        <S9Words t={t} /><S10Mene t={t} /><S11Tekel t={t} /><S12Peres t={t} /><S13Death t={t} /><S14Herodotus t={t} /><S15End t={t} /><S16Follow t={t} />
      </div>
      <AbsoluteFill style={{ background: 'radial-gradient(ellipse at 50% 46%, rgba(0,0,0,0) 55%, rgba(0,0,0,.6) 100%)' }} />
      <Hud t={t} /><Captions t={t} />
      <AbsoluteFill style={{ backgroundColor: '#000', opacity: Math.max(1 - P(t, 0, .25), P(t, END - .6, END)) }} />
    </AbsoluteFill>
  );
};

/* ---------------- TikTok cover (grid shows the centre 3:4: y 240–1680) ---------------- */
export const WallCover: React.FC = () => {
  const t = 34.2;
  return (
    <AbsoluteFill style={{ backgroundColor: '#040409', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0, filter: 'brightness(.8)' }}><Plate y={260} fade={[16, 76]}><Wall t={t} /></Plate></div>
      <Writing t={t} p1={1} p2={1} y={760} size={130} />
      <Glow x={700} y={1090} r={320} a={.7} col="200,225,255" />
      <div style={{ ...abs(700 - 196 * .9, 1020 - 102 * .9) }}><Hand t={t} width={360} /></div>
      <AbsoluteFill style={{ background: 'linear-gradient(180deg, rgba(4,4,9,.95) 12%, rgba(4,4,9,0) 34%, rgba(4,4,9,0) 62%, rgba(4,4,9,.95) 82%)' }} />
      <Center y={300}><div style={{ fontFamily: CIN, fontWeight: 700, fontSize: 40, letterSpacing: 10, color: CR, opacity: .85 }}>A HAND APPEARED</div></Center>
      <Center y={360}><div style={{ ...goldText, fontFamily: CIN, fontWeight: 700, fontSize: 112, lineHeight: 1.04 }}>AND WROTE<br />4 WORDS</div></Center>
      <Center y={1360}><div style={{ fontFamily: CIN, fontWeight: 700, fontSize: 64, lineHeight: 1.1, color: '#ff6a5a', textShadow: '0 0 30px rgba(220,40,30,.6)' }}>THE KING WAS<br />DEAD BY MORNING</div></Center>
      <Center y={1560}><div style={{ fontFamily: CORI, fontWeight: 600, fontSize: 40, color: 'rgba(243,231,207,.7)' }}>Daniel 5 · the writing on the wall</div></Center>
      <AbsoluteFill style={{ background: 'radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0) 60%, rgba(0,0,0,.6) 100%)' }} />
    </AbsoluteFill>
  );
};
