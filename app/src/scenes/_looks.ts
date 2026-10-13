// LOOKS — visual skins for the vertical Shorts template. Each look restyles the same four plates
// (hook / name / evidence / outro): the ground (paper, board, screen…), palette, typefaces, how the
// karaoke words are set, the title lock-up, how the avatar, crowd, eyes and spotlight are drawn,
// the post-processing and a small screen-space "chrome" (case chip, status line, sheet header…).
// Palettes, type pairings and conventions are adapted from the film styles of lemo-opuscar by LemoLab
// (MIT, https://github.com/lemomo-ai/lemo-opuscar), see LICENSE.lemo-opuscar. Our plates are not theirs:
// a look borrows a style's surface and grammar, not its films.
import * as THREE from 'three';
import { FSPass, W, H } from '../engine/gl';
import { hexToLinear, clamp, hash } from '../engine/util';
import { font, measure } from '../engine/type';
import type { PostOverrides } from '../engine/scene';
import type { Cam, KWord } from './_vo';

export type GroundMode = 'graph' | 'paper' | 'whiteboard' | 'halftone' | 'blueprint' | 'crt' | 'keynote' | 'stripes' | 'sunburst' | 'swiss' | 'riso' | 'pixel' | 'crayon';
const MODES: GroundMode[] = ['graph', 'paper', 'whiteboard', 'halftone', 'blueprint', 'crt', 'keynote', 'stripes', 'sunburst', 'swiss', 'riso', 'pixel', 'crayon'];
export type PillKind = 'pill' | 'stamp' | 'box' | 'underline' | 'tag' | 'plate' | 'chip' | 'strip' | 'rule' | 'patch';
export type CrowdKind = 'figure' | 'unit' | 'pictogram' | 'silhouette' | 'outline';
export type PanelKind = 'dialog' | 'strip' | 'patch' | 'note' | null;

export interface Look {
  id: string;
  name: string;
  /** lemo-opuscar style this look is adapted from. */
  from: string;
  /** Light ground (paper/board): no bloom, fades to the paper colour instead of black. */
  light: boolean;
  ground: { mode: GroundMode; c0: string; c1: string; c2?: string; amt?: number };
  /** The ground's base colour (fades, knockouts). */
  paper: string;
  ink: string; ghost: string; hot: string; done: string;
  accent: string; accentInk: string; muted: string; second: string;
  fonts: { head: string; title: string; body: string; mono: string; headScale?: number };
  upper?: boolean;
  /** Karaoke text treatment. */
  shadow?: [number, number, string];
  stroke?: [string, number];
  boil?: number;
  panel?: PanelKind;
  pill: PillKind;
  avatar: { ring1: string; ring2: string; tint?: [string, string] };
  crowd: { kind: CrowdKind; shirts: string[]; outline: string; hot?: string; tint?: [string, string] };
  eyes: { white: string; pupil: string; outline: string };
  qmark: [string, string];
  cone: { col: string; alpha: number; op: GlobalCompositeOperation } | null;
  post: PostOverrides;
  chrome?: (ctx: CanvasRenderingContext2D, i: ChromeInfo) => void;
}
export interface ChromeInfo { t: number; p: number; no: number; title: string; credit?: string; sec: string; look: Look }

// ------------------------------------------------------------------ chrome helpers (screen space)
function txt(ctx: CanvasRenderingContext2D, s: string, x: number, y: number, fam: string, size: number, col: string, align: CanvasTextAlign = 'left', track = 0) {
  ctx.font = font(fam, size);
  ctx.letterSpacing = `${track}px`;
  ctx.fillStyle = col;
  ctx.textAlign = align;
  ctx.textBaseline = 'alphabetic';
  ctx.fillText(s, x, y);
  ctx.letterSpacing = '0px';
  ctx.textAlign = 'left';
}
const pad2 = (n: number) => String(n).padStart(3, '0');
function rrect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r); ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath();
}
export { rrect };

// ------------------------------------------------------------------ the looks
export const LOOKS: Record<string, Look> = {
  'pixel-lab': {
    id: 'pixel-lab', name: 'Pixel Lab (house look)', from: '— (Motion as Code house style)', light: false,
    ground: { mode: 'graph', c0: '#0A0A0B', c1: '#EEE9DF' }, paper: '#0A0A0B',
    ink: '#EEE9DF', ghost: '#9C978F', hot: '#FF4D12', done: '#EEE9DF', accent: '#FF4D12', accentInk: '#0A0A0B', muted: '#9C978F', second: '#FF8A3D',
    fonts: { head: 'Archivo-1000-900', title: 'Archivo-1000-900', body: 'Archivo-1000-700', mono: 'Plex-500', headScale: 1 },
    pill: 'pill', avatar: { ring1: '#0A0A0B', ring2: '#EEE9DF' },
    crowd: { kind: 'figure', shirts: ['#3b3936', '#4a4642', '#2e2d2b', '#56514b', '#423d39'], outline: '#0A0A0B' },
    eyes: { white: '#EEE9DF', pupil: '#FF4D12', outline: '#0A0A0B' }, qmark: ['#FF4D12', '#EEE9DF'],
    cone: { col: '#ffd6aa', alpha: 0.3, op: 'source-over' },
    post: { bloom: 0.6, bloomThreshold: 0.84, vignette: 0.45, grain: 0.06 },
  },
  whiteboard: {
    id: 'whiteboard', name: 'Whiteboard Explainer', from: 'whiteboard', light: true,
    ground: { mode: 'whiteboard', c0: '#F7F7F4', c1: '#B9BEC6' }, paper: '#F7F7F4',
    ink: '#23262C', ghost: '#C9CDD3', hot: '#2A5CB3', done: '#23262C', accent: '#D97757', accentInk: '#F7F7F4', muted: '#6B7078', second: '#2A5CB3',
    fonts: { head: 'ArchitectsDaughter-400', title: 'Caveat-700', body: 'ArchitectsDaughter-400', mono: 'ArchitectsDaughter-400', headScale: 1.05 },
    boil: 0.6, pill: 'underline', avatar: { ring1: '#23262C', ring2: '#FFFFFF' },
    crowd: { kind: 'figure', shirts: ['#2A5CB3', '#23262C', '#5B6470', '#2E8B57', '#7A4FB3'], outline: '#23262C' },
    eyes: { white: '#FFFFFF', pupil: '#2A5CB3', outline: '#23262C' }, qmark: ['#D97757', '#23262C'],
    cone: { col: '#F2C14E', alpha: 0.32, op: 'multiply' },
    post: { bloom: 0, halation: 0, vignette: 0.18, grain: 0.03, ca: 0.3 },
    chrome: (ctx, i) => { txt(ctx, `lesson ${i.no}`, 60, 80, 'Caveat-700', 44, '#6B7078'); ctx.fillStyle = '#D97757'; ctx.fillRect(60, 92, 120, 6); },
  },
  'data-story': {
    id: 'data-story', name: 'Data Storytelling', from: 'dataviz', light: true,
    ground: { mode: 'paper', c0: '#F5F1E8', c1: '#E7E0D2' }, paper: '#F5F1E8',
    ink: '#22262B', ghost: '#CFC8BA', hot: '#B2182B', done: '#22262B', accent: '#2166AC', accentInk: '#F5F1E8', muted: '#77706A', second: '#B2182B',
    fonts: { head: 'Newsreader-700', title: 'Newsreader-700', body: 'Newsreader-400', mono: 'JetBrainsMono-500', headScale: 1.05 },
    pill: 'rule', avatar: { ring1: '#22262B', ring2: '#F5F1E8' },
    crowd: { kind: 'unit', shirts: ['#D9D2C3'], outline: '#22262B' },
    eyes: { white: '#FFFFFF', pupil: '#B2182B', outline: '#22262B' }, qmark: ['#B2182B', '#22262B'],
    cone: { col: '#9EC3E3', alpha: 0.35, op: 'multiply' },
    post: { bloom: 0, halation: 0, vignette: 0.15, grain: 0.03, ca: 0.2 },
    chrome: (ctx, i) => {
      txt(ctx, `FIG. ${i.no}`, 60, 78, 'JetBrainsMono-500', 24, '#77706A', 'left', 4);
      ctx.fillStyle = '#22262B'; ctx.fillRect(60, 94, W - 120, 2);
    },
  },
  swiss: {
    id: 'swiss', name: 'Swiss Motion Graphics', from: 'swiss-motion', light: true,
    ground: { mode: 'swiss', c0: '#EAE9E5', c1: '#D3D1CB' }, paper: '#EAE9E5',
    ink: '#111111', ghost: '#C9C7C1', hot: '#E30613', done: '#111111', accent: '#E30613', accentInk: '#111111', muted: '#6E6C66', second: '#111111',
    fonts: { head: 'Inter-800', title: 'Inter-800', body: 'Inter-800', mono: 'Inter-500', headScale: 1 },
    pill: 'box', avatar: { ring1: '#111111', ring2: '#FFFFFF' },
    crowd: { kind: 'unit', shirts: ['#111111'], outline: '#111111' },
    eyes: { white: '#FFFFFF', pupil: '#111111', outline: '#111111' }, qmark: ['#E30613', '#111111'],
    cone: { col: '#E30613', alpha: 0.14, op: 'multiply' },
    post: { bloom: 0, halation: 0, vignette: 0.08, grain: 0.025, ca: 0.15 },
    chrome: (ctx, i) => {
      const n = ['hook', 'name', 'study', 'stat', 'takeaway'].indexOf(i.sec) + 1;
      txt(ctx, `${String(Math.max(1, n)).padStart(2, '0')} / 05`, 60, 78, 'Inter-500', 24, '#111111');
      txt(ctx, `psychology — no. ${pad2(i.no)}`, W - 60, 78, 'Inter-500', 24, '#6E6C66', 'right');
      ctx.fillStyle = '#111111'; ctx.fillRect(60, 96, W - 120, 2);
    },
  },
  dossier: {
    id: 'dossier', name: 'Halftone Dossier', from: 'halftone-dossier', light: true,
    ground: { mode: 'halftone', c0: '#F1E7D0', c1: '#2D4A8A', amt: 0.55 }, paper: '#F1E7D0',
    ink: '#1D2B4F', ghost: '#C9BFA6', hot: '#E8417F', done: '#1D2B4F', accent: '#D23A22', accentInk: '#F1E7D0', muted: '#5E6A86', second: '#F2C230',
    fonts: { head: 'BagelFatOne-400', title: 'BagelFatOne-400', body: 'LeagueSpartan-800', mono: 'JetBrainsMono-800', headScale: 0.95 },
    shadow: [7, 7, 'rgba(232,65,127,0.55)'], pill: 'stamp', avatar: { ring1: '#1D2B4F', ring2: '#F1E7D0' },
    crowd: { kind: 'figure', shirts: ['#2D4A8A', '#1D2B4F', '#5E6A86', '#2D4A8A', '#7C6A4A'], outline: '#1D2B4F' },
    eyes: { white: '#FFFFFF', pupil: '#E8417F', outline: '#1D2B4F' }, qmark: ['#E8417F', '#1D2B4F'],
    cone: { col: '#F2C230', alpha: 0.45, op: 'multiply' },
    post: { bloom: 0, halation: 0, vignette: 0.3, grain: 0.04, ca: 0.3 },
    chrome: (ctx, i) => {
      ctx.fillStyle = '#1D2B4F'; rrect(ctx, 56, 44, 330, 52, 10); ctx.fill();
      txt(ctx, `CASE No. PSY-${pad2(i.no)}`, 76, 80, 'JetBrainsMono-800', 26, '#F1E7D0');
      ctx.fillStyle = Math.floor(i.t * 1.6) % 2 ? '#D23A22' : 'rgba(210,58,34,0.25)';
      ctx.beginPath(); ctx.arc(W - 200, 70, 11, 0, Math.PI * 2); ctx.fill();
      txt(ctx, 'REC  FILE', W - 60, 80, 'JetBrainsMono-800', 26, '#1D2B4F', 'right');
    },
  },
  riso: {
    id: 'riso', name: 'Risograph Print', from: 'risograph', light: true,
    ground: { mode: 'riso', c0: '#F4EEE2', c1: '#FF48B0', c2: '#0078BF' }, paper: '#F4EEE2',
    ink: '#0078BF', ghost: '#C9D9E6', hot: '#FF48B0', done: '#0078BF', accent: '#FF48B0', accentInk: '#F4EEE2', muted: '#5C8DB5', second: '#FFE800',
    fonts: { head: 'Bricolage-800', title: 'Bricolage-800', body: 'Bricolage-800', mono: 'LeagueSpartan-600', headScale: 1 },
    shadow: [6, 5, 'rgba(255,72,176,0.5)'], pill: 'tag', avatar: { ring1: '#0078BF', ring2: '#F4EEE2' },
    crowd: { kind: 'silhouette', shirts: ['#0078BF', '#5C9FD0', '#0078BF'], outline: '#0078BF' },
    eyes: { white: '#FFFFFF', pupil: '#FF48B0', outline: '#0078BF' }, qmark: ['#FF48B0', '#0078BF'],
    cone: { col: '#FFE800', alpha: 0.55, op: 'multiply' },
    post: { bloom: 0, halation: 0, vignette: 0.12, grain: 0.06, ca: 0.6 },
  },
  blueprint: {
    id: 'blueprint', name: 'Blueprint', from: 'blueprint', light: false,
    ground: { mode: 'blueprint', c0: '#18336B', c1: '#2A58A6', c2: '#E7F0F9' }, paper: '#1F3F85',
    ink: '#E7F0F9', ghost: '#5B7DBB', hot: '#FFFFFF', done: '#E7F0F9', accent: '#D6453A', accentInk: '#E7F0F9', muted: '#9DB5DD', second: '#E7F0F9',
    fonts: { head: 'ArchitectsDaughter-400', title: 'ArchitectsDaughter-400', body: 'ArchitectsDaughter-400', mono: 'JetBrainsMono-500', headScale: 1.05 },
    pill: 'stamp', avatar: { ring1: '#E7F0F9', ring2: '#18336B', tint: ['#18336B', '#E7F0F9'] },
    crowd: { kind: 'outline', shirts: ['#E7F0F9'], outline: '#7F9CCF', hot: '#FFFFFF' },
    eyes: { white: '#E7F0F9', pupil: '#18336B', outline: '#E7F0F9' }, qmark: ['#FFFFFF', '#9DB5DD'],
    cone: { col: '#E7F0F9', alpha: 0.12, op: 'screen' },
    post: { bloom: 0.25, bloomThreshold: 0.9, halation: 0, vignette: 0.35, grain: 0.04, ca: 0.3 },
    chrome: (ctx, i) => {
      ctx.strokeStyle = '#E7F0F9'; ctx.lineWidth = 2; ctx.strokeRect(56, 38, W - 112, 62); ctx.strokeRect(62, 44, W - 124, 50);
      txt(ctx, 'PSYCH LAB', 80, 98, 'JetBrainsMono-500', 24, '#E7F0F9', 'left', 3);
      txt(ctx, `SHEET ${pad2(i.no)} · SCALE 1:1`, W - 80, 98, 'JetBrainsMono-500', 24, '#E7F0F9', 'right', 2);
    },
  },
  terminal: {
    id: 'terminal', name: 'ASCII / CRT Terminal', from: 'ascii-crt', light: false,
    ground: { mode: 'crt', c0: '#0B0906', c1: '#FFB000' }, paper: '#0B0906',
    ink: '#FFB000', ghost: '#4A3300', hot: '#FFE6A8', done: '#FFB000', accent: '#FFB000', accentInk: '#0B0906', muted: '#9C6C00', second: '#9FD3FF',
    fonts: { head: 'VT323-400', title: 'VT323-400', body: 'VT323-400', mono: 'VT323-400', headScale: 1.25 }, upper: true,
    pill: 'box', avatar: { ring1: '#FFB000', ring2: '#0B0906', tint: ['#140C00', '#FFC640'] },
    crowd: { kind: 'pictogram', shirts: ['#6B4A00'], outline: '#FFB000' },
    eyes: { white: '#FFB000', pupil: '#0B0906', outline: '#0B0906' }, qmark: ['#FFE6A8', '#FFB000'],
    cone: { col: '#FFB000', alpha: 0.12, op: 'screen' },
    post: { bloom: 0.9, bloomThreshold: 0.45, halation: 0.1, vignette: 0.55, grain: 0.05, ca: 0.8 },
    chrome: (ctx, i) => {
      txt(ctx, `PSY-TERM // LOG ${pad2(i.no)}`, 60, 80, 'VT323-400', 40, '#FFB000');
      if (Math.floor(i.t * 2) % 2) { ctx.fillStyle = '#FFB000'; ctx.fillRect(W - 92, 50, 26, 36); }
    },
  },
  keynote: {
    id: 'keynote', name: 'Dark Tech Keynote', from: 'dark-keynote', light: false,
    ground: { mode: 'keynote', c0: '#0B0C10', c1: '#26324A' }, paper: '#0B0C10',
    ink: '#F2F4F8', ghost: '#3A3F4B', hot: '#B7F34A', done: '#F2F4F8', accent: '#B7F34A', accentInk: '#0B0C10', muted: '#8A90A0', second: '#8B7CFF',
    fonts: { head: 'Inter-800', title: 'Inter-800', body: 'Inter-800', mono: 'JetBrainsMono-500', headScale: 0.98 },
    pill: 'chip', avatar: { ring1: '#0B0C10', ring2: '#F2F4F8' },
    crowd: { kind: 'pictogram', shirts: ['#3A3F4B'], outline: '#F2F4F8' },
    eyes: { white: '#F2F4F8', pupil: '#B7F34A', outline: '#0B0C10' }, qmark: ['#B7F34A', '#F2F4F8'],
    cone: { col: '#CFE0FF', alpha: 0.18, op: 'screen' },
    post: { bloom: 0.5, bloomThreshold: 0.8, halation: 0.05, vignette: 0.4, grain: 0.03, ca: 0.5 },
    chrome: (ctx, i) => txt(ctx, `psychology / ${pad2(i.no)}`, 60, 80, 'JetBrainsMono-500', 26, '#8A90A0', 'left', 2),
  },
  'game-show': {
    id: 'game-show', name: 'Game Show Flat', from: 'game-show', light: false,
    ground: { mode: 'stripes', c0: '#6A4BD8', c1: '#7A5DE8' }, paper: '#6A4BD8',
    ink: '#FFFFFF', ghost: '#9C88F0', hot: '#FFD23F', done: '#FFFFFF', accent: '#FF5DA2', accentInk: '#FFFFFF', muted: '#D9CFFF', second: '#3DDBB0',
    fonts: { head: 'Fredoka-700', title: 'Fredoka-700', body: 'Fredoka-700', mono: 'Fredoka-600', headScale: 1.05 },
    stroke: ['#1B1340', 0.16], pill: 'pill', avatar: { ring1: '#1B1340', ring2: '#FFFFFF' },
    crowd: { kind: 'figure', shirts: ['#FF5DA2', '#3DDBB0', '#FFD23F', '#4FA8FF', '#FF8A3D'], outline: '#1B1340' },
    eyes: { white: '#FFFFFF', pupil: '#1B1340', outline: '#1B1340' }, qmark: ['#FFD23F', '#FFFFFF'],
    cone: { col: '#FFF3B0', alpha: 0.35, op: 'screen' },
    post: { bloom: 0.2, bloomThreshold: 0.95, halation: 0, vignette: 0.25, grain: 0.03, ca: 0.3 },
    chrome: (ctx, i) => {
      ctx.fillStyle = '#1B1340'; rrect(ctx, 56, 40, 300, 64, 32); ctx.fill();
      ctx.fillStyle = '#FFD23F'; rrect(ctx, 50, 34, 300, 64, 32); ctx.fill();
      txt(ctx, `ROUND ${i.no}`, 200, 80, 'Fredoka-700', 36, '#1B1340', 'center');
    },
  },
  'cartoon-50s': {
    id: 'cartoon-50s', name: 'Mid-century Cartoon', from: 'midcentury-toon', light: true,
    ground: { mode: 'sunburst', c0: '#F2C14E', c1: '#F6D27A' }, paper: '#F2C14E',
    ink: '#3B2A20', ghost: '#D9A93A', hot: '#E4572E', done: '#3B2A20', accent: '#2A9D8F', accentInk: '#FBF3DF', muted: '#7A5A3A', second: '#E4572E',
    fonts: { head: 'LeagueSpartan-800', title: 'LeagueSpartan-800', body: 'LeagueSpartan-600', mono: 'LeagueSpartan-600', headScale: 1 },
    shadow: [5, 5, 'rgba(228,87,46,0.45)'], pill: 'plate', avatar: { ring1: '#3B2A20', ring2: '#FBF3DF' },
    crowd: { kind: 'figure', shirts: ['#2A9D8F', '#E4572E', '#3B6E8F', '#8F5A3B', '#2A9D8F'], outline: '#3B2A20' },
    eyes: { white: '#FFFFFF', pupil: '#3B2A20', outline: '#3B2A20' }, qmark: ['#E4572E', '#3B2A20'],
    cone: { col: '#FFF6D8', alpha: 0.4, op: 'screen' },
    post: { bloom: 0, halation: 0, vignette: 0.3, grain: 0.045, ca: 0.3 },
  },
  'spy-noir': {
    id: 'spy-noir', name: '60s Spy Titles', from: 'spy-titles', light: false,
    ground: { mode: 'paper', c0: '#1B1714', c1: '#2A231E' }, paper: '#1B1714',
    ink: '#EFE4C9', ghost: '#4A4038', hot: '#E2A52A', done: '#EFE4C9', accent: '#D23A22', accentInk: '#EFE4C9', muted: '#A89B80', second: '#E2A52A',
    fonts: { head: 'LeagueSpartan-800', title: 'LeagueSpartan-800', body: 'LeagueSpartan-600', mono: 'LeagueSpartan-600', headScale: 1 }, upper: true,
    pill: 'strip', avatar: { ring1: '#1B1714', ring2: '#EFE4C9' },
    crowd: { kind: 'silhouette', shirts: ['#0E0C0A'], outline: '#D23A22' },
    eyes: { white: '#EFE4C9', pupil: '#D23A22', outline: '#1B1714' }, qmark: ['#E2A52A', '#EFE4C9'],
    cone: { col: '#D23A22', alpha: 0.32, op: 'screen' },
    post: { bloom: 0.15, bloomThreshold: 0.95, halation: 0, vignette: 0.35, grain: 0.05, ca: 0.3 },
  },
  crayon: {
    id: 'crayon', name: 'Crayon Picture Book', from: 'crayon-book', light: true,
    ground: { mode: 'crayon', c0: '#FBF5E6', c1: '#E8D9B8' }, paper: '#FBF5E6',
    ink: '#1F2A44', ghost: '#D8CDB4', hot: '#E2725B', done: '#1F2A44', accent: '#2BA59A', accentInk: '#FBF5E6', muted: '#6E6A5E', second: '#F2B134',
    fonts: { head: 'PatrickHand-400', title: 'PatrickHand-400', body: 'PatrickHand-400', mono: 'PatrickHand-400', headScale: 1.15 },
    boil: 1, pill: 'patch', avatar: { ring1: '#1F2A44', ring2: '#FFFFFF' },
    crowd: { kind: 'figure', shirts: ['#E2725B', '#2BA59A', '#F2B134', '#4E7AC7', '#9B6BB5'], outline: '#1F2A44' },
    eyes: { white: '#FFFFFF', pupil: '#1F2A44', outline: '#1F2A44' }, qmark: ['#E2725B', '#1F2A44'],
    cone: { col: '#F2B134', alpha: 0.35, op: 'multiply' },
    post: { bloom: 0, halation: 0, vignette: 0.2, grain: 0.05, ca: 0.2 },
  },
  'pixel-quest': {
    id: 'pixel-quest', name: '16-bit Pixel RPG', from: 'pixel-rpg', light: false,
    ground: { mode: 'pixel', c0: '#2B1D4F', c1: '#E8735A', c2: '#1A1230' }, paper: '#2B1D4F',
    ink: '#FFFFFF', ghost: '#7E70A8', hot: '#FFD447', done: '#FFFFFF', accent: '#3A64C8', accentInk: '#FFFFFF', muted: '#C9C0E8', second: '#7CE07C',
    fonts: { head: 'Silkscreen-400', title: 'Silkscreen-700', body: 'Silkscreen-400', mono: 'Silkscreen-400', headScale: 0.82 }, upper: true,
    panel: 'dialog', pill: 'plate', avatar: { ring1: '#1A1230', ring2: '#FFFFFF' },
    crowd: { kind: 'figure', shirts: ['#3A64C8', '#7CE07C', '#C8503A', '#8A5CC8', '#D8A030'], outline: '#1A1230' },
    eyes: { white: '#FFFFFF', pupil: '#1A1230', outline: '#1A1230' }, qmark: ['#FFD447', '#FFFFFF'],
    cone: { col: '#FFE7A8', alpha: 0.25, op: 'screen' },
    post: { bloom: 0.3, bloomThreshold: 0.9, halation: 0, vignette: 0.3, grain: 0.0, ca: 0 },
    chrome: (ctx, i) => {
      txt(ctx, `LV ${i.no}`, 60, 74, 'Silkscreen-700', 30, '#FFFFFF');
      ctx.fillStyle = '#1A1230'; ctx.fillRect(220, 50, 420, 28);
      ctx.fillStyle = '#7CE07C'; ctx.fillRect(226, 56, 408 * clamp(i.p), 16);
      txt(ctx, 'XP', 660, 74, 'Silkscreen-400', 26, '#C9C0E8');
    },
  },
  'one-line': {
    id: 'one-line', name: 'One-line Drawing', from: 'one-line', light: true,
    ground: { mode: 'paper', c0: '#F6F2EA', c1: '#ECE6DA' }, paper: '#F6F2EA',
    ink: '#1D1A17', ghost: '#D8D2C6', hot: '#C8363A', done: '#1D1A17', accent: '#C8363A', accentInk: '#F6F2EA', muted: '#7A746A', second: '#1D1A17',
    fonts: { head: 'Caveat-700', title: 'Sacramento-400', body: 'Caveat-600', mono: 'Caveat-600', headScale: 1.2 },
    pill: 'underline', avatar: { ring1: '#1D1A17', ring2: '#F6F2EA', tint: ['#1D1A17', '#F6F2EA'] },
    crowd: { kind: 'outline', shirts: ['#1D1A17'], outline: '#1D1A17' },
    eyes: { white: '#F6F2EA', pupil: '#1D1A17', outline: '#1D1A17' }, qmark: ['#C8363A', '#1D1A17'],
    cone: { col: '#C8363A', alpha: 0.08, op: 'multiply' },
    post: { bloom: 0, halation: 0, vignette: 0.12, grain: 0.03, ca: 0.15 },
  },
};
export const LOOK_IDS = Object.keys(LOOKS);
export const lookOf = (id?: string) => LOOKS[id ?? ''] ?? LOOKS['pixel-lab']!;

// ------------------------------------------------------------------ ground pass
const lin = (h: string) => new THREE.Vector3(...hexToLinear(h));
export function groundPass() {
  return new FSPass(/* glsl */ `
    uniform vec4 uCam; uniform vec2 uRes; uniform float uMode, uTime, uAmt;
    uniform vec3 uC0, uC1, uC2;
    float bayer4(vec2 p) {
      ivec2 q = ivec2(mod(p, 4.0));
      int i = q.x + q.y * 4;
      int m[16] = int[16](0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5);
      return (float(m[i]) + 0.5) / 16.0;
    }
    void main() {
      vec2 sp = vec2(vUv.x, 1.0 - vUv.y) * uRes;        // screen px, y down
      vec2 d = sp - 0.5 * uRes;
      float c = cos(-uCam.w), s = sin(-uCam.w);
      d = vec2(c * d.x - s * d.y, s * d.x + c * d.y) / uCam.z;
      vec2 p = uCam.xy + d;                              // world px
      vec2 uv = sp / uRes;
      int m = int(uMode + 0.5);
      vec3 col = uC0;
      float grain = hash12(floor(sp) + floor(uTime * 24.0) * 17.0) - 0.5;
      if (m == 0) { // graph paper (dark)
        vec2 g1 = abs(fract(p / 24.0 + 0.5) - 0.5) * 24.0 * uCam.z;
        vec2 g4 = abs(fract(p / 96.0 + 0.5) - 0.5) * 96.0 * uCam.z;
        float mi = max(1.0 - smoothstep(0.0, 1.0, g1.x), 1.0 - smoothstep(0.0, 1.0, g1.y));
        float ma = max(1.0 - smoothstep(0.25, 1.25, g4.x), 1.0 - smoothstep(0.25, 1.25, g4.y));
        col += (uC1 - uC0) * (mi * 0.011 + ma * 0.03);
      } else if (m == 1 || m == 12) { // paper / crayon tooth
        float mott = fbm(p * 0.0025, 4);
        col *= 1.0 + 0.035 * mott;
        col = mix(col, uC1, 0.25 * smoothstep(0.2, 0.9, fbm(p * 0.006 + 3.1, 3)));
        if (m == 12) {
          float tooth = snoise(p * vec2(0.9, 0.35));
          col *= 1.0 - 0.045 * smoothstep(0.35, 0.9, tooth);
        }
        col *= 1.0 + 0.02 * grain;
      } else if (m == 2) { // whiteboard: ghost smudges + slow sheen
        float gh = smoothstep(0.35, 0.85, fbm(p * vec2(0.004, 0.012) + 7.0, 4));
        col = mix(col, uC1, 0.10 * gh);
        float sheen = exp(-pow((uv.x + uv.y * 0.6 - 0.2 - 0.05 * sin(uTime * 0.2)) * 5.0, 2.0));
        col += 0.035 * sheen;
        col *= 1.0 + 0.012 * grain;
      } else if (m == 3) { // halftone paper: multiplied dot screen where a slow field is dense
        col *= 1.0 + 0.04 * fbm(p * 0.003, 4);
        float dens = smoothstep(0.0, 0.8, fbm(p * 0.0018 + vec2(0.0, uTime * 0.02), 3)) * uAmt;
        vec2 q = mat2(0.966, -0.259, 0.259, 0.966) * p / 14.0;
        float dd = length(fract(q) - 0.5);
        float dot = 1.0 - smoothstep(dens * 0.42 - 0.03, dens * 0.42 + 0.03, dd);
        col = mix(col, col * uC1 * 1.6, dot * 0.35);
        col *= 1.0 - 0.18 * smoothstep(0.55, 1.1, length((uv - 0.5) * vec2(1.0, 0.7)));
        col *= 1.0 + 0.03 * grain;
      } else if (m == 4) { // blueprint: uneven Prussian blue + drafting grid
        float k = 0.5 + 0.5 * fbm(p * 0.0016, 4);
        col = mix(uC0, uC1, k);
        col *= 1.0 - 0.12 * smoothstep(0.4, 1.0, fbm(p * 0.01 + 5.0, 3));
        vec2 g1 = abs(fract(p / 40.0 + 0.5) - 0.5) * 40.0 * uCam.z;
        vec2 g4 = abs(fract(p / 200.0 + 0.5) - 0.5) * 200.0 * uCam.z;
        float mi = max(1.0 - smoothstep(0.0, 1.0, g1.x), 1.0 - smoothstep(0.0, 1.0, g1.y));
        float ma = max(1.0 - smoothstep(0.2, 1.4, g4.x), 1.0 - smoothstep(0.2, 1.4, g4.y));
        col = mix(col, uC2, mi * 0.06 + ma * 0.16);
        col *= 1.0 + 0.04 * grain;
      } else if (m == 5) { // CRT glass: scanlines, phosphor haze, curved vignette
        vec2 cc = (uv - 0.5) * vec2(1.0, 1.15);
        float glow = exp(-dot(cc, cc) * 3.0);
        col = uC0 + uC1 * 0.035 * glow;
        float scan = 0.5 + 0.5 * sin(sp.y * PI / 3.0);
        col *= 0.82 + 0.18 * scan;
        col *= 1.0 - smoothstep(0.42, 0.62, length(cc * vec2(1.0, 0.9)));
        col += uC1 * 0.012 * grain;
      } else if (m == 6) { // keynote stage: dark, one soft cool light from above
        vec2 cc = (uv - vec2(0.5, 0.1)) * vec2(1.4, 1.0);
        col = mix(uC0, uC1, 0.55 * exp(-dot(cc, cc) * 2.2));
        col += (bayer4(sp) - 0.5) / 255.0;
      } else if (m == 7) { // game show: diagonal stripes drifting
        float st = step(0.5, fract((p.x + p.y) / 140.0 - uTime * 0.25));
        col = mix(uC0, uC1, st);
        col *= 1.0 - 0.2 * smoothstep(0.55, 1.1, length((uv - 0.5) * vec2(1.0, 0.75)));
      } else if (m == 8) { // sunburst
        vec2 o = vec2(0.5 * uRes.x, 0.28 * uRes.y);
        float a = atan(sp.y - o.y, sp.x - o.x) + uTime * 0.05;
        float st = step(0.5, fract(a / (TAU / 28.0)));
        col = mix(uC0, uC1, st * 0.9);
        col *= 1.0 + 0.04 * fbm(p * 0.004, 3);
        col *= 1.0 + 0.03 * grain;
      } else if (m == 9) { // swiss page: 6-column hairline grid
        float colw = (uRes.x - 120.0) / 6.0;
        float gx = abs(fract((sp.x - 60.0) / colw + 0.5) - 0.5) * colw;
        float line = (1.0 - smoothstep(0.0, 1.0, gx)) * step(60.0, sp.x) * step(sp.x, uRes.x - 60.0);
        col = mix(col, uC1, line * 0.8);
        col *= 1.0 + 0.012 * grain;
      } else if (m == 10) { // riso: warm paper, grain, faint ink blotches, pinholes
        col *= 1.0 + 0.03 * fbm(p * 0.003, 4);
        col = mix(col, col * mix(vec3(1.0), uC1, 0.5), 0.10 * smoothstep(0.45, 0.95, fbm(p * 0.002 + 9.0, 3)));
        col = mix(col, col * mix(vec3(1.0), uC2, 0.5), 0.08 * smoothstep(0.45, 0.95, fbm(p * 0.0022 - 4.0, 3)));
        col *= 1.0 + 0.06 * grain;
      } else if (m == 11) { // pixel sky: 6 px pixels, banded ordered-dither gradient, far hills
        vec2 px = floor(sp / 6.0);
        float g = clamp(px.y * 6.0 / uRes.y, 0.0, 1.0);
        float bands = 7.0;
        float lv = floor(g * bands + bayer4(px));
        col = mix(uC0, uC1, clamp(lv / bands, 0.0, 1.0));
        float star = step(0.996, hash12(px)) * (1.0 - g) * step(0.5, fract(uTime * 0.7 + hash12(px + 3.0)));
        col += star * 0.6;
        float hill = uRes.y * (0.80 + 0.04 * sin(px.x * 0.11) + 0.02 * sin(px.x * 0.37 + 1.0));
        col = mix(col, uC2, step(hill, px.y * 6.0));
      }
      fragColor = vec4(col, 1.0);
    }`, {
    uCam: { value: new THREE.Vector4(W / 2, H / 2, 1, 0) }, uRes: { value: new THREE.Vector2(W, H) },
    uMode: { value: 0 }, uTime: { value: 0 }, uAmt: { value: 0.5 },
    uC0: { value: new THREE.Vector3() }, uC1: { value: new THREE.Vector3() }, uC2: { value: new THREE.Vector3() },
  });
}
export function setGround(g: FSPass, L: Look, c: Cam, t: number) {
  (g.u.uCam!.value as THREE.Vector4).set(c.cx, c.cy, c.z, c.roll);
  g.u.uMode!.value = MODES.indexOf(L.ground.mode);
  g.u.uTime!.value = t;
  g.u.uAmt!.value = L.ground.amt ?? 0.5;
  (g.u.uC0!.value as THREE.Vector3).copy(lin(L.ground.c0));
  (g.u.uC1!.value as THREE.Vector3).copy(lin(L.ground.c1));
  (g.u.uC2!.value as THREE.Vector3).copy(lin(L.ground.c2 ?? L.ground.c1));
}

// ------------------------------------------------------------------ colour helpers
function hexRGB(h: string): [number, number, number] {
  const n = parseInt(h.replace('#', ''), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}
const tintCache = new Map<string, string>();
/** Duotone remap of a colour by its luminance: dark → a, light → b. */
export function duotone(hex: string, a: string, b: string) {
  const key = hex + a + b;
  let r = tintCache.get(key);
  if (!r) {
    const [R, G, B] = hexRGB(hex);
    const l = Math.pow(clamp((0.2126 * R + 0.7152 * G + 0.0722 * B) / 255), 0.85);
    const A = hexRGB(a), Bc = hexRGB(b);
    r = '#' + [0, 1, 2].map((i) => Math.round(A[i]! + (Bc[i]! - A[i]!) * l).toString(16).padStart(2, '0')).join('');
    tintCache.set(key, r);
  }
  return r;
}

// ------------------------------------------------------------------ post, fades and panels
/** Merge the look's post settings into a plate's overrides; light looks fade to paper (drawn by the plate). */
export function lookPost(L: Look, o: PostOverrides): PostOverrides {
  const out: PostOverrides = { ...o, ...L.post };
  for (const k of ['zoom', 'shake', 'flash'] as const) if (o[k] !== undefined) (out as any)[k] = o[k];
  if (!L.light && o.fade !== undefined) out.fade = o.fade;
  if (L.light) { out.fade = 0; if (out.flash) out.flash = (out.flash as number) * 0.3; }
  return out;
}
/** Screen-space fade to the paper colour (light looks) — call last in the UI layer. */
export function paperFade(ctx: CanvasRenderingContext2D, L: Look, k: number) {
  if (!L.light || k <= 0.002) return;
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.globalAlpha = clamp(k);
  ctx.fillStyle = L.paper;
  ctx.fillRect(0, 0, W, H);
  ctx.globalAlpha = 1;
}

/** Bounding box (world) of a set of karaoke words. */
export function kwBox(kws: KWord[]) {
  let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9;
  for (const k of kws) {
    x0 = Math.min(x0, k.x); x1 = Math.max(x1, k.x + (k.lay.width / 100) * k.size);
    y0 = Math.min(y0, k.y - k.size * 0.82); y1 = Math.max(y1, k.y + k.size * 0.25);
  }
  return { x0, y0, x1, y1 };
}
/** A panel behind a text block (pixel dialog box, paper strip, knock-out patch, drawing note). */
export function drawPanel(ctx: CanvasRenderingContext2D, L: Look, c: Cam, box: { x0: number; y0: number; x1: number; y1: number }, alpha: number, setWorld: (ctx: CanvasRenderingContext2D, c: Cam, x?: number, y?: number) => void) {
  if (!L.panel || alpha <= 0.01) return;
  const pad = 34, x = box.x0 - pad, y = box.y0 - pad, w = box.x1 - box.x0 + pad * 2, h = box.y1 - box.y0 + pad * 2;
  setWorld(ctx, c, 0, 0);
  ctx.globalAlpha = alpha;
  if (L.panel === 'dialog') {
    ctx.fillStyle = '#1A1230'; ctx.fillRect(x - 12, y - 12, w + 24, h + 24);
    ctx.fillStyle = '#FFFFFF'; ctx.fillRect(x - 6, y - 6, w + 12, h + 12);
    ctx.fillStyle = '#9AA0C8'; ctx.fillRect(x - 2, y - 2, w + 4, h + 4);
    ctx.fillStyle = '#20307A'; ctx.fillRect(x, y, w, h);
    ctx.fillStyle = '#2A3D92';
    for (let yy = y; yy < y + h; yy += 12) ctx.fillRect(x, yy, w, 6);
  } else {
    ctx.fillStyle = L.paper;
    rrect(ctx, x, y, w, h, 10); ctx.fill();
  }
  ctx.globalAlpha = 1;
  ctx.setTransform(1, 0, 0, 1, 0, 0);
}

/** Per-frame jitter for boiling looks (on twos). */
export function boilJitter(L: Look, t: number, i: number): [number, number] {
  if (!L.boil) return [0, 0];
  const f = Math.floor(t * 12);
  return [(hash(i, f, 3) - 0.5) * 3 * L.boil, (hash(i, f, 4) - 0.5) * 3 * L.boil];
}

export { measure };
