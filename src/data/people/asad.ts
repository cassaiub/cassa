/* Khan Muhammad Bin Asad — rich profile data for /people/asad.
 * Identity (name, title, tier, photo, email, interests) + the biography prose
 * live in the collection entry src/content/people/asad.md; this module holds
 * the structured "extras" the generic template renders. */

import {
  PUBLICATIONS, PUBS_SNAPSHOT, SCHOLAR_URL, ADS_AUTHOR_URL,
  SCHOLAR_TOTAL_CITES, SCHOLAR_H_INDEX, SCHOLAR_I10_INDEX,
  SCHOLAR_CITES_BY_YEAR, SCHOLAR_SINCE,
} from "../asad/publications.ts";
import { COURSES, TEACHING_SNAPSHOT } from "../asad/teaching.ts";
import type { ProfileData } from "./profiles.ts";

const IUB = "https://iub.ac.bd/";

export const asad: ProfileData = {
  eyebrow: "People · Core Member",
  headline: "A Core Member of CASSA — custodian of the HPC, radio telescopes and instruments.",
  roleEyebrow: "Core Member · CASSA",

  links: {
    "Google Scholar": "https://scholar.google.co.za/citations?hl=en&user=w09mn4sAAAAJ",
    "NASA/ADS": "https://ui.adsabs.harvard.edu/search/q=author%3A%22asad%2Ckmb%22&sort=date+desc",
    "Facebook": "https://www.facebook.com/kmbasad/",
  },

  programsIntro:
    "My work centres on three research programs, all pursued at CASSA with artificial intelligence applied across all three. Each program spans multiple projects:",
  programs: [
    { title: "CHronOS — Cosmic Hydrogen Observation and Simulation", desc: "Observational cosmology with radio telescopes, in synergy with other cosmological probes.", href: "/research/chronos" },
    { title: "GATE — Galaxies And Their Environments", desc: "Combining radio and X-ray observations to study galaxy clusters and the galaxies within them.", href: "/research/gate" },
    { title: "RAIN — Radio Astronomy Instrumentation", desc: "Radio instrumentation and its synergy with remote sensing, space science, and space technology and engineering.", href: "/research/rain" },
  ],

  engagements: [
    { title: "Courses taught", desc: "Astronomy, physics and electronics courses at IUB, including the Minor in Astronomy & Astrophysics.", href: "/people/asad/teaching" },
    { title: "Outreach — Durbin & BDOAA", desc: "Durbin (astrophotography & science communication for the public) and the Bangladesh Olympiad on Astronomy & Astrophysics (BDOAA).", href: "/durbin" },
  ],

  workEducation: [
    {
      group: "Work",
      rows: [
        { years: "2025 – present", role: "Director", org: [{ name: "CASSA", url: "/about" }], place: "IUB, Bangladesh" },
        { years: "2020 – present", role: "Assistant Professor", org: ["Department of Physical Sciences, ", { name: "IUB", url: IUB }], place: "Bangladesh" },
        {
          years: "2016 – 2019",
          role: "Postdoctoral Research Fellow",
          org: [
            { name: "South African Radio Astronomy Observatory", url: "https://www.sarao.ac.za/" },
            " (",
            { name: "Rhodes University", url: "https://ratt.center/" },
            " & ",
            { name: "University of the Western Cape", url: "https://astro.uwc.ac.za/" },
            ")",
          ],
          place: "South Africa",
        },
      ],
    },
    {
      group: "Education",
      rows: [
        {
          years: "2012 – 2016",
          role: "PhD in Astrophysics & Cosmology",
          org: [
            { name: "Kapteyn Astronomical Institute", url: "https://www.rug.nl/research/kapteyn/?lang=en" },
            ", ",
            { name: "University of Groningen", url: "https://www.rug.nl/" },
          ],
          place: "The Netherlands",
          thesisTitle: "Polarization leakage in epoch of reionization windows: The Low Frequency Array Case",
          thesisUrl: "https://research.rug.nl/en/publications/polarization-leakage-in-epoch-of-reionization-windows-the-low-fre/",
          supervisor: "Prof. Léon Koopmans",
        },
        {
          years: "2010 – 2012",
          role: "MSc in Astrophysics (AstroMundus)",
          org: [
            "Universities of ",
            { name: "Innsbruck", url: "https://www.uibk.ac.at/astro/index.html.en" },
            ", ",
            { name: "Göttingen", url: "https://www.uni-goettingen.de/en/203293.html" },
            " & ",
            { name: "Rome Tor Vergata", url: "https://www-en.fisica.uniroma2.it/sezioni/research/research-areas/astrophysics/" },
          ],
          place: "Austria · Germany · Italy",
          thesisTitle: "Study of the formation of Cold Fronts and Radio Mini-halos induced by the Intergalactic Gas Sloshing in the Cores of Galaxy Clusters",
          thesisUrl: "/people/asad/msc-thesis.pdf",
          supervisor: "Prof. Pasquale Mazzotta",
        },
        { years: "2005 – 2009", role: "BSc, Electrical & Electronic Engineering", org: [{ name: "Islamic University of Technology", url: "https://eee.iutoic-dhaka.edu/" }], place: "Gazipur, Bangladesh" },
        { years: "1999 – 2005", role: "Class 7–12", org: [{ name: "Mirzapur Cadet College", url: "https://mcc.army.mil.bd/" }], place: "Tangail, Bangladesh" },
        { years: "1997 – 1999", role: "Class 5–6", org: [{ name: "Mukul Niketan High School", url: "https://mukulniketonhs.edu.bd/" }], place: "Mymensingh, Bangladesh" },
        { years: "1993 – 1997", role: "Class 1–4", org: [{ name: "Satenga Government Primary School", url: "https://www.google.com/maps/search/?api=1&query=Satenga+Government+Primary+School+Bhaluka+Mymensingh" }], place: "Bhaluka, Mymensingh, Bangladesh" },
      ],
    },
  ],

  publications: {
    shareLabel: "Asad share",
    personShort: "Asad",
    scholarUrl: SCHOLAR_URL,
    adsAuthorUrl: ADS_AUTHOR_URL,
    scholarTotalCites: SCHOLAR_TOTAL_CITES,
    scholarHIndex: SCHOLAR_H_INDEX,
    scholarI10Index: SCHOLAR_I10_INDEX,
    citesByYear: SCHOLAR_CITES_BY_YEAR,
    since: SCHOLAR_SINCE,
    snapshot: PUBS_SNAPSHOT,
    papers: PUBLICATIONS,
  },

  /* Teaching record — extracted from Asad's Google Classroom Takeout
     (Spring 2020 – Summer 2026). Data lives in src/data/asad/teaching.ts. */
  teaching: {
    intro:
      "Every course I have taught at IUB since Spring 2020 — by course, trimester and section, with enrolment. Sourced from Google Classroom.",
    snapshot: TEACHING_SNAPSHOT,
    courses: COURSES,
  },
};
