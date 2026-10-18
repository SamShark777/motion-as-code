// The canonical test scene with the REAL rigged Maya (characters/maya/maya.glb) in the Soft Storybook park.
// Clips are blended deterministically from local time: Walk → Idle → LookUp, smile morph, butterfly.
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import type { Frame } from '../engine/scene';
import KidSoft from './kid_soft';
import * as K from './_kid';

export default class KidMaya extends KidSoft {
  rig!: THREE.Object3D; mixer!: THREE.AnimationMixer; clips: Record<string, THREE.AnimationClip> = {}; morphs: THREE.Mesh[] = [];
  override async init() {
    super.init();
    this.s.remove(this.maya.root);
    const g = await new GLTFLoader().loadAsync('characters/maya/maya.glb');
    this.rig = g.scene; this.rig.scale.setScalar(0.8); this.s.add(this.rig);
    this.rig.traverse((o: any) => { if (o.isMesh) { o.castShadow = o.receiveShadow = true; if (o.morphTargetDictionary) this.morphs.push(o); } });
    this.mixer = new THREE.AnimationMixer(this.rig);
    for (const c of g.animations) this.clips[c.name] = c;
  }
  override render(f: Frame, out: THREE.WebGLRenderTarget) {
    const t = f.lt, T = this.ctx.end - this.ctx.start;
    const w = K.c01(t / 1.7), x = K.lerp(-1.25, -0.42, 1 - (1 - w) * (1 - w));
    this.rig.position.set(x, 0, 0);
    this.rig.rotation.y = K.lerp(1.15, 0.45, K.sstep(1.4, 2.1, t));
    const walkW = 1 - K.sstep(1.35, 1.75, t), lookW = K.sstep(1.6, 1.95, t), idleW = Math.max(0, 1 - walkW - lookW);
    const walkT = (x + 1.25) / 0.36; // cycle phase follows distance so feet don't skate
    this.mixer.stopAllAction();
    const set = (n: string, wt: number, tt: number) => { if (wt <= 0.001) return; const a = this.mixer.clipAction(this.clips[n]!); a.play(); a.setEffectiveWeight(wt); a.time = tt % this.clips[n]!.duration; };
    set('Walk', walkW, walkT); set('Idle', idleW, t); set('LookUp', lookW, Math.min(t - 1.6, 1.49));
    this.mixer.update(0);
    const smile = K.eio((t - 2.2) / 0.5), blink = t > 1.25 && t < 1.38 ? 1 : 0, brow = K.eio((t - 1.7) / 0.4) * (1 - K.eio((t - 3.0) / 0.6)) * 0.8;
    for (const m of this.morphs) { const d = m.morphTargetDictionary!; for (const k in d) m.morphTargetInfluences![d[k]!] = k === 'smile' ? smile : k === 'blink' ? blink : k === 'browUp' ? brow : 0; }
    K.poseFly(this.fly, t * (3 / T) * 0.95);
    this.cam.position.set(0.15, 1.05, 4.7 - 0.12 * K.eio(t / T)); this.cam.lookAt(0.15, 0.78, 0);
    K.draw(this.ctx.renderer, this.s, this.cam, out);
    return K.POST;
  }
}
