---
name: cassa-astrophoto
description: Add a new astrophotography entry to the CASSA Durbin images gallery (/durbin/images). Creates one markdown file in the `astrophotography` content collection with a co-located WebP image, so the object appears automatically on the gallery grid and gets its own detail page. Invoke when the user types "/cassa-astrophoto ..." or says "add an astrophoto", "add a Durbin image", "new astrophotography entry", "add a photo to the images gallery", or gives an image plus object details to publish. Prompts for the required fields, converts the supplied image to WebP under 400 KB, writes the schema-correct frontmatter, and validates the build. Never deploys.
---

# Add an astrophotography entry

Add one deep-sky / Solar-System object to the CASSA **Durbin images** gallery.
Each entry is a single markdown file in `src/content/astrophotography/` with a
**co-located image**. Placement is entirely collection-driven — the gallery
grid (`src/pages/durbin/images.astro`) and the per-object detail page
(`src/pages/durbin/images/[slug].astro`) both read the `astrophotography`
collection, so a correctly-filed entry appears on both **with no page edits**.

Your whole job is: **gather info → convert the image → write the frontmatter →
validate the build.** Never edit a page to place an entry.

This skill complements `/cassa-post` (news & events) and `/cassa-create`
(page design). Use **this** skill only for adding gallery objects.

---

## How an entry is structured (study before writing)

Read 2–3 existing entries first to match tone and field formatting, e.g.
`src/content/astrophotography/ngc4258.md` (full deep-sky example),
`src/content/astrophotography/ic4725.md`, `src/content/astrophotography/mars.md`
(sparse Solar-System example). The Zod schema is in
`src/content.config.ts` (collection `astrophotography`).

**File layout** — for an object with slug `<slug>`:
- `src/content/astrophotography/<slug>.md` — the entry
- `src/content/astrophotography/<slug>.webp` — the co-located image (this skill
  always converts to `.webp`; the schema also accepts existing `.jpg`/`.png`)

The markdown `image:` field is a **relative path** to the co-located file
(`"./<slug>.webp"`), resolved by Astro's `image()` helper.

### Frontmatter schema

```yaml
---
title: "Messier 106"            # REQUIRED — common name (or catalog id if none)
catalog: "NGC 4258"             # optional — catalog designation, shown as eyebrow
categories: ["Galaxies"]        # REQUIRED — see category rules below
image: "./ngc4258.webp"         # REQUIRED — relative path to co-located image
imageAlt: "Messier 106"         # optional — defaults to title; set for accessibility
caption: "Captured by … , Processed by …"   # optional — hero lede / credit line
astrophoto:                     # all sub-fields optional; omit unknown ones
  photographer: "MD Shahadat Hossain Shahal"
  location: "USA, Nevada (37.978845,-114.856567)"
  date: "2026-05-12"            # optional observation date
  exposure: "120 min."
  telescope: "Takahashi Epsilon 250, 250/850 mm"
  camera: "SBIG ST-10XME"
  fov: "59.8 × 40.3 arcmin (1.64 arcsec)"
  processing: "Iman Sheikh"     # who processed it
  processingMethod: "Stacked in Siril; …"   # \n for multi-line steps
astrophysics:                   # all sub-fields optional; omit unknown ones
  objectType: "Spiral galaxy"
  constellation: "Canes Venatici"
  distance: "23.7 Mly"
  angularSize: "18.6 × 7.2 arcmin"
  physicalSize: "135 Kly"
  magnitude: "8.4"
credit: "MD Shahadat Hossain Shahal"        # optional
essayBn: "…বাংলা…"              # optional Bengali essay (rendered as its own column)
status: "published"             # optional; "draft" hides from production
---

*Markdown body = the English essay.*
```

The markdown **body** below the frontmatter is the **English essay** (rendered
through `Prose`). `essayBn` is the **Bengali essay**. When the user has no
essay, follow the house default the existing entries use:

- Body: `*A detailed essay on <title> is coming soon.*`
- `essayBn: "এই জ্যোতিষ্কের বিস্তারিত বাংলা বিবরণ শীঘ্রই যুক্ত হবে।"`

Only `astrophoto`/`astrophysics` rows that have values are rendered — **omit
unknown fields entirely**, never write empty strings or placeholders like
"N/A".

### Category rules (drives the gallery filter + tag)

`categories` is an array. The gallery derives an object's **type tag** as the
first category that is **not** `"Durbin"` or `"Featured"`. So:

- **Always include exactly one object-type category** from this set (these are
  the gallery's filter chips, in display order):
  `Galaxies`, `Nebulae`, `Globular clusters`, `Stars and systems`,
  `Galaxy groups and clusters`, `Solar System`, `Comets`,
  `Intergalactic medium`.
  If the object doesn't fit any, confirm a new type with the user before
  inventing one (it becomes a new filter chip).
- Optionally prepend `"Durbin"` (object imaged by/through the Durbin programme)
  and/or `"Featured"` — these are **leading tags**, not the displayed type.
  Convention seen in the data: `["Durbin", "Nebulae"]`, `["Comets", "Durbin"]`,
  `["Featured", "Galaxies"]`. Ask the user whether it's a Durbin capture and/or
  should be featured; when unsure, include `"Durbin"` (this is the Durbin
  gallery) and skip `"Featured"`.

### Slug convention

The slug **is the filename** (`entry.id`) and the URL
`/durbin/images/<slug>`. The gallery sorts entries by slug, numerically. Match
the existing style:
- Catalog-based objects → lowercase catalog id, no space: `ngc4258`, `ic4725`,
  `ngc-1501` (hyphen forms exist too — prefer the un-hyphenated `ngc4258`
  style for new NGC/IC entries unless that slug is taken).
- Named bodies → simple name: `mars`, `venus`, `jupiter`.
- Comets → `<designation>-<name>-comet`: `12p-pons-brooks-comet`.
- **Check for collisions** before writing (`ls src/content/astrophotography/`);
  if taken, append `-2` as the existing data does (`ngc1977-2`, `ngc7009-2`).

---

## STEP 1 — Gather the required information

**Division of labour (read first):** every entry renders **two info tables** —
the left **Astrophotographic information** table (observing location, date,
exposure, telescope, camera, field of view, who processed it…) and the right
**Astrophysical information** table (object type, constellation, distance,
angular size, physical size, magnitude). The **left table is the user's to
provide** — it is capture metadata only the photographer knows, so you must
never invent or guess it. The **right table is yours to generate** from
well-known catalog data for the identified object (the user then corrects it).
An entry that ships with only a `photographer` row in the left table is
**incomplete** — that is the exact bug to avoid.

**Always ask the user for the source markdown/text file.** The normal way the
user supplies the left-table data is by handing you a **markdown (or plain-text)
file** containing the astrophotographic details — possibly loosely formatted,
mislabelled, or with the fields in a different order. Your job is to **read that
file, restructure its content into the schema-correct frontmatter**, and save
the result as a clean entry in the canonical format of an existing entry such as
`src/content/astrophotography/ic-1848.md`. So before writing anything:

- If the user has not already provided it, **ask them for the markdown/text file
  (or pasted block) with the astrophotographic information** for this object.
- Parse whatever they give you and map each value onto the `astrophoto`
  sub-fields below; omit any the file doesn't contain (never write empty rows).
- Then generate the `astrophysics` table yourself and let the user verify it.

You need, at minimum: an **image** (path or URL) and a **title**. But the
**Astrophotographic information table is the heart of every entry** — the
existing pages all show the photographer + capture-device details, so you must
**always obtain that whole block from the user**; never silently fall back to
house defaults for it. Ask for what's missing in **one** consolidated prompt;
don't interrogate field-by-field. Group the ask as:

1. **Image** — local path or URL to the source photo. *(required)*
2. **Identity** — title/common name, catalog id (if any), object type →
   category. *(title + category required)*
3. **Astrophotographic info (FIRST TABLE — always ask)** — explicitly prompt the
   user for **every** one of these fields, listing them so they can fill in what
   they know: **photographer**, **observing location**, **observation date**,
   **exposure**, **telescope**, **camera**, **field of view**,
   **image processing (who)**, **processing method**. The user may leave any
   blank (you then omit that row), but you must *present the full list and ask* —
   do not skip the table or guess device values.
4. **Astrophysical info** *(optional)* — object type, constellation, distance,
   angular size, physical size, apparent magnitude. (You may pre-fill these from
   well-known catalog data for the identified object, then let the user correct.)
5. **Flags** *(optional)* — Durbin capture? Featured? draft vs published?
   English essay / Bengali essay text (else house defaults are used).

If the user already supplied a markdown/text file or a pasted block of details
(e.g. capture metadata), **restructure it** into the schema and only re-ask
about genuine gaps in the first table. Derive the slug yourself from the catalog
id / name per the convention above and state it back.

**How to prompt:** if no source file/details have been given yet, **ask the user
to provide the markdown (or text) file with the astrophotographic information**
— that is the expected input. For required identity facts (title, object-type
category) use `AskUserQuestion`. For the **first-table fields**, if the user
prefers to type them, present the full labelled list (as in item 3) in a plain
message and let them paste their answers in one block — these are free-text
values, so an open prompt captures them better than fixed options. Wait for the
user's reply before writing the entry; do not proceed to STEP 3 with an empty
Astrophotographic table. Only the astrophysical rows and the essays may fall
back to defaults / your own generation without asking.

---

## STEP 1.5 — Does this object already exist? (ask: replace or slider)

**Before converting or writing anything, check whether the gallery already has
an entry for this object.** The same object can already exist under a different
slug (e.g. the Horsehead Nebula lives at `ngc2023`, not `horsehead`), so don't
rely on the filename alone. Search the collection by likely names/catalog ids:

```bash
ls src/content/astrophotography/ | grep -iE "<name>|<catalog>|<aliases>"
grep -ril "<common name>" src/content/astrophotography/   # match by title too
```

**If a matching entry already exists, STOP and ask the user** (use
`AskUserQuestion`) which they want:

1. **Replace** — overwrite the existing entry's image + capture details with the
   new one (use when the new image supersedes the old).
2. **Add as a slider slide** — keep the existing image and append the new one as
   an additional capture, so the detail page shows a **slider** (one slide per
   photographer, each crediting who captured/processed it). Use when both images
   are worth keeping — typically the **same object shot by different people**.

Do not guess — wait for the answer. Only proceed to a fresh new entry (STEP 2)
when no existing entry matches.

**If they choose slider, ask one follow-up** (also `AskUserQuestion`): should the
**new image be the leading (primary) image** for this entry? The primary image is
the one shown **first** when the entry opens **and** the **gallery thumbnail**, so
this is a real editorial choice — don't assume.

- **New image leads** → make it the primary (`image` + top-level `astrophoto` +
  `caption`/`credit`), and demote the previously-primary capture into the
  `slides` array as slide 2.
- **Keep existing leading** → leave the primary as-is and just append the new
  image to `slides`.

### Adding a slider slide (the "Add" path)

A slider is **collection-driven, no new gallery tile**: you append to the
**existing** entry's `slides` array — you do **not** create a second `.md`. The
detail page renders a slider whenever `slides` is non-empty (primary `image`
first, then each `slides[]` entry), and the **Astrophotographic table swaps to
match the active slide** so every photographer's capture details stay correct.
The shared **Astrophysical** (object) facts are not repeated per slide. The
**order of appearance is the order in the file** — primary first, then `slides`
top-to-bottom — so "which image leads" is decided by *what you put in `image`*,
not by the slide order.

Steps for the Add path:

1. Convert the new image to a **co-located** webp with a non-colliding slug-like
   name, conventionally `<existing-slug>-2.webp` (`-3`, … for further slides) —
   see STEP 2, but write it next to the existing entry, e.g.
   `src/content/astrophotography/ngc2023-2.webp`.
2. Append a slide to the **existing** entry's frontmatter (create the `slides:`
   key if absent). Each slide carries its own image, credit (the photographer's
   name shown on the slide), and its **own** `astrophoto` capture block — built
   from the user's source md exactly as the first table is (STEP 1 rules apply
   per slide; never invent capture values):

   ```yaml
   slides:
     - image: "./ngc2023-2.webp"
       alt: "Horsehead & Flame Nebula, captured by Md Shahadat Hossain Shahal"
       credit: "Md Shahadat Hossain Shahal"   # name shown on the slide
       astrophoto:
         photographer: "Md Shahadat Hossain Shahal"
         location: "USA, Utah (39.422519, -111.714358)"
         exposure: "16 min (8 × 120 s)"
         telescope: "Celestron RASA 11\" (iTelescope — T68), 279 / 620 mm"
         camera: "ZWO ASI071 MC"
         fov: "2.22° × 1.46° (≈ 1.6″/pixel)"
         processing: "Md Shahadat Hossain Shahal"
   ```

3. Order per the leading-image answer above:
   - **Keep existing leading** → leave the primary `image`/`astrophoto`/`caption`/
     `credit` untouched; the appended slide is the new capture.
   - **New image leads** → move the new image into the top-level
     `image`/`astrophoto`/`caption`/`credit`, and move the *old* primary's image +
     capture block down into `slides` (it becomes slide 2). When the new leading
     capture came with its own object data, it's fine to refresh the shared
     `astrophysics` to match it — but flag that change to the user.
   Either way the essays (body + `essayBn`) stay as they are.
4. Validate with `npm run build` (STEP 4). The page count should **not** rise
   (no new entry — just a richer existing one).

The slider, its arrows/dots/autoplay, and the table-swap are all already wired
in `ImmersiveHeroSlider.astro` + `durbin/images/[slug].astro`; you only edit
content. The schema for `slides` is in `src/content.config.ts`.

---

## STEP 2 — Convert the image to WebP under 400 KB

Every entry ships a `.webp` co-located at `src/content/astrophotography/<slug>.webp`,
kept **≤ 400 KB**. Use the bundled converter (it uses the project's `sharp` —
no system `cwebp`/ImageMagick needed):

```bash
# If the source is a URL, download it first:
#   curl -fsSL "<url>" -o /tmp/astrophoto-src
node .claude/skills/cassa-astrophoto/to-webp.mjs \
  "<source-image>" \
  "src/content/astrophotography/<slug>.webp" \
  400
```

The converter searches for the **highest WebP quality that fits 400 KB** at full
resolution; only if even low quality overflows does it progressively downscale,
then re-search quality. It honours EXIF orientation and prints the final size,
quality, and dimensions. Confirm the printed size is `≤ 400 KB`; if it warns it
could not reach the target (extreme input), tell the user rather than shipping
an oversized file.

The target KB is the 3rd argument — only change it from `400` if the user asks.

---

## STEP 3 — Write the entry

Write `src/content/astrophotography/<slug>.md` with:
- The frontmatter filled per the schema above — **omit every unknown optional
  field** (no empty strings).
- `image: "./<slug>.webp"` pointing at the file you just created.
- The English essay as the body (or the house "coming soon" default).
- `essayBn` (or the house Bengali default) so the BN column renders.

Match YAML quoting style of existing entries: double-quote string values;
multi-line `processingMethod` uses literal `\n` inside a quoted scalar (see
`ngc4258.md`).

---

## STEP 4 — Validate

```bash
npm run build
```

The build type-checks the collection against the Zod schema and resolves the
co-located image — a wrong path, a missing image, or a schema violation fails
here. Do **not** start/restart the dev server (the user runs `astro dev` in a
`screen` session). If the build passes, tell the user the entry is live at
`/durbin/images/<slug>` and ask them to hard-refresh.

If a markdown/plugin change doesn't show up, the `.astro/` cache may be stale:
`rm -rf .astro dist && npm run build`.

---

## Checklist

- [ ] **Checked whether the object already exists** (by name/catalog/alias, not
      just slug); if it did, asked the user **replace vs. slider** before writing
- [ ] Image converted to `src/content/astrophotography/<slug>.webp`, ≤ 400 KB
      (slider slide → `<existing-slug>-2.webp`, appended to the existing entry,
      no new `.md`)
- [ ] Slug follows convention and doesn't collide with an existing file
- [ ] `categories` has exactly one object-type category (+ optional Durbin/Featured)
- [ ] **Left (Astrophotographic) table came from the user** — more than just a
      `photographer` row (location / date / exposure / telescope / camera / FOV
      as the user supplied them); never invented
- [ ] Right (Astrophysical) table generated and verified with the user
- [ ] `image:` is the relative `./<slug>.webp` path
- [ ] Unknown optional fields omitted (no empty strings / "N/A")
- [ ] EN body + `essayBn` present (real text or house defaults)
- [ ] `npm run build` passes
