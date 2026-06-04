/* Journal impact metrics for the venues in CASSA's publication corpus.
 *
 * Metric: "2-year mean citedness" — the open equivalent of the Journal Impact
 * Factor (citations in a year to the journal's articles from the prior two
 * years). Source: OpenAlex (https://openalex.org), fetched 2026-05-30 by ISSN
 * (`api.openalex.org/sources/issn:<issn>` → `summary_stats`). Clarivate's JIF
 * is proprietary; this is the most widely-used IF *formula* on open data.
 *
 * Used by /research/publications for the journal-quality term of the combined
 * "Impact" sort. Keyed by ADS bibstem. To refresh, re-run the OpenAlex lookup
 * and update the numbers here (it is a static, committed snapshot — the page
 * build does not call OpenAlex).
 */
export type JournalMetric = {
  name: string;
  issn: string;
  impactFactor: number; // OpenAlex 2-year mean citedness (JIF-equivalent)
  hIndex: number;
};

export const JOURNAL_METRICS: Record<string, JournalMetric> = {
  Natur: { name: "Nature", issn: "0028-0836", impactFactor: 16.64, hIndex: 1841 },
  JCAP: { name: "Journal of Cosmology and Astroparticle Physics", issn: "1475-7508", impactFactor: 7.42, hIndex: 233 },
  PhRvD: { name: "Physical Review D", issn: "2470-0010", impactFactor: 5.11, hIndex: 226 },
  NatSD: { name: "Scientific Data", issn: "2052-4463", impactFactor: 4.99, hIndex: 206 },
  ApJ: { name: "The Astrophysical Journal", issn: "0004-637X", impactFactor: 4.97, hIndex: 698 },
  MNRAS: { name: "Monthly Notices of the Royal Astronomical Society", issn: "0035-8711", impactFactor: 4.81, hIndex: 497 },
  "A&A": { name: "Astronomy and Astrophysics", issn: "0004-6361", impactFactor: 4.61, hIndex: 398 },
  AJ: { name: "The Astronomical Journal", issn: "0004-6256", impactFactor: 4.36, hIndex: 353 },
  RSPTA: { name: "Philosophical Transactions of the Royal Society A", issn: "1364-503X", impactFactor: 3.22, hIndex: 234 },
  JOSS: { name: "The Journal of Open Source Software", issn: "2475-9066", impactFactor: 2.75, hIndex: 133 },
  PrCS: { name: "Procedia Computer Science", issn: "1877-0509", impactFactor: 2.31, hIndex: 192 },
  FrASS: { name: "Frontiers in Astronomy and Space Sciences", issn: "2296-987X", impactFactor: 2.06, hIndex: 48 },
};
