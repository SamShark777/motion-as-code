// TED1 — "Ted type 1" faceless format (modelled on dark-psychology tip channels):
// every script line gets its own flat illustration clip (a free LottieFiles animation) inside a
// rounded card on black with a heavy vignette; hard cuts on the line; slow push-in per shot;
// 2–3-word white captions in the upper third; a small handle watermark. Script lines carry
// `shot` (file in data/lottie/<shot>.json) and `bg` (card colour behind the illustration).
import type * as THREE from 'three';
import lottie, { type AnimationItem } from 'lottie-web/build/player/lottie_canvas';
import { Scene, type Frame, type PostOverrides } from '../engine/scene';
import { Layer2D, clearRT } from '../engine/gl';
import { font, measure } from '../engine/type';
import { type Word } from '../engine/lyrics';
import { clamp, ease, prog } from '../engine/util';
import { loadScript } from './_tpl';

const CW = 960, CH = 1560, CX = 60, CY = 180, R = 54;
const SZ = 900;
const CAP_FONT = 'Inter-800';

interface Shot { start: number; end: number; anim: AnimationItem | null; canvas: HTMLCanvasElement | null; bg: string; frames: number; fr: number; }

export default class Ted1 extends Scene {
  ui = new Layer2D();
  shots: Shot[] = [];
  chunks: { words: Word[]; start: number; end: number; text: string }[] = [];
  handle = '';

  override async init() {
    const S: any = await loadScript();
    this.handle = S.handle ?? '';
    const lines = this.ctx.lyrics.lines;
    for (let i = 0; i < lines.length; i++) {
      const L = lines[i]!, meta = S.lines[i] ?? {};
      const start = i === 0 ? 0 : L.start - 0.12;
      const end = i + 1 < lines.length ? lines[i + 1]!.start - 0.12 : this.ctx.audio.duration + 1;
      let anim: AnimationItem | null = null, canvas: HTMLCanvasElement | null = null, frames = 1, fr = 30;
      if (meta.shot) {
        const data = await fetch(`data/lottie/${meta.shot}.json`).then((r) => r.json());
        const box = document.createElement('div');
        box.style.cssText = `position:absolute;left:-9999px;top:0;width:${SZ}px;height:${SZ}px`;
        document.body.appendChild(box);
        anim = lottie.loadAnimation({ container: box, renderer: 'canvas', loop: true, autoplay: false, animationData: data,
                                      rendererSettings: { preserveAspectRatio: 'xMidYMid meet', clearCanvas: true } as any });
        await new Promise<void>((res) => { if ((anim as any).isLoaded) res(); else anim!.addEventListener('DOMLoaded', () => res()); setTimeout(res, 3000); });
        canvas = box.querySelector('canvas');
        frames = Math.max(1, anim.totalFrames);
        fr = data.fr || 30;
      }
      this.shots.push({ start, end, anim, canvas, bg: meta.bg ?? '#1b1b1f', frames, fr });
    }
    // captions: 2–3 words per chunk, breaking after punctuation
    for (const L of lines) {
      let cur: Word[] = [];
      const flush = () => { if (cur.length) { this.chunks.push({ words: cur, start: cur[0]!.start, end: cur[cur.length - 1]!.end, text: cur.map((w) => w.w).join(' ') }); cur = []; } };
      for (const w of L.words) {
        cur.push(w);
        if (/[.,!?;:]$/.test(w.w) || cur.length >= 3 || (cur.length === 2 && w.w.length > 7)) flush();
      }
      flush();
    }
  }

  shotAt(t: number) {
    let k = 0;
    for (let i = 0; i < this.shots.length; i++) if (t >= this.shots[i]!.start) k = i;
    return k;
  }

  override render(f: Frame, out: THREE.WebGLRenderTarget): PostOverrides {
    const { renderer, comp } = this.ctx;
    const t = f.t;
    clearRT(renderer, out, [0, 0, 0]);
    const U = this.ui; U.clear();
    const ctx = U.ctx;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.fillStyle = '#000'; ctx.fillRect(0, 0, 1080, 1920);
    const k = this.shotAt(t), s = this.shots[k]!;
    const lt = t - s.start, dur = Math.max(0.5, s.end - s.start);
    const pop = 1 + 0.035 * (1 - ease.outCubic(clamp(lt / 0.25)));
    const push = 1 + 0.06 * clamp(lt / dur);
    // card
    ctx.save();
    ctx.translate(540, CY + CH / 2); ctx.scale(pop, pop); ctx.translate(-540, -(CY + CH / 2));
    ctx.beginPath(); ctx.roundRect(CX, CY, CW, CH, R); ctx.clip();
    ctx.fillStyle = s.bg; ctx.fillRect(CX, CY, CW, CH);
    if (s.anim && s.canvas) {
      const fi = ((lt * s.fr) % s.frames + s.frames) % s.frames;
      s.anim.goToAndStop(fi, true);
      const sc = (CW * 0.98 / SZ) * push;
      const dw = SZ * sc, dh = SZ * sc;
      ctx.drawImage(s.canvas, 540 - dw / 2, CY + CH * 0.6 - dh / 2, dw, dh);
    }
    // vignette
    const g = ctx.createRadialGradient(540, CY + CH * 0.52, CW * 0.3, 540, CY + CH * 0.52, CH * 0.75);
    g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(0.65, 'rgba(0,0,0,0.25)'); g.addColorStop(1, 'rgba(0,0,0,0.85)');
    ctx.fillStyle = g; ctx.fillRect(CX, CY, CW, CH);
    // handle watermark
    if (this.handle) {
      ctx.globalAlpha = 0.85;
      const hx = CX + CW - 40, hy = CY + 58;
      ctx.strokeStyle = '#fff'; ctx.lineWidth = 4;
      ctx.beginPath(); ctx.roundRect(hx - 34, hy - 34, 34, 34, 10); ctx.stroke();
      ctx.beginPath(); ctx.arc(hx - 17, hy - 17, 8, 0, Math.PI * 2); ctx.stroke();
      ctx.font = font('Inter-800', 17); ctx.fillStyle = '#fff'; ctx.textAlign = 'right';
      ctx.fillText(this.handle.toUpperCase(), hx, hy + 30);
      ctx.textAlign = 'left'; ctx.globalAlpha = 1;
    }
    ctx.restore();
    // caption
    const c = this.chunks.find((ch) => t >= ch.start - 0.05 && t < ch.end + 0.12) ?? null;
    if (c) {
      const a = prog(t, c.start - 0.05, c.start + 0.05);
      const size = Math.min(84, (CW - 120) / Math.max(1, measure(c.text, CAP_FONT, 1)));
      const w = measure(c.text, CAP_FONT, size);
      const y = CY + CH * 0.3;
      ctx.font = font(CAP_FONT, size);
      ctx.globalAlpha = a;
      ctx.shadowColor = 'rgba(0,0,0,0.85)'; ctx.shadowBlur = 18; ctx.shadowOffsetY = 4;
      ctx.lineJoin = 'round'; ctx.lineWidth = size * 0.12; ctx.strokeStyle = 'rgba(0,0,0,0.75)';
      ctx.strokeText(c.text, 540 - w / 2, y);
      ctx.shadowBlur = 0; ctx.shadowOffsetY = 0;
      ctx.fillStyle = '#fff';
      ctx.fillText(c.text, 540 - w / 2, y);
      ctx.globalAlpha = 1;
    }
    comp.draw(renderer, U.upload(), out);
    const fade = 1 - prog(t, this.ctx.audio.duration - 0.4, this.ctx.audio.duration);
    return { fade: 1 - fade } as PostOverrides;
  }
}
