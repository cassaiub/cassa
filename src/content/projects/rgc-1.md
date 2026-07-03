---
title: "RGC-1: Radio Galaxy Classifier"
acronym: "RGC-1"
supervisor: "Khan Muhammad Bin Asad"
stage: "completed"
leads: ["M.S. Hossain", "Md Shahadat Hossain Shahal"]
team: ["P. Saikia", "A. Khan", "F. Akter", "A. Ali", "M.A. Amin", "D.P. Guha", "M.O.B. Jihad", "A. Momen", "S. Sen", "A.K.M.M. Rahman"]
startDate: "2024"
endDate: "2025"
summary: "A semi-supervised deep-learning model that sorts radio-loud AGN by morphology — introducing the FIRST-2060 catalogue and a four-class classifier for VLA images."
links:
  "Paper (arXiv:2510.22190)": "https://arxiv.org/abs/2510.22190"
status: "published"
---

The **Radio Galaxy Classifier (RGC)** is a deep-learning system that sorts radio-loud active galactic nuclei (radio AGN) by morphology. It is named in honour of **Radha Gobinda Chandra** (1878–1975), the pioneering Bengali variable-star observer from Bagchar, Jessore, whose meticulous records became part of the international AAVSO archive.

**RGC-1** is the first model in the series, presented in *"RGC: a radio AGN classifier based on deep learning. I. A semi-supervised multiclass model for VLA images"* — **accepted with minor revision at *Astronomy & Astrophysics***. It introduces **FIRST-2060**, a hand-labelled catalogue of 2,060 sources from the VLA FIRST survey spanning **four classes**: wide-angle tails and narrow-angle tails (the bent sources) alongside the straight Fanaroff–Riley FR-I and FR-II types.

To make the most of the small labelled set, RGC-1 is **semi-supervised**: a Bootstrap-Your-Own-Latent (BYOL) self-supervised backbone with an E(2)-equivariant steerable CNN (E2CNN) encoder learns from ~20,000 unlabelled FIRST sources, and is benchmarked against supervised baselines including ConvNeXt. Because morphology probes environment — bent tails trace a galaxy's motion through dense intracluster gas — an automated classifier at survey scale feeds directly into CASSA's related [MIMIC](/research/projects/mimic) and [GAZE](/research/projects/gaze) efforts.
