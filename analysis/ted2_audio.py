"""Ted type 2 soundtrack, the "One More Never Enough" way: narration + scene-timed sound effects + the
F-major pad bed that ducks under the voice. -> out/mix.wav (48 kHz stereo)
    python3 analysis/ted2_audio.py <script.json> <timing.json>
Inputs: audio/voiceover.wav (tts_vo), data/lyrics.json (line spans), the script (scenes, chunk fx, optional
per-line "sfx": [[sound, offset_s, volume], ...]) and the scene/chunk timing from design_build.
Levels follow that build: voice peaks at -1 dBFS (~-17.5 LUFS), bed at 0.5, ducked to 0.39 under speech
(~-24 LUFS), effects 0.25-0.4."""
import json, sys
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
    for k, (at, snd, vol) in enumerate(sorted(cues)):
        x = L.get(snd) * vol
        s = int(at * SR)
        if s >= n:
            continue
        e = min(n, s + len(x))
        sfx[s:e] += x[: e - s]
    # bed, ducked under each narration line
    m = L.music(total).astype(np.float32)[:n]
    m = np.pad(m, (0, n - len(m)))
    spans = [(ln["start"], ln["end"]) for ln in json.loads((ROOT / "data" / "lyrics.json").read_text())["lines"]]
    t = np.arange(n) / SR
    duck = np.zeros(n, np.float32)
    for a, b in spans:
        up = np.clip((t - (a - DUCK_RAMP)) / DUCK_RAMP, 0, 1)
        down = np.clip(((b + DUCK_RAMP) - t) / DUCK_RAMP, 0, 1)
        duck = np.maximum(duck, np.minimum(up, down))
    vol = MUSIC_VOLUME + (MUSIC_DUCKED - MUSIC_VOLUME) * duck
    mix = v + m * vol + sfx
    peak = np.abs(mix).max()
    if peak > 0.89:
        mix *= 0.89 / peak
    (ROOT / "out").mkdir(exist_ok=True)
    sf.write(str(ROOT / "out" / "mix.wav"), np.stack([mix, mix], 1), SR)
    print(f"ted2 mix: {total:.1f}s, {len(cues)} sound cues")


if __name__ == "__main__":
    main()
