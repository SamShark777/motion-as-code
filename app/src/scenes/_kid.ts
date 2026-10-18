// Shared kit for the children's-story style tests: a code-built placeholder Maya, a butterfly,
// a park, procedural textures, and the canonical 3 s action (walk → notice → look up → smile).
// Every pose is a pure function of local time t (0..3 s).
import * as THREE from 'three';
import { mergeVertices } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import type { PostOverrides } from '../engine/scene';

export const TAU = Math.PI * 2;
export const c01 = (x: number) => Math.max(0, Math.min(1, x));
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const sstep = (a: number, b: number, x: number) => { const t = c01((x - a) / (b - a)); return t * t * (3 - 2 * t); };
export const eio = (x: number) => { const t = c01(x); return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; };
export const eout = (x: number) => 1 - Math.pow(1 - c01(x), 3);

// ------------------------------------------------------------------ deterministic noise
const fr = (x: number) => x - Math.floor(x);
const h3 = (x: number, y: number, z: number) => fr(Math.sin(x * 127.1 + y * 311.7 + z * 74.7) * 43758.5453);
const sm = (t: number) => t * t * (3 - 2 * t);
export function vn3(x: number, y: number, z: number) {
  const xi = Math.floor(x), yi = Math.floor(y), zi = Math.floor(z);
  const u = sm(x - xi), v = sm(y - yi), w = sm(z - zi);
  const l = (a: number, b: number, t: number) => a + (b - a) * t;
  const c = (dx: number, dy: number, dz: number) => h3(xi + dx, yi + dy, zi + dz);
  return l(l(l(c(0, 0, 0), c(1, 0, 0), u), l(c(0, 1, 0), c(1, 1, 0), u), v),
    l(l(c(0, 0, 1), c(1, 0, 1), u), l(c(0, 1, 1), c(1, 1, 1), u), v), w);
}
export function fbm(x: number, y: number, z = 0.5, oct = 4) {
  let s = 0, a = 0.5, f = 1;
  for (let i = 0; i < oct; i++) { s += a * vn3(x * f, y * f, z * f); f *= 2.03; a *= 0.5; }
  return s;
}

/** Canvas texture from a per-pixel function (u,v in 0..1) returning [r,g,b] 0..255. */
export function tex(size: number, fn: (u: number, v: number) => [number, number, number], srgb = false, rep = 1) {
  const cv = document.createElement('canvas');
  cv.width = cv.height = size;
  const g = cv.getContext('2d')!;
  const img = g.createImageData(size, size);
  for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) {
    const [r, gg, b] = fn(x / size, y / size);
    const i = (y * size + x) * 4;
    img.data[i] = r; img.data[i + 1] = gg; img.data[i + 2] = b; img.data[i + 3] = 255;
  }
  g.putImageData(img, 0, 0);
  const t = new THREE.CanvasTexture(cv);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(rep, rep);
  t.anisotropy = 8;
  if (srgb) t.colorSpace = THREE.SRGBColorSpace;
  return t;
}
export const grey = (v: number): [number, number, number] => { const c = Math.round(c01(v) * 255); return [c, c, c]; };

/** Vertical gradient background. */
export function skyTex(top: string, bottom: string) {
  const cv = document.createElement('canvas'); cv.width = 4; cv.height = 256;
  const g = cv.getContext('2d')!; const gr = g.createLinearGradient(0, 0, 0, 256);
  gr.addColorStop(0, top); gr.addColorStop(1, bottom); g.fillStyle = gr; g.fillRect(0, 0, 4, 256);
  const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace; return t;
}

/** Lumpy, hand-made displacement along normals (clay). */
export function lumpy(geo: THREE.BufferGeometry, amp: number, freq: number, seed = 0) {
  let g = geo.index ? geo : geo;
  g.deleteAttribute('normal'); g.deleteAttribute('uv');
  g = mergeVertices(g, 1e-4);
  g.computeVertexNormals();
  const p = g.attributes.position as THREE.BufferAttribute, n = g.attributes.normal as THREE.BufferAttribute;
  for (let i = 0; i < p.count; i++) {
    const x = p.getX(i), y = p.getY(i), z = p.getZ(i);
    const d = (vn3(x * freq + seed, y * freq, z * freq) - 0.5) * 2 * amp;
    p.setXYZ(i, x + n.getX(i) * d, y + n.getY(i) * d, z + n.getZ(i) * d);
  }
  g.computeVertexNormals();
  // spherical-ish uv so bump maps still apply
  const uv = new Float32Array(p.count * 2);
  for (let i = 0; i < p.count; i++) { const x = p.getX(i), y = p.getY(i), z = p.getZ(i); uv[i * 2] = Math.atan2(x, z) / TAU + 0.5; uv[i * 2 + 1] = y * 2; }
  g.setAttribute('uv', new THREE.BufferAttribute(uv, 2));
  return g;
}

// ------------------------------------------------------------------ Maya's canonical palette
export const MAYA = {
  skin: '#F0C29C', hair: '#4A2C20', dress: '#9FE3C8', shoe: '#C4B0F2', clip: '#FFD23F',
  eye: '#2E1B12', white: '#FFFFFF', cheek: '#F29C9C', mouth: '#7A3830', nose: '#E8AE88',
};

export type MatFn = (role: string, color: string) => THREE.Material;
export function cached(make: MatFn): MatFn {
  const c = new Map<string, THREE.Material>();
  return (r, col) => { const k = r + col; if (!c.has(k)) c.set(k, make(r, col)); return c.get(k)!; };
}

export interface Maya {
  root: THREE.Group; hips: THREE.Group; torso: THREE.Group; head: THREE.Group;
  legL: THREE.Group; legR: THREE.Group; armL: THREE.Group; armR: THREE.Group;
  mouth: THREE.Object3D; eyes: THREE.Object3D[];
}
export interface MayaOpts { seg?: number; lump?: number; curls?: number; curlR?: number; joints?: boolean; flatFace?: boolean }

function starShape(ro: number, ri: number) {
  const s = new THREE.Shape();
  for (let i = 0; i < 10; i++) { const r = i % 2 ? ri : ro, a = Math.PI / 2 + (i * Math.PI) / 5; i ? s.lineTo(Math.cos(a) * r, Math.sin(a) * r) : s.moveTo(Math.cos(a) * r, Math.sin(a) * r); }
  return s;
}

export function buildMaya(M: MatFn, o: MayaOpts = {}): Maya {
  const seg = o.seg ?? 40;
  const mk = (geo: THREE.BufferGeometry, role: string, col: string, lump = true) => {
    if (o.lump && lump) geo = lumpy(geo, o.lump, 9, col.length);
    const m = new THREE.Mesh(geo, M(role, col)); m.castShadow = true; m.receiveShadow = true; return m;
  };
  const root = new THREE.Group();
  const hips = new THREE.Group(); hips.position.y = 0.42; root.add(hips);
  const leg = (s: number) => {
    const g = new THREE.Group(); g.position.set(s * 0.07, 0, 0);
    const l = mk(new THREE.CylinderGeometry(0.05, 0.044, 0.36, seg / 2), 'skin', MAYA.skin); l.position.y = -0.18;
    const sh = mk(new THREE.SphereGeometry(0.075, seg / 2, seg / 4), 'shoe', MAYA.shoe); sh.scale.set(1, 0.62, 1.4); sh.position.set(0, -0.37, 0.03);
    g.add(l, sh);
    if (o.joints) { const j = mk(new THREE.SphereGeometry(0.06, seg / 2, seg / 4), 'skin', MAYA.skin); g.add(j); }
    hips.add(g); return g;
  };
  const legL = leg(1), legR = leg(-1);
  const torso = new THREE.Group(); hips.add(torso);
  const prof = [[0, 0], [0.21, 0], [0.2, 0.04], [0.16, 0.16], [0.122, 0.3], [0.106, 0.36], [0.06, 0.392], [0, 0.4]].map(([x, y]) => new THREE.Vector2(x, y));
  const dress = mk(new THREE.LatheGeometry(prof, seg), 'dress', MAYA.dress); dress.position.y = -0.02; torso.add(dress);
  const arm = (s: number) => {
    const g = new THREE.Group(); g.position.set(s * 0.125, 0.33, 0); g.rotation.z = s * 0.18;
    const a = mk(new THREE.CapsuleGeometry(0.036, 0.2, 6, seg / 2), 'skin', MAYA.skin); a.position.y = -0.15;
    const h = mk(new THREE.SphereGeometry(0.05, seg / 2, seg / 4), 'skin', MAYA.skin); h.position.y = -0.29;
    const sl = mk(new THREE.SphereGeometry(0.062, seg / 2, seg / 4), 'dress', MAYA.dress); sl.position.y = -0.02;
    g.add(a, h, sl);
    if (o.joints) { const j = mk(new THREE.SphereGeometry(0.045, seg / 2, seg / 4), 'skin', MAYA.skin); j.position.y = -0.15; g.add(j); }
    torso.add(g); return g;
  };
  const armL = arm(1), armR = arm(-1);
  const head = new THREE.Group(); head.position.y = 0.37; torso.add(head);
  const C = 0.2;
  const hm = mk(new THREE.SphereGeometry(0.2, seg, seg), 'skin', MAYA.skin); hm.position.y = C; hm.scale.set(1, 0.96, 0.98); head.add(hm);
  const cap = mk(new THREE.SphereGeometry(0.214, seg, seg, 0, TAU, 0, Math.PI * 0.56), 'hair', MAYA.hair);
  cap.position.set(0, C + 0.012, -0.012); cap.rotation.x = -0.42; head.add(cap);
  const n = o.curls ?? 15, cr = o.curlR ?? 0.074;
  for (let k = 0; k < n; k++) {
    const th = lerp(0.42 * Math.PI, 1.58 * Math.PI, k / (n - 1));
    const y = C + (k % 2 ? 0.07 : 0.17) - Math.abs(Math.cos(th)) * 0.0;
    const R = 0.19;
    const c = mk(new THREE.SphereGeometry(cr * (0.9 + 0.2 * h3(k, 1, 2)), seg / 2, seg / 4), 'hair', MAYA.hair);
    c.position.set(Math.sin(th) * R, y, Math.cos(th) * R); head.add(c);
  }
  for (let k = 0; k < 5; k++) { // fringe curls along the hairline
    const th = lerp(-0.55, 0.55, k / 4);
    const c = mk(new THREE.SphereGeometry(cr * 0.82, seg / 2, seg / 4), 'hair', MAYA.hair);
    c.position.set(Math.sin(th) * 0.16, C + 0.155 + Math.cos(k * 1.7) * 0.01, Math.cos(th) * 0.125); head.add(c);
  }
  const clip = mk(new THREE.ExtrudeGeometry(starShape(0.058, 0.026), { depth: 0.022, bevelEnabled: true, bevelSize: 0.006, bevelThickness: 0.006, bevelSegments: 2 }), 'clip', MAYA.clip, false);
  clip.position.set(0.15, C + 0.13, 0.1); clip.rotation.set(-0.2, 0.75, 0.2); head.add(clip);
  const eyes: THREE.Object3D[] = [];
  for (const s of [1, -1]) {
    const e = new THREE.Group(); e.position.set(s * 0.074, C + 0.012, 0.172); e.rotation.y = s * 0.38;
    const em = mk(o.flatFace ? new THREE.CircleGeometry(0.034, 24) : new THREE.SphereGeometry(0.034, 20, 12), 'eye', MAYA.eye, false);
    if (!o.flatFace) em.scale.z = 0.55; else em.position.z = 0.012;
    const hl = mk(o.flatFace ? new THREE.CircleGeometry(0.011, 12) : new THREE.SphereGeometry(0.011, 10, 6), 'white', MAYA.white, false);
    hl.position.set(0.011, 0.012, o.flatFace ? 0.014 : 0.018);
    e.add(em, hl); head.add(e); eyes.push(e);
    const ch = mk(o.flatFace ? new THREE.CircleGeometry(0.036, 20) : new THREE.SphereGeometry(0.04, 16, 10), 'cheek', MAYA.cheek, false);
    ch.position.set(s * 0.118, C - 0.052, 0.156 + (o.flatFace ? 0.012 : 0)); ch.rotation.y = s * 0.65; if (!o.flatFace) ch.scale.set(1, 0.6, 0.4); head.add(ch);
  }
  const nose = mk(new THREE.SphereGeometry(0.02, 12, 8), 'nose', MAYA.nose, false); nose.position.set(0, C - 0.022, 0.197); head.add(nose);
  const mouth = new THREE.Group(); mouth.position.set(0, C - 0.082, 0.185); mouth.rotation.x = 0.35;
  const mm = mk(new THREE.TorusGeometry(0.042, 0.009, 8, 24, Math.PI), 'mouth', MAYA.mouth, false); mm.rotation.z = Math.PI; mouth.add(mm); head.add(mouth);
  return { root, hips, torso, head, legL, legR, armL, armR, mouth, eyes };
}

/** The canonical action. `step` quantises time (stop-motion feel); `toy` = rigid waddle. */
export function poseMaya(m: Maya, tIn: number, o: { step?: number; toy?: boolean; x0?: number; x1?: number; z?: number } = {}) {
  const t = o.step ? Math.floor(tIn * o.step) / o.step : tIn;
  const x0 = o.x0 ?? -1.75, x1 = o.x1 ?? -0.35;
  const w = c01(t / 1.55), x = lerp(x0, x1, 1 - (1 - w) * (1 - w));
  const ph = (x - x0) * 7.6, amp = 0.5 * (1 - sstep(1.1, 1.55, t));
  m.root.position.set(x, 0, o.z ?? 0);
  m.root.rotation.y = lerp(1.1, 0.42, sstep(1.3, 2.05, t));
  const sw = Math.sin(ph) * amp;
  m.legL.rotation.x = sw; m.legR.rotation.x = -sw;
  const settle = Math.sin(c01((t - 1.5) / 0.32) * Math.PI) * 0.014;
  m.hips.position.y = 0.42 + Math.abs(Math.cos(ph)) * 0.05 * amp - settle + (o.toy ? Math.abs(Math.sin(ph)) * 0.05 * amp : 0);
  m.root.rotation.z = o.toy ? Math.sin(ph) * 0.12 * amp : 0;
  const L = eio((t - 1.55) / 0.7), s = eio((t - 2.12) / 0.5), r = eio((t - 2.3) / 0.55);
  m.head.rotation.set(-0.42 * L + (o.toy ? 0 : Math.sin(ph * 2) * 0.02 * amp), 0.28 * L, -0.13 * L);
  m.torso.rotation.x = -0.07 * L;
  m.armR.rotation.x = -sw * 0.8;
  m.armL.rotation.x = lerp(sw * 0.8, -1.25, r);
  m.armL.rotation.z = 0.18 + 0.2 * r;
  m.mouth.scale.set(lerp(0.72, 1.12, s), lerp(0.3, 1.05, s), 1);
  for (const e of m.eyes) e.scale.y = lerp(1, 0.72, s);
}

// ------------------------------------------------------------------ butterfly
export interface Fly { g: THREE.Group; wl: THREE.Object3D; wr: THREE.Object3D }
export function buildFly(M: MatFn, col = '#FF8A5C', body = '#3A2A2A', flat = false): Fly {
  const g = new THREE.Group();
  const sh = new THREE.Shape(); sh.absellipse(0.085, 0.035, 0.085, 0.065, 0, TAU, false, 0.35);
  const sh2 = new THREE.Shape(); sh2.absellipse(0.06, -0.045, 0.055, 0.04, 0, TAU, false, -0.4);
  const geo = new THREE.ShapeGeometry([sh, sh2], 16);
  const mat = M('wing', col); (mat as any).side = THREE.DoubleSide; if ((mat as any).emissive) (mat as any).emissive = new THREE.Color(col).multiplyScalar(0.35);
  const wing = (s: number) => { const p = new THREE.Group(); const m = new THREE.Mesh(geo, mat); m.castShadow = true; m.scale.x = s; p.add(m); if (!flat) p.rotation.x = -Math.PI / 2; g.add(p); return p; };
  const wl = wing(1), wr = wing(-1);
  const b = new THREE.Mesh(new THREE.CapsuleGeometry(0.012, 0.08, 4, 8), M('body', body)); b.castShadow = true;
  if (!flat) b.rotation.x = Math.PI / 2; g.add(b);
  return { g, wl, wr };
}
export function poseFly(f: Fly, tIn: number, o: { step?: number; flat?: boolean } = {}) {
  const t = o.step ? Math.floor(tIn * o.step) / o.step : tIn;
  const p = eout((t - 0.2) / 2.0);
  const x = lerp(2.7, 0.22, p) + Math.sin(t * 2.3) * 0.06;
  const y = lerp(1.95, 1.5, p) + Math.sin(t * 5.1) * 0.07 * (1 - p * 0.5);
  const z = lerp(0.7, 0.45, p);
  f.g.position.set(x, y, o.flat ? 0.4 : z);
  const flap = 0.15 + 1.0 * Math.abs(Math.sin(t * TAU * 2.6));
  if (o.flat) { f.wl.scale.x = Math.cos(flap); f.wr.scale.x = Math.cos(flap); f.g.rotation.z = Math.sin(t * 3) * 0.2; }
  else {
    f.wl.rotation.z = flap; f.wr.rotation.z = -flap;
    f.g.rotation.set(-0.5 + Math.sin(t * 4) * 0.1, -0.9 + Math.sin(t * 1.7) * 0.3, 0.1);
  }
}

// ------------------------------------------------------------------ park pieces
export function buildTree(M: MatFn, trunk: string, leaf: string, o: { seg?: number; lump?: number; lolli?: boolean } = {}) {
  const seg = o.seg ?? 32, g = new THREE.Group();
  const mk = (geo: THREE.BufferGeometry, r: string, c: string) => { if (o.lump) geo = lumpy(geo, o.lump * 2, 4, c.length); const m = new THREE.Mesh(geo, M(r, c)); m.castShadow = m.receiveShadow = true; return m; };
  const tr = mk(new THREE.CylinderGeometry(0.085, 0.13, 1.15, seg / 2), 'trunk', trunk); tr.position.y = 0.575; g.add(tr);
  const blobs = o.lolli ? [[0, 1.5, 0, 0.55]] : [[0, 1.38, 0, 0.46], [-0.34, 1.18, 0.06, 0.34], [0.35, 1.22, 0, 0.36], [0.05, 1.68, -0.06, 0.34], [-0.16, 1.5, 0.22, 0.28], [0.22, 1.5, 0.24, 0.26]];
  for (const [x, y, z, r] of blobs) { const b = mk(new THREE.SphereGeometry(r!, seg, seg / 2), 'leaf', leaf); b.position.set(x!, y!, z!); g.add(b); }
  return g;
}

// ------------------------------------------------------------------ shared rendering
export function prep(r: THREE.WebGLRenderer) {
  r.shadowMap.enabled = true; r.shadowMap.type = THREE.PCFShadowMap; r.shadowMap.autoUpdate = true;
}
export function camera(fov = 34) {
  const c = new THREE.PerspectiveCamera(fov, 1920 / 1080, 0.05, 80);
  c.position.set(0.15, 1.05, 4.7); c.lookAt(0.15, 0.78, 0); return c;
}
export function keyLight(col: string, i: number, pos: [number, number, number], size = 4) {
  const d = new THREE.DirectionalLight(col, i); d.position.set(...pos); d.castShadow = true;
  d.shadow.mapSize.set(2048, 2048); const s = d.shadow.camera as THREE.OrthographicCamera;
  s.left = s.bottom = -size; s.right = s.top = size; s.near = 0.5; s.far = 30; d.shadow.radius = 5; d.shadow.blurSamples = 16; d.shadow.bias = -0.0004; d.shadow.normalBias = 0.02;
  return d;
}
export function draw(r: THREE.WebGLRenderer, s: THREE.Scene, c: THREE.Camera, out: THREE.WebGLRenderTarget | null) {
  r.setRenderTarget(out); r.setClearColor(0x000000, 1); r.clear(); r.render(s, c);
}
export const POST: PostOverrides = { exposure: 1.12, hud: 0, frame: 0, pdoom: 0, grain: 0.012, halation: 0, ca: 0.25, vignette: 0.16, bloom: 0.06, bloomThreshold: 1.6 };
