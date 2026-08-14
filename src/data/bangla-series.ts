/* CASSA's two Bengali article series — an outreach activity, surfaced under
   /outreach/bangla (not /news). Single source of truth for the series list,
   their stable anchor ids, transliteration and a one-line description.
   The legacy WordPress category name is the join key against the `news`
   collection's `category` field. */

export type BanglaSeries = {
  /** Bengali category label, as stored in the news entries' `category`. */
  name: string;
  /** ASCII anchor id / route fragment. */
  id: string;
  /** Latin transliteration, shown as a small kicker. */
  roman: string;
  /** One-line description of the series. */
  desc: string;
  /** Shown among the series cards on /outreach. Durer Kotha is off that page
   *  (2026-08-14) because it ran as a Durbin activity and Durbin now has its
   *  own site — its eight articles stay published under /outreach/bangla and
   *  stay out of the main /news feed. */
  onOutreachPage: boolean;
};

export const BANGLA_SERIES: BanglaSeries[] = [
  { name: "নতুন কথা", id: "notun-kotha", roman: "Notun Kotha", desc: "Research-news explainers — new findings, in Bangla.", onOutreachPage: true },
  { name: "দূরের কথা", id: "durer-kotha", roman: "Durer Kotha", desc: "Bangla translations of popular astronomy essays (e.g. AAS Nova) that explain published research.", onOutreachPage: false },
  // Registered 2026-08-14. It had been running unregistered, so `isBanglaSeries`
  // returned false for it and its chapters leaked into the English /news feed.
  { name: "ক্লাসিকেল কথা", id: "klasikel-kotha", roman: "Klasikel Kotha", desc: "A serialised Bangla translation of a classic of astronomy writing — currently Anton Pannekoek's A History of Astronomy (1951), chapter by chapter.", onOutreachPage: true },
];

export const BANGLA_SERIES_NAMES: string[] = BANGLA_SERIES.map((s) => s.name);
export const isBanglaSeries = (category?: string): boolean =>
  !!category && BANGLA_SERIES_NAMES.includes(category);
