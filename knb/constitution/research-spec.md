# CASSA Research Page — Content Spec

Source of truth: **CASSA Constitution v2.0** (`CASSA_Constitution_v2.0.tex`, dated "1 July 2026"), cross-checked against the v1.2→v2.0 change log and the live cassa.site People pages. Clause numbers below refer to v2.0 unless noted.

> **CRITICAL FINDING — named research groups.** The groups named in the build brief (**CHronOS, GATE, MATRiX**) **do NOT appear anywhere** in Constitution v2.0, its `.bak`, the change log, or the review/improvement notes. They are not defined entities. **Do not invent or display them.** In v2.0, research is organized into **two scientific Divisions — OTA and RSS** (cl. 10), each led by a Director and committed to a research programme. The only other named research entities are CASSA's **predecessors**: ARGI and COALab (cl. 5). If group-style branding is wanted later, it must come from a future constitution revision or an explicit decision — flag to the user, do not fabricate.

---

## How research is organized (the spine of the page)

Per **cl. 10**: "Research activities are organized into two **scientific divisions**, each led by a Director." Establishing any new division and appointing Directors/ED requires a **Vice Chancellor's Office Order** (cl. 10.2). Each active division must have **≥1 Director and ≥1 Core Member** committed to its research programme.

| Division | Code | Focus (verbatim, cl. 10.1/10.1.x) | Director (lead) |
|---|---|---|---|
| Optical and Time-domain Astronomy Division | **OTA** | "optical and time-domain observations, transient phenomena, and supernova cosmology" | **Syed Ashraf Uddin** (Director); also holds executive control of IUB Observatory |
| Radio and Space Science Division | **RSS** | "radio and x-ray observations, space-based science, and high-energy astrophysics" | **Khan Muhammad Bin Asad** (Director & ED; HPC Custodian) |

Note: the constitution does not explicitly assign each Director to a specific division in the Directors clause (cl. 11) or Appendix A. The OTA↔SA Uddin / RSS↔KMB Asad mapping above is inferred from Appendix G (Observatory Manual: SA Uddin = OTA custodian, KMB Asad = RSS/START custodian) and from members' stated research interests. **Confirm with the user before publishing the lead names against divisions.**

This two-division model (the "organogram clause") is the headline structural change in v2.0; v1.2 had no formal divisions. There are no sub-units, labs, wings, or named groups beneath the divisions in v2.0.

---

## Proposed page sections

### 1. Hero / intro — "Research at CASSA"
**Contains:** one-line identity + the SITO framing.
- Identity (cl. 1): CASSA is "an autonomous multidisciplinary **research center** of Independent University, Bangladesh (IUB) dedicated to the *intermingled* fields of astronomy and astrophysics (A&A), and space and planetary science and engineering (SPSE)."
- Research mission tagline (cl. 31): "to conduct cutting-edge research in **simulation, instrumentation, theory, and observation (SITO)**, and to publish the results in peer-reviewed international journals and conference proceedings."
- Optional vision line (cl. 29): "to be the pathfinder in Bangladesh, be impactful in South Asia, and be a part of the international community in the fields of A&A and SPSE."

### 2. The two Divisions (primary content block)
**Contains:** two cards/columns, one per division, using the table above. For each: name, code, verbatim focus statement, lead Director, and the members/assets tied to it.
- **OTA** — optical & time-domain, transients, supernova cosmology. Operates **IUB Observatory** (Kaliakair, 0.5 m) exclusively and is custodian of the optical instruments at IUB CORE. Members whose interests sit here: SA Uddin (supernova cosmology, cosmic distance scales, transient astronomy), LA Mowla (formation & evolution of galaxies since cosmic dawn), SL Ahad (galaxy evolution in groups & clusters), TS Tanvir (star/galaxy/planet formation), AJ Shajib (strong gravitational lensing, cosmology, galaxy evolution), T Karim (cosmology, dark energy, dark matter).
- **RSS** — radio & x-ray, space-based science, high-energy astrophysics. Custodian of **START** (radio) at IUB CORE; runs the **HPC (Timaeus)**. Members whose interests sit here: KMB Asad (dark ages, cosmic dawn & epoch of reionization, galaxy clusters, radio & x-ray observation), MH Chowdhury (photonics — instrumentation), MA Momen (theoretical physics), TT Ananna (accretion-rate distributions of AGNs), SM Bahauddin (physics of the solar corona, heliophysics, spectroscopy, magnetohydrodynamics), P Saikia (accretion & ejection in compact objects).

> Member-to-division grouping above is **inferred from research interests**, not stated clause-by-clause in v2.0. Present as "research interests align with" rather than hard assignments unless the user confirms.

### 3. Research themes / interests (derived from people)
**Contains:** a thematic cloud or grouped list distilled from members' stated interests (live-site taglines + Appendix A). v2.0 does **not** enumerate named "research areas"; these themes are the de facto areas evidenced by the team:
- Cosmology: dark ages / cosmic dawn / epoch of reionization (Asad); dark energy & dark matter (Karim); strong gravitational lensing (Shajib).
- Galaxy formation & evolution: since cosmic dawn (Mowla); in groups & clusters (Ahad); star/galaxy/planet formation (Tanvir).
- Time-domain & supernova cosmology, cosmic distance scales, transients (Uddin).
- High-energy & compact objects: AGN accretion-rate distributions (Ananna); accretion & ejection in compact objects (Saikia); radio & x-ray observation, galaxy clusters (Asad).
- Solar & heliophysics: solar corona, spectroscopy, MHD (Bahauddin).
- Instrumentation / enabling: photonics (Chowdhury); theoretical physics (Momen).
- Cross-cutting methods: simulation, instrumentation, theory, observation (SITO).

### 4. Field definitions (sidebar or expandable)
**Contains:** the constitution's own definitions block (verbatim, "Definitions" subsection) — useful for a glossary panel:
- **Astronomy** — "an interdisciplinary natural science that studies extraterrestrial (celestial) objects, systems, and processes, and the Universe as a whole, using mathematical, statistical, computational, and natural sciences, and engineering technologies."
- **Space and planetary science and engineering (SPSE)** — "an interdisciplinary field integrating natural and engineering sciences to study extraterrestrial objects, systems, and processes, the solar system and its space environment, and Earth from space, for scientific exploration, technological development, and practical utilisation."
- **Astrophysics** — "a branch of physics and astronomy that uses physics to study extraterrestrial objects, systems, and processes."
- **Cosmology** — "a branch of astronomy and astrophysics (A&A) that studies the Universe and its evolution globally as a single object…"

### 5. Research infrastructure
**Contains:** the facilities that enable research (Appendices C, G, H). Good for an "infrastructure" strip with icons.
- **HPC — Timaeus** (asset C001): CASSA's high-performance computer; SLURM scheduler, fair-share, 72 h default job limit, 60-day scratch purge, 3-2-1 backup. Custodian: KMB Asad; day-to-day ops: Manager (Science). Designed to scale toward a future supercomputing facility. Acknowledgement string required in papers (Appendix H).
- **IUB CORE** (Campus Observatory for Research and Education): rooftop educational observatory on the IUB main academic building; planned **11–14 inch main optical telescope** (OTA custodianship) + **START** radio (RSS) + portable optical scopes (Ashvin 1/2 110 mm, 200 mm, 80 mm). Managed jointly by both divisions. (Appendix G.1)
- **IUB Observatory** (Kaliakair campus): mid-research-grade **0.5 m optical telescope** in an autotracking dome; **OTA-only**, full executive control by SA Uddin. (Appendix G.2)
- **START** — Small Transient Array Radio Telescope (asset T001; designed by Shoaib Mirza, "TART array"). RSS instrument.
- Both observatories run under the **Observatory Manual (Appendix G)**: env. closure thresholds, observer certification, FITS data policy, 12-month proprietary period.

### 6. Research mission action plans (roadmap)
**Contains:** the nine action plans verbatim/condensed from **cl. 31.1–31.9** — present as a "where we're going" list:
1. Develop international collaborations for access to leading ground-based and space telescopes.
2. Seek research funding via grants (IUB, Bangladeshi govt & private sector, international orgs).
3. Upgrade the HPC server regularly to increase computing capacity.
4. Support IUB departments in A&A/SPSE faculty recruitment, prioritising research strength.
5. Promote creation of **Postdoctoral Research Fellowships** within CASSA.
6. Partner with IUB's Office for Graduate Studies & Research and SETS departments on a **PhD program roadmap** for A&A/SPSE.
7. Campaign for **IUB CORE** (educational observatory) and **IUB Observatory** (research observatory, Kaliakair).
8. Advance Bangladesh's **space economy** — space-research jobs, collaborations with international space agencies and missions.
9. Organize regular seminars, symposia, talks, conferences (online/offline/hybrid).

### 7. Who does the research — membership categories (research-relevant)
**Contains:** the membership tiers that define research participation (cl. 11–17). Full detail in `org-summary.md`; the research-relevant subset:
- **Directors** (cl. 11) — lead a Division; secure grants, recruit/supervise, oversee publications & outreach. Term = tenure at IUB. **ED** rotates biennially between Division Directors.
- **Core Member (CM)** (cl. 12) — IUB full-time faculty with a PhD in A&A/SPSE (or PhD in another field + major CASSA publications, or founding CM). Leads ≥1 project, supervises students, publishes ≥1 CASSA paper/yr, applies for ≥1 grant/yr. **Founding** ⇒ M H Chowdhury, M A Momen.
- **Associate Member (AM)** (cl. 12) — active postdoctoral researcher in a CASSA-relevant field at any institution; supervises students, applies for grants, ≥1 talk/yr. Eligible for **Lifetime AM** after two consecutive terms (cl. 12.3). (8 founding AMs — see roster.)
- **Graduate (Associate) Member** (cl. 12, table label "Graduate Member (GM)"; the change log & live site use **Graduate Associate Member / GAM**) — PhD student/candidate in a CASSA-relevant field; AM duties + mentors CASSA students on MSc/PhD/scholarships.
- **Research Affiliate / Technical Affiliate** (cl. 14) — non-CM contributors who do research / technical work on CASSA projects; use CASSA affiliation on joint outputs / are acknowledged.
- **Research Assistants (RA: Graduate / Postbac / Undergraduate)** (cl. 15) — conduct research under a Director/CM/AM; contribute to publications & outreach. Each RA has a **primary + secondary supervisor** (cl. 15.1).
- **Research Interns (RI)** (cl. 16) — unpaid short-term equivalents of RAs.
- **"Major CASSA-affiliated publications"** for CM eligibility (cl. 12.4) = "at least one peer-reviewed article in a **Q1 journal**, or at least two papers in top-ranked international conferences," with CASSA affiliation.

### 8. Scientific Advisory Board (governance of research direction)
**Contains:** **cl. 18** — CASSA constitutes an **SAB** of 3–5 external researchers (≥2 of international standing), appointed by Core Meeting vote for 3-year terms; meets ≥annually, reviews CASSA's research programme and scientific direction, and submits a written report to the VC Office. May be drawn from AM ranks but must be external to IUB. (No SAB members are named yet in v2.0.)

### 9. Affiliation & collaboration policy (optional footer)
**Contains:** how research output is attributed and how partners join.
- All A&A/SPSE papers by CMs carry **CASSA affiliation**; joint faculty papers carry **both CASSA and department** affiliation (cl. 4.4, 12).
- Collaborations governed by LoA/U, MoA/U (cl. 17.1); adjunct/visiting researchers may become AMs (cl. 17.2).
- **IP** (cl. 23): IUB-funded research IP is jointly owned by IUB + PI; independently funded follows funder terms; absent terms, PI owns but grants CASSA non-exclusive cite/publicise rights. HPC data per Appendix H.

---

## Quick-reference facts for the page
- **2 divisions:** OTA, RSS (cl. 10). No labs/wings/named groups in v2.0.
- **Predecessors:** Astronomy Research Group, IUB (**ARGI**, founded mid-2020) → Computational and Observational Astronomy Lab (**COALab**, late 2023) → CASSA (cl. 5). All COALab personnel/assets/funding/policies fold into CASSA.
- **Approval chain:** BOT (95th, 1 Dec 2024) → AC (106th, 9 Jul 2025) → Syndicate (104th, 17 Jul 2025) → VC Office Order **14 Aug 2025**. Constitution v1.2 adopted 14 Aug 2025; v2.0 is the current draft.
- **Methods acronym:** SITO = Simulation, Instrumentation, Theory, Observation.
- **Active research projects (named on live site / Durbin manual / Appendix B):** Sparkler (Mowla), Dolphin (Shajib), RGC, Supernova Cosmology (Uddin), AUDIT (Momen), ARC-HALO (R R Hossain), plus radio/LOFAR/SKA big-data work (Asad). These can seed a "Projects" subsection or feed the existing portfolio extraction.
