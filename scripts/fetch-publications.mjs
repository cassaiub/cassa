#!/usr/bin/env node
/* ─────────────────────────────────────────────────────────────────────────
 * Weekly ADS snapshot for /research/publications.
 *
 * Fetches the CASSA corpus from the NASA ADS search API and writes it to
 *   src/data/publications-snapshot.json
 * which the page imports at build time. The build itself never calls ADS, so
 * it is offline-safe and never flakes on an API hiccup.
 *
 * Run once a week (or whenever you want to refresh the numbers):
 *   npm run update:publications
 * then rebuild the site to publish the update.
 *
 * Two sources, both via the normal /search/query endpoint:
 *   1. Affiliation search — aff:"Center for Astronomy, Space Science and Astrophysics"
 *   2. Curated library    — the bibcodes frozen in src/data/ads-library.ts
 *      (papers the affiliation search misses; e.g. radio work filed under a
 *      prior institution). Edit that file to change the library membership.
 *
 * Needs ADS_API_TOKEN (read from .env or the environment). Get a free token at
 * ui.adsabs.harvard.edu → Account → API Token. Fail-closed: on any error it
 * exits non-zero WITHOUT touching the existing snapshot.
 * ───────────────────────────────────────────────────────────────────────── */

import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { ADS_LIBRARY_BIBCODES, ADS_LIBRARY_URL, ADS_AFF_OVERRIDES } from "../src/data/ads-library.ts";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const OUT  = resolve(ROOT, "src/data/publications-snapshot.json");

// Load ADS_API_TOKEN from .env if present (an already-exported env var also works).
try { process.loadEnvFile(resolve(ROOT, ".env")); } catch { /* no .env file — fall back to process.env */ }
const token = process.env.ADS_API_TOKEN;
if (!token) {
  console.error("✗ ADS_API_TOKEN is not set. Add it to .env (ADS_API_TOKEN=…) or export it.");
  console.error("  Get a free token at ui.adsabs.harvard.edu → Account → API Token.");
  process.exit(1);
}

const API   = "https://api.adsabs.harvard.edu/v1/search/query";
const FL    = "title,author,author_count,aff,year,bibcode,doi,pub,bibstem,citation_count,pubdate,doctype";
const AFF_Q = 'aff:"Center for Astronomy, Space Science and Astrophysics"';
const headers = { Authorization: `Bearer ${token}` };

async function adsSearch(q, extra = "") {
  const res = await fetch(`${API}?q=${encodeURIComponent(q)}&fl=${FL}${extra}`, { headers });
  if (!res.ok) throw new Error(`ADS API returned HTTP ${res.status} ${res.statusText}`);
  return (await res.json()).response?.docs ?? [];
}

try {
  console.log("→ Fetching CASSA publications from NASA ADS…");

  /* Parallel: affiliation search + the curated library's papers (membership
     from the local snapshot in ads-library.ts, metadata live from ADS). */
  const [affPapers, libPapers] = await Promise.all([
    adsSearch(AFF_Q, "&sort=date+desc&rows=500"),
    ADS_LIBRARY_BIBCODES.length
      ? adsSearch(`bibcode:(${ADS_LIBRARY_BIBCODES.join(" OR ")})`, `&rows=${ADS_LIBRARY_BIBCODES.length}`)
      : Promise.resolve([]),
  ]);

  // Merge: curated-library papers not already in the affiliation set.
  const seen = new Set(affPapers.map((p) => p.bibcode));
  const newFromLib = libPapers.filter((p) => !seen.has(p.bibcode));

  // Keep only journal + conference papers (drop software deposits, errata, etc.).
  const PAPER_DOCTYPES = new Set(["article", "inproceedings", "proceedings"]);
  const isPaper = (p) => PAPER_DOCTYPES.has(p.doctype ?? "");
  const papers = [...affPapers, ...newFromLib]
    .filter(isPaper)
    .sort((a, b) =>
      (b.pubdate ?? "").localeCompare(a.pubdate ?? "")
      || (b.citation_count ?? 0) - (a.citation_count ?? 0));
  const libOnlyCount = newFromLib.filter(isPaper).length;

  /* Apply curated affiliation corrections (ADS_AFF_OVERRIDES): patch authors ADS
     left with "-" so the page credits IUB work the affiliation search can't see. */
  let patched = 0;
  for (const p of papers) {
    const ovs = ADS_AFF_OVERRIDES[p.bibcode];
    if (!ovs) continue;
    const authors = p.author ?? [];
    const aff = (p.aff ?? []).slice();
    while (aff.length < authors.length) aff.push("-");
    for (const ov of ovs) {
      const key = ov.author.toLowerCase();
      const i = authors.findIndex((a) => (a ?? "").trim().toLowerCase().startsWith(key));
      if (i >= 0) { aff[i] = ov.aff; patched++; }
      else console.warn(`  ⚠ override author "${ov.author}" not found in ${p.bibcode}`);
    }
    p.aff = aff;
  }

  const snapshot = {
    fetchedAt: new Date().toISOString(),
    source: { affiliation: AFF_Q, libraryUrl: ADS_LIBRARY_URL },
    totalFound: papers.length,
    libOnlyCount,
    papers,
  };

  writeFileSync(OUT, JSON.stringify(snapshot, null, 2) + "\n");
  console.log(`✓ Saved ${papers.length} papers (${libOnlyCount} from the curated library, ${patched} affiliation override${patched === 1 ? "" : "s"}) to src/data/publications-snapshot.json`);
  console.log(`  Snapshot dated ${snapshot.fetchedAt.slice(0, 10)}. Rebuild the site to publish the update.`);
} catch (e) {
  console.error(`✗ Update failed: ${e?.message ?? e}`);
  console.error("  The existing snapshot was left unchanged — fix the issue and re-run.");
  process.exit(1);
}
