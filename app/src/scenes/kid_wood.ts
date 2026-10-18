// Style F — Wooden toy: painted, varnished wood with visible grain, ball joints, a plank floor,
// lollipop trees and a rigid toy waddle instead of a soft walk.
import * as THREE from 'three';
import { Scene, type Frame } from '../engine/scene';
import * as K from './_kid';

export default class KidWood extends Scene {
  s = new THREE.Scene(); cam = K.camera();
  maya!: K.Maya; fly!: K.Fly;
  override init() {
    K.prep(this.ctx.renderer);
    const grain = (lines: number) => K.tex(512, (u, v) => {
      const w = Math.sin((v * lines + K.fbm(u * 2, v * 8, 1) * 3.0) * K.TAU);
      return K.grey(0.78 + 0.16 * (0.5 + 0.5 * w) + 0.06 * K.fbm(u * 60, v * 4, 2));
    }, false);
    const g1 = grain(9), g2 = grain(4);
    const painted = new Set(['dress', 'shoe', 'clip', 'eye', 'white', 'cheek', 'mouth', 'wing', 'body', 'leaf', 'flower', 'roof']);
    const M = K.cached((role, col) => {
      const p = painted.has(role);
      return new THREE.MeshPhysicalMaterial({ color: col, map: p ? null : g1, bumpMap: g1, bumpScale: p ? 0.25 : 0.8, roughness: p ? 0.42 : 0.6, clearcoat: p ? 0.7 : 0.35, clearcoatRoughness: 0.3 });
    });
    const s = this.s;
    s.background = K.skyTex('#CFE3EC', '#F3E6D2');
    s.add(new THREE.HemisphereLight('#FFF3E2', '#D8B88E', 1.25));
    s.add(K.keyLight('#FFE3BE', 2.4, [-3, 5.5, 4.5]));
    const floorTex = K.tex(1024, (u, v) => {
      const plank = Math.floor(u * 8), pu = u * 8 - plank, seam = pu < 0.02 || pu > 0.98 ? 0.55 : 1;
      const w = Math.sin((pu * 3 + K.fbm(pu * 2, v * 6 + plank * 3.1, plank) * 2.5) * K.TAU * 2);
      const tone = 0.85 + 0.08 * K.vn3(plank * 3.3, 0.5, 2);
      return K.grey(seam * tone * (0.84 + 0.12 * (0.5 + 0.5 * w)));
    }, true, 1);
    floorTex.repeat.set(2, 2);
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(20, 20), new THREE.MeshPhysicalMaterial({ color: '#D9AE7E', map: floorTex, roughness: 0.55, clearcoat: 0.3, clearcoatRoughness: 0.4 }));
    floor.rotation.x = -Math.PI / 2; floor.rotation.z = Math.PI / 2; floor.receiveShadow = true; s.add(floor);
    // painted wooden backdrop hills
    for (const [x, z, r, c] of [[-2.8, -4, 2.4, '#9CCB7C'], [2.2, -4.6, 2.9, '#86BE6C']] as const) {
      const h = new THREE.Mesh(new THREE.CylinderGeometry(r, r, 0.2, 64, 1, false, -Math.PI / 2, Math.PI), M('leaf', c));
      h.rotation.x = -Math.PI / 2; h.position.set(x, 0, z); h.castShadow = h.receiveShadow = true; s.add(h);
    }
    const tree = K.buildTree(M, '#C99A6A', '#6FBF67', { lolli: true }); tree.position.set(1.25, 0, -0.95); s.add(tree);
    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.56, 0.035, 12, 48), M('roof', '#FFD23F')); ring.position.set(1.25, 1.5, -0.95); s.add(ring);
    for (const [x, z, c] of [[-1.25, 0.95, '#F2789B'], [0.65, 1.15, '#FFC93C'], [1.95, 0.45, '#9F86F0'], [-2.2, -0.35, '#FFC93C']] as const) {
      const st = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.2, 10), M('stem', '#C99A6A')); st.position.set(x, 0.1, z); s.add(st);
      const b = new THREE.Mesh(new THREE.SphereGeometry(0.055, 20, 12), M('flower', c)); b.position.set(x, 0.22, z); b.castShadow = true; s.add(b);
    }
    for (const [x, z, c] of [[-2.5, -1.2, '#F2789B'], [2.75, -1.5, '#5B8FD6']] as const) {
      const b = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.34, 0.34), M('flower', c)); b.position.set(x, 0.17, z); b.rotation.y = 0.5; b.castShadow = b.receiveShadow = true; s.add(b);
    }
    this.maya = K.buildMaya(M, { joints: true, curls: 9, curlR: 0.085, flatFace: true, seg: 32 }); s.add(this.maya.root);
    this.fly = K.buildFly(M, '#FF8A5C'); s.add(this.fly.g);
  }
  render(f: Frame, out: THREE.WebGLRenderTarget) {
    K.poseMaya(this.maya, f.lt, { toy: true }); K.poseFly(this.fly, f.lt);
    this.cam.position.z = 4.7 - 0.12 * K.eio(f.lt / 3);
    K.draw(this.ctx.renderer, this.s, this.cam, out);
    return K.POST;
  }
}
