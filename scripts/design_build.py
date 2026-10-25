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
    ap.add_argument("--stage", default="all", choices=["all", "prep", "capture"])
    ap.add_argument("--from", dest="frm", type=float, default=0)
    ap.add_argument("--to", type=float, default=0)
    ap.add_argument("--out", default="")
    a = ap.parse_args()
    d = ROOT / "shorts" / a.slug
    kit = "../" * (len(Path(a.slug).parts)) + "design_kit"
    S0 = json.loads((d / "script.json").read_text())
    land = S0.get("orientation") == "landscape"
    W, H = (1920, 1080) if land else (1080, 1920)
    if a.stage == "capture":
        return capture(a.slug, Path(a.out), a.frm, a.to, W, H)
    S = json.loads((d / "script.json").read_text())
    story = S.get("format") == "story"
    if story:  # one caption per narration line; the line's text is what the voice reads
        for ln in S["lines"]:
            ln["chunks"] = [[ln["text"]]]
            ln["sec"] = "cd"
    # the voice reads normal case; captions keep the CAPS emphasis words
    for ln in S["lines"] if not story else []:
        ln["text"] = " ".join(c[0] for c in ln["chunks"])
        if not ln.get("say"):
            ln["say"] = re.sub(r"\b([A-Z]{2,})\b", lambda m: m.group(1).capitalize() if m.group(1) not in ("I",) else m.group(1), ln["text"])
        ln["sec"] = "cd"
    # cover character: cycle through the cast in posting order (3 slots a day), from the CI matrix date/slot
    import datetime as _dt, os as _os
    _d, _slot = _os.environ.get("COVER_DATE"), _os.environ.get("COVER_SLOT")
    if _d and _slot and S.get("cover_index") is None:
        _slots = [x.strip() for x in (_os.environ.get("SLOTS") or "09:00,14:00,19:00").split(",") if x.strip()]
        _k = _slots.index(_slot) if _slot in _slots else 0
        S["cover_index"] = _dt.date.fromisoformat(_d).toordinal() * len(_slots) + _k
    (ROOT / "data").mkdir(exist_ok=True)
    (ROOT / "data" / "script.json").write_text(json.dumps(S, ensure_ascii=False))
    if _os.environ.get("REMIX") and remix(a.slug, d):
        return
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
        nm = ln.get("scene") or ln.get("art") or "Scene"
        seen[nm] = seen.get(nm, 0) + 1
        names.append(nm if seen[nm] == 1 else f"{nm} {seen[nm]}")
    om = [{"name": names[i], "dur": round(end[i] - start[i], 3), "desc": ln.get("text", "")[:80]} for i, ln in enumerate(S["lines"])]
    timing = {"start": start, "end": end, "chunks": chunks}
    (ROOT / "out").mkdir(exist_ok=True)
    (ROOT / "out" / "timing.json").write_text(json.dumps(timing))
    js = lambda o: json.dumps(json.dumps(o, ensure_ascii=False), ensure_ascii=False)
    if story:
        st = S.get("style") or {}
        fams = []
        for fam, wts in ((st.get("head", "Barlow Condensed"), "600;700;800"), (st.get("body", "Barlow"), "400;500;600;700")):
            q = f"family={fam.replace(' ', '+')}:wght@{wts}"
            if q not in fams:
                fams.append(q)
        fonts = "https://fonts.googleapis.com/css2?" + "&".join(fams) + "&display=swap"
        files, app = f"{kit}/animations-v3.jsx {kit}/story-kit.jsx ./scenes.jsx {kit}/cover.jsx {kit}/story-engine.jsx", "StoryShortApp"
    elif S.get("format") == "stick":  # recurring-character stick stories (hand-drawn look)
        fonts = "https://fonts.googleapis.com/css2?family=Montserrat:wght@700;800;900&family=Caveat+Brush&display=swap"
        files, app = f"{kit}/animations-v3.jsx {kit}/stick-kit.jsx ./art.jsx {kit}/cover.jsx {kit}/stick-engine.jsx", "StickShortApp"
    else:
        fonts = "https://fonts.googleapis.com/css2?family=Montserrat:wght@700;800;900&display=swap"
        files, app = f"{kit}/animations-v3.jsx {kit}/caption-system.jsx ./art.jsx {kit}/cover.jsx {kit}/engine.jsx", "DesignShortApp"
    html = f"""<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<script src="{kit}/support.js"></script>
</head>
<body>
<x-dc>
<helmet>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="{fonts}" rel="stylesheet">
<style>html,body{{margin:0;background:#000;height:100%;overflow:hidden}}</style>
<script>window.OM_SCENES = {js(om)};</script>
<script>window.OM_PLAYBACK = '{{"mode":"loop"}}';</script>
<script>window.SCRIPT = JSON.parse({js(S)}); window.TIMING = JSON.parse({js(timing)});</script>
</helmet>
<div style="position:fixed;inset:0;background:#000">
<x-import component-from-global-scope="{app}" from="{files}" hint-size="100%,100%"></x-import>
</div>
</x-dc>
</body>
</html>
"""
    (d / "index.html").write_text(html)
    (ROOT / "out").mkdir(exist_ok=True)
    if a.stage == "prep":
        return
    raw = ROOT / "out" / f"{Path(a.slug).name}.raw.mp4"
    capture(a.slug, raw, 0, a.max, W, H)
    run(sys.executable, str(ROOT / "analysis" / "ted2_audio.py"), str(ROOT / "data" / "script.json"), str(ROOT / "out" / "timing.json"))
    mp4 = d / f"{Path(a.slug).name}.mp4"
    run("ffmpeg", "-v", "error", "-y", "-i", str(raw), "-i", str(ROOT / "out" / "mix.wav"), "-map", "0:v", "-map", "1:a", "-c:v", "libx264",
        "-preset", "medium", "-crf", "21", "-pix_fmt", "yuv420p", "-c:a", "aac", "-b:a", "192k", "-shortest", "-movflags", "+faststart", str(mp4))
    # same picture, different music per platform (Instagram/TikTok each get their own bed so no two posts share audio)
    import os as _os2
    for variant in ("instagram", "tiktok"):
        mix_v = ROOT / "out" / f"mix.{variant}.wav"
        env = dict(_os2.environ, MUSIC_VARIANT=variant, MIX_OUT=str(mix_v))
        run(sys.executable, str(ROOT / "analysis" / "ted2_audio.py"), str(ROOT / "data" / "script.json"), str(ROOT / "out" / "timing.json"), env=env)
        run("ffmpeg", "-v", "error", "-y", "-i", str(mp4), "-i", str(mix_v), "-map", "0:v", "-map", "1:a", "-c:v", "copy",
            "-c:a", "aac", "-b:a", "192k", "-shortest", "-movflags", "+faststart", str(d / f"{Path(a.slug).name}.{variant}.mp4"))
    _mu = {}
    for _v in ("youtube", "instagram", "tiktok"):
        _f = ROOT / "out" / f"music.{_v}.json"
        if _f.exists():
            _mu[_v] = json.loads(_f.read_text())
    (d / "music.json").write_text(json.dumps(_mu, indent=1))  # which track each platform got (+ the credit line)
    save_stems(a.slug, d)
    dur = float(subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", str(mp4)], capture_output=True, text=True).stdout)
    from PIL import Image
    W, H = (480, 270) if land else (270, 480)
    sheet = Image.new("RGB", (W * 6, H))
    for i in range(6):
        t = dur * (i + 0.5) / 6
        png = subprocess.run(["ffmpeg", "-v", "error", "-ss", f"{t:.2f}", "-i", str(mp4), "-frames:v", "1", "-f", "image2pipe", "-vcodec", "png", "-"], capture_output=True, check=True).stdout
        sheet.paste(Image.open(io.BytesIO(png)).convert("RGB").resize((W, H)), (i * W, 0))
    sheet.save(d / "preview.jpg", quality=85)
    raw.unlink(missing_ok=True)
    print(f"built {mp4} ({dur:.1f}s)")
    print("ENGINE:", (ROOT / "out" / "tts_engine.txt").read_text() if (ROOT / "out" / "tts_engine.txt").exists() else "?")
    _vn = ROOT / "out" / "tts_voice_name.txt"
    if _vn.exists() and _vn.read_text().strip():
        print("VOICE_NAME:", _vn.read_text().strip())


STEM_FILES = ("voice.flac", "timing.json", "lyrics.json", "script.json", "stems.json")


def save_stems(slug, d):
    """Keep the parts of a build separate (voice, word timing, the exact script used) so sound can be re-mixed later
    without re-rendering the picture or re-generating the voice. Hosted next to the videos on the media branch."""
    name = Path(slug).name
    run("ffmpeg", "-v", "error", "-y", "-i", str(ROOT / "audio" / "voiceover.wav"), "-c:a", "flac", str(d / f"{name}.voice.flac"))
    for src, ext in ((ROOT / "out" / "timing.json", "timing.json"), (ROOT / "data" / "lyrics.json", "lyrics.json"), (ROOT / "data" / "script.json", "script.json")):
        (d / f"{name}.{ext}").write_bytes(src.read_bytes())
    eng = (ROOT / "out" / "tts_engine.txt").read_text().strip() if (ROOT / "out" / "tts_engine.txt").exists() else "?"
    vn = (ROOT / "out" / "tts_voice_name.txt").read_text().strip() if (ROOT / "out" / "tts_voice_name.txt").exists() else ""
    (d / f"{name}.stems.json").write_text(json.dumps({"engine": eng, "voice_name": vn}))


def remix(slug, d):
    """REMIX=1: audio-only rebuild from the hosted stems (picture = the hosted <slug>.mp4 video stream, voice + timing
    + script as built). Applies the current mix settings (shorts/voice/audio_mix.json), music and sound effects to all
    three platform copies in about a minute. Returns False (-> full build) if the stems aren't hosted."""
    import os, urllib.request
    name, date = Path(slug).name, os.environ.get("COVER_DATE")
    if not date:
        return False
    base = f"https://raw.githubusercontent.com/{os.environ.get('GITHUB_REPOSITORY', 'SamShark777/motion-as-code')}/media/{date}/"
    pic = ROOT / "out" / f"{name}.picture.mp4"
    try:
        (ROOT / "out").mkdir(exist_ok=True)
        urllib.request.urlretrieve(base + f"{name}.mp4", pic)
        for ext in STEM_FILES:
            urllib.request.urlretrieve(base + f"{name}.{ext}", d / f"{name}.{ext}")
    except Exception as e:
        print(f"REMIX: stems not hosted for {name} ({e}); doing a full build", flush=True)
        return False
    (ROOT / "audio").mkdir(exist_ok=True)
    run("ffmpeg", "-v", "error", "-y", "-i", str(d / f"{name}.voice.flac"), str(ROOT / "audio" / "voiceover.wav"))
    (ROOT / "out" / "timing.json").write_bytes((d / f"{name}.timing.json").read_bytes())
    (ROOT / "data" / "lyrics.json").write_bytes((d / f"{name}.lyrics.json").read_bytes())
    (ROOT / "data" / "script.json").write_bytes((d / f"{name}.script.json").read_bytes())
    for v in ("", "instagram", "tiktok"):
        mix = ROOT / "out" / (f"mix.{v}.wav" if v else "mix.wav")
        out = d / (f"{name}.{v}.mp4" if v else f"{name}.mp4")
        run(sys.executable, str(ROOT / "analysis" / "ted2_audio.py"), str(ROOT / "data" / "script.json"), str(ROOT / "out" / "timing.json"),
            env=dict(os.environ, MUSIC_VARIANT=v, MIX_OUT=str(mix)))
        run("ffmpeg", "-v", "error", "-y", "-i", str(pic), "-i", str(mix), "-map", "0:v", "-map", "1:a", "-c:v", "copy", "-c:a", "aac",
            "-b:a", "192k", "-shortest", "-movflags", "+faststart", str(out))
    mu = {v: json.loads((ROOT / "out" / f"music.{v}.json").read_text()) for v in ("youtube", "instagram", "tiktok") if (ROOT / "out" / f"music.{v}.json").exists()}
    (d / "music.json").write_text(json.dumps(mu, indent=1))
    try:
        urllib.request.urlretrieve(base + f"{name}.jpg", d / "preview.jpg")
    except Exception:
        pass
    st = json.loads((d / f"{name}.stems.json").read_text())
    pic.unlink(missing_ok=True)
    print(f"remixed {name} (audio only)")
    print("ENGINE:", st.get("engine", "?"))
    if st.get("voice_name"):
        print("VOICE_NAME:", st["voice_name"])
    return True


def capture(slug, out, frm, to, W, H):
    import os
    env = dict(os.environ, CAP_W=str(W), CAP_H=str(H), CAP_FROM=str(frm or 0))
    args = ["node", str(ROOT / "scripts" / "cap_design.mjs"), str(ROOT / "shorts"), f"{slug}/index.html", str(out), "30"]
    if to:
        args.append(str(to))
    run(*args, cwd=str(ROOT / "scripts"), env=env)


if __name__ == "__main__":
    main()
