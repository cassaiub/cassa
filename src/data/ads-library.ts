/* Curated CASSA ADS library — a LOCAL snapshot of the bibcodes in the public
 * library https://ui.adsabs.harvard.edu/user/libraries/znTrvN1iRXOBQvd17VhYmA
 * (8 papers as of 2026-05-30). These are CASSA-relevant papers the affiliation
 * search misses — e.g. radio-astronomy work where the author listed a prior
 * institution rather than CASSA/IUB.
 *
 * Kept local so the build does NOT hit the ADS biblib + bigquery endpoints:
 * bigquery has a tiny per-day quota that 429s under any real use, which was
 * intermittently dropping these papers from the page. Only the membership list
 * is frozen here; each paper's live metadata (title, citations, affiliations)
 * is still fetched at build time via the normal search API — q=bibcode:(...),
 * which has ample quota. To refresh, re-read the library via biblib
 * (GET /v1/biblib/libraries/<id>) and update the array below. The array may also
 * include hand-added papers (marked inline) for IUB work the affiliation search
 * misses; ADS_AFF_OVERRIDES (below) patches authors ADS left with no affiliation.
 */
export const ADS_LIBRARY_ID = "znTrvN1iRXOBQvd17VhYmA";
export const ADS_LIBRARY_URL = `https://ui.adsabs.harvard.edu/user/libraries/${ADS_LIBRARY_ID}`;

export const ADS_LIBRARY_BIBCODES: string[] = [
  // Hand-added (not from the public library above) — IUB papers the affiliation
  // search misses because ADS lacks the author's affiliation; see ADS_AFF_OVERRIDES.
  "2026A&A...708A.166H", // S. A. Uddin — "The Local Distance Network" (A&A 708, A166)
  "2024MNRAS.531..649G",
  "2023MNRAS.520.4410T",
  "2023PrCS..222..601H",
  "2022ApJ...925..165H",
  "2021MNRAS.502.2970A",
  "2020MNRAS.493.1662M",
  "2020MNRAS.493.4728G",
  "2020ApJ...888...61M",
];

/* Per-paper affiliation corrections, applied when the snapshot is built
 * (scripts/fetch-publications.mjs). ADS sometimes records no affiliation ("-")
 * for an author even though the published paper lists one — without this, that
 * paper's IUB share is miscounted as zero. Keyed by bibcode → { author, aff }:
 * `author` matches the start of an ADS "Surname, Given" byline entry; `aff` is the
 * paper's exact wording, ";"-separated (first = primary) per ADS convention. */
export const ADS_AFF_OVERRIDES: Record<string, { author: string; aff: string }[]> = {
  // "The Local Distance Network" community H0 report. ADS has no affiliation for
  // Uddin; the published A&A 708, A166 (2026) lists him at APUS + CASSA/IUB
  // (verified 2026-06-02 from aanda.org). Restores his IUB credit on the page.
  "2026A&A...708A.166H": [
    {
      author: "Uddin",
      aff: "American Public University System, 111 W. Congress St., Charles Town, WV 25414, USA; Center for Astronomy, Space Science and Astrophysics, Independent University, Bangladesh, Dhaka 1245, Bangladesh",
    },
  ],
};
