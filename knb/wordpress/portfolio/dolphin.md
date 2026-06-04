---
title: "Dolphin: A generative model for spiral galaxy light profile"
slug: "dolphin"
wp_id: "5029"
url: "https://cassa.site/entry/dolphin/"
date: "2025-03-26 12:23:49"
status: "publish"
categories:
  - nicename: "galaxies"
    name: "Galaxies"
thumbnail_id: "5040"
---

**Supervisor**: Anowar J Shajib, PhD, KICP Fellow, University of Chicago, USA.

**Supervisor**: Shah Mohammad Bahauddin, PhD; University of Colorado, Boulder; mentor.

**Postbac Research Assistant**: Nafis Sadik Nihal.

Galaxies come in different shapes and morphologies. Classifying galaxy morphology is already a classic problem in Astronomy for which machine learning has found a popular application. In strong lensing systems, the background lensed galaxies are often star-forming, spiral galaxies with complex morphologies. In the process of modeling lenses, the complex morphology of these galaxies need to be reproduced. Given the high numerical complexity of lens modeling, such reconstructions often end up being non-realistic without additional priors or conditions. To solve that issue, currently used procedures impose regularization condition on the smoothness of the reproduced light distribution. However, even then, residual artifacts exists in the reconstructed light distribution making it look non-realistic to some extent. The problem could be alleviated with a more informative prior on the light distribution. However, given the complex look of a spiral galaxy, it is not feasible to describe it with a numerical function in a conventional manner that allows to put priors on the function parameters. As a solution, this project will develop a generative neural network, e.g., a normalizing flow or a diffusion model, that can take tens of input parameters to output a light distribution of a spiral galaxy. This generative model then can be used as a function with built-in empirical prior when performing lens modeling. The training will be done using galaxy image libraries from the Hubble Space Telescope and the JWST. As a deliverable for the project, the trained model will be incorporated in the popular lens modeling software, lenstronomy, to make the developed methodolgy readily usable by future users. Additionally, the project will culminate in a peer-reviewed publication.
