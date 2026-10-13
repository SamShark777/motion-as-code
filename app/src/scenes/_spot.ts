// Shared kit for the spotlight-effect plates: the pixel-art avatar (sticker style: black then
// bone outline), the pixel crowd, pixel eyes in the dark, spotlight cones, the title lock-up and
// a wrapping karaoke row helper. Everything is a pure function of its inputs.
import { rgba, HEX } from '../engine/palette';
import { F, font, measure } from '../engine/type';
import { clamp, ease, lerp, prog, noise1 } from '../engine/util';
import type { Word } from '../engine/lyrics';
import type { AudioData } from '../engine/audio';
import { placeRow, setWorld, w2s, type Cam, type KWord } from './_vo';
import { duotone, type Look } from './_looks';

/** The active look (vertical template); null = the house colours of the original plates. */
let LK: Look | null = null;
export function setSpotLook(l: Look | null) { LK = l; }
const hexA = (h: string, a: number) => { const n = parseInt(h.replace('#', ''), 16); return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`; };

// ================================================================== colours
const COL: Record<string, string> = {
  H: '#17110e', h: '#4b3427', S: '#b07452', s: '#8a5437', L: '#cc8d66', n: '#4f2a1a',
  B: '#1b1310', b: '#3a281f', E: '#f1ece2', P: '#2b170c', w: '#ffffff', K: '#0A0A0B', W: '#120c0a',
  M: '#45140f', T: '#f4efe7', R: '#9c463d', O: '#FF4D12', o: '#b8360b', G: '#e3dfd7', g: '#8e8981',
  C: '#f5f2eb', X: HEX.bone, A: '#D8FF3C', a: '#93b01a', r: '#d4605a', d: '#FF8A3D',
};

// ================================================================== the avatar
export const AW = 36, AH = 44;
type Grid = string[][];
const ell = (x: number, y: number, cx: number, cy: number, rx: number, ry: number) => ((x - cx) / rx) ** 2 + ((y - cy) / ry) ** 2 <= 1;
const hh = (x: number) => { const s = Math.sin(x * 12.9898 + 78.233) * 43758.5453; return s - Math.floor(s); };
const m = (x: number) => 35 - x;

function beardTop(dx: number) { return dx >= 8.6 ? 17 : dx > 3 ? 24 - (dx - 3) * 0.95 : 24; }

function paintBase(cringe: boolean): Grid {
  const g: Grid = Array.from({ length: AH }, () => Array<string>(AW).fill('.'));
  for (let y = 0; y < AH; y++) for (let x = 0; x < AW; x++) {
    const px = x + 0.5, py = y + 0.5, dx = Math.abs(px - 18);
    let c = '.';
    // body
    if (y >= 33) {
      const hw = Math.min(17.6, 7.5 + (y - 33) * 2.3);
      if (dx < hw) {
        const tw = 4.5 + (y - 33) * 0.45;
        if (cringe) {
          c = dx > hw - 1 ? 'a' : 'A';
        } else {
          c = dx > hw - 1 ? 'o' : 'O';
          if (dx < tw) {
            const neckTop = 34 + 2.2 * (1 - Math.min(1, (dx / 4.5) ** 2));
            if (py < neckTop) c = 'S';
            else c = y % 3 === 1 && (x + (y >> 1)) % 3 !== 0 ? 'g' : 'G';
          } else if (dx < tw + 1) c = 'o';
        }
      }
    }
    // neck
    if (dx < 4.6 && y >= 27 && y <= 34 && (c === '.' || y < 34)) c = y <= 31 ? 's' : 'S';
    // head
    if (ell(px, py, 18, 19.5, 10.2, 11.5)) c = px > 26 ? 's' : 'S';
    // beard
    if (ell(px, py, 18, 21.2, 10.6, 11.6) && py >= beardTop(dx) && py > 13) c = 'B';
    // hair: wavy volume on top, a fringe falling in uneven locks, short sides
    const FR = [17, 16, 15, 14, 14, 14, 13, 14, 13, 12, 12, 11, 10, 10, 10, 9, 10, 10, 11, 11, 12, 14, 15, 16];
    let hair = false;
    if (ell(px, py, 18, 11.6, 12.2, 9.8) && x >= 6 && x <= 29) hair = py < FR[x - 6]!;
    if (!hair && py < 3.4 && dx < 9 && ell(px, py, 18, 11.6, 13, 10.6) && hh(x + y * 3) > 0.5) hair = true;
    if (hair) { const wv = (px - 2.4 * Math.sin(py * 0.75) + py * 0.6) % 5; c = py > 2.5 && py < 11 && wv >= 0 && wv < 1 ? 'h' : 'H'; }
    g[y]![x] = c;
  }
  // stubble edge: beard cells with skin above
  for (let y = 1; y < AH; y++) for (let x = 0; x < AW; x++) if (g[y]![x] === 'B' && (g[y - 1]![x] === 'S' || g[y - 1]![x] === 's')) g[y]![x] = 'b';
  // ears (over the beard edge)
  for (let y = 18; y <= 23; y++) for (let x = 5; x <= 8; x++) {
    if (ell(x + 0.5, y + 0.5, 7.4, 21, 1.7, 2.5) && !ell(x + 0.5, y + 0.5, 18, 19.5, 10.2, 11.5)) {
      g[y]![x] = x === 7 ? 's' : 'S';
      g[y]![m(x)] = m(x) === 28 ? 's' : 's';
    }
  }
  // nose
  const set = (x: number, y: number, c: string) => { g[y]![x] = c; };
  set(18, 20, 's'); set(18, 21, 's'); set(16, 22, 's'); set(19, 22, 's'); set(17, 22, 'L'); set(17, 23, 'n'); set(18, 23, 'n');
  // under-eye shadow (tired, like the photo)
  for (const x of [12, 13, 14, 15]) { set(x, 21, 's'); set(m(x), 21, 's'); }
  // earbuds + cables
  set(7, 21, 'C'); set(7, 22, 'C'); set(28, 21, 'C'); set(28, 22, 'C');
  const cable: [number, number][] = [[7, 23], [7, 24], [8, 25], [8, 26], [9, 27], [9, 28], [10, 29], [10, 30], [11, 31], [11, 32], [12, 33], [12, 34], [12, 35], [13, 36], [13, 37], [13, 38], [14, 39], [14, 40], [14, 41], [15, 42], [15, 43]];
  for (const [x, y] of cable) { set(x, y, 'C'); set(m(x), y, 'C'); }
  if (cringe) {
    // a big pixel heart on the shirt
    const heart = ['.XX.XX.', 'XXXXXXX', 'XXXXXXX', '.XXXXX.', '..XXX..', '...X...'];
    heart.forEach((row, j) => [...row].forEach((ch, i) => { if (ch === 'X') set(15 + i - 1, 36 + j, 'O'); }));
  }
  return g;
}

const BASE = { tank: paintBase(false), cringe: paintBase(true) };

/** Outline rings from the silhouette: 1 = ink ring, 2 = bone ring. Padded by 2 on left/right/top. */
const OUT = (() => {
  const g = BASE.tank;
  const Wd = AW + 4, Hd = AH + 2;
  const filled = (x: number, y: number) => { const gx = x - 2, gy = y - 2; return gy >= 0 && gy < AH && gx >= 0 && gx < AW && g[gy]![gx] !== '.'; };
  const ring = Array.from({ length: Hd }, () => new Uint8Array(Wd));
  const near = (x: number, y: number, test: (x: number, y: number) => boolean) => {
    for (let j = -1; j <= 1; j++) for (let i = -1; i <= 1; i++) { if (test(x + i, y + j)) return true; }
    return false;
  };
  for (let y = 0; y < Hd; y++) for (let x = 0; x < Wd; x++) if (!filled(x, y) && near(x, y, filled)) ring[y]![x] = 1;
  const r1 = (x: number, y: number) => y >= 0 && y < Hd && x >= 0 && x < Wd && ring[y]![x] === 1;
  for (let y = 0; y < Hd; y++) for (let x = 0; x < Wd; x++) if (!filled(x, y) && !ring[y]![x] && near(x, y, r1)) ring[y]![x] = 2;
  return ring;
})();

export interface AvState {
  blink?: number; talk?: number; look?: [number, number]; blush?: number; sweat?: number;
  /** 0..1 wipe of the embarrassing shirt (bottom-up). */
  cringe?: number; happy?: number; wink?: number; brow?: number; alpha?: number;
}

/** Draw the avatar with its bottom-centre at world (x, y), s world px per pixel. */
export function drawAvatar(ctx: CanvasRenderingContext2D, c: Cam, x: number, y: number, s: number, st: AvState = {}) {
  const g = BASE.tank.map((r) => r.slice());
  const cr = st.cringe ?? 0;
  if (cr > 0) {
    const rows = Math.round(cr * 12);
    for (let yy = AH - rows; yy < AH; yy++) if (yy >= 33) g[yy] = BASE.cringe[yy]!.slice();
  }
  const set = (xx: number, yy: number, ch: string) => { g[yy]![xx] = ch; };
  // brows
  const bu = (st.brow ?? 0) > 0.5 ? -1 : 0;
  for (const xx of [11, 12, 13, 14, 15]) { set(xx, 16 + bu, 'W'); set(m(xx), 16 + bu, 'W'); }
  for (const xx of [12, 13]) { set(xx, 15 + bu, 'W'); set(m(xx), 15 + bu, 'W'); }
  if (bu) for (const xx of [11, 12, 13, 14, 15]) { set(xx, 16, 'S'); set(m(xx), 16, 'S'); }
  // eyes
  const lx = Math.round(clamp(st.look?.[0] ?? 0, -1, 1)), ly = Math.round(clamp(st.look?.[1] ?? 0, -1, 1));
  const eye = (x0: number, mode: 'open' | 'blink' | 'happy') => {
    if (mode === 'blink') { for (let i = 0; i < 4; i++) { set(x0 + i, 18, 'S'); set(x0 + i, 19, 'S'); set(x0 + i, 20, 'K'); } return; }
    if (mode === 'happy') {
      for (let i = 0; i < 4; i++) { set(x0 + i, 18, 'S'); set(x0 + i, 19, 'S'); set(x0 + i, 20, 'S'); }
      set(x0, 20, 'K'); set(x0 + 1, 19, 'K'); set(x0 + 2, 19, 'K'); set(x0 + 3, 20, 'K');
      return;
    }
    for (let i = 0; i < 4; i++) { set(x0 + i, 18, 'K'); set(x0 + i, 19, 'E'); set(x0 + i, 20, 'E'); }
    const p = 1 + lx;
    const pr = ly < 0 ? 19 : 19;
    set(x0 + p, pr, 'P'); set(x0 + p + 1, pr, 'P'); set(x0 + p, pr + 1, 'P'); set(x0 + p + 1, pr + 1, 'P');
    set(x0 + p, pr, 'w');
    if (ly > 0) { set(x0 + p, 19, 'E'); set(x0 + p + 1, 19, 'E'); set(x0, 18, 'K'); }
  };
  const blink = (st.blink ?? 0) > 0.5;
  const happy = (st.happy ?? 0) > 0.5;
  eye(12, happy ? 'happy' : blink ? 'blink' : 'open');
  eye(20, happy || (st.wink ?? 0) > 0.5 ? 'happy' : blink ? 'blink' : 'open');
  // mouth
  const tk = st.talk ?? 0;
  if (tk > 0.55) {
    for (let xx = 15; xx <= 20; xx++) set(xx, 25, 'T');
    for (let xx = 15; xx <= 20; xx++) set(xx, 26, 'M');
    for (let xx = 16; xx <= 19; xx++) set(xx, 27, 'R');
    set(14, 25, 'M'); set(21, 25, 'M');
  } else if (tk > 0.2) {
    for (let xx = 15; xx <= 20; xx++) set(xx, 25, 'T');
    for (let xx = 16; xx <= 19; xx++) set(xx, 26, 'M');
    set(14, 25, 'M'); set(21, 25, 'M');
  } else {
    for (let xx = 15; xx <= 20; xx++) set(xx, 26, 'M');
    set(14, 25, 'M'); set(21, 25, 'M');
  }
  // blush and sweat
  if ((st.blush ?? 0) > 0.3) for (const xx of [10, 11, 12]) { set(xx, 22, 'r'); set(m(xx), 22, 'r'); }
  if ((st.sweat ?? 0) > 0.5) { set(27, 12, 'C'); set(27, 13, 'C'); set(26, 14, 'C'); set(27, 14, 'C'); }

  const a = st.alpha ?? 1;
  setWorld(ctx, c, x, y);
  ctx.globalAlpha = a;
  const ov = 0.6 / c.z; // overlap to hide seams
  const ox = -18 * s, oy = -AH * s;
  // outline rings
  for (let yy = 0; yy < AH + 2; yy++) for (let xx = 0; xx < AW + 4; xx++) {
    const r = OUT[yy]![xx]!;
    if (!r) continue;
    ctx.fillStyle = r === 1 ? (LK?.avatar.ring1 ?? COL.K!) : (LK?.avatar.ring2 ?? COL.X!);
    ctx.fillRect(ox + (xx - 2) * s, oy + (yy - 2) * s, s + ov, s + ov);
  }
  for (let yy = 0; yy < AH; yy++) for (let xx = 0; xx < AW; xx++) {
    const ch = g[yy]![xx]!;
    if (ch === '.') continue;
    const base = COL[ch] ?? '#f0f';
    ctx.fillStyle = LK?.avatar.tint ? duotone(base, LK.avatar.tint[0], LK.avatar.tint[1]) : base;
    ctx.fillRect(ox + xx * s, oy + yy * s, s + ov, s + ov);
  }
  ctx.globalAlpha = 1;
  ctx.setTransform(1, 0, 0, 1, 0, 0);
}

/** Head centre of an avatar drawn at (x, y, s), in world px. */
export const avatarHead = (x: number, y: number, s: number): [number, number] => [x, y - (AH - 19.5) * s];

/** Mouth openness from the voice envelope (0 closed .. 1 open), quantised by drawAvatar. */
export function lipsync(au: AudioData, t: number) {
  const v = au.env('rms', t + 0.03);
  return clamp((v - 0.12) / 0.45);
}
/** Natural blink: ~every 3.1 s, 0.12 s long, seeded. */
export function blinkAt(t: number, seed = 0) {
  const period = 3.1, ph = ((t + seed * 1.7) % period + period) % period;
  return ph < 0.12 ? 1 : 0;
}

// ================================================================== the crowd
export const PWD = 12, PHT = 14;
export interface PersonLook { skin: string; shirt: string; hair: string; long: boolean }
export const PEOPLE: PersonLook[] = Array.from({ length: 40 }, (_, i) => ({
  skin: ['#8a6a58', '#a5806a', '#6b4c3c', '#b8957d', '#7a5644'][i % 5]!,
  shirt: ['#3b3936', '#4a4642', '#2e2d2b', '#56514b', '#423d39'][(i * 3 + 1) % 5]!,
  hair: ['#1a1614', '#2b2420', '#3d3129', '#151312'][(i * 7 + 2) % 4]!,
  long: hh(i * 5.1) > 0.6,
}));

function personGrid(p: PersonLook): string[][] {
  const g = Array.from({ length: PHT }, () => Array<string>(PWD).fill('.'));
  for (let y = 0; y < PHT; y++) for (let x = 0; x < PWD; x++) {
    const px = x + 0.5, py = y + 0.5, dx = Math.abs(px - 6);
    let c = '.';
    if (y >= 10) { const hw = Math.min(6, 3 + (y - 10) * 1.3); if (dx < hw) c = 'shirt'; }
    if (y >= 8 && y <= 10 && dx < 1.3) c = 'skin';
    if (ell(px, py, 6, 5.4, 3.6, 4.1)) c = 'skin';
    if (ell(px, py, 6, 4.4, 4.1, 3.5) && (py < 3.4 || (dx > 3 && py < (p.long ? 9.5 : 6)))) c = 'hair';
    if (p.long && dx > 3.1 && dx < 4.6 && py < 9.5 && py > 3) c = 'hair';
    g[y]![x] = c;
  }
  return g;
}
const PGRIDS = PEOPLE.map(personGrid);

export interface PersonState {
  /** 'phone': eyes down at a glowing phone; 'look': eyes toward dir; 'closed' */
  mode: 'phone' | 'look';
  dir?: number; // -1 left, +1 right
  /** 0..1 noticed: signal outline + '!' */
  hot?: number;
  alpha?: number;
  scale?: number; // pop-in
}
export function drawPerson(ctx: CanvasRenderingContext2D, c: Cam, i: number, x: number, y: number, s: number, st: PersonState) {
  const look = PEOPLE[i % PEOPLE.length]!;
  const g = PGRIDS[i % PGRIDS.length]!;
  const sc = st.scale ?? 1;
  if (sc <= 0.01) return;
  const a = st.alpha ?? 1;
  setWorld(ctx, c, x, y, sc);
  ctx.globalAlpha = a;
  const ov = 0.6 / (c.z * sc);
  const ox = -6 * s, oy = -PHT * s;
  const hot = st.hot ?? 0;
  const kind = LK?.crowd.kind ?? 'figure';
  const accent = LK?.crowd.hot ?? LK?.accent ?? COL.O!;
  const shirts = LK?.crowd.shirts;
  const shirt = shirts ? shirts[i % shirts.length]! : look.shirt;
  if (kind === 'unit' || kind === 'pictogram') {
    const col = hot > 0.5 ? accent : shirt;
    if (kind === 'unit') {
      const w = 10 * s;
      ctx.fillStyle = col;
      ctx.fillRect(-w / 2, -w - 2 * s, w, w);
      if (hot > 0.5) { ctx.strokeStyle = LK!.crowd.outline; ctx.lineWidth = 1.5 / (c.z * sc); ctx.strokeRect(-w / 2, -w - 2 * s, w, w); }
    } else {
      ctx.fillStyle = col;
      ctx.beginPath(); ctx.arc(0, -11.2 * s, 2.7 * s, 0, Math.PI * 2); ctx.fill();
      rr(ctx, -4 * s, -7.6 * s, 8 * s, 7.6 * s, 2.6 * s); ctx.fill();
      if (st.mode === 'phone' && hot <= 0.5) { ctx.fillStyle = LK!.crowd.outline; ctx.globalAlpha = a * 0.8; ctx.fillRect(-2 * s, -4.4 * s, 4 * s, 1.2 * s); ctx.globalAlpha = a; }
    }
    if (hot > 0.01) {
      ctx.globalAlpha = a * clamp(hot * 1.5);
      ctx.fillStyle = accent;
      ctx.fillRect(-0.6 * s, -21 * s, 1.4 * s, 4 * s); ctx.fillRect(-0.6 * s, -16 * s, 1.4 * s, 1.4 * s);
    }
    ctx.globalAlpha = 1;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    return;
  }
  const filled = (xx: number, yy: number) => yy >= 0 && yy < PHT && xx >= 0 && xx < PWD && g[yy]![xx] !== '.';
  // outline (ink, or signal when noticed)
  const ring = hot > 0.5 ? accent : (LK?.crowd.outline ?? COL.K!);
  if (!(kind === 'silhouette' && hot <= 0.5)) {
    ctx.fillStyle = ring;
    for (let yy = -1; yy < PHT; yy++) for (let xx = -1; xx <= PWD; xx++) {
      if (filled(xx, yy)) continue;
      let n = false;
      for (let j = -1; j <= 1 && !n; j++) for (let k = -1; k <= 1; k++) if (filled(xx + k, yy + j)) { n = true; break; }
      if (n) ctx.fillRect(ox + xx * s, oy + yy * s, s + ov, s + ov);
    }
  }
  if (kind !== 'outline') for (let yy = 0; yy < PHT; yy++) for (let xx = 0; xx < PWD; xx++) {
    const k = g[yy]![xx]!;
    if (k === '.') continue;
    ctx.fillStyle = kind === 'silhouette' ? shirt : k === 'shirt' ? shirt : (look as any)[k];
    ctx.fillRect(ox + xx * s, oy + yy * s, s + ov, s + ov);
  }
  if (kind === 'silhouette' || kind === 'outline') {
    if (st.mode !== 'phone') {
      const d = (st.dir ?? 0) >= 0 ? 1 : 0;
      ctx.fillStyle = hot > 0.5 ? accent : (LK?.crowd.outline ?? COL.K!);
      for (const x0 of [3, 7]) ctx.fillRect(ox + (x0 + d) * s, oy + 5 * s, s + ov, s + ov);
    }
    if (hot > 0.01) {
      ctx.globalAlpha = a * clamp(hot * 1.5);
      ctx.fillStyle = accent;
      for (const yy of [-6, -5, -4]) ctx.fillRect(ox + 5 * s, oy + yy * s, s + ov, s + ov);
      ctx.fillRect(ox + 5 * s, oy - 2.5 * s, s + ov, s + ov);
    }
    ctx.globalAlpha = 1;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    return;
  }
  // eyes
  const px = (xx: number, yy: number, col: string) => { ctx.fillStyle = col; ctx.fillRect(ox + xx * s, oy + yy * s, s + ov, s + ov); };
  if (st.mode === 'phone') {
    px(3, 6, COL.K!); px(4, 6, COL.K!); px(7, 6, COL.K!); px(8, 6, COL.K!);
    // the phone, glowing
    px(4, 12, '#cfe0f5'); px(5, 12, '#cfe0f5'); px(6, 12, '#cfe0f5'); px(7, 12, '#cfe0f5');
    px(4, 13, '#7d8ba0'); px(5, 13, '#7d8ba0'); px(6, 13, '#7d8ba0'); px(7, 13, '#7d8ba0');
    px(3, 13, look.skin); px(8, 13, look.skin);
  } else {
    const d = (st.dir ?? 0) >= 0 ? 1 : 0;
    for (const x0 of [3, 7]) { px(x0, 5, COL.E!); px(x0 + 1, 5, COL.E!); px(x0 + d, 5, hot > 0.5 ? accent : COL.P!); }
  }
  if (hot > 0.01) {
    // '!' above the head
    ctx.globalAlpha = a * clamp(hot * 1.5);
    const bx = 5.5 * s - 0.5 * s;
    for (const yy of [-6, -5, -4]) px(5.5 - 0.5, yy, accent);
    void bx;
    px(5, -2.5, accent);
  }
  ctx.globalAlpha = 1;
  ctx.setTransform(1, 0, 0, 1, 0, 0);
}

// ================================================================== eyes in the dark
/** A pair of pixel eyes opening in the dark, pupils (signal) toward (tx, ty). open 0..1. */
export function drawEyePair(ctx: CanvasRenderingContext2D, c: Cam, x: number, y: number, s: number, open: number, tx: number, ty: number, alpha = 1) {
  if (open <= 0.01 || alpha <= 0.01) return;
  setWorld(ctx, c, x, y);
  const rows = open < 0.34 ? 1 : open < 0.67 ? 2 : 3;
  const dx = Math.sign(tx - x), dy = ty - y > 120 ? 1 : ty - y < -120 ? -1 : 0;
  for (const side of [-1, 1]) {
    const ex = side * 3.2 * s - 2 * s;
    ctx.globalAlpha = alpha;
    const r0 = 1.5 - rows / 2;
    if (LK?.light) { ctx.fillStyle = LK.eyes.outline; ctx.fillRect(ex - s * 0.6, (r0 - 1.5) * s - s * 0.6, 5.2 * s, rows * s + 1.2 * s); }
    ctx.fillStyle = LK ? LK.eyes.white : rgba('bone', 0.92);
    ctx.fillRect(ex, (r0 - 1.5) * s, 4 * s, rows * s);
    if (rows >= 2) {
      ctx.fillStyle = LK ? LK.eyes.pupil : rgba('signal', 1);
      const pxp = dx > 0 ? 2.5 : 0;
      const pyp = rows === 3 ? 1 + dy * 0.5 : 0.5;
      ctx.fillRect(ex + pxp * s, (r0 - 1.5 + Math.min(rows - 1, Math.max(0, Math.round(pyp)))) * s, s * 1.5, s);
    }
  }
  ctx.globalAlpha = 1;
  ctx.setTransform(1, 0, 0, 1, 0, 0);
}

// ================================================================== spotlight
/** A theatre spotlight cone from (x, top) widening to w at floorY, with a pool. k = 0..1 intensity. */
export function drawCone(ctx: CanvasRenderingContext2D, c: Cam, x: number, top: number, floorY: number, w0: number, w1: number, k: number, warm = 1) {
  if (k <= 0.005) return;
  setWorld(ctx, c, 0, 0);
  const gr = ctx.createLinearGradient(0, top, 0, floorY);
  const cone = LK?.cone;
  if (LK && !cone) { ctx.setTransform(1, 0, 0, 1, 0, 0); return; }
  const col = (a: number) => cone ? hexA(cone.col, Math.min(1, a * cone.alpha / 0.26)) : warm ? `rgba(255,214,170,${a})` : `rgba(238,233,223,${a})`;
  const prevOp = ctx.globalCompositeOperation;
  if (cone) ctx.globalCompositeOperation = cone.op;
  gr.addColorStop(0, col(0.26 * k));
  gr.addColorStop(0.6, col(0.09 * k));
  gr.addColorStop(1, col(0.14 * k));
  ctx.fillStyle = gr;
  ctx.beginPath();
  ctx.moveTo(x - w0 / 2, top); ctx.lineTo(x + w0 / 2, top); ctx.lineTo(x + w1 / 2, floorY); ctx.lineTo(x - w1 / 2, floorY); ctx.closePath();
  ctx.fill();
  // the pool on the floor
  const pg = ctx.createRadialGradient(x, floorY, 0, x, floorY, w1 * 0.6);
  pg.addColorStop(0, col(0.4 * k)); pg.addColorStop(1, col(0));
  ctx.fillStyle = pg;
  ctx.save(); ctx.translate(x, floorY); ctx.scale(1, 0.22); ctx.beginPath(); ctx.arc(0, 0, w1 * 0.6, 0, Math.PI * 2); ctx.restore(); ctx.fill();
  ctx.globalCompositeOperation = prevOp;
  ctx.setTransform(1, 0, 0, 1, 0, 0);
}
/** Light switching on: two flickers then steady. */
export function lightOn(t: number, t0: number) {
  if (t < t0) return 0;
  const d = t - t0;
  if (d < 0.06) return 0.9;
  if (d < 0.11) return 0.1;
  if (d < 0.17) return 1;
  if (d < 0.21) return 0.25;
  return 0.92 + 0.08 * noise1(t * 8, 11);
}

// ================================================================== title lock-up
/** "THE SPOTLIGHT" in bone + an orange pill with "EFFECT" in ink. (x, y) = left of the SPOTLIGHT baseline. */
export function drawTitle(ctx: CanvasRenderingContext2D, c: Cam, x: number, y: number, size: number, kThe: number, kSpot: number, kEff: number, alpha = 1) {
  const fam = F.archivo(80, 900);
  const wSpot = measure('SPOTLIGHT', fam, size);
  const slam = (k: number) => (k <= 0 ? 0 : 1 + 0.35 * (1 - ease.outExpo(clamp(k))));
  ctx.textBaseline = 'alphabetic';
  if (kThe > 0) {
    const sc = slam(kThe);
    setWorld(ctx, c, x, y - size * 0.86, sc);
    ctx.globalAlpha = alpha * clamp(kThe * 3);
    ctx.font = font(fam, size * 0.42);
    ctx.fillStyle = rgba('bone', 1);
    ctx.fillText('THE', 0, 0);
  }
  if (kSpot > 0) {
    const sc = slam(kSpot);
    setWorld(ctx, c, x + wSpot / 2, y - size * 0.35, sc);
    ctx.globalAlpha = alpha * clamp(kSpot * 3);
    ctx.font = font(fam, size);
    ctx.fillStyle = rgba('bone', 1);
    ctx.fillText('SPOTLIGHT', -wSpot / 2, size * 0.35);
  }
  if (kEff > 0) {
    const sc = slam(kEff);
    const ps = size * 0.62;
    const wE = measure('EFFECT', fam, ps);
    const pw = wE + ps * 0.9, ph = ps * 1.18;
    const cx = x + wSpot / 2, cy = y + size * 0.2 + ph / 2;
    setWorld(ctx, c, cx, cy, sc, -0.02 * (1 - clamp(kEff * 2)));
    ctx.globalAlpha = alpha * clamp(kEff * 3);
    ctx.fillStyle = 'rgba(0,0,0,0.55)';
    rr(ctx, -pw / 2 + 6, -ph / 2 + 10, pw, ph, ph / 2); ctx.fill();
    ctx.fillStyle = rgba('signal', 1);
    rr(ctx, -pw / 2, -ph / 2, pw, ph, ph / 2); ctx.fill();
    ctx.font = font(fam, ps);
    ctx.fillStyle = rgba('ink', 1);
    ctx.fillText('EFFECT', -wE / 2, ps * 0.36);
  }
  ctx.globalAlpha = 1;
  ctx.setTransform(1, 0, 0, 1, 0, 0);
}
export function rr(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r); ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath();
}

// ================================================================== karaoke rows
/** Lay words into rows of at most maxW world px; returns KWords. Rows start at (x, y), step lead*size. */
export function wrapRows(words: Word[], x: number, y: number, size: number, fam: string, group: string, maxW: number, lead = 1.02, o: { ant?: number; align?: 'left' | 'right'; breaks?: number[] } = {}) {
  const rows: Word[][] = [[]];
  const sp = measure(' ', fam, size);
  let cw = 0;
  words.forEach((w, i) => {
    const ww = measure(w.w, fam, size);
    const forced = o.breaks?.includes(i);
    if ((cw > 0 && cw + sp + ww > maxW) || (forced && rows[rows.length - 1]!.length)) { rows.push([]); cw = 0; }
    rows[rows.length - 1]!.push(w);
    cw += (cw > 0 ? sp : 0) + ww;
  });
  const out: KWord[] = [];
  rows.forEach((r, j) => {
    const pr = placeRow(r, x, y + j * size * lead, size, fam, group, { ant: o.ant ?? 0.25 });
    out.push(...pr.words);
  });
  return { words: out, rows: rows.length };
}

export { lerp, prog };

/** Faceless presenter: a row of rounded bars that dance with the voice (script `presenter: "wave"`).
 *  Centre (x, y), bar unit s (≈ the avatar scale), level 0–1 from lipsync, colours from the look. */
export function drawWave(ctx: CanvasRenderingContext2D, c: Cam, x: number, y: number, s: number, level: number, t: number,
                         col: { main: string; glow: string }, alpha = 1) {
  const N = 11, bw = s * 0.9, gap = s * 0.55;
  const w = N * bw + (N - 1) * gap;
  const [sx, sy] = w2s(c, x, y);
  const k = c.z;
  ctx.save();
  ctx.setTransform(k, 0, 0, k, sx, sy);
  ctx.globalAlpha = alpha * (0.18 + 0.22 * level);
  const g = ctx.createRadialGradient(0, 0, 0, 0, 0, w * 0.85);
  g.addColorStop(0, col.glow); g.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = g;
  ctx.fillRect(-w, -w, w * 2, w * 2);
  ctx.globalAlpha = alpha;
  ctx.fillStyle = col.main;
  for (let i = 0; i < N; i++) {
    const u = i / (N - 1) - 0.5;
    const env = Math.cos(u * Math.PI * 0.95);              // taller in the middle
    const wob = 0.55 + 0.45 * Math.sin(t * 9 + i * 1.7) * Math.sin(t * 5.3 + i * 0.9);
    const h = s * (1.1 + env * (0.6 + level * 9 * wob));
    const bx = -w / 2 + i * (bw + gap);
    ctx.beginPath();
    ctx.roundRect(bx, -h / 2, bw, h, bw / 2);
    ctx.fill();
  }
  ctx.restore();
}
