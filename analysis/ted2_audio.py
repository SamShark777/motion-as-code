"""Ted type 2 soundtrack, the "One More Never Enough" way: narration + scene-timed sound effects + the
F-major pad bed that ducks under the voice. -> out/mix.wav (48 kHz stereo)
    python3 analysis/ted2_audio.py <script.json> <timing.json>
Inputs: audio/voiceover.wav (tts_vo), data/lyrics.json (line spans), the script (scenes, chunk fx, optional
per-line "sfx": [[sound, offset_s, volume], ...]) and the scene/chunk timing from design_build.
Levels follow that build: voice peaks at -1 dBFS (~-17.5 LUFS), bed at 0.5, ducked to 0.39 under speech
(~-24 LUFS), effects 0.25-0.4."""
import json, os, sys
from pathlib import Path
import numpy as np
import soundfile as sf

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / "analysis"))
import sfx_lib as L  # noqa: E402

SR = L.SR
FX_SOUND = {"pop": ("pop", 0.38), "circle": ("chime", 0.24), "underline": ("tick", 0.32), "stamp": ("wood-tap", 0.36),
            "type": ("tick", 0.26), "glitch": ("lightning", 0.28), "doodle": ("page-turn", 0.26)}
MUSIC_VOLUME, MUSIC_DUCKED, DUCK_RAMP = 0.5, 0.39, 0.25
LIB_VOLUME, LIB_DUCKED = 0.42, 0.2  # real tracks (normalised to -20 LUFS): ~-27 LUFS between lines, ~-34 under the voice


def story_cues(S, TM):
    """Story Shorts: a soft transition sound where the scene (art) changes, plus each line's own
    "sfx": [[sound, offset_s from the line start, volume], ...] (from the tracker's Sound cues). "auto_sfx": false
    on the script turns the transition sounds off."""
    cues, prev = [], None
    for i, ln in enumerate(S["lines"]):
        st = TM["start"][i]
        if S.get("auto_sfx", True) and ln.get("art") != prev and not ln.get("sfx"):
            cues.append((max(0.0, st - 0.05), "whoosh" if i == 0 or len(cues) % 2 else "swipe", 0.3))
        prev = ln.get("art")
        cues += [(max(0.0, st + float(o)), snd, float(vol)) for snd, o, vol in ln.get("sfx") or []]
    return cues


def main():
    S = json.loads(Path(sys.argv[1]).read_text())
    TM = json.loads(Path(sys.argv[2]).read_text())
    v, vsr = sf.read(str(ROOT / "audio" / "voiceover.wav"), dtype="float32")
    if v.ndim > 1:
        v = v.mean(1)
    if vsr != SR:
        v = np.interp(np.arange(int(len(v) * SR / vsr)) * vsr / SR, np.arange(len(v)), v).astype(np.float32)
    total = len(v) / SR
    n = len(v)
    # cues: scene transitions alternate swipe/whoosh, one accent on each scene's emphasis, a bright chime to close
    cues = []
    lines = S["lines"]
    if S.get("format") == "story":
        cues = story_cues(S, TM)
        lines = []  # story cues replace the Ted type 2 automatic ones
    for i, ln in enumerate(lines):
        st = TM["start"][i]
        if ln.get("sfx"):
            cues += [(st + float(o), s, float(vol)) for s, o, vol in ln["sfx"]]
            continue
        if i == len(lines) - 1:
            cues.append((st + 0.25, "chime-bright", 0.26))
        elif i > 0:
            cues.append((max(0, st - 0.05), "swipe" if i % 2 else "whoosh", 0.30 if i % 2 else 0.32))
        else:
            cues.append((0.05, "whoosh", 0.3))
        for j, c in enumerate(ln["chunks"]):
            fx = c[1].get("fx") if len(c) > 1 and isinstance(c[1], dict) else None
            if fx and i != len(lines) - 1:
                snd, vol = FX_SOUND.get(fx, ("pop", 0.34))
                cues.append((TM["chunks"][i][j] + 0.05, snd, vol))
    sfx = np.zeros(n, np.float32)
    rate = 0.94 + (L.hash_seed(str(S.get("slug")) + "sfx" + os.environ.get("MUSIC_VARIANT", "")) % 1000) / 1000 * 0.12  # per-video pitch of the effects (0.94-1.06)
    for k, (at, snd, vol) in enumerate(sorted(cues)):
        x = L.get(snd) * vol
        x = np.interp(np.arange(0, len(x) - 1, rate), np.arange(len(x)), x).astype(np.float32)
        s = int(at * SR)
        if s >= n:
            continue
        e = min(n, s + len(x))
        sfx[s:e] += x[: e - s]
    # bed, ducked under each narration line
    variant = os.environ.get("MUSIC_VARIANT", "")  # per-platform music (youtube = "", instagram, tiktok)
    seed = (S.get("music_seed") or S.get("slug") or Path(sys.argv[1]).parent.name) + (":" + variant if variant else "")
    vibe = L.pick_vibe(S)
    import music_lib as ML, subprocess, tempfile
    idx = S.get("cover_index")
    if idx is None:
        idx = L.hash_seed(str(S.get("slug"))) % 100000
    tr = ML.pick(vibe, idx, variant)
    lo, hi = MUSIC_VOLUME, MUSIC_DUCKED
    info = {"vibe": vibe, "generated": True}
    if tr:  # a real track from the library (music branch); level it under the voice
        with tempfile.TemporaryDirectory() as td:
            w = Path(td) / "m.wav"
            subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", str(ML.LIB / tr["file"]), "-t", f"{total:.2f}", "-ac", "1", "-ar", str(SR), str(w)], check=True)
            m, _ = sf.read(str(w), dtype="float32")
        if m.ndim > 1:
            m = m.mean(1)
        fo = min(len(m), int(1.5 * SR))
        m[len(m) - fo:] *= np.linspace(1, 0, fo, dtype=np.float32)
        lo, hi = LIB_VOLUME, LIB_DUCKED
        info = {"vibe": vibe, "title": tr["title"], "credit": tr["credit"]}
        print("music:", tr["title"], f"({vibe})")
    else:
        m = L.music(total, seed, vibe).astype(np.float32)
        print("music:", L.describe(seed, vibe))
    m = np.pad(m[:n], (0, max(0, n - len(m))))
    (ROOT / "out").mkdir(exist_ok=True)
    (ROOT / "out" / f"music.{variant or 'youtube'}.json").write_text(json.dumps(info))
    spans = [(ln["start"], ln["end"]) for ln in json.loads((ROOT / "data" / "lyrics.json").read_text())["lines"]]
    t = np.arange(n) / SR
    duck = np.zeros(n, np.float32)
    for a, b in spans:
        up = np.clip((t - (a - DUCK_RAMP)) / DUCK_RAMP, 0, 1)
        down = np.clip(((b + DUCK_RAMP) - t) / DUCK_RAMP, 0, 1)
        duck = np.maximum(duck, np.minimum(up, down))
    vol = lo + (hi - lo) * duck
    mix = v + m * vol + sfx
    peak = np.abs(mix).max()
    if peak > 0.89:
        mix *= 0.89 / peak
    (ROOT / "out").mkdir(exist_ok=True)
    sf.write(os.environ.get("MIX_OUT") or str(ROOT / "out" / "mix.wav"), np.stack([mix, mix], 1), SR)
    print(f"ted2 mix: {total:.1f}s, {len(cues)} sound cues")


if __name__ == "__main__":
    main()
