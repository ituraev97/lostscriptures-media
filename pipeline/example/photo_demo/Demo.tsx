import React from 'react';
import { AbsoluteFill, useCurrentFrame, staticFile } from 'remotion';
import { loadFont } from '@remotion/fonts';
import { FPS, P, env, eout, lerp, CIN, CORI, SL, SR } from './lib';
import { Shot, Clip, PhotoShade, Credit, Pin, Pic } from './Photo';
import { Logo } from './Wall';
loadFont({ family: 'Cin', url: staticFile('cinzel-latin-700-normal.woff2'), weight: '700' });
loadFont({ family: 'CorI', url: staticFile('cormorant-garamond-latin-600-italic.woff2'), weight: '600', style: 'normal' });
const DORE: Pic = { src: 'dore_absalom.jpg', w: 2091, h: 2600, bg: 'dore_absalom_bg.jpg', credit: 'Gustave Doré, The Death of Absalom (1866) · public domain' };
const TIS: Pic = { src: 'tissot_absalom.jpg', w: 2134, h: 2600, bg: 'tissot_absalom_bg.jpg', credit: 'James Tissot, Absalom Hanging on the Oak (c. 1900) · public domain' };
const gold: React.CSSProperties = { background: 'linear-gradient(180deg,#FFF4C8 0%,#F2CF73 40%,#C99130 75%,#8A5E20 100%)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent', filter: 'drop-shadow(0 5px 6px rgba(0,0,0,.8))' };
export const DEMO_END = 10;
export const Demo: React.FC = () => {
  const t = useCurrentFrame() / FPS;
  return <AbsoluteFill style={{ background: '#040409', overflow: 'hidden' }}>
    <Shot t={t} t0={0} t1={3.6} pic={DORE} from={[.45, .3, 1]} to={[.42, .2, 1.3]} />
    <Shot t={t} t0={3.3} t1={6.9} pic={TIS} mode="fit" from={[.5, .5, 1]} to={[.47, .32, 1.45]} />
    <Clip t={t} t0={6.6} t1={10} clip="kok_crowd.mp4" vw={1080} vh={814} fx={.5} />
    <PhotoShade />
    <Credit s={t < 3.45 ? DORE.credit : t < 6.75 ? TIS.credit : 'The King of Kings (1927), public domain'} a={1} />
    <Pin x={470} y={760} s="ABSALOM" a={env(t, 4.3, 6.7, .3, .3)} />
    <div style={{ position: 'absolute', left: SL, top: 1040, width: SR - SL, textAlign: 'center', opacity: env(t, .4, 3.4, .3, .3), scale: String(lerp(1.3, 1, eout(P(t, .4, .7)))) }}>
      <div style={{ ...gold, fontFamily: CIN, fontWeight: 700, fontSize: 104, lineHeight: 1.05 }}>KILLED BY<br />HIS OWN HAIR</div></div>
    <div style={{ position: 'absolute', left: SL, top: 211, width: 68, height: 68, borderRadius: '50%' }}><Logo size={68} /></div>
    <div style={{ position: 'absolute', left: SL + 80, top: 209, fontFamily: CIN, fontWeight: 700, fontSize: 29, color: '#F3E7CF' }}>The Lost Scriptures</div>
    <div style={{ position: 'absolute', left: SL + 80, top: 249, fontFamily: CORI, fontWeight: 600, fontSize: 27, color: 'rgba(243,231,207,.6)' }}>absalom · 2 Samuel 18</div>
    <div style={{ position: 'absolute', left: SL - 20, top: 350, width: SR - SL + 40, textAlign: 'center', fontFamily: 'Inter, sans-serif', fontWeight: 800, fontSize: 52, color: '#FFF8EA', textShadow: '0 3px 16px rgba(0,0,0,.95)' }}>{t < 3.4 ? 'His hair caught in an oak.' : t < 6.7 ? 'He hung between heaven and earth.' : 'And all Israel fled.'}</div>
  </AbsoluteFill>;
};
