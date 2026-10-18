// Style E — Felt / handmade textile: fuzzy sheen materials, fibre bump, running stitches on seams,
// cotton-ball clouds against a felt backdrop.
import * as THREE from 'three';
import { Scene, type Frame } from '../engine/scene';
import * as K from './_kid';

export default class KidFelt extends Scene {
  s = new THREE.Scene(); cam = K.camera();
  maya!: K.Maya; fly!: K.Fly;
  stitches(r: number, n: number, col: string, M: K.MatFn, rx = r) {
    const geo = new THREE.CapsuleGeometry(0.006, 0.03, 3, 6), g = new THREE.Group();
    for (let i = 0; i < n; i++) {
      const a = (i / n) * K.TAU, m = new THREE.Mesh(geo, M('thread', col));
      m.position.set(Math.cos(a) * rx, 0, Math.sin(a) * r);
      m.rotation.set(Math.PI / 2, 0, -a + Math.PI / 2 - Math.PI / 2); m.rotation.order = 'YXZ'; m.rotation.y = -a; m.rotation.x = Math.PI / 2;
      g.add(m);
    }
    return g;
  }
  override init() {
    K.prep(this.ctx.renderer);
    const fuzz = K.tex(512, (u, v) => K.grey(0.45 * K.fbm(u * 90, v * 90, 1, 3) + 0.35 * K.fbm(u * 160, v * 40, 2, 2) + 0.2 * K.fbm(u * 12, v * 12, 3)), false, 2);
    const M = K.cached((role, col) => {
      if (role === 'eye' || role === 'thread') return new THREE.MeshStandardMaterial({ color: col, roughness: 0.75 });
      const c = new THREE.Color(col);
      return new THREE.MeshPhysicalMaterial({ color: c, roughness: 1, sheen: 1, sheenRoughness: 0.55, sheenColor: c.clone().lerp(new THREE.Color('#ffffff'), 0.45), bumpMap: fuzz, bumpScale: 3.5 });
    });
    const s = this.s;
    s.background = new THREE.Color('#BFE0EE');
    const back = new THREE.Mesh(new THREE.PlaneGeometry(30, 14), M('back', '#B9DCEB')); back.position.set(0, 4, -6); back.receiveShadow = true; s.add(back);
    s.add(new THREE.HemisphereLight('#FFF4E6', '#C6DDA9', 1.3));
    s.add(K.keyLight('#FFE6C4', 2.2, [-3, 5, 4.5]));
    const ground = new THREE.Mesh(new THREE.CircleGeometry(14, 64), M('ground', '#A9D58A')); ground.rotation.x = -Math.PI / 2; ground.receiveShadow = true; s.add(ground);
    const patch = new THREE.Mesh(new THREE.CircleGeometry(1, 64), M('patch', '#8CC873')); patch.rotation.x = -Math.PI / 2; patch.scale.set(2.2, 1.1, 1); patch.position.set(-0.6, 0.004, 0.1); patch.receiveShadow = true; s.add(patch);
    const ps = this.stitches(1.03, 70, '#F7F3E8', M, 2.27); ps.position.set(-0.6, 0.008, 0.1); s.add(ps);
    const hill = new THREE.Mesh(new THREE.SphereGeometry(7, 64, 32), M('hill', '#97CC7E')); hill.position.set(1, -6.2, -5.5); hill.receiveShadow = true; s.add(hill);
    for (const [x, y, z] of [[-2.2, 2.6, -4.5], [2.4, 2.9, -4.8]] as const) {
      for (const [dx, dy, r] of [[0, 0, 0.42], [0.45, -0.08, 0.32], [-0.42, -0.1, 0.3], [0.15, 0.25, 0.3]] as const) {
        const b = new THREE.Mesh(new THREE.SphereGeometry(r, 32, 16), M('cloud', '#FFFFFF')); b.position.set(x + dx, y + dy, z); b.castShadow = true; s.add(b);
      }
    }
    const tree = K.buildTree(M, '#B98A62', '#7DBF6E'); tree.position.set(1.25, 0, -0.95); s.add(tree);
    for (const [x, z, c] of [[-1.25, 0.95, '#FF9EB8'], [0.65, 1.15, '#FFD86E'], [1.9, 0.45, '#BBA3FF'], [-2.2, -0.35, '#FFD86E']] as const) {
      const b = new THREE.Mesh(new THREE.SphereGeometry(0.07, 20, 12), M('flower', c)); b.scale.y = 0.55; b.position.set(x, 0.04, z); b.castShadow = true; s.add(b);
    }
    this.maya = K.buildMaya(M); s.add(this.maya.root);
    const hem = this.stitches(0.2, 30, '#FFFFFF', M); hem.position.y = 0.0; this.maya.torso.add(hem);
    this.fly = K.buildFly(M, '#FF9E6E'); s.add(this.fly.g);
  }
  render(f: Frame, out: THREE.WebGLRenderTarget) {
    K.poseMaya(this.maya, f.lt); K.poseFly(this.fly, f.lt);
    this.cam.position.z = 4.7 - 0.12 * K.eio(f.lt / 3);
    K.draw(this.ctx.renderer, this.s, this.cam, out);
    return K.POST;
  }
}
