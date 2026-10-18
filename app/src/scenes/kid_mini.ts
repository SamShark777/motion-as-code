// Style C — Miniature diorama: the park sits on a round tabletop base with a soil cross-section,
// toy houses behind; elevated camera drifting sideways, tilt-shift blur focused on Maya.
import * as THREE from 'three';
import { Scene, type Frame } from '../engine/scene';
import { FSPass, makeRT } from '../engine/gl';
import * as K from './_kid';

export default class KidMini extends Scene {
  s = new THREE.Scene(); cam = new THREE.PerspectiveCamera(28, 1920 / 1080, 0.1, 80);
  maya!: K.Maya; fly!: K.Fly;
  tmp = makeRT();
  tilt = new FSPass(/* glsl */ `
    uniform sampler2D srcTex; uniform vec2 texel; uniform float focusY;
    void main() {
      float d = abs(vUv.y - focusY);
      float r = smoothstep(0.1, 0.42, d) * 11.0;
      vec4 acc = texture(srcTex, vUv); float ws = 1.0;
      if (r > 0.25) {
        for (int i = 0; i < 40; i++) {
          float fi = float(i);
          float a = fi * 2.39996, rr = sqrt((fi + 0.5) / 40.0) * r;
          acc += texture(srcTex, vUv + vec2(cos(a), sin(a)) * rr * texel); ws += 1.0;
        }
      }
      fragColor = acc / ws;
    }`, { srcTex: { value: null }, texel: { value: new THREE.Vector2() }, focusY: { value: 0.5 } });
  override init() {
    K.prep(this.ctx.renderer);
    const M = K.cached((role, col) => new THREE.MeshStandardMaterial({ color: col, roughness: role === 'eye' ? 0.3 : 0.78 }));
    const s = this.s;
    s.background = K.skyTex('#E8D9C6', '#D9C2A6');
    s.add(new THREE.HemisphereLight('#FFF1DE', '#C9A982', 1.2));
    s.add(K.keyLight('#FFE2B8', 2.4, [-3, 6, 3.5], 5));
    // table
    const table = new THREE.Mesh(new THREE.PlaneGeometry(40, 40), M('table', '#B88B60')); table.rotation.x = -Math.PI / 2; table.position.y = -0.36; table.receiveShadow = true; s.add(table);
    // base: grass top, soil + rock layers on the side
    const R = 2.75;
    const layers: [number, number, string][] = [[0, 0.1, '#7A5236'], [0.1, 0.16, '#5E3E29'], [0.26, 0.1, '#8A6A55']];
    for (const [y0, h, c] of layers) {
      const m = new THREE.Mesh(new THREE.CylinderGeometry(R - y0 * 0.08, R - (y0 + h) * 0.08, h, 96), M('soil', c));
      m.position.y = -y0 - h / 2; m.castShadow = m.receiveShadow = true; s.add(m);
    }
    const top = new THREE.Mesh(new THREE.CircleGeometry(R + 0.005, 96), M('ground', '#9ED37F')); top.rotation.x = -Math.PI / 2; top.position.y = 0.001; top.receiveShadow = true; s.add(top);
    const path = new THREE.Mesh(new THREE.PlaneGeometry(4.6, 0.55), M('path', '#EAD9B8')); path.rotation.x = -Math.PI / 2; path.position.set(-0.4, 0.004, 0.1); path.receiveShadow = true; s.add(path);
    const pond = new THREE.Mesh(new THREE.CircleGeometry(0.42, 48), new THREE.MeshStandardMaterial({ color: '#7FC3E8', roughness: 0.15 })); pond.rotation.x = -Math.PI / 2; pond.scale.set(1.4, 1, 1); pond.position.set(1.7, 0.005, 1.0); s.add(pond);
    // houses
    for (const [x, z, wall, roof, sc] of [[-1.9, -1.3, '#FFE6C7', '#E86F5A', 1], [-0.7, -1.75, '#D8ECFF', '#5B8FD6', 0.85], [0.35, -1.95, '#FFF3B0', '#7FBF6A', 0.75]] as const) {
      const h = new THREE.Group();
      const b = new THREE.Mesh(new THREE.BoxGeometry(0.62, 0.55, 0.55), M('wall', wall)); b.position.y = 0.275;
      const r = new THREE.Mesh(new THREE.ConeGeometry(0.52, 0.42, 4), M('roof', roof)); r.position.y = 0.76; r.rotation.y = Math.PI / 4;
      const d = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.24, 0.02), M('door', '#8A5A3C')); d.position.set(0, 0.12, 0.28);
      const w = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.12, 0.02), M('win', '#FFF8E6')); w.position.set(0.18, 0.34, 0.28);
      for (const m of [b, r, d, w]) { m.castShadow = m.receiveShadow = true; h.add(m); }
      h.position.set(x, 0, z); h.scale.setScalar(sc); s.add(h);
    }
    const tree = K.buildTree(M, '#A77A52', '#7CC46A'); tree.position.set(1.25, 0, -0.85); s.add(tree);
    for (const [x, z, sc] of [[2.2, -1.2, 0.55], [-2.35, 0.3, 0.45], [2.35, 0.2, 0.4], [-1.3, 1.6, 0.35]] as const) {
      const t = K.buildTree(M, '#A77A52', '#8FD07A', { lolli: true }); t.position.set(x, 0, z); t.scale.setScalar(sc); s.add(t);
    }
    this.maya = K.buildMaya(M); s.add(this.maya.root);
    this.fly = K.buildFly(M, '#FF9E6E'); s.add(this.fly.g);
  }
  render(f: Frame, out: THREE.WebGLRenderTarget) {
    K.poseMaya(this.maya, f.lt, { z: 0.1 }); K.poseFly(this.fly, f.lt);
    const c = this.cam, k = K.eio(f.lt / 3);
    c.position.set(K.lerp(-0.55, 0.6, k), 3.3, 6.4); c.lookAt(K.lerp(-0.35, 0.15, k), 0.62, 0);
    const r = this.ctx.renderer;
    K.draw(r, this.s, c, this.tmp);
    const head = new THREE.Vector3(); this.maya.head.getWorldPosition(head); head.project(c);
    this.tilt.u.srcTex!.value = this.tmp.texture;
    this.tilt.u.texel!.value.set(1 / this.tmp.width, 1 / this.tmp.height);
    this.tilt.u.focusY!.value = head.y * 0.5 + 0.5 - 0.04;
    this.tilt.render(r, out, true);
    return K.POST;
  }
}
