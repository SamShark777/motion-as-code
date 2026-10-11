// Shared bits for the vertical (9:16) script-driven template: the script (data/script.json),
// centred karaoke rows and the vertical title lock-up. World origin = frame centre (1080x1920).
import { rgba } from '../engine/palette';
import { F, font, measure } from '../engine/type';
import { clamp, ease } from '../engine/util';
import type { Line, Word, Lyrics } from '../engine/lyrics';
import { norm } from '../engine/lyrics';
import { placeRow, setWorld, type Cam, type KWord } from './_vo';
import { rr } from './_spot';

export interface Stat { label: string; value: number; display?: string; cue: string; lit?: number }
export interface Script {
  slug: string;
  title: [string, string];
  hookStyle?: 'eyes' | 'thoughts';
  titleCue?: string;
  credit?: string;
  stat?: { unit?: string; a: Stat; b?: Stat };
  cta?: string;
  lines: { sec: string; text: string; say?: string }[];
}

let cached: Promise<Script> | null = null;
export function loadScript(): Promise<Script> {
  if (!cached) cached = fetch('data/script.json').then((r) => { if (!r.ok) throw new Error('data/script.json missing'); return r.json(); });
  return cached;
}

/** Lyrics lines of a section (sec field written by analysis/tts_vo.py). */
export const secLines = (ly: Lyrics, sec: string | string[]) => {
  const s = Array.isArray(sec) ? sec : [sec];
  return ly.lines.filter((l) => s.includes((l as any).sec));
};

/** First word in lines whose normalised text equals q (or starts with it). */
export function findWord(lines: Line[], q: string): Word | null {
  const n = norm(q);
  for (const l of lines) for (const w of l.words) if (norm(w.w) === n) return w;
  for (const l of lines) for (const w of l.words) if (norm(w.w).startsWith(n) && n.length > 1) return w;
  return null;
}

/** Wrap words into rows ≤ maxW, centred on x = 0; first baseline at y. */
export function centredRows(words: Word[], y: number, size: number, fam: string, group: string, maxW = 960, lead = 1.02, ant = 0.25) {
  const sp = measure(' ', fam, size);
  const rows: Word[][] = [[]];
  let cw = 0;
  for (const w of words) {
    const ww = measure(w.w, fam, size);
    if (cw > 0 && cw + sp + ww > maxW) { rows.push([]); cw = 0; }
    rows[rows.length - 1]!.push(w);
    cw += (cw > 0 ? sp : 0) + ww;
  }
  const out: KWord[] = [];
  rows.forEach((r, j) => {
    const pr = placeRow(r, 0, y + j * size * lead, size, fam, group, { ant });
    for (const k of pr.words) k.x -= pr.width / 2;
    out.push(...pr.words);
  });
  return { words: out, rows: rows.length, bottom: y + (rows.length - 1) * size * lead };
}

/** Largest size ≤ max at which every word fits rows of maxW within maxRows rows. */
export function fitRows(words: Word[], fam: string, maxW: number, maxRows: number, max: number, min = 40) {
  for (let s = max; s > min; s -= 4) {
    const sp = measure(' ', fam, s);
    let rows = 1, cw = 0, ok = true;
    for (const w of words) {
      const ww = measure(w.w, fam, s);
      if (ww > maxW) { ok = false; break; }
      if (cw > 0 && cw + sp + ww > maxW) { rows++; cw = 0; }
      cw += (cw > 0 ? sp : 0) + ww;
    }
    if (ok && rows <= maxRows) return s;
  }
  return min;
}

/** Big title line (bone) + orange pill below, centred at x = 0; y = big line baseline. */
export function drawTitleV(ctx: CanvasRenderingContext2D, c: Cam, y: number, big: string, pill: string, maxSize: number, kBig: number, kPill: number, alpha = 1) {
  const fam = F.archivo(80, 900);
  const size = Math.min(maxSize, 980 / Math.max(1e-3, measure(big, fam, 1)));
  const slam = (k: number) => 1 + 0.35 * (1 - ease.outExpo(clamp(k)));
  ctx.textBaseline = 'alphabetic';
  if (kBig > 0) {
    const wB = measure(big, fam, size);
    setWorld(ctx, c, 0, y - size * 0.35, slam(kBig));
    ctx.globalAlpha = alpha * clamp(kBig * 3);
    ctx.font = font(fam, size);
    ctx.fillStyle = rgba('bone', 1);
    ctx.fillText(big, -wB / 2, size * 0.35);
  }
  if (kPill > 0 && pill) {
    const ps = Math.min(size * 0.7, 120);
    const wE = measure(pill, fam, ps);
    const pw = wE + ps * 0.9, ph = ps * 1.18;
    const cy = y + size * 0.18 + ph / 2;
    setWorld(ctx, c, 0, cy, slam(kPill), -0.02 * (1 - clamp(kPill * 2)));
    ctx.globalAlpha = alpha * clamp(kPill * 3);
    ctx.fillStyle = 'rgba(0,0,0,0.55)';
    rr(ctx, -pw / 2 + 6, -ph / 2 + 10, pw, ph, ph / 2); ctx.fill();
    ctx.fillStyle = rgba('signal', 1);
    rr(ctx, -pw / 2, -ph / 2, pw, ph, ph / 2); ctx.fill();
    ctx.font = font(fam, ps);
    ctx.fillStyle = rgba('ink', 1);
    ctx.fillText(pill, -wE / 2, ps * 0.36);
  }
  ctx.globalAlpha = 1;
  ctx.setTransform(1, 0, 0, 1, 0, 0);
}

/** A pixel '?' (5x7) at world (x, y) bottom-left, cell s. */
const QMARK = ['.XXX.', 'X...X', '....X', '...X.', '..X..', '.....', '..X..'];
export function drawQ(ctx: CanvasRenderingContext2D, c: Cam, x: number, y: number, s: number, col: string, alpha = 1) {
  if (alpha <= 0.01) return;
  setWorld(ctx, c, x, y);
  ctx.globalAlpha = alpha;
  ctx.fillStyle = rgba('ink', 1);
  QMARK.forEach((row, j) => [...row].forEach((ch, i) => { if (ch === 'X') ctx.fillRect((i - 2.5) * s - s * 0.3, (j - 7) * s - s * 0.3, s * 1.6, s * 1.6); }));
  ctx.fillStyle = col;
  QMARK.forEach((row, j) => [...row].forEach((ch, i) => { if (ch === 'X') ctx.fillRect((i - 2.5) * s, (j - 7) * s, s + 0.5, s + 0.5); }));
  ctx.globalAlpha = 1;
  ctx.setTransform(1, 0, 0, 1, 0, 0);
}

/** How many of the 20 crowd figures a stat lights. */
export function litOf(s: Stat, unit?: string) {
  if (typeof s.lit === 'number') return Math.max(0, Math.min(20, Math.round(s.lit)));
  if (unit === '%') return Math.max(0, Math.min(20, Math.round((s.value / 100) * 20)));
  return 0;
}
/** Spread-out order in which crowd figures light up. */
export const LIT_ORDER = [0, 12, 6, 18, 3, 15, 9, 1, 13, 7, 19, 4, 16, 10, 2, 14, 8, 17, 5, 11];
