/* Syed Ashraf Uddin — complete publication list, a FROZEN local snapshot.
 * Combines NASA ADS and Google Scholar (user 3wJqZc8AAAAJ), matched by title.
 * Papers only (journal & conference); the two theses, the IAU abstract and the
 * Scholar duplicate of the SN 2018evt paper are excluded. `adsCites`/`scholarCites`
 * are per-source counts; `share` follows the same rule as Asad's snapshot
 * (0.9 / r at contribution-ordered byline position r; the equal share 0.9 / N,
 * `alpha: true`, inside an alphabetical author list — the big DES/collab lists).
 * The 2013 SALSA paper is not indexed by ADS: bibcode "" links its title to the
 * Scholar record instead. On 2017SciBu..62.1433H ADS misspells him "Udden".
 * Snapshot 11 July 2026. Regenerate to refresh. */

import type { Pub } from "../asad/publications.ts";

export const PUBS_SNAPSHOT = "11 July 2026";
export const SCHOLAR_URL = "https://scholar.google.com/citations?user=3wJqZc8AAAAJ&hl=en";
export const ADS_AUTHOR_URL = "https://ui.adsabs.harvard.edu/search/q=author%3A%22uddin%2C%20syed%20a.%22&sort=date%20desc";
export const SCHOLAR_TOTAL_CITES = 3772;
export const SCHOLAR_H_INDEX = 24;
export const SCHOLAR_I10_INDEX = 30;
/* Citations received per calendar year — the Google Scholar profile histogram
 * (snapshot 11 July 2026). The graph omits pre-2015 (~41 citations), so these
 * sum to 3,731 of the 3,772 all-time total. */
export const SCHOLAR_CITES_BY_YEAR: Record<number, number> = {
  2015: 42, 2016: 66, 2017: 69, 2018: 168, 2019: 364, 2020: 425,
  2021: 439, 2022: 408, 2023: 489, 2024: 473, 2025: 472, 2026: 316,
};
export const SCHOLAR_SINCE = { year: 2021, cites: 2601, hIndex: 24, i10Index: 27 };

export const PUBLICATIONS: Pub[] = [
  {
    title: "The Local Distance Network: A community consensus report on the measurement of the Hubble constant at ∼1% precision",
    year: 2026, pub: "Astronomy and Astrophysics", bibcode: "2026A&A...708A.166H", doi: "10.1051/0004-6361/202557993",
    adsCites: 68, scholarCites: 50, pos: 36, nauthors: 38, share: 0.024, alpha: true,
    byline: "H0DN Collaboration; Casertano, Stefano; Anand, Gagandeep; … Uddin, Syed A. et al.",
  },
  {
    title: "Carnegie Supernova Project: Fast-declining Type Ia Supernovae as Cosmological Distance Indicators",
    year: 2026, pub: "The Astrophysical Journal", bibcode: "2026ApJ...998..101P", doi: "10.3847/1538-4357/ae2fef",
    adsCites: 7, scholarCites: 2, pos: 2, nauthors: 19, share: 0.45, alpha: false,
    byline: "Phillips, M. M.; Uddin, Syed A.; Burns, Christopher R. et al.",
  },
  {
    title: "Carnegie Supernova Project I and II: Measurements of H₀ Using Cepheid, Tip of the Red Giant Branch, and Surface Brightness Fluctuation Distance Calibration to Type Ia Supernovae",
    year: 2024, pub: "The Astrophysical Journal", bibcode: "2024ApJ...970...72U", doi: "10.3847/1538-4357/ad3e63",
    adsCites: 46, scholarCites: 64, pos: 1, nauthors: 47, share: 0.9, alpha: false,
    byline: "Uddin, Syed A.; Burns, Christopher R.; Phillips, M. M. et al.",
  },
  {
    title: "Newly formed dust within the circumstellar environment of SN Ia-CSM 2018evt",
    year: 2024, pub: "Nature Astronomy", bibcode: "2024NatAs...8..504W", doi: "10.1038/s41550-024-02197-9",
    adsCites: 25, scholarCites: 24, pos: 25, nauthors: 47, share: 0.036, alpha: false,
    byline: "Wang, Lingzhi; Hu, Maokai; Wang, Lifan; … Uddin, Syed A. et al.",
  },
  {
    title: "1991T-like Supernovae",
    year: 2024, pub: "The Astrophysical Journal Supplement Series", bibcode: "2024ApJS..273...16P", doi: "10.3847/1538-4365/ad4f7e",
    adsCites: 22, scholarCites: 4, pos: 12, nauthors: 26, share: 0.075, alpha: false,
    byline: "Phillips, M. M.; Ashall, C.; Brown, Peter J.; … Uddin, Syed A. et al.",
  },
  {
    title: "Near-infrared and Optical Nebular-phase Spectra of Type Ia Supernovae SN 2013aa and SN 2017cbv in NGC 5643",
    year: 2023, pub: "The Astrophysical Journal", bibcode: "2023ApJ...945...27K", doi: "10.3847/1538-4357/acad73",
    adsCites: 11, scholarCites: 14, pos: 26, nauthors: 26, share: 0.035, alpha: true,
    byline: "Kumar, Sahana; Hsiao, Eric Y.; Ashall, C.; … Uddin, S. A. et al.",
  },
  {
    title: "Dark Energy Survey Year 3 results: A 2.7% measurement of baryon acoustic oscillation distance scale at redshift 0.835",
    year: 2022, pub: "Physical Review D", bibcode: "2022PhRvD.105d3512A", doi: "10.1103/PhysRevD.105.043512",
    adsCites: 110, scholarCites: 140, pos: 109, nauthors: 113, share: 0.008, alpha: true,
    byline: "Abbott, T. M. C.; Aguena, M.; Allam, S.; … Uddin, S. A. et al.",
  },
  {
    title: "Carnegie Supernova Project-II: Near-infrared Spectroscopy of Stripped-envelope Core-collapse Supernovae",
    year: 2022, pub: "The Astrophysical Journal", bibcode: "2022ApJ...925..175S", doi: "10.3847/1538-4357/ac4030",
    adsCites: 59, scholarCites: 74, pos: 32, nauthors: 32, share: 0.028, alpha: true,
    byline: "Shahbandeh, M.; Hsiao, E. Y.; Ashall, C.; … Uddin, S. A. et al.",
  },
  {
    title: "The Absolute Magnitudes of 1991T-like Supernovae",
    year: 2022, pub: "The Astrophysical Journal", bibcode: "2022ApJ...938...47P", doi: "10.3847/1538-4357/ac9305",
    adsCites: 23, scholarCites: 34, pos: 10, nauthors: 22, share: 0.09, alpha: false,
    byline: "Phillips, M. M.; Ashall, C.; Burns, Christopher R.; … Uddin, Syed A. et al.",
  },
  {
    title: "Testing the homogeneity of type Ia Supernovae in near-infrared for accurate distance estimations",
    year: 2022, pub: "Astronomy and Astrophysics", bibcode: "2022A&A...665A.123M", doi: "10.1051/0004-6361/202243845",
    adsCites: 11, scholarCites: 19, pos: 19, nauthors: 19, share: 0.047, alpha: false,
    byline: "Müller-Bravo, T. E.; Galbany, L.; Karamehmetoglu, E.; … Uddin, S. A. et al.",
  },
  {
    title: "The effect of environment on Type Ia supernovae in the Dark Energy Survey three-year cosmological sample",
    year: 2021, pub: "Monthly Notices of the Royal Astronomical Society", bibcode: "2021MNRAS.501.4861K", doi: "10.1093/mnras/staa3924",
    adsCites: 88, scholarCites: 103, pos: 17, nauthors: 77, share: 0.012, alpha: true,
    byline: "Kelsey, L.; Sullivan, M.; Smith, M.; … Uddin, S. A. et al.",
  },
  {
    title: "OzDES multi-object fibre spectroscopy for the Dark Energy Survey: results and second data release",
    year: 2020, pub: "Monthly Notices of the Royal Astronomical Society", bibcode: "2020MNRAS.496...19L", doi: "10.1093/mnras/staa1341",
    adsCites: 98, scholarCites: 137, pos: 4, nauthors: 105, share: 0.23, alpha: false,
    byline: "Lidman, C.; Tucker, B. E.; Davis, T. M.; … Uddin, S. A. et al.",
  },
  {
    title: "The Carnegie Supernova Project-I: Correlation between Type Ia Supernovae and Their Host Galaxies from Optical to Near-infrared Bands",
    year: 2020, pub: "The Astrophysical Journal", bibcode: "2020ApJ...901..143U", doi: "10.3847/1538-4357/abafb7",
    adsCites: 75, scholarCites: 88, pos: 1, nauthors: 16, share: 0.9, alpha: false,
    byline: "Uddin, Syed A.; Burns, Christopher R.; Phillips, M. M. et al.",
  },
  {
    title: "Exoplanets in the Antarctic Sky. III. Stellar Flares Found by AST3-II (CHESPA) within the Southern CVZ of TESS",
    year: 2020, pub: "The Astronomical Journal", bibcode: "2020AJ....159..201L", doi: "10.3847/1538-3881/ab7ea8",
    adsCites: 4, scholarCites: 6, pos: 28, nauthors: 42, share: 0.021, alpha: true,
    byline: "Liang, En-Si; Zhang, Hui; Yu, Zhouyi; … Uddin, Syed A. et al.",
  },
  {
    title: "Exoplanets in the Antarctic Sky. IV. Dual-band Photometry of Variables Found by the CSTAR-II Commissioning Survey at the North Sky",
    year: 2020, pub: "The Astronomical Journal", bibcode: "2020AJ....159..172Z", doi: "10.3847/1538-3881/ab7449",
    adsCites: 3, scholarCites: 3, pos: 21, nauthors: 33, share: 0.027, alpha: true,
    byline: "Zhu, Jiapeng; Zhang, Hui; Liang, En-Si; … Uddin, Syed A. et al.",
  },
  {
    title: "First Cosmology Results using Type Ia Supernovae from the Dark Energy Survey: Constraints on Cosmological Parameters",
    year: 2019, pub: "The Astrophysical Journal", bibcode: "2019ApJ...872L..30A", doi: "10.3847/2041-8213/ab04fa",
    adsCites: 306, scholarCites: 378, pos: 137, nauthors: 145, share: 0.0062, alpha: true,
    byline: "Abbott, T. M. C.; Allam, S.; Andersen, P.; … Uddin, S. A. et al.",
  },
  {
    title: "First cosmological results using Type Ia supernovae from the Dark Energy Survey: measurement of the Hubble constant",
    year: 2019, pub: "Monthly Notices of the Royal Astronomical Society", bibcode: "2019MNRAS.486.2184M", doi: "10.1093/mnras/stz978",
    adsCites: 236, scholarCites: 316, pos: 106, nauthors: 110, share: 0.0082, alpha: true,
    byline: "Macaulay, E.; Nichol, R. C.; Bacon, D.; … Uddin, S. A. et al.",
  },
  {
    title: "First Cosmology Results Using SNe Ia from the Dark Energy Survey: Analysis, Systematic Uncertainties, and Validation",
    year: 2019, pub: "The Astrophysical Journal", bibcode: "2019ApJ...874..150B", doi: "10.3847/1538-4357/ab08a0",
    adsCites: 147, scholarCites: 187, pos: 51, nauthors: 126, share: 0.0071, alpha: true,
    byline: "Brout, D.; Scolnic, D.; Kessler, R.; … Uddin, S. A. et al.",
  },
  {
    title: "Carnegie Supernova Project-II: Extending the Near-infrared Hubble Diagram for Type Ia Supernovae to z ∼ 0.1",
    year: 2019, pub: "Publications of the Astronomical Society of the Pacific", bibcode: "2019PASP..131a4001P", doi: "10.1088/1538-3873/aae8bd",
    adsCites: 93, scholarCites: 123, pos: 13, nauthors: 44, share: 0.02, alpha: true,
    byline: "Phillips, M. M.; Contreras, Carlos; Hsiao, E. Y.; … Uddin, Syed A. et al.",
  },
  {
    title: "First cosmology results using Type Ia supernova from the Dark Energy Survey: simulations to correct supernova distance biases",
    year: 2019, pub: "Monthly Notices of the Royal Astronomical Society", bibcode: "2019MNRAS.485.1171K", doi: "10.1093/mnras/stz463",
    adsCites: 91, scholarCites: 122, pos: 42, nauthors: 107, share: 0.0084, alpha: true,
    byline: "Kessler, R.; Brout, D.; D'Andrea, C. B.; … Uddin, S. A. et al.",
  },
  {
    title: "Exoplanets in the Antarctic Sky. II. 116 Transiting Exoplanet Candidates Found by AST3-II (CHESPA) within the Southern CVZ of TESS",
    year: 2019, pub: "The Astrophysical Journal Supplement Series", bibcode: "2019ApJS..240...17Z", doi: "10.3847/1538-4365/aaf583",
    adsCites: 19, scholarCites: 10, pos: 25, nauthors: 40, share: 0.022, alpha: true,
    byline: "Zhang, Hui; Yu, Zhouyi; Liang, Ensi; … Uddin, Syed A. et al.",
  },
  {
    title: "Exoplanets in the Antarctic Sky. I. The First Data Release of AST3-II (CHESPA) and New Found Variables within the Southern CVZ of TESS",
    year: 2019, pub: "The Astrophysical Journal Supplement Series", bibcode: "2019ApJS..240...16Z", doi: "10.3847/1538-4365/aaec0c",
    adsCites: 14, scholarCites: 3, pos: 25, nauthors: 40, share: 0.022, alpha: true,
    byline: "Zhang, Hui; Yu, Zhouyi; Liang, Ensi; … Uddin, Syed A. et al.",
  },
  {
    title: "Dark Energy Survey Year 1 Results: redshift distributions of the weak-lensing source galaxies",
    year: 2018, pub: "Monthly Notices of the Royal Astronomical Society", bibcode: "2018MNRAS.478..592H", doi: "10.1093/mnras/sty957",
    adsCites: 190, scholarCites: 275, pos: 57, nauthors: 139, share: 0.0065, alpha: true,
    byline: "Hoyle, B.; Gruen, D.; Bernstein, G. M.; … Uddin, S. A. et al.",
  },
  {
    title: "Rapidly evolving transients in the Dark Energy Survey",
    year: 2018, pub: "Monthly Notices of the Royal Astronomical Society", bibcode: "2018MNRAS.481..894P", doi: "10.1093/mnras/sty2309",
    adsCites: 156, scholarCites: 214, pos: 30, nauthors: 83, share: 0.011, alpha: true,
    byline: "Pursiainen, M.; Childress, M.; Smith, M.; … Uddin, S. A. et al.",
  },
  {
    title: "Dark Energy Survey year 1 results: Galaxy clustering for combined probes",
    year: 2018, pub: "Physical Review D", bibcode: "2018PhRvD..98d2006E", doi: "10.1103/PhysRevD.98.042006",
    adsCites: 148, scholarCites: 214, pos: 117, nauthors: 127, share: 0.0071, alpha: true,
    byline: "Elvin-Poole, J.; Crocce, M.; Ross, A. J.; … Uddin, S. A. et al.",
  },
  {
    title: "Dark Energy Survey Year 1 results: cross-correlation redshifts - methods and systematics characterization",
    year: 2018, pub: "Monthly Notices of the Royal Astronomical Society", bibcode: "2018MNRAS.477.1664G", doi: "10.1093/mnras/sty466",
    adsCites: 86, scholarCites: 117, pos: 40, nauthors: 107, share: 0.0084, alpha: true,
    byline: "Gatti, M.; Vielzeuf, P.; Davis, C.; … Uddin, S. A. et al.",
  },
  {
    title: "OzDES multifibre spectroscopy for the Dark Energy Survey: 3-yr results and first data release",
    year: 2017, pub: "Monthly Notices of the Royal Astronomical Society", bibcode: "2017MNRAS.472..273C", doi: "10.1093/mnras/stx1872",
    adsCites: 99, scholarCites: 151, pos: 98, nauthors: 101, share: 0.0089, alpha: true,
    byline: "Childress, M. J.; Lidman, C.; Davis, T. M.; … Uddin, S. A. et al.",
  },
  {
    title: "Optical observations of LIGO source GW 170817 by the Antarctic Survey Telescopes at Dome A, Antarctica",
    year: 2017, pub: "Science Bulletin", bibcode: "2017SciBu..62.1433H", doi: "10.1016/j.scib.2017.10.006",
    adsCites: 93, scholarCites: 147, pos: 21, nauthors: 33, share: 0.027, alpha: true,
    byline: "Hu, Lei; Wu, Xuefeng; Andreoni, Igor; … Udden [sic], Syed A. et al.",
  },
  {
    title: "The Influence of Host Galaxies in Type Ia Supernova Cosmology",
    year: 2017, pub: "The Astrophysical Journal", bibcode: "2017ApJ...848...56U", doi: "10.3847/1538-4357/aa8df7",
    adsCites: 48, scholarCites: 59, pos: 1, nauthors: 5, share: 0.9, alpha: false,
    byline: "Uddin, Syed A.; Mould, Jeremy; Lidman, Chris et al.",
  },
  {
    title: "Average Spectral Properties of Type Ia Supernova Host Galaxies",
    year: 2017, pub: "The Astrophysical Journal", bibcode: "2017ApJ...850..135U", doi: "10.3847/1538-4357/aa93e9",
    adsCites: 9, scholarCites: 12, pos: 1, nauthors: 3, share: 0.9, alpha: false,
    byline: "Uddin, Syed A.; Mould, Jeremy; Wang, Lifan",
  },
  {
    title: "Cosmological Inference from Host-Selected Type Ia Supernova Samples",
    year: 2017, pub: "Publications of the Astronomical Society of Australia", bibcode: "2017PASA...34....9U", doi: "10.1017/pasa.2017.2",
    adsCites: 8, scholarCites: 8, pos: 1, nauthors: 5, share: 0.9, alpha: false,
    byline: "Uddin, Syed A.; Mould, Jeremy; Lidman, Chris et al.",
  },
  {
    title: "IC 630: Piercing the Veil of the Nuclear Gas",
    year: 2017, pub: "The Astrophysical Journal", bibcode: "2017ApJ...838..102D", doi: "10.3847/1538-4357/aa662d",
    adsCites: 3, scholarCites: 4, pos: 4, nauthors: 5, share: 0.23, alpha: false,
    byline: "Durré, Mark; Mould, Jeremy; Schartmann, Marc; … Ashraf Uddin, Syed et al.",
  },
  {
    title: "Host Galaxy Identification for Supernova Surveys",
    year: 2016, pub: "The Astronomical Journal", bibcode: "2016AJ....152..154G", doi: "10.3847/0004-6256/152/6/154",
    adsCites: 103, scholarCites: 152, pos: 23, nauthors: 60, share: 0.015, alpha: true,
    byline: "Gupta, Ravi R.; Kuhlmann, Steve; Kovacs, Eve; … Uddin, Syed et al.",
  },
  {
    title: "OzDES multifibre spectroscopy for the Dark Energy Survey: first-year operation and results",
    year: 2015, pub: "Monthly Notices of the Royal Astronomical Society", bibcode: "2015MNRAS.452.3047Y", doi: "10.1093/mnras/stv1507",
    adsCites: 105, scholarCites: 164, pos: 51, nauthors: 102, share: 0.0088, alpha: true,
    byline: "Yuan, Fang; Lidman, C.; Davis, T. M.; … Uddin, S. A. et al.",
  },
  {
    title: "Photometric redshift analysis in the Dark Energy Survey Science Verification data",
    year: 2014, pub: "Monthly Notices of the Royal Astronomical Society", bibcode: "2014MNRAS.445.1482S", doi: "10.1093/mnras/stu1836",
    adsCites: 178, scholarCites: 276, pos: 74, nauthors: 78, share: 0.012, alpha: true,
    byline: "Sánchez, C.; Carrasco Kind, M.; Lin, H.; … Uddin, S. A. et al.",
  },
  {
    title: "Constraining a Possible Variation of G with Type Ia Supernovae",
    year: 2014, pub: "Publications of the Astronomical Society of Australia", bibcode: "2014PASA...31...15M", doi: "10.1017/pasa.2014.9",
    adsCites: 36, scholarCites: 66, pos: 2, nauthors: 2, share: 0.45, alpha: false,
    byline: "Mould, Jeremy; Uddin, Syed A.",
  },
  {
    title: "Mapping the Spiral Structure of the Milky Way Galaxy at 21cm Wavelength Using the SALSA Radio Telescope of Onsala Space Observatory",
    year: 2013, pub: "International Journal of Astronomy", bibcode: "", doi: null,
    adsCites: 0, scholarCites: 11, pos: 2, nauthors: 2, share: 0.45, alpha: false,
    byline: "Santo, Tanjila Rahman; Uddin, Syed Ashraf",
    url: "https://scholar.google.com/citations?view_op=view_citation&hl=en&user=3wJqZc8AAAAJ&citation_for_view=3wJqZc8AAAAJ:BKYZGPsuSFYC",
  },
];
