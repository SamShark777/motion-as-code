// TPL_OUTRO (vertical template) — the takeaway lines. The big avatar rises back under a soft light,
// happy-eyed on the first line; the takeaway sets big above him; he winks on the last word; the
// title signs off with the call to action, then a fade (to black, or to the paper on light looks).
import type * as THREE from 'three';
import { Scene, type Frame, type PostOverrides } from '../engine/scene';
import { Layer2D } from '../engine/gl';
import { font, measure } from '../engine/type';
import { type Word } from '../engine/lyrics';
import { ease, prog, pulse, noise1 } from '../engine/util';
import { Cam2D, drawKaraoke, setWorld, type KWord } from './_vo';
import { drawAvatar, lipsync, blinkAt, drawCone, lightOn, drawWave } from './_spot';
import { loadScriptLook, secLines, centredRows, fitRows, drawTitleV, karaokeOpts, setNow, drawChrome, type Script } from './_tpl';
import { groundPass, setGround, lookPost, paperFade, kwBox, drawPanel, type Look } from './_looks';

const AY = 990, AS = 24;

export default class TplOutro extends Scene {
  cam = new Cam2D();
  grid = groundPass();
  ui = new Layer2D();
  kw: KWord[] = [];
  S!: Script;
  Lk!: Look;
  first!: Word; last!: Word;
  endT = 0;

  override async init() {
    const { S, L } = await loadScriptLook();
    this.S = S; this.Lk = L;
    const ls = secLines(this.ctx.lyrics, 'takeaway');
    const words = ls.flatMap((l) => l.words);
    this.first = words[0]!; this.last = words[words.length - 1]!;
    const fam = L.fonts.head;
    const size = fitRows(words, fam, 940, 4, 120 * (L.fonts.headScale ?? 1), 56, L.upper);
    this.kw = centredRows(words, -700, size, fam, 't', 940, L.panel ? 1.12 : 1.02, 0.25, L.upper).words;
    this.endT = this.last.end + 0.15;
    this.cam.key(this.ctx.start, 0, 20, 1.04, 0).key(this.first.start + 0.4, 0, 0, 1.0, 0, ease.outExpo).key(this.ctx.end, 0, -10, 1.04, 0, ease.linear);
  }

  override render(f: Frame, out: THREE.WebGLRenderTarget): PostOverrides {
    const { renderer, comp } = this.ctx;
    const t = f.t, L = this.Lk;
    setNow(t);
    const c = this.cam.at(t);
    setGround(this.grid, L, c, t);
    this.grid.render(renderer, out);
    const U = this.ui; U.clear();
    const ctx = U.ctx;
    const rise = ease.outBack(prog(t, this.ctx.start + 0.02, this.ctx.start + 0.45));
    const tl = lightOn(t, this.ctx.start + 0.25);
    drawCone(ctx, c, 0, -960, AY - 40, 140, 900, tl * 0.6 * (1 - prog(t, this.endT, this.endT + 0.6)));
    const wave = this.S.presenter === 'wave';
    if (wave && rise > 0.002) drawWave(ctx, c, 0, AY - 300 + (1 - rise) * 900, 26, lipsync(this.ctx.audio, t), t, { main: L.accent, glow: L.hot });
    else if (rise > 0.002) drawAvatar(ctx, c, 0, AY + (1 - rise) * 900, AS, {
      talk: lipsync(this.ctx.audio, t),
      happy: t > this.first.start && t < this.first.end + 0.5 ? 1 : 0,
      wink: t > this.last.start + 0.08 && t < this.last.end + 0.6 ? 1 : 0,
      blink: blinkAt(t, 2.2),
    });
    const ka = 1 - 0.6 * prog(t, this.endT, this.endT + 0.3);
    drawPanel(ctx, L, c, kwBox(this.kw), prog(t, this.first.start - 0.3, this.first.start - 0.1) * ka, setWorld);
    drawKaraoke(ctx, c, t, this.kw, karaokeOpts(L, { pop: 0.06, alpha: () => ka }));
    const kT = prog(t, this.endT, this.endT + 0.3);
    if (kT > 0) {
      drawTitleV(ctx, c, -190, this.S.title[0], this.S.title[1], 96, kT, prog(t, this.endT + 0.12, this.endT + 0.42), L);
      const cta = (this.S.cta ?? 'Follow for more').toUpperCase();
      const a = prog(t, this.endT + 0.3, this.endT + 0.6);
      setWorld(ctx, c, 0, 0);
      const fam = L.fonts.mono, sz = 30;
      const w = measure(cta, fam, sz, 5);
      ctx.font = font(fam, sz); ctx.letterSpacing = '5px'; ctx.fillStyle = L.hot;
      ctx.fillText(cta.slice(0, Math.ceil(a * cta.length)), -w / 2, -860);
      ctx.letterSpacing = '0px';
      ctx.setTransform(1, 0, 0, 1, 0, 0);
    }
    drawChrome(ctx, L, { t, p: t / this.ctx.audio.duration, no: this.S.no ?? 0, title: this.S.title.join(' '), credit: this.S.credit, sec: 'takeaway' }, 1 - kT);
    const fadeK = prog(t, this.ctx.end - 0.35, this.ctx.end);
    paperFade(ctx, L, fadeK);
    comp.draw(renderer, U.upload(), out);
    const hit = 0.6 * pulse(t, this.first.start, 0.12) + 0.5 * pulse(t, this.endT, 0.1);
    return lookPost(L, {
      zoom: 1 + 0.02 * hit,
      shake: [noise1(t * 50, 4) * 4 * hit, noise1(t * 50, 5) * 4 * hit],
      fade: fadeK,
    });
  }
}
