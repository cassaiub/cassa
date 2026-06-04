# What's built so far (gold-standard files)

Reference for the **cassa-create** skill. Read this to find the existing gold-standard file to match when adding or extending a page. (For the publications page specifically, see `publications.md`.)

The foundation and most top-level pages now exist — match their conventions when adding more.

| Thing | Path |
|---|---|
| HTML shell (theme bootstrap, nav, footer, reveal observer) | `src/layouts/BaseLayout.astro` |
| Design tokens (dark default + `[data-theme=light]`), prose, hero/band, slider, nav; `--font-sans` ends with `Noto Serif Bengali` (Bangla glyphs only — see rule 20) | `src/styles/global.css` |
| Nav registry + `withBase()` + IA — flat links, **dropdowns** (`children`) and a 2-col **megamenu** (`groups`) | `src/data/site-nav.ts` · rendered by `src/components/SiteNav.astro` |
| Content-collection schemas (7 defined: people, astrophotography, news, events, projects, publications, gallery) | `src/content.config.ts` |
| **Home** — `FeatureSlider` hero + three missions + SITO band + research teaser | `src/pages/index.astro` |
| **About** — `AnimatedHero` (cosmic) + identity + founding-doc PDF cards + scroll-filled genesis timeline + emails/Google-map contact | `src/pages/about.astro` |
| **Research** (gold standard) — `AnimatedHero` + five un-grouped research areas (no divisions) + infra/roadmap | `src/pages/research.astro` |
| **Research sub-pages** — Publications (live NASA-ADS feed), IUB Observatory, IUB CORE, Timaeus HPC, STAR Telescope (OTA/RSS division pages deleted 2026-05-30) | `src/pages/research/{publications,observatory,core,hpc,star}.astro` |
| **People** directory (sortable table, grouped by tier, last-name sort) + 7 sub-pages + `PersonCard` (3-col grids) | `src/pages/people/*.astro` · `src/components/PersonCard.astro` |
| **Person profile pages** — ONE generic dynamic route renders a rich profile for any registered person (see "Person profile pages" in SKILL.md). Only people in the registry get a page; today only **asad**. Card + table link to a person only when `hasProfile(slug)`. | `src/pages/people/[slug]/index.astro` · `src/data/people/profiles.ts` (registry) · `src/data/people/<slug>.ts` (per-person extras) · bio = the `.md` body |
| **People content** — ~33 entries populated from the XML/roster; photos in `public/people/` (sourced from each person's live `av_team_member` image) | `src/content/people/*.md` |
| **Teaching** + **Minor in A&A** (two tracks: A&A, SPS; per-course Abekta links) | `src/pages/teaching.astro` · `src/pages/teaching/minor.astro` |
| **Outreach** landing — Durbin + **BDOAA** (BDOAA is a section, not a separate page) + Bengali-writing intro | `src/pages/outreach.astro` |
| **Outreach · Durbin** sub-pages — astrophotography Gallery (`images`, sorted by entry slug w/ numeric `localeCompare`) + per-object detail, Manual, Volunteers (`durbin-volunteers.ts`), Updates | `src/pages/outreach/durbin/{images,images/[slug],manual,volunteers,updates}.astro` · `src/data/durbin-volunteers.ts` |
| **Outreach · In Bangla** — the four Bengali article series (নতুন কথা / দূরের কথা / সহজ কথা / ক্লাসিকেল কথা) index + detail; series registry | `src/pages/outreach/bangla.astro` · `bangla/[slug].astro` · `src/data/bangla-series.ts` |
| **News** + **Events** — listing + detail (events incl. a calendar view) | `src/pages/{news,events}.astro` · `{news,events}/[slug].astro` |
| **`astrophotography`** collection — **115** deep-sky entries feeding the Durbin Gallery (categories, instrument, exposure); **image assets are co-located** in the collection dir (`.jpg/.png/.webp`), imported via `astro:assets` | `src/content/astrophotography/*` |
| Interactive islands — animated backgrounds · home carousel · theme toggle · events calendar | `src/components/{SkyCanvas,FeatureSlider,ThemeToggle,EventsCalendar}.tsx` |
| Immersive kit | `src/components/immersive/{AnimatedHero,AnimatedBand,ImmersiveHero,ImageBand,Reveal,Prose}.astro` |
| Brand logo (name-free wordmark) | `public/brand/CASSA-Logo_{White,Color}.svg` (sources: `knb/media/CASSA logo_without full name/`) |
| Founding-document PDFs (local copies, linked from About) | `public/docs/CASSA_Detailed_Proposal.pdf` · `public/docs/CASSA_Constitution_v2.0.pdf` |

**Nav patterns:** **People** = dropdown of its sub-pages · **Teaching** = dropdown (Minor in A&A + external `Abekta ↗`) · **Research** = 2-col **megamenu** (Research: Overview / Publications · Facilities: IUB Observatory / IUB CORE / Timaeus HPC / STAR Telescope) · **Outreach** = 2-col **megamenu** (Durbin: Astrophotographic Images / Manual / Volunteers / Updates · In Bangla: the four series anchors). **All top-level items are now `live: true`** (Home, About, People, Research, Teaching, Outreach, News, Events).

**Still to build:** the `projects` collection's listing/detail pages (the schema exists; pages don't yet), publications-as-collection if it ever replaces the live ADS feed, and any further content population. Outreach (Durbin + BDOAA + In-Bangla), News, Events, and the astrophotography Gallery are now built.

**Empty/placeholder collections (schemas only, no entries — just `.gitkeep`):** `projects`, `publications`, `gallery`. **`gallery` is vestigial** — the Durbin astrophotography lives in the **`astrophotography`** collection, not `gallery`; don't author images into `gallery` or wire a second gallery without checking with the user first.

**Brand:** the menubar shows the **name-free wordmark** — white over the hero /
dark theme, full-color only when the LIGHT-theme bar turns solid on scroll.
Larger over the hero (48px), shrinks (30px) on scroll. No text "CASSA", no
tagline lockup on the page.
