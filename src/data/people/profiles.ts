/* Person-profile registry — the single source of truth for which people get a
 * detail page at /people/<slug> and what rich content it shows.
 *
 * A person gets a profile page IFF they are registered in PROFILES below. To add
 * a future person:
 *   1. ensure their collection entry exists at src/content/people/<slug>.md
 *      (its markdown BODY is the biography, rendered on the page);
 *   2. create src/data/people/<slug>.ts exporting a ProfileData object;
 *   3. import + add it to PROFILES here.
 * The /people directory + the Office of the Director page link to a person
 * automatically once hasProfile(slug) is true; everyone else stays card/table-only.
 *
 * Assets convention: downloads (PDFs) live in public/people/<slug>/…,
 * optimizable images in src/assets/people/<slug>/…, the card photo at
 * /people/<slug>.webp. Publications data: src/data/<slug>/publications.ts
 * (a frozen ADS ∪ Scholar snapshot — Scholar is optional, ADS-only is fine). */

import type { Pub } from "../asad/publications.ts";
import { asad } from "./asad.ts";
import { uddin } from "./uddin.ts";

/** A clickable single-column table row (research programs · teaching & outreach). */
export type LinkRow = { title: string; desc: string; href: string };

/** Work & education timeline. `org` mixes plain connector strings with linked
 *  {name,url} tokens so each institution name links out individually. */
export type OrgPart = string | { name: string; url: string };
export type Stint = {
  years: string;
  role: string;
  org: OrgPart[];
  place?: string;
  thesisTitle?: string;
  thesisUrl?: string;
  supervisor?: string;
};
export type WorkGroup = { group: string; rows: Stint[] };

/** Per-person publications block (frozen snapshot). Labels are person-specific. */
export type Publications = {
  shareLabel: string;       // e.g. "Asad share" — the per-person credit column
  personShort: string;      // e.g. "Asad" — used in the footnote prose
  scholarUrl: string;
  adsAuthorUrl: string;
  scholarTotalCites: number;
  scholarHIndex: number;
  scholarI10Index?: number;
  /* Google Scholar "Cited by" histogram: citations received per calendar year. */
  citesByYear?: Record<number, number>;
  since?: { year: number; cites: number; hIndex: number; i10Index: number };
  snapshot: string;
  papers: Pub[];
};

/** Teaching record (from a Google Classroom export). A `TCourse` is a UNIQUE
 *  course; `offerings` is each section run (term, year, section, student count,
 *  room). `coListed` = other codes sharing the same full name (cross-listed).
 *  NO grades are stored. The teaching page derives charts + totals from this. */
export type TOffering = { term: string; year: number; section: string; students: number; room: string };
export type CoListed = { code: string; since?: string };
export type TCourse = { code: string; name: string; coListed: CoListed[]; offerings: TOffering[] };
export type Teaching = { intro?: string; snapshot?: string; courses: TCourse[] };

/** Everything the generic /people/[slug] template renders beyond the card +
 *  markdown bio. Every section is OPTIONAL — minimal profiles just omit them. */
export type ProfileData = {
  eyebrow: string;          // hero eyebrow, e.g. "People · Director"
  headline: string;         // hero lede (the template prepends the academic title)
  roleEyebrow?: string;     // small eyebrow above the bio, e.g. "Director · CASSA"
  links?: Record<string, string>;   // external profile links shown on the card
  programs?: LinkRow[];
  programsIntro?: string;
  engagements?: LinkRow[];
  workEducation?: WorkGroup[];
  publications?: Publications;
  teaching?: Teaching;       // drives the /people/<slug>/teaching sub-page
};

export const PROFILES: Record<string, ProfileData> = {
  asad,
  uddin,
};

export const hasProfile = (slug: string): boolean => slug in PROFILES;
