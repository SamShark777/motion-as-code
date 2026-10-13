// TPL_NAME (vertical template) — the line that names the concept. The words before the title cue
// type in as a small karaoke kicker; a light clicks on over the avatar on the cue word and the
// title slams in (big line, then the look's second element on the line's last word).
import type * as THREE from 'three';
import { Scene, type Frame, type PostOverrides } from '../engine/scene';
import { Layer2D } from '../engine/gl';
import { type Word } from '../engine/lyrics';
import { ease, prog, pulse, noise1 } from '../engine/util';
import { Cam2D, drawKaraoke, setWorld, type KWord } from './_vo';
import { drawAvatar, lipsync, blinkAt, drawCone, lightOn } from './_spot';
import { loadScriptLook, secLines, centredRows, fitRows, findWord, drawTitleV, karaokeOpts, setNow, drawChrome, type Script } from './_tpl';
import { groundPass, setGround, lookPost, kwBox, drawPanel, type Look } from './_looks';

const AY = 990, AS = 24;

export default class TplName extends Scene {
  cam = new Cam2D();
  grid = groundPass();
  ui = new Layer2D();
  kw: KWord[] = [];
  S!: Script;
  Lk!: Look;
  cue!: Word; last!: Word;

  override async init() {
    const { S, L } = await loadScriptLook();
    this.S = S; this.Lk = L;
    const ls = secLines(this.ctx.lyrics, 'name');
    const words = ls.flatMap((l) => l.words);
    this.cue = (this.S.titleCue ? findWord(ls, this.S.titleCue) : null) ?? words[Math.max(0, words.length - 2)]!;
    this.last = words[words.length - 1]!;
    const kicker = words.slice(0, words.indexOf(this.cue));
    const fam = L.fonts.body;
    const size = fitRows(kicker, fam, 940, 2, 64 * (L.fonts.headScale ?? 1), 40, L.upper);
    this.kw = centredRows(kicker, -750, size, fam, 'k', 940, 1.12, 0.25, L.upper).words;
    this.cam.key(this.ctx.start, 0, -20, 1.03, 0).key(this.cue.start, 0, 0, 1.0, 0, ease.outExpo).key(this.ctx.end, 0, 0, 1.03, 0, ease.linear);
  }

  override render(f: Frame, out: THREE.WebGLRenderTarget): PostOverrides {
    const { renderer, comp } = this.ctx;
    const t = f.t, L = this.Lk;
    setNow(t);
    const c = this.cam.at(t);
    const tL = this.cue.start;
    const light = lightOn(t, tL);
    setGround(this.grid, L, c, t);
    this.grid.render(renderer, out);
    const U = this.ui; U.clear();
    const ctx = U.ctx;
    drawCone(ctx, c, 0, -960, AY - 40, 140, 900, light);
    drawAvatar(ctx, c, 0, AY, AS, {
      talk: lipsync(this.ctx.audio, t),
      blink: blinkAt(t, 0.9),
      brow: t > tL && t < tL + 0.6 ? 1 : 0,
      look: [0, 0],
    });
    const ka = 1 - 0.45 * prog(t, tL, tL + 0.3);
    if (this.kw.length) drawPanel(ctx, L, c, kwBox(this.kw), prog(t, this.ctx.start, this.ctx.start + 0.2) * ka, setWorld);
    drawKaraoke(ctx, c, t, this.kw, karaokeOpts(L, { alpha: () => ka }));
    const tP = Math.max(this.last.start, tL + 0.25);
    drawTitleV(ctx, c, -470, this.S.title[0], this.S.title[1], 200, prog(t, tL, tL + 0.35), prog(t, tP, tP + 0.35), L);
    drawChrome(ctx, L, { t, p: t / this.ctx.audio.duration, no: this.S.no ?? 0, title: this.S.title.join(' '), credit: this.S.credit, sec: 'name' });
    comp.draw(renderer, U.upload(), out);
    const hit = pulse(t, tL, 0.1) * 0.8 + pulse(t, tP, 0.1);
    return lookPost(L, {
      zoom: 1 + 0.02 * hit,
      flash: 0.12 * pulse(t, tL, 0.05),
      shake: [noise1(t * 50, 4) * 6 * hit, noise1(t * 50, 5) * 6 * hit],
    });
  }
}
