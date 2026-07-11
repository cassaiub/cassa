/* Syed Ashraf Uddin — rich profile data for /people/uddin.
 * Identity (name, title, tier, photo, email, interests) + the biography prose
 * live in the collection entry src/content/people/uddin.md; this module holds
 * the structured "extras" the generic template renders. Sourced from his
 * résumé (July 2026) and his Google Scholar / NASA ADS records. */

import {
  PUBLICATIONS, PUBS_SNAPSHOT, SCHOLAR_URL, ADS_AUTHOR_URL,
  SCHOLAR_TOTAL_CITES, SCHOLAR_H_INDEX, SCHOLAR_I10_INDEX,
  SCHOLAR_CITES_BY_YEAR, SCHOLAR_SINCE,
} from "../uddin/publications.ts";
import type { ProfileData } from "./profiles.ts";

const IUB = "https://iub.ac.bd/";

export const uddin: ProfileData = {
  eyebrow: "People · Core Member",
  headline: "A Core Member of CASSA — charting the expansion history of the Universe with Type Ia supernovae.",
  roleEyebrow: "Core Member · CASSA",

  links: {
    "Google Scholar": SCHOLAR_URL,
    "NASA/ADS": ADS_AUTHOR_URL,
    "Website": "https://saushuvo.wixsite.com/home",
  },

  programsIntro:
    "His research uses Type Ia supernovae as standardizable candles to measure cosmic distances, probe dark energy, and address the Hubble tension — through three collaborations in particular:",
  programs: [
    { title: "CSP — Carnegie Supernova Project", desc: "Measurements of the Hubble-Lemaître constant (H₀) using Cepheid, tip-of-the-red-giant-branch and surface-brightness-fluctuation distance calibrations.", href: "https://csp.obs.carnegiescience.edu/" },
    { title: "POISE — Precision Observations of Infant Supernova Explosions", desc: "Catching supernovae in the first days after explosion to pin down their progenitors and physics.", href: "https://poise.obs.carnegiescience.edu/" },
    { title: "OzDES — Obtaining Redshifts for the Dark Energy Survey", desc: "The multi-fibre spectroscopic follow-up programme behind the Dark Energy Survey's supernova cosmology.", href: "https://www.darkenergysurvey.org/" },
  ],

  workEducation: [
    {
      group: "Work",
      rows: [
        { years: "2026 – present", role: "Core Member", org: [{ name: "CASSA", url: "/about" }], place: "IUB, Bangladesh" },
        { years: "2026 – present", role: "Associate Professor", org: ["Department of Physical Sciences, ", { name: "IUB", url: IUB }], place: "Dhaka, Bangladesh" },
        { years: "2024 – 2025", role: "Astronomy Instructor", org: ["Department of Physics and Astronomy, ", { name: "University of South Carolina", url: "https://www.sc.edu/study/colleges_schools/artsandsciences/physics_and_astronomy/" }], place: "Columbia, SC, USA" },
        { years: "2023", role: "Astronomer, Celestial Reference Frame Division", org: [{ name: "US Naval Observatory", url: "https://www.cnmoc.usff.navy.mil/usno/" }], place: "Washington, DC, USA" },
        { years: "2021 – 2022", role: "Postdoctoral Research Associate", org: ["Department of Physics and Astronomy, ", { name: "Texas A&M University", url: "https://physics.tamu.edu/" }], place: "College Station, TX, USA" },
        { years: "2018 – 2021", role: "Postdoctoral Fellow, Carnegie Supernova Project", org: [{ name: "Observatories of the Carnegie Institution for Science", url: "https://obs.carnegiescience.edu/" }], place: "Pasadena, CA, USA" },
      ],
    },
    {
      group: "Education",
      rows: [
        {
          years: "2016",
          role: "PhD in Astrophysics",
          org: [{ name: "Swinburne University of Technology", url: "https://www.swinburne.edu.au/" }],
          place: "Melbourne, Australia",
          thesisTitle: "On the influence of the host galaxy in supernova cosmology",
        },
        { years: "2011", role: "MS in Physics", org: [{ name: "University of Kentucky", url: "https://pa.as.uky.edu/" }], place: "Lexington, KY, USA" },
        { years: "2006", role: "MSc in Radio Astronomy and Space Science", org: [{ name: "Chalmers University of Technology", url: "https://www.chalmers.se/en/" }], place: "Gothenburg, Sweden" },
        { years: "2003", role: "BSc in Mechanical Engineering", org: [{ name: "Bangladesh University of Engineering and Technology", url: "https://me.buet.ac.bd/" }], place: "Dhaka, Bangladesh" },
      ],
    },
  ],

  publications: {
    shareLabel: "Uddin share",
    personShort: "Uddin",
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
};
