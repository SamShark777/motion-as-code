"""Study other channels: find each by name, pull their recent videos (title, views, length, date), and for the
top few videos the description, tags, thumbnail and English transcript. CI only (needs YouTube access).
    python3 scripts/channel_scan.py "Name One|Name Two|..." <outdir>
Writes <outdir>/<channel>/{channel.json, top/<id>.json, top/<id>.en.vtt, top/<id>.jpg} and <outdir>/summary.json."""
import json, re, subprocess, sys
from pathlib import Path

TOP = 4


def ytj(*args):
    r = subprocess.run(["yt-dlp", "-J", "--no-warnings", "--ignore-errors", *args], capture_output=True, text=True, timeout=600)
    try:
        return json.loads(r.stdout or "null")
    except json.JSONDecodeError:
        print("yt-dlp failed:", r.stderr[-400:])
        return None


def slug(s):
    return re.sub(r"[^a-z0-9]+", "-", s.lower()).strip("-")[:40]


def find_channel(name):
    # YouTube search, channels only
    res = ytj("--flat-playlist", "--playlist-end", "5", f"https://www.youtube.com/results?search_query={name.replace(' ', '+')}&sp=EgIQAg%3D%3D")
    ents = (res or {}).get("entries") or []
    want = re.sub(r"\W", "", name.lower())
    for e in ents:
        if re.sub(r"\W", "", (e.get("title") or e.get("channel") or "").lower()) == want:
            return e.get("url") or e.get("channel_url")
    return (ents[0].get("url") or ents[0].get("channel_url")) if ents else None


def main():
    names = [n.strip() for n in sys.argv[1].split("|") if n.strip()]
    out = Path(sys.argv[2]); out.mkdir(parents=True, exist_ok=True)
    summary = []
    for name in names:
        url = find_channel(name)
        print(f"{name}: {url}")
        if not url:
            summary.append({"name": name, "error": "not found"}); continue
        d = out / slug(name); (d / "top").mkdir(parents=True, exist_ok=True)
        vids, ch = [], {}
        for tab in ("videos", "shorts"):
            r = ytj("--flat-playlist", "--playlist-end", "60", url.rstrip("/") + "/" + tab)
            for e in (r or {}).get("entries") or []:
                vids.append({"id": e.get("id"), "title": e.get("title"), "views": e.get("view_count"), "dur": e.get("duration"), "tab": tab})
            if r and tab == "videos":
                ch = {k: r.get(k) for k in ("channel", "channel_id", "channel_follower_count", "description", "uploader_id")}
        ch.update({"name": name, "url": url, "videos": vids})
        (d / "channel.json").write_text(json.dumps(ch, indent=1))
        top = sorted([v for v in vids if v["views"]], key=lambda v: -v["views"])[:TOP]
        for v in top:
            subprocess.run(["yt-dlp", "--no-warnings", "--skip-download", "--write-info-json", "--write-thumbnail", "--convert-thumbnails", "jpg",
                            "--write-auto-subs", "--write-subs", "--sub-langs", "en.*,en", "--sub-format", "vtt",
                            "-o", str(d / "top" / "%(id)s.%(ext)s"), f"https://www.youtube.com/watch?v={v['id']}"], timeout=600)
            ij = d / "top" / f"{v['id']}.info.json"
            if ij.exists():
                I = json.loads(ij.read_text())
                slim = {k: I.get(k) for k in ("id", "title", "description", "tags", "duration", "view_count", "like_count", "comment_count",
                                              "upload_date", "categories", "chapters")}
                (d / "top" / f"{v['id']}.json").write_text(json.dumps(slim, indent=1))
                ij.unlink()
        summary.append({"name": name, "channel": ch.get("channel"), "subs": ch.get("channel_follower_count"), "n": len(vids),
                        "top": [(v["title"], v["views"], v["dur"], v["tab"]) for v in top]})
    (out / "summary.json").write_text(json.dumps(summary, indent=1))
    for s in summary:
        print("SCAN", json.dumps(s)[:1500])


if __name__ == "__main__":
    main()
