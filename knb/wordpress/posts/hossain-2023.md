---
title: "Morphological classification of Radio Galaxies using Semi-Supervised Group Equivariant CNNs"
slug: "hossain-2023"
wp_id: 2083
url: "https://cassa.site/hossain-2023/"
date: "2023-08-31 13:22:20"
status: "publish"
author: "kmbasad"
categories: ["Conference", "Journal"]
tags: []
---

Out of the estimated few trillion galaxies, only around a million have been detected through radio frequencies, and only a tiny fraction, approximately a thousand, have been manually classified. We have addressed this disparity between labeled and unlabeled images of radio galaxies by employing a semi-supervised learning approach to classify them into the known Fanaroff-Riley Type I (FRI) and Type II (FRII) categories. A Group Equivariant Convolutional Neural Network (G-CNN) was used as an encoder of the state-of-the-art self-supervised methods SimCLR (A Simple Framework for Contrastive Learning of Visual Representations) and BYOL (Bootstrap Your Own Latent). The G-CNN preserves the equivariance for the Euclidean Group E(2), enabling it to effectively learn the representation of globally oriented feature maps. After representation learning, we trained a fully-connected classifier and fine-tuned the trained encoder with labeled data. Our findings demonstrate that our semi-supervised approach outperforms existing state-of-the-art methods across several metrics, including cluster quality, convergence rate, accuracy, precision, recall, and the F1-score. Moreover, statistical significance testing via a t-test revealed that our method surpasses the performance of a fully supervised G-CNN. This study emphasizes the importance of semi-supervised learning in radio galaxy classification, where labeled data are still scarce, but the prospects for discovery are immense.

M S Hossain, S Roy, K M B Asad, A Momen, A A Ali, M A Amin and A K M M Rahman.

Procedia Computer Science, Volume 222, 2023, Pages 601-612.

[https://doi.org/10.1016/j.procs.2023.08.198](https://doi.org/10.1016/j.procs.2023.08.198).

Citations: [https://scholar.google.com/scholar?oi=bibs&hl=en&cites=9049064659789324494&as_sdt=5](https://scholar.google.com/scholar?oi=bibs&hl=en&cites=9049064659789324494&as_sdt=5).
