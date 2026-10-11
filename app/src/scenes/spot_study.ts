// SPOT_STUDY — "In one study, students walked into a room wearing an embarrassing T-shirt." /
// "They guessed half the room noticed." / "The real number? About a quarter."
// 1. A room of twenty pixel students pops in, all on their phones. The avatar walks in from the
//    left; on "embarrassing" his shirt pixel-wipes into an acid tee with a heart, he blushes.
// 2. "half the room noticed": ten of them look up (signal outline, '!'); GUESSED rolls to 50%.
// 3. "About a quarter": five go back to their phones; ACTUAL rolls down to 23%, 50% is struck out.
import type * as THREE from 'three';
import { Scene, type Frame, type PostOverrides } from '../engine/scene';
import { Layer2D } from '../engine/gl';
import { rgba } from '../engine/palette';
import { F, font } from '../engine/type';
import { type Line, type Word } from '../engine/lyrics';
import { clamp, ease, prog, pulse, noise1, hash } from '../engine/util';
import { Cam2D, gridPass, setGrid, drawKaraoke, lineOf, wordOf, label, setWorld, type KWord } from './_vo';
import { drawAvatar, blinkAt, drawPerson, wrapRows } from './_spot';

const AX = -650, AY = 570, AS = 12;
const COLS = 5, ROWS = 4, CX0 = -250, CW = 190, CY0 = -150, CH = 160, PS = 9;
// who looks up on "half" (10) and who keeps looking on "a quarter" (5)
const HALF = [0, 2, 4, 6, 8, 11, 13, 15, 17, 19];
const QUARTER = [2, 6, 11, 15, 19];

export default class SpotStudy extends Scene {
  cam = new Cam2D();
  grid = gridPass(24, 96);
  ui = new Layer2D();
  kw: KWord[] = [];
  L3!: Line; L4!: Line; L5!: Line;
  w: Record<string, Word> = {};

  override init() {
    const ly = this.ctx.lyrics;
    this.L3 = lineOf(ly, 'In one study');
    this.L4 = lineOf(ly, 'They guessed');
    this.L5 = lineOf(ly, 'The real number');
    const w = this.w;
    w.study = wordOf(this.L3, 'study,');
    w.walked = wordOf(this.L3, 'walked');
    w.students = wordOf(this.L3, 'students');
    w.room = wordOf(this.L3, 'room');
    w.embarrassing = wordOf(this.L3, 'embarrassing');
    w.shirt = wordOf(this.L3, 'T-shirt.');
    w.guessed = wordOf(this.L4, 'guessed');
    w.half = wordOf(this.L4, 'half');
    w.noticed = wordOf(this.L4, 'noticed.');
    w.real = wordOf(this.L5, 'real');
    w.about = wordOf(this.L5, 'About');
    w.quarter = wordOf(this.L5, 'quarter.');
    const fam = F.archivo(90, 800);
    this.kw.push(...wrapRows(this.L3.words, -900, -440, 64, fam, 'l3', 1800, 1.08).words);
    this.kw.push(...wrapRows(this.L4.words, -900, -440, 64, fam, 'l4', 1800).words);
    this.kw.push(...wrapRows(this.L5.words, -900, -440, 64, fam, 'l5', 1800).words);
    const K = this.cam;
    K.key(this.ctx.start, -120, 0, 1.0, 0);
    K.key(w.shirt!.end, -60, 10, 1.03, 0, ease.inOutCubic);
    K.key(w.guessed!.start + 0.3, 0, 0, 1.0, 0, ease.outExpo);
    K.key(this.ctx.end, 10, 0, 1.03, 0, ease.linear);
  }

  groupAlpha(g: string, t: number) {
    const i = (l: Line, n: Line | null) => prog(t, l.start - 0.3, l.start - 0.1) * (n ? 1 - prog(t, n.start - 0.25, n.start - 0.1) : 1);
    if (g === 'l3') return i(this.L3, this.L4);
    if (g === 'l4') return i(this.L4, this.L5);
    return i(this.L5, null);
  }

  override render(f: Frame, out: THREE.WebGLRenderTarget): PostOverrides {
    const { renderer, comp } = this.ctx;
    const t = f.t, w = this.w;
    const c = this.cam.at(t);
    setGrid(this.grid, c, { reveal: [0, 0, 1e5], ink: 0.8 });
    this.grid.render(renderer, out);
    const U = this.ui; U.clear();
    const ctx = U.ctx;
    // the study credit
    if (t > w.study!.start) {
      const a = prog(t, w.study!.start, w.study!.start + 0.25);
      setWorld(ctx, c, 0, 0);
      label(ctx, 'GILOVICH, MEDVEC & SAVITSKY · CORNELL · 2000'.slice(0, Math.floor(a * 44)), -300, -300, { size: 15, col: rgba('ash', 0.9) });
      ctx.setTransform(1, 0, 0, 1, 0, 0);
    }
    // the room
    const tRoom = w.students!.start + 0.1;
    const tHalf = w.half!.start, tQ = w.about!.start;
    for (let r = 0; r < ROWS; r++) for (let k = 0; k < COLS; k++) {
      const i = r * COLS + k;
      const x = CX0 + k * CW + (r % 2 ? 22 : -10), y = CY0 + r * CH;
      const ti = tRoom - 0.25 + hash(i, 9) * 0.35;
      const sc = ease.outBack(prog(t, ti, ti + 0.22));
      const ih = HALF.indexOf(i);
      const tUp = ih >= 0 ? tHalf + ih * 0.035 : 1e9;
      const iq = QUARTER.indexOf(i);
      const tDown = ih >= 0 && iq < 0 ? tQ + 0.05 + HALF.indexOf(i) * 0.04 : 1e9;
      const up = t >= tUp && t < tDown;
      const hot = up ? prog(t, tUp, tUp + 0.12) : 0;
      const dim = t >= tHalf && !up ? 0.55 : 1;
      drawPerson(ctx, c, i + 3, x, y + 63, PS, { mode: up ? 'look' : 'phone', dir: -1, hot, alpha: dim, scale: sc * (1 + 0.08 * pulse(t, tUp, 0.1)) });
    }
    // the avatar walks in
    const tw0 = w.students!.start + 0.15, tw1 = w.room!.end + 0.1;
    const wk = prog(t, tw0, tw1, ease.outQuad);
    const walking = t > tw0 && t < tw1;
    const bob = walking ? Math.abs(Math.sin((t - tw0) * 13)) * 14 : 0;
    const cringe = prog(t, w.embarrassing!.start, w.embarrassing!.start + 0.35);
    const scared = t > w.half!.start && t < tQ + 0.4;
    drawAvatar(ctx, c, -1350 + (AX + 1350) * wk, AY - bob, AS, {
      talk: 0,
      look: [1, 0],
      blink: blinkAt(t, 1.3),
      cringe,
      blush: t > w.shirt!.start && t < tQ + 0.5 ? 1 : 0,
      sweat: scared ? 1 : 0,
      brow: scared ? 1 : 0,
      happy: t > w.quarter!.end ? 1 : 0,
    });
    // the stats
    const SX = 640;
    const kG = prog(t, w.guessed!.start, w.guessed!.start + 0.2);
    if (kG > 0) {
      setWorld(ctx, c, 0, 0);
      ctx.globalAlpha = kG;
      label(ctx, 'GUESSED', SX, -150, { size: 18, col: rgba('ash', 1) });
      const v = Math.round(50 * prog(t, w.guessed!.start + 0.1, w.noticed!.start, ease.outCubic));
      ctx.font = font(F.archivo(80, 900), 120);
      ctx.fillStyle = rgba('bone', 1);
      ctx.fillText(`${v}%`, SX - 6, -30);
      // struck out once the real number lands
      const sk = prog(t, w.quarter!.end - 0.1, w.quarter!.end + 0.15, ease.outExpo);
      if (sk > 0) { ctx.fillStyle = rgba('signal', 1); ctx.fillRect(SX - 14, -78, 230 * sk, 10); }
      ctx.globalAlpha = 1;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
    }
    const kA = prog(t, w.real!.start, w.real!.start + 0.2);
    if (kA > 0) {
      setWorld(ctx, c, 0, 0);
      ctx.globalAlpha = kA;
      label(ctx, 'ACTUAL', SX, 60, { size: 18, col: rgba('signal', 1) });
      ctx.font = font(F.archivo(80, 900), 130);
      const roll = t < tQ;
      const txt = roll ? `${10 + Math.floor(hash(Math.floor(t * 20), 4) * 89)}%` : `${Math.round(50 - 27 * prog(t, tQ, w.quarter!.end, ease.outCubic))}%`;
      ctx.fillStyle = rgba(roll ? 'ash' : 'signal', 1);
      ctx.fillText(txt, SX - 8, 190);
      ctx.globalAlpha = 1;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
    }
    drawKaraoke(ctx, c, t, this.kw, { alpha: (g, tt) => this.groupAlpha(g, tt) });
    comp.draw(renderer, U.upload(), out);
    const hit = pulse(t, w.embarrassing!.start, 0.1) + 0.6 * pulse(t, tHalf, 0.1) + 0.6 * pulse(t, w.quarter!.end, 0.1);
    return {
      bloom: 0.6, bloomThreshold: 0.84, vignette: 0.42, grain: 0.06,
      zoom: 1 + 0.02 * hit,
      shake: [noise1(t * 50, 4) * 5 * hit, noise1(t * 50, 5) * 5 * hit],
      flash: 0.08 * pulse(t, this.ctx.start, 0.05),
    };
    void clamp;
  }
}
