/* Recent-publications feed for the home page — reads the same local ADS snapshot
 * the /research/publications page uses (src/data/publications-snapshot.json) and
 * returns the N most recent papers with their CASSA authors resolved. The
 * CASSA/IUB affiliation test mirrors publications.astro's computeIubShare. */
import snapshot from "./publications-snapshot.json";

type RawPaper = {
  bibcode: string;
  title?: string[];
  author?: string[];
  aff?: string[];
  year?: string;
  pubdate?: string;
  pub?: string;
  bibstem?: string[];
  doi?: string[];
  citation_count?: number;
};

const decodeAff = (s: string) => (s ?? "")
  .replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">")
  .replace(/&quot;/g, '"').replace(/&#0?39;/g, "'").replace(/&#x27;/gi, "'").replace(/&nbsp;/g, " ");
const RE_CASSA = /center for astronomy,?\s*space science/i;
const isIUBaff = (s: string) => RE_CASSA.test(s) || (/independent university/i.test(s) && /bangladesh/i.test(s));
const splitAffs = (s?: string): string[] => {
  const d = decodeAff(s ?? "");
  if (!d || d === "-") return [];
  return d.includes(";") ? d.split(";").map((x) => x.trim()).filter(Boolean) : [d.trim()];
};

/* "Surname, Given Names" → "Given Names Surname"; collaboration names pass through. */
const displayName = (ads: string): string => {
  const parts = (ads ?? "").split(",").map((s) => s.trim());
  return parts.length >= 2 && parts[1] ? `${parts[1]} ${parts[0]}` : (parts[0] ?? ads);
};

/* Compact reference from the bibcode: "MNRAS 549, 1093 (2026)", "A&A 710, A349
 * (2026)". Uppercase issue letter (A&A/ApJL article prefix) is kept; a lowercase
 * issue letter (e.g. MNRAS "g") is dropped. Falls back to "Journal (year)". */
const reference = (p: RawPaper): string => {
  const j = p.bibstem?.[0] ?? p.pub ?? "";
  const bc = p.bibcode ?? "";
  const year = p.year ?? bc.slice(0, 4);
  if (bc.length >= 18) {
    const vol = bc.slice(9, 13).replace(/\./g, "").replace(/^0+/, "");
    const q = bc[13];
    const rawPage = bc.slice(14, 18).replace(/\./g, "").replace(/^0+/, "");
    const page = /[A-Z]/.test(q) ? `${q}${rawPage}` : rawPage;
    if (vol && page) return `${j} ${vol}, ${page} (${year})`;
  }
  return `${j} (${year})`;
};

export type RecentPaper = {
  bibcode: string;
  title: string;
  firstAuthor: string;
  etAl: boolean;
  cassaAuthors: string[];
  journal: string;
  reference: string;
  doiUrl: string | null;
  year: string;
  pubMonth: string; // short month name from pubdate, "" if unknown (day/month = 00)
};

const MONTHS = ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export function recentPublications(n = 7): RecentPaper[] {
  const papers = (snapshot as { papers: RawPaper[] }).papers ?? [];
  return [...papers]
    .sort((a, b) =>
      (b.pubdate ?? "").localeCompare(a.pubdate ?? "")
      || (b.citation_count ?? 0) - (a.citation_count ?? 0))
    .slice(0, n)
    .map((p) => {
      const au = p.author ?? [], af = p.aff ?? [];
      const cassa = au.filter((_, i) => splitAffs(af[i]).some(isIUBaff)).map(displayName);
      const doi = p.doi?.[0];
      return {
        bibcode: p.bibcode,
        title: decodeAff(p.title?.[0] ?? "Untitled"), // ADS titles carry &lt; &amp; etc.
        firstAuthor: displayName(au[0] ?? ""),
        etAl: au.length > 1,
        cassaAuthors: cassa,
        journal: p.pub ?? p.bibstem?.[0] ?? "",
        reference: reference(p),
        doiUrl: doi ? `https://doi.org/${doi}` : null,
        year: p.year ?? (p.pubdate ?? "").slice(0, 4),
        pubMonth: MONTHS[Number((p.pubdate ?? "").slice(5, 7))] ?? "",
      };
    });
}
