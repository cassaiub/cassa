# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Ground-up replacement for the CASSA (Center for Astronomy, Space Science and Astrophysics at IUB) institutional website. Static **Astro 6** site with **React 19** islands and **Tailwind CSS v4**. Deployed at root (`/`) at cassa.bd while sibling sub-sites (`/courses/ast100`, `/abekta`) are left untouched.

When building or planning any page or section, invoke the `/cassa-create` skill — it is PLANNING-FIRST (plan verified before code is written) and contains authoritative rules, content inventory, and CASSA-specific facts.

## Commands

```bash
npm run dev        # Dev server at :2026 (port pinned in astro.config.mjs)
npm run build      # Static build → dist/
npm run preview    # Serve dist/ locally
npx astro check    # TypeScript validation (build does not type-check)
```

**Port 2026 is this repo's.** Each CASSA repo owns one port so all four dev
servers coexist on the box: `inside` 2025 · `cassa` 2026 · `ast100` 2027 ·
`kriterion` 2028. Never start this one on any other port.

A `SessionStart` hook (`.claude/settings.local.json`, machine-local, untracked)
launches `npm run dev` in a `screen` session named `cassa-dev` when a Claude
session opens here — but only if nothing is already listening on :2026, so it
never double-starts. The user watches that server live: let the hook start it,
and do NOT restart or kill it yourself. Reattach with `screen -r cassa-dev`.

To validate, run `npm run build` only. After a build, ask them to hard-refresh. If a config/markdown-plugin change isn't taking effect, the `.astro/` content cache is stale: `rm -rf .astro dist && npm run build`.

## Architecture

### Two design axioms
1. **Dark by default, light on demand.** The site ships dark; a ThemeToggle island flips `[data-theme="light"]` on `<html>` (persisted to localStorage with an inline head script to prevent flash). Every component must render correctly in both themes.
2. **Immersive pages.** Each major page leads with a 100svh hero and reveals content on scroll. Real CASSA photography and astrophotography only — no AI-generated imagery.

### Page types
- **Bespoke narrative pages** (`src/pages/*.astro`) — Home, About, Research, Teaching, Outreach and their sub-pages are fully designed immersive pages. The IA is broad: People, Research, Teaching, Outreach, Newsroom and Opportunities each have a landing page plus several sub-pages (see `src/data/site-nav.ts` for the authoritative map).
- **Collection-driven routes** — repeating content is sourced from `src/content/` markdown with schema-validated frontmatter, surfaced via `[slug].astro` dynamic routes (`news/`, `events/`, `opportunities/`, `outreach/bangla/`, `teaching/workshops/`). Most collections are populated; `projects`, `publications` and `gallery` are still scaffold-only (`.gitkeep`).

### Key source directories
| Path | Purpose |
|------|---------|
| `src/layouts/BaseLayout.astro` | HTML shell: theme bootstrap, nav, footer, reveal observer |
| `src/components/immersive/` | Layout kit: `AnimatedHero`, `AnimatedBand`, `ImmersiveHero`, `ImageBand`, `Reveal`, `Prose` |
| `src/components/SkyCanvas.tsx` | Code-generated animated backgrounds (cosmic/lensing/galaxy themes) |
| `src/components/FeatureSlider.tsx` | Home carousel (research/colloquia stories only — no outreach) |
| `src/data/site-nav.ts` | Single source of truth for nav; `live: false` renders "coming soon" |
| `src/content.config.ts` | Zod schemas for all eight collections |
| `src/data/` | Typed single-source data modules (nav, publications pipeline, series, volunteers) |
| `src/styles/global.css` | All design tokens (`@theme`), prose, hero/band, slider, utility classes |
| `knb/` | Content source of truth: WordPress scrape + CASSA Constitution v2.0 digests |

### Navigation
All nav items live in `src/data/site-nav.ts`. Always wrap hrefs with `withBase()` from that file — the base is `/` now, but this keeps a future subpath deploy as a one-line change. Toggle `live: false` to expose a planned nav item as "coming soon" without a dead link.

### Tailwind v4 (CSS-first)
No `tailwind.config.js`. All design tokens are defined in `@theme { }` inside `src/styles/global.css`. The Vite plugin (`@tailwindcss/vite`) is wired in `astro.config.mjs`. **Vite is pinned to 7.3.3** via `package.json` `overrides` — Vite 8/rolldown is incompatible with `@tailwindcss/vite@4.3.0`; do not upgrade it.

### Content collections (`src/content.config.ts`)
Eight collections: `people`, `projects`, `publications`, `news`, `workshops`, `events`, `opportunities`, `gallery`.

**Durbin is no longer part of this site (2026-08-11).** It moved to its own
repo (`../durbin`) and domain, **durbin.cc**. Removed from here: the
`/durbin/*` pages, the whole `astrophotography` collection (116 entries — the
exhibition now lives at durbin.cc/exhibition), `durbin-volunteers.ts`, the
`news.durbin`/`events.durbin` cross-listing flags, the `/cassa-astrophoto`
skill, and every news/event entry that migrated to that repo. Do not re-add
Durbin pages or astrophotography here; add them in `../durbin`. The Outreach,
About, Constitution and Safeguarding pages still describe Durbin in prose, as
a CASSA programme — that is correct and should stay.
- **No divisions.** CASSA decided against research divisions (the former OTA/RSS split was removed site-wide on 2026-05-30). There is no `division` field on any collection. Research is presented as five un-grouped **research areas** — CHronOS, GATE, RAIN (radio/cosmology) and Supernova, Transient (time-domain) — on a single `/research` page. CASSA has **two Directors** (Asad and Uddin); Asad is the current Executive Director.
- `tier` (people): Director → Core Member → Associate Member → Graduate Member → Affiliate → Staff → Research Assistant → Research Intern → Undergraduate Research Assistant → Outreach Ambassador → Alumni.
- `status: "published" | "draft"` (default `published`) on every collection — `draft` suppresses the entry from production listings. (Quoted `status: "draft"` evades a `^status:\s*draft` grep.)
- `lang: "en" | "bn"` on news/events/workshops/opportunities — bilingual content must be preserved; EN/BN pairs cross-link via `altSlug`/`altHref`.
- `events.series` (colloquium/journal-talk/workshop/outreach/other) drives rendering: journal-talks use NO hero and render an animated cosmic title card from `paperTitle`.

### Markdown rendering pipeline (`astro.config.mjs`)
Content `.md` flows through: **remark-math** (`$…$`/`$$…$$`) → **rehype-mathjax/svg** (renders LaTeX to self-contained SVG, no runtime JS) → **rehypeArticleFigure** (an inline, dependency-free hast walk that wraps `<p><img>`+`<p><em>` shapes into semantic `<figure>` elements and groups 2+ consecutive figures into a responsive `.article-gallery`). Editing these plugins won't re-render unchanged `.md` — clear the stale cache: `rm -rf .astro dist && npm run build`.

### Single-source-of-truth data modules (`src/data/`)
Non-collection structured data lives in typed TS modules, each the sole source for its surface: `site-nav.ts` (nav + IA), `opportunities.ts` (Opportunities categories), `bangla-series.ts` (the four Bengali article series), `ads-library.ts` + `journal-metrics.ts` (the `/research/publications` pipeline — a curated ADS-library snapshot + OpenAlex impact metrics; `ADS_API_TOKEN` lives in `.env`).

### Content authority
**CASSA Constitution v2.0** (digested in `knb/constitution/`) governs Research, About, and org content. Where it conflicts with the legacy WordPress scrape, the Constitution wins. Never fabricate facts when the Constitution is silent — surface the gap instead.
