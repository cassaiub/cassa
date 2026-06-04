/* Google Scholar citation counts, keyed by ADS bibcode.
 *
 * Google Scholar has NO API and rate-limits/CAPTCHAs automated access, so unlike
 * the ADS snapshot these can't be refreshed by a script. They were gathered
 * semi-manually: per-paper exact-title search on scholar.google.com, backed by
 * the authors' Scholar profiles for papers that got rate-limited —
 *   Shajib  (user LJ65qBAAAAAJ)  · lensing / TDCOSMO / AGEL / cosmography
 *   Asad    (user w09mn4sAAAAJ)  · radio / MeerKAT / LOFAR
 *   Uddin   (user 3wJqZc8AAAAJ)  · supernovae
 * Counts are a point-in-time snapshot and will drift; to refresh, re-run the
 * lookups and update the numbers (and SCHOLAR_UPDATED). The publications page
 * joins these to the ADS snapshot by bibcode; a paper absent here renders "—".
 *
 * Note: for very recent papers Google Scholar sometimes splits citations across
 * a preprint and a published record, so a count can differ slightly from ADS.
 */
export const SCHOLAR_UPDATED = "2026-06-02";

export const SCHOLAR_CITATIONS: Record<string, number> = {
  "2026A&A...708A.166H": 23,  // The Local Distance Network (community H0 report)
  "2026ApJ..1000..178K": 1,   // The Search for Stable Nickel
  "2026JOSS...11.9685H": 0,    // JAXtronomy: A JAX port of lenstronomy
  "2026FrASS..1397722M": 0,    // DKIST/VTF acoustic source wavefronts
  "2026ApJ..1001...45J": 0,    // Obscured AGN at z < 1.5 (GOODS)
  "2026A&A...707A.314S": 2,    // TDCOSMO XXIV — JWST-NIRSpec lens kinematics
  "2026NatSD..13..712R": 3,    // SuryaBench heliophysics ML dataset
  "2026ApJ...998..101P": 2,    // Carnegie SN — fast-declining Type Ia
  "2026A&A...706A.270P": 1,    // TDCOSMO XXIII — H0 from HE 1104−1805
  "2026ApJ...998..303L": 1,    // Orbital anisotropy in lensing-dynamics
  "2026AJ....171...57B": 5,    // AGEL Survey Data Release 2
  "2026A&A...705A..13M": 1,    // TDCOSMO XXI — SL2S velocity dispersions
  "2025A&A...703A.117K": 15,   // TDCOSMO XIX — sub-percent velocity dispersion
  "2025ApJ...993..124B": 7,    // Double-source-plane lenses (AGEL)
  "2025A&A...703A.118W": 2,    // TDCOSMO XX — WFI2033 with JWST imaging
  "2025A&A...702L..12S": 15,   // JWST NIRSpec spectral resolution
  "2025ApJ...992...40S": 8,    // DOLPHIN forward-modeling pipeline
  "2025JCAP...10..043T": 3,    // Line-of-sight selection biases in lensing
  "2025ApJ...991..152D": 1,    // The Wrath of KAN — 21 cm emulation
  "2025A&A...702A.271A": 2,    // Intragroup light in KiDS+GAMA groups
  "2025A&A...702A.134M": 2,    // Type Ia SNe NIR light curves (PCA)
  "2025PhRvD.112f3508S": 45,   // Scalar-field dark energy models
  "2025ApJ...990...51K": 12,   // SLACS lens galaxies kinematics I
  "2025ApJ...991...72S": 7,    // Cosmography with DSP lens AGEL150745
  "2025A&A...701A.280W": 8,    // GLaD GPU lensing + dynamics modeling
  "2025ApJ...991...86R": 2,    // Resolved kinematics, star-forming galaxy z~2
  "2025A&A...700A..92S": 2,    // TDCOSMO XVIII — J1721+8842 zigzag lens
  "2025AJ....170...44E": 11,   // STRIDES lensed quasars via NPE
  "2025A&A...699A.259A": 1,    // Environment vs internal structure of ellipticals
  "2025RSPTA.38340117S": 27,   // Strong lenses from Vera C. Rubin Observatory
  "2025RSPTA.38340134S": 24,   // Multi-messenger gravitational lensing
  "2025ApJ...985...83M": 13,   // Metallicity scatter, protocluster z=7.88
  "2024Natur.636..332M": 109,  // Low-mass galaxy from star clusters (Nature)
  "2024MNRAS.531..649G": 90,   // SARAO MeerKAT 1.3 GHz Galactic Plane Survey
  "2023MNRAS.520.4410T": 10,   // Mining mini-halos with MeerKAT I
  "2023PrCS..222..601H": 12,   // Morphological classification of radio galaxies
  "2022ApJ...925..165H": 189,  // 1.28 GHz MeerKAT Galactic Center Mosaic
  "2021MNRAS.502.2970A": 85,   // Primary beam effects II — MeerKAT L-band
  "2020MNRAS.493.1662M": 417,  // 21 cm power spectrum upper limits, LOFAR
  "2020MNRAS.493.4728G": 131,  // Intergalactic medium z~9.1, LOFAR EoR
  "2020ApJ...888...61M": 183,  // 1.28 GHz MeerKAT DEEP2 Image
};
