# Daily Shorts pipeline — runbook

One psychology Short a day, made with the Motion as Code kit (vertical template + Shivam's pixel avatar),
hosted on this public repo's `media` branch, scheduled through Metricool to YouTube Shorts,
Instagram Reels and TikTok **the day before it posts** so Shivam can veto it.

State lives in this repo on the **`shorts` branch** (main stays the original kit):
- `shorts/Psychology_Shorts_Tracker.xlsx` — Shivam's 100 ideas + production and performance columns.
  Always read and write it with `scripts/tracker.py` (never rebuild it), so formatting and formulas survive.
  Status flow: `Idea` → `Scripted` → `Scheduled` → `Published` | `Vetoed` | `Failed`.
  `Priority`: the lowest number with Status `Idea` is made next.
- `shorts/<slug>/script.json` — the script of each video (the build input).
- `shorts/reviews/<date>.md` — the weekly reviews.

Metricool brand: `blogId 7365379` (timezone America/Los_Angeles).
Video URL pattern: `https://raw.githubusercontent.com/SamShark777/motion-as-code/media/<slug>.mp4`
(Metricool copies the video into its own storage when the post is scheduled, so the `media` branch
only ever holds the newest video — it is force-pushed fresh each day and never grows.)

## Daily run (≈ 45–60 min)

1. **Setup.** Call `add_repo` (owner SamShark777, repo motion-as-code, access push), then
   `git clone --depth 1 --branch shorts https://github.com/SamShark777/motion-as-code` and `cd` into it.
2. **Vetoes and go-lives.** `python3 scripts/tracker.py scheduled`. For each row, look its Metricool ID
   (uuid) up with `getScheduledPosts` (range: its post date ± 1 day). Still pending and post date in the
   future → leave it. Gone before its post date → Shivam vetoed it: `Status=Vetoed`. Post date passed →
   `Status=Published`.
3. **Stats.** `python3 scripts/tracker.py due` lists published rows that reached 7, 14 or 30 days without
   numbers. Pull them with `getAnalyticsDataByMetrics` (YouTube "all videos": YTVV17 title, YTVV06 views,
   YTVV08 avg view duration, YTVV09 likes, YTVV11 comments, YTVV12 shares; Instagram reels and TikTok
   posts: find field ids with `getAnalyticsAvailableMetrics`), matching each video by its title, and write
   them with `tracker.py set <No> "YT views d7=…" "YT avg view (s) d7=…" …` (d14 / d30: views only).
4. **Pick the idea.** `python3 scripts/tracker.py next` (Idea text, opening hook, outline, theme).
5. **Write the script** (`shorts/<slug>/script.json`, format below). Before writing, verify the core
   finding with a web search; record the source in `Source checked`. Rules:
   - Only well-established findings. Name the researchers and year in `credit` exactly as published.
     If you can't find a solid source, set `Status=Failed` with the reason in `Lesson / notes` and take the next idea.
   - Start from Shivam's `Opening hook` and `Content outline`; tighten them for the format.
   - 55–85 spoken words → 22–35 s. Short sentences.
   - Sections in order: `hook` (1 line, a question or surprising claim to the viewer), `name`
     (1 line ending in the concept's name), `study` (1–2 lines), `stat` (1–2 lines carrying the numbers),
     `takeaway` (1–2 lines; the last line is the punchline).
   - The stat cue words must appear verbatim in the stat lines. Use `%` stats when possible (they light
     that share of the 20-person room); otherwise give `lit` (0–20) or `display`.
   - Titles: `title[0]` is the big word(s) (≤ 14 characters reads best), `title[1]` the pill (one word).
   - `hookStyle`: `eyes` for social/being-watched topics, `thoughts` for thinking/memory/decision topics.
   - Add `say` with a phonetic spelling when TTS would misread a word (e.g. "T-shirt" → "tee shirt").
   - Apply the "Rules from reviews" section below (the weekly review keeps it current).
6. **Build.** `bash scripts/build_short.sh <slug>` → `shorts/<slug>/<slug>.mp4` + `preview.jpg`.
   Look at `preview.jpg`. If text overflows or overlaps, shorten the lines and rebuild once.
7. **Host.** Push the video alone to the `media` branch (replacing what's there):
   `M=$(mktemp -d) && cp shorts/<slug>/<slug>.mp4 $M && cd $M && git init -q && git checkout -q -b media && git add . && git -c commit.gpgsign=false commit -qm "media: <slug>" && git remote add origin https://github.com/SamShark777/motion-as-code.git && git push -q -f origin media && cd -`
   Check `https://raw.githubusercontent.com/SamShark777/motion-as-code/media/<slug>.mp4` answers 200
   (`curl -sL -o /dev/null -w "%{http_code}"`; retry for up to a minute — the CDN can lag).
8. **Schedule** with Metricool `createScheduledPost` for **tomorrow 4:00 PM America/Los_Angeles**
   (or the best slot from `getBestTimeToPostByNetwork` for youtube between 12:00 and 18:00 tomorrow):
   - media: the raw media-branch URL; providers youtube, instagram, tiktok.
   - Always post as a **Short** (Shivam's rule): youtubeData `type` must be `"short"`, never `"video"`,
     and the video must be the vertical 1080×1920 build. Re-read the createScheduledPost response and fix it if not.
   - youtubeData: `{type: "short", title: "<post.title>", privacy: "public", madeForKids: false, category: "EDUCATION", tags, isAiGeneratedContent: false}`
   - instagramData: `{type: "REEL", showReelOnFeed: true}`; tiktokData: `{title: "<post.title>", privacyOption: "PUBLIC_TO_EVERYONE"}`
   - text: the post description + 3–5 hashtags (#psychology #shorts + topic tags).
9. **Record.** `tracker.py set <No> "Status=Scheduled" "Slug=…" "Post date=YYYY-MM-DD" "Hook style=…"
   "Length (s)=…" "Title used=…" "Metricool ID=<uuid>"`. Commit "short: <slug>" and push to `shorts`
   (fetch + rebase first if the push is rejected; on an xlsx conflict, re-apply your `set` calls on theirs).
10. **Tell Shivam** (push notification / message): the title, post time, preview.jpg, the planner link and
    "Delete it in Metricool before 4 PM tomorrow to veto."

If any step fails, don't schedule a half-made video: set `Status=Failed` with the reason in
`Lesson / notes`, push, and tell Shivam what broke.

## Weekly review (Sundays)

`python3 scripts/tracker.py dump > /tmp/t.csv` and analyse the published vertical Shorts (skip No. 1, the
horizontal pilot): total views and engagement at d7 (d14/d30 when present), YouTube retention (avg view ÷
length) — compared across theme, hook style, length, title wording, opening-hook type (question vs claim),
template fit and weekday. Then:
- Write `shorts/reviews/<date>.md`: what worked, what didn't, with the numbers.
- Fill `Lesson / notes` on reviewed rows with a one-line takeaway.
- **Tune the queue:** renumber `Priority` on upcoming `Idea` rows to move the patterns that win forward,
  and rewrite weak `Opening hook`s of upcoming ideas in the winning style (keep the old hook in
  `Lesson / notes` as "was: …"). Add or update up to 5 bullet rules under "Rules from reviews" below.
- With fewer than 5 Shorts past day 7, say the sample is too small: describe only, change nothing.
Commit, push and send Shivam the headline findings plus what was changed.

## Rules from reviews

- (none yet)

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
