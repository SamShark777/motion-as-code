# Rig Maya: skeleton + automatic skin weights on body/dress, rigid binding for face/hair/shoes,
# facial shape keys (blink, smile, mouthOpen, browUp) and a starter clip library. Exports maya.glb.
import bpy, math, sys
from mathutils import Vector, Quaternion, Matrix

SRC, OUT = sys.argv[-2], sys.argv[-1]
bpy.ops.wm.read_factory_settings(use_empty=True)
bpy.ops.import_scene.gltf(filepath=SRC)
scn = bpy.context.scene
scn.render.fps = 30
meshes = [o for o in scn.objects if o.type == 'MESH']
for o in scn.objects: o.select_set(o.type == 'MESH')
bpy.context.view_layer.objects.active = meshes[0]
bpy.ops.object.transform_apply(location=True, rotation=True, scale=True)

# ---------------------------------------------------------------- skeleton (Blender: Z up, front -Y, Maya's left = +X)
B = {  # name: (head, tail, parent)
    'Hips': ((0, 0, 0.56), (0, 0, 0.66), None),
    'Spine': ((0, 0, 0.66), (0, 0, 0.80), 'Hips'),
    'Chest': ((0, 0, 0.80), (0, 0, 0.95), 'Spine'),
    'Neck': ((0, 0, 0.95), (0, 0, 1.05), 'Chest'),
    'Head': ((0, 0, 1.05), (0, 0, 1.45), 'Neck'),
}
for s, n in ((1, 'L'), (-1, 'R')):
    B[f'Shoulder.{n}'] = ((s * 0.04, 0, 0.92), (s * 0.15, 0, 0.935), 'Chest')
    B[f'UpperArm.{n}'] = ((s * 0.15, 0, 0.935), (s * 0.295, 0, 0.765), f'Shoulder.{n}')
    B[f'LowerArm.{n}'] = ((s * 0.295, 0, 0.765), (s * 0.395, 0, 0.625), f'UpperArm.{n}')
    B[f'Hand.{n}'] = ((s * 0.395, 0, 0.625), (s * 0.44, 0, 0.55), f'LowerArm.{n}')
    B[f'UpperLeg.{n}'] = ((s * 0.085, 0, 0.53), (s * 0.1, 0, 0.29), 'Hips')
    B[f'LowerLeg.{n}'] = ((s * 0.1, 0, 0.29), (s * 0.105, 0, 0.1), f'UpperLeg.{n}')
    B[f'Foot.{n}'] = ((s * 0.105, 0, 0.1), (s * 0.105, -0.12, 0.03), f'LowerLeg.{n}')

arm_data = bpy.data.armatures.new('MayaRig')
arm = bpy.data.objects.new('Maya', arm_data)
scn.collection.objects.link(arm)
bpy.context.view_layer.objects.active = arm
bpy.ops.object.select_all(action='DESELECT'); arm.select_set(True)
bpy.ops.object.mode_set(mode='EDIT')
for name, (h, t, p) in B.items():
    eb = arm_data.edit_bones.new(name); eb.head = Vector(h); eb.tail = Vector(t); eb.roll = 0
    if p: eb.parent = arm_data.edit_bones[p]; eb.use_connect = (Vector(arm_data.edit_bones[p].tail) - Vector(h)).length < 1e-4
for n in ('L', 'R'): arm_data.edit_bones[f'UpperLeg.{n}'].use_connect = False
bpy.ops.object.mode_set(mode='OBJECT')

# ---------------------------------------------------------------- skinning
def obj(n): return bpy.data.objects[n]
auto = ['Maya_Body_Continuous', 'Mint_Dress']
bpy.ops.object.select_all(action='DESELECT')
for n in auto: obj(n).select_set(True)
arm.select_set(True); bpy.context.view_layer.objects.active = arm
bpy.ops.object.parent_set(type='ARMATURE_AUTO')
rigid = {'Head': ['Brow', 'Brow.001', 'Brown_iris_1', 'Brown_iris_-1', 'Cheek_1', 'Cheek_-1', 'Curly_Dark_Brown_Hair',
                  'Eye_glint_1', 'Eye_glint_-1', 'Eye_white_1', 'Eye_white_-1', 'Friendly smile', 'Nose', 'Pupil_1', 'Pupil_-1', 'Yellow_Star_Hair_Clip'],
         'Foot.L': ['Lavender_Shoe_1', 'Sole_1'], 'Foot.R': ['Lavender_Shoe_-1', 'Sole_-1']}
for bone, names in rigid.items():
    for n in names:
        o = obj(n); vg = o.vertex_groups.new(name=bone); vg.add(list(range(len(o.data.vertices))), 1.0, 'REPLACE')
        m = o.modifiers.new('Armature', 'ARMATURE'); m.object = arm
        o.parent = arm; o.matrix_parent_inverse = arm.matrix_world.inverted()
# weight surgery helper: read all weights first, then rewrite (avoids stale group refs)
def rewrite(o, fn):
    names = {g.index: g.name for g in o.vertex_groups}
    W = [{names[g.group]: g.weight for g in v.groups} for v in o.data.vertices]
    newW = [fn(o.data.vertices[i].co, w) for i, w in enumerate(W)]
    allv = list(range(len(o.data.vertices)))
    for g in o.vertex_groups: g.remove(allv)
    G = {g.name: g for g in o.vertex_groups}
    for i, w in enumerate(newW):
        for k, val in w.items():
            if k not in G: G[k] = o.vertex_groups.new(name=k)
            if val > 1e-4: G[k].add([i], val, 'REPLACE')
LIMB = ('Arm', 'Hand', 'Shoulder')
keep = {'Hips': 1.0, 'Spine': 1.0, 'Chest': 1.0, 'UpperLeg.L': 0.4, 'UpperLeg.R': 0.4}
def dress_fn(co, w):
    w = {k: v * keep[k] for k, v in w.items() if k in keep}
    t = sum(w.values())
    return {k: v / t for k, v in w.items()} if t > 1e-4 else {'Hips': 1.0}
rewrite(obj('Mint_Dress'), dress_fn)
body = obj('Maya_Body_Continuous')
def body_fn(co, w):
    x, z = abs(co.x), co.z
    if 0.45 < z < 0.92 and x < 0.15 + (0.935 - z) * 0.69 - 0.06:
        armw = sum(v for k, v in w.items() if any(s in k for s in LIMB))
        if armw > 0:
            w = {k: v for k, v in w.items() if not any(s in k for s in LIMB)}
            tgt = 'Chest' if z > 0.8 else 'Spine'; w[tgt] = w.get(tgt, 0) + armw
    return w
rewrite(body, body_fn)
# report weight coverage of the body
body = obj('Maya_Body_Continuous')
unw = sum(1 for v in body.data.vertices if not v.groups)
print('BODY verts', len(body.data.vertices), 'unweighted', unw, 'groups', [g.name for g in body.vertex_groups])

# ---------------------------------------------------------------- facial shape keys
def shape(o, key, fn):
    if not o.data.shape_keys: o.shape_key_add(name='Basis')
    k = o.shape_key_add(name=key, from_mix=False)
    for i, v in enumerate(o.data.vertices): k.data[i].co = fn(v.co.copy())
def center(o):
    vs = [v.co for v in o.data.vertices]; return sum(vs, Vector()) / len(vs)
eyec = {s: center(obj(f'Eye_white_{s}')) for s in ('1', '-1')}
for s in ('1', '-1'):
    c = eyec[s]
    for part in ('Eye_white', 'Brown_iris', 'Pupil', 'Eye_glint'):
        o = obj(f'{part}_{s}')
        shape(o, 'blink', lambda p, c=c: Vector((p.x, p.y, c.z - 0.012 + (p.z - c.z) * 0.08)))
mc = center(obj('Friendly smile'))
def smile(p):
    dx = p.x - mc.x
    return Vector((mc.x + dx * 1.18, p.y, p.z + (dx * dx) * 9.0 - 0.003))
shape(obj('Friendly smile'), 'smile', smile)
shape(obj('Friendly smile'), 'mouthOpen', lambda p: Vector((mc.x + (p.x - mc.x) * 0.8, p.y, mc.z + (p.z - mc.z) * 3.2 - 0.006)))
for b in ('Brow', 'Brow.001'):
    shape(obj(b), 'browUp', lambda p: Vector((p.x, p.y, p.z + 0.018)))

# ---------------------------------------------------------------- clip library (procedural keys, 30 fps)
pb = arm.pose.bones
for p in pb: p.rotation_mode = 'QUATERNION'
X, Y, Z = Vector((1, 0, 0)), Vector((0, 1, 0)), Vector((0, 0, 1))
def rot(name, axis, ang):
    """Rotation about an armature-space axis, expressed in the bone's rest frame."""
    b = arm_data.bones[name]
    la = (b.matrix_local.to_3x3().inverted() @ axis).normalized()
    return Quaternion(la, ang)
ARMS_DOWN = 0.42  # A-pose → relaxed arms
def base(q, f=1.0):
    q.update({'UpperArm.L': rot('UpperArm.L', Y, ARMS_DOWN * f), 'UpperArm.R': rot('UpperArm.R', Y, -ARMS_DOWN * f),
              'LowerArm.L': rot('LowerArm.L', X, -0.15), 'LowerArm.R': rot('LowerArm.R', X, -0.15)})
    return q
def mul(a, b): return a @ b
def make(name, frames, fn, loop=True):
    act = bpy.data.actions.new(name); act.use_fake_user = True
    arm.animation_data_create(); arm.animation_data.action = act
    for f in range(frames + 1):
        t = f / 30.0
        poses, loc = fn(t)
        for p in pb:
            p.rotation_quaternion = poses.get(p.name, Quaternion())
            p.location = loc.get(p.name, Vector())
            p.keyframe_insert('rotation_quaternion', frame=f + 1)
            p.keyframe_insert('location', frame=f + 1)
    tr = arm.animation_data.nla_tracks.new(); tr.name = name
    tr.strips.new(name, 1, act); tr.mute = True
    arm.animation_data.action = None
    print('clip', name, frames)
TAU = math.tau
def idle(t):
    w = TAU * t / 4
    q = base({})
    q['Spine'] = rot('Spine', X, 0.025 * math.sin(w))
    q['Chest'] = rot('Chest', X, 0.02 * math.sin(w + 0.6))
    q['Head'] = mul(rot('Head', Z, 0.06 * math.sin(w * 0.5)), rot('Head', Y, 0.04 * math.sin(w)))
    q['UpperArm.L'] = mul(rot('UpperArm.L', Y, 0.03 * math.sin(w)), q['UpperArm.L'])
    q['UpperArm.R'] = mul(rot('UpperArm.R', Y, -0.03 * math.sin(w)), q['UpperArm.R'])
    return q, {}
def walk(t):
    w = TAU * t / 1.0; s = math.sin(w)
    q = base({})
    q['UpperLeg.L'] = rot('UpperLeg.L', X, -0.42 * s); q['UpperLeg.R'] = rot('UpperLeg.R', X, 0.42 * s)
    q['LowerLeg.L'] = rot('LowerLeg.L', X, 0.55 * max(0, math.sin(w + 1.3))); q['LowerLeg.R'] = rot('LowerLeg.R', X, 0.55 * max(0, math.sin(w + 1.3 + math.pi)))
    q['Foot.L'] = rot('Foot.L', X, -0.15 * s); q['Foot.R'] = rot('Foot.R', X, 0.15 * s)
    q['UpperArm.L'] = mul(rot('UpperArm.L', X, 0.35 * s), q['UpperArm.L']); q['UpperArm.R'] = mul(rot('UpperArm.R', X, -0.35 * s), q['UpperArm.R'])
    q['Hips'] = rot('Hips', Z, 0.08 * s); q['Chest'] = rot('Chest', Z, -0.1 * s)
    q['Head'] = rot('Head', Z, 0.03 * s)
    return q, {'Hips': Vector((0, abs(math.cos(w)) * 0.022 - 0.01, 0))}
def wave(t):
    k = min(1, t / 0.4) if t < 1.6 else max(0, 1 - (t - 1.6) / 0.4)
    k = k * k * (3 - 2 * k)
    q = base({})
    q['UpperArm.R'] = mul(rot('UpperArm.R', Y, 2.1 * k), q['UpperArm.R'])
    q['LowerArm.R'] = mul(rot('LowerArm.R', Y, (0.5 + 0.45 * math.sin(TAU * t * 2.2)) * k), rot('LowerArm.R', X, -0.15))
    q['Head'] = rot('Head', Y, -0.08 * k)
    return q, {}
def lookup(t):
    k = min(1, t / 0.8); k = k * k * (3 - 2 * k)
    q = base({})
    q['Head'] = mul(rot('Head', Z, 0.25 * k), mul(rot('Head', X, -0.38 * k), rot('Head', Y, 0.12 * k)))
    q['Neck'] = rot('Neck', X, -0.12 * k); q['Chest'] = rot('Chest', X, -0.06 * k)
    return q, {}
def point(t):
    k = min(1, t / 0.5); k = k * k * (3 - 2 * k)
    q = base({})
    q['UpperArm.L'] = mul(rot('UpperArm.L', X, -1.2 * k), mul(rot('UpperArm.L', Y, -0.3 * k), q['UpperArm.L']))
    q['LowerArm.L'] = rot('LowerArm.L', X, -0.15 + 0.1 * k)
    q['Head'] = mul(rot('Head', Z, 0.2 * k), rot('Head', X, -0.12 * k))
    return q, {}
def happy(t):
    w = TAU * t / 0.8; b = abs(math.sin(w / 2))
    q = base({}, 0.55)
    q['UpperArm.L'] = mul(rot('UpperArm.L', Y, -0.3 * b), q['UpperArm.L']); q['UpperArm.R'] = mul(rot('UpperArm.R', Y, 0.3 * b), q['UpperArm.R'])
    q['UpperLeg.L'] = rot('UpperLeg.L', X, -0.12 * b); q['UpperLeg.R'] = rot('UpperLeg.R', X, -0.12 * b)
    q['LowerLeg.L'] = rot('LowerLeg.L', X, 0.22 * b); q['LowerLeg.R'] = rot('LowerLeg.R', X, 0.22 * b)
    q['Head'] = rot('Head', Y, 0.08 * math.sin(w))
    return q, {'Hips': Vector((0, -0.03 * b + 0.05 * max(0, math.sin(w)) ** 2, 0))}
make('Idle', 120, idle); make('Walk', 30, walk); make('Wave', 60, wave, False)
make('LookUp', 45, lookup, False); make('Point', 45, point, False); make('Happy', 24, happy)
for p in pb: p.rotation_quaternion = Quaternion(); p.location = Vector()

bpy.ops.export_scene.gltf(filepath=OUT, export_format='GLB', export_animations=True, export_animation_mode='NLA_TRACKS',
                          export_morph=True, export_skins=True, export_apply=False, export_yup=True)
print('EXPORTED', OUT)
