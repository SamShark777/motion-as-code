"""Instagram catch-up for Shorts that went out on YouTube/TikTok but missed Instagram (Buffer IG was locked Oct 15-18).

Queue: shorts/ig_catchup.json — {"time": "11:30", "upcoming": [slugs], "backlog": [slugs]}
  upcoming  already-scheduled Shorts: Instagram is added at the post's own time (url from its post.json).
  backlog   already-posted Shorts: ONE per run, at <time> PT the next day, video from the `ig-backlog` branch.
State lives in each post.json: once buffer.instagram is set the slug is done (so re-runs never double-post).
Buffer free plan queues max 10 posts per channel, hence one backlog Reel a day rather than all at once.

    python3 scripts/ig_catchup.py            # run (needs BUFFER_API_KEY); prints lines for the daily issue
    python3 scripts/ig_catchup.py --dry      # show what it would do
"""
import datetime as dt, json, subprocess, sys
from pathlib import Path
from zoneinfo import ZoneInfo

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / "scripts"))
TZ = ZoneInfo("America/Los_Angeles")
Q = ROOT / "shorts" / "ig_catchup.json"
BACKLOG_URL = "https://raw.githubusercontent.com/SamShark777/motion-as-code/ig-backlog/{}.mp4"


def pj(slug):
    return ROOT / "shorts" / slug / "post.json"


def done(slug):
    return "instagram" in (json.loads(pj(slug).read_text()).get("buffer") or {})


def record(slug, pid, due, url):
    p = pj(slug)
    d = json.loads(p.read_text())
    d.setdefault("buffer", {})["instagram"] = pid
    d.setdefault("errors", {}).pop("instagram", None)
    d["instagram_catchup"] = {"due": due, "url": url}
    p.write_text(json.dumps(d, indent=1))
    import tracker
    wb, ws, H, rows = tracker.load()
    for r in rows.values():
        if ws.cell(r, H["Slug"]).value == slug:
            mid = str(ws.cell(r, H["Metricool ID"]).value or "")
            if mid.startswith("buffer:") and "instagram=" not in mid:
                ws.cell(r, H["Metricool ID"]).value = mid + f";instagram={pid}"
                wb.save(tracker.PATH)
            break


def run(dry=False):
    if not Q.exists():
        return []
    q = json.loads(Q.read_text())
    now = dt.datetime.now(dt.timezone.utc)
    jobs = []
    for slug in q.get("upcoming", []):
        if done(slug):
            continue
        d = json.loads(pj(slug).read_text())
        if dt.datetime.fromisoformat(d["due"].replace("Z", "+00:00")) <= now + dt.timedelta(minutes=20):
            continue  # too late for its own slot; it isn't in the backlog list, so it's simply skipped
        jobs.append((slug, d["due"], d["url"], "same time as YouTube/TikTok"))
    todo = [s for s in q.get("backlog", []) if not done(s)]
    if todo:
        hh, mm = map(int, q.get("time", "11:30").split(":"))
        day = dt.datetime.now(TZ).date() + dt.timedelta(days=1)
        due = dt.datetime(day.year, day.month, day.day, hh, mm, tzinfo=TZ).astimezone(dt.timezone.utc)
        due_s = due.strftime("%Y-%m-%dT%H:%M:%S.000Z")
        already = [s for s in q["backlog"] if done(s) and (json.loads(pj(s).read_text()).get("instagram_catchup") or {}).get("due") == due_s]
        if not already:
            jobs.append((todo[0], due_s, BACKLOG_URL.format(todo[0]), f"catch-up {day:%a %b %-d} {hh:02d}:{mm:02d} PT"))
    notes = []
    if not jobs:
        if not todo and not any(not done(s) for s in q.get("upcoming", [])):
            notes.append("Instagram catch-up: all done — the ig-backlog branch and shorts/ig_catchup.json can be deleted.")
        return notes
    if dry:
        return [f"would post {s} to Instagram at {due} ({why})" for s, due, url, why in jobs]
    import buffer
    _, m = buffer.channel_map()
    if "instagram" not in m:
        return ["⚠️ Instagram catch-up: no Instagram channel in Buffer"]
    for slug, due, url, why in jobs:
        post = json.loads((ROOT / "shorts" / slug / "script.json").read_text())["post"]
        try:
            pid = buffer.create(m["instagram"]["id"], "instagram", post, url, due)
        except Exception as e:
            notes.append(f"⚠️ Instagram catch-up {slug}: {str(e)[:200]}")
            continue
        record(slug, pid, due, url)
        notes.append(f"📸 {slug} → Instagram ({why})")
    left = len([s for s in q.get("backlog", []) if not done(s)])
    notes.append(f"Instagram backlog left: {left}")
    return notes


if __name__ == "__main__":
    print("\n".join(run(dry="--dry" in sys.argv)))
