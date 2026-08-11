// Single source of truth for SEO/structured-data constants.
// JSON-LD schema builders return plain objects; <JsonLd> serializes them.

export const SITE = {
  name: "CASSA",
  legalName: "Center for Astronomy, Space Science and Astrophysics",
  url: "https://cassa.bd",
  // Default social-share image (1200×630, real CASSA logo on the brand dark bg).
  ogImage: "/og/cassa-default.png",
  locale: "en_US",
  localeBn: "bn_BD",
  // Verified CASSA social profiles (from knb/). The YouTube channel found in the
  // scrape is NOT included — it could not be confirmed as CASSA's (flagging, not
  // fabricating). Add it here once confirmed.
  // Durbin's page was dropped here on 2026-08-11: Durbin is its own site
  // (durbin.cc) and claims that profile in its own structured data.
  sameAs: [
    "https://facebook.com/cassa.iub",
  ],
} as const;

/** Absolute URL helper — joins a path/asset src onto the canonical origin. */
export const absoluteUrl = (pathOrSrc: string): string =>
  new URL(pathOrSrc, SITE.url).href;

/** Organization schema — emitted site-wide from BaseLayout. */
export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "ResearchOrganization",
    name: SITE.legalName,
    alternateName: SITE.name,
    url: SITE.url,
    logo: absoluteUrl("/brand/CASSA-Logo_Color.svg"),
    foundingDate: "2025-08-14",
    parentOrganization: {
      "@type": "CollegeOrUniversity",
      name: "Independent University, Bangladesh",
      url: "https://iub.ac.bd/",
    },
    description:
      "An autonomous, multidisciplinary research center of Independent University, Bangladesh, pursuing astronomy, astrophysics and space science through research, teaching and outreach.",
    sameAs: SITE.sameAs,
  };
}

/** WebSite schema — enables the site name in search results. */
export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE.legalName,
    alternateName: SITE.name,
    url: SITE.url,
  };
}

interface ArticleInput {
  title: string;
  description?: string;
  url: string; // absolute
  image?: string; // absolute
  datePublished?: Date;
  dateModified?: Date;
  authorName?: string;
}
/** Article schema — for news posts. */
export function articleSchema(a: ArticleInput) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: a.title,
    ...(a.description ? { description: a.description } : {}),
    mainEntityOfPage: a.url,
    ...(a.image ? { image: [a.image] } : {}),
    ...(a.datePublished ? { datePublished: a.datePublished.toISOString() } : {}),
    ...(a.dateModified ? { dateModified: a.dateModified.toISOString() } : {}),
    author: a.authorName
      ? { "@type": "Person", name: a.authorName }
      : { "@type": "Organization", name: SITE.legalName },
    publisher: {
      "@type": "Organization",
      name: SITE.legalName,
      logo: { "@type": "ImageObject", url: absoluteUrl("/brand/CASSA-Logo_Color.svg") },
    },
  };
}

interface EventInput {
  title: string;
  description?: string;
  url: string; // absolute
  image?: string; // absolute
  start?: Date;
  end?: Date;
  venue?: string;
  online?: boolean;
}
/** Event schema — for events/colloquia/workshops. */
export function eventSchema(e: EventInput) {
  return {
    "@context": "https://schema.org",
    "@type": "Event",
    name: e.title,
    ...(e.description ? { description: e.description } : {}),
    url: e.url,
    ...(e.image ? { image: [e.image] } : {}),
    ...(e.start ? { startDate: e.start.toISOString() } : {}),
    ...(e.end ? { endDate: e.end.toISOString() } : {}),
    eventAttendanceMode: e.online
      ? "https://schema.org/OnlineEventAttendanceMode"
      : "https://schema.org/OfflineEventAttendanceMode",
    location: e.online
      ? { "@type": "VirtualLocation", url: e.url }
      : { "@type": "Place", name: e.venue || "Independent University, Bangladesh" },
    organizer: { "@type": "Organization", name: SITE.legalName, url: SITE.url },
  };
}

interface PersonInput {
  name: string;
  url: string; // absolute
  image?: string; // absolute
  jobTitle?: string;
  description?: string;
}
/** Person schema — for /people/<slug> profiles. */
export function personSchema(p: PersonInput) {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: p.name,
    url: p.url,
    ...(p.image ? { image: p.image } : {}),
    ...(p.jobTitle ? { jobTitle: p.jobTitle } : {}),
    ...(p.description ? { description: p.description } : {}),
    worksFor: { "@type": "Organization", name: SITE.legalName, url: SITE.url },
  };
}
