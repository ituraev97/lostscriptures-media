import React from 'react';
import { rnd, lerp } from './lib';

const Blur: React.FC = () => (<>
  {[2, 4, 8, 14, 24].map((n) => <filter key={n} id={`bl${n}`} x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation={n} /></filter>)}
</>);
export const GoldGrad: React.FC<{ id: string }> = ({ id }) => (
  <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stopColor="#FFF4C8" /><stop offset=".25" stopColor="#F2CF73" /><stop offset=".55" stopColor="#D9A441" /><stop offset=".8" stopColor="#A9741F" /><stop offset="1" stopColor="#6E4710" />
  </linearGradient>
);

/* ---------- Babylon at night with the Ishtar Gate ---------- */
const Bull: React.FC<{ x: number; y: number; s: number; flip?: boolean }> = ({ x, y, s, flip }) => (
  <g transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`}>
    <path d="M-30 4 C -28 -8 -10 -12 10 -10 C 18 -14 24 -20 30 -18 L 26 -12 C 30 -10 32 -4 28 0 L 24 0 L 22 14 L 18 14 L 16 2 L -14 4 L -16 16 L -20 16 L -22 4 L -26 16 L -30 16 Z" fill="url(#bullG)" stroke="#5a3a0e" strokeWidth="1" />
  </g>
);
export const Babylon: React.FC<{ t: number; party: number }> = ({ t, party }) => {
  const R = rnd(4);
  const stars = Array.from({ length: 120 }, () => ({ x: R() * 1080, y: R() * 520, r: .5 + R() * 1.6, ph: R() * 6 }));
  const bricks = Array.from({ length: 14 * 20 }, (_, i) => ({ c: i % 14, r: Math.floor(i / 14), v: R() }));
  const torches = [[150, 690], [930, 690], [400, 520], [680, 520], [540, 330]];
  return (
    <svg width={1080} height={1150} viewBox="0 0 1080 1150" style={{ display: 'block' }}>
      <defs>
        <Blur />
        <linearGradient id="nsky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#05060f" /><stop offset=".6" stopColor="#121233" /><stop offset="1" stopColor={`rgb(${lerp(40, 90, party)},${lerp(26, 40, party)},${lerp(40, 30, party)})`} /></linearGradient>
        <linearGradient id="zig" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#2a1c14" /><stop offset=".5" stopColor="#5c4330" /><stop offset="1" stopColor="#1c120c" /></linearGradient>
        <linearGradient id="lapis" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#3a6fd8" /><stop offset="1" stopColor="#173a86" /></linearGradient>
        <GoldGrad id="bullG" />
        <radialGradient id="torch" cx=".5" cy=".5" r=".5"><stop offset="0" stopColor="#fff2c0" stopOpacity="1" /><stop offset=".3" stopColor="#ffae4a" stopOpacity=".7" /><stop offset="1" stopColor="#ff7a20" stopOpacity="0" /></radialGradient>
        <clipPath id="gateArch"><path d="M380 1150 L 380 760 C 380 650 700 650 700 760 L 700 1150 Z" /></clipPath>
      </defs>
      <rect width="1080" height="1150" fill="url(#nsky)" />
      {stars.map((s, i) => <circle key={i} cx={s.x} cy={s.y} r={s.r} fill="#fff4dc" opacity={.35 + .4 * Math.sin(t * 2 + s.ph)} />)}
      <circle cx="830" cy="430" r="58" fill="#f6ead0" opacity=".95" />
      <circle cx="852" cy="419" r="52" fill="#121233" opacity=".9" />
      {/* ziggurat */}
      {[0, 1, 2, 3, 4].map((k) => {
        const w = 620 - k * 110, h = 82, y = 640 - k * h;
        return <g key={k}><rect x={540 - w / 2} y={y} width={w} height={h} fill="url(#zig)" stroke="#120a06" strokeWidth="3" />
          <rect x={540 - w / 2} y={y} width={w} height="6" fill="#8a6a4c" opacity=".7" />
          {Array.from({ length: Math.floor(w / 46) }, (_, j) => <rect key={j} x={540 - w / 2 + 16 + j * 46} y={y + 26} width="16" height="30" fill={`rgba(255,180,80,${(.25 + .6 * party) * (((j + k) % 3) ? 1 : .3)})`} />)}</g>;
      })}
      <path d="M500 230 L 580 230 L 560 180 L 520 180 Z" fill="#3a2a1e" />
      {/* city wall */}
      <path d={`M0 820 ${Array.from({ length: 28 }, (_, i) => `L ${i * 40} 820 L ${i * 40} 800 L ${i * 40 + 22} 800 L ${i * 40 + 22} 820`).join(' ')} L 1080 820 L 1080 1150 L 0 1150 Z`} fill="#24180f" stroke="#0d0805" strokeWidth="2" />
      {/* palms */}
      {[[90, 820, 1], [990, 820, -1], [250, 830, 1]].map(([x, y, d], i) => (
        <g key={i} transform={`translate(${x} ${y})`}>
          <path d={`M-6 0 C ${-4 + d * 8} -80 ${d * 14} -160 ${d * 18} -210 L ${d * 26} -208 C ${d * 22} -160 ${8 + d * 8} -80 8 0 Z`} fill="#140c08" />
          {[-1.1, -.6, -.1, .4, .9, 1.4, 2.0].map((a, j) => <path key={j} d={`M${d * 22} -210 q ${Math.cos(a) * 70} ${-30 + Math.sin(a) * 20} ${Math.cos(a) * 120} ${30 + Math.abs(Math.sin(a)) * 30}`} fill="none" stroke="#140c08" strokeWidth="10" strokeLinecap="round" transform={`rotate(${Math.sin(t * 1.2 + j) * 2} ${d * 22} -210)`} />)}
        </g>
      ))}
      {/* Ishtar gate */}
      <g>
        <rect x="300" y="700" width="480" height="450" fill="url(#lapis)" stroke="#0c1a3c" strokeWidth="4" />
        {bricks.map((b, i) => <rect key={i} x={300 + b.c * 34.3} y={700 + b.r * 22.5} width="33" height="21" fill={`rgba(${b.v > .5 ? '90,140,240' : '20,50,130'},${.25 + b.v * .25})`} />)}
        {[-1, 1].map((d) => <rect key={d} x={d < 0 ? 250 : 740} y="640" width="90" height="510" fill="url(#lapis)" stroke="#0c1a3c" strokeWidth="4" />)}
        {Array.from({ length: 13 }, (_, i) => <rect key={i} x={250 + i * 45} y="618" width="26" height="24" fill="#1d4296" stroke="#0c1a3c" strokeWidth="2" />)}
        <rect x="250" y="640" width="580" height="10" fill="#c99a3d" />
        {[0, 1].map((r) => [0, 1, 2, 3, 4].map((c) => <Bull key={`${r}${c}`} x={330 + c * 96} y={760 + r * 70} s={1.15} flip={c % 2 === 1} />))}
        <path d="M380 1150 L 380 760 C 380 650 700 650 700 760 L 700 1150 Z" fill="#0b0a12" stroke="#c99a3d" strokeWidth="8" />
        <g clipPath="url(#gateArch)"><rect x="380" y="650" width="320" height="500" fill={`rgba(255,170,70,${.15 + .55 * party})`} /><ellipse cx="540" cy="1150" rx="220" ry="260" fill="url(#torch)" opacity={.4 + .5 * party} /></g>
      </g>
      {torches.map(([x, y], i) => { const f = .8 + .2 * Math.sin(t * 13 + i * 2) * Math.sin(t * 7 + i); return <g key={i}><circle cx={x} cy={y} r={70 * f} fill="url(#torch)" opacity={.5 + .5 * party} /><ellipse cx={x} cy={y} rx={9} ry={16 * f} fill="#fff1c0" /></g>; })}
    </svg>
  );
};

/* ---------- Banquet hall in perspective ---------- */
export const Hall: React.FC<{ t: number; cups: number; dark: number }> = ({ t, cups, dark }) => {
  const rows = [0, 1, 2, 3, 4, 5];
  const vx = 540, vy = 420;
  return (
    <svg width={1080} height={1150} viewBox="0 0 1080 1150" style={{ display: 'block' }}>
      <defs>
        <Blur />
        <linearGradient id="hwall" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#1a0e10" /><stop offset="1" stopColor="#3a2016" /></linearGradient>
        <linearGradient id="col" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#3a2418" /><stop offset=".5" stopColor="#8a6448" /><stop offset="1" stopColor="#2a180e" /></linearGradient>
        <linearGradient id="table" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#5a3a22" /><stop offset="1" stopColor="#2a160a" /></linearGradient>
        <radialGradient id="tglow" cx=".5" cy=".5" r=".5"><stop offset="0" stopColor="#ffd78a" stopOpacity=".9" /><stop offset="1" stopColor="#ff8a2a" stopOpacity="0" /></radialGradient>
        <GoldGrad id="hg" />
      </defs>
      <rect width="1080" height="1150" fill="url(#hwall)" />
      {/* back wall with throne */}
      <rect x="380" y="260" width="320" height="230" fill="#24140f" />
      <rect x="380" y="260" width="320" height="230" fill="#2b5bc4" opacity=".25" />
      <ellipse cx="540" cy="360" rx="260" ry="200" fill="url(#tglow)" opacity={.55 * (1 - dark * .6)} />
      <path d="M500 470 L 500 360 C 500 330 580 330 580 360 L 580 470 Z" fill="url(#hg)" stroke="#5a3a0e" strokeWidth="2" />
      <ellipse cx="540" cy="372" rx="18" ry="22" fill="#2a1810" />
      <path d="M522 352 L 540 326 L 558 352 Z" fill="url(#hg)" />
      <path d="M520 394 C 520 470 560 470 560 394 Z" fill="#7a1420" />
      {/* floor */}
      <path d={`M0 1150 L ${vx - 160} ${vy + 70} L ${vx + 160} ${vy + 70} L 1080 1150 Z`} fill="#1f120c" />
      {Array.from({ length: 9 }, (_, i) => <line key={i} x1={vx - 160 + i * 40} y1={vy + 70} x2={-600 + i * 285} y2="1150" stroke="#000" strokeWidth="2" opacity=".35" />)}
      {/* columns */}
      {[0, 1, 2, 3].map((k) => {
        const s = 1 - k * .2, xL = lerp(60, 380, k / 3.6), xR = 1080 - xL, top = lerp(40, 260, k / 3.6), bot = lerp(1150, 500, k / 3.6), w = 90 * s;
        return <g key={k}>{[xL, xR].map((x, j) => <g key={j}><rect x={x - w / 2} y={top} width={w} height={bot - top} fill="url(#col)" />
          <rect x={x - w * .75} y={top} width={w * 1.5} height={26 * s} fill="#9a7452" />
          <circle cx={x - w * .45} cy={top + 30 * s} r={14 * s} fill="none" stroke="#9a7452" strokeWidth={6 * s} /><circle cx={x + w * .45} cy={top + 30 * s} r={14 * s} fill="none" stroke="#9a7452" strokeWidth={6 * s} />
          {/* torch */}
          <ellipse cx={x + (j ? -w * .7 : w * .7)} cy={top + (bot - top) * .35} rx={80 * s} ry={80 * s} fill="url(#tglow)" opacity={(.6 + .2 * Math.sin(t * 11 + k)) * (1 - dark * .7)} />
          <ellipse cx={x + (j ? -w * .7 : w * .7)} cy={top + (bot - top) * .35} rx={7 * s} ry={(14 + 3 * Math.sin(t * 13 + k)) * s} fill="#fff1c0" opacity={1 - dark * .6} /></g>)}</g>;
      })}
      {/* table */}
      <path d={`M${vx - 120} ${vy + 120} L ${vx + 120} ${vy + 120} L 760 1150 L 320 1150 Z`} fill="url(#table)" stroke="#120806" strokeWidth="3" />
      {Array.from({ length: 10 }, (_, i) => { const p = i / 9, y = lerp(vy + 140, 1100, p * p), s = lerp(.3, 1.1, p); return <g key={i}>
        <ellipse cx={540 + (i % 2 ? -1 : 1) * lerp(40, 120, p)} cy={y} rx={22 * s} ry={9 * s} fill="#c99a3d" opacity=".85" />
        <ellipse cx={540 + (i % 2 ? 1 : -1) * lerp(30, 90, p)} cy={y + 6} rx={14 * s} ry={14 * s} fill="#7a2a1a" /></g>; })}
      {/* lords both sides */}
      {rows.map((r) => [-1, 1].map((d) => {
        const p = (r + 1) / 7, y = lerp(vy + 150, 1080, p * p), s = lerp(.35, 1.25, p), x = 540 + d * lerp(150, 380, p);
        const lift = cups * (1 + Math.sin(t * 2 + r + d) * .1);
        return <g key={`${r}${d}`} transform={`translate(${x} ${y}) scale(${s})`}>
          <path d="M-46 80 C -46 20 -30 0 0 0 C 30 0 46 20 46 80 Z" fill="#1a0e0c" />
          <circle cx="0" cy="-22" r="24" fill="#1a0e0c" />
          <path d="M-20 -42 L 20 -42 L 16 -62 L -16 -62 Z" fill="#1a0e0c" />
          <path d="M-46 80 C -46 20 -30 0 0 0" fill="none" stroke="#ffb860" strokeWidth="2.5" opacity={.5 * (1 - dark)} />
          {cups > 0 && <g transform={`translate(${d * -40} ${20 - 70 * lift})`}><path d="M-10 0 L 10 0 L 6 14 L -6 14 Z" fill="url(#hg)" /><rect x="-1.5" y="14" width="3" height="10" fill="#c99a3d" /><rect x="-7" y="24" width="14" height="3" fill="#c99a3d" /></g>}
        </g>;
      }))}
      <rect width="1080" height="1150" fill="#000" opacity={dark * .55} />
    </svg>
  );
};

/* ---------- Golden temple vessel ---------- */
export const Chalice: React.FC<{ t: number; width: number; id: string; tilt?: number }> = ({ t, width, id, tilt = 0 }) => {
  const sw = ((t * .5) % 1.6) - .3;
  return (
    <svg width={width} height={width * 1.4} viewBox="0 0 300 420" style={{ display: 'block', overflow: 'visible' }}>
      <defs>
        <linearGradient id={`${id}g`} x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#6E4710" /><stop offset=".22" stopColor="#D9A441" /><stop offset=".45" stopColor="#FFF4C8" /><stop offset=".6" stopColor="#F2CF73" /><stop offset=".85" stopColor="#A9741F" /><stop offset="1" stopColor="#5a3a0e" /></linearGradient>
        <linearGradient id={`${id}s`} x1="0" y1="0" x2="1" y2="0" gradientTransform={`translate(${sw} 0)`}><stop offset="0" stopColor="#fff" stopOpacity="0" /><stop offset=".48" stopColor="#fff" stopOpacity="0" /><stop offset=".5" stopColor="#fff" stopOpacity=".7" /><stop offset=".52" stopColor="#fff" stopOpacity="0" /><stop offset="1" stopColor="#fff" stopOpacity="0" /></linearGradient>
        <clipPath id={`${id}c`}><path d="M40 40 C 40 170 110 210 150 210 C 190 210 260 170 260 40 Z" /></clipPath>
      </defs>
      <g transform={`rotate(${tilt} 150 380)`}>
        <ellipse cx="150" cy="392" rx="110" ry="18" fill="#000" opacity=".45" />
        <path d="M70 380 C 70 352 120 344 136 330 L 164 330 C 180 344 230 352 230 380 Z" fill={`url(#${id}g)`} stroke="#5a3a0e" strokeWidth="2" />
        <rect x="138" y="230" width="24" height="104" fill={`url(#${id}g)`} stroke="#5a3a0e" strokeWidth="2" />
        <ellipse cx="150" cy="268" rx="30" ry="18" fill={`url(#${id}g)`} stroke="#5a3a0e" strokeWidth="2" />
        <path d="M40 40 C 40 170 110 210 150 210 C 190 210 260 170 260 40 Z" fill={`url(#${id}g)`} stroke="#5a3a0e" strokeWidth="3" />
        <ellipse cx="150" cy="40" rx="110" ry="20" fill="#6a1420" stroke="#5a3a0e" strokeWidth="3" />
        <ellipse cx="150" cy="40" rx="110" ry="20" fill="none" stroke="#FFF4C8" strokeWidth="3" opacity=".8" />
        <path d="M60 100 C 100 120 200 120 240 100" fill="none" stroke="#7A4F14" strokeWidth="5" />
        {Array.from({ length: 9 }, (_, i) => <circle key={i} cx={75 + i * 18.7} cy={108 + Math.sin(i / 8 * Math.PI) * 8} r="5" fill="#FFF1C0" stroke="#7A4F14" strokeWidth="1.5" />)}
        <path d="M80 140 L 150 180 L 220 140" fill="none" stroke="#7A4F14" strokeWidth="3" opacity=".6" />
        <rect x="0" y="0" width="300" height="420" fill={`url(#${id}s)`} clipPath={`url(#${id}c)`} />
      </g>
    </svg>
  );
};

/* ---------- Idol statuette ---------- */
export const Idol: React.FC<{ width: number; mat: [string, string, string]; grain?: boolean; id: string }> = ({ width, mat, grain, id }) => (
  <svg width={width} height={width * 2.2} viewBox="0 0 100 220" style={{ display: 'block', overflow: 'visible' }}>
    <defs><linearGradient id={id} x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor={mat[2]} /><stop offset=".4" stopColor={mat[0]} /><stop offset=".65" stopColor={mat[1]} /><stop offset="1" stopColor={mat[2]} /></linearGradient></defs>
    <ellipse cx="50" cy="214" rx="40" ry="6" fill="#000" opacity=".5" />
    <rect x="18" y="194" width="64" height="18" rx="3" fill={`url(#${id})`} stroke="#000" strokeOpacity=".4" />
    <path d="M30 194 L 26 90 C 26 74 74 74 74 90 L 70 194 Z" fill={`url(#${id})`} stroke="#000" strokeOpacity=".4" />
    <path d="M26 100 L 12 140 L 22 144 L 32 112" fill={`url(#${id})`} /><path d="M74 100 L 88 140 L 78 144 L 68 112" fill={`url(#${id})`} />
    <circle cx="50" cy="58" r="17" fill={`url(#${id})`} stroke="#000" strokeOpacity=".4" />
    <path d="M32 46 L 34 18 L 44 34 L 50 10 L 56 34 L 66 18 L 68 46 Z" fill={`url(#${id})`} stroke="#000" strokeOpacity=".4" />
    <path d="M40 70 C 42 86 58 86 60 70" fill={mat[2]} opacity=".6" />
    {grain && [0, 1, 2, 3, 4].map((k) => <path key={k} d={`M${32 + k * 8} 92 C ${30 + k * 8} 130 ${34 + k * 8} 160 ${31 + k * 8} 192`} stroke="#3a2010" strokeWidth="1.2" fill="none" opacity=".6" />)}
  </svg>
);

/* ---------- Plaster wall + ghostly writing hand ---------- */
export const Wall: React.FC<{ t: number; lamp?: number }> = ({ t, lamp = 1 }) => (
  <svg width={1080} height={1150} viewBox="0 0 1080 1150" style={{ display: 'block' }}>
    <defs>
      <filter id="plaster"><feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="3" seed="4" /><feColorMatrix values="0 0 0 0 .45  0 0 0 0 .38  0 0 0 0 .3  0 0 0 .55 0" /></filter>
      <filter id="cracks"><feTurbulence type="turbulence" baseFrequency=".012" numOctaves="2" seed="9" /><feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -3 1.1" /></filter>
      <radialGradient id="lampL" cx=".18" cy=".62" r=".75"><stop offset="0" stopColor="#f2d9a8" /><stop offset=".45" stopColor="#8a6a4a" /><stop offset="1" stopColor="#1a100a" /></radialGradient>
      <radialGradient id="flame" cx=".5" cy=".5" r=".5"><stop offset="0" stopColor="#fff2c0" /><stop offset=".35" stopColor="#ffae4a" stopOpacity=".8" /><stop offset="1" stopColor="#ff7a20" stopOpacity="0" /></radialGradient>
    </defs>
    <rect width="1080" height="1150" fill="url(#lampL)" opacity={lamp} />
    <rect width="1080" height="1150" filter="url(#plaster)" opacity=".9" />
    <rect width="1080" height="1150" filter="url(#cracks)" opacity=".18" />
    {/* lampstand */}
    <g transform="translate(150 760)">
      <ellipse cx="0" cy="-30" rx={110 + 8 * Math.sin(t * 9)} ry={110 + 8 * Math.sin(t * 9)} fill="url(#flame)" opacity=".75" />
      <ellipse cx="0" cy="-30" rx="8" ry={18 + 3 * Math.sin(t * 14)} fill="#fff6d8" />
      <path d="M-26 -10 L 26 -10 L 14 6 L -14 6 Z" fill="#c99a3d" />
      <rect x="-5" y="6" width="10" height="320" fill="#a77a2e" />
      <path d="M-50 330 L 50 330 L 30 300 L -30 300 Z" fill="#a77a2e" />
    </g>
    <rect y="1000" width="1080" height="150" fill="#000" opacity=".45" />
  </svg>
);
export const Hand: React.FC<{ t: number; width: number }> = ({ t, width }) => {
  const wig = Math.sin(t * 9) * 2;
  return (
    <svg width={width} height={width * 1.25} viewBox="0 0 400 500" style={{ display: 'block', overflow: 'visible' }}>
      <defs>
        <linearGradient id="skinH" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#f7efe2" /><stop offset=".6" stopColor="#d9c8b0" /><stop offset="1" stopColor="#9e8c78" /></linearGradient>
        <linearGradient id="fadeH" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#fff" /><stop offset=".55" stopColor="#fff" /><stop offset="1" stopColor="#000" /></linearGradient>
        <mask id="wristFade"><rect width="400" height="500" fill="url(#fadeH)" /></mask>
        <filter id="ghost" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="18" /></filter>
      </defs>
      <g mask="url(#wristFade)">
        <path d="M120 470 C 110 400 108 340 120 300 C 128 270 150 250 170 240 L 182 120 C 184 100 210 100 212 120 L 214 238 L 232 236 L 236 150 C 238 132 262 132 262 150 L 262 246 L 280 250 L 286 180 C 288 164 310 164 310 182 L 306 270 C 322 266 334 276 332 296 C 328 340 300 380 290 470 Z" fill="#cfe6ff" opacity=".45" filter="url(#ghost)" />
        <g transform={`rotate(${wig} 200 300)`}>
          {/* palm + back of hand */}
          <path d="M120 470 C 110 400 108 340 120 300 C 128 270 150 250 170 240 L 300 262 C 322 266 334 276 332 296 C 328 340 300 380 290 470 Z" fill="url(#skinH)" stroke="#6e5c4a" strokeWidth="3" />
          {/* index finger extended (writing) */}
          <path d="M170 244 L 182 120 C 184 98 212 98 212 120 L 214 244 Z" fill="url(#skinH)" stroke="#6e5c4a" strokeWidth="3" />
          <path d="M184 132 C 190 124 204 124 208 132" fill="none" stroke="#8a7864" strokeWidth="2" />
          <path d="M186 112 C 190 104 204 104 208 112 L 206 122 C 200 118 192 118 188 122 Z" fill="#f9f2e8" stroke="#8a7864" strokeWidth="1.5" />
          {/* curled fingers */}
          {[[236, 210], [262, 222], [290, 238]].map(([x, y], i) => <path key={i} d={`M${x - 14} 260 C ${x - 16} ${y} ${x + 18} ${y - 6} ${x + 18} ${y + 22} C ${x + 18} ${y + 40} ${x + 8} 268 ${x + 4} 274`} fill="url(#skinH)" stroke="#6e5c4a" strokeWidth="3" />)}
          {/* thumb */}
          <path d="M150 300 C 120 280 118 240 138 226 C 156 216 172 236 176 262 Z" fill="url(#skinH)" stroke="#6e5c4a" strokeWidth="3" />
          {[0, 1, 2].map((k) => <path key={k} d={`M${186 + k * 2} ${170 + k * 22} c 8 -3 14 -3 20 0`} stroke="#8a7864" strokeWidth="1.8" fill="none" />)}
          <path d="M160 330 C 200 350 250 350 300 330" stroke="#8a7864" strokeWidth="2" fill="none" opacity=".6" />
        </g>
      </g>
      {/* glowing fingertip */}
      <circle cx={196} cy={102} r={18 + 4 * Math.sin(t * 12)} fill="#ffe0a0" opacity=".85" filter="url(#ghost)" />
    </svg>
  );
};

/* ---------- King bust (Belshazzar) ---------- */
export const KingBust: React.FC<{ t: number; width: number; pale: number; fear: number }> = ({ t, width, pale, fear }) => {
  const skin1 = `rgb(${lerp(122, 168, pale)},${lerp(80, 150, pale)},${lerp(54, 140, pale)})`;
  const skin2 = `rgb(${lerp(58, 92, pale)},${lerp(34, 86, pale)},${lerp(22, 84, pale)})`;
  return (
    <svg width={width} height={width * 1.25} viewBox="0 0 480 600" style={{ display: 'block', overflow: 'visible' }}>
      <defs>
        <linearGradient id="kskin" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor={skin2} /><stop offset=".55" stopColor={skin1} /><stop offset="1" stopColor={skin2} /></linearGradient>
        <linearGradient id="krobe" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#3a0812" /><stop offset=".5" stopColor="#8e1d2e" /><stop offset="1" stopColor="#2a050c" /></linearGradient>
        <GoldGrad id="kgold" />
      </defs>
      <path d="M40 600 C 40 470 120 420 240 420 C 360 420 440 470 440 600 Z" fill="url(#krobe)" stroke="#12030a" strokeWidth="3" />
      {Array.from({ length: 9 }, (_, i) => <circle key={i} cx={130 + i * 27.5} cy={470 + Math.sin(i / 8 * Math.PI) * -18} r="9" fill="url(#kgold)" />)}
      <rect x="200" y="330" width="80" height="100" fill="url(#kskin)" />
      <ellipse cx="240" cy="250" rx="98" ry="118" fill="url(#kskin)" stroke="#1a0c06" strokeWidth="3" />
      {/* eyes */}
      {[-1, 1].map((d) => <g key={d}>
        <ellipse cx={240 + d * 38} cy="236" rx={16 + 6 * fear} ry={8 + 9 * fear} fill="#f4ece0" />
        <circle cx={240 + d * 38 + Math.sin(t * 7) * 2 * fear} cy="236" r={6 - 2 * fear} fill="#140a04" />
        <path d={`M${240 + d * 18} ${210 - 10 * fear} L ${240 + d * 60} ${206 - (d * 6 * fear) - 4}`} stroke="#140a04" strokeWidth="7" strokeLinecap="round" />
      </g>)}
      <path d="M236 250 L 228 300 L 252 300" fill="none" stroke="#3a1e10" strokeWidth="3" />
      {/* beard with curls */}
      <path d="M150 280 C 150 400 200 470 240 470 C 280 470 330 400 330 280 C 300 330 180 330 150 280 Z" fill="#140c08" />
      {Array.from({ length: 5 }, (_, r) => Array.from({ length: 6 - (r % 2) }, (_, c) => <circle key={`${r}${c}`} cx={170 + c * 28 + (r % 2) * 14} cy={330 + r * 26} r="10" fill="none" stroke="#3a2a20" strokeWidth="3" />))}
      <ellipse cx="240" cy={322 + 10 * fear} rx={22 + 6 * fear} ry={6 + 12 * fear} fill="#2a0a06" />
      {/* tall Babylonian crown */}
      <path d="M150 170 L 160 40 C 200 20 280 20 320 40 L 330 170 C 280 150 200 150 150 170 Z" fill="url(#kgold)" stroke="#5a3a0e" strokeWidth="3" />
      {[0, 1, 2, 3].map((k) => <path key={k} d={`M${158 + k * 2} ${150 - k * 34} C 200 ${136 - k * 34} 280 ${136 - k * 34} ${322 - k * 2} ${150 - k * 34}`} fill="none" stroke="#7A4F14" strokeWidth="3" />)}
      {[200, 240, 280].map((x) => <circle key={x} cx={x} cy="100" r="9" fill={x === 240 ? '#2b5bc4' : '#b3261e'} stroke="#5a3a0e" strokeWidth="2" />)}
      {/* sweat */}
      {fear > .3 && [[150, 200], [326, 214]].map(([x, y], i) => <path key={i} d={`M${x} ${y + ((t * 60 + i * 40) % 80)} q 6 12 0 18 q -6 -6 0 -18`} fill="#cfe6ff" opacity=".8" />)}
    </svg>
  );
};

/* ---------- Old man / wise man ---------- */
export const Sage: React.FC<{ t: number; width: number; robe: [string, string]; hat?: boolean; old?: boolean; id: string }> = ({ t, width, robe, hat, old, id }) => (
  <svg width={width} height={width * 2.1} viewBox="0 0 300 630" style={{ display: 'block', overflow: 'visible' }}>
    <defs>
      <linearGradient id={`${id}r`} x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor={robe[1]} /><stop offset=".5" stopColor={robe[0]} /><stop offset="1" stopColor={robe[1]} /></linearGradient>
      <linearGradient id={`${id}s`} x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#4a2a18" /><stop offset=".5" stopColor="#8a5a3c" /><stop offset="1" stopColor="#3a2014" /></linearGradient>
    </defs>
    <ellipse cx="150" cy="622" rx="120" ry="12" fill="#000" opacity=".5" />
    <path d="M90 200 C 60 330 46 480 40 620 L 260 620 C 254 480 240 330 210 200 C 190 180 110 180 90 200 Z" fill={`url(#${id}r)`} stroke="#0c0604" strokeWidth="3" />
    {[0, 1, 2, 3].map((k) => <path key={k} d={`M${110 + k * 26} 210 C ${100 + k * 28} 380 ${90 + k * 34} 500 ${74 + k * 44} 620`} stroke="#000" strokeWidth="3" opacity=".25" fill="none" />)}
    {old && <path d="M230 260 L 262 620" stroke="#6b4a2a" strokeWidth="10" strokeLinecap="round" />}
    <ellipse cx="150" cy="130" rx="44" ry="52" fill={`url(#${id}s)`} stroke="#140a06" strokeWidth="2" />
    {old ? <>
      <path d="M104 120 C 100 60 200 60 196 120 C 186 92 114 92 104 120 Z" fill="#e8e2d6" />
      <path d="M108 140 C 108 240 150 270 150 270 C 150 270 192 240 192 140 C 180 172 120 172 108 140 Z" fill="#ece6da" />
      <path d="M128 120 h 12 M 160 120 h 12" stroke="#140a06" strokeWidth="4" strokeLinecap="round" />
    </> : <>
      <path d="M110 150 C 112 210 188 210 190 150 C 176 172 124 172 110 150 Z" fill="#140c08" />
      <path d="M128 122 h 12 M 160 122 h 12" stroke="#140a06" strokeWidth="4" strokeLinecap="round" />
    </>}
    {hat && <path d="M104 96 L 118 20 L 182 20 L 196 96 C 170 86 130 86 104 96 Z" fill="#2a1a3a" stroke="#0c0604" strokeWidth="2" />}
    <path d="M210 200 C 230 300 246 450 260 620" stroke="#ffd28a" strokeWidth="3" opacity=".45" fill="none" />
  </svg>
);

/* ---------- Hourglass / Scales / split crown ---------- */
export const Hourglass: React.FC<{ p: number; width: number }> = ({ p, width }) => (
  <svg width={width} height={width * 1.5} viewBox="0 0 200 300" style={{ display: 'block' }}>
    <GoldGrad id="hgG" />
    <rect x="20" y="10" width="160" height="16" rx="4" fill="url(#hgG)" /><rect x="20" y="274" width="160" height="16" rx="4" fill="url(#hgG)" />
    <rect x="28" y="26" width="8" height="248" fill="url(#hgG)" /><rect x="164" y="26" width="8" height="248" fill="url(#hgG)" />
    <path d="M50 30 L 150 30 C 150 90 112 130 104 150 C 112 170 150 210 150 270 L 50 270 C 50 210 88 170 96 150 C 88 130 50 90 50 30 Z" fill="rgba(200,230,255,.12)" stroke="#e8f0ff" strokeWidth="3" />
    <path d={`M${56 + 40 * p} ${30 + 100 * p} L ${144 - 40 * p} ${30 + 100 * p} C 130 118 108 140 100 148 C 92 140 70 118 ${56 + 40 * p} ${30 + 100 * p} Z`} fill="#e8c27a" opacity={p < .98 ? 1 : 0} />
    {p > .02 && p < .98 && <rect x="98.5" y="148" width="3" height={120 - 60 * p} fill="#e8c27a" />}
    <path d={`M52 268 L 148 268 C 140 ${268 - 70 * p} 110 ${268 - 90 * p} 100 ${268 - 92 * p} C 90 ${268 - 90 * p} 60 ${268 - 70 * p} 52 268 Z`} fill="#e8c27a" />
  </svg>
);
export const Scales: React.FC<{ tilt: number; width: number }> = ({ tilt, width }) => {
  const a = tilt * 14 * Math.PI / 180, L = 220;
  const lx = 300 - Math.cos(a) * L, ly = 120 - Math.sin(a) * L, rx = 300 + Math.cos(a) * L, ry = 120 + Math.sin(a) * L;
  return (
    <svg width={width} height={width * .9} viewBox="0 0 600 540" style={{ display: 'block', overflow: 'visible' }}>
      <GoldGrad id="scG" />
      <rect x="292" y="110" width="16" height="380" fill="url(#scG)" /><path d="M200 520 L 400 520 L 360 486 L 240 486 Z" fill="url(#scG)" />
      <line x1={lx} y1={ly} x2={rx} y2={ry} stroke="url(#scG)" strokeWidth="14" strokeLinecap="round" />
      <circle cx="300" cy="120" r="16" fill="url(#scG)" />
      {[[lx, ly, 'crown'], [rx, ry, 'w']].map(([x, y, k]) => <g key={k as string} transform={`translate(${x} ${y})`}>
        <line x1="0" y1="0" x2="-60" y2="150" stroke="#c99a3d" strokeWidth="3" /><line x1="0" y1="0" x2="60" y2="150" stroke="#c99a3d" strokeWidth="3" />
        <path d="M-80 150 L 80 150 C 70 180 -70 180 -80 150 Z" fill="url(#scG)" />
        {k === 'crown' ? <path d="M-40 150 L -40 112 L -20 130 L 0 100 L 20 130 L 40 112 L 40 150 Z" fill="url(#scG)" stroke="#5a3a0e" strokeWidth="2" />
          : <path d="M-46 150 L -34 92 L 34 92 L 46 150 Z" fill="#3a3a44" stroke="#111" strokeWidth="2" />}
      </g>)}
    </svg>
  );
};
export const CrownSplit: React.FC<{ p: number; width: number }> = ({ p, width }) => (
  <svg width={width} height={width * .6} viewBox="0 0 600 360" style={{ display: 'block', overflow: 'visible' }}>
    <GoldGrad id="csG" />
    {[-1, 1].map((d) => <g key={d} transform={`translate(${d * 120 * p} ${p * 20}) rotate(${d * 10 * p} 300 200)`}>
      <clipPath id={`half${d}`}><path d={d < 0 ? 'M0 0 L 296 0 L 310 120 L 290 200 L 304 360 L 0 360 Z' : 'M296 0 L 600 0 L 600 360 L 304 360 L 290 200 L 310 120 Z'} /></clipPath>
      <g clipPath={`url(#half${d})`}>
        <path d="M110 300 L 110 120 L 190 190 L 300 60 L 410 190 L 490 120 L 490 300 Z" fill="url(#csG)" stroke="#5a3a0e" strokeWidth="5" />
        <rect x="100" y="280" width="400" height="50" rx="8" fill="url(#csG)" stroke="#5a3a0e" strokeWidth="4" />
        {[160, 240, 300, 360, 440].map((x, i) => <circle key={x} cx={x} cy="305" r="12" fill={i % 2 ? '#2b5bc4' : '#b3261e'} />)}
        <circle cx="300" cy="60" r="16" fill="#fff4c8" />
      </g>
    </g>)}
  </svg>
);

/* ---------- Babylon from above with the Euphrates ---------- */
export const CityMap: React.FC<{ t: number; drain: number; march: number }> = ({ t, drain, march }) => {
  const R = rnd(12);
  const blocks = Array.from({ length: 70 }, () => ({ x: 170 + R() * 740, y: 170 + R() * 740, w: 24 + R() * 40, h: 24 + R() * 40 }));
  const riverX = (y: number) => 540 + Math.sin(y / 160) * 60;
  const pts = Array.from({ length: 23 }, (_, i) => i * 50);
  const river = `M${pts.map((y) => `${riverX(y) - 46} ${y}`).join(' L ')} L ${pts.slice().reverse().map((y) => `${riverX(y) + 46} ${y}`).join(' L ')} Z`;
  return (
    <svg width={1080} height={1100} viewBox="0 0 1080 1100" style={{ display: 'block' }}>
      <defs><GoldGrad id="cmG" /></defs>
      <rect width="1080" height="1100" fill="#2a2016" />
      <path d={river} fill={`rgb(${lerp(40, 92, drain)},${lerp(80, 70, drain)},${lerp(140, 48, drain)})`} />
      {drain < 1 && <path d={river} fill="none" stroke="#7aa8e8" strokeWidth="3" opacity={(1 - drain) * .6} strokeDasharray="30 40" strokeDashoffset={-t * 60} />}
      {blocks.filter((b) => Math.abs(b.x + b.w / 2 - riverX(b.y)) > 80).map((b, i) => <rect key={i} x={b.x} y={b.y} width={b.w} height={b.h} fill="#5a4632" stroke="#1a120a" strokeWidth="2" />)}
      <rect x="150" y="150" width="780" height="780" fill="none" stroke="#c99a3d" strokeWidth="18" />
      {Array.from({ length: 16 }, (_, i) => <rect key={i} x={150 + i * 50} y="138" width="20" height="24" fill="#c99a3d" />)}
      {/* feast glow */}
      <circle cx="700" cy="560" r={70 + 6 * Math.sin(t * 6)} fill="#ffb860" opacity=".35" />
      <rect x="670" y="530" width="60" height="60" fill="#c99a3d" />
      {/* soldiers in the riverbed */}
      {Array.from({ length: 40 }, (_, i) => {
        const p = march * 1.4 - i * .03; if (p <= 0) return null;
        const y = -40 + p * 760; const x = riverX(y) + ((i % 3) - 1) * 22;
        return <g key={i}><circle cx={x} cy={y} r="9" fill="#b3261e" stroke="#2a0606" strokeWidth="2" /><line x1={x} y1={y - 16} x2={x} y2={y + 4} stroke="#ddd" strokeWidth="2" /></g>;
      })}
    </svg>
  );
};
