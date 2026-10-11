// SPOT_OPEN — "Ever feel like everyone is staring at you?" / "Psychologists have a name for that:
// the spotlight effect."
// 1. The avatar pops up out of the dark. Pairs of pixel eyes open around him, one per word of
//    "everyone is staring at you", signal pupils all turned on him; his eyes dart, a sweat drop.
// 2. The question flies off; "Psychologists have a name for that:" types in small; a theatre light
//    clicks on above him (two flickers), and the title slams in word by word: THE / SPOTLIGHT / [EFFECT].
import type * as THREE from 'three';
import { Scene, type Frame, type PostOverrides } from '../engine/scene';
import { Layer2D } from '../engine/gl';
import { F } from '../engine/type';
import { type Line, type Word } from '../engine/lyrics';
import { clamp, ease, prog, pulse, noise1, hash } from '../engine/util';
import { Cam2D, gridPass, setGrid, drawKaraoke, lineOf, wordOf, type KWord } from './_vo';
import { drawAvatar, avatarHead, lipsync, blinkAt, drawEyePair, drawCone, lightOn, drawTitle, wrapRows } from './_spot';

const AX = -470, AY = 570, AS = 16;
const EYES: [number, number][] = [
  [-860, -400], [-120, -430], [-700, -470], [-300, -330], [880, -460], [-900, 30],
  [820, 430], [-60, 440], [300, 470], [-900, -180], [620, -470], [-150, -170], [880, 140], [-50, 300],
];

export default class SpotOpen extends Scene {
  cam = new Cam2D();
  grid = gridPass(24, 96);
  ui = new Layer2D();
  kw1: KWord[] = []; kw2: KWord[] = [];
  L1!: Line; L2!: Line;
  w: Record<string, Word> = {};
  eyeT: number[] = [];

  override init() {
    const ly = this.ctx.lyrics;
    this.L1 = lineOf(ly, 'Ever feel like');
    this.L2 = lineOf(ly, 'Psychologists');
    const w = this.w;
    w.everyone = wordOf(this.L1, 'everyone');
    w.you = wordOf(this.L1, 'you?');
    w.staring = wordOf(this.L1, 'staring');
    w.the = wordOf(this.L2, 'the');
    w.spotlight = wordOf(this.L2, 'spotlight');
    w.effect = wordOf(this.L2, 'effect.');
    w.that = wordOf(this.L2, 'that:');
    const fam = F.archivo(80, 900);
    this.kw1 = wrapRows(this.L1.words, -80, -150, 128, fam, 'l1', 900, 1.0, { breaks: [3, 5] }).words;
    const kicker = this.L2.words.slice(0, this.L2.words.indexOf(w.the!));
    this.kw2 = wrapRows(kicker, -80, -300, 50, F.archivo(100, 700), 'l2', 1000, 1.12).words;
    // one pair of eyes per beat from "everyone" to the end of "you?"
    const t0 = w.everyone!.start - 0.05, t1 = w.you!.end;
    this.eyeT = EYES.map((_, i) => t0 + ((t1 - t0) * i) / EYES.length + hash(i, 3) * 0.08);
    const K = this.cam;
    K.key(this.ctx.start, 0, 0, 1.0, 0);
    K.key(this.L1.end, 30, 10, 1.04, 0.003, ease.linear);
    K.key(w.spotlight!.start, -40, 0, 1.0, 0, ease.outExpo);
    K.key(this.ctx.end, -50, 0, 1.03, 0, ease.linear);
  }

  override render(f: Frame, out: THREE.WebGLRenderTarget): PostOverrides {
    const { renderer, comp } = this.ctx;
    const t = f.t, w = this.w;
    const c = this.cam.at(t);
    const tL = w.spotlight!.start;
    const light = lightOn(t, tL);
    setGrid(this.grid, c, { reveal: [0, 0, 1e5], ink: 0.8 - 0.4 * light });
    this.grid.render(renderer, out);
    const U = this.ui; U.clear();
    const ctx = U.ctx;
    const [hx, hy] = avatarHead(AX, AY, AS);
    // eyes in the dark
    EYES.forEach(([x, y], i) => {
      const te = this.eyeT[i]!;
      let open = ease.outBack(prog(t, te, te + 0.16));
      const bl = blinkAt(t, i * 0.37 + 0.5) && t > te + 0.4 ? 1 : 0;
      if (bl) open = 0.2;
      const fade = 1 - 0.55 * light;
      drawEyePair(ctx, c, x, y, 9, open, hx, hy, fade);
    });
    // the spotlight
    drawCone(ctx, c, AX, -560, AY - 40, 120, 760, light);
    // the avatar: pops up from below
    const pop = ease.outBack(prog(t, this.ctx.start + 0.02, this.ctx.start + 0.45));
    const nervous = prog(t, w.staring!.start, w.staring!.start + 0.1) * (1 - prog(t, this.L1.end + 0.25, this.L1.end + 0.35));
    const dart = nervous > 0 ? (Math.floor(t * 3.2) % 2 ? 1 : -1) : 0;
    const shake = nervous * 2.5 * noise1(t * 30, 2);
    drawAvatar(ctx, c, AX + shake, AY + (1 - pop) * 700, AS, {
      talk: lipsync(this.ctx.audio, t),
      blink: nervous ? 0 : blinkAt(t, 0.2),
      look: [dart, 0],
      sweat: nervous,
      brow: nervous > 0.5 || (t > tL && t < tL + 0.6) ? 1 : 0,
    });
    // words
    drawKaraoke(ctx, c, t, this.kw1, { alpha: (_, tt) => 1 - prog(tt, this.L2.start - 0.2, this.L2.start + 0.1), pop: 0.08 });
    drawKaraoke(ctx, c, t, this.kw2, { alpha: (_, tt) => 1 - 0.45 * prog(tt, tL, tL + 0.3) });
    const kThe = prog(t, w.the!.start, w.the!.start + 0.3);
    const kSpot = prog(t, tL, tL + 0.35);
    const kEff = prog(t, w.effect!.start, w.effect!.start + 0.35);
    drawTitle(ctx, c, -80, 60, 168, kThe, kSpot, kEff);
    comp.draw(renderer, U.upload(), out);
    const hit = pulse(t, tL, 0.1) * 0.8 + pulse(t, w.effect!.start, 0.1);
    return {
      bloom: 0.6, bloomThreshold: 0.84, vignette: 0.45 + 0.1 * light, grain: 0.06,
      zoom: 1 + 0.02 * hit + 0.01 * pulse(t, w.everyone!.start, 0.1),
      flash: 0.12 * pulse(t, tL, 0.05),
      shake: [noise1(t * 50, 4) * 6 * hit, noise1(t * 50, 5) * 6 * hit],
      fade: 1 - clamp((t - this.ctx.start) / 0.2),
    };
  }
}
