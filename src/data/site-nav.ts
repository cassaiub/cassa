/* Single source of truth for site navigation + the new IA. `live: false`
   renders the item as a muted "coming soon" label instead of a link, so the
   planned structure is visible without dead links. All hrefs are logical
   paths (no base); consumers wrap with withBase(). */

export function withBase(p: string): string {
  if (!p) return p;
  if (/^https?:\/\//.test(p)) return p; // absolute URL — leave as-is
  const base = import.meta.env.BASE_URL.replace(/\/$/, "");
  if (p === "/") return base || "/";
  return base + (p.startsWith("/") ? p : "/" + p);
}

export type NavChild = { href: string; label: string; live?: boolean };
export type NavGroup = { label: string; href?: string; children: NavChild[] };
export type NavItem = { href: string; label: string; live: boolean; children?: NavChild[]; groups?: NavGroup[] };

/* A top-level label is never a link — it only opens its dropdown. Every page in
   a section, INCLUDING the section landing page, must therefore be listed as a
   child (or a linked group head) so it stays reachable from the menu. */
export const NAV: NavItem[] = [
  { href: "/", label: "Home", live: true },
  {
    href: "/about",
    label: "About",
    live: true,
    children: [
      { href: "/about", label: "About CASSA" },
      { href: "/constitution", label: "Constitution" },
      { href: "/coc", label: "Code of Conduct" },
      { href: "/sgp", label: "Safeguarding Policy" },
    ],
  },
  {
    href: "/people",
    label: "People",
    live: true,
    children: [
      { href: "/people", label: "Directory" },
      { href: "/people/director", label: "Office of the Director" },
      { href: "/people/core-members", label: "Core Members" },
      { href: "/people/associate-members", label: "Associate Members" },
      { href: "/people/affiliates", label: "Affiliates" },
      { href: "/people/research-assistants", label: "Research Assistants" },
      { href: "/people/undergraduate-ras", label: "Undergraduate RAs" },
      { href: "/people/research-interns", label: "Research Interns" },
      { href: "/people/alumni", label: "Alumni" },
    ],
  },
  {
    href: "/research",
    label: "Research",
    live: true,
    groups: [
      {
        label: "Research",
        children: [
          { href: "/research", label: "Research Areas" },
          { href: "/research/projects", label: "Projects" },
          { href: "/research/publications", label: "Publications" },
        ],
      },
      {
        label: "Facilities",
        children: [
          { href: "/research/core", label: "IUB CORE" },
          { href: "/research/hpc", label: "Timaeus HPC" },
          { href: "/research/tart", label: "TART" },
          { href: "/research/observatory", label: "CIAO" },
        ],
      },
    ],
  },
  {
    href: "/teaching",
    label: "Teaching",
    live: true,
    // Menu only — the /teaching landing page was removed on 2026-08-14. Two
    // columns, Courses and Workshops, are the whole section.
    groups: [
      {
        label: "Courses",
        href: "/courses",
        children: [
          { href: "/teaching/minor", label: "Minor in A&A" },
          { href: "https://cassa.bd/courses/ast100/", label: "AST 100 ↗" },
          { href: "/abekta", label: "Abekta ↗" },
        ],
      },
      {
        label: "Workshops",
        children: [
          { href: "/tdmma-2026", label: "TDMMA 2026" },
          { href: "/teaching/workshops/cw1-en", label: "Workshop 1" },
          { href: "/teaching/workshops/cw2-en", label: "Workshop 2" },
        ],
      },
    ],
  },
  {
    href: "/outreach",
    label: "Outreach",
    live: true,
    // A plain dropdown, not a megamenu: one entry per outreach programme. Two
    // of the four are their own sites — Durbin left this repo on 2026-08-11
    // (durbin.cc) and SPARC has always been separate — so the menu is the only
    // place the four sit together. /outreach still describes them all in prose.
    children: [
      { href: "/outreach", label: "CASSA Outreach" },
      { href: "https://sparc.cassa.bd/", label: "SPARC ↗" },
      { href: "https://durbin.cc/", label: "Durbin ↗" },
      { href: "/bdoaa", label: "BDOAA" },
    ],
  },
  {
    // Newsroom is a MENU ONLY — there is no /newsroom page (removed
    // 2026-08-14); News and Events are the whole section. `href` here is just
    // the section's identity for the active-state check.
    href: "/newsroom",
    label: "Newsroom",
    live: true,
    children: [
      { href: "/news", label: "News" },
      { href: "/events", label: "Events" },
    ],
  },
  {
    // Menu only — the "Join CASSA" landing page was removed on 2026-08-14, and
    // Volunteerships went with Durbin to durbin.cc. These three are the section.
    href: "/opportunities",
    label: "Opportunities",
    live: true,
    children: [
      { href: "/opportunities/vacancies", label: "Vacancies" },
      { href: "/opportunities/internships", label: "Internships" },
      { href: "/opportunities/tra", label: "Tinsley RAship" },
    ],
  },
];

/* The new site links out to the existing sub-sites; it does not absorb them. */
export const EXTERNAL = {
  ast100: "/courses/ast100",
  abekta: "/abekta",
  iub: "https://iub.ac.bd/",
  bangla: "/bangla",
};
