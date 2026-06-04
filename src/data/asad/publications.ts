/* Khan M. B. Asad — complete publication list, a FROZEN local snapshot.
 * Combines NASA ADS (author:"asad,kmb") and Google Scholar (user w09mn4sAAAAJ),
 * matched by title. Papers only (journal & conference); eprints/datasets/thesis excluded.
 * `adsCites`/`scholarCites` are per-source counts. `asadShare` is a per-person credit that
 * rewards placement ONLY when the byline is contribution-ordered: a paper's leading authors
 * (before any alphabetical tail) get 0.9 / r for byline position r (lead author = 90%); an
 * author sitting inside an alphabetical author list gets the position-independent equal share
 * 0.9 / N. `alpha`=true marks the latter case. Snapshot 30 May 2026. Regenerate to refresh. */

export const PUBS_SNAPSHOT = "30 May 2026";
export const SCHOLAR_URL = "https://scholar.google.co.za/citations?user=w09mn4sAAAAJ&hl=en";
export const ADS_AUTHOR_URL = "https://ui.adsabs.harvard.edu/search/q=author%3A%22asad%2Ckmb%22&sort=date%20desc";
export const SCHOLAR_TOTAL_CITES = 2562;
export const SCHOLAR_H_INDEX = 20;
export const SCHOLAR_I10_INDEX = 23;
/* Citations received per calendar year — the Google Scholar profile histogram
 * (snapshot 30 May 2026). The graph omits pre-2014 (~43 citations), so these
 * sum to 2,519 of the 2,562 all-time total. */
export const SCHOLAR_CITES_BY_YEAR: Record<number, number> = {
  2014: 9, 2015: 35, 2016: 83, 2017: 86, 2018: 152, 2019: 179, 2020: 227,
  2021: 271, 2022: 311, 2023: 295, 2024: 312, 2025: 396, 2026: 163,
};
export const SCHOLAR_SINCE = { year: 2021, cites: 1749, hIndex: 17, i10Index: 21 };

export type Pub = {
  title: string; year: number; pub: string; bibcode: string; doi: string | null;
  adsCites: number; scholarCites: number | null; pos: number; nauthors: number;
  asadShare: number; alpha: boolean; byline: string;
  url?: string; // explicit title link (overrides the ADS bibcode link)
};

export const PUBLICATIONS: Pub[] = [
  {
    title: "RGC-Bent: A Novel Dataset for Bent Radio Galaxy Classification",
    year: 2025, pub: "IEEE ICIP 2025", bibcode: "2025arXiv250519249S", doi: "10.1109/ICIP55913.2025.11084387",
    adsCites: 0, scholarCites: 1, pos: 2, nauthors: 10, asadShare: 0.45, alpha: false,
    byline: "Sazzat Hossain, Mir; Asad, Khan Muhammad Bin; Saikia, Payaswini et al.",
    url: "https://doi.org/10.1109/ICIP55913.2025.11084387",
  },
  {
    title: "The SARAO MeerKAT 1.3 GHz Galactic Plane Survey",
    year: 2024, pub: "Monthly Notices of the Royal Astronomical Society", bibcode: "2024MNRAS.531..649G", doi: "10.1093/mnras/stae1166",
    adsCites: 79, scholarCites: 89, pos: 41, nauthors: 130, asadShare: 0.0069, alpha: true,
    byline: "Goedhart, S.; Cotton, W. D.; Camilo, F.; … Asad, K. M. B. et al.",
  },
  {
    title: "Mining mini-halos with MeerKAT I. Calibration and imaging",
    year: 2023, pub: "Monthly Notices of the Royal Astronomical Society", bibcode: "2023MNRAS.520.4410T", doi: "10.1093/mnras/stad391",
    adsCites: 9, scholarCites: 10, pos: 9, nauthors: 10, asadShare: 0.1, alpha: false,
    byline: "Trehaeven, K. S.; Parekh, V.; Oozeer, N.; … Asad, K. M. B. et al.",
  },
  {
    title: "Morphological Classification of Radio Galaxies using Semi-Supervised Group Equivariant CNNs",
    year: 2023, pub: "Procedia Computer Science", bibcode: "2023PrCS..222..601H", doi: "10.1016/j.procs.2023.08.198",
    adsCites: 3, scholarCites: 12, pos: 3, nauthors: 7, asadShare: 0.3, alpha: false,
    byline: "Hossain, Mir Sazzat; Roy, Sugandha; Asad, K. M. B. et al.",
  },
  {
    title: "The 1.28 GHz MeerKAT Galactic Center Mosaic",
    year: 2022, pub: "The Astrophysical Journal", bibcode: "2022ApJ...925..165H", doi: "10.3847/1538-4357/ac449a",
    adsCites: 143, scholarCites: 189, pos: 10, nauthors: 111, asadShare: 0.0081, alpha: true,
    byline: "Heywood, I.; Rammala, I.; Camilo, F.; … Asad, K. M. B. et al.",
  },
  {
    title: "Primary beam effects of radio astronomy antennas - II. Modelling MeerKAT L-band beams",
    year: 2021, pub: "Monthly Notices of the Royal Astronomical Society", bibcode: "2021MNRAS.502.2970A", doi: "10.1093/mnras/stab104",
    adsCites: 70, scholarCites: 85, pos: 1, nauthors: 15, asadShare: 0.9, alpha: false,
    byline: "Asad, K. M. B.; Girard, J. N.; de Villiers, M. et al.",
  },
  {
    title: "Improved upper limits on the 21 cm signal power spectrum of neutral hydrogen at z ≈ 9.1 from LOFAR",
    year: 2020, pub: "Monthly Notices of the Royal Astronomical Society", bibcode: "2020MNRAS.493.1662M", doi: "10.1093/mnras/staa327",
    adsCites: 331, scholarCites: 417, pos: 14, nauthors: 26, asadShare: 0.0346, alpha: true,
    byline: "Mertens, F. G.; Mevius, M.; Koopmans, L. V. E.; … Asad, K. M. B. et al.",
  },
  {
    title: "The 1.28 GHz MeerKAT DEEP2 Image",
    year: 2020, pub: "The Astrophysical Journal", bibcode: "2020ApJ...888...61M", doi: "10.3847/1538-4357/ab5d2d",
    adsCites: 141, scholarCites: 183, pos: 8, nauthors: 104, asadShare: 0.0087, alpha: true,
    byline: "Mauch, T.; Cotton, W. D.; Condon, J. J.; … Asad, K. M. B. et al.",
  },
  {
    title: "Constraining the intergalactic medium at z ≍ 9.1 using LOFAR Epoch of Reionization observations",
    year: 2020, pub: "Monthly Notices of the Royal Astronomical Society", bibcode: "2020MNRAS.493.4728G", doi: "10.1093/mnras/staa487",
    adsCites: 110, scholarCites: 131, pos: 17, nauthors: 22, asadShare: 0.0409, alpha: true,
    byline: "Ghara, R.; Giri, S. K.; Mellema, G.; … Asad, K. M. B. et al.",
  },
  {
    title: "Primary beam effects of radio astronomy antennas - I. Modelling the Karl G. Jansky Very Large Array (VLA) L-band beam using holography",
    year: 2019, pub: "Monthly Notices of the Royal Astronomical Society", bibcode: "2019MNRAS.485.4107I", doi: "10.1093/mnras/stz702",
    adsCites: 18, scholarCites: 27, pos: 4, nauthors: 8, asadShare: 0.225, alpha: false,
    byline: "Iheanetu, K.; Girard, J. N.; Smirnov, O.; … Asad, K. M. B. et al.",
  },
  {
    title: "Primary Beams of the Meer KAT Radio Telescope: Measurements and Simulations",
    year: 2019, pub: "2019 IEEE International Symposium on Antennas and Propagation and USNC-URSI Radio Science Meeting", bibcode: "2019aps..conf..192D", doi: "10.1109/APUSNCURSINRSM.2019.8888774",
    adsCites: 0, scholarCites: 1, pos: 2, nauthors: 6, asadShare: 0.45, alpha: false,
    byline: "de Villiers, D. I. L.; Asad, K. M. B.; Smirnov, O. et al.",
  },
  {
    title: "Revival of the Magnetar PSR J1622-4950: Observations with MeerKAT, Parkes, XMM-Newton, Swift, Chandra, and NuSTAR",
    year: 2018, pub: "The Astrophysical Journal", bibcode: "2018ApJ...856..180C", doi: "10.3847/1538-4357/aab35a",
    adsCites: 159, scholarCites: 221, pos: 20, nauthors: 208, asadShare: 0.0043, alpha: true,
    byline: "Camilo, F.; Scholz, P.; Serylak, M.; … Asad, K. M. B. et al.",
  },
  {
    title: "Wide-field LOFAR-LBA power-spectra analyses: impact of calibration, polarization leakage, and ionosphere",
    year: 2018, pub: "Monthly Notices of the Royal Astronomical Society", bibcode: "2018MNRAS.478.1484G", doi: "10.1093/mnras/sty1095",
    adsCites: 34, scholarCites: 47, pos: 6, nauthors: 12, asadShare: 0.075, alpha: true,
    byline: "Gehlot, B. K.; Koopmans, L. V. E.; de Bruyn, A. G.; … Asad, K. M. B. et al.",
  },
  {
    title: "Polarization leakage in epoch of reionization windows - III. Wide-field effects of narrow-field arrays",
    year: 2018, pub: "Monthly Notices of the Royal Astronomical Society", bibcode: "2018MNRAS.476.3051A", doi: "10.1093/mnras/sty258",
    adsCites: 28, scholarCites: 97, pos: 1, nauthors: 6, asadShare: 0.9, alpha: false,
    byline: "Asad, K. M. B.; Koopmans, L. V. E.; Jelić, V. et al.",
  },
  {
    title: "Simulations of systematic direction-dependent instrumental effects in intensity mapping experiments",
    year: 2018, pub: "Monthly Notices of the Royal Astronomical Society", bibcode: "2018MNRAS.481.2694A", doi: "10.1093/mnras/sty2433",
    adsCites: 7, scholarCites: 10, pos: 4, nauthors: 5, asadShare: 0.225, alpha: false,
    byline: "Ansah-Narh, T.; Abdalla, F. B.; Smirnov, O. M.; … Asad, K. M. B. et al.",
  },
  {
    title: "Accurate beam modeling using sparse representations of VLA holography measurements",
    year: 2018, pub: "SF2A-2018: Proceedings of the Annual meeting of the French Society of Astronomy and Astrophysics", bibcode: "2018sf2a.conf..305G", doi: null,
    adsCites: 0, scholarCites: 0, pos: 4, nauthors: 8, asadShare: 0.225, alpha: false,
    byline: "Girard, J. N.; Iheanetu, K.; Smirnov, O. M.; … Asad, K. M. B. et al.",
  },
  {
    title: "MeerKAT Primary Beam Models: Derivation and Application In Calibration and Imaging",
    year: 2018, pub: "2018 International Conference on Electromagnetics in Advanced Applications (ICEAA)", bibcode: "2018icea.conf..139S", doi: "10.1109/ICEAA.2018.8520434",
    adsCites: 0, scholarCites: 1, pos: 2, nauthors: 12, asadShare: 0.45, alpha: false,
    byline: "Smirnov, O. M.; Asad, K. M. B.; Girard, J. N. et al.",
  },
  {
    title: "Upper Limits on the 21 cm Epoch of Reionization Power Spectrum from One Night with LOFAR",
    year: 2017, pub: "The Astrophysical Journal", bibcode: "2017ApJ...838...65P", doi: "10.3847/1538-4357/aa63e7",
    adsCites: 291, scholarCites: 395, pos: 7, nauthors: 28, asadShare: 0.0321, alpha: true,
    byline: "Patil, A. H.; Yatawatta, S.; Koopmans, L. V. E.; … Asad, K. M. B. et al.",
  },
  {
    title: "Probing ionospheric structures using the LOFAR radio telescope",
    year: 2016, pub: "Radio Science", bibcode: "2016RaSc...51..927M", doi: "10.1002/2016RS006028",
    adsCites: 94, scholarCites: 137, pos: 8, nauthors: 27, asadShare: 0.0333, alpha: true,
    byline: "Mevius, M.; van der Tol, S.; Pandey, V. N.; … Asad, K. M. B. et al.",
  },
  {
    title: "Polarization leakage in epoch of reionization windows - II. Primary beam model and direction-dependent calibration",
    year: 2016, pub: "Monthly Notices of the Royal Astronomical Society", bibcode: "2016MNRAS.462.4482A", doi: "10.1093/mnras/stw1863",
    adsCites: 32, scholarCites: 54, pos: 1, nauthors: 14, asadShare: 0.9, alpha: false,
    byline: "Asad, K. M. B.; Koopmans, L. V. E.; Jelić, V. et al.",
  },
  {
    title: "Linear polarization structures in LOFAR observations of the interstellar medium in the 3C 196 field",
    year: 2015, pub: "Astronomy and Astrophysics", bibcode: "2015A&A...583A.137J", doi: "10.1051/0004-6361/201526638",
    adsCites: 83, scholarCites: 109, pos: 10, nauthors: 24, asadShare: 0.0375, alpha: true,
    byline: "Jelić, V.; de Bruyn, A. G.; Pandey, V. N.; … Asad, K. M. B. et al.",
  },
  {
    title: "Polarization leakage in epoch of reionization windows - I. Low Frequency Array observations of the 3C196 field",
    year: 2015, pub: "Monthly Notices of the Royal Astronomical Society", bibcode: "2015MNRAS.451.3709A", doi: "10.1093/mnras/stv1107",
    adsCites: 66, scholarCites: 42, pos: 1, nauthors: 28, asadShare: 0.9, alpha: false,
    byline: "Asad, K. M. B.; Koopmans, L. V. E.; Jelić, V. et al.",
  },
  {
    title: "Simulating the 21 cm forest detectable with LOFAR and SKA in the spectra of high-z GRBs",
    year: 2015, pub: "Monthly Notices of the Royal Astronomical Society", bibcode: "2015MNRAS.453..101C", doi: "10.1093/mnras/stv1640",
    adsCites: 24, scholarCites: 28, pos: 4, nauthors: 29, asadShare: 0.031, alpha: true,
    byline: "Ciardi, B.; Inoue, S.; Abdalla, F. B.; … Asad, K. et al.",
  },
  {
    title: "Lunar occultation of the diffuse radio sky: LOFAR measurements between 35 and 80 MHz",
    year: 2015, pub: "Monthly Notices of the Royal Astronomical Society", bibcode: "2015MNRAS.450.2291V", doi: "10.1093/mnras/stv746",
    adsCites: 23, scholarCites: 31, pos: 7, nauthors: 95, asadShare: 0.0095, alpha: true,
    byline: "Vedantham, H. K.; Koopmans, L. V. E.; de Bruyn, A. G.; … Asad, K. M. B. et al.",
  },
  {
    title: "Initial LOFAR observations of epoch of reionization windows. II. Diffuse polarized emission in the ELAIS-N1 field",
    year: 2014, pub: "Astronomy and Astrophysics", bibcode: "2014A&A...568A.101J", doi: "10.1051/0004-6361/201423998",
    adsCites: 92, scholarCites: 128, pos: 5, nauthors: 109, asadShare: 0.0083, alpha: true,
    byline: "Jelić, V.; de Bruyn, A. G.; Mevius, M.; … Asad, K. M. B. et al.",
  },
  {
    title: "Constraining the epoch of reionization with the variance statistic: simulations of the LOFAR case",
    year: 2014, pub: "MNRAS", bibcode: "2014MNRAS.443.1113P", doi: "10.1093/mnras/stu1178",
    adsCites: 60, scholarCites: 77, pos: 7, nauthors: 30, asadShare: 0.03, alpha: true,
    byline: "Patil, Ajinkya H.; Zaroubi, Saleem; Chapman, Emma; … Asad, Khan M. B. et al.",
  },
  {
    title: "Discovery of the correspondence between intra-cluster radio emission and a high pressure region detected through the Sunyaev-Zel'dovich effect",
    year: 2011, pub: "Astronomy and Astrophysics", bibcode: "2011A&A...534L..12F", doi: "10.1051/0004-6361/201117788",
    adsCites: 25, scholarCites: 40, pos: 8, nauthors: 12, asadShare: 0.1125, alpha: false,
    byline: "Ferrari, C.; Intema, H. T.; Orrù, E.; … Asad, K. M. et al.",
  },
];
