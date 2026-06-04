---
title: "CHronOS: Cosmic Hydrogen Observation and Simulation"
slug: "chronos"
wp_id: "3538"
url: "https://cassa.site/entry/chronos/"
date: "2022-01-01 15:20:39"
status: "publish"
categories:
  - nicename: "intergalactic-medium"
    name: "Intergalactic medium"
  - nicename: "meridian"
    name: "MerIDiAn"
thumbnail_id: "3540"
---

The goal of this lifelong project is to facilitate the detection of cosmic neutral hydrogen (HI) from the dark ages and the cosmic dawn (the first 400 million years of the universe). HI emits a signal of 21-cm wavelength (1420 MHz) which can be used to create a tomographic map of the universe in three dimensions, the third dimension being time. The most advanced single-dish or array radio telescopes (ART) that exist today cannot detect the 21-cm signal, but some telescopes are getting very close to detecting its power spectrum (PS). One of the main motivations behind building the largest ART, the Square Kilometre Array (SKA), is the mapping of HI via the 21-cm signal.

In order to detect the signal with substantial signal-to-noise ratio (SNR), the systematic effects of the instruments and the contamination by various extragalactic and Galactic foregrounds must be known with high precision. Moreover, after removing the foregrounds with the associated instrumental effects, the residual noise-like signal must match with the simulated emission of cosmic hydrogen predicted by theoretical models. Therefore, simulation, instrumentation, theory and observation (SITO), all four aspects of science are essential for this project.

[Asad et al. (2015)](https://doi.org/10.1093/mnras/stv1107) published a measurement of one of the effects coming from a combination of systematics and foreground, the polarization leakage. Two follow-up papers (Asad et al. [2016](https://doi.org/10.1093/mnras/stw1863), [2018](https://doi.org/10.1093/mnras/sty258)) further constrained the effect. These three papers constituted the PhD thesis of Asad titled "[Polarization Leakage in Epoch of Reionization Windows](https://hdl.handle.net/11370/016b3e0e-6e95-495e-8a0f-6a9fd2d6c93b)."

In 2024, Akbar Ahmed Chowdhury finished his BSc thesis, as part of a physics major at IUB, titled "[On the Power of Cosmic Hydrogen](https://drive.google.com/file/d/1un6dTOqC8W7wfOMGpgWt302voCp4d_hg/view?usp=sharing)" about simulating the 21-cm signal coming from HI using [21cmFAST](https://github.com/21cmfast/21cmFAST) and analyzing the PS of its brightness temperature. This started the simulation aspect of this project.

Currently we are working on simulating the observations of cosmic HI with various foregrounds and systematic effects in our high-performance computing (HPC) server called Timaeus.

This project is related to the instrumental project [PrimaBERA](https://cassa.site/entry/primabera/).

**Supervisor**: Khan Asad.
