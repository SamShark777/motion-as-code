# Stick-Story Shorts — Story Guide (for the Hook Scout agent)

Each story = ONE JSON file in `wan\shorts\stories\`, named `NNN_slug.json` (3-digit, continue numbering after the highest existing file).
The nightly renderer (`run_queue.bat`, 2:07 AM) renders the 4 lowest-numbered stories that have no `output\NNN_slug.mp4` yet.
Engine: `make_dilemma.py` (Flux scenes + ElevenLabs v3 voice with word timing + dark-glass UI chips + one-word captions).
Reference example that is known to work: `stories\101_twenty_million.json` — copy its structure.

## Hard rules
- 45–65 s of narration (~110–160 words). Second person ("You…") or tight third person. Short sentences.
- **Frame 1 must sell the whole dilemma.** (Lesson from 104: 47% swiped away because the condition — "no phone" — only came at second 4.) So:
  - The first spoken sentence states the full deal **including the catch** in ≤14 words, ideally as a question: "Would you take a million dollars if you could never use a phone again?" — not "A stranger offers you one million dollars." No setup, no "Imagine if", no greetings.
  - Add a `"hook"` object: `{"top": "$1,000,000", "bottom": "But you can never use a phone again"}` — `top` is the stakes in ≤3 words (a number if possible), `bottom` is the catch in ≤8 words. The renderer shows it as a big green/white card from frame 0 until the first sentence ends (2.4–4 s); chips wait until it's gone. If omitted it's built from the title, so the title must also carry the catch.
  - Part 2s: `"hook": {"top": "PART 2", "bottom": "<part 1 dilemma in ≤8 words>"}`; the first line still opens on the chosen path.
  - The rules of the dilemma must be airtight in one line (e.g. "$1M in cash" so "you need a phone to bank" can't break it). Viewers will poke holes.
- An open loop by line 3 (a question the viewer needs answered) and a twist at ~70%.
- Channel: **Stick or Twist (@stickortwist2)**. The last line should say "Stick or twist?" (or a poll) and the final banner chip should carry @STICKORTWIST2.
- **Every cliffhanger gets a Part 2.** Any story that ends on a poll or open question must have its Part 2 written in the same batch, numbered right after the other stories so it posts 1–3 days later: `"series": "part-2"`, `"part_of": "<slug of part 1>"`, title "<part 1 title> — Part 2". Part 2 opens with a PART 2 banner chip and starts straight into the chosen path ("You return the bag.") — never mention votes, comments or that nobody answered. Use the majority choice if comments clearly picked one, otherwise the most satisfying outcome. Part 2 must fully resolve the story (no new poll) and end with a THE END banner + @STICKORTWIST2.
- End with an engagement device: a choice poll ("Comment X or Y — your vote decides Part 2"), a "Would you survive?" or a "Which would you pick?".
- Facts/stats shown in chips must be real and conservative (e.g. a $100 bill ≈ 1 g). If unsure, use story-internal numbers (time left, battery %, distance).
- No real people, brands, logos, gore, self-harm, weapons instructions, or minors in danger. Keep it PG-13 suspense.
- 8–10 scenes. Max ~2 sentences per segment. Every segment needs a `visual`.

## JSON schema
```
{
 "format": "dilemma",                     // engine (always "dilemma" for new stories)
 "series": "money-dilemma",               // style bucket, see style menu
 "hook_pattern": "found-money",           // pattern from research/hooks_library.md
 "title": "You just found $20 million",
 "hook": {"top": "$20,000,000", "bottom": "Found on an empty road. Keep it?"},   // frame-1 card (see Hard rules)
 "voice": {"provider": "elevenlabs", "voice_id": "nPczCjzI2devNBz1zQrb", "model": "eleven_v3", "stability": 0.4, "kokoro": "am_michael"},
 "tail": 3.5,                              // seconds to hold the ending
 "style": "<copy the style string from 101 unless the series calls for a different palette>",
 "character": "<copy the character string from 101 — keeps the recurring guy consistent>",
 "scenes": {
   "A": "scene prompt (the character text is auto-prepended)",
   "C": {"pov": true, "prompt": "First-person point of view... only the viewer's own two cartoon hands..."}   // POV: character text NOT prepended
 },
 "segments": [
   {"text": "...", "tags": "[nervous]", "visual": {"scene": "A", "move": "push"}, "ui": [ ... ], "sfx": ["buzz"], "flash": "black"},
   {"text": "...", "visual": {"continue": true}, "keep_ui": true},
   {"text": "Day three.", "visual": {"card": "day", "label": "DAY 3", "sub": "4 LITERS LEFT"}}
 ]
}
```
- `tags` (ElevenLabs v3 audio tags, 4–6 per story, vary them): [whispers] [nervous] [excited] [awed] [cold] [sighs] [gasps] [slowly] [laughs nervously] [strained] [dramatic pause]
- `move`: push | pull | up | down | left | right | hold | punch (fast zoom hit — use on reveals)
- `flash`: "black" (hard cut + boom, use 2–3×) | "invert" (negative-film twist moment, use once at the twist)
- `sfx`: cash | buzz (phone vibrate) | ring:N | heart::SECONDS (heartbeat bed) | type:N | boom | riser
- `ui` replaces on-screen chips unless `keep_ui: true`. Chip `at_word: k` makes it pop on the k-th word of that segment. `sticky: true` keeps it across clears.
  - counter: {"type":"counter","label":"YOU JUST FOUND","from":0,"to":20000000,"prefix":"$","suffix":"","sub":"","dur":1.6}
  - value:   {"type":"value","label":"RETURN LOCATION","value":"18 MERCER ROAD"}
  - clock:   {"type":"clock","label":"TIME REMAINING","value":"13 MINUTES","sub":"LEFT TO DECIDE","green":true}
  - msg:     {"type":"msg","sender":"UNKNOWN SENDER","text":"Did you get both bags?"}   (typed out)
  - reply:   {"type":"reply","text":"Yes."}
  - call:    {"type":"call","label":"UNKNOWN NUMBER","value":"INCOMING CALL"}
  - battery: {"type":"battery","value":"1%","sticky":true}
  - choice:  {"type":"choice","pos":"bottom","options":[["RETURN","TAKE ONE BAG TO THE ADDRESS"],["KEEP","LEAVE WITH BOTH BAGS"]]}
  - banner:  {"type":"banner","title":"COMMENT RETURN OR KEEP","sub":"YOUR VOTE DECIDES PART 2"}
- Card segments (DAY/HOUR cards) should carry "ui": [] so earlier chips don't sit on the black card. Don't use emoji in chip text (the UI font can't draw them).
- Use 4–8 chips per story; a counter or clock in the first 5 s is ideal.

## Scene prompt tips (Flux)
- One clear action per scene, name the setting, light and mood. Say "bulging/overflowing" for full bags, "unzipped".
- POV shots MUST use {"pov": true} and start with "First-person point of view... no face visible".
- Avoid text/signs in scenes (renderer adds all text). Avoid crowds and complex hands-with-objects (keep 1 object).

## Style menu (rotate; aim for a weekly mix)
1. money-dilemma — found/offered money + a catch + choice poll (101 is the template)
2. survival-what-if — "What if you were trapped/lost/stranded…", DAY cards, resource counters
3. mystery-texts — unknown sender messages escalate; phone UI heavy; twist reveal
4. would-you-rather — two impossible offers, counters for each, poll ending
5. time-pressure — countdown clock drives the whole story (bomb-free: deadlines, tides, trains, doors)
6. part-2 sequels — continue a dilemma using last week's poll framing (both outcomes plausible)
