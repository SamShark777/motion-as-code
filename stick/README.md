# Stick or Twist (@stickortwist2)

Separate channel from the psychology Shorts. Stories are written and rendered on Shivam's Shadow PC
(`wan\shorts`: Flux scenes + ElevenLabs v3 narration), then pushed here for posting.

- Videos: branch `media-stick` → `inbox/<slug>.mp4` + `inbox/<slug>.json` ({title, description}) from the Shadow PC.
- Posting: workflow **Stick Shorts** (`.github/workflows/stick-shorts.yml` on `main`, daily 10:41 PT) runs
  `scripts/stick_publish.py publish`: moves the next 4 inbox videos into tomorrow's date folder and schedules them
  at 08:00, 12:00, 16:00, 20:00 PT on the channel's own Buffer account (secret `BUFFER_API_KEY_STICK`).
- Log: `stick/posted.json`. Veto = delete the post in the Stick or Twist Buffer account.
- Never uses the psychology `BUFFER_API_KEY`, `media` branch or tracker.

## Source copies
- `stick/stories/` — every story JSON written so far (Part 2s use `"series": "part-2"`, `"part_of"`).
- `stick/pc/` — the Shadow PC's renderer (`make_dilemma.py`), `STORY_GUIDE.md` and queue/schedule scripts, so the
  PC can be rebuilt and the latest versions are recoverable if it is offline when they change.
