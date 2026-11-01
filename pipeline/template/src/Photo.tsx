/* Public-domain picture + film shots for the reels (1080x1920).
   Images are prepared by visuals/pd.py prep (graded JPG + blurred backdrop) and copied into public/.
   Everything is a pure function of t. Zooms interpolate in log space. */
import React from 'react';
import { Img, OffthreadVideo, Sequence, staticFile } from 'remotion';
import { W, H, FPS, P, eio, env, lerp, CIN, CORI } from './lib';

export type Cam = [number, number, number]; // focus x (0..1 of image), focus y (0..1), zoom (1 = image covers the frame)
export type Pic = { src: string; w: number; h: number; bg?: string; credit?: string };

const logLerp = (a: number, b: number, k: number) => a * Math.pow(b / a, k);

/** Full-bleed still with a slow camera move from `from` to `to` (focus point + zoom).
 *  mode 'cover' fills the frame (crops a landscape plate to a vertical slice — pan across it);
 *  mode 'fit' shows the whole picture across the width over its blurred backdrop (pic.bg), for compositions that must be seen whole. */
export const Shot: React.FC<{ t: number; t0: number; t1: number; pic: Pic; from: Cam; to?: Cam; mode?: 'cover' | 'fit'; fi?: number; fo?: number; y?: number; ease?: boolean }> =
  ({ t, t0, t1, pic, from, to = from, mode = 'cover', fi = .35, fo = .35, y = H / 2, ease = true }) => {
    if (t < t0 - .05 || t > t1 + .05) return null;
    const a = env(t, t0, t1, fi, fo);
    const k0 = P(t, t0, t1), k = ease ? eio(k0) * .35 + k0 * .65 : k0;
    const fx = lerp(from[0], to[0], k), fy = lerp(from[1], to[1], k), z = logLerp(from[2], to[2], k);
    const base = mode === 'cover' ? Math.max(W / pic.w, H / pic.h) : W / pic.w;
    const s = base * z, iw = pic.w * s, ih = pic.h * s;
    // place the focus point at the frame centre (x) / y, clamped so the picture never leaves an empty edge in cover mode
    let left = W / 2 - fx * iw, top = y - fy * ih;
    if (mode === 'cover') { left = Math.min(0, Math.max(W - iw, left)); top = Math.min(0, Math.max(H - ih, top)); }
    return <div style={{ position: 'absolute', inset: 0, opacity: a, overflow: 'hidden' }}>
      {mode === 'fit' && pic.bg && <Img src={staticFile(pic.bg)} style={{ position: 'absolute', left: 0, top: 0, width: W, height: H, objectFit: 'cover' }} />}
      <Img src={staticFile(pic.src)} style={{ position: 'absolute', left, top, width: iw, height: ih }} />
    </div>;
  };

/** Public-domain film clip (pre-1930, audio removed). `clip` is an mp4 in public/, `at` = second in the clip to start from.
 *  The clip is scaled to cover the vertical frame around focus x `fx` (0..1), with an optional slow push-in. */
export const Clip: React.FC<{ t: number; t0: number; t1: number; clip: string; at?: number; vw: number; vh: number; fx?: number; z0?: number; z1?: number; fi?: number; fo?: number; mode?: 'band' | 'cover'; y?: number }> =
  ({ t, t0, t1, clip, at = 0, vw, vh, fx = .5, z0 = 1, z1 = 1.06, fi = .25, fo = .25, mode = 'band', y = 900 }) => {
    if (t < t0 - .05 || t > t1 + .05) return null;
    const a = env(t, t0, t1, fi, fo);
    const z = logLerp(z0, z1, P(t, t0, t1));
    const st = Math.round(at * FPS);
    if (mode === 'band') {  // sharp: the film across the full width (old 4:3/16:9 footage is too small to blow up to 9:16), over a dark enlarged copy
      const s = (W / vw) * z, iw = vw * s, ih = vh * s, bs = Math.max(W / vw, H / vh) * 1.15;
      return <Sequence from={Math.round(t0 * FPS)} durationInFrames={Math.max(1, Math.round((t1 - t0) * FPS))} layout="none">
        <div style={{ position: 'absolute', inset: 0, opacity: a, overflow: 'hidden', background: '#040409' }}>
          <OffthreadVideo src={staticFile(clip)} startFrom={st} muted style={{ position: 'absolute', left: (W - vw * bs) / 2, top: (H - vh * bs) / 2, width: vw * bs, height: vh * bs, opacity: .28 }} />
          <OffthreadVideo src={staticFile(clip)} startFrom={st} muted style={{ position: 'absolute', left: (W - iw) / 2, top: y - ih / 2, width: iw, height: ih, boxShadow: '0 0 80px rgba(0,0,0,.9)' }} />
        </div>
      </Sequence>;
    }
    const s = Math.max(W / vw, H / vh) * z, iw = vw * s, ih = vh * s;  // 'cover': only for sharp, high-resolution sources
    const left = Math.min(0, Math.max(W - iw, W / 2 - fx * iw)), top = (H - ih) / 2;
    return <Sequence from={Math.round(t0 * FPS)} durationInFrames={Math.max(1, Math.round((t1 - t0) * FPS))} layout="none">
      <div style={{ position: 'absolute', inset: 0, opacity: a, overflow: 'hidden' }}>
        <OffthreadVideo src={staticFile(clip)} startFrom={st} muted style={{ position: 'absolute', left, top, width: iw, height: ih }} />
      </div>
    </Sequence>;
  };

/** Legibility layer over photos: dark top (HUD + captions), soft vignette, dark bottom (TikTok description zone). */
export const PhotoShade: React.FC<{ strength?: number }> = ({ strength = 1 }) => <>
  <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(180deg, rgba(4,4,10,${.92 * strength}) 0%, rgba(4,4,10,${.55 * strength}) 24%, rgba(4,4,10,0) 38%, rgba(4,4,10,0) 66%, rgba(4,4,10,${.75 * strength}) 84%, rgba(4,4,10,${.95 * strength}) 100%)` }} />
  <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(ellipse at 50% 52%, rgba(0,0,0,0) 50%, rgba(0,0,0,${.55 * strength}) 100%)` }} />
</>;

/** Small credit line for the current picture (bottom-left inside the safe zone, above the TikTok description area). */
export const Credit: React.FC<{ s?: string; a: number }> = ({ s, a }) => !s || a <= 0 ? null :
  <div style={{ position: 'absolute', left: 70, top: 1392, width: 860, opacity: a * .75, fontFamily: CORI, fontWeight: 600, fontSize: 24, color: '#E9DCC0', textShadow: '0 2px 8px rgba(0,0,0,.95)' }}>{s}</div>;

/** Gold "label pin" pointing at a detail of the picture (screen coordinates). */
export const Pin: React.FC<{ x: number; y: number; s: string; a: number; side?: 'l' | 'r' }> = ({ x, y, s, a, side = 'r' }) => a <= 0 ? null : <>
  <div style={{ position: 'absolute', left: x - 9, top: y - 9, width: 18, height: 18, borderRadius: 9, background: '#F3D48C', boxShadow: '0 0 0 4px rgba(4,4,10,.7), 0 0 24px rgba(243,212,140,.9)', opacity: a, scale: String(.6 + .4 * a) }} />
  <div style={{ position: 'absolute', left: side === 'r' ? x + 26 : undefined, right: side === 'l' ? W - x + 26 : undefined, top: y - 26, opacity: a, padding: '8px 20px', borderRadius: 30, background: 'rgba(8,6,12,.88)', border: '2px solid #D9A441', fontFamily: CIN, fontWeight: 700, fontSize: 26, letterSpacing: 2, color: '#F3D48C', whiteSpace: 'nowrap' }}>{s}</div>
</>;
