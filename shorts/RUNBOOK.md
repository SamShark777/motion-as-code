# Daily Shorts pipeline — runbook

One psychology Short a day, made with the Motion as Code kit (vertical template + Shivam's pixel avatar),
hosted on this public repo's `media` branch, scheduled through Metricool to YouTube Shorts,
Instagram Reels and TikTok **the day before it posts** so Shivam can veto it.

State lives in this repo:
- `shorts/queue.csv` — the ideas, one row each: `id,idea,status,slug,post_date,release_url,metricool_uuid,notes`
  - status: `new` → `scheduled` → (`posted`) | `vetoed` | `failed`
- `shorts/tracker.csv` — one row per scheduled video with its features and its stats at 7 / 14 / 30 days.
- `shorts/<slug>/script.json` — the script of each video (the build input).
- `shorts/reviews/<date>.md` — the weekly reviews.

Metricool brand: `blogId 7365379` (timezone America/Los_Angeles).
Code and state live on the **`shorts` branch** (main stays the original kit).
Video URL pattern: `https://raw.githubusercontent.com/SamShark777/motion-as-code/media/<slug>.mp4`
(Metricool copies the video into its own storage when the post is scheduled, so the `media` branch
only ever holds the newest video — it is force-pushed fresh each day and never grows.)

## Daily run (≈ 45–60 min)

1. **Setup.** Call `add_repo` (owner SamShark777, repo motion-as-code, access push), then
   `git clone --depth 1 --branch shorts https://github.com/SamShark777/motion-as-code` and `cd` into it.
2. **Vetoes.** For every queue row with status `scheduled` and post_date ≥ today, look it up with
   Metricool `getScheduledPosts` (by uuid). If it's gone and its post_date is in the future, Shivam
   vetoed it: set status `vetoed`. Rows whose post_date has passed and still exist as published → `posted`.
3. **Stats.** For tracker rows that reached 7, 14 or 30 days since posting and lack that column, pull the
   numbers with `getAnalyticsDataByMetrics` (YouTube "all videos" connector: YTVV17 title, YTVV06 views,
   YTVV08 avg view duration, YTVV09 likes, YTVV11 comments, YTVV12 shares; Instagram reels and TikTok
   posts: discover field ids with `getAnalyticsAvailableMetrics`). Match each video by its title.
   Fill `views_d7, likes_d7, comments_d7, shares_d7, avd_d7` (likewise d14 and d30), per platform where available.
4. **Pick the idea.** The first queue row with status `new`.
5. **Write the script** (`shorts/<slug>/script.json`, format below). Before writing, verify the core
   finding with a web search and put the source URL in the queue row's `notes`. Rules:
   - Only well-established findings. Name the researchers and year in `credit` exactly as published.
     If you can't find a solid source, mark the row `failed` with the reason and take the next idea.
   - 55–85 spoken words → 22–35 s. Short sentences.
   - Sections in order: `hook` (1 line, a question or surprising claim to the viewer), `name`
     (1 line ending in the concept's name), `study` (1–2 lines), `stat` (1–2 lines carrying the numbers),
     `takeaway` (1–2 lines; the last line is the punchline).
   - The stat cue words must appear verbatim in the stat lines. Use `%` stats when possible (they light
     that share of the 20-person room); otherwise give `lit` (0–20) or `display`.
   - Titles: `title[0]` is the big word(s) (≤ 14 characters reads best), `title[1]` the pill (one word).
   - Vary `hookStyle` (`eyes` for social/being-watched topics, `thoughts` for thinking/memory/decision topics).
   - Add `say` with a phonetic spelling when TTS would misread a word (e.g. "T-shirt" → "tee shirt").
6. **Build.** `bash scripts/build_short.sh <slug>` → `shorts/<slug>/<slug>.mp4` + `preview.jpg`.
   Look at `preview.jpg`. If text overflows or overlaps, shorten the lines and rebuild once.
7. **Host.** Push the video alone to the `media` branch (replacing what's there):
   `M=$(mktemp -d) && cp shorts/<slug>/<slug>.mp4 $M && cd $M && git init -q && git checkout -q -b media && git add . && git -c commit.gpgsign=false commit -qm "media: <slug>" && git remote add origin https://github.com/SamShark777/motion-as-code.git && git push -q -f origin media && cd -`
   Check `https://raw.githubusercontent.com/SamShark777/motion-as-code/media/<slug>.mp4` answers 200
   (`curl -sL -o /dev/null -w "%{http_code}"`; retry for up to a minute — the CDN can lag).
8. **Schedule** with Metricool `createScheduledPost` for **tomorrow 4:00 PM America/Los_Angeles**
   (or the best slot from `getBestTimeToPostByNetwork` for youtube between 12:00 and 18:00 tomorrow):
   - media: the raw media-branch URL; providers youtube, instagram, tiktok.
   - youtubeData: `{type: "short", title: "<post.title>", privacy: "public", madeForKids: false, category: "EDUCATION", tags, isAiGeneratedContent: false}`
   - instagramData: `{type: "REEL", showReelOnFeed: true}`; tiktokData: `{title: "<post.title>", privacyOption: "PUBLIC_TO_EVERYONE"}`
   - text: the post description + 3–5 hashtags (#psychology #shorts + topic tags).
9. **Record.** Queue row → `scheduled`, post_date, release_url (the raw URL), metricool_uuid. Tracker row: slug, idea,
   post_date, title, hookStyle, duration_s, word_count, title_words, stat_type (percent / other).
   Commit "short: <slug>" and push to `shorts` (fetch + rebase first if the push is rejected).
10. **Tell Shivam** (push notification): the title, post time, preview.jpg, the planner link and
    "Delete it in Metricool before 4 PM tomorrow to veto."

If any step fails, don't schedule a half-made video: mark the row `failed` with the reason, push, and
tell Shivam what broke.

## Weekly review (Sundays)

Read `tracker.csv`. Compare videos by views at d7 (and d14/d30 when present), avg view duration as a
share of length, likes and shares per 1k views — across hookStyle, length, title style, topic area,
stat type and post weekday. Write `shorts/reviews/<date>.md`: what worked, what didn't, 3 concrete
changes for next week (script rules, topics to move up the queue, posting time). With fewer than 5
videos past d7, say the sample is too small and only describe. Commit, push and notify Shivam with the
headline findings.

## script.json

```json
{
  "slug": "spotlight-effect",
  "title": ["SPOTLIGHT", "EFFECT"],
  "hookStyle": "eyes",
  "titleCue": "spotlight",
  "credit": "Gilovich, Medvec & Savitsky · 2000",
  "stat": { "unit": "%",
            "a": { "label": "Guessed", "value": 50, "cue": "half" },
            "b": { "label": "Actual", "value": 23, "cue": "quarter." } },
  "cta": "Follow for more psychology",
  "lines": [
    { "sec": "hook", "text": "Ever feel like everyone is staring at you?" },
    { "sec": "name", "text": "Psychologists call it the spotlight effect." },
    { "sec": "study", "text": "In one study, students wore an embarrassing T-shirt into a full room.", "say": "... tee shirt ..." },
    { "sec": "stat", "text": "They guessed half the room noticed." },
    { "sec": "stat", "text": "The real number? About a quarter." },
    { "sec": "takeaway", "text": "Everyone else is busy starring in their own movie." },
    { "sec": "takeaway", "text": "So relax. Nobody's watching as closely as you think." }
  ],
  "post": { "title": "Why It Feels Like Everyone's Watching You #shorts",
            "description": "Psychologists call it the spotlight effect.",
            "tags": ["spotlight effect", "psychology"] }
}
```
