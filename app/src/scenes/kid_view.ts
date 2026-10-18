// Turntable viewer for the canonical Maya GLB (front / side / back / 3-4).
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { Scene, type Frame } from '../engine/scene';
import * as K from './_kid';

export default class KidView extends Scene {
  s = new THREE.Scene(); cam = new THREE.PerspectiveCamera(30, 1920 / 1080, 0.01, 100);
  maya!: THREE.Object3D; size = new THREE.Vector3(); center = new THREE.Vector3();
  override async init() {
    K.prep(this.ctx.renderer);
    const g = await new GLTFLoader().loadAsync('characters/maya/' + (this.ctx.params.file ?? 'maya_src.glb'));
    this.maya = g.scene;
    this.maya.traverse((o: any) => { if (o.isMesh) { o.castShadow = o.receiveShadow = true; } });
    const box = new THREE.Box3().setFromObject(this.maya); box.getSize(this.size); box.getCenter(this.center);
    (window as any).__mayaInfo = { size: this.size.toArray(), center: this.center.toArray(), min: box.min.toArray() };
    console.warn('MAYA ' + JSON.stringify((window as any).__mayaInfo));
    const piv = new THREE.Group(); this.maya.position.sub(new THREE.Vector3(this.center.x, box.min.y, this.center.z)); piv.add(this.maya); this.maya = piv;
    this.s.add(piv);
    this.s.background = new THREE.Color('#E9E4DA');
    this.s.add(new THREE.HemisphereLight('#FFF6EA', '#CBBFAE', 1.4));
    this.s.add(K.keyLight('#FFE6C8', 2.2, [-2, 4, 4], 3));
    const fl = new THREE.Mesh(new THREE.CircleGeometry(20, 64), new THREE.MeshStandardMaterial({ color: '#E2DCCF', roughness: 1 })); fl.rotation.x = -Math.PI / 2; fl.receiveShadow = true; this.s.add(fl);
  }
  render(f: Frame, out: THREE.WebGLRenderTarget) {
    this.maya.rotation.y = (this.ctx.params.yaw ?? 0) + f.lt * K.TAU / 4;
    const h = this.size.y, d = h * 2.4;
    this.cam.position.set(0, h * 0.55, d); this.cam.lookAt(0, h * 0.5, 0);
    K.draw(this.ctx.renderer, this.s, this.cam, out);
    return K.POST;
  }
}
