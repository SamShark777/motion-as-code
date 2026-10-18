// EPISODE 1 — "Maya and the Tired Butterfly" (≈60 s, calm profile, Soft Storybook style).
// Everything is data + pure functions of local time t: shot list (cameras), Maya's tracks (position,
// facing, clip weights, head look, face), and the butterfly's path. Captions are burned in afterwards.
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import type { Frame } from '../engine/scene';
import KidSoft from './kid_soft';
import * as K from './_kid';

type Key = [number, number];
/** Piecewise track with smoothstep easing between keys. */
const track = (t: number, keys: Key[]) => {
  if (t <= keys[0]![0]) return keys[0]![1];
  for (let i = 1; i < keys.length; i++) { const [t1, v1] = keys[i]!, [t0, v0] = keys[i - 1]!; if (t <= t1) return K.lerp(v0, v1, K.eio((t - t0) / (t1 - t0))); }
  return keys[keys.length - 1]![1];
};
const lin = (t: number, keys: Key[]) => {
  if (t <= keys[0]![0]) return keys[0]![1];
  for (let i = 1; i < keys.length; i++) { const [t1, v1] = keys[i]!, [t0, v0] = keys[i - 1]!; if (t <= t1) return K.lerp(v0, v1, (t - t0) / (t1 - t0)); }
  return keys[keys.length - 1]![1];
};
const win = (t: number, a: number, b: number, f = 0.35) => K.sstep(a, a + f, t) * (1 - K.sstep(b - f, b, t));

// ---------------------------------------------------------------- shots (camera position, target)
export const SHOTS: { t: number; pos: [number, number, number]; to: [number, number, number]; push: [number, number, number] }[] = [
  { t: 0, pos: [0.2, 1.45, 6.6], to: [0.0, 0.62, 0], push: [0, -0.08, -0.6] },          // 1 establishing
  { t: 8, pos: [-0.35, 0.95, 3.0], to: [-0.05, 0.45, 0.2], push: [0.1, 0, -0.2] },       // 2 notice
  { t: 15, pos: [1.85, 0.8, 1.5], to: [0.12, 0.42, 0.2], push: [-0.15, -0.05, -0.12] },   // 3 close, low
  { t: 24, pos: [0.35, 0.92, 2.55], to: [0.02, 0.72, 0], push: [0, 0, -0.18] },          // 4 think
  { t: 33, pos: [-1.45, 1.15, 3.1], to: [0.9, 0.5, 0.1], push: [0.12, 0, -0.15] },       // 5 the flowers
  { t: 42, pos: [-0.2, 0.95, 3.1], to: [0.4, 0.5, 0.1], push: [1.45, 0, 0] },            // 6 together (tracking)
  { t: 52, pos: [1.0, 0.95, 3.0], to: [1.85, 0.72, 0.15], push: [0.05, 0.06, -0.2] },    // 7 nectar + fly away
];
export const CAPTIONS: [number, number, string][] = [
  [0.8, 7.4, 'One sunny morning, Maya went for a walk in the park.'],
  [8.6, 14.6, 'Near the big tree, something tiny was resting in the grass.'],
  [15.8, 23.6, 'A little butterfly. It was too tired to fly.'],
  [24.8, 32.6, 'Maya wondered... what do tired butterflies need?'],
  [33.8, 41.6, 'Flowers! Butterflies love sweet flower nectar.'],
  [42.6, 51.6, 'Slowly, slowly, the butterfly followed Maya.'],
  [52.6, 56.0, 'A sip of sweet nectar...'],
  [56.3, 59.8, '...and away it flew! Bye-bye, butterfly!'],
];
const REST: [number, number, number] = [0.25, 0.03, 0.42];
const BLOOM: [number, number, number] = [2.0, 0.47, 0.32];

export default class StoryEp1 extends KidSoft {
  rig!: THREE.Object3D; mixer!: THREE.AnimationMixer; clips: Record<string, THREE.AnimationClip> = {};
  morphs: THREE.Mesh[] = []; head!: THREE.Bone;
  override async init() {
    super.init();
    this.s.remove(this.maya.root);
    const g = await new GLTFLoader().loadAsync('characters/maya/maya.glb');
    this.rig = g.scene; this.rig.scale.setScalar(0.8); this.s.add(this.rig);
    this.rig.traverse((o: any) => {
      if (o.isMesh) { o.castShadow = o.receiveShadow = true; if (o.morphTargetDictionary) this.morphs.push(o); }
      if (o.isBone && o.name === 'Head') this.head = o;
    });
    this.mixer = new THREE.AnimationMixer(this.rig);
    for (const c of g.animations) this.clips[c.name] = c;
    // flower patch (registered prop candidates: big_flower)
    const M = K.cached((role, col) => new THREE.MeshStandardMaterial({ color: col, roughness: 0.8 }));
    const flower = (x: number, z: number, h: number, petal: string, s = 1) => {
      const f = new THREE.Group();
      const st = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.016, h, 10), M('stem', '#6FB46A')); st.position.y = h / 2; f.add(st);
      const lf = new THREE.Mesh(new THREE.SphereGeometry(0.06, 16, 8), M('leaf', '#7CC173')); lf.scale.set(1, 0.25, 0.5); lf.position.set(0.05, h * 0.4, 0); lf.rotation.z = 0.5; f.add(lf);
      for (let i = 0; i < 6; i++) {
        const a = (i / 6) * K.TAU, p = new THREE.Mesh(new THREE.SphereGeometry(0.07, 20, 10), M('petal', petal));
        p.scale.set(1, 0.32, 0.6); p.position.set(Math.cos(a) * 0.07, h, Math.sin(a) * 0.07); p.rotation.y = -a; p.castShadow = true; f.add(p);
      }
      const c = new THREE.Mesh(new THREE.SphereGeometry(0.045, 16, 10), M('center', '#FFD23F')); c.position.y = h + 0.012; c.scale.y = 0.6; f.add(c);
      f.position.set(x, 0, z); f.scale.setScalar(s); f.traverse((o: any) => { if (o.isMesh) o.castShadow = true; }); this.s.add(f);
    };
    flower(BLOOM[0], BLOOM[2], 0.42, '#FF9EC0');
    flower(2.28, 0.0, 0.34, '#FFE08A', 0.9); flower(1.78, 0.6, 0.3, '#C9B6FF', 0.85); flower(2.35, 0.55, 0.26, '#FF9EC0', 0.8); flower(1.7, 0.05, 0.24, '#FFE08A', 0.75);
  }

  /** Rotate a bone about a world-space axis (keeps the rest of the pose). */
  turnBone(b: THREE.Object3D, axis: THREE.Vector3, ang: number) {
    if (Math.abs(ang) < 1e-5) return;
    const pw = new THREE.Quaternion(); b.parent!.getWorldQuaternion(pw);
    const q = new THREE.Quaternion().setFromAxisAngle(axis, ang);
    const local = pw.clone().invert().multiply(q).multiply(pw);
    b.quaternion.premultiply(local);
  }

  actMaya(t: number) {
    // position: three walks
    const x = lin(t, [[0.8, -2.6], [6.4, -0.42], [12.6, -0.42], [14.4, 0.0], [45.0, 0.0], [50.6, 1.62]]);
    this.rig.position.set(x, 0, 0);
    const walking = (t > 0.8 && t < 6.4) || (t > 12.6 && t < 14.4) || (t > 45.0 && t < 50.6);
    const walkW = win(t, 0.6, 6.7) + win(t, 12.4, 14.7) + win(t, 44.8, 50.9);
    this.rig.rotation.y = track(t, [[0, 1.45], [8.8, 1.45], [9.7, 1.02], [14.3, 1.02], [15.0, 0.56], [24.8, 0.56], [25.6, 0.25], [33.3, 0.25], [34.3, 1.42],
      [42.0, 1.42], [42.6, 0.75], [44.3, 0.75], [44.9, 1.42], [51.0, 1.42], [51.8, 0.93], [55.4, 0.93], [56.4, 0.55]]);
    // clip weights
    const crouchK = lin(t, [[15.2, 0], [16.0, 1], [23.9, 1], [24.7, 0], [42.4, 0], [43.1, 0.75], [43.7, 0.75], [44.4, 0]]);
    const W: [string, number, number][] = [
      ['Walk', walkW, walking ? (x + 2.6) / 0.36 : 0],
      ['Crouch', crouchK > 0 ? Math.min(1, crouchK * 3) : 0, crouchK * 0.7],
      ['Think', win(t, 25.0, 32.0, 0.5), Math.min(t - 25.0, 2.45)],
      ['Point', win(t, 34.4, 38.8, 0.4), Math.min(t - 34.4, 1.45)],
      ['LookUp', win(t, 55.6, 58.0, 0.4), Math.min(t - 55.6, 1.45)],
      ['Wave', win(t, 57.6, 60.0, 0.3), Math.min(t - 57.6, 1.95)],
    ];
    let sum = W.reduce((s, w) => s + w[1], 0);
    const norm = sum > 1 ? 1 / sum : 1; sum = Math.min(1, sum);
    this.mixer.stopAllAction();
    const play = (n: string, wt: number, tt: number) => { if (wt <= 0.002) return; const a = this.mixer.clipAction(this.clips[n]!); a.play(); a.setEffectiveWeight(wt); a.time = Math.max(0, tt) % this.clips[n]!.duration; };
    for (const [n, wt, tt] of W) play(n, wt * norm, tt);
    play('Idle', 1 - sum, t);
    this.mixer.update(0);
    // head look on top of the clips
    this.rig.updateMatrixWorld(true);
    const left = new THREE.Vector3(1, 0, 0).applyQuaternion(this.rig.quaternion), up = new THREE.Vector3(0, 1, 0);
    const down = 0.38 * win(t, 9.1, 12.5, 0.5) + 0.3 * win(t, 14.0, 15.4, 0.4) + 0.25 * win(t, 42.2, 44.6, 0.4) + 0.12 * win(t, 46, 50.5, 0.6);
    const look = 0.35 * Math.sin((t - 30.0) * 2.4) * win(t, 30.0, 33.0, 0.5) + 0.2 * win(t, 46, 50.5, 0.6);
    this.turnBone(this.head, left, down); this.turnBone(this.head, up, look);
    // face
    const blink = [3.1, 6.9, 11.8, 18.2, 22.4, 27.9, 36.2, 40.8, 47.3, 53.9].some((b) => t > b && t < b + 0.13) ? 1 : 0;
    const face: Record<string, number> = {
      blink,
      smile: 0.35 * win(t, 1, 8, 1) + 0.9 * win(t, 35.4, 41.5, 0.5) + 0.6 * win(t, 44, 52, 0.8) + 1.0 * K.sstep(53.4, 54.2, t),
      browUp: 0.9 * win(t, 9.0, 10.8, 0.3) + 0.6 * win(t, 25.4, 31.8, 0.5) + 0.8 * win(t, 34.2, 35.6, 0.3) + 0.7 * win(t, 56.0, 58.5, 0.4),
      mouthOpen: 0.55 * win(t, 9.2, 10.4, 0.25) + 0.45 * win(t, 34.3, 35.3, 0.25) + 0.4 * win(t, 56.6, 57.6, 0.25),
    };
    for (const m of this.morphs) { const d = m.morphTargetDictionary!; for (const k in d) m.morphTargetInfluences![d[k]!] = Math.min(1, face[k] ?? 0); }
  }

  butterfly(t: number) {
    const f = this.fly, g = f.g;
    let p = new THREE.Vector3(...REST), flap = 0.35, yaw = 0.6, pitch = -1.45;
    const hand = () => { const h = new THREE.Vector3(); this.rig.getObjectByName('Head')!.getWorldPosition(h); return h; };
    if (t < 42.6) {
      // resting; slow wing opens; two failed take-offs
      flap = 0.15 + 0.55 * (0.5 + 0.5 * Math.sin(t * 1.6));
      const hop = (a: number) => Math.sin(K.c01((t - a) / 0.9) * Math.PI) * 0.07;
      p.y += hop(18.6) + hop(21.2);
      if ((t > 18.6 && t < 19.5) || (t > 21.2 && t < 22.1)) flap = 0.3 + 0.9 * Math.abs(Math.sin(t * K.TAU * 3));
    } else if (t < 51.6) {
      // lifts off weakly and follows beside Maya at shoulder height
      const k = K.eio((t - 42.6) / 1.4);
      const h = hand();
      const follow = new THREE.Vector3(h.x + 0.38, 0.62 + Math.sin(t * 3.1) * 0.05, 0.38 + Math.sin(t * 1.7) * 0.04);
      p = new THREE.Vector3(...REST).lerp(follow, k);
      flap = 0.2 + 0.85 * Math.abs(Math.sin(t * K.TAU * 2.1)); pitch = K.lerp(-1.45, -0.45, k); yaw = K.lerp(0.6, -1.3, k);
    } else if (t < 56.2) {
      // lands on the big flower and drinks
      const k = K.eio((t - 51.6) / 1.5), h = hand();
      const from = new THREE.Vector3(1.62 + 0.38, 0.62, 0.38);
      p = from.lerp(new THREE.Vector3(BLOOM[0], BLOOM[1] + 0.05, BLOOM[2]), k);
      flap = k < 0.98 ? 0.25 + 0.8 * Math.abs(Math.sin(t * K.TAU * 2.2)) : 0.15 + 0.5 * (0.5 + 0.5 * Math.sin(t * 2.2));
      pitch = K.lerp(-0.45, -1.4, k); yaw = -1.3; void h;
    } else {
      // full of energy: spirals up and away
      const k = (t - 56.2) / 3.6, e = k * k;
      p = new THREE.Vector3(BLOOM[0] + Math.sin(k * 7) * 0.25 * k - 0.3 * e, BLOOM[1] + 0.05 + 1.6 * e + 0.3 * k, BLOOM[2] + Math.cos(k * 7) * 0.2 * k - 0.6 * e);
      flap = 0.2 + 1.1 * Math.abs(Math.sin(t * K.TAU * 3.4)); pitch = -0.35; yaw = -1.3 + k * 3;
    }
    g.position.copy(p);
    g.rotation.set(pitch, yaw, 0, 'YXZ');
    f.wl.rotation.z = flap; f.wr.rotation.z = -flap;
  }

  override render(f: Frame, out: THREE.WebGLRenderTarget) {
    const t = f.lt;
    this.actMaya(t);
    this.butterfly(t);
    let i = 0; while (i < SHOTS.length - 1 && t >= SHOTS[i + 1]!.t) i++;
    const S = SHOTS[i]!, end = SHOTS[i + 1]?.t ?? 60, k = K.eio((t - S.t) / (end - S.t));
    this.cam.fov = 34; this.cam.updateProjectionMatrix();
    this.cam.position.set(S.pos[0] + S.push[0] * k, S.pos[1] + S.push[1] * k, S.pos[2] + S.push[2] * k);
    this.cam.lookAt(S.to[0] + (i === 5 ? S.push[0] * k : 0), S.to[1], S.to[2]);
    K.draw(this.ctx.renderer, this.s, this.cam, out);
    return { ...K.POST, fade: 1 - K.sstep(0, 0.8, t) + K.sstep(59.2, 60, t) };
  }
}
