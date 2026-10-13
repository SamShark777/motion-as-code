"""Render a contact sheet of every look (or a given list) for the current data/script.json.
    python3 scripts/look_sheet.py <t1,t2,...> <out.jpg> [look1,look2,...]
Rewrites data/script.json's "look" per pass and restores it afterwards."""
import json, subprocess, sys, os, glob, shutil
from pathlib import Path
from PIL import Image, ImageDraw
ROOT = Path(__file__).resolve().parent.parent
times, out = sys.argv[1], sys.argv[2]
sp = ROOT / "data" / "script.json"
orig = sp.read_text()
looks = sys.argv[3].split(",") if len(sys.argv) > 3 else None
if not looks:
    src = (ROOT / "app/src/scenes/_looks.ts").read_text()
    import re
    looks = re.findall(r"^  '?([a-z0-9-]+)'?: \{\n    id:", src, re.M)
rows = []
try:
    for lk in looks:
        s = json.loads(orig); s["look"] = lk; sp.write_text(json.dumps(s))
        d = ROOT / "out" / "looks" / lk
        shutil.rmtree(d, ignore_errors=True)
        subprocess.run(["bun", "scripts/render.ts", "stills", "--vertical", "--t", times, "--out", str(d)], cwd=ROOT / "app", check=True, capture_output=True)
        rows.append((lk, sorted(glob.glob(str(d / "*.png")))))
finally:
    sp.write_text(orig)
n = max(len(r[1]) for r in rows)
W, H = 216, 384
sheet = Image.new("RGB", (W * n + 150, (H + 6) * len(rows)), "white")
dr = ImageDraw.Draw(sheet)
for j, (lk, fs) in enumerate(rows):
    dr.text((6, j * (H + 6) + H // 2), lk, fill="black")
    for i, f in enumerate(fs):
        sheet.paste(Image.open(f).convert("RGB").resize((W, H)), (150 + i * W, j * (H + 6)))
sheet.save(out, quality=82)
print(out, sheet.size)
