# Content inventory — what's in `knb/`

Reference for the **cassa-create** skill. Read this to find which source feeds the page/section you're building.

| Source | Path |
|---|---|
| **Latest authoritative legacy content — full WordPress XML export (1554 items)** | `knb/cassa.WordPress.2026-05-28.xml` |
| Constitution → Research page spec (cite clauses) | `knb/constitution/research-spec.md` |
| Constitution → org structure, governance, membership, media | `knb/constitution/org-summary.md` |
| People roster (members/staff/affiliates/RAs) | `knb/people/roster.md` |
| Outreach (Durbin, BDOAA, safeguarding) | `knb/outreach/summary.md` |
| Legacy pages (40) — quick wording reference (**LOSSY**: Avia pages keep only headings; use the XML for full text) | `knb/wordpress/pages/<slug>.md` |
| Legacy nav + sitemap | `knb/wordpress/_nav.md`, `knb/wordpress/_sitemap.md` |
| Portfolio (141: ~110 astrophoto + research projects + teaching tracks) | `knb/wordpress/portfolio/` (+ `_index.md`) |
| Posts (80) + events (63) + venues/organizers + taxonomy | `knb/wordpress/posts/`, `knb/wordpress/events/`, `knb/wordpress/_taxonomy.md` |
| Media catalog (1,114) + hero candidates + download script | `knb/wordpress/media/manifest.json`, `_summary.md`, `download.sh` |
| Constitution media (organogram, logos, header) | `/home/asad/Dropbox/Claude/IUB/CASSA/Constitution/media/` |

The **`knb/cassa.WordPress.2026-05-28.xml`** export is the authoritative, latest
dump of the legacy site; the `knb/wordpress/*.md` files are a convenience scrape
of it and are **lossy for Avia-built pages** — parse the XML (`content:encoded`,
strip `[av_…]` shortcodes) when you need full body text. Media binaries are
**not** downloaded yet — `knb/wordpress/media/download.sh` mirrors them when
needed (deferred). Note the mime data was derived from file extensions (the
export omitted `wp:post_mime_type`).

**Authoritative source-of-record (beyond `knb/`):**
`/home/asad/Dropbox/Claude/IUB/CASSA/` holds the canonical CASSA documents and
is more authoritative than the legacy site. Only `Constitution/` is digested
into `knb/` so far — read the rest directly when building the relevant page:
- `Constitution/` (+ `versions/`: v2.0.0, v2.0.1, diff, foundational 2025-08-14) — already in `knb/`.
- `People/Members/` — per-member PDFs (ahad, ahmed, akib, ananna, bahauddin, karim, saikia, shajib, tanvir) → **the People page**.
- `Approval/` — BOT · AC/Syndicate · VC founding approvals → About / history.
- `Proposals/` — founding detailed proposal + observatory & budget/construction → About / infrastructure.
- `Agreements/` — MoUs/LoAs (empty for now).
- `CASSA Logo_All Versions/` — official logo set (the name-free wordmark is already in `public/brand/`).
