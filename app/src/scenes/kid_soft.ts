// Style A — Soft Storybook 3D: rounded forms, matte pastel materials, warm soft key light.
import * as THREE from 'three';
import { Scene, type Frame } from '../engine/scene';
import * as K from './_kid';

export default class KidSoft extends Scene {
  s = new THREE.Scene(); cam = K.camera();
  maya!: K.Maya; fly!: K.Fly;
  override init() {
    K.prep(this.ctx.renderer);
    const M = K.cached((role, col) => new THREE.MeshStandardMaterial({ color: col, roughness: role === 'eye' ? 0.3 : 0.84, metalness: 0 }));
    const s = this.s;
    s.background = K.skyTex('#BFE3F5', '#FBEFD9');
    s.add(new THREE.HemisphereLight('#FFF3DF', '#BFD9A8', 1.35));
    s.add(K.keyLight('#FFE3BD', 2.1, [-3, 5.5, 4.5]));
    const ground = new THREE.Mesh(new THREE.CircleGeometry(14, 64), M('ground', '#B9DE9A')); ground.rotation.x = -Math.PI / 2; ground.receiveShadow = true; s.add(ground);
    const hill = new THREE.Mesh(new THREE.SphereGeometry(7, 64, 32), M('hill', '#A6D48E')); hill.position.set(1, -6.2, -7.5); hill.receiveShadow = true; s.add(hill);
    const hill2 = new THREE.Mesh(new THREE.SphereGeometry(6, 64, 32), M('hill', '#C4E3A6')); hill2.position.set(-6, -5.1, -9); s.add(hill2);
    const tree = K.buildTree(M, '#B98A62', '#86C77A'); tree.position.set(1.25, 0, -0.95); s.add(tree);
    for (const [x, z, c] of [[-1.2, 0.9, '#FFB4C8'], [0.6, 1.1, '#FFE08A'], [1.9, 0.4, '#C9B6FF'], [-2.1, -0.3, '#FFE08A'], [0.15, -1.6, '#FFB4C8'], [2.4, -0.6, '#FFB4C8']] as const) {
      const f = new THREE.Group();
      const st = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.01, 0.16), M('leaf', '#6FB46A')); st.position.y = 0.08; f.add(st);
      const b = new THREE.Mesh(new THREE.SphereGeometry(0.045, 16, 10), M('flower', c)); b.position.y = 0.17; b.castShadow = true; f.add(b);
      f.position.set(x, 0, z); s.add(f);
    }
    for (const [x, z, r] of [[-2.6, -1.4, 0.38], [2.9, -1.8, 0.45], [-0.6, -2.4, 0.3]] as const) {
      const b = new THREE.Mesh(new THREE.SphereGeometry(r, 32, 16), M('leaf', '#93CF84')); b.position.set(x, r * 0.55, z); b.castShadow = b.receiveShadow = true; s.add(b);
    }
    this.maya = K.buildMaya(M); s.add(this.maya.root);
    this.fly = K.buildFly(M, '#FF9E6E'); s.add(this.fly.g);
  }
  render(f: Frame, out: THREE.WebGLRenderTarget) {
    K.poseMaya(this.maya, f.lt); K.poseFly(this.fly, f.lt);
    this.cam.position.z = 4.7 - 0.12 * K.eio(f.lt / 3);
    K.draw(this.ctx.renderer, this.s, this.cam, out);
    return K.POST;
  }
}
