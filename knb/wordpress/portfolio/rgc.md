---
title: "RGC: Radha Gobinda Chandra, a Radio Galaxy Classifier"
slug: "rgc"
wp_id: "3543"
url: "https://cassa.site/entry/rgc/"
date: "2023-01-01 15:25:42"
status: "publish"
categories:
  - nicename: "galaxies"
    name: "Galaxies"
  - nicename: "meridian"
    name: "MerIDiAn"
thumbnail_id: "3318"
---

The goal of this project is to develop a python package for classifying different morphological types of radio Active Galactic Nuclei (AGN) using artificial neural networks (ANN) and maintain the package through regular upgrades. The package is called RGC after Radha Gobinda Chandra (1878-1975), a Bangladeshi-Indian amateur astronomer who contributed more than fifty thousand observations to the American Association of Variable Star Observers (Maitra 2021) and reported the observation of Halley's Comet in 1910 in Bangla (Kapoor 2023).

In [Hossain et al. (2023)](https://doi.org/10.1016/j.procs.2023.08.198), we published a semi-supervised model based on Convolutional Neural Networks (CNN) that can classify the Fanaroff-Riley types I and II very efficiently. The labeled and unlabeled images used for training and testing this model were all taken from [FIRST](https://sundog.stsci.edu/) (Faint Images of the Radio Sky at Twenty-Centimeters), an imaging survey conducted by the Karl G. Jansky Very Large Array (VLA) located in New Mexico, USA.

In 2024, we extended the model to classify two types of bent radio AGNs: wide-angled tail (WAT) and narrow-angled tail (NAT). A conference paper has been submitted in Jan 2025 that shows the detailed pre-processing of around 700 labeled images of bent AGN taken from FIRST. We are currently working on a journal paper based on the efficiency of our models in classifying these. The unlabeled dataset contains almost 20,000 images of radio AGN.

Currently we are also working on extending our models even further to include images from more modern telescopes. For example, the images of radio AGN taken by LOFAR (Low Frequency Array, the Netherlands) as part of [LOTSS](https://lofar-surveys.org/dr2_release.html) (LOFAR Two-metre Sky Survey) are currently being pre-processed in order to create a batched dataset suitable for use in machine learning.

**Supervisor**: Khan Asad.
