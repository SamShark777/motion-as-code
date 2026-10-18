// Clip check for the rigged canonical Maya: plays each registered clip in turn, driven by frame time.
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { Scene, type Frame } from '../engine/scene';
import * as K from './_kid';

export const CLIPS: [string, number, Record<string, number>][] = [
  ['Idle', 2, {}], ['Walk', 2, {}], ['Wave', 2, { smile: 1 }], ['LookUp', 1.5, { browUp: 1, mouthOpen: 0.6 }],
  ['Point', 1.5, { smile: 0.6 }], ['Happy', 2, { smile: 1, blink: 0 }], ['Crouch', 1.5, {}], ['Think', 2.5, {}],
];
export default class KidRig extends Scene {
  s = new THREE.Scene(); cam = new THREE.PerspectiveCamera(30, 1920 / 1080, 0.01, 100);
  mixer!: THREE.AnimationMixer; clips = new Map<string, THREE.AnimationClip>(); root!: THREE.Object3D;
  morphs: THREE.Mesh[] = [];
  override async init() {
    K.prep(this.ctx.renderer);
    const g = await new GLTFLoader().loadAsync('characters/maya/maya.glb');
    this.root = g.scene; this.s.add(this.root);
    this.root.traverse((o: any) => { if (o.isMesh) { o.castShadow = o.receiveShadow = true; if (o.morphTargetDictionary) this.morphs.push(o); } });
    this.mixer = new THREE.AnimationMixer(this.root);
    for (const c of g.animations) this.clips.set(c.name, c);
    console.warn('CLIPS ' + [...this.clips.keys()].join(',') + ' morphs ' + this.morphs.map((m) => Object.keys(m.morphTargetDictionary!).join('/')).join(' '));
    this.s.background = new THREE.Color('#E9E4DA');
    this.s.add(new THREE.HemisphereLight('#FFF6EA', '#CBBFAE', 1.4));
    this.s.add(K.keyLight('#FFE6C8', 2.2, [-2, 4, 4], 3));
    const fl = new THREE.Mesh(new THREE.CircleGeometry(20, 64), new THREE.MeshStandardMaterial({ color: '#E2DCCF', roughness: 1 })); fl.rotation.x = -Math.PI / 2; fl.receiveShadow = true; this.s.add(fl);
  }
  render(f: Frame, out: THREE.WebGLRenderTarget) {
    let t = f.lt, i = 0;
    while (i < CLIPS.length - 1 && t >= CLIPS[i]![1]) { t -= CLIPS[i]![1]; i++; }
    const [name, , face] = CLIPS[i]!;
    this.mixer.stopAllAction();
    const a = this.mixer.clipAction(this.clips.get(name)!); a.reset(); a.play();
    this.mixer.setTime(Math.min(t, this.clips.get(name)!.duration - 1e-3) );
    const blink = (t % 2.2) > 2.05 ? 1 : 0;
    for (const m of this.morphs) { const d = m.morphTargetDictionary!; for (const k in d) m.morphTargetInfluences![d[k]!] = k === 'blink' ? blink : (face[k] ?? 0); }
    this.root.rotation.y = 0.45;
    this.cam.position.set(0, 0.85, 3.6); this.cam.lookAt(0, 0.72, 0);
    K.draw(this.ctx.renderer, this.s, this.cam, out);
    return K.POST;
  }
}
