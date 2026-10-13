// TPL_HOOK (vertical template) — the hook lines. The avatar pops up at the bottom; the question
// sets big above him; either pixel eyes open around him ('eyes') or pixel question marks bob up
// around his head ('thoughts'), one per word. Everything is drawn in the script's look.
import type * as THREE from 'three';
import { Scene, type Frame, type PostOverrides } from '../engine/scene';
import { Layer2D } from '../engine/gl';
import { clamp, ease, prog, pulse, noise1, hash } from '../engine/util';
import { Cam2D, drawKaraoke, setWorld, type KWord } from './_vo';
import { drawAvatar, avatarHead, lipsync, blinkAt, drawEyePair, drawWave } from './_spot';
import { loadScriptLook, secLines, centredRows, fitRows, drawQ, karaokeOpts, setNow, drawChrome, type Script } from './_tpl';
import { groundPass, setGround, lookPost, paperFade, kwBox, drawPanel, type Look } from './_looks';

const AY = 990, AS = 24;
const EYES: [number, number][] = [[-430, -870], [380, -880], [-440, -180], [420, -200], [-460, 120], [440, 80], [-120, -900], [200, -60], [-260, -40], [460, 380], [-470, 420], [130, -900]];
const QS: [number, number][] = [[-330, 160], [330, 120], [-430, -60], [420, -120], [-200, -120], [250, -40], [0, -180], [-470, 300]];

export default class TplHook extends Scene {
  cam = new Cam2D();
  grid = groundPass();
  ui = new Layer2D();
  kw: KWord[] = [];
  S!: Script;
  Lk!: Look;
  marks: number[] = [];
  t0 = 0; t1 = 0;

  override async init() {
    const { S, L } = await loadScriptLook();
    this.S = S; this.Lk = L;
    const ls = secLines(this.ctx.lyrics, 'hook');
    const words = ls.flatMap((l) => l.words);
    const fam = L.fonts.head;
    const size = fitRows(words, fam, 940, 4, 150 * (L.fonts.headScale ?? 1), 64, L.upper);
    this.kw = centredRows(words, -760 + size * 0.8, size, fam, 'h', 940, L.panel ? 1.12 : 1.0, 0.25, L.upper).words;
    this.t0 = words[0]?.start ?? 0.3; this.t1 = words[words.length - 1]?.end ?? 2;
    const n = this.S.hookStyle === 'thoughts' ? QS.length : EYES.length;
    this.marks = Array.from({ length: n }, (_, i) => this.t0 + 0.25 + ((this.t1 - this.t0) * i) / n + hash(i, 3) * 0.06);
    this.cam.key(this.ctx.start, 0, 0, 1.0, 0).key(this.ctx.end, 0, -10, 1.035, 0, ease.linear);
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
    const wave = this.S.presenter === 'wave';
    const [hx, hy] = wave ? [0, AY - 300] : avatarHead(0, AY, AS);
    const thoughts = this.S.hookStyle === 'thoughts';
    if (thoughts) {
      QS.forEach(([x, y], i) => {
        const k = ease.outBack(prog(t, this.marks[i]!, this.marks[i]! + 0.25));
        const bob = Math.sin((t + i) * 2.4) * 10;
        drawQ(ctx, c, x, y + bob + (1 - k) * 60, 13, i % 3 === 0 ? L.qmark[0] : L.qmark[1], clamp(k), L.light ? L.paper : '#0A0A0B');
      });
    } else {
      EYES.forEach(([x, y], i) => {
        const te = this.marks[i]!;
        let open = ease.outBack(prog(t, te, te + 0.16));
        if (blinkAt(t, i * 0.37 + 0.5) && t > te + 0.4) open = 0.2;
        drawEyePair(ctx, c, x, y, 10, open, hx, hy);
      });
    }
    const pop = ease.outBack(prog(t, this.ctx.start + 0.02, this.ctx.start + 0.45));
    const worry = prog(t, this.t0 + 0.6, this.t0 + 0.7);
    if (wave) drawWave(ctx, c, 0, AY - 300 + (1 - pop) * 900, 26, lipsync(this.ctx.audio, t), t, { main: L.accent, glow: L.hot });
    else drawAvatar(ctx, c, worry * 2 * noise1(t * 30, 2), AY + (1 - pop) * 900, AS, {
      talk: lipsync(this.ctx.audio, t),
      blink: blinkAt(t, 0.2),
      look: thoughts ? [Math.floor(t * 1.5) % 2 ? 1 : -1, 0] : [Math.floor(t * 3.2) % 2 ? 1 : -1, 0],
      sweat: !thoughts && worry > 0.5 ? 1 : 0,
      brow: worry > 0.5 ? 1 : 0,
    });
    const ta = 1 - prog(t, this.ctx.end - 0.2, this.ctx.end);
    drawPanel(ctx, L, c, kwBox(this.kw), prog(t, this.t0 - 0.35, this.t0 - 0.15) * ta, setWorld);
    drawKaraoke(ctx, c, t, this.kw, karaokeOpts(L, { pop: 0.08, alpha: () => ta }));
    drawChrome(ctx, L, { t, p: t / this.ctx.audio.duration, no: this.S.no ?? 0, title: this.S.title.join(' '), credit: this.S.credit, sec: 'hook' });
    paperFade(ctx, L, 1 - clamp((t - this.ctx.start) / 0.25));
    comp.draw(renderer, U.upload(), out);
    const hit = pulse(t, this.t0, 0.1);
    return lookPost(L, { zoom: 1 + 0.015 * hit, fade: 1 - clamp((t - this.ctx.start) / 0.2) });
  }
}
