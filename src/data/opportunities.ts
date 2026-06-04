/* The three Opportunities categories. Single source of truth for the landing
   cards, the sub-page routes, the nav dropdown and the detail-page back-link.
   Each circular in the `opportunities` collection maps to a category by `kind`. */

export type OppKind = "job" | "internship" | "volunteer";

export interface OppCategory {
  kind: OppKind;
  slug: string; // logical path segment: /opportunities/<slug>
  label: string; // page title + nav label
  blurb: string; // one-line summary on the landing cards
}

export const OPP_CATEGORIES: OppCategory[] = [
  {
    kind: "job",
    slug: "vacancies",
    label: "Vacancies",
    blurb: "Paid research assistantships and staff roles — how CASSA hires, with every open and past job circular.",
  },
  {
    kind: "internship",
    slug: "internships",
    label: "Internships",
    blurb: "Research internships across the Center — the application pathway, eligibility, and current openings.",
  },
  {
    kind: "volunteer",
    slug: "volunteerships",
    label: "Volunteerships",
    blurb: "Volunteer with Durbin and CASSA outreach — telescope operators, astronomy nights, and public science.",
  },
];

export const categoryForKind = (kind: OppKind): OppCategory =>
  OPP_CATEGORIES.find((c) => c.kind === kind)!;

export const pathForKind = (kind: OppKind): string => `/opportunities/${categoryForKind(kind).slug}`;
