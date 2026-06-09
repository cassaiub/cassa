// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import remarkMath from 'remark-math';
import rehypeMathjax from 'rehype-mathjax/svg';

// rehypeArticleFigure — inline, plain JS, manual hast walk (no extra deps).
// Rewrites the markdown image+caption shapes into one semantic figure element:
//   A (optimized): a paragraph holding only an img, then a paragraph holding only an em (the caption)
//   B (legacy WP): a single paragraph holding [img, em]
//   lone image:    a paragraph holding only an img  -> a bare figure (empty figcaption, hidden via :empty)
// A caption is absorbed ONLY from the IMMEDIATELY-following sibling paragraph whose
// sole child is one em, so *Translated.../*Written by... bylines separated by prose
// are never swallowed. Idempotent: output is a figure; matchers only fire on a p.
// The img stays a .prose-cassa descendant (lightbox still binds it) and its
// src/srcset/alt/width/height are untouched (no CLS).
function rehypeArticleFigure() {
  const isBlank = (n) => n && n.type === 'text' && !n.value.trim();
  const isEl = (n, tag) => n && n.type === 'element' && n.tagName === tag;
  const meaningful = (node) =>
    (node.children || []).filter((c) => !isBlank(c) && c.type !== 'comment');

  const soleChild = (node, tag) => {
    if (!isEl(node, 'p')) return null;
    const kids = meaningful(node);
    return kids.length === 1 && isEl(kids[0], tag) ? kids[0] : null;
  };
  const imgEmPair = (node) => {
    if (!isEl(node, 'p')) return null;
    const kids = meaningful(node);
    return kids.length === 2 && isEl(kids[0], 'img') && isEl(kids[1], 'em')
      ? { img: kids[0], em: kids[1] }
      : null;
  };

  const makeFigure = (img, em /* may be null */) => ({
    type: 'element',
    tagName: 'figure',
    properties: { className: ['article-figure'], 'data-figure': '' },
    children: [
      img,
      {
        type: 'element',
        tagName: 'figcaption',
        properties: { className: ['article-figure__cap'] },
        children: em ? em.children : [],
      },
    ],
  });

  const walk = (parent) => {
    if (!parent || !Array.isArray(parent.children)) return;
    const out = [];
    for (let i = 0; i < parent.children.length; i++) {
      const node = parent.children[i];

      const pair = imgEmPair(node);
      if (pair) {
        out.push(makeFigure(pair.img, pair.em));
        continue;
      }

      const img = soleChild(node, 'img');
      if (img) {
        let j = i + 1;
        while (j < parent.children.length && isBlank(parent.children[j])) j++;
        const em = soleChild(parent.children[j], 'em'); // only the IMMEDIATE next block
        out.push(makeFigure(img, em || null));
        if (em) i = j;
        continue;
      }

      if (node && node.type === 'element' && node.tagName !== 'figure') walk(node);
      out.push(node);
    }
    parent.children = out;
  };

  // Second pass: group a run of 2+ consecutive figures into one .article-gallery
  // (a responsive grid). Single figures are left standalone.
  const isFig = (n) =>
    n && n.type === 'element' && n.tagName === 'figure' &&
    Array.isArray(n.properties && n.properties.className) && n.properties.className.includes('article-figure');
  const group = (parent) => {
    if (!parent || !Array.isArray(parent.children)) return;
    const out = [];
    let i = 0;
    while (i < parent.children.length) {
      const node = parent.children[i];
      if (isFig(node)) {
        const run = [node];
        let j = i + 1;
        while (j < parent.children.length) {
          if (isBlank(parent.children[j])) { j++; continue; }
          if (isFig(parent.children[j])) { run.push(parent.children[j]); j++; continue; }
          break;
        }
        if (run.length >= 2) {
          out.push({
            type: 'element',
            tagName: 'div',
            properties: { className: ['article-gallery'], 'data-gallery': '', 'data-count': String(run.length) },
            children: run,
          });
          i = j;
          continue;
        }
      }
      if (node && node.type === 'element' && node.tagName !== 'figure' && node.tagName !== 'div') group(node);
      out.push(node);
      i++;
    }
    parent.children = out;
  };

  return (tree) => { walk(tree); group(tree); };
}

// Root deploy. base:'/' so the new site owns cassa.site/, while the existing
// /courses/ast100 (Astro) and /abekta (DokuWiki) keep their own paths.
// withBase() is still used everywhere so a future subpath/staging deploy is a
// one-line change here.
export default defineConfig({
  site: 'https://cassa.site',
  base: '/',
  trailingSlash: 'never',
  // The radio telescope was renamed STAR → TART; keep the old facility URL alive.
  redirects: {
    '/research/star': '/research/tart',
  },
  build: {
    inlineStylesheets: 'auto',
  },
  markdown: {
    // remark-math parses $…$ (inline) and $$…$$ (block) before markdown can mangle the LaTeX.
    remarkPlugins: [remarkMath],
    // rehype-mathjax/svg renders the math to self-contained SVG (no runtime JS / font CSS);
    // then rehypeArticleFigure wraps the <p><img> + <p><em> shapes into <figure>/galleries.
    rehypePlugins: [rehypeMathjax, rehypeArticleFigure],
  },
  vite: { plugins: [tailwindcss()] },
  integrations: [react(), sitemap()],
});
