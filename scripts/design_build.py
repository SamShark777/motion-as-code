"""Build a "Claude Design style" Short (format "cdesign") from shorts/<slug>/script.json + art.jsx.
voice (tts_vo) -> word timings -> scene/caption timing -> shorts/<slug>/index.html (Claude Design runtime
+ shorts/design_kit/engine.jsx) -> frame-accurate capture (scripts/cap_design.mjs) -> music bed + mux.
Output: shorts/<slug>/<slug>.mp4 + preview.jpg (same as build_short.sh).
    python3 scripts/design_build.py <slug> [--max SECONDS]"""
import argparse, io, json, re, subprocess, sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent


def run(*a, **k):
    print("+", " ".join(map(str, a)), flush=True)
    subprocess.run(a, check=True, **k)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("slug")
    ap.add_argument("--max", type=float, default=0)
    a = ap.parse_args()
    d = ROOT / "shorts" / a.slug
    S = json.loads((d / "script.json").read_text())
    # the voice reads normal case; captions keep the CAPS emphasis words
    for ln in S["lines"]:
        ln["text"] = " ".join(c[0] for c in ln["chunks"])
        if not ln.get("say"):
            ln["say"] = re.sub(r"\b([A-Z]{2,})\b", lambda m: m.group(1).capitalize() if m.group(1) not in ("I",) else m.group(1), ln["text"])
        ln["sec"] = "cd"
    (ROOT / "data").mkdir(exist_ok=True)
    (ROOT / "data" / "script.json").write_text(json.dumps(S, ensure_ascii=False))
    run(sys.executable, str(ROOT / "analysis" / "tts_vo.py"))
    import soundfile as sf
    info = sf.info(str(ROOT / "audio" / "voiceover.wav"))
    total = info.frames / info.samplerate
    ly = json.loads((ROOT / "data" / "lyrics.json").read_text())["lines"]
    n = len(S["lines"])
    start = [0.0] + [max(0.0, ly[i]["start"] - 0.12) for i in range(1, n)]
    end = start[1:] + [total]
    chunks = []
    for i, ln in enumerate(S["lines"]):
        words = ly[i]["words"]
        k, ats = 0, []
        for c in ln["chunks"]:
            nw = len(c[0].split())
            w = words[min(k, len(words) - 1)]
            ats.append(round(max(start[i], w["start"] - 0.06), 3))
            k += nw
        ats[0] = start[i]
        chunks.append(ats)
    names, seen = [], {}
    for ln in S["lines"]:
        nm = ln.get("scene") or "Scene"
        seen[nm] = seen.get(nm, 0) + 1
        names.append(nm if seen[nm] == 1 else f"{nm} {seen[nm]}")
    om = [{"name": names[i], "dur": round(end[i] - start[i], 3), "desc": ln.get("text", "")[:80]} for i, ln in enumerate(S["lines"])]
    timing = {"start": start, "end": end, "chunks": chunks}
    js = lambda o: json.dumps(json.dumps(o, ensure_ascii=False), ensure_ascii=False)
    html = f"""<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<script src="../design_kit/support.js"></script>
</head>
<body>
<x-dc>
<helmet>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@700;800;900&display=swap" rel="stylesheet">
<style>html,body{{margin:0;background:#000;height:100%;overflow:hidden}}</style>
<script>window.OM_SCENES = {js(om)};</script>
<script>window.OM_PLAYBACK = '{{"mode":"loop"}}';</script>
<script>window.SCRIPT = JSON.parse({js(S)}); window.TIMING = JSON.parse({js(timing)});</script>
</helmet>
<div style="position:fixed;inset:0;background:#000">
<x-import component-from-global-scope="DesignShortApp" from="../design_kit/animations-v3.jsx ../design_kit/caption-system.jsx ./art.jsx ../design_kit/engine.jsx" hint-size="100%,100%"></x-import>
</div>
</x-dc>
</body>
</html>
"""
    (d / "index.html").write_text(html)
    (ROOT / "out").mkdir(exist_ok=True)
    raw = ROOT / "out" / f"{a.slug}.raw.mp4"
    args = ["node", str(ROOT / "scripts" / "cap_design.mjs"), str(ROOT / "shorts"), f"{a.slug}/index.html", str(raw), "30"]
    if a.max:
        args.append(str(a.max))
    run(*args, cwd=str(ROOT / "scripts"))
    run(sys.executable, str(ROOT / "analysis" / "ted_music.py"))
    mp4 = d / f"{a.slug}.mp4"
    run("ffmpeg", "-v", "error", "-y", "-i", str(raw), "-i", str(ROOT / "out" / "mix.wav"), "-map", "0:v", "-map", "1:a", "-c:v", "libx264",
        "-preset", "medium", "-crf", "21", "-pix_fmt", "yuv420p", "-c:a", "aac", "-b:a", "192k", "-shortest", "-movflags", "+faststart", str(mp4))
    dur = float(subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", str(mp4)], capture_output=True, text=True).stdout)
    from PIL import Image
    W, H = 270, 480
    sheet = Image.new("RGB", (W * 6, H))
    for i in range(6):
        t = dur * (i + 0.5) / 6
        png = subprocess.run(["ffmpeg", "-v", "error", "-ss", f"{t:.2f}", "-i", str(mp4), "-frames:v", "1", "-f", "image2pipe", "-vcodec", "png", "-"], capture_output=True, check=True).stdout
        sheet.paste(Image.open(io.BytesIO(png)).convert("RGB").resize((W, H)), (i * W, 0))
    sheet.save(d / "preview.jpg", quality=85)
    raw.unlink(missing_ok=True)
    print(f"built {mp4} ({dur:.1f}s)")
    print("ENGINE:", (ROOT / "out" / "tts_engine.txt").read_text() if (ROOT / "out" / "tts_engine.txt").exists() else "?")


if __name__ == "__main__":
    main()
