"""GitHub Actions side of the Shorts pipeline (see .github/workflows/daily-shorts.yml on main).

    python3 scripts/ci_shorts.py plan              # pick tomorrow's batch -> matrix JSON on stdout / $GITHUB_OUTPUT
    python3 scripts/ci_shorts.py check <slug>      # QA a finished build -> dist/<slug>/meta.json (exit 0 even on failure)
    python3 scripts/ci_shorts.py publish dist      # host, schedule on Buffer, reconcile vetoes, update tracker, write issue.md

Scripts are written ahead of time by Claude (Status "Scripted" + shorts/<slug>/script.json). Each day the
workflow builds the next SHORTS_PER_DAY of them and schedules them for tomorrow at SLOTS (America/Los_Angeles).
"""
import datetime as dt, json, os, re, subprocess, sys, time, shutil, tempfile
from pathlib import Path
from zoneinfo import ZoneInfo

ROOT = Path(__file__).resolve().parent.parent
TZ = ZoneInfo("America/Los_Angeles")
REPO = os.environ.get("GITHUB_REPOSITORY", "SamShark777/motion-as-code")
N = int(os.environ.get("SHORTS_PER_DAY") or 3)
SLOTS = [s.strip() for s in (os.environ.get("SLOTS") or "09:00,14:00,19:00").split(",") if s.strip()]
KEEP_DAYS = 4  # media branch keeps this many post dates (Buffer needs the URL until the post goes out)
# Story Shorts (format "story") are built only by manual test runs (only_slugs) until this post date:
# Shivam's format freeze runs to 2026-10-31. Override with a STORY_FROM env var (e.g. in the workflow).
STORY_FROM = os.environ.get("STORY_FROM") or "2026-11-01"


def sh(*a, **k):
    return subprocess.run(a, check=True, text=True, capture_output=True, **k).stdout


def tracker(*a):
    return sh(sys.executable, str(ROOT / "scripts" / "tracker.py"), *a)


def tomorrow():
    return dt.datetime.now(TZ).date() + dt.timedelta(days=1)


def gh_out(k, v):
    p = os.environ.get("GITHUB_OUTPUT")
    if p:
        with open(p, "a") as f:
            f.write(f"{k}={v}\n")


# ------------------------------------------------------------------ plan
def plan():
    day = tomorrow()
    taken = sum(1 for r in json.loads(tracker("scheduled")) if r.get("Post date") == day.isoformat())
    n = max(0, min(N, len(SLOTS)) - taken)
    batch = []
    override = [s.strip() for s in (os.environ.get("ONLY_SLUGS") or "").split(",") if s.strip()]
    if override:  # manual test run: build exactly these (always a dry run)
        n, taken = len(override), 0
        rows = [{"No.": json.loads((ROOT / "shorts" / s / "script.json").read_text()).get("no", 0), "Slug": s} for s in override]
    else:
        rows = json.loads(tracker("queue", "50"))
    for r in rows:
        slug = r.get("Slug")
        if not slug or not (ROOT / "shorts" / slug / "script.json").exists():
            print(f"skip No.{r['No.']}: Scripted but no shorts/<slug>/script.json", file=sys.stderr)
            continue
        if not override and day.isoformat() < STORY_FROM and json.loads((ROOT / "shorts" / slug / "script.json").read_text()).get("format") == "story":
            print(f"hold No.{r['No.']}: story Short, not posted before {STORY_FROM}", file=sys.stderr)
            continue
        if len(batch) >= n:
            break
        slot = SLOTS[(taken + len(batch)) % len(SLOTS)]
        d = day
        at = [x.strip() for x in (os.environ.get("SCHEDULE_AT") or "").split(",") if x.strip()]
        if override and len(at) > len(batch):  # re-make: explicit PT times, e.g. 2026-10-14T17:00
            when = dt.datetime.fromisoformat(at[len(batch)])
            d, slot = when.date(), when.strftime("%H:%M")
        due = dt.datetime.combine(d, dt.time.fromisoformat(slot), TZ)
        batch.append({"no": r["No."], "slug": slug, "date": d.isoformat(), "slot": slot,
                      "due": due.astimezone(dt.timezone.utc).strftime("%Y-%m-%dT%H:%M:%S.000Z")})
    counts = json.loads(tracker("counts"))
    print(json.dumps({"day": day.isoformat(), "already": taken, "batch": batch, "scripted_left": counts.get("Scripted", 0) - len(batch)}, indent=1), file=sys.stderr)
    (ROOT / "plan.json").write_text(json.dumps(batch))
    gh_out("matrix", json.dumps({"include": batch}))
    gh_out("count", str(len(batch)))
    print(json.dumps(batch))


# ------------------------------------------------------------------ check
def check(slug):
    d = ROOT / "shorts" / slug
    mp4 = d / f"{slug}.mp4"
    out = ROOT / "dist" / slug
    out.mkdir(parents=True, exist_ok=True)
    meta = {"slug": slug, "ok": False, "problems": []}
    log = (ROOT / "out" / "build.log").read_text(errors="replace") if (ROOT / "out" / "build.log").exists() else ""
    m = re.search(r"^ENGINE: (\w+)", log, re.M)
    meta["engine"] = m.group(1) if m else "?"
    fb = re.search(r"^FALLBACK: (.+)$", log, re.M)
    if fb:
        meta["fallback"] = fb.group(1)[:300]
    if not mp4.exists():
        meta["problems"].append("build produced no video")
    else:
        pr = json.loads(sh("ffprobe", "-v", "error", "-show_entries", "format=duration:stream=codec_type,width,height", "-of", "json", str(mp4)))
        dur = float(pr["format"]["duration"])
        meta["duration"] = round(dur, 1)
        v = [s for s in pr["streams"] if s["codec_type"] == "video"]
        a = [s for s in pr["streams"] if s["codec_type"] == "audio"]
        if not v or (v[0]["width"], v[0]["height"]) != (1080, 1920):
            meta["problems"].append(f"not 1080x1920 vertical ({v[0]['width']}x{v[0]['height']})" if v else "no video stream")
        if not a:
            meta["problems"].append("no audio")
        if not 12 <= dur <= 59.5:
            meta["problems"].append(f"length {dur:.1f}s outside 12-59.5 s (too long for a Short)")
        vol = subprocess.run(["ffmpeg", "-hide_banner", "-i", str(mp4), "-af", "volumedetect", "-vn", "-f", "null", "-"], capture_output=True, text=True).stderr
        mv = re.search(r"mean_volume: (-?[\d.]+) dB", vol)
        meta["mean_db"] = float(mv.group(1)) if mv else None
        if meta["mean_db"] is None or meta["mean_db"] < -38:
            meta["problems"].append(f"audio nearly silent (mean {meta['mean_db']} dB)")
        # frozen video: the frame at 40 % and 80 % must differ from the first
        sig = []
        for t in (0.5, dur * 0.4, dur * 0.8):
            png = subprocess.run(["ffmpeg", "-v", "error", "-ss", f"{t:.2f}", "-i", str(mp4), "-frames:v", "1", "-vf", "scale=54:96", "-f", "rawvideo", "-pix_fmt", "gray", "-"], capture_output=True).stdout
            sig.append(png)
        if len(set(sig)) < 2:
            meta["problems"].append("video looks frozen")
        shutil.copy(mp4, out / mp4.name)
        for v in d.glob(f"{slug}.*.mp4"):  # per-platform music variants
            shutil.copy(v, out / v.name)
        if (d / "preview.jpg").exists():
            shutil.copy(d / "preview.jpg", out / "preview.jpg")
    meta["ok"] = not meta["problems"]
    (out / "meta.json").write_text(json.dumps(meta, indent=1))
    if log:
        (out / "build.log").write_text(log[-20000:])
    print(json.dumps(meta, indent=1))


# ------------------------------------------------------------------ publish
def host(dist, batch):
    """Force-push an orphan `media` branch holding <date>/<slug>.mp4 (+ .jpg) for the last KEEP_DAYS dates."""
    tmp = Path(tempfile.mkdtemp())
    url = f"https://x-access-token:{os.environ['GITHUB_TOKEN']}@github.com/{REPO}.git" if os.environ.get("GITHUB_TOKEN") else f"https://github.com/{REPO}.git"
    keep_from = (dt.datetime.now(TZ).date() - dt.timedelta(days=KEEP_DAYS - 2)).isoformat()
    try:
        sh("git", "clone", "-q", "--depth", "1", "--branch", "media", url, str(tmp / "old"))
        for p in (tmp / "old").iterdir():
            if re.fullmatch(r"\d{4}-\d\d-\d\d", p.name) and p.name >= keep_from:
                shutil.copytree(p, tmp / "new" / p.name)
    except subprocess.CalledProcessError:
        pass
    (tmp / "new").mkdir(exist_ok=True)
    for b in batch:
        src = dist / b["slug"]
        if (src / "meta.json").exists() and json.loads((src / "meta.json").read_text())["ok"]:
            dd = tmp / "new" / b["date"]
            dd.mkdir(parents=True, exist_ok=True)
            shutil.copy(src / f"{b['slug']}.mp4", dd / f"{b['slug']}.mp4")
            for v in src.glob(f"{b['slug']}.*.mp4"):
                shutil.copy(v, dd / v.name)
            if (src / "preview.jpg").exists():
                shutil.copy(src / "preview.jpg", dd / f"{b['slug']}.jpg")
    (tmp / "new" / "README.md").write_text("Hosting for the scheduled Shorts (Buffer fetches the videos from here). Rewritten daily; keeps the last few days.\n")
    g = ["git", "-C", str(tmp / "new")]
    sh(*g, "init", "-q")
    sh(*g, "checkout", "-q", "-b", "media")
    sh(*g, "add", ".")
    sh(*g, "-c", "user.name=shorts-bot", "-c", "user.email=shorts-bot@users.noreply.github.com", "-c", "commit.gpgsign=false", "commit", "-qm", f"media: {dt.date.today()}")
    sh(*g, "push", "-q", "-f", url, "media")


def raw(date, name):
    return f"https://raw.githubusercontent.com/{REPO}/media/{date}/{name}"


def wait_url(u, tries=24):
    for _ in range(tries):
        code = subprocess.run(["curl", "-sIL", "-o", "/dev/null", "-w", "%{http_code}", u], capture_output=True, text=True).stdout
        if code == "200":
            return True
        time.sleep(5)
    return False


def buffer(*a):
    return json.loads(sh(sys.executable, str(ROOT / "scripts" / "buffer.py"), *a))


def reconcile(have_key):
    """Scheduled Buffer rows whose post date has passed -> Published, or Vetoed if Shivam deleted them in Buffer.
    Buffer is read channel by channel: a channel Buffer won't let us read (locked/disconnected) never counts as
    "deleted"; a row whose channels are all unreadable is marked Published (it was scheduled fine) with a note."""
    today = dt.datetime.now(TZ).date().isoformat()
    due = [r for r in json.loads(tracker("scheduled")) if r.get("Post date") and r["Post date"] < today and str(r.get("Metricool ID") or "").startswith("buffer:")]
    if not due or not have_key:
        return []
    try:
        res = buffer("posts", "--meta")
        live, failed = {p["id"]: p for p in res["posts"]}, res.get("failed") or {}
    except Exception as e:
        print(f"reconcile skipped: {e}", file=sys.stderr)
        return [f"⚠️ Couldn't read Buffer, so {len(due)} past posts stay Scheduled until the next run ({str(e)[:150]})"]
    notes = []
    if failed:
        notes.append("⚠️ Buffer wouldn't list posts for: " + ", ".join(f"{s} ({e[:80]})" for s, e in failed.items()))
    for r in due:
        ids = dict(kv.split("=", 1) for kv in str(r["Metricool ID"])[7:].split(";") if "=" in kv)
        readable = {s: i for s, i in ids.items() if s not in failed}
        alive = [s for s, i in readable.items() if i in live]
        if alive:
            st, why = "Published", ""
        elif readable:
            st, why = "Vetoed", " (deleted in Buffer)"
        else:
            st, why = "Published", " (not verified: Buffer channel unreadable)"
        tracker("set", str(r["No."]), f"Status={st}")
        notes.append(f"No.{r['No.']} {r['Slug']}: {st}{why}")
    return notes


def refresh_links(have_key):
    """Write each sent post's public links (YouTube/Instagram/TikTok) into shorts/<slug>/post.json — Studio Control reads them."""
    if not have_key:
        return
    try:
        live = {p["id"]: p for p in buffer("posts")}
    except Exception as e:
        print(f"links skipped: {e}", file=sys.stderr)
        return
    for pj in list((ROOT / "shorts").glob("*/post.json")) + list((ROOT / "shorts" / "long").glob("*/post.json")):
        d = json.loads(pj.read_text())
        links = dict(d.get("links") or {})
        for svc, pid in (d.get("buffer") or {}).items():
            p = live.get(pid)
            if p and p.get("externalLink"):
                links[svc] = p["externalLink"]
        if links != (d.get("links") or {}):
            d["links"] = links
            pj.write_text(json.dumps(d, indent=1))


def publish(dist):
    dist = Path(dist)
    batch = json.loads((ROOT / "plan.json").read_text()) if (ROOT / "plan.json").exists() else []
    have_key = bool(os.environ.get("BUFFER_API_KEY"))
    dry = not have_key or os.environ.get("DRY_RUN") == "1" or (bool(os.environ.get("ONLY_SLUGS")) and not os.environ.get("SCHEDULE_AT"))
    lines = []
    rec = [] if os.environ.get("ONLY_SLUGS") else reconcile(have_key)
    refresh_links(have_key)
    host(dist, batch)
    for b in batch:
        src = dist / b["slug"]
        meta = json.loads((src / "meta.json").read_text()) if (src / "meta.json").exists() else {"ok": False, "problems": ["build job failed (no output) — see the run log"]}
        S = json.loads((ROOT / "shorts" / b["slug"] / "script.json").read_text())
        title = S["post"]["title"]
        vj = json.loads((ROOT / "shorts" / "voice" / "voice.json").read_text())
        want = ((vj.get("ted_engine") or ("elevenlabs" if vj.get("ted_eleven_voice") else None)) if S.get("format") in ("ted1", "cdesign") else None) or (S.get("voice") or {}).get("engine") or ("kokoro" if S.get("format") in ("ted1", "cdesign") else vj.get("engine", "kokoro"))
        names = {"bf_emma": "Emma (British)", "bm_george": "George (British)", "bm_fable": "Fable (British)", "bf_isabella": "Isabella (British)", "am_onyx": "Onyx (deep male)", "am_michael": "Michael + Heart (dialogue)"}
        vcfg = json.loads((ROOT / "shorts" / "voice" / "voice.json").read_text())
        vcfg.update(S.get("voice") or ({"kokoro_voice": "am_onyx"} if S.get("format") in ("ted1", "cdesign") else {}))
        label = (vj.get("ted_engine_name") or meta.get("engine")) if S.get("format") in ("ted1", "cdesign") and meta.get("engine") == vj.get("ted_engine") and not meta.get("fallback") else (vj.get("ted_engine_name") or "Chatterbox") if meta.get("engine") == "chatterbox" else (vj.get("ted_eleven_voice_name") or "ElevenLabs") if meta.get("engine") == "elevenlabs" else names.get(vcfg.get("kokoro_voice"), vcfg.get("kokoro_voice")) if meta.get("engine") == "kokoro" else meta.get("engine")
        voice = f"voice: {label}" if meta.get("engine") == want and not meta.get("fallback") else f"⚠️ fallback voice ({meta.get('engine')}): {meta.get('fallback', '')}"
        head = f"### {b['slot']} PT — {title}\n"
        if not meta["ok"]:
            lines.append(head + f"❌ **Not scheduled** — {'; '.join(meta['problems'])}\n")
            if not dry:
                tracker("set", str(b["no"]), "Status=Failed", f"Lesson / notes=CI {dt.date.today()}: {'; '.join(meta['problems'])[:200]}")
            continue
        vurl = raw(b["date"], f"{b['slug']}.mp4")
        if not wait_url(vurl):
            lines.append(head + f"❌ **Not scheduled** — hosted video never became reachable: {vurl}\n")
            continue
        info = f"{meta['duration']} s · {voice}\n\n![preview]({raw(b['date'], b['slug'] + '.jpg')})\n\n[video]({vurl})\n"
        if dry:
            lines.append(head + "🧪 **Dry run — not scheduled** (no Buffer key yet)\n\n" + info)
            continue
        cover = S.get("format") in ("cdesign", "story") and S.get("orientation") != "landscape" and S.get("cover") is not False
        thumb_ms = int(max(0.0, float(meta["duration"]) - 0.25) * 1000) if cover else 1500  # title cover sits in the last 0.55 s
        urls = {}
        for svc in ("instagram", "tiktok"):
            if (src / f"{b['slug']}.{svc}.mp4").exists():
                u = raw(b["date"], f"{b['slug']}.{svc}.mp4")
                if wait_url(u):
                    urls[svc] = u
        os.environ["BUFFER_URLS"] = json.dumps(urls)
        res = buffer("post", b["slug"], b["due"], vurl, str(thumb_ms))
        os.environ.pop("BUFFER_URLS", None)
        ok = {s: i for s, i in res.items() if s != "errors"}
        errs = res.get("errors", {})
        if not ok:
            # keep it Scripted so tomorrow's run retries it (a Buffer/API problem isn't the script's fault)
            tracker("set", str(b["no"]), f"Lesson / notes=Buffer rejected {dt.date.today()}: {json.dumps(errs)[:200]}")
            lines.append(head + f"❌ **Buffer rejected it** (will retry tomorrow) — {json.dumps(errs)}\n")
            continue
        tracker("set", str(b["no"]), "Status=Scheduled", f"Slug={b['slug']}", f"Post date={b['date']}", f"Length (s)={round(meta['duration'])}",
                f"Title used={title}", f"Hook style={S.get('hookStyle', '')}",
                "Metricool ID=buffer:" + ";".join(f"{s}={i}" for s, i in ok.items()))
        (ROOT / "shorts" / b["slug"] / "post.json").write_text(json.dumps({**b, "url": vurl, "buffer": ok, "errors": errs, "engine": meta.get("engine"), "duration": meta.get("duration")}, indent=1))
        warn = f"\n⚠️ Not on: {', '.join(f'{s} ({e})' for s, e in errs.items())}\n" if errs else ""
        lines.append(head + f"✅ Scheduled on {', '.join(ok)}{warn}\n" + info)
    ig = []
    if not dry:
        try:
            sys.path.insert(0, str(ROOT / "scripts"))
            import ig_catchup
            ig = ig_catchup.run()
        except Exception as e:
            ig = [f"⚠️ Instagram catch-up failed: {str(e)[:200]}"]
    counts = json.loads(tracker("counts"))
    body = [f"**{len(batch)} Shorts for {batch[0]['date'] if batch else tomorrow()}** "
            + ("(dry run: Buffer key not set, nothing scheduled)" if dry else "— to veto one, delete it in [Buffer](https://publish.buffer.com) before its time."), ""]
    body += lines
    if rec:
        body += ["### Earlier posts", *[f"- {x}" for x in rec], ""]
    if ig:
        body += ["### Instagram catch-up", *[f"- {x}" for x in ig], ""]
    left = counts.get("Scripted", 0)
    body.append(f"Scripts ready for later days: **{left}**" + (" — ⚠️ running low, Claude's script writer should top this up." if left < N * 2 else ""))
    (ROOT / "issue.md").write_text("\n".join(body))
    print("\n".join(body))


if __name__ == "__main__":
    c = sys.argv[1] if len(sys.argv) > 1 else ""
    if c == "plan":
        plan()
    elif c == "check":
        check(sys.argv[2])
    elif c == "publish":
        publish(sys.argv[2] if len(sys.argv) > 2 else "dist")
    else:
        sys.exit(__doc__)
