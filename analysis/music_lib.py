"""Real-music library for the Shorts (Kevin MacLeod / incompetech.com, CC BY 4.0 — credit goes in each caption).

    python3 analysis/music_lib.py fetch <outdir>     # CI only (needs internet): builds the library in <outdir>
    python3 analysis/music_lib.py list  <libdir>     # show what's in it

The library lives on the orphan `music` branch (checked out to ./music in the build job):
    library.json  {"tracks": [{"file", "title", "vibe", "feel", "bpm", "credit"}]}
    <id>.ogg      first ~100 s of each track, mono 48 kHz, loudness-normalised to -20 LUFS

pick(vibe, index, variant) gives each video (and each platform's copy) its own track: within a vibe the
same track can't come back for ~5 days (16 tracks per vibe, 3 videos x 3 platforms a day)."""
import hashlib, json, random, re, subprocess, sys, urllib.parse, urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
LIB = ROOT / "music"
PER_VIBE = 16
CLIP_S = 100

# incompetech "feel" tags -> our vibes (want any of `want`, none of `avoid`)
RULES = {
    "calm":      dict(want={"calming", "relaxed", "peaceful", "serene"}, avoid={"dark", "eerie", "intense", "epic", "action", "aggressive", "driving"}, bpm=(0, 105)),
    "uplifting": dict(want={"uplifting", "bright", "hopeful"}, avoid={"dark", "eerie", "somber", "aggressive", "epic"}, bpm=(70, 135)),
    "playful":   dict(want={"bouncy", "humorous", "quirky", "playful"}, avoid={"dark", "eerie", "somber", "aggressive"}, bpm=(80, 150)),
    "mystery":   dict(want={"mysterious", "mystical", "unnerving"}, avoid={"action", "epic", "aggressive", "bouncy", "humorous"}, bpm=(0, 120)),
    "tense":     dict(want={"suspenseful", "tense", "dark"}, avoid={"action", "epic", "aggressive", "humorous", "bouncy"}, bpm=(0, 130)),
    "lofi":      dict(want={"grooving", "chill"}, avoid={"dark", "eerie", "action", "epic", "aggressive", "intense"}, bpm=(60, 110)),
}
SKIP_FEEL = {"medieval", "ren faire", "christmas", "holiday", "horror", "march", "patriotic", "western"}
SKIP_INSTR = ("vocal", "voice", "choir", "singer")
SRC = "https://incompetech.com/music/royalty-free/"


def credit(title):
    return f'Music: "{title}" by Kevin MacLeod (incompetech.com), CC BY 4.0'


def secs(s):
    p = [int(x) for x in re.findall(r"\d+", s or "0")]
    return sum(v * 60 ** i for i, v in enumerate(reversed(p)))


def fetch(out: Path):
    out.mkdir(parents=True, exist_ok=True)
    req = lambda u: urllib.request.urlopen(urllib.request.Request(u, headers={"User-Agent": "Mozilla/5.0"}), timeout=60)
    pieces = json.loads(req(SRC + "pieces.json").read())
    print(f"{len(pieces)} pieces in the catalogue")
    used, tracks = set(), []
    for vibe, r in RULES.items():
        cand = []
        for p in pieces:
            feel = {f.strip().lower() for f in (p.get("feel") or "").split(",") if f.strip()}
            inst = (p.get("instruments") or "").lower()
            try:
                bpm = int(p.get("bpm") or 0)
            except ValueError:
                bpm = 0
            if p["filename"] in used or not feel & r["want"] or feel & r["avoid"] or feel & SKIP_FEEL:
                continue
            if any(k in inst for k in SKIP_INSTR) or secs(p.get("length")) < 75:
                continue
            if bpm and not (r["bpm"][0] <= bpm <= r["bpm"][1]):
                continue
            cand.append(p)
        random.Random(vibe).shuffle(cand)
        got = 0
        for p in cand:
            if got >= PER_VIBE:
                break
            tid = hashlib.sha1(p["filename"].encode()).hexdigest()[:10]
            mp3 = out / f"{tid}.mp3"
            try:
                mp3.write_bytes(req(SRC + "mp3-royaltyfree/" + urllib.parse.quote(p["filename"])).read())
                subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", str(mp3), "-t", str(CLIP_S), "-ac", "1", "-ar", "48000",
                                "-af", "loudnorm=I=-20:TP=-2:LRA=11", "-c:a", "libopus", "-b:a", "64k", str(out / f"{tid}.ogg")], check=True)
            except Exception as e:
                print("skip", p["title"], e)
                continue
            finally:
                mp3.unlink(missing_ok=True)
            used.add(p["filename"])
            tracks.append({"file": f"{tid}.ogg", "title": p["title"], "vibe": vibe, "feel": p.get("feel"), "bpm": p.get("bpm"),
                           "credit": credit(p["title"])})
            got += 1
        print(f"{vibe}: {got} tracks (from {len(cand)} matches)")
    (out / "library.json").write_text(json.dumps({"source": "incompetech.com (Kevin MacLeod), CC BY 4.0", "tracks": tracks}, indent=1))
    print(f"library: {len(tracks)} tracks")


def load():
    f = LIB / "library.json"
    return json.loads(f.read_text())["tracks"] if f.exists() else []


def pick(vibe, index, variant=""):
    """The track for this video (index = posting-slot number) and platform copy, or None if no library."""
    T = load()
    pool = [t for t in T if t["vibe"] == vibe] or [t for t in T if t["vibe"] == "calm"] or T
    if not pool:
        return None
    random.Random(vibe).shuffle(pool)
    off = {"": 0, "youtube": 0, "instagram": 1, "tiktok": 2}.get(variant, 0)
    return pool[(int(index) * 3 + off) % len(pool)]


if __name__ == "__main__":
    if sys.argv[1] == "fetch":
        fetch(Path(sys.argv[2]))
    else:
        LIB = Path(sys.argv[2]) if len(sys.argv) > 2 else LIB
        for t in load():
            print(t["vibe"], "|", t["title"], "|", t["feel"])
