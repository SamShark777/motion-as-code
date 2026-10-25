"""Stick or Twist (@stickortwist2) — hosts the Shadow PC's rendered videos and schedules them on the
channel's OWN Buffer account (secret BUFFER_API_KEY_STICK, passed in as BUFFER_API_KEY).

Separate from the psychology pipeline on purpose:
  - videos arrive on branch `media-stick` in inbox/<slug>.mp4 + inbox/<slug>.json (pushed by the Shadow PC)
  - this script rewrites `media-stick` as an orphan branch (inbox + the last KEEP_DAYS post dates), so video
    history never piles up in git, and never touches the psychology `media` branch
  - records live in stick/posted.json on the `shorts` branch

    python3 scripts/stick_publish.py check      # list the Stick Buffer channels + the inbox
    python3 scripts/stick_publish.py publish    # schedule tomorrow's batch (dry run without a key or with DRY_RUN=1)

Env: BUFFER_API_KEY (the Stick account's key), GITHUB_TOKEN, STICK_PER_DAY (default 4),
     STICK_SLOTS (default 08:00,12:00,16:00,20:00 America/Los_Angeles), DRY_RUN.
Writes issue.md (summary for Shivam).
"""
import datetime as dt, json, os, re, shutil, subprocess, sys, tempfile, time
from pathlib import Path
from zoneinfo import ZoneInfo

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / "scripts"))
import buffer  # noqa: E402  (same GraphQL client as the psychology pipeline; key comes from env)

REPO = os.environ.get("GITHUB_REPOSITORY", "SamShark777/motion-as-code")
BRANCH = "media-stick"
TZ = ZoneInfo("America/Los_Angeles")
KEEP_DAYS = 4
PER_DAY = int(os.environ.get("STICK_PER_DAY") or 4)
SLOTS = [s.strip() for s in (os.environ.get("STICK_SLOTS") or "08:00,12:00,16:00,20:00").split(",") if s.strip()]
LOG = ROOT / "stick" / "posted.json"
HANDLE = "@stickortwist2"
TAGS = "#stickortwist #whatwouldyoudo #storytime #shorts"


def sh(*a):
    return subprocess.run(a, check=True, capture_output=True, text=True).stdout


def remote():
    tok = os.environ.get("GITHUB_TOKEN")
    return f"https://x-access-token:{tok}@github.com/{REPO}.git" if tok else f"https://github.com/{REPO}.git"


def raw(path):
    return f"https://raw.githubusercontent.com/{REPO}/{BRANCH}/{path}"


def wait_url(u, tries=30):
    for _ in range(tries):
        code = subprocess.run(["curl", "-sIL", "-o", "/dev/null", "-w", "%{http_code}", u], capture_output=True, text=True).stdout
        if code == "200":
            return True
        time.sleep(5)
    return False


def load_log():
    return json.loads(LOG.read_text()) if LOG.exists() else {"posts": []}


def post_text(meta):
    desc = (meta.get("description") or meta.get("title") or "").strip()
    if HANDLE not in desc:
        desc += f"\n\nStick or twist? Comment below 👇 Follow {HANDLE} for Part 2."
    if "#" not in desc:
        desc += "\n\n" + TAGS
    return desc.strip()


def create(channel_id, service, meta, url, due):
    asset = {"video": {"url": url}}
    inp = {"channelId": channel_id, "text": post_text(meta), "schedulingType": "automatic", "mode": "customScheduled",
           "dueAt": due, "assets": [asset], "aiAssisted": False, "needsApproval": False}
    if service == "youtube":  # 24 = Entertainment
        inp["metadata"] = {"youtube": {"title": (meta.get("title") or "Stick or Twist")[:100], "categoryId": "24", "privacy": "public", "madeForKids": False}}
    elif service == "instagram":
        inp["metadata"] = {"instagram": {"type": "reel", "shouldShareToFeed": True}}
        asset["video"]["metadata"] = {"thumbnailOffset": 1500}
    elif service == "tiktok":
        asset["video"]["metadata"] = {"thumbnailOffset": 1500}
    d = buffer.gql("""mutation($input: CreatePostInput!) { createPost(input: $input) {
        __typename ... on PostActionSuccess { post { id dueAt } } ... on MutationError { message } } }""", {"input": inp})
    r = d["createPost"]
    if r.get("post"):
        return r["post"]["id"]
    raise RuntimeError(r.get("message") or json.dumps(r))


def clone_media(tmp):
    try:
        sh("git", "clone", "-q", "--depth", "1", "--branch", BRANCH, remote(), str(tmp))
        return True
    except subprocess.CalledProcessError:
        tmp.mkdir(parents=True, exist_ok=True)
        return False


def inbox(old):
    box = old / "inbox"
    items = []
    for j in sorted(box.glob("*.json")) if box.exists() else []:
        v = j.with_suffix(".mp4")
        if v.exists():
            meta = json.loads(j.read_text())
            items.append({"slug": j.stem, "meta": meta, "video": v, "json": j})
    return items


def rewrite(old, new, moves, date):
    """New orphan tree: remaining inbox files + recent dated folders + today's moved videos."""
    keep_from = (dt.datetime.now(TZ).date() - dt.timedelta(days=KEEP_DAYS - 2)).isoformat()
    for p in old.iterdir() if old.exists() else []:
        if re.fullmatch(r"\d{4}-\d\d-\d\d", p.name) and p.name >= keep_from:
            shutil.copytree(p, new / p.name, dirs_exist_ok=True)
    moved = {m["slug"] for m in moves}
    (new / "inbox").mkdir(parents=True, exist_ok=True)
    for f in (old / "inbox").glob("*") if (old / "inbox").exists() else []:
        if f.stem not in moved:
            shutil.copy(f, new / "inbox" / f.name)
    for m in moves:
        (new / date).mkdir(parents=True, exist_ok=True)
        shutil.copy(m["video"], new / date / f"{m['slug']}.mp4")
        shutil.copy(m["json"], new / date / f"{m['slug']}.json")
    (new / "README.md").write_text("Stick or Twist hosting. The Shadow PC adds videos to inbox/; the Stick Shorts workflow moves "
                                   "each into its post date and schedules it on Buffer. Rewritten daily; keeps the last few days.\n")
    (new / "inbox" / ".keep").write_text("")
    g = ["git", "-C", str(new)]
    sh(*g, "init", "-q"); sh(*g, "checkout", "-q", "-b", BRANCH); sh(*g, "add", ".")
    sh(*g, "-c", "user.name=shorts-bot", "-c", "user.email=shorts-bot@users.noreply.github.com", "-c", "commit.gpgsign=false",
       "commit", "-qm", f"media-stick: {dt.date.today()}")
    sh(*g, "push", "-q", "-f", remote(), BRANCH)


def check():
    tmp = Path(tempfile.mkdtemp())
    had = clone_media(tmp / "old")
    items = inbox(tmp / "old")
    print(f"media-stick branch: {'found' if had else 'missing (created on first upload)'}; inbox: {len(items)} video(s): "
          + ", ".join(i["slug"] for i in items))
    if os.environ.get("BUFFER_API_KEY"):
        oid, chs = buffer.channels()
        print("Buffer channels:", ", ".join(f"{c['service']}:{c.get('displayName') or c['name']}" for c in chs) or "none connected")
    else:
        print("BUFFER_API_KEY_STICK is not set — nothing can be scheduled yet.")


def publish():
    dry = os.environ.get("DRY_RUN") == "1" or not os.environ.get("BUFFER_API_KEY")
    log = load_log()
    done = {p["slug"] for p in log["posts"]}
    tmp = Path(tempfile.mkdtemp())
    clone_media(tmp / "old")
    items = [i for i in inbox(tmp / "old") if i["slug"] not in done]
    day = dt.datetime.now(TZ).date() + dt.timedelta(days=1)
    taken = sum(1 for p in log["posts"] if p.get("date") == day.isoformat())
    free = SLOTS[taken:][:PER_DAY]
    batch = items[:len(free)]
    lines = [f"## Stick or Twist — {day.strftime('%a %b %-d')}", ""]
    if not batch:
        lines.append(f"Nothing to schedule: {len(items)} new video(s) in the inbox, {len(free)} free slot(s) tomorrow.")
        Path("issue.md").write_text("\n".join(lines) + "\n"); print(lines[-1]); return
    for b, slot in zip(batch, free):
        b["date"], b["slot"] = day.isoformat(), slot
        local = dt.datetime.combine(day, dt.time.fromisoformat(slot), TZ)
        b["due"] = local.astimezone(dt.timezone.utc).strftime("%Y-%m-%dT%H:%M:%S.000Z")
    if not dry:
        rewrite(tmp / "old", tmp / "new", batch, day.isoformat())
    m = buffer.channel_map()[1] if not dry else {}
    for b in batch:
        url = raw(f"{b['date']}/{b['slug']}.mp4")
        res, errs = {}, {}
        if dry:
            errs["all"] = "dry run (no Stick Buffer key or DRY_RUN=1)"
        elif not wait_url(url):
            errs["all"] = f"hosted video never became reachable: {url}"
        else:
            for s in buffer.SERVICES:
                if s not in m:
                    errs[s] = "channel not connected in the Stick Buffer account"; continue
                try:
                    res[s] = create(m[s]["id"], s, b["meta"], url, b["due"])
                except Exception as e:
                    errs[s] = str(e)[:300]
        if res:
            log["posts"].append({"slug": b["slug"], "title": b["meta"].get("title"), "date": b["date"], "slot": b["slot"],
                                 "url": url, "buffer": res, "errors": errs})
        mark = "✅" if res and not errs else ("⚠️" if res else ("🧪" if dry else "❌"))
        lines.append(f"- {mark} **{b['slot']} PT** — {b['meta'].get('title') or b['slug']}  "
                     + (f"([video]({url}))" if not dry else "") + (f"  \n  {'; '.join(f'{k}: {v}' for k, v in errs.items())}" if errs else ""))
    LOG.parent.mkdir(parents=True, exist_ok=True)
    LOG.write_text(json.dumps(log, indent=1, ensure_ascii=False) + "\n")
    lines += ["", f"Inbox left: {len(items) - len(batch)} video(s).", "To veto one, delete it in the Stick or Twist Buffer account before its time."]
    Path("issue.md").write_text("\n".join(lines) + "\n")
    print("\n".join(lines))


if __name__ == "__main__":
    {"check": check, "publish": publish}.get(sys.argv[1] if len(sys.argv) > 1 else "check", check)()
