# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Ground-up replacement for the CASSA (Center for Astronomy, Space Science and Astrophysics at IUB) institutional website. Static **Astro 6** site with **React 19** islands and **Tailwind CSS v4**. Deployed at root (`/`) at cassa.site while sibling sub-sites (`/courses/ast100`, `/abekta`) are left untouched.

When building or planning any page or section, invoke the `/cassa-create` skill — it is PLANNING-FIRST (plan verified before code is written) and contains authoritative rules, content inventory, and CASSA-specific facts.

## Commands

```bash
npm run dev        # Dev server at :4321 (falls back to :4322)
npm run build      # Static build → dist/
npm run preview    # Serve dist/ locally
npx astro check    # TypeScript validation (build does not type-check)
```

To validate, run `npm run build` only. The user keeps `astro dev` running in a `screen` session and watches it live — do NOT start, restart, or kill the dev/preview server. After a build, ask them to hard-refresh. If a config/markdown-plugin change isn't taking effect, the `.astro/` content cache is stale: `rm -rf .astro dist && npm run build`.

## Architecture

### Two design axioms
1. **Dark by default, light on demand.** The site ships dark; a ThemeToggle island flips `[data-theme="light"]` on `<html>` (persisted to localStorage with an inline head script to prevent flash). Every component must render correctly in both themes.
2. **Immersive pages.** Each major page leads with a 100svh hero and reveals content on scroll. Real CASSA photography and astrophotography only — no AI-generated imagery.

### Page types
- **Bespoke narrative pages** (`src/pages/*.astro`) — Home, About, Research, Teaching, Outreach and their sub-pages are fully designed immersive pages. The IA is broad: People, Research, Teaching, Outreach, Newsroom and Opportunities each have a landing page plus several sub-pages (see `src/data/site-nav.ts` for the authoritative map).
- **Collection-driven routes** — repeating content is sourced from `src/content/` markdown with schema-validated frontmatter, surfaced via `[slug].astro` dynamic routes (`news/`, `events/`, `opportunities/`, `outreach/bangla/`, `outreach/durbin/images/`, `teaching/workshops/`). Most collections are populated; `projects`, `publications` and `gallery` are still scaffold-only (`.gitkeep`).

### Key source directories
| Path | Purpose |
|------|---------|
| `src/layouts/BaseLayout.astro` | HTML shell: theme bootstrap, nav, footer, reveal observer |
| `src/components/immersive/` | Layout kit: `AnimatedHero`, `AnimatedBand`, `ImmersiveHero`, `ImageBand`, `Reveal`, `Prose` |
| `src/components/SkyCanvas.tsx` | Code-generated animated backgrounds (cosmic/lensing/galaxy themes) |
| `src/components/FeatureSlider.tsx` | Home carousel (research/colloquia stories only — no outreach) |
| `src/data/site-nav.ts` | Single source of truth for nav; `live: false` renders "coming soon" |
| `src/content.config.ts` | Zod schemas for all nine collections |
| `src/data/` | Typed single-source data modules (nav, publications pipeline, series, volunteers) |
| `src/styles/global.css` | All design tokens (`@theme`), prose, hero/band, slider, utility classes |
| `knb/` | Content source of truth: WordPress scrape + CASSA Constitution v2.0 digests |

### Navigation
All nav items live in `src/data/site-nav.ts`. Always wrap hrefs with `withBase()` from that file — the base is `/` now, but this keeps a future subpath deploy as a one-line change. Toggle `live: false` to expose a planned nav item as "coming soon" without a dead link.

### Tailwind v4 (CSS-first)
No `tailwind.config.js`. All design tokens are defined in `@theme { }` inside `src/styles/global.css`. The Vite plugin (`@tailwindcss/vite`) is wired in `astro.config.mjs`. **Vite is pinned to 7.3.3** via `package.json` `overrides` — Vite 8/rolldown is incompatible with `@tailwindcss/vite@4.3.0`; do not upgrade it.

### Content collections (`src/content.config.ts`)
Nine collections: `people`, `projects`, `publications`, `news`, `workshops`, `events`, `opportunities`, `gallery`, `astrophotography`.
- **No divisions.** CASSA decided against research divisions (the former OTA/RSS split was removed site-wide on 2026-05-30). There is no `division` field on any collection. Research is presented as five un-grouped **research areas** — CHronOS, GATE, RAIN (radio/cosmology) and Supernova, Transient (time-domain) — on a single `/research` page. CASSA has **two Directors** (Asad and Uddin); Asad is the current Executive Director.
- `tier` (people): Director → Core Member → Associate Member → Graduate Member → Affiliate → Staff → Research Assistant → Research Intern → Undergraduate Research Assistant → Outreach Ambassador → Alumni.
- `status: "published" | "draft"` (default `published`) on every collection — `draft` suppresses the entry from production listings. (Quoted `status: "draft"` evades a `^status:\s*draft` grep.)
- `lang: "en" | "bn"` on news/events/workshops/opportunities — bilingual content must be preserved; EN/BN pairs cross-link via `altSlug`/`altHref`.
- `events.series` (colloquium/journal-talk/workshop/outreach/other) drives rendering: journal-talks use NO hero and render an animated cosmic title card from `paperTitle`.
- `news.durbin: true` cross-lists a non-Durbin-category post into the Durbin Updates feed.

### Markdown rendering pipeline (`astro.config.mjs`)
Content `.md` flows through: **remark-math** (`$…$`/`$$…$$`) → **rehype-mathjax/svg** (renders LaTeX to self-contained SVG, no runtime JS) → **rehypeArticleFigure** (an inline, dependency-free hast walk that wraps `<p><img>`+`<p><em>` shapes into semantic `<figure>` elements and groups 2+ consecutive figures into a responsive `.article-gallery`). Editing these plugins won't re-render unchanged `.md` — clear the stale cache: `rm -rf .astro dist && npm run build`.

### Single-source-of-truth data modules (`src/data/`)
Non-collection structured data lives in typed TS modules, each the sole source for its surface: `site-nav.ts` (nav + IA), `opportunities.ts` (Opportunities categories), `bangla-series.ts` (the four Bengali article series), `durbin-volunteers.ts`, `ads-library.ts` + `journal-metrics.ts` (the `/research/publications` pipeline — a curated ADS-library snapshot + OpenAlex impact metrics; `ADS_API_TOKEN` lives in `.env`).

### Content authority
**CASSA Constitution v2.0** (digested in `knb/constitution/`) governs Research, About, and org content. Where it conflicts with the legacy WordPress scrape, the Constitution wins. Never fabricate facts when the Constitution is silent — surface the gap instead.
