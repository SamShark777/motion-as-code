// SPOT_CLOSE — "Everyone else is too busy starring in their own movie." / "So relax. Nobody's
// watching as closely as you think."
// 1. A wide stage of people, each on their phone; on "starring" every one of them gets a
//    spotlight of their own (the avatar's is no bigger); on "movie" film-strip bands slide in.
// 2. "So relax.": the crowd dims away, the big avatar rises back with happy eyes; the line sets
//    big beside him; he winks on "think." and the title signs off.
import type * as THREE from 'three';
import { Scene, type Frame, type PostOverrides } from '../engine/scene';
import { Layer2D, W, H } from '../engine/gl';
import { rgba } from '../engine/palette';
import { F } from '../engine/type';
import { type Line, type Word } from '../engine/lyrics';
import { clamp, ease, prog, pulse, noise1, hash } from '../engine/util';
import { Cam2D, gridPass, setGrid, drawKaraoke, lineOf, wordOf, type KWord } from './_vo';
import { drawAvatar, lipsync, blinkAt, drawPerson, drawCone, lightOn, drawTitle, wrapRows } from './_spot';

const CROWD: [number, number][] = [[-780, 60], [-540, 140], [-300, 60], [300, 60], [540, 140], [780, 60], [-680, 330], [-420, 380], [420, 380], [680, 330]];
const AX = -470, AY = 570, AS = 16;

export default class SpotClose extends Scene {
  cam = new Cam2D();
  grid = gridPass(24, 96);
  ui = new Layer2D();
  kw6: KWord[] = []; kw7: KWord[] = [];
  L6!: Line; L7!: Line;
  w: Record<string, Word> = {};

  override init() {
    const ly = this.ctx.lyrics;
    this.L6 = lineOf(ly, 'Everyone else');
    this.L7 = lineOf(ly, 'So relax');
    const w = this.w;
    w.busy = wordOf(this.L6, 'busy');
    w.starring = wordOf(this.L6, 'starring');
    w.movie = wordOf(this.L6, 'movie.');
    w.relax = wordOf(this.L7, 'relax.');
    w.nobody = wordOf(this.L7, "Nobody’s");
    w.think = wordOf(this.L7, 'think.');
    this.kw6 = wrapRows(this.L6.words, -900, -400, 74, F.archivo(90, 800), 'l6', 1800).words;
    const fam = F.archivo(80, 900);
    const so = this.L7.words.slice(0, 2), rest = this.L7.words.slice(2);
    this.kw7 = [
      ...wrapRows(so, -80, -190, 150, fam, 'l7', 900).words,
      ...wrapRows(rest, -80, -40, 84, F.archivo(90, 800), 'l7', 900, 1.08).words,
    ];
    const K = this.cam;
    K.key(this.ctx.start, 0, 40, 1.08, 0);
    K.key(w.movie!.end, 0, 20, 1.0, 0, ease.linear);
    K.key(this.L7.start + 0.4, 0, 0, 1.0, 0, ease.outExpo);
    K.key(this.ctx.end, -30, 0, 1.04, 0, ease.linear);
  }

  override render(f: Frame, out: THREE.WebGLRenderTarget): PostOverrides {
    const { renderer, comp } = this.ctx;
    const t = f.t, w = this.w;
    const c = this.cam.at(t);
    const t7 = this.L7.start - 0.12;
    const crowdA = 1 - prog(t, t7, t7 + 0.35);
    setGrid(this.grid, c, { reveal: [0, 0, 1e5], ink: 0.55 + 0.25 * (1 - crowdA) });
    this.grid.render(renderer, out);
    const U = this.ui; U.clear();
    const ctx = U.ctx;
    if (crowdA > 0) {
      // own spotlights
      const all: [number, number, number][] = [...CROWD.map(([x, y], i) => [x, y, i] as [number, number, number]), [0, 200, -1]];
      for (const [x, y, i] of all) {
        const ts = w.starring!.start + (i < 0 ? 0.12 : hash(i, 2) * 0.35);
        const k = lightOn(t, ts) * crowdA;
        drawCone(ctx, c, x, y - 400, y + 4, 26, 230, k * 0.8);
      }
      for (const [x, y, i] of all) {
        const ti = this.ctx.start - 0.1 + (i < 0 ? 0 : 0.05 + hash(i, 5) * 0.25);
        const sc = ease.outBack(prog(t, ti, ti + 0.22));
        if (i < 0) {
          drawAvatar(ctx, c, x, y + 6, 4.2, { talk: lipsync(this.ctx.audio, t), blink: blinkAt(t, 0.7), look: [0, 1], alpha: crowdA * clamp(sc) });
        } else {
          drawPerson(ctx, c, i + 11, x, y, 11, { mode: 'phone', alpha: crowdA, scale: sc });
        }
      }
      // film-strip bands on "movie"
      const fb = ease.outExpo(prog(t, w.movie!.start, w.movie!.start + 0.35)) * crowdA;
      if (fb > 0) {
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        const bh = 70;
        for (const top of [true, false]) {
          const y0 = top ? -bh + bh * fb : H - bh * fb;
          ctx.fillStyle = rgba('ink2', 1);
          ctx.fillRect(0, y0, W, bh);
          ctx.fillStyle = rgba('bone', 0.35);
          const off = (t * 220) % 60;
          for (let x = -60 + (top ? off : -off); x < W + 60; x += 60) ctx.fillRect(x, y0 + bh / 2 - 11, 30, 22);
        }
      }
    }
    // the big avatar rises back
    const rise = ease.outBack(prog(t, t7 + 0.05, t7 + 0.5));
    if (rise > 0.002) {
      const tl = lightOn(t, t7 + 0.3);
      drawCone(ctx, c, AX, -560, AY - 40, 120, 760, tl * 0.6 * (1 - prog(t, w.think!.end, w.think!.end + 0.6)));
      drawAvatar(ctx, c, AX, AY + (1 - rise) * 900, AS, {
        talk: lipsync(this.ctx.audio, t),
        happy: t > w.relax!.start && t < w.nobody!.start ? 1 : 0,
        wink: t > w.think!.start + 0.08 && t < w.think!.end + 0.5 ? 1 : 0,
        blink: blinkAt(t, 2.2),
        look: [0, 0],
      });
    }
    drawKaraoke(ctx, c, t, this.kw6, { alpha: () => crowdA });
    const endT = this.L7.end + 0.15;
    drawKaraoke(ctx, c, t, this.kw7, { alpha: (_, tt) => 1 - 0.6 * prog(tt, endT, endT + 0.3), pop: 0.06 });
    // sign-off
    const kT = prog(t, endT, endT + 0.3);
    if (kT > 0) drawTitle(ctx, c, -80, 380, 96, kT, prog(t, endT + 0.06, endT + 0.36), prog(t, endT + 0.14, endT + 0.44));
    comp.draw(renderer, U.upload(), out);
    const hit = 0.7 * pulse(t, w.starring!.start, 0.1) + 0.6 * pulse(t, w.movie!.start, 0.1) + 0.6 * pulse(t, w.relax!.start, 0.12);
    return {
      bloom: 0.6, bloomThreshold: 0.84, vignette: 0.45, grain: 0.06,
      zoom: 1 + 0.02 * hit,
      shake: [noise1(t * 50, 4) * 4 * hit, noise1(t * 50, 5) * 4 * hit],
      fade: prog(t, this.ctx.end - 0.35, this.ctx.end),
    };
  }
}
