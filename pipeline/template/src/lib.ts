export const W = 1080, H = 1920, FPS = 30, END = 92.4;
export const CX = 500, SL = 70, SR = 930, ST = 470, SB = 1410, CY = (ST + SB) / 2;
export const G = '#D9A441', GL = '#F3D48C', CR = '#F3E7CF', RED = '#d8564a', LAPIS = '#2b5bc4', FIRE = '#ff9a3c';
export const CIN = 'Cin, serif', CORI = 'CorI, serif', HEB = 'Heb, serif', SANS = 'Inter, sans-serif', MONO = '"DejaVu Sans Mono", monospace';
export const clamp = (x: number, a = 0, b = 1) => Math.max(a, Math.min(b, x));
export const P = (t: number, a: number, b: number) => clamp((t - a) / (b - a));
export const eio = (x: number) => (x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
export const eout = (x: number) => 1 - Math.pow(1 - x, 3);
export const eback = (x: number) => { const c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2); };
export const lerp = (a: number, b: number, x: number) => a + (b - a) * x;
export const env = (t: number, a: number, b: number, fi = .4, fo = .4) => Math.min(eout(P(t, a, a + fi)), 1 - eio(P(t, b - fo, b)));
export function rnd(seed: number) { let s = seed; return () => { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; }; }
// damped spring 0->1 (overshoot)
export const spring = (x: number, k = 9, d = 5) => x <= 0 ? 0 : 1 - Math.exp(-d * x) * Math.cos(k * x);
export const shake = (t: number, t0: number, amp = 14, decay = 7) => t < t0 ? [0, 0] : [Math.sin((t - t0) * 91) * amp * Math.exp(-(t - t0) * decay), Math.cos((t - t0) * 73) * amp * Math.exp(-(t - t0) * decay)];

export const CH: [number, string][] = [[0, 'the feast'], [25.8, 'the hand'], [43.0, 'the prophet'], [55.0, 'the verdict'], [67.2, 'the fall'], [86.4, 'the end']];
export const T = {
  babylon: .21, y539: .73, richest: 2.59, party: 5.72, king: 6.67, bel: 6.9, thousand: 8.21, wine: 9.83, something: 11.66, golden: 14.65, stolen: 15.88, temple: 16.64, jeru: 17.85, drink: 18.99,
  idols: 20.67, gold: 21.18, silver: 21.69, bronze: 22.66, iron: 23.37, wood: 24.26, stone: 24.76, hour: 25.88, music: 27.3, stops: 27.69,
  hand: 29.24, noarm: 30.54, nobody: 31.23, fingers: 32.51, writing: 34.35, wall: 35.34, pale: 37.11, knees: 37.93, screams: 39.4, notone: 41.07,
  bring: 43.23, daniel: 45.34, looks: 46.51, four: 48.32, w1: 49.95, w2: 51.13, w3: 52.28, w4: 53.36,
  mene: 55.22, numbered: 56.45, end: 58.01, tekel: 58.83, weighed: 59.7, wanting: 61.31, peres: 62.18, divided: 63.62, medes: 65.25, persians: 65.86,
  night: 67.36, killed: 69.49, chilling: 70.94, herodotus: 73.65, feasting: 76.1, army: 77.08, riverbed: 79.41, fight: 81.63, partyNever: 82.94, kingdom: 84.81, did: 85.28, follow: 86.65,
};
