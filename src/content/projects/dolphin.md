---
title: "Dolphin: A generative model for spiral-galaxy light profiles"
acronym: "Dolphin"
supervisor: "Anowar Jaman Shajib"
mentors: ["Shah Mohammad Bahauddin"]
stage: "completed"
leads: ["Nafis Sadik Nihal"]
startDate: "2025"
endDate: "Jun 2026"
summary: "A generative neural network that produces realistic spiral-galaxy light distributions — an informative, empirical prior for strong-lens modelling in lenstronomy."
status: "published"
---

In strong-lensing systems, the background lensed galaxies are often star-forming spirals with complex morphologies. Reconstructing that light during lens modelling is numerically hard: current procedures impose smoothness regularization on the reconstructed light, but residual artefacts remain, and the results can look unrealistic. A more informative **prior** on the light distribution would help — but a spiral galaxy's intricate structure cannot be captured by a conventional analytic function whose parameters can be constrained.

**Dolphin** solves this by developing a **generative neural network** — for example a normalizing flow or a diffusion model — that maps a few tens of input parameters to a realistic spiral-galaxy light distribution. This learned model then acts as a function with a built-in empirical prior during lens modelling. It is trained on galaxy image libraries from the **Hubble Space Telescope** and **JWST**.

As a deliverable, the trained model is integrated into the widely used lens-modelling package **lenstronomy**, making the method readily usable.
