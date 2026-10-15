// The edit: which plate plays when. A voiceover has no beat grid, so every cut sits in the pause
// before a line: just before its first word (never after it), anchored to the aligned script
// (data/lyrics.json).
import type { TimelineEntry } from './engine/engine';
import type { SceneClass } from './engine/scene';
import type { Lyrics } from './engine/lyrics';
import type { AudioData } from './engine/audio';
import { VERTICAL } from './engine/gl';

// Scene modules are discovered lazily so a missing/broken scene never breaks the build.
const modules = import.meta.glob<{ default: SceneClass }>('./scenes/*.ts');
const scene = (name: string) => () => {
  const m = modules[`./scenes/${name}.ts`];
  return m ? m() : Promise.reject(new Error(`scene module not found: scenes/${name}.ts`));
};

export function makeTimeline(ly: Lyrics, au: AudioData): TimelineEntry[] {
  if (ly.lines.length && ly.lines.every((l) => (l as any).sec === 'ted')) return [{ id: 'ted1', load: scene('ted1'), start: 0, end: au.duration }];
  if (VERTICAL) return templateTimeline(ly, au);
  /** Cut in the pause before the line containing q: 0.18 s before its first word (less if the pause is short). */
  const cut = (q: string, nth = 0) => {
    const l = ly.get(q, nth);
    const prev = ly.lines[l.i - 1];
    const gap = prev ? l.start - prev.end : 1;
    return l.start - Math.min(0.18, Math.max(0.04, gap * 0.45));
  };
  const b = {
    study: cut('In one study'),
    close: cut('Everyone else'),
    end: au.duration,
  };
  const E = (id: string, file: string, start: number, end: number, extra: Partial<TimelineEntry> = {}): TimelineEntry =>
    ({ id, load: scene(file), start, end, ...extra });
  return [
    E('spot_open', 'spot_open', 0, b.study),
    E('spot_study', 'spot_study', b.study, b.close),
    E('spot_close', 'spot_close', b.close, b.end),
  ];
}

/** The vertical script-driven template: one plate per section (lines carry `sec` from tts_vo.py). */
function templateTimeline(ly: Lyrics, au: AudioData): TimelineEntry[] {
  // "Ted type 1": one card-montage plate for the whole video
  if (ly.lines.length && ly.lines.every((l) => (l as any).sec === 'ted')) return [{ id: 'ted1', load: scene('ted1'), start: 0, end: au.duration }];
  const first = (secs: string[]) => ly.lines.findIndex((l) => secs.includes((l as any).sec));
  const cutAt = (i: number) => {
    const l = ly.lines[i]!, prev = ly.lines[i - 1];
    const gap = prev ? l.start - prev.end : 1;
    return l.start - Math.min(0.18, Math.max(0.04, gap * 0.45));
  };
  const plan: [string, string[]][] = [['tpl_hook', ['hook']], ['tpl_name', ['name']], ['tpl_evidence', ['study', 'stat']], ['tpl_outro', ['takeaway']]];
  const parts = plan.map(([id, secs]) => ({ id, i: first(secs) })).filter((p) => p.i >= 0);
  return parts.map((p, k) => ({
    id: p.id,
    load: scene(p.id),
    start: k === 0 ? 0 : cutAt(p.i),
    end: k + 1 < parts.length ? cutAt(parts[k + 1]!.i) : au.duration,
  }));
}
