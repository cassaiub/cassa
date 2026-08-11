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

export const NAV: NavItem[] = [
  { href: "/", label: "Home", live: true },
  {
    href: "/about",
    label: "About",
    live: true,
    children: [
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
      { href: "/people/director", label: "Office of the Director" },
      { href: "/people/core-members", label: "Core Members" },
      { href: "/people/associate-members", label: "Associate Members" },
      { href: "/people/affiliates", label: "Affiliates" },
      { href: "/people/research-assistants", label: "Research Assistants" },
      { href: "/people/project-managers", label: "Project Managers" },
      { href: "/people/students-on-duty", label: "Students on Duty" },
      { href: "/people/research-interns", label: "Research Interns" },
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
    groups: [
      // Durbin moved to its own site (durbin.cc) on 2026-08-11; its pages, the
      // astrophotography collection and its updates feed are no longer built
      // here. The Outreach page still describes the programme in prose.
      {
        label: "BDOAA",
        href: "/bdoaa",
        children: [
          { href: "/bdoaa#how", label: "How it works" },
          { href: "/bdoaa#results", label: "On the world stage" },
          { href: "https://bdoaa.org/", label: "bdoaa.org ↗" },
        ],
      },
    ],
  },
  {
    href: "/newsroom",
    label: "Newsroom",
    live: true,
    children: [
      { href: "/news", label: "News" },
      { href: "/events", label: "Events" },
    ],
  },
  {
    href: "/opportunities",
    label: "Opportunities",
    live: true,
    children: [
      { href: "/opportunities/vacancies", label: "Vacancies" },
      { href: "/opportunities/internships", label: "Internships" },
      { href: "/opportunities/volunteerships", label: "Volunteerships" },
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
