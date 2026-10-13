// Shared bits for the vertical (9:16) script-driven template: the script (data/script.json),
// centred karaoke rows, the vertical title lock-up and the per-video look (see _looks.ts).
// World origin = frame centre (1080x1920).
import { font, measure } from '../engine/type';
import { clamp, ease } from '../engine/util';
import type { Line, Word, Lyrics } from '../engine/lyrics';
import { norm } from '../engine/lyrics';
import { placeRow, setWorld, type Cam, type KWord, type KaraokeOpts } from './_vo';
import { rr, setSpotLook } from './_spot';
import { lookOf, boilJitter, type Look, type ChromeInfo } from './_looks';

export interface Stat { label: string; value: number; display?: string; cue: string; lit?: number }
export interface Script {
  slug: string;
  /** Idea number in the tracker (case numbers, sheet numbers…). */
  no?: number;
  /** Look id from _looks.ts (default pixel-lab). */
  look?: string;
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
/** Load the script and activate its look; every template plate calls this in init(). */
export async function loadScriptLook(): Promise<{ S: Script; L: Look }> {
  const S = await loadScript();
  const L = lookOf(S.look);
  setSpotLook(L);
  return { S, L };
}

/** Karaoke options for a look. */
export function karaokeOpts(L: Look, extra: KaraokeOpts = {}): KaraokeOpts {
  return { ghost: L.ghost, hot: L.hot, done: L.done, shadow: L.shadow, stroke: L.stroke, jitter: L.boil ? (kw, gi) => boilJitter(L, nowT, kw.w.gi * 31 + gi) : undefined, ...extra };
}
let nowT = 0;
/** Plates set the frame time (for boiling text). */
export const setNow = (t: number) => { nowT = t; };

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

const disp = (w: Word, upper?: boolean) => (upper ? w.w.toUpperCase() : w.w);

/** Wrap words into rows ≤ maxW, centred on x = 0; first baseline at y. */
export function centredRows(words: Word[], y: number, size: number, fam: string, group: string, maxW = 960, lead = 1.02, ant = 0.25, upper = false) {
  const sp = measure(' ', fam, size);
  const rows: Word[][] = [[]];
  let cw = 0;
  for (const w of words) {
    const ww = measure(disp(w, upper), fam, size);
    if (cw > 0 && cw + sp + ww > maxW) { rows.push([]); cw = 0; }
    rows[rows.length - 1]!.push(w);
    cw += (cw > 0 ? sp : 0) + ww;
  }
  const out: KWord[] = [];
  rows.forEach((r, j) => {
    const pr = placeRow(r, 0, y + j * size * lead, size, fam, group, { ant, texts: r.map((w) => disp(w, upper)) });
    for (const k of pr.words) k.x -= pr.width / 2;
    out.push(...pr.words);
  });
  return { words: out, rows: rows.length, bottom: y + (rows.length - 1) * size * lead };
}

/** Largest size ≤ max at which every word fits rows of maxW within maxRows rows. */
export function fitRows(words: Word[], fam: string, maxW: number, maxRows: number, max: number, min = 40, upper = false) {
  for (let s = max; s > min; s -= 4) {
    const sp = measure(' ', fam, s);
    let rows = 1, cw = 0, ok = true;
    for (const w of words) {
      const ww = measure(disp(w, upper), fam, s);
      if (ww > maxW) { ok = false; break; }
      if (cw > 0 && cw + sp + ww > maxW) { rows++; cw = 0; }
      cw += (cw > 0 ? sp : 0) + ww;
    }
    if (ok && rows <= maxRows) return s;
  }
  return min;
}

const HAND = /Caveat|Sacramento|PatrickHand|Architects/;
const titleCase = (s: string) => s.toLowerCase().replace(/(^|[\s-])(\w)/g, (_m, a, b) => a + b.toUpperCase());

/** Draw text with the look's shadow/stroke treatment (ctx already transformed; baseline at 0). */
function lookText(ctx: CanvasRenderingContext2D, L: Look, s: string, x: number, size: number, fill: string) {
  if (L.shadow) { ctx.fillStyle = L.shadow[2]; ctx.fillText(s, x + L.shadow[0] * size / 100, L.shadow[1] * size / 100); }
  if (L.stroke) { ctx.lineJoin = 'round'; ctx.lineWidth = L.stroke[1] * size * 2; ctx.strokeStyle = L.stroke[0]; ctx.strokeText(s, x, 0); }
  ctx.fillStyle = fill;
  ctx.fillText(s, x, 0);
}

/** Big title line + the look's second element (pill, stamp, box, underline…) centred at x = 0; y = big line baseline. */
export function drawTitleV(ctx: CanvasRenderingContext2D, c: Cam, y: number, big0: string, pill0: string, maxSize: number, kBig: number, kPill: number, L: Look, alpha = 1) {
  const fam = L.fonts.title;
  const hand = HAND.test(fam);
  const big = hand ? titleCase(big0) : big0;
  const pill = hand ? titleCase(pill0) : pill0;
  const size = Math.min(maxSize * (hand ? 1.15 : 1), 980 / Math.max(1e-3, measure(big, fam, 1)));
  const slam = (k: number) => 1 + 0.35 * (1 - ease.outExpo(clamp(k)));
  ctx.textBaseline = 'alphabetic';
  const wB = measure(big, fam, size);
  if (kBig > 0) {
    setWorld(ctx, c, 0, y - size * 0.35, slam(kBig));
    ctx.globalAlpha = alpha * clamp(kBig * 3);
    ctx.font = font(fam, size);
    ctx.translate(0, size * 0.35);
    lookText(ctx, L, big, -wB / 2, size, L.ink);
  }
  if (kPill > 0 && pill) {
    const kind = L.pill;
    const ps = kind === 'rule' ? Math.min(size * 0.42, 64) : Math.min(size * 0.7, 120);
    const pfam = kind === 'rule' ? L.fonts.mono : fam;
    const label = kind === 'rule' ? pill.toUpperCase() : pill;
    const wE = measure(label, pfam, ps) + (kind === 'rule' ? label.length * 6 : 0);
    const pw = wE + ps * 0.9, ph = ps * 1.18;
    const cy = y + size * 0.18 + ph / 2;
    const tilt = kind === 'stamp' ? -0.07 : kind === 'strip' ? -0.035 : -0.02 * (1 - clamp(kPill * 2));
    setWorld(ctx, c, 0, cy, slam(kPill), tilt);
    ctx.globalAlpha = alpha * clamp(kPill * 3) * (kind === 'stamp' ? 0.92 : 1);
    ctx.font = font(pfam, ps);
    let txtCol = L.accentInk;
    switch (kind) {
      case 'pill':
        ctx.fillStyle = 'rgba(0,0,0,0.35)'; rr(ctx, -pw / 2 + 6, -ph / 2 + 10, pw, ph, ph / 2); ctx.fill();
        ctx.fillStyle = L.accent; rr(ctx, -pw / 2, -ph / 2, pw, ph, ph / 2); ctx.fill();
        if (L.stroke) { ctx.lineWidth = 6; ctx.strokeStyle = L.stroke[0]; ctx.stroke(); }
        break;
      case 'chip':
        ctx.fillStyle = L.accent; rr(ctx, -pw / 2, -ph / 2, pw, ph, ph * 0.22); ctx.fill();
        break;
      case 'box':
        ctx.fillStyle = L.accent; ctx.fillRect(-pw / 2, -ph / 2, pw, ph);
        break;
      case 'stamp':
        ctx.strokeStyle = L.accent; ctx.lineWidth = 9; ctx.strokeRect(-pw / 2, -ph / 2, pw, ph);
        ctx.lineWidth = 3; ctx.strokeRect(-pw / 2 + 14, -ph / 2 + 14, pw - 28, ph - 28);
        txtCol = L.accent;
        break;
      case 'tag':
        ctx.fillStyle = L.second; rr(ctx, -pw / 2 + 9, -ph / 2 + 7, pw, ph, 18); ctx.fill();
        ctx.globalCompositeOperation = L.light ? 'multiply' : 'source-over';
        ctx.fillStyle = L.accent; rr(ctx, -pw / 2, -ph / 2, pw, ph, 18); ctx.fill();
        ctx.globalCompositeOperation = 'source-over';
        break;
      case 'plate':
        ctx.fillStyle = L.ink; ctx.fillRect(-pw / 2 + 8, -ph / 2 + 8, pw, ph);
        ctx.fillStyle = L.accent; ctx.fillRect(-pw / 2, -ph / 2, pw, ph);
        ctx.strokeStyle = L.accentInk; ctx.lineWidth = 6; ctx.strokeRect(-pw / 2 + 8, -ph / 2 + 8, pw - 16, ph - 16);
        break;
      case 'strip':
        ctx.fillStyle = L.ink; ctx.beginPath();
        ctx.moveTo(-pw / 2 - 20, -ph / 2); ctx.lineTo(pw / 2 + 10, -ph / 2 - 4); ctx.lineTo(pw / 2 + 24, ph / 2); ctx.lineTo(-pw / 2 - 8, ph / 2 + 3); ctx.closePath(); ctx.fill();
        txtCol = L.paper;
        break;
      case 'patch':
        ctx.fillStyle = L.accent; ctx.beginPath();
        for (let i = 0; i <= 24; i++) { const a = (i / 24) * Math.PI * 2; const r = 1 + 0.05 * Math.sin(i * 2.7); ctx.lineTo(Math.cos(a) * pw * 0.55 * r, Math.sin(a) * ph * 0.62 * r); }
        ctx.closePath(); ctx.fill();
        break;
      case 'underline': {
        txtCol = L.accent;
        ctx.strokeStyle = L.accent; ctx.lineWidth = Math.max(6, ps * 0.09); ctx.lineCap = 'round';
        const u = ease.outCubic(clamp(kPill * 1.6));
        ctx.beginPath(); ctx.moveTo(-wE / 2, ph * 0.42); ctx.quadraticCurveTo(0, ph * 0.5, -wE / 2 + wE * u, ph * 0.38); ctx.stroke();
        break;
      }
      case 'rule':
        ctx.fillStyle = L.ink; ctx.fillRect(-Math.max(wB, wE) / 2, -ph / 2 - 6, Math.max(wB, wE), 3);
        txtCol = L.accent;
        break;
    }
    ctx.letterSpacing = kind === 'rule' ? '6px' : '0px';
    ctx.fillStyle = txtCol;
    ctx.fillText(label, -wE / 2, ps * 0.36);
    ctx.letterSpacing = '0px';
  }
  ctx.globalAlpha = 1;
  ctx.setTransform(1, 0, 0, 1, 0, 0);
}

/** A pixel '?' (5x7) at world (x, y) bottom-left, cell s. */
const QMARK = ['.XXX.', 'X...X', '....X', '...X.', '..X..', '.....', '..X..'];
export function drawQ(ctx: CanvasRenderingContext2D, c: Cam, x: number, y: number, s: number, col: string, alpha = 1, edge = '#0A0A0B') {
  if (alpha <= 0.01) return;
  setWorld(ctx, c, x, y);
  ctx.globalAlpha = alpha;
  ctx.fillStyle = edge;
  QMARK.forEach((row, j) => [...row].forEach((ch, i) => { if (ch === 'X') ctx.fillRect((i - 2.5) * s - s * 0.3, (j - 7) * s - s * 0.3, s * 1.6, s * 1.6); }));
  ctx.fillStyle = col;
  QMARK.forEach((row, j) => [...row].forEach((ch, i) => { if (ch === 'X') ctx.fillRect((i - 2.5) * s, (j - 7) * s, s + 0.5, s + 0.5); }));
  ctx.globalAlpha = 1;
  ctx.setTransform(1, 0, 0, 1, 0, 0);
}

/** Draw the look's screen-space chrome. */
export function drawChrome(ctx: CanvasRenderingContext2D, L: Look, i: Omit<ChromeInfo, 'look'>, alpha = 1) {
  if (!L.chrome || alpha <= 0.01) return;
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.globalAlpha = alpha;
  L.chrome(ctx, { ...i, look: L });
  ctx.globalAlpha = 1;
}

/** How many of the 20 crowd figures a stat lights. */
export function litOf(s: Stat, unit?: string) {
  if (typeof s.lit === 'number') return Math.max(0, Math.min(20, Math.round(s.lit)));
  if (unit === '%') return Math.max(0, Math.min(20, Math.round((s.value / 100) * 20)));
  return 0;
}
/** Spread-out order in which crowd figures light up. */
export const LIT_ORDER = [0, 12, 6, 18, 3, 15, 9, 1, 13, 7, 19, 4, 16, 10, 2, 14, 8, 17, 5, 11];
