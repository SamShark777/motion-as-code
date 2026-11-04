"""YouTube Data API v3 stats for every Short that has a YouTube link in its post.json.

Needs YOUTUBE_API_KEY (repo secret). Costs 1 quota unit per 50 videos (free quota: 10,000/day).
Prints one line per video:  YT <slug> <date> <slot> <look> views=<n> likes=<n> comments=<n> secs=<n>
and finally YT_CHANNEL lines with subscriber/view totals for each channel seen.
Writes shorts/stats/youtube.json (latest snapshot) when --save is given.
"""
import glob, json, os, re, sys, urllib.parse, urllib.request
from datetime import datetime, timezone

KEY = os.environ.get("YOUTUBE_API_KEY", "").strip()
API = "https://www.googleapis.com/youtube/v3/"


def get(path, **params):
    params["key"] = KEY
    with urllib.request.urlopen(API + path + "?" + urllib.parse.urlencode(params), timeout=30) as r:
        return json.load(r)


def iso_secs(d):
    m = re.fullmatch(r"PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?", d or "")
    return sum(int(x or 0) * k for x, k in zip(m.groups(), (3600, 60, 1))) if m else 0


def main():
    if not KEY:
        print("YT_FAILED no YOUTUBE_API_KEY secret")
        return 1
    vids = {}
    for p in glob.glob("shorts/*/post.json"):
        d = json.load(open(p))
        url = (d.get("links") or {}).get("youtube") or ""
        m = re.search(r"(?:shorts/|v=|youtu\.be/)([\w-]{11})", url)
        if not m:
            continue
        slug = d.get("slug") or p.split("/")[1]
        look = ""
        try:
            look = json.load(open(f"shorts/{slug}/script.json")).get("look", "")
        except Exception:
            pass
        vids[m.group(1)] = {"slug": slug, "date": d.get("date"), "slot": d.get("slot"), "look": look}
    ids = list(vids)
    channels = set()
    for i in range(0, len(ids), 50):
        r = get("videos", part="statistics,contentDetails,snippet", id=",".join(ids[i:i + 50]), maxResults=50)
        for it in r.get("items", []):
            v = vids[it["id"]]
            s = it.get("statistics", {})
            v.update(views=int(s.get("viewCount", 0)), likes=int(s.get("likeCount", 0)),
                     comments=int(s.get("commentCount", 0)),
                     secs=iso_secs(it.get("contentDetails", {}).get("duration")),
                     published=it.get("snippet", {}).get("publishedAt"), title=it.get("snippet", {}).get("title"))
            channels.add(it.get("snippet", {}).get("channelId"))
    rows = sorted((v for v in vids.values() if "views" in v), key=lambda v: (v["date"] or "", v["slot"] or ""))
    for v in rows:
        print(f"YT {v['slug']} {v['date']} {v['slot']} {v['look'] or '-'} views={v['views']} likes={v['likes']} "
              f"comments={v['comments']} secs={v['secs']}")
    missing = [v["slug"] for v in vids.values() if "views" not in v]
    if missing:
        print("YT_MISSING " + " ".join(missing))
    chans = {}
    for c in filter(None, channels):
        it = (get("channels", part="statistics,snippet", id=c).get("items") or [{}])[0]
        s = it.get("statistics", {})
        chans[c] = {"title": it.get("snippet", {}).get("title"), "subs": s.get("subscriberCount"),
                    "views": s.get("viewCount"), "videos": s.get("videoCount")}
        print(f"YT_CHANNEL {chans[c]['title']} subs={chans[c]['subs']} views={chans[c]['views']} videos={chans[c]['videos']}")
    if "--save" in sys.argv:
        os.makedirs("shorts/stats", exist_ok=True)
        json.dump({"at": datetime.now(timezone.utc).isoformat(timespec="seconds"), "channels": chans, "videos": rows},
                  open("shorts/stats/youtube.json", "w"), indent=1)
    return 0


if __name__ == "__main__":
    sys.exit(main())
