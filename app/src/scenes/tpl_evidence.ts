// TPL_EVIDENCE (vertical template) — the study and stat lines. A room of twenty pixel people pops
// in on the first line (all on their phones), the study credit types in; on stat A's cue word the
// lit share of the room looks up (signal outline, '!') while A's number rolls; on stat B's cue the
// room changes to B's share and B's number lands in signal (A is struck out when B is smaller).
import type * as THREE from 'three';
import { Scene, type Frame, type PostOverrides } from '../engine/scene';
import { Layer2D } from '../engine/gl';
import { rgba } from '../engine/palette';
import { F, font, measure } from '../engine/type';
import { type Line, type Word } from '../engine/lyrics';
import { ease, prog, pulse, noise1, hash } from '../engine/util';
import { Cam2D, gridPass, setGrid, drawKaraoke, label, setWorld, type KWord } from './_vo';
import { drawAvatar, blinkAt, drawPerson, lipsync } from './_spot';
import { loadScript, secLines, centredRows, fitRows, findWord, litOf, LIT_ORDER, type Script, type Stat } from './_tpl';

const COLS = 5, ROWS = 4, CW = 190, CY0 = -330, CH = 175, PS = 10;
const AY = 990, AS = 9;

export default class TplEvidence extends Scene {
  cam = new Cam2D();
  grid = gridPass(24, 96);
  ui = new Layer2D();
  kw: KWord[] = [];
  S!: Script;
  L: Line[] = [];
  wa: Word | null = null; wb: Word | null = null;
  litA = 0; litB = 0;

  override async init() {
    this.S = await loadScript();
    this.L = secLines(this.ctx.lyrics, ['study', 'stat']);
    const fam = F.archivo(90, 800);
    this.L.forEach((l, i) => {
      const size = fitRows(l.words, fam, 980, 3, 74, 44);
      this.kw.push(...centredRows(l.words, -820, size, fam, `l${i}`, 980, 1.08).words);
    });
    const st = this.S.stat;
    if (st) {
      this.wa = findWord(this.L, st.a.cue);
      this.wb = st.b ? findWord(this.L, st.b.cue) : null;
      this.litA = litOf(st.a, st.unit);
      this.litB = st.b ? litOf(st.b, st.unit) : this.litA;
    }
    this.cam.key(this.ctx.start, 0, 0, 1.0, 0).key(this.ctx.end, 0, 10, 1.03, 0, ease.linear);
  }

  groupAlpha(g: string, t: number) {
    const i = +g.slice(1);
    const l = this.L[i]!, n = this.L[i + 1];
    return prog(t, l.start - 0.3, l.start - 0.1) * (n ? 1 - prog(t, n.start - 0.25, n.start - 0.1) : 1);
  }

  /** Number of lit figures at t and the time they changed. */
  litAt(t: number): number {
    if (this.wb && t >= this.wb.start) return this.litB;
    if (this.wa && t >= this.wa.start) return this.litA;
    return 0;
  }

  override render(f: Frame, out: THREE.WebGLRenderTarget): PostOverrides {
    const { renderer, comp } = this.ctx;
    const t = f.t;
    const c = this.cam.at(t);
    setGrid(this.grid, c, { reveal: [0, 0, 1e5], ink: 0.8 });
    this.grid.render(renderer, out);
    const U = this.ui; U.clear();
    const ctx = U.ctx;
    const t0 = this.L[0]?.start ?? this.ctx.start;
    // credit
    if (this.S.credit) {
      const a = prog(t, t0 + 0.3, t0 + 0.7);
      const txt = this.S.credit.toUpperCase();
      setWorld(ctx, c, 0, 0);
      const w = measure(txt, F.mono(500), 17, 3);
      label(ctx, txt.slice(0, Math.floor(a * txt.length)), -w / 2, -540, { size: 17, col: rgba('ash', 0.95) });
      ctx.setTransform(1, 0, 0, 1, 0, 0);
    }
    // the room
    const ta = this.wa?.start ?? 1e9, tb = this.wb?.start ?? 1e9;
    for (let r = 0; r < ROWS; r++) for (let k = 0; k < COLS; k++) {
      const i = r * COLS + k;
      const x = (k - 2) * CW + (r % 2 ? 20 : -20), y = CY0 + r * CH;
      const ti = t0 - 0.1 + hash(i, 9) * 0.35;
      const sc = ease.outBack(prog(t, ti, ti + 0.22));
      const ord = LIT_ORDER.indexOf(i);
      const inA = ord < this.litA, inB = ord < this.litB;
      let up = false, tUp = 1e9;
      if (t >= tb) { up = inB; tUp = inA && inB ? ta + ord * 0.035 : tb + ord * 0.03; }
      else if (t >= ta) { up = inA; tUp = ta + ord * 0.035; }
      up = up && t >= tUp;
      const hot = up ? prog(t, tUp, tUp + 0.12) : 0;
      const dim = t >= ta && !up ? 0.55 : 1;
      drawPerson(ctx, c, i + 3, x, y + 70, PS, { mode: up ? 'look' : 'phone', dir: k < 2 ? 1 : -1, hot, alpha: dim, scale: sc * (1 + 0.08 * pulse(t, tUp, 0.1)) });
    }
    // stats
    const st = this.S.stat;
    if (st) {
      const fmt = (s: Stat, v: number) => s.display ?? `${Math.round(v)}${st.unit ?? ''}`;
      const block = (s: Stat, x: number, t1: number, hot: boolean, strike: number, from: number) => {
        const k = prog(t, t1 - 0.1, t1 + 0.1);
        if (k <= 0) return;
        setWorld(ctx, c, 0, 0);
        ctx.globalAlpha = k;
        const lw = measure(s.label.toUpperCase(), F.mono(500), 20, 3);
        label(ctx, s.label.toUpperCase(), x - lw / 2, 360, { size: 20, col: hot ? rgba('signal', 1) : rgba('ash', 1) });
        const v = s.display ? 0 : from + (s.value - from) * prog(t, t1, t1 + 0.6, ease.outCubic);
        const txt = s.display && t < t1 + 0.3 ? (hash(Math.floor(t * 20), 4) * 99).toFixed(0) : fmt(s, v);
        ctx.font = font(F.archivo(80, 900), 150);
        const tw = measure(txt, F.archivo(80, 900), 150);
        ctx.fillStyle = rgba(hot ? 'signal' : 'bone', 1);
        ctx.fillText(txt, x - tw / 2, 510);
        if (strike > 0) { ctx.fillStyle = rgba('signal', 1); ctx.fillRect(x - tw / 2 - 10, 455, (tw + 20) * strike, 12); }
        ctx.globalAlpha = 1;
        ctx.setTransform(1, 0, 0, 1, 0, 0);
      };
      const hasB = !!st.b && !!this.wb;
      const strike = hasB && st.b!.value < st.a.value && this.wb ? prog(t, this.wb.end - 0.05, this.wb.end + 0.2, ease.outExpo) : 0;
      block(st.a, hasB ? -250 : 0, ta, !hasB, strike, 0);
      if (hasB) block(st.b!, 250, tb, true, 0, st.a.value);
    }
    // the avatar watches from below
    const done = this.wb ? t > this.wb.end : this.wa ? t > this.wa.end + 0.3 : false;
    drawAvatar(ctx, c, 0, AY, AS, {
      talk: lipsync(this.ctx.audio, t),
      blink: blinkAt(t, 1.3),
      look: [0, -1],
      sweat: t > ta && !done ? 1 : 0,
      happy: done && t < this.ctx.end - 0.1 ? 1 : 0,
    });
    drawKaraoke(ctx, c, t, this.kw, { alpha: (g, tt) => this.groupAlpha(g, tt) });
    comp.draw(renderer, U.upload(), out);
    const hit = 0.6 * pulse(t, ta, 0.1) + 0.6 * pulse(t, tb, 0.1);
    return {
      bloom: 0.6, bloomThreshold: 0.84, vignette: 0.42, grain: 0.06,
      zoom: 1 + 0.02 * hit,
      shake: [noise1(t * 50, 4) * 5 * hit, noise1(t * 50, 5) * 5 * hit],
    };
  }
}
