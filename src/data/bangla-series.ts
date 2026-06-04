/* CASSA's four Bengali article series — an outreach activity, surfaced under
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
};

export const BANGLA_SERIES: BanglaSeries[] = [
  { name: "নতুন কথা", id: "notun-kotha", roman: "Notun Kotha", desc: "Research-news explainers — new findings, in Bangla." },
  { name: "দূরের কথা", id: "durer-kotha", roman: "Durer Kotha", desc: "Bangla translations of popular astronomy essays (e.g. AAS Nova) that explain published research." },
  { name: "সহজ কথা", id: "shohoj-kotha", roman: "Shohoj Kotha", desc: "Popular-science writing for a general audience." },
  { name: "ক্লাসিকেল কথা", id: "classical-kotha", roman: "Classical Kotha", desc: "Translations of classic astronomy texts." },
];

export const BANGLA_SERIES_NAMES: string[] = BANGLA_SERIES.map((s) => s.name);
export const isBanglaSeries = (category?: string): boolean =>
  !!category && BANGLA_SERIES_NAMES.includes(category);
