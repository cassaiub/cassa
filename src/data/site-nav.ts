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
  { href: "/about", label: "About", live: true },
  {
    href: "/people",
    label: "People",
    live: true,
    children: [
      { href: "/people/directors", label: "Directors" },
      { href: "/people/core-associate", label: "Core & Associate" },
      { href: "/people/grad-affiliates", label: "Graduate & Affiliates" },
      { href: "/people/staff", label: "Staff" },
      { href: "/people/student-ras", label: "Research Assistants" },
      { href: "/people/interns", label: "Interns & Undergraduates" },
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
          { href: "/research/publications", label: "Publications" },
        ],
      },
      {
        label: "Facilities",
        children: [
          { href: "/research/observatory", label: "IUB Observatory" },
          { href: "/research/core", label: "IUB CORE" },
          { href: "/research/hpc", label: "Timaeus HPC" },
          { href: "/research/star", label: "STAR Telescope" },
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
          { href: "https://cassa.site/courses/ast100/", label: "AST 100 ↗" },
          { href: "/abekta", label: "Abekta ↗" },
        ],
      },
      {
        label: "Workshops",
        children: [
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
      {
        label: "Durbin",
        href: "/durbin",
        children: [
          { href: "/durbin/images", label: "Astrophotography" },
          { href: "/durbin/manual", label: "Durbin Manual" },
          { href: "/durbin/volunteers", label: "Volunteers" },
          { href: "/durbin/updates", label: "Updates" },
        ],
      },
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
    groups: [
      {
        label: "Newsroom",
        children: [
          { href: "/news", label: "News" },
          { href: "/events", label: "Events" },
        ],
      },
      {
        label: "In Bangla",
        children: [
          { href: "/outreach/bangla#notun-kotha", label: "নতুন কথা" },
          { href: "/outreach/bangla#durer-kotha", label: "দূরের কথা" },
        ],
      },
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
