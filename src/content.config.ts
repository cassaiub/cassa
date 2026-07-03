/* Content collections — the architecture for repeating content. A markdown
   file carries structured frontmatter and is filed automatically into the
   right collection/route. Most collections are SCAFFOLD for now (schemas
   defined; entries ported in later phases). Home + Research are bespoke
   pages and don't depend on these yet. */

import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const people = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/people" }),
  schema: z.object({
    name: z.string(),
    title: z.string().optional(),
    tier: z.enum([
      "Director", "Core Member", "Associate Member", "Graduate Member",
      "Affiliate", "Staff", "Research Assistant", "Research Intern", "Undergraduate Research Assistant", "Outreach Ambassador", "Alumni",
    ]),
    interests: z.array(z.string()).default([]),
    // Core-Member discipline. Set on anyone shown on /people/core-members —
    // including the current holder of the Office of the Director (Asad), which is
    // how one person appears on BOTH the Office of the Director and Core Members pages.
    // ("Director" stays a valid tier for the office but is not a public label.)
    cmArea: z.enum(["A&A", "Theoretical Physics", "Engineering"]).optional(),
    institution: z.string().optional(),
    // Immersive PersonCard rows (directors + members): `education` = PhD &
    // postdoc institutes + countries; `research` = a concise, student-facing
    // description of their research areas. Both optional — cards omit the row
    // when absent, so non-member tiers are unaffected.
    education: z.string().optional(),
    research: z.string().optional(),
    email: z.string().optional(),
    links: z.record(z.string(), z.string()).default({}),
    photo: z.string().optional(),
    duration: z.string().optional(),
    order: z.number().default(100),
    // Match aids for the publications page's ADS-author → person matcher
    // (both optional; the matcher falls back to surname + given-initial logic).
    orcid: z.string().optional(),
    ads: z.array(z.string()).default([]), // explicit ADS author-name forms, e.g. "Asad, K. M. B."
    status: z.enum(["published", "draft"]).default("published"),
  }),
});

const projects = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/projects" }),
  schema: z.object({
    title: z.string(),
    acronym: z.string().optional(),
    // The supervisor a project is grouped under on /research/projects. The
    // landing page's filter bar shows one chip per distinct `supervisor` SURNAME
    // (last token, alphabetical); the card/detail rail show the full name.
    // Distinct from `leads` (the project's lead student/person).
    supervisor: z.string().optional(),
    // Additional supervisors DISPLAYED alongside `supervisor` (card + detail rail)
    // but NOT surfaced as their own filter chip — the project still groups under
    // `supervisor`. e.g. START groups under Asad but also credits Tim Molteno.
    coSupervisors: z.array(z.string()).default([]),
    // Lifecycle stage — drives the Ongoing/Completed badge and the "by status"
    // grouping on /research/projects. Separate from `status` (published/draft).
    stage: z.enum(["ongoing", "completed"]).default("ongoing"),
    // Sidebar timeline. Free-form strings so precision can vary ("2024", "Nov 2025",
    // "17 Nov 2025"). endDate is omitted for ongoing projects (renders "– present").
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    leads: z.array(z.string()).default([]), // lead student(s)/person
    mentors: z.array(z.string()).default([]), // advisory mentor(s), distinct from supervisor
    team: z.array(z.string()).default([]), // other current members
    alumni: z.array(z.string()).default([]), // past members
    // Legacy research-area tag. No longer drives grouping/filter (regrouped by
    // supervisor 2026-07-03); kept optional so old frontmatter still validates.
    area: z.string().optional(),
    summary: z.string().optional(),
    hero: z.string().optional(),
    links: z.record(z.string(), z.string()).default({}),
    order: z.number().default(0),
    status: z.enum(["published", "draft"]).default("published"),
  }),
});

const publications = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/publications" }),
  schema: z.object({
    title: z.string(),
    authors: z.array(z.string()).default([]),
    year: z.number().optional(),
    venue: z.string().optional(),
    doi: z.string().optional(),
    link: z.string().optional(),
  }),
});

const news = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/news" }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      date: z.coerce.date(),
      category: z.string().optional(),
      // Opt-in cross-listing into the Durbin Updates feed for posts whose primary
      // `category` is NOT "Durbin" (e.g. an Outreach post Durbin co-hosted). A
      // bare `category: "Durbin"` post is in that feed automatically; this flag
      // adds non-Durbin-category posts without pulling the whole category in.
      durbin: z.boolean().default(false),
      // Feature image = the best image within the post; rendered as an optimized
      // thumbnail in the /news and /durbin/updates list views.
      hero: image().optional(),
      heroAlt: z.string().optional(),
      // Optional visible caption rendered under the hero figure on the detail
      // page (e.g. a figure credit/explanation when the hero is a paper plot).
      heroCaption: z.string().optional(),
      summary: z.string().optional(),
      featured: z.boolean().default(false),
      theme: z.enum(["cosmic", "lensing", "galaxy"]).optional(),
      author: z.string().optional(),
      authorHref: z.string().optional(),
      lang: z.enum(["en", "bn"]).default("en"),
      status: z.enum(["published", "draft"]).default("published"),
    }),
});

const workshops = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/workshops" }),
  schema: z.object({
    title: z.string(),
    lang: z.enum(["en", "bn"]).default("en"),
    altSlug: z.string().optional(), // slug of the other-language version
    workshop: z.number().optional(),
    date: z.coerce.date().optional(),
    summary: z.string().optional(),
    author: z.string().optional(),
    status: z.enum(["published", "draft"]).default("published"),
  }),
});

const events = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/events" }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      start: z.coerce.date(),
      end: z.coerce.date().optional(),
      allDay: z.boolean().default(false),
      // Multi-day event with the SAME daily window. start/end times are the
      // per-day window (e.g. 3–6 PM) repeated across the start..end date span,
      // NOT one continuous run. Renders "3:00 pm – 6:00 pm daily" on the detail page.
      daily: z.boolean().default(false),
      // Free-text override for the detail-page time line. Use for multi-day events
      // whose per-day windows differ (e.g. "Day 1: 10 am–1 pm · Day 2: 10 am–4 pm"),
      // which neither `daily` nor a start–end span can express. When set, the date
      // renders as a full range and this string replaces the computed time.
      timeNote: z.string().optional(),
      venue: z.string().optional(),
      organizer: z.string().optional(),
      series: z.enum(["colloquium", "journal-talk", "workshop", "outreach", "other"]).default("other"),
      category: z.string().optional(),
      // Cross-list a non-"Durbin"-category event into the Durbin Updates feed
      // (mirrors news.durbin). A bare category:"Durbin" event is included anyway.
      durbin: z.boolean().default(false),
      // Cross-list an event onto the /bdoaa page's events list (mirrors `durbin`).
      // A bare category:"BDOAA" event is included there anyway.
      bdoaa: z.boolean().default(false),
      link: z.string().optional(),
      // Registration URL — external (e.g. a Google Form) or an internal path.
      // Rendered as a "Register" button in the sidebar (under the meta card) and
      // at the foot of the detail page; do NOT also put it inline in the body.
      register: z.string().optional(),
      summary: z.string().optional(),
      // Featured image (downloaded from cassa.bd): hero on the detail page,
      // thumbnail in the listing + calendar. Resolved to ImageMetadata via image().
      // Journal talks use NO hero image — they render an animated cosmic title
      // card from `paperTitle` (the paper) + the citation in `title` instead.
      hero: image().optional(),
      heroAlt: z.string().optional(),
      paperTitle: z.string().optional(),
      lang: z.enum(["en", "bn"]).default("en"),
      status: z.enum(["published", "draft"]).default("published"),
      // Site-wide RSVP opt-in. `true` → default fields; an object selects which
      // fields to collect (name is always included) plus an optional deadline/intro.
      // Absent → no RSVP form. One backend serves every event; see src/data/rsvp.ts.
      rsvp: z
        .union([
          z.boolean(),
          z.object({
            fields: z.array(z.enum(["email", "phone", "affiliation", "studentId", "guests", "notes"])).optional(),
            deadline: z.coerce.date().optional(),
            intro: z.string().optional(),
            capacity: z.number().int().positive().optional(),
          }),
        ])
        .optional(),
    }),
});

// Opportunities — job circulars, internships and volunteer calls. Open vs.
// closed is derived from `deadline` (>= now ⇒ open) unless `outcome` is set
// (a position filled before its deadline). Moved here OUT of the news feed.
const opportunities = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/opportunities" }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(), // posted
    deadline: z.coerce.date().optional(), // application deadline; omit ⇒ rolling/open
    kind: z.enum(["job", "internship", "volunteer"]).default("job"),
    role: z.string().optional(),
    compensation: z.string().optional(),
    applyUrl: z.string().optional(),
    hero: z.string().optional(),
    summary: z.string().optional(),
    outcome: z.enum(["filled", "closed"]).optional(), // explicit close before deadline
    // Eligible for the home hero carousel (mirrors news.featured). A flagged
    // vacancy is merged with featured news, newest-first, capped at 3 slides.
    featured: z.boolean().default(false),
    theme: z.enum(["cosmic", "lensing", "galaxy"]).optional(), // SkyCanvas backdrop when featured
    lang: z.enum(["en", "bn"]).default("en"),
    status: z.enum(["published", "draft"]).default("published"),
  }),
});

const gallery = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/gallery" }),
  schema: z.object({
    title: z.string(),
    object: z.string().optional(),
    image: z.string(),
    category: z.string().optional(),
    instrument: z.string().optional(),
    exposure: z.string().optional(),
    credit: z.string().optional(),
  }),
});

// Astrophotography — one object per entry, with a fullscreen photo, the two
// legacy info tables, and EN (body) / BN (essayBn) essays. The image() helper
// resolves the co-located photo to an optimizable ImageMetadata for <Image>.
const astrophotography = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/astrophotography" }),
  schema: ({ image }) => {
    // The Astrophotographic ("how it was captured") block — reused by the
    // primary capture and by each additional slider slide, so a multi-author
    // entry keeps every contributor's distinct capture details.
    const astrophotoFields = z.object({
      photographer: z.string().optional(),
      location: z.string().optional(),
      date: z.string().optional(),
      exposure: z.string().optional(),
      telescope: z.string().optional(),
      camera: z.string().optional(),
      fov: z.string().optional(),
      processing: z.string().optional(),
      processingMethod: z.string().optional(),
    });
    return z.object({
      title: z.string(),
      object: z.string().optional(),
      catalog: z.string().optional(),
      categories: z.array(z.string()).default([]),
      image: image(),
      imageAlt: z.string().optional(),
      caption: z.string().optional(),
      astrophoto: astrophotoFields.default({}),
      // Additional captures of the SAME object by other photographers. When
      // present, the detail page renders a slider (primary image first, then
      // these) and swaps the Astrophotographic table to match the active slide.
      // The object facts (astrophysics) are shared across all slides.
      slides: z
        .array(
          z.object({
            image: image(),
            alt: z.string().optional(),
            credit: z.string().optional(),
            astrophoto: astrophotoFields.default({}),
          }),
        )
        .optional(),
      astrophysics: z
        .object({
          objectType: z.string().optional(),
          constellation: z.string().optional(),
          distance: z.string().optional(),
          angularSize: z.string().optional(),
          physicalSize: z.string().optional(),
          magnitude: z.string().optional(),
        })
        .default({}),
      credit: z.string().optional(),
      essayBn: z.string().optional(),
      status: z.enum(["published", "draft"]).default("published"),
    });
  },
});

export const collections = { people, projects, publications, news, workshops, events, opportunities, gallery, astrophotography };
