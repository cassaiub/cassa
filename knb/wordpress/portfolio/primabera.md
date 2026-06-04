---
title: "PrimaBERA: Primary Beam Effects of Radio Astronomy Antennas"
slug: "primabera"
wp_id: "3541"
url: "https://cassa.site/entry/primabera/"
date: "2021-03-01 15:24:41"
status: "publish"
categories:
  - nicename: "meridian"
    name: "MerIDiAn"
  - nicename: "projects"
    name: "Projects"
  - nicename: "radio-instrumentation"
    name: "Radio instrumentation"
thumbnail_id: "2869"
---

The goal of our project PrimaBERA is to maintain EIDOS (a software described below) and extend it to include the models of many other modern radio telescopes.

The observations of a radio telescope is a multiplication of its primary beam (reception equivalent of the radiation pattern) and the sky in the Fourier plane, meaning the observation is a **convolution** of the beam and the sky. Aside from this convolution the image created by a radio telescope is also modulated by the beam. In order produce high-quality images (good resolution and dynamic range), removing the effects of the primary beam is essential. The objective of PrimaBERA is to make usable and lightweight models of the primary beams of various radio telescope antennas using analytical functions.

[Ihenaetu et al. (2019)](https://doi.org/10.1093/mnras/stz702) published a sparse representation (model) of the primary beams of the Karl G. Jansky Very Large Array (VLA) located in New Mexico, USA. [Asad et al. (2021)](https://doi.org/10.1093/mnras/stab104) used the same technique to publish a model of the primary beams of MeerKAT, the "meer" Karoo Array Telescope located in the Karoo region of South Africa. A python package for such modeling called [EIDOS](https://github.com/ratt-ru/eidos) was also released.

Currently we are working on creating a sparse representation of the primary beams of LOFAR in synergy with the [CHronOS](https://cassa.site/entry/chronos/) project.

**Supervisor**: Khan Asad.
