---
name: cassa-post
description: Publish a news post or event to the CASSA site from a category + content. Placement is automatic — the right `category`/`series`/`lang` frontmatter files the markdown into the correct collection so it surfaces on the right pages (main News feed, Bangla series, or the Events calendar) with NO page edits. Invoke when the user types "/cassa-post ..." or says "post a news", "add an event", "publish this colloquium / journal talk / workshop / astronomy night", "add a Bangla article", or gives a category plus a writeup to publish. Handles slug, frontmatter, image localization, and build validation. Never deploys.
---

# Post news & events to CASSA

Publish a **news post** or **event** by writing one markdown file into the
correct content collection. **Placement is entirely frontmatter-driven** —
every listing page filters the collection by `category` / `series` / `lang`, so a correctly-filed entry appears in the right place automatically.
**You never edit a page to place a post.** Your whole job is: classify → fill
the schema → localize images → validate the build.

This skill complements `/cassa-create` (which designs pages). Use **this** skill
for the routine act of adding a post; use `cassa-create` only if a new *page or
section* is needed. Read that skill's references only if a design question arises.

---

## STEP 0 — Classify, then resolve the destination

Two questions decide everything:

**A. Is it NEWS or an EVENT?**
- **Event** = something that happens at a time/place (colloquium, journal talk,
  workshop, astronomy night, meeting, ceremony). It belongs on the **calendar**.
  → collection `events`, has `start`/`end`/`venue`.
- **News** = a report, announcement, milestone, or article (incl. a *writeup*
  of an event that already happened). → collection `news`, has `date`.

A talk that is *upcoming* is an **event**. A *story about* a past happening is
**news**. Many real-world things get both (e.g. an Astronomy Night gets an event
entry beforehand and a news writeup after) — if the user's content is a
narrative report, it's news; if it's "here's what's on", it's an event.

**B. Map the category to its destination.** The user gives a category; resolve
it against these tables. If their category isn't listed, pick the closest and
**confirm with the user** before writing — do not invent a new top-level bucket.

### NEWS categories → where it shows

| Category (`category:`) | Extra frontmatter | Appears on |
|---|---|---|
| `Milestones` | — | `/news` |
| `People` | — | `/news` |
| `Outreach` | — | `/news` |
| `Colloquia` | — | `/news` |
| `Workshops` | — | `/news` |
| `নতুন কথা` (Notun Kotha) | `lang: "bn"` | `/outreach/bangla` (Notun Kotha series) |
| `দূরের কথা` (Durer Kotha) | `lang: "bn"` | `/outreach/bangla` (Durer Kotha series) |
| `সহজ কথা` (Shohoj Kotha) | `lang: "bn"` | `/outreach/bangla` (Shohoj Kotha series) |
| `ক্লাসিকেল কথা` (Classical Kotha) | `lang: "bn"` | `/outreach/bangla` (Classical Kotha series) |

Key rules:
- The four **Bangla series** names are an exact-match join key
  (`src/data/bangla-series.ts`). They are **excluded from the main `/news` feed**
  and live only under `/outreach/bangla`. Always pair with `lang: "bn"`.
- **Durbin content does not belong in this repo.** Durbin moved to its own site
  (durbin.cc) on 2026-08-11; the `/durbin` pages, the Durbin Updates feed and the
  `durbin:` flag are all gone from here. A Durbin post goes in `../durbin`
  (`src/content/news/`), not here. A CASSA post that merely mentions Durbin is
  fine under a normal category.
- Every other category flows into the main `/news` feed and becomes a filter
  chip there automatically. The chip order preference is
  Milestones → People → Outreach → Colloquia → Workshops; new categories sort last.

### EVENT `series` → rendering & calendar

`series` drives rendering and the colour tag; `category` is the human display
label shown on the row/tag (defaults to `series` if omitted). All events appear
on `/events` (calendar + upcoming/past lists) automatically.

| `series:` | Typical `category:` label | Notes |
|---|---|---|
| `colloquium` | `Colloquium` | hero image of the speaker; abstract in body |
| `journal-talk` | `Journal Talk` | **NO hero** — renders an animated cosmic title card from `paperTitle`. Set `paperTitle` to the paper title; put the citation in `title` (e.g. `Journal Talk N: Author et al. YEAR`) |
| `workshop` | `Workshop` / `Online Workshop` | hero optional |
| `outreach` | `Astronomy Night` / `Public Evening` / `Training Camp` | public events; hero = poster/photo |
| `other` | `Meeting` / `Ceremony` / `Tea Talk` / `School` | catch-all |

---

## STEP 1 — Gather the required fields

Ask the user for anything missing (don't guess facts — see Guardrails). Minimum:

**News:** `title`, `date` (ISO 8601 with `+06:00` Dhaka offset), `category`,
`summary` (1–2 sentences for the list view), and the body. Optional: `hero` +
`heroAlt`, `author`/`authorHref`, `featured` (homepage slider), `theme`.

**Event:** `title`, `start` (ISO+06:00), `series`, `category`; plus `end`,
`venue`, `organizer`, `summary` as available. Journal talks also need
`paperTitle`. Use `allDay: true` for date-only events.

Dates are always `Asia/Dhaka` (`+06:00`). Convert any relative date the user
gives ("today", "next Friday") to an absolute ISO timestamp — today is in the
session context.

---

## STEP 2 — Slug & file path

- Slug = kebab-case, stable, descriptive. For serialized items keep the existing
  numbering convention (`colloquium-15.md`, `journal-talk-20.md`,
  `astronomy-night-15.md`). Check the directory first to continue the sequence.
- News → `src/content/news/<slug>.md`
- Event → `src/content/events/<slug>.md`
- The slug **is** the URL: `/news/<slug>` or `/events/<slug>`.

---

## STEP 3 — Images (localization is mandatory)

Follow the project's image rules strictly (memory: image-localization):

- Co-locate images under `src/assets/<news|events>/<slug>/` and reference them
  **relative** from the markdown frontmatter:
  `hero: "../../assets/news/<slug>/<file>.webp"`. The `image()` schema helper
  resolves & optimizes them; a bad path fails the build.
- Prefer **`.webp`**. The `hero` is the single best image (used as the list
  thumbnail). Always set `heroAlt` (concise, descriptive).
- Only use **CASSA-owned / cassa.bd** imagery or originals the user provides —
  never AI-generated images, never hotlink. cassa.bd rate-limits bulk
  downloads (403): fetch **sequentially**, and recover originals from
  `knb/wordpress/posts/` if needed. **Never drop content because an image
  failed** — publish the text and flag the missing image.
- In-body figures use the markdown shape the pipeline expects: an `![alt](path)`
  image paragraph immediately followed by a `*Figure N: caption.*` italic
  paragraph — `rehypeArticleFigure` wraps these into `<figure>` and groups
  consecutive ones into a gallery. Two-plus consecutive figures auto-form a
  responsive gallery.
- Journal talks take **no hero** (the cosmic card is generated).

---

## STEP 4 — Write the file

Use these exact frontmatter shapes (schemas in `src/content.config.ts`).

**News:**
```markdown
---
title: "…"
date: "2026-06-07T17:00:00+06:00"
category: "Outreach"          # see NEWS table
summary: "One–two sentence teaser for the list view."
hero: "../../assets/news/<slug>/<img>.webp"   # omit if none
heroAlt: "Descriptive alt text."
author: "…"                   # optional
lang: "en"                    # "bn" for the Bangla series
featured: false               # true → eligible for homepage slider
# status: "published"         # default; use "draft" to stage (note the quotes)
---

Body in markdown…
```

**Event:**
```markdown
---
title: "CASSA Colloquium 15: …"
start: "2026-06-20T13:00:00+06:00"
end: "2026-06-20T14:00:00+06:00"
venue: "…, IUB, Bashundhara R/A"
organizer: "CASSA, Independent University, Bangladesh"
series: "colloquium"          # see EVENT table — drives rendering
category: "Colloquium"        # display label
summary: "Speaker: … — one-line abstract."
hero: "../../assets/events/<slug>/<img>.webp"   # omit for journal-talk
heroAlt: "…"
# paperTitle: "…"             # journal-talk ONLY
lang: "en"
---

## Speaker
…

## Abstract
…
```

Match the surrounding files' style (look at a sibling entry of the same
series/category before writing). Reuse real venue/organizer strings verbatim
from existing entries rather than paraphrasing.

---

## STEP 5 — Validate

- Run **`npm run build`** only. Do **not** start/restart/kill the dev or preview
  server — the user keeps `astro dev` running in `screen` and watches live
  (memory: no-preview-server). After a green build, tell them to **hard-refresh**.
- If a frontmatter/image change doesn't show, the content cache is stale:
  `rm -rf .astro dist && npm run build`.
- A `status: "draft"` entry is intentionally suppressed from production listings;
  its `/news/<slug>` or `/events/<slug>` detail page is also dropped.

After the build passes, report: the file path, the resolved category/series, and
**exactly which page(s)** the entry now appears on (per the STEP 0 tables).

---

## Guardrails

- **Never fabricate facts** (speakers, dates, affiliations, paper titles). If a
  required field is unknown, ask — don't fill a placeholder. Where canonical
  content exists, source it from `knb/` (authoritative WordPress XML over the
  lossy md scrape) and the Constitution digests.
- **No divisions; titles per project rules** — keep org facts consistent with
  the project memory (two Directors; no "Executive Director" title sitewide; no
  OTA/RSS divisions).
- **Bilingual content is preserved**, never machine-translated silently. EN/BN
  pairs cross-link via `altSlug`/`altHref` where the schema supports it.
- **Stay local.** This skill writes files and builds; it **never** pushes,
  merges, or deploys. The site auto-deploys from `main`, so committing/pushing
  happens only when the user explicitly types `PUSH`.
