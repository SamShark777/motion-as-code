"""Competitor data for the competitor gap analysis (YouTube Data API v3, YOUTUBE_API_KEY).

usage: python3 scripts/yt_competitors.py "<handles or 'auto'>"
  auto  -> search recent popular psychology Shorts, rank channels by Shorts views, take the top 3
  "@a,@b,@c" -> those channels
Writes shorts/stats/competitors.json: per channel profile, last 50 uploads with stats,
top 10 by views with up to 40 top comments each. Quota: ~4 searches (400) + ~60 units.
"""
import json, os, re, sys, urllib.parse, urllib.request
from collections import defaultdict
from datetime import datetime, timedelta, timezone

KEY = os.environ.get("YOUTUBE_API_KEY", "").strip()
API = "https://www.googleapis.com/youtube/v3/"
OWN = "UC7ypnIEwX3EIeMPE-VGi9Hw"  # Overthink Club


def get(path, **params):
    params["key"] = KEY
    try:
        with urllib.request.urlopen(API + path + "?" + urllib.parse.urlencode(params), timeout=30) as r:
            return json.load(r)
    except urllib.error.HTTPError as e:
        print(f"API {path} {e.code} {e.read()[:200]!r}")
        return {}


def secs(d):
    m = re.fullmatch(r"P(?:\d+D)?T?(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?", d or "")
    return sum(int(x or 0) * k for x, k in zip(m.groups(), (3600, 60, 1))) if m else 0


def videos(ids):
    out = []
    for i in range(0, len(ids), 50):
        for it in get("videos", part="statistics,contentDetails,snippet", id=",".join(ids[i:i + 50])).get("items", []):
            s = it.get("statistics", {})
            out.append({"id": it["id"], "title": it["snippet"]["title"], "channel": it["snippet"]["channelId"],
                        "channelTitle": it["snippet"]["channelTitle"], "published": it["snippet"]["publishedAt"],
                        "tags": it["snippet"].get("tags", [])[:15], "desc": it["snippet"].get("description", "")[:300],
                        "secs": secs(it["contentDetails"].get("duration")), "views": int(s.get("viewCount", 0)),
                        "likes": int(s.get("likeCount", 0)), "comments": int(s.get("commentCount", 0))})
    return out


def auto_channels():
    since = (datetime.now(timezone.utc) - timedelta(days=60)).strftime("%Y-%m-%dT%H:%M:%SZ")
    ids = []
    for q in ["psychology facts #shorts", "psychology tricks shorts", "dark psychology shorts", "psychology of overthinking shorts"]:
        r = get("search", part="id", q=q, type="video", videoDuration="short", order="viewCount",
                publishedAfter=since, maxResults=50, relevanceLanguage="en")
        ids += [it["id"]["videoId"] for it in r.get("items", [])]
    vs = videos(list(dict.fromkeys(ids)))
    by = defaultdict(lambda: [0, 0, ""])
    for v in vs:
        if v["channel"] == OWN:
            continue
        b = by[v["channel"]]; b[0] += v["views"]; b[1] += 1; b[2] = v["channelTitle"]
    ranked = sorted(by.items(), key=lambda kv: -kv[1][0])
    print("CANDIDATES " + " | ".join(f"{t} ({n} hits, {s:,} views)" for c, (s, n, t) in ranked[:12]))
    return [c for c, _ in ranked[:3]], vs


def resolve(h):
    h = h.strip()
    if h.startswith("UC") and len(h) == 24:
        return h
    r = get("channels", part="id", forHandle=h if h.startswith("@") else "@" + h)
    return (r.get("items") or [{}])[0].get("id")


def main():
    if not KEY:
        print("FAILED no YOUTUBE_API_KEY"); return 1
    arg = (sys.argv[1] if len(sys.argv) > 1 else "auto").strip()
    search_hits = []
    if arg in ("", "auto", "true"):
        chans, search_hits = auto_channels()
    else:
        chans = [c for c in (resolve(h) for h in arg.split(",")) if c]
    out = {"at": datetime.now(timezone.utc).isoformat(timespec="seconds"), "channels": [],
           "search_hits": sorted(search_hits, key=lambda v: -v["views"])[:60]}
    for c in chans:
        it = (get("channels", part="snippet,statistics,contentDetails", id=c).get("items") or [{}])[0]
        if not it:
            continue
        st = it.get("statistics", {})
        up = it["contentDetails"]["relatedPlaylists"]["uploads"]
        ids = [x["contentDetails"]["videoId"] for x in get("playlistItems", part="contentDetails", playlistId=up, maxResults=50).get("items", [])]
        recent = videos(ids)
        top = sorted(recent, key=lambda v: -v["views"])[:10]
        for v in top:
            r = get("commentThreads", part="snippet", videoId=v["id"], order="relevance", maxResults=40, textFormat="plainText")
            v["top_comments"] = [x["snippet"]["topLevelComment"]["snippet"]["textDisplay"][:200]
                                 for x in r.get("items", [])]
        ch = {"id": c, "title": it["snippet"]["title"], "handle": it["snippet"].get("customUrl"),
              "subs": int(st.get("subscriberCount", 0)), "views": int(st.get("viewCount", 0)),
              "videos": int(st.get("videoCount", 0)), "created": it["snippet"].get("publishedAt"),
              "recent": recent, "top10": top}
        out["channels"].append(ch)
        avg = sum(v["views"] for v in recent) / max(1, len(recent))
        print(f"CHANNEL {ch['title']} {ch['handle']} subs={ch['subs']:,} recent50_avg={avg:,.0f} top={top[0]['views'] if top else 0:,}")
    os.makedirs("shorts/stats", exist_ok=True)
    json.dump(out, open("shorts/stats/competitors.json", "w"), indent=1)
    return 0


if __name__ == "__main__":
    sys.exit(main())
