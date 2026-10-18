// Style B — Clay / stop-motion-inspired: lumpy sculpted forms, fingerprint bump, characters
// posed at 12 fps while the camera glides at full frame rate.
import * as THREE from 'three';
import { Scene, type Frame } from '../engine/scene';
import * as K from './_kid';

export default class KidClay extends Scene {
  s = new THREE.Scene(); cam = K.camera();
  maya!: K.Maya; fly!: K.Fly;
  override init() {
    K.prep(this.ctx.renderer);
    const thumb = K.tex(512, (u, v) => {
      const n = K.fbm(u * 7, v * 7, 1.3);
      const ridge = 0.5 + 0.5 * Math.sin(n * 46 + u * 9);
      return K.grey(0.35 * K.fbm(u * 26, v * 26, 3.1) + 0.35 * ridge * K.fbm(u * 3, v * 3, 7) + 0.3 * n);
    }, false, 2);
    const M = K.cached((role, col) => new THREE.MeshStandardMaterial({
      color: col, roughness: role === 'eye' ? 0.45 : 0.9, bumpMap: thumb, bumpScale: role === 'eye' ? 0.3 : 2.2,
    }));
    const s = this.s;
    s.background = K.skyTex('#F3D7B0', '#F7E9D2');
    s.add(new THREE.HemisphereLight('#FFEBD0', '#A9C48C', 1.25));
    s.add(K.keyLight('#FFD9AA', 2.3, [-3.5, 5, 4]));
    const ground = new THREE.Mesh(K.lumpy(new THREE.CircleGeometry(14, 96, 0, Math.PI * 2), 0.05, 1.2), M('ground', '#8FC46C'));
    ground.rotation.x = -Math.PI / 2; ground.receiveShadow = true; s.add(ground);
    const hill = new THREE.Mesh(K.lumpy(new THREE.SphereGeometry(7, 64, 32), 0.18, 0.6), M('hill', '#7DB660')); hill.position.set(1, -6.2, -7.5); hill.receiveShadow = true; s.add(hill);
    const tree = K.buildTree(M, '#9C6B45', '#5FAE57', { lump: 0.012 }); tree.position.set(1.25, 0, -0.95); s.add(tree);
    for (const [x, z, c] of [[-1.2, 0.9, '#F27A9B'], [0.6, 1.1, '#FFC93C'], [1.9, 0.4, '#A98BF0'], [-2.1, -0.3, '#FFC93C'], [2.4, -0.6, '#F27A9B']] as const) {
      const b = new THREE.Mesh(K.lumpy(new THREE.SphereGeometry(0.07, 20, 12), 0.012, 30), M('flower', c)); b.position.set(x, 0.05, z); b.scale.y = 0.7; b.castShadow = true; s.add(b);
    }
    for (const [x, z, r] of [[-2.6, -1.4, 0.38], [2.9, -1.8, 0.45]] as const) {
      const b = new THREE.Mesh(K.lumpy(new THREE.SphereGeometry(r, 40, 20), 0.03, 5), M('leaf', '#6DBA5E')); b.position.set(x, r * 0.55, z); b.castShadow = b.receiveShadow = true; s.add(b);
    }
    this.maya = K.buildMaya(M, { lump: 0.007, seg: 48 }); s.add(this.maya.root);
    this.fly = K.buildFly(M, '#FF8754'); s.add(this.fly.g);
  }
  render(f: Frame, out: THREE.WebGLRenderTarget) {
    K.poseMaya(this.maya, f.lt, { step: 12 }); K.poseFly(this.fly, f.lt, { step: 12 });
    this.cam.position.x = 0.15 + 0.18 * K.eio(f.lt / 3);
    this.cam.lookAt(0.15, 0.78, 0);
    K.draw(this.ctx.renderer, this.s, this.cam, out);
    return K.POST;
  }
}
