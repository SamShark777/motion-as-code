// TPL_OUTRO (vertical template) — the takeaway lines. The big avatar rises back under a soft light,
// happy-eyed on the first line; the takeaway sets big above him; he winks on the last word; the
// title signs off with the call to action, then a fade.
import type * as THREE from 'three';
import { Scene, type Frame, type PostOverrides } from '../engine/scene';
import { Layer2D } from '../engine/gl';
import { rgba } from '../engine/palette';
import { F, measure } from '../engine/type';
import { type Word } from '../engine/lyrics';
import { ease, prog, pulse, noise1 } from '../engine/util';
import { Cam2D, gridPass, setGrid, drawKaraoke, label, setWorld, type KWord } from './_vo';
import { drawAvatar, lipsync, blinkAt, drawCone, lightOn } from './_spot';
import { loadScript, secLines, centredRows, fitRows, drawTitleV, type Script } from './_tpl';

const AY = 990, AS = 24;

export default class TplOutro extends Scene {
  cam = new Cam2D();
  grid = gridPass(24, 96);
  ui = new Layer2D();
  kw: KWord[] = [];
  S!: Script;
  first!: Word; last!: Word;
  endT = 0;

  override async init() {
    this.S = await loadScript();
    const ls = secLines(this.ctx.lyrics, 'takeaway');
    const words = ls.flatMap((l) => l.words);
    this.first = words[0]!; this.last = words[words.length - 1]!;
    const fam = F.archivo(85, 900);
    const size = fitRows(words, fam, 960, 4, 120, 56);
    this.kw = centredRows(words, -720, size, fam, 't', 960, 1.02).words;
    this.endT = this.last.end + 0.15;
    this.cam.key(this.ctx.start, 0, 20, 1.04, 0).key(this.first.start + 0.4, 0, 0, 1.0, 0, ease.outExpo).key(this.ctx.end, 0, -10, 1.04, 0, ease.linear);
  }

  override render(f: Frame, out: THREE.WebGLRenderTarget): PostOverrides {
    const { renderer, comp } = this.ctx;
    const t = f.t;
    const c = this.cam.at(t);
    setGrid(this.grid, c, { reveal: [0, 0, 1e5], ink: 0.75 });
    this.grid.render(renderer, out);
    const U = this.ui; U.clear();
    const ctx = U.ctx;
    const rise = ease.outBack(prog(t, this.ctx.start + 0.02, this.ctx.start + 0.45));
    const tl = lightOn(t, this.ctx.start + 0.25);
    drawCone(ctx, c, 0, -960, AY - 40, 140, 900, tl * 0.6 * (1 - prog(t, this.endT, this.endT + 0.6)));
    if (rise > 0.002) drawAvatar(ctx, c, 0, AY + (1 - rise) * 900, AS, {
      talk: lipsync(this.ctx.audio, t),
      happy: t > this.first.start && t < this.first.end + 0.5 ? 1 : 0,
      wink: t > this.last.start + 0.08 && t < this.last.end + 0.6 ? 1 : 0,
      blink: blinkAt(t, 2.2),
    });
    drawKaraoke(ctx, c, t, this.kw, { pop: 0.06, alpha: () => 1 - 0.6 * prog(t, this.endT, this.endT + 0.3) });
    const kT = prog(t, this.endT, this.endT + 0.3);
    if (kT > 0) {
      drawTitleV(ctx, c, -190, this.S.title[0], this.S.title[1], 96, kT, prog(t, this.endT + 0.12, this.endT + 0.42));
      const cta = (this.S.cta ?? 'FOLLOW FOR MORE').toUpperCase();
      const a = prog(t, this.endT + 0.3, this.endT + 0.6);
      setWorld(ctx, c, 0, 0);
      const w = measure(cta, F.mono(600), 26, 5);
      label(ctx, cta.slice(0, Math.ceil(a * cta.length)), -w / 2, -860, { size: 26, col: rgba('signal', 1), weight: 600, spacing: 5 });
      ctx.setTransform(1, 0, 0, 1, 0, 0);
    }
    comp.draw(renderer, U.upload(), out);
    const hit = 0.6 * pulse(t, this.first.start, 0.12) + 0.5 * pulse(t, this.endT, 0.1);
    return {
      bloom: 0.6, bloomThreshold: 0.84, vignette: 0.45, grain: 0.06,
      zoom: 1 + 0.02 * hit,
      shake: [noise1(t * 50, 4) * 4 * hit, noise1(t * 50, 5) * 4 * hit],
      fade: prog(t, this.ctx.end - 0.35, this.ctx.end),
    };
  }
}
