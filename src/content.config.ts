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
    area: z.string().optional(),
    leads: z.array(z.string()).default([]),
    summary: z.string().optional(),
    hero: z.string().optional(),
    links: z.record(z.string(), z.string()).default({}),
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
      venue: z.string().optional(),
      organizer: z.string().optional(),
      series: z.enum(["colloquium", "journal-talk", "workshop", "outreach", "other"]).default("other"),
      category: z.string().optional(),
      link: z.string().optional(),
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
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      object: z.string().optional(),
      catalog: z.string().optional(),
      categories: z.array(z.string()).default([]),
      image: image(),
      imageAlt: z.string().optional(),
      caption: z.string().optional(),
      astrophoto: z
        .object({
          photographer: z.string().optional(),
          location: z.string().optional(),
          date: z.string().optional(),
          exposure: z.string().optional(),
          telescope: z.string().optional(),
          camera: z.string().optional(),
          fov: z.string().optional(),
          processing: z.string().optional(),
          processingMethod: z.string().optional(),
        })
        .default({}),
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
    }),
});

export const collections = { people, projects, publications, news, workshops, events, opportunities, gallery, astrophotography };
