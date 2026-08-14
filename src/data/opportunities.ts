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
  // Volunteerships was retired on 2026-08-14: volunteering is a Durbin
  // programme and Durbin has its own site (durbin.cc). `volunteer` stays a
  // valid `kind` so historical circulars still parse — they are `draft`, so
  // nothing routes to a category page that no longer exists.
];

export const categoryForKind = (kind: OppKind): OppCategory | undefined =>
  OPP_CATEGORIES.find((c) => c.kind === kind);

/** Path of the category page a circular belongs to — null for a retired
 *  category (`volunteer`), so callers render no back-link instead of a 404. */
export const pathForKind = (kind: OppKind): string | null => {
  const c = categoryForKind(kind);
  return c ? `/opportunities/${c.slug}` : null;
};
