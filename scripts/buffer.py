"""Buffer (free plan) client for the Shorts pipeline — GraphQL API at https://api.buffer.com.

Key: env BUFFER_API_KEY (GitHub secret; create it at https://publish.buffer.com/settings/api).
Free plan: 3 channels, 10 queued posts per channel, 3,000 API requests / 30 days.

    python3 scripts/buffer.py channels                       # organisation + connected channels (JSON)
    python3 scripts/buffer.py schema                          # print the post input types (introspection)
    python3 scripts/buffer.py post <slug> <dueAt ISO> <url>   # schedule one video on YouTube + Instagram + TikTok
    python3 scripts/buffer.py posts                           # scheduled + sent posts of the three channels (JSON)

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


def text_for(post):
    d = post.get("description", "").strip()
    return d if "#" in d else (d + "\n\n#psychology #shorts").strip()


def create(channel_id, service, post, url, due):
    meta = None
    asset = {"video": {"url": url}}
    if service == "youtube":
        title = post["title"][:100]
        meta = {"youtube": {"title": title, "categoryId": "27", "privacy": "public", "madeForKids": False}}
    elif service == "instagram":
        meta = {"instagram": {"type": "reel", "shouldShareToFeed": True}}
        asset["video"]["metadata"] = {"thumbnailOffset": 1500}
    elif service == "tiktok":
        asset["video"]["metadata"] = {"thumbnailOffset": 1500}
    inp = {"channelId": channel_id, "text": text_for(post),
           "schedulingType": "automatic", "mode": "customScheduled", "dueAt": due, "assets": [asset], "aiAssisted": False}
    if meta:
        inp["metadata"] = meta
    d = gql("""mutation($input: CreatePostInput!) { createPost(input: $input) {
        __typename ... on PostActionSuccess { post { id dueAt } } ... on MutationError { message } } }""", {"input": inp})
    r = d["createPost"]
    if r.get("post"):
        return r["post"]["id"]
    raise RuntimeError(r.get("message") or json.dumps(r))


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
    elif cmd == "post":
        slug, due, url = sys.argv[2], sys.argv[3], sys.argv[4]
        S = json.loads((ROOT / "shorts" / slug / "script.json").read_text())
        post = S["post"]
        _, m = channel_map()
        res, errs = {}, {}
        for s in SERVICES:
            if s not in m:
                errs[s] = "channel not connected in Buffer"; continue
            try:
                res[s] = create(m[s]["id"], s, post, url, due)
            except Exception as e:
                errs[s] = str(e)[:300]
        res["errors"] = errs
        print(json.dumps(res))
    elif cmd == "posts":
        oid, m = channel_map()
        ids = [c["id"] for c in m.values()]
        out, after = [], None
        for _ in range(10):
            d = gql("""query($o: OrganizationId!, $c: [ChannelId!], $a: String) { posts(first: 50, after: $a, input: {organizationId: $o, filter: {channelIds: $c}}) {
                edges { node { id dueAt status channelId } } pageInfo { hasNextPage endCursor } } }""", {"o": oid, "c": ids, "a": after})
            p = d["posts"]
            out += [e["node"] for e in p["edges"]]
            if not p["pageInfo"]["hasNextPage"]:
                break
            after = p["pageInfo"]["endCursor"]
        print(json.dumps(out))
    else:
        sys.exit(__doc__)


if __name__ == "__main__":
    main()
