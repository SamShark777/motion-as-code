// Style D — Paper-cut 2.5D: hand-cut flat layers at different depths casting soft shadows on
// each other, a puppet Maya with pinned joints (posed at 15 fps), camera trucking for parallax.
import * as THREE from 'three';
import { Scene, type Frame } from '../engine/scene';
import * as K from './_kid';

const jit = (x: number, y: number, a: number) => [x + (K.vn3(x * 9, y * 9, 1) - 0.5) * a, y + (K.vn3(x * 9, y * 9, 5) - 0.5) * a] as const;

export default class KidPaper extends Scene {
  s = new THREE.Scene(); cam = new THREE.PerspectiveCamera(22, 1920 / 1080, 0.1, 60);
  M!: K.MatFn;
  p!: { root: THREE.Group; hips: THREE.Group; legL: THREE.Group; legR: THREE.Group; armL: THREE.Group; armR: THREE.Group; head: THREE.Group; mouth: THREE.Object3D; eyes: THREE.Object3D[] };
  fly!: K.Fly;
  mesh(shape: THREE.Shape | THREE.Shape[], col: string, z: number, parent: THREE.Object3D = this.s) {
    const m = new THREE.Mesh(new THREE.ExtrudeGeometry(shape, { depth: 0.012, bevelEnabled: false, curveSegments: 24 }), this.M('paper', col));
    m.position.z = z; m.castShadow = m.receiveShadow = true; parent.add(m); return m;
  }
  poly(pts: (readonly [number, number])[], a = 0.02) { const s = new THREE.Shape(); pts.forEach(([x, y], i) => { const [jx, jy] = jit(x, y, a); i ? s.lineTo(jx, jy) : s.moveTo(jx, jy); }); return s; }
  circle(x: number, y: number, r: number, a = 0.012) { const pts: [number, number][] = []; for (let i = 0; i < 40; i++) { const t = (i / 40) * K.TAU; pts.push([x + Math.cos(t) * r, y + Math.sin(t) * r]); } return this.poly(pts, a); }
  hills(y: number, amp: number, f: number, ph: number) { const pts: [number, number][] = [[-9, -3]]; for (let i = 0; i <= 60; i++) { const x = -9 + (i / 60) * 18; pts.push([x, y + Math.sin(x * f + ph) * amp + Math.sin(x * f * 2.3 + ph) * amp * 0.3]); } pts.push([9, -3]); return this.poly(pts, 0.03); }
  override init() {
    K.prep(this.ctx.renderer);
    const fiber = K.tex(512, (u, v) => { const n = K.fbm(u * 40, v * 40, 2) * 0.5 + K.fbm(u * 6, v * 90, 4) * 0.5; return K.grey(0.86 + 0.14 * n); }, false, 3);
    this.M = K.cached((role, col) => new THREE.MeshStandardMaterial({ color: col, roughness: 1, map: fiber, bumpMap: fiber, bumpScale: 0.6 }));
    const s = this.s;
    s.background = K.skyTex('#CDE6F2', '#F6EBDA');
    s.add(new THREE.HemisphereLight('#FFF6E8', '#E8DCC6', 1.9));
    const key = K.keyLight('#FFE9CC', 1.35, [-2.2, 3, 7], 6); key.shadow.radius = 8; s.add(key);
    this.mesh(this.poly([[-9, -3], [9, -3], [9, 5], [-9, 5]], 0), '#CFE7F3', -3.2);
    this.mesh([this.circle(2.6, 2.2, 0.45), this.circle(3.1, 2.3, 0.35), this.circle(2.2, 2.1, 0.3)], '#FFFFFF', -2.6);
    this.mesh([this.circle(-2.4, 2.55, 0.32), this.circle(-2.0, 2.5, 0.26)], '#FFFFFF', -2.6);
    this.mesh(this.hills(0.95, 0.35, 0.55, 0.4), '#BFDDA0', -2.0);
    this.mesh(this.hills(0.55, 0.22, 0.9, 2.1), '#A3CF86', -1.3);
    // tree
    const tree = new THREE.Group(); tree.position.set(1.35, 0, -0.7); s.add(tree);
    this.mesh(this.poly([[-0.09, 0], [0.09, 0], [0.07, 1.25], [-0.07, 1.25]]), '#B5835A', 0, tree);
    this.mesh([this.circle(0, 1.45, 0.48), this.circle(-0.38, 1.2, 0.33), this.circle(0.4, 1.25, 0.35), this.circle(0.05, 1.82, 0.32)], '#7DC173', 0.02, tree);
    this.mesh(this.hills(0.18, 0.05, 1.6, 0.7), '#92C978', -0.25);
    // foreground grass + flowers
    this.mesh(this.hills(-0.12, 0.06, 3.1, 1.3), '#7EBE6A', 0.9);
    for (const [x, c] of [[-2.2, '#FFB4C8'], [-0.9, '#FFE08A'], [0.8, '#C9B6FF'], [2.3, '#FFB4C8']] as const) {
      this.mesh(this.poly([[x - 0.01, -0.2], [x + 0.01, -0.2], [x + 0.01, 0.12], [x - 0.01, 0.12]], 0.004), '#5FA35A', 0.95);
      this.mesh(this.circle(x, 0.15, 0.06, 0.008), c, 0.97);
    }
    // puppet Maya
    const P = { root: new THREE.Group() } as any; s.add(P.root);
    P.hips = new THREE.Group(); P.hips.position.y = 0.42; P.root.add(P.hips);
    const leg = (dx: number, z: number) => { const g = new THREE.Group(); g.position.set(dx, 0.02, z); P.hips.add(g);
      this.mesh(this.poly([[-0.04, -0.34], [0.04, -0.34], [0.045, 0], [-0.045, 0]], 0.006), K.MAYA.skin, 0, g);
      this.mesh(this.poly([[-0.06, -0.41], [0.1, -0.41], [0.1, -0.35], [-0.05, -0.33]], 0.006), K.MAYA.shoe, 0.014, g); return g; };
    P.legR = leg(-0.05, -0.04); P.legL = leg(0.05, 0.0);
    const arm = (dx: number, z: number) => { const g = new THREE.Group(); g.position.set(dx, 0.33, z); P.hips.add(g);
      this.mesh(this.poly([[-0.033, -0.3], [0.033, -0.3], [0.036, 0], [-0.036, 0]], 0.006), K.MAYA.skin, 0, g);
      this.mesh(this.circle(0, -0.3, 0.048, 0.005), K.MAYA.skin, 0.002, g); return g; };
    P.armR = arm(-0.1, -0.03);
    this.mesh(this.poly([[-0.21, 0], [0.21, 0], [0.11, 0.37], [-0.11, 0.37]], 0.012), K.MAYA.dress, 0.03, P.hips);
    this.mesh([this.circle(-0.12, 0.33, 0.065), this.circle(0.12, 0.33, 0.065)], K.MAYA.dress, 0.035, P.hips);
    P.armL = arm(0.1, 0.05);
    P.head = new THREE.Group(); P.head.position.set(0, 0.37, 0.07); P.hips.add(P.head);
    const curls: THREE.Shape[] = [this.circle(0, 0.22, 0.225)];
    for (let k = 0; k < 11; k++) { const a = K.lerp(-0.2, Math.PI + 0.2, k / 10); curls.push(this.circle(Math.cos(a) * 0.2, 0.24 + Math.sin(a) * 0.2, 0.075)); }
    this.mesh(curls, K.MAYA.hair, -0.01, P.head);
    this.mesh(this.circle(0, 0.2, 0.19), K.MAYA.skin, 0.004, P.head);
    this.mesh([this.circle(-0.12, 0.36, 0.06), this.circle(0, 0.39, 0.065), this.circle(0.12, 0.36, 0.06)], K.MAYA.hair, 0.018, P.head);
    const st = new THREE.Shape(); for (let i = 0; i < 10; i++) { const r = i % 2 ? 0.026 : 0.058, a = Math.PI / 2 + (i * Math.PI) / 5; i ? st.lineTo(0.16 + Math.cos(a) * r, 0.36 + Math.sin(a) * r) : st.moveTo(0.16 + Math.cos(a) * r, 0.36 + Math.sin(a) * r); }
    this.mesh(st, K.MAYA.clip, 0.03, P.head);
    P.eyes = [];
    for (const dx of [-0.07, 0.07]) { const e = new THREE.Group(); e.position.set(dx, 0.21, 0.02); P.head.add(e); this.mesh(this.circle(0, 0, 0.026, 0.003), K.MAYA.eye, 0, e); this.mesh(this.circle(0.008, 0.009, 0.008, 0.001), '#FFFFFF', 0.012, e); P.eyes.push(e); }
    this.mesh([this.circle(-0.115, 0.15, 0.03, 0.004), this.circle(0.115, 0.15, 0.03, 0.004)], K.MAYA.cheek, 0.02, P.head);
    const mouth = new THREE.Group(); mouth.position.set(0, 0.135, 0.02); P.head.add(mouth);
    const sm = new THREE.Mesh(new THREE.RingGeometry(0.03, 0.042, 24, 1, Math.PI, Math.PI), this.M('paper', K.MAYA.mouth)); mouth.add(sm); P.mouth = mouth;
    this.p = P;
    this.fly = K.buildFly(this.M, '#FF8A5C', '#3A2A2A', true); s.add(this.fly.g);
  }
  render(f: Frame, out: THREE.WebGLRenderTarget) {
    const t = Math.floor(f.lt * 15) / 15, P = this.p;
    const w = K.c01(t / 1.55), x = K.lerp(-1.85, -0.35, 1 - (1 - w) * (1 - w));
    const ph = (x + 1.85) * 7.6, amp = 0.45 * (1 - K.sstep(1.1, 1.55, t)), sw = Math.sin(ph) * amp;
    P.root.position.set(x, 0, 0);
    P.hips.position.y = 0.42 + Math.abs(Math.cos(ph)) * 0.04 * amp;
    P.legL.rotation.z = sw; P.legR.rotation.z = -sw;
    const L = K.eio((t - 1.55) / 0.7), sm = K.eio((t - 2.12) / 0.5), r = K.eio((t - 2.3) / 0.55);
    P.head.rotation.z = -0.22 * L;
    P.armR.rotation.z = -sw * 0.8;
    P.armL.rotation.z = K.lerp(sw * 0.8, 2.3, r);
    for (const e of P.eyes) { e.position.y = 0.21 + 0.012 * L; e.position.x = Math.sign(e.position.x) * 0.07 + 0.012 * L; e.scale.y = K.lerp(1, 0.75, sm); }
    P.mouth.scale.set(K.lerp(0.8, 1.15, sm), K.lerp(0.3, 1.05, sm), 1);
    K.poseFly(this.fly, f.lt, { step: 15, flat: true });
    this.fly.g.position.z = 0.4;
    const k = K.eio(f.lt / 3);
    this.cam.position.set(K.lerp(-0.3, 0.35, k), 0.95, 8.0); this.cam.lookAt(K.lerp(-0.3, 0.35, k) * 0.6, 0.85, 0);
    K.draw(this.ctx.renderer, this.s, this.cam, out);
    return K.POST;
  }
}
