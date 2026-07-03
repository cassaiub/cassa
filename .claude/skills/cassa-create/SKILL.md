---
name: cassa-create
description: Plan and build the new ground-up CASSA website — an immersive, dark-by-default (light-toggle) Astro site that replaces the legacy WordPress site. Pages lead with a fullscreen image and reveal content on scroll; repeating content (people, publications, news, events, projects) is driven by Astro content collections with frontmatter-based routing. Invoke when the user types "/cassa-create <page-or-section>" or asks to "plan the CASSA site", "build the home page", "build the research page", "add the people directory", "port the about page", "create the events listing", or to tweak any part of the new site. This skill is PLANNING-FIRST: STEP 1 always produces a plan the user verifies before any code is written. Once invoked it stays active for the whole session. Canonical content lives in knb/ (the authoritative full WordPress XML export `knb/cassa.WordPress.2026-05-28.xml` + a lossy markdown scrape + constitution digests); the new Research/About/org content is governed by CASSA Constitution v2.0, NOT the legacy site where they diverge. Never deploys.
---

# Build the new CASSA website

You are building a **ground-up replacement** for the Center for Astronomy,
Space Science and Astrophysics (CASSA, at Independent University, Bangladesh)
website, currently on WordPress (Enfold theme) at cassa.bd. The new site is
a static **Astro** app in the spirit of the sibling `ast100` course site, but
it is an **institutional site**, so it adds content collections for the parts
that repeat (people, publications, news, events, projects).

Two ideas define the experience:

1. **Dark by default, light on demand.** The site ships dark; a toggle flips
   it to a light "day" theme. Every component must be correct in BOTH themes.
2. **Immersive pages.** Each major page leads with a **fullscreen image**
   (100svh) and **reveals content as you scroll** beneath it. Real CASSA
   photography, astrophotography, and data — never AI-generated imagery.

You are **not** improvising an institutional CMS. You translate canonical
source content (the `knb/` scrape + constitution digests) into a designed,
performant, accessible static site.

> **This skill is planning-first.** For ANY build request, STEP 1 produces a
> written plan and you **wait for the user's explicit "go"** before writing
> code. The site is large; a wrong foundation is expensive. Plan, verify, build.

---

## When to invoke / scope

Invoke when the user wants to plan or build any part of the new CASSA site:
- "plan the CASSA site" / "what's the architecture"
- "scaffold the foundation"
- "build the home page" / "build the research page"
- "add the people directory" / "port the about page"
- "create the news/events listing"
- "tweak the hero on the research page" / "fix the theme toggle"

**In scope:** the new Astro site under this repo root — scaffold, theming,
immersive page templates, content collections, listing/detail pages, nav,
and porting content from `knb/`.

**Out of scope (do not touch / do not migrate):** the existing
`/courses/ast100` Astro app and the `/abekta` DokuWiki. The new site sits at
the cassa.bd **root** and links out to those two; they stay as-is.
**Deployment is deferred** ("much much later") — never push or deploy.

---

## Self-improvement (automatic — every session)

This skill should sharpen over time. Watch the conversation for:
1. **Corrections** — "no, don't…", "use X instead", "this should be Z".
2. **Confirmations of a non-obvious choice** — "yes, exactly", silent
   acceptance of an unusual approach.
3. **New rules stated explicitly** — "always…", "never…", "we do X because…".
4. **Repeated patterns** — the same correction/request twice or more.

At a natural break (end of a plan, after a preview, when the user says "done"
or pivots), pause and say: "I noticed a rule worth recording: …", show the
exact text and where it goes (`## Hard rules` here, or the relevant `## STEP`),
and include the **WHY** (cite the moment/reason). Apply on approval; drop on
decline. The user commits the change. A rule without its WHY is brittle —
always include it.

---

## STEP 0 — Read the briefing (always, in parallel)

Before planning, read in parallel:

1. **This SKILL.md** (you're here) — the hub: scope, the build workflow, the
   design contract, and the hard rules.
2. **The task-relevant reference file(s)** in this skill's `references/` dir —
   read only what the task needs:

   | If the task touches… | read |
   |---|---|
   | CASSA identity, research areas, infra, missions (About / Research / org / People copy) | `references/cassa-facts.md` |
   | which `knb/` source feeds what; the Dropbox source-of-record | `references/content-inventory.md` |
   | what already exists / which file is the gold standard for a page | `references/built-so-far.md` |
   | the publications page (ADS fetch, inclusion + IUB-share rules) | `references/publications.md` |

3. **The relevant `knb/` source(s)** for the target (see
   `references/content-inventory.md`). For research/about/org content the
   **source of truth is the constitution digests**:
   `knb/constitution/research-spec.md` and `knb/constitution/org-summary.md`.
   For legacy page wording the authoritative source is the full XML export
   `knb/cassa.WordPress.2026-05-28.xml` (`content:encoded`, strip `[av_…]` Avia
   shortcodes); the quick `knb/wordpress/pages/<slug>.md` scrape is **lossy**
   (Avia pages kept only headings — e.g. the About genesis timeline is
   XML-only). For media: `knb/wordpress/media/_summary.md`.
4. **The sibling gold standard** at `../teaching/ast100/` for proven patterns
   (theme toggle, reduced-motion handling, prose typography, fullscreen
   behaviour, `withBase()` nav registry, the static-build + preview workflow):
   - `src/styles/global.css` — `@theme` tokens, dark/light, prose conventions.
   - `src/data/course-nav.ts` — single-source nav registry + `withBase()`.
   - `src/components/shared/*`, `src/scripts/*` — runtime polish.
   Reuse its *philosophy and conventions*; do not import its course-specific
   components wholesale.
5. **The new site's own files once they exist** (after scaffold): `src/styles/
   global.css`, `src/content.config.ts`, `src/data/site-nav.ts`, `src/layouts/*`,
   `src/components/immersive/*`. Until scaffolded, the "Architecture" section
   below is the contract you implement.

If a `knb/` source the task needs is missing, stop and tell the user — the
content pipeline depends on it.

---

## STEP 1 — Plan, then confirm (the verification gate)

Without writing any files, produce a plan covering:

1. **What** is being built (page, section, collection, or scaffold) and where
   it sits in the nav.
2. **Content source** — which `knb/` files feed it; what is ported verbatim,
   rewritten, or newly authored. For research/org/about content, cite the
   constitution clauses (the digests carry them).
3. **Immersive composition** — the hero image (which asset from the media
   manifest / constitution media), the scroll sections beneath, and any
   bespoke visual.
4. **Collections touched** — schema fields, new entries, routing.
5. **Decisions to confirm** — anything the constitution leaves silent or where
   sources conflict (see "Flag, don't fabricate"). List them explicitly; do
   not guess.
6. **Ripple** — shared components/styles/nav that change and what else could
   be affected.

Present the plan. **Wait for "go" or revisions before writing code.**

---

## Architecture (the design contract)

Mirror the `ast100` stack; add collections.

- **Astro 6 + React 19 islands + Tailwind v4 (CSS-first) + TypeScript.**
  Static output (`output: 'static'`). No SSR. Islands only where interactive
  (theme toggle, scroll-reveal controller, any figure). Most of the site ships
  zero JS.
- **Images via `astro:assets`** (`<Image>`/`<Picture>`): optimized, responsive
  `srcset`, AVIF/WebP, lazy below the fold, eager + high priority for the hero.
  Real assets only.
- **`base: '/'`, `trailingSlash: 'never'`** (root deploy). Keep a `withBase()`
  helper anyway so a future subpath/staging deploy is a one-line change.
- **No `tailwind.config.js`** — tokens live in `@theme` in `src/styles/global.css`.
- **No deploy wiring yet.** When the user asks (much later), mirror ast100's
  GitHub Action → Bluehost rsync.

### Theming — dark default, light toggle
- `<html data-theme="dark">` is the shipped default (the site does **not**
  follow OS preference by default; dark is the brand default).
- Tokens in `@theme`; a `[data-theme="light"] { … }` block overrides them.
- A tiny **inline head script** sets `data-theme` from `localStorage` before
  first paint to avoid a flash; the `ThemeToggle` island flips + persists it.
- Every surface, gradient, scrim, and text colour must be legible in BOTH
  themes — verify both at preview.

### Immersive page model (the signature)
**Animated backgrounds (`src/components/`):**
- **`SkyCanvas.tsx`** — the original code-generated animated backgrounds (no
  photos). Themes: `cosmic` (expanding galaxies + a distance-network mesh),
  `lensing` (star field warped by a drifting gravitational lens), `galaxy`
  (rotating spiral disk + star-forming knots). Canvas 2D, lightweight; animates
  ONLY while on-screen (IntersectionObserver) and the tab is visible; reduced
  motion paints a single static frame. Add a motif by extending the `SkyTheme`
  union + `build()`/`draw()`.
- **`FeatureSlider.tsx`** — the home hero: a fullscreen auto-advancing carousel
  of feature stories, each over a `SkyCanvas` background (one theme per story).
  Research/colloquia stories only (rule 16). Pause on hover/focus, dots, arrows,
  progress bar, ←/→ keys.

**Immersive layout kit (`src/components/immersive/`):**
- **`AnimatedHero.astro`** — 100svh hero with a `SkyCanvas` background + scrim +
  eyebrow/title/lede/cue. **Default hero for designed pages** (Research uses it).
- **`AnimatedBand.astro`** — full-bleed ~100svh `SkyCanvas` band between content
  blocks (slotted caption); hydrate with `client:visible`.
- **`ImmersiveHero.astro` / `ImageBand.astro`** — the photo-backed equivalents,
  kept for real-photo heroes/bands (e.g. the home SITO band uses M74). Prefer
  the Animated* versions for primary landing/feature backgrounds (rule 17).
- **`Reveal.astro`** — wraps content that fades/rises in on scroll (the
  IntersectionObserver lives inline in `BaseLayout.astro`); `delay` staggers.
- **`Prose.astro`** — the centred, readable ~68ch column (left-aligned body).
  Full-bleed is for imagery only; running text stays in the centred column.
- Designed narrative pages (Home, Research, About, …) are bespoke `.astro`
  files composing this kit; `BaseLayout.astro` is the html shell (theme
  bootstrap + `SiteNav` + `Footer` + the reveal observer).

### Content architecture — collections + frontmatter routing
Defined in `src/content.config.ts`. Repeating content is data, not hand-built
pages. Proposed collections (confirm exact schemas in STEP 1):
- **`people`** — name, slug, tier (Director/CM/AM/GAM/Affiliate/RA/RI/Staff/
  Ambassador), title, interests[], photo, links, order,
  status. → `/people` directory + `/people/[slug]`. (No `division` field — CASSA
  has no divisions; see hard rule 2.)
- **`projects`** — research projects (Sparkler, Dolphin, RGC, Supernova
  Cosmology, AUDIT, ARC-HALO, radio/LOFAR/SKA work). title, slug,
  leads[], summary, hero, links, status. → `/research/projects[/slug]`.
- **`publications`** — likely fed from ADS/SciX later; for now a collection
  (title, authors, year, venue, doi, link). → `/publications`.
- **`news`** — title, slug, date, category, hero, summary, status. →
  `/news/[slug]` + index + section feeds.
- **`events`** — title, slug, start, end, venue, organizer, series
  (colloquium|journal-talk|workshop|outreach), link, status. → `/events`.
- **`gallery`** — the astrophotography/portfolio image entries (~110): title,
  object, image, instrument, category (nebulae|galaxies|stars|clusters|…),
  exposure/data. → an immersive gallery (placement TBD — likely under Outreach
  or its own Astrophotography section; **confirm with user**).

**Frontmatter routing model** (what the user asked for): a markdown file
carries `type`/`section`/`status` in frontmatter; a dynamic route reads those
and *files the page automatically* into the right collection index, feed, and
URL. New content arrives as markdown and the system places it — no per-item
page wiring.

### Person profile pages (the reusable pattern — added 2026-05-30)
Individual `/people/<slug>` detail pages use **ONE generic dynamic route**, not
hand-built per-person `.astro` files. **Eventually everyone gets a page**, so this
is the long-term-correct structure; build new profiles by adding data, never new
templates.
- **Template:** `src/pages/people/[slug]/index.astro` — `getStaticPaths()` emits
  only slugs present in the registry, so a person gets a page **iff registered**
  (today only `asad`). Every section is OPTIONAL and renders only if that person
  has the data: hero, `PersonCard`, biography, research programs, teaching &
  outreach, work & education, publications.
- **Registry / gate:** `src/data/people/profiles.ts` exports `PROFILES`
  (`slug → ProfileData`) and `hasProfile(slug)`. The `/people` table and the
  directors page link to a person **only when `hasProfile(slug)`** — everyone
  else stays card/table-only (no page, no dead link).
- **Per-person data:** `src/data/people/<slug>.ts` exports the `ProfileData`
  (headline, programs[], engagements[], workEducation[], links, publications).
- **Biography = the markdown body** of `src/content/people/<slug>.md`, rendered
  with `render(entry)` → `<Content/>`. Identity (name/title/tier/photo/email/
  interests) is the entry's frontmatter.
- **Assets convention:** downloads (PDFs) → `public/people/<slug>/…` (e.g.
  `public/people/asad/msc-thesis.pdf`); optimizable images → `src/assets/people/
  <slug>/…`; card photo at `/people/<slug>.webp`.
- **Publications:** a frozen snapshot module `src/data/<slug>/publications.ts`
  (ADS ∪ Scholar, matched by title). ADS is the scalable default for everyone
  (key off the entry's `ads`/`orcid` aliases); **Scholar is an optional overlay**
  only for people who supply a snapshot. Per-person labels (`shareLabel`,
  `personShort`) keep the share column/footnote correct.
- **To add a future person:** (1) write `src/content/people/<slug>.md` (frontmatter
  + bio body); (2) create `src/data/people/<slug>.ts`; (3) register it in
  `profiles.ts`. That's the whole checklist — do NOT create a new page file.

### Nav / registry
Single source of truth in `src/data/site-nav.ts` (mirror ast100's
`course-nav.ts`): top menu order, sections, and `live` flags. All hrefs go
through `withBase()`. Never hard-code paths or "coming soon" — use `live`.

---

## STEP 2 — Author content into collections

For directory content, write/port markdown (or data) entries into the right
collection under `src/content/<collection>/`, with frontmatter matching the
schema. Source from `knb/` (people roster, portfolio, posts, events). Preserve
**bilingual (Bengali) content** — do not drop Bangla entries; carry a `lang`
field and plan a language strategy (confirm approach in STEP 1).

## STEP 3 — Author the page / template

Bespoke narrative pages: compose the immersive kit in a `.astro` page under
`src/pages/`. Listing/detail pages: a dynamic route over the collection.
Follow the Architecture contract. Keep running text in `Prose`; use real
imagery for heroes/bands.

## STEP 4 — Update `src/data/site-nav.ts`

Register the new page/section; flip `live: true`. Add any rail/section anchors.

## STEP 5 — Build + preview (always)

```bash
# Kill stale dev/preview first:
pkill -f "astro dev" 2>/dev/null; pkill -f "astro preview" 2>/dev/null
npm run build && npm run preview
```
Walk the page and verify:
- Loads, no console errors; hero fills the viewport; content reveals on scroll.
- **Dark AND light** both correct (toggle; legibility of text over images).
- **Reduced motion** (DevTools): parallax/Ken-Burns/reveals replaced by static
  states, not just removed.
- **Mobile** (~360px): no horizontal scroll; hero art-direction works; nav
  collapses; controls reachable.
- **Keyboard**: tab order logical, visible focus, toggle/menu operable.
- **Images**: optimized (astro:assets), alt text present, hero not janky.
- Nav links resolve under `withBase()`; new entry appears in the menu.

## STEP 6 — Hand off

Report files created/edited, content decisions, anything flagged or skipped,
and the **decisions still needing the user**. Do **not** commit or deploy
without explicit instruction. Deployment is deferred.

---

## Hard rules (do not violate)

1. **Dark is the default theme; light is a toggle.** Every component correct in
   both. Test both before "done."
2. **Constitution v2.0 + the user's confirmed structure are the source of
   truth** for research/org/about/people, over the legacy WordPress site where
   they diverge. **NO DIVISIONS** — CASSA decided against research divisions;
   the former OTA/RSS split (and the `division` field, pages, pills, and nav
   group) was removed site-wide on **2026-05-30**. Do not reintroduce divisions.
   Research is **five un-grouped research areas**, all under CASSA: **CHronOS,
   GATE, RAIN** (radio/cosmology) and **Supernova, Transient** (time-domain),
   surfaced on one `/research` page. **MATRiX is retired** (→ RAIN). CASSA has
   **two Directors — K.M.B. Asad and S.A. Uddin** (no "Division Director"). The
   **"Executive Director" title is removed site-wide "for now"** (user, 2026-05-30);
   do not add an ED label anywhere unless the user asks. See `references/cassa-facts.md`.
3. **Flag, don't fabricate.** Where the constitution is silent or sources
   conflict, surface it; never invent. Still open: BDOAA officers
   (constitution vs. certification letter), GAM vs GM naming, "Manager
   (Science)" vs "Science Manager". Two Directors total, no division wording, and
   no "Executive Director" title anywhere (removed for now — see rule 2).
4. **No AI-generated images.** Use real CASSA photos, astrophotography, and
   data plots — from the WP media manifest and constitution media. Concept art
   is replaced by a real image or a bespoke interactive, never a generated one.
5. **Every fullscreen/animation needs a `prefers-reduced-motion` fallback** —
   a meaningful static state, not just "no animation."
6. **Images go through `astro:assets`**, responsive + lazy (hero eager). No raw
   oversized `<img>`. Always provide alt text.
7. **No `tailwind.config.js`.** Tailwind v4 CSS-first; tokens in `@theme`.
8. **No hard-coded URLs or "coming soon."** Use `withBase()` + route helpers
   and the `live` flag in `site-nav.ts`.
9. **Repeating content is a collection,** not hand-built pages. New markdown
   with the right frontmatter is filed automatically.
10. **Readable prose column** — centred, ~68ch, left-aligned body. Full-bleed
    is for imagery only; never centre-align long body text.
11. **Static output only.** No SSR/server runtime.
12. **No new heavy dependencies** without asking (prefer CSS + IntersectionObserver
    over animation libraries).
13. **Preserve bilingual (Bengali) content.** Don't silently drop Bangla pages.
14. **Never deploy or push** without explicit instruction — deployment is
    deferred. Build + preview locally is the loop.
15. **Don't touch `/courses/ast100` or `/abekta`.** The new site links out to
    them; it does not absorb or modify them.
16. **Home feature slider = research or colloquia stories only** — not
    outreach. Reason: the landing should foreground the center's science; the
    user corrected an outreach-led slider on 2026-05-28. Outreach has its own
    Outreach/Durbin section.
17. **Primary landing/feature backgrounds are original, code-generated
    animations** (e.g. `SkyCanvas`), thematically tied to the content — not
    static photographs. Reason: the user wants living, bespoke backdrops
    (stated 2026-05-28). Edge cases: real photos / data plots are still right
    for `ImageBand`s, galleries, and figures, and may be used for sub-page hero
    imagery unless the user asks for animation there too.
18. **Keep the `"overrides": { "vite": "7.3.3" }` pin in `package.json`.** A
    fresh `npm install` otherwise resolves Vite 8 + rolldown, which the pinned
    `@tailwindcss/vite@4.3.0` cannot bind to — the build dies with a
    `tsconfigPaths` error. If you bump Astro, re-verify Vite stays on 7.x.
19. **No two consecutive surfaces may share the same background palette — in
    BOTH themes.** SkyCanvas heroes/bands sit at roughly `--bg` (near-black in
    dark, near-page-pale in light), so a plain `.section` touching a canvas
    surface on EITHER side blends into it — as does `.section--elev` next to
    `.section--elev`. Three flat tones exist: `.section` (`--bg`),
    `.section--elev` (`--bg-elev`), `.section--elev-2` (`--bg-elev-2`); treat a
    canvas hero/band as the `--bg` tone and alternate so every neighbor pair
    differs (photo bands are always distinct). Reason: the user flagged the
    Research hero↔mission seam on 2026-05-28 and generalized the rule on
    2026-07-03 (home "What is CASSA"↔"Get involved" seam); a site-wide audit
    fixed 17 pages that day — keep new pages clean.
21. **Intrinsic min-content must never widen a page on phones.** Grid/flex
    tracks holding arbitrary content need `minmax(0, 1fr)` (a bare `1fr`
    refuses to shrink below content); single-column link tables need
    `table-layout: fixed`; `overflow-wrap: break-word` is inherited from
    `body`; wide-by-nature tables get an `overflow-x: auto` wrapper. After any
    layout work, probe key pages headlessly at 360px AND 320px
    (`scrollWidth == clientWidth`). Reason: this trap bit three separate
    surfaces in one day (home news column, profile grid, profile link tables)
    — user demanded dynamic fit on low-res phones on 2026-07-03.

20. **The Bangla webfont (`Noto Serif Bengali`, via Google Fonts) goes LAST in
    `--font-sans` — never first — so it never touches the English/Latin text.**
    Google ships `latin`/`latin-ext` faces for it too, so listing it first makes
    English render in it. Per-character font matching uses the first family that
    has the glyph: with the webfont LAST, Latin stays on the system sans stack
    (and Noto's Latin file never even downloads), while Bangla glyphs — absent
    from the system fonts — fall through to Noto. Its `@font-face` carries a
    Bengali `unicode-range`, so the file only loads on pages that contain Bangla.
    Wired in `BaseLayout.astro` (`preconnect` + the `css2` stylesheet link) +
    the `--font-sans` stack in `global.css`. Reason: the user required the Bangla
    font change to NOT alter the pre-existing English fonts (2026-05-29). The
    same trap applies to any `Noto Serif/Sans <Script>` family — always append,
    never prepend.

---

## Build, preview & the cache gotcha

**Dev workflow:** `npm run build` validates and is the fast feedback loop (note:
Astro build does **not** type-check — use `astro check` for types). Dev/preview
serves on :4321, falling back to :4322 if busy. Build, preview, react.

**Preview / cache gotcha (learned the hard way):** when a visual change "isn't
taking effect," suspect a **stale browser cache or stale preview server** before
re-editing — the code is usually right. Verify by grepping `dist/_astro/*.css`
(or `curl`-ing the linked stylesheet on :4322) for your rule; then tell the user
to **hard-refresh** (Ctrl/Cmd+Shift+R). Restart preview by freeing the port —
`fuser -k 4322/tcp` — and **never** `pkill -f "astro preview"`: the pattern
matches your own shell command and kills it (exit 144). Scoped `<style>` in a
`.astro` file DOES apply to classes on child components like `<Reveal class="…">`.

---

## Speed tip

When inspecting many independent `knb/` files or building several
independent components, read/dispatch in parallel. For large parallelizable
porting (e.g. generating many collection entries), dispatch agents in parallel.

## Multi-agent workflows / ultracode — when (and when not)

Default to **solo** work. Most CASSA tasks are single-threaded craft — building
or tweaking one bespoke `.astro` page, porting content into a collection, fixing
CSS/tokens/theme. A large fan-out can't beat one focused pass at a hero section,
and the usual bottleneck here is **stale cache, not insufficient analysis**
(see the preview/cache notes above). Heavy orchestration also fights the
build-then-hard-refresh loop where the user is watching the browser live.

Reserve a multi-agent **Workflow** (or ultracode) for the few genuinely
convergent, fan-out moments where breadth or confidence beats a single pass:
- **Content reconciliation** — WordPress XML vs. the lossy `.md` scrape vs. the
  Constitution: find every conflict and gap (a multi-modal sweep).
- **Pre-launch QA sweep** — every page in BOTH themes, every `withBase()`, every
  dead/coming-soon nav link, broken images, reduced-motion fallbacks (broad
  coverage + adversarial verify).
- **Site-wide refactor** — e.g. a token/class rename across all pages
  (fan-out + worktree isolation).

Ultracode is user-enabled, not self-triggered. When one of those moments
arrives, offer to line up a workflow rather than assuming it.
