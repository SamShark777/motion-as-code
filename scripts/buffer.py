"""Buffer (free plan) client for the Shorts pipeline — GraphQL API at https://api.buffer.com.

Key: env BUFFER_API_KEY (GitHub secret; create it at https://publish.buffer.com/settings/api).
Free plan: 3 channels, 10 queued posts per channel, 3,000 API requests / 30 days.

    python3 scripts/buffer.py channels                       # organisation + connected channels (JSON)
    python3 scripts/buffer.py schema                          # print the post input types (introspection)
    python3 scripts/buffer.py post <slug> <dueAt ISO> <url>   # schedule one video on YouTube + Instagram + TikTok
    python3 scripts/buffer.py stats                          # per-post analytics Buffer exposes (introspected) for sent posts
    python3 scripts/buffer.py posts [--meta]                  # scheduled + sent posts of the three channels (JSON; --meta adds unreadable channels)
    python3 scripts/buffer.py cancel <slug>[,<slug>...]       # delete those videos' still-scheduled Buffer posts (ids from the tracker)

`post` reads shorts/<slug>/script.json (post.title / description / tags) and prints JSON
{"youtube": id, "instagram": id, "tiktok": id, "errors": {...}}.
"""
import json, os, sys, time, urllib.request, urllib.error
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
API = "https://api.buffer.com"
SERVICES = ("youtube", "instagram", "tiktok")


def gql(query, variables=None):
    key = os.environ.get("BUFFER_API_KEY")
    if not key:
        sys.exit("BUFFER_API_KEY is not set")
    body = json.dumps({"query": query, "variables": variables or {}}).encode()
    for attempt in range(4):
        req = urllib.request.Request(API, data=body, headers={"Content-Type": "application/json", "Authorization": f"Bearer {key}",
                                                             "User-Agent": "motion-as-code-shorts"})
        try:
            with urllib.request.urlopen(req, timeout=60) as r:
                out = json.loads(r.read())
            break
        except urllib.error.HTTPError as e:
            txt = e.read().decode(errors="replace")[:500]
            if e.code in (429, 502, 503, 504) and attempt < 3:
                time.sleep(10 * (attempt + 1)); continue
            raise RuntimeError(f"Buffer HTTP {e.code}: {txt}")
    if out.get("errors"):
        raise RuntimeError("Buffer GraphQL: " + "; ".join(e.get("message", "?") for e in out["errors"]))
    return out["data"]


def org_id():
    d = gql("query { account { organizations { id name } } }")
    orgs = d["account"]["organizations"]
    if not orgs:
        sys.exit("no Buffer organisation on this account")
    return orgs[0]["id"]


def channels():
    oid = org_id()
    d = gql("query($o: OrganizationId!) { channels(input: {organizationId: $o}) { id name displayName service isQueuePaused } }", {"o": oid})
    return oid, d["channels"]


def channel_map():
    oid, chs = channels()
    m = {}
    for c in chs:
        s = (c["service"] or "").lower()
        if s in SERVICES and s not in m:
            m[s] = c
    return oid, m


def list_posts(oid, m, fields="id dueAt status channelId"):
    """Posts of each connected channel, queried one channel at a time so a locked/disconnected channel
    (Buffer: "Actor can not access the specified channels") can't break the lookup for the others.
    Returns (posts, failed) — every post gets a `service` key; failed maps service -> error."""
    out, failed = [], {}
    for svc, c in m.items():
        after = None
        try:
            for _ in range(10):
                d = gql("""query($o: OrganizationId!, $c: [ChannelId!], $a: String) { posts(first: 50, after: $a, input: {organizationId: $o, filter: {channelIds: $c}}) {
                    edges { node { %s } } pageInfo { hasNextPage endCursor } } }""" % fields, {"o": oid, "c": [c["id"]], "a": after})
                p = d["posts"]
                out += [{**e["node"], "service": svc} for e in p["edges"]]
                if not p["pageInfo"]["hasNextPage"]:
                    break
                after = p["pageInfo"]["endCursor"]
        except Exception as e:
            failed[svc] = str(e)[:200]
            print(f"posts: {svc} skipped: {e}", file=sys.stderr)
    return out, failed


def text_for(post):
    d = post.get("description", "").strip()
    return d if "#" in d else (d + "\n\n#psychology #shorts").strip()


def create(channel_id, service, post, url, due, thumb_ms=1500):
    meta = None
    asset = {"video": {"url": url}}
    if service == "youtube":
        title = post["title"][:100]
        meta = {"youtube": {"title": title, "categoryId": "27", "privacy": "public", "madeForKids": False}}
    elif service == "instagram":
        meta = {"instagram": {"type": "reel", "shouldShareToFeed": True}}
        asset["video"]["metadata"] = {"thumbnailOffset": int(thumb_ms)}
    elif service == "tiktok":
        asset["video"]["metadata"] = {"thumbnailOffset": int(thumb_ms)}
    inp = {"channelId": channel_id, "text": text_for(post),
           "schedulingType": "automatic", "mode": "customScheduled", "dueAt": due, "assets": [asset], "aiAssisted": False, "needsApproval": False}
    if meta:
        inp["metadata"] = meta
    d = gql("""mutation($input: CreatePostInput!) { createPost(input: $input) {
        __typename ... on PostActionSuccess { post { id dueAt } } ... on MutationError { message } } }""", {"input": inp})
    r = d["createPost"]
    if r.get("post"):
        return r["post"]["id"]
    raise RuntimeError(r.get("message") or json.dumps(r))


def _delete_field():
    """Find Buffer's delete-post mutation and how its argument is shaped (the API is young; introspect instead of guessing)."""
    d = gql("{ __schema { mutationType { fields { name args { name type { name kind ofType { name kind } } } } } } }")
    fields = d["__schema"]["mutationType"]["fields"]
    cands = [f for f in fields if "delete" in f["name"].lower() and "post" in f["name"].lower()]
    if not cands:
        raise RuntimeError("no delete-post mutation; mutations: " + ", ".join(f["name"] for f in fields))
    f = next((c for c in cands if c["name"] == "deletePost"), cands[0])
    arg = f["args"][0]
    t = arg["type"]
    tname = t.get("name") or (t.get("ofType") or {}).get("name")
    kind = t.get("kind") if t.get("name") else (t.get("ofType") or {}).get("kind")
    key = None
    if kind == "INPUT_OBJECT":
        it = gql("query($n: String!) { __type(name: $n) { inputFields { name } } }", {"n": tname})["__type"]["inputFields"]
        names = [x["name"] for x in it]
        key = next((n for n in ("id", "postId") if n in names), names[0])
    return f["name"], arg["name"], tname, key


def cancel(slugs):
    sys.path.insert(0, str(ROOT / "scripts"))
    import tracker
    wb, ws, H, rows = tracker.load()
    want = {}
    for r in rows.values():
        slug = ws.cell(r, H["Slug"]).value
        mid = str(ws.cell(r, H["Metricool ID"]).value or "")
        if slug in slugs and mid.startswith("buffer:"):
            want[slug] = dict(kv.split("=", 1) for kv in mid[len("buffer:"):].split(";") if "=" in kv)
    name, argname, tname, key = _delete_field()
    oid, m = channel_map()
    posts, failed = list_posts(oid, m, "id status dueAt")
    live = {p["id"]: p for p in posts}
    if failed:
        print("could not list posts for:", failed)
    res = {"mutation": name, "missing_in_tracker": [s for s in slugs if s not in want], "deleted": {}, "skipped": {}, "errors": {}}
    for slug, ids in want.items():
        for svc, pid in ids.items():
            st = (live.get(pid) or {}).get("status")
            if st and st.lower() in ("sent", "published", "sending"):
                res["skipped"][f"{slug}/{svc}"] = f"already {st}"; continue
            val = {key: pid} if key else pid
            sels = ["{ __typename ... on MutationError { message } }", "{ __typename }", ""]
            last = None
            for sel in sels:
                q = "mutation($v: %s!) { %s(%s: $v) %s }" % (tname, name, argname, sel)
                try:
                    r = gql(q, {"v": val})[name]
                except Exception as e:
                    last = str(e)[:300]
                    if "Buffer GraphQL" in last and ("selection" in last.lower() or "fragment" in last.lower() or "subfield" in last.lower() or "MutationError" in last):
                        continue
                    break
                last = None
                if isinstance(r, dict) and r.get("message"):
                    last = r["message"]
                elif r is False:
                    last = "returned false"
                break
            if last:
                res["errors"][f"{slug}/{svc}"] = last
            else:
                res["deleted"][f"{slug}/{svc}"] = pid
    try:
        now = {p["id"]: p["status"] for p in list_posts(oid, m, "id status")[0]}
        res["still_listed"] = {k: now[v] for k, v in res["deleted"].items() if v in now}
    except Exception as e:
        res["still_listed"] = f"could not re-list: {e}"[:200]
    return res


def main():
    cmd = sys.argv[1] if len(sys.argv) > 1 else "channels"
    if cmd == "channels":
        oid, chs = channels()
        print(json.dumps({"organizationId": oid, "channels": chs}, indent=1))
    elif cmd == "schema":
        names = ["CreatePostInput", "PostInputMetaData", "AssetInput", "VideoAssetInput", "YoutubePostMetadataInput",
                 "InstagramPostMetadataInput", "TiktokPostMetadataInput", "PostsInput", "PostsFiltersInput", "PostStatus", "PostInput"]
        for n in names:
            try:
                d = gql("query($n: String!) { __type(name: $n) { name kind inputFields { name type { name kind ofType { name kind ofType { name } } } } enumValues { name } } }", {"n": n})
            except RuntimeError as e:
                print(n, "->", e); continue
            print(json.dumps(d["__type"]))
        d = gql("{ __schema { queryType { fields { name args { name type { name kind ofType { name } } } } } } }")
        print(json.dumps([f for f in d["__schema"]["queryType"]["fields"] if "post" in f["name"].lower()]))
        d = gql('{ __type(name: "Post") { fields { name type { name kind ofType { name } } } } }')
        print("Post fields:", json.dumps([f["name"] for f in d["__type"]["fields"]]))
    elif cmd == "post":
        slug, due, url = sys.argv[2], sys.argv[3], sys.argv[4]
        thumb_ms = int(sys.argv[5]) if len(sys.argv) > 5 else 1500  # the title-cover frame (end of the video)
        urls = json.loads(os.environ.get("BUFFER_URLS") or "{}")  # per-platform files (own music each)
        S = json.loads((ROOT / "shorts" / slug / "script.json").read_text())
        post = S["post"]
        _, m = channel_map()
        res, errs = {}, {}
        for s in SERVICES:
            if s not in m:
                errs[s] = "channel not connected in Buffer"; continue
            try:
                res[s] = create(m[s]["id"], s, post, urls.get(s, url), due, thumb_ms)
            except Exception as e:
                errs[s] = str(e)[:300]
        res["errors"] = errs
        print(json.dumps(res))
    elif cmd == "post-long":
        slug, due, url, thumb, desc = sys.argv[2:7]
        S = json.loads((ROOT / "shorts" / "long" / slug / "script.json").read_text())
        post = S["post"]
        _, m = channel_map()
        res, errs = {}, {}
        if "youtube" not in m:
            errs["youtube"] = "channel not connected in Buffer"
        else:
            inp = {"channelId": m["youtube"]["id"], "text": desc, "schedulingType": "automatic", "mode": "customScheduled", "dueAt": due,
                   "assets": [{"video": {"url": url, "thumbnailUrl": thumb}}], "aiAssisted": False, "needsApproval": False,
                   "metadata": {"youtube": {"title": post["title"][:100], "categoryId": "27", "privacy": "public", "madeForKids": False}}}
            try:
                d = gql("""mutation($input: CreatePostInput!) { createPost(input: $input) {
                    __typename ... on PostActionSuccess { post { id dueAt } } ... on MutationError { message } } }""", {"input": inp})
                r = d["createPost"]
                if r.get("post"):
                    res["youtube"] = r["post"]["id"]
                else:
                    errs["youtube"] = r.get("message")
            except Exception as e:
                errs["youtube"] = str(e)[:300]
        res["errors"] = errs
        print(json.dumps(res))
    elif cmd == "posts":
        oid, m = channel_map()
        ids = [c["id"] for c in m.values()]
        # the public link of a sent post (YouTube/Instagram/TikTok URL), if this API version exposes one
        try:
            have = {f["name"] for f in gql('{ __type(name: "Post") { fields { name } } }')["__type"]["fields"]}
        except Exception:
            have = set()
        extra = " ".join(f for f in ("externalLink", "sentAt") if f in have)
        posts, failed = list_posts(oid, m, "id dueAt status channelId " + extra)
        # `posts --meta` also says which channels couldn't be read (reconcile needs that to tell "deleted" from "unreadable")
        print(json.dumps({"posts": posts, "failed": failed} if "--meta" in sys.argv else posts))
    elif cmd == "stats":
        # whatever per-post analytics this Buffer API version exposes (introspected, since the API is young)
        def tfields(name):
            t = gql('query($n: String!) { __type(name: $n) { fields { name type { name kind ofType { name kind ofType { name kind } } } } } }', {"n": name})["__type"]
            return (t or {}).get("fields") or []
        def base(t):
            while t.get("ofType"): t = t["ofType"]
            return t
        pf = tfields("Post")
        print("POST_FIELDS " + " ".join(f["name"] for f in pf))
        want = []
        for f in pf:
            b = base(f["type"])
            if any(k in f["name"].lower() for k in ("stat", "metric", "insight", "analytic", "engagement", "interaction")):
                if b["kind"] == "OBJECT":
                    sub = [x["name"] for x in tfields(b["name"]) if base(x["type"])["kind"] in ("SCALAR", "ENUM")]
                    print(f"METRIC_TYPE {f['name']}:{b['name']} " + " ".join(sub))
                    want.append(f"{f['name']} {{ {' '.join(sub)} }}" if sub else None)
                elif b["kind"] in ("SCALAR", "ENUM"):
                    want.append(f["name"])
        want = [w for w in want if w]
        oid, m = channel_map()
        have = {f["name"] for f in pf}
        extra = " ".join(x for x in ("externalLink", "sentAt") if x in have)
        try:
            posts, failed = list_posts(oid, m, "id dueAt status channelId " + extra + " " + " ".join(want))
        except Exception as e:
            posts, failed = [], {"all": str(e)}
        sent = [p for p in posts if str(p.get("status", "")).lower() in ("sent", "published")]
        if "--json" in sys.argv:
            print(json.dumps({"metric_fields": want, "failed": failed, "sent": sent})); return
        print("STATS_FAILED " + json.dumps(failed))
        since = next((a.split("=", 1)[1] for a in sys.argv if a.startswith("--since=")), "2026-10-10")
        keys = ("views", "reach", "averageTimeWatched", "reactions", "comments", "shares", "saves")
        print("STATCOLS id|service|sentAt|" + "|".join(keys))
        toks = []
        for p in sent:
            if str(p.get("sentAt") or "") < since:
                continue
            m = {x["type"]: x["value"] for x in (p.get("metrics") or [])}
            toks.append(f"{p['id']}|{(p.get('service') or '')[:2]}|{str(p.get('sentAt'))[5:16]}|" + "|".join(str(m.get(k, "")) for k in keys))
        # packed many per line: GitHub keeps only ~10 annotation lines per step, ~4k chars each
        for i in range(0, len(toks), 40):
            print("STAT " + " ".join(toks[i:i + 40]))
    elif cmd == "cancel":
        print(json.dumps(cancel([x.strip() for x in sys.argv[2].split(",") if x.strip()])))
    else:
        sys.exit(__doc__)


if __name__ == "__main__":
    main()
