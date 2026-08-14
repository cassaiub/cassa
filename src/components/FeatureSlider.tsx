import { useEffect, useMemo, useState } from "react";
import SkyCanvas, { type SkyTheme } from "./SkyCanvas.tsx";
import { bstInstant } from "./Countdown.tsx";

export type Slide = {
  theme: SkyTheme;
  eyebrow: string;
  title: string;
  excerpt: string;
  href: string;
  /** CTA label — defaults to the news-story wording */
  cta?: string;
  /** An open call (vacancy circular / workshop application) vs a news story.
      Calls and news compete on recency alone: the page passes the slides
      newest-first and the first MAX_SLIDES still-open ones show — an expired
      call drops out and the next story backfills. */
  kind?: "call" | "news";
  /** Deadline instant (BST rules, see Countdown.bstInstant) after which the
      slide drops out client-side — a closed call leaves the hero even if the
      site hasn't been rebuilt since. Omit for slides that never expire. */
  hideAfter?: string;
  /** Inside form /meta endpoint (src/data/inside-forms.ts) — when given, the
      form's CURRENT deadline/openness overrides hideAfter after mount, so a
      deadline moved in the Inside form builder reaches the hero on the next
      page load with no rebuild. Fetch failure keeps the baked hideAfter. */
  liveDeadlineUrl?: string;
};

const DURATION = 7000; // ms each story holds — slow succession
const MAX_SLIDES = 3; // the three most recent still-open stories, calls and news alike

export default function FeatureSlider({ slides }: { slides: Slide[] }) {
  // null during SSR/static build AND the first client paint, so the server
  // markup and hydration are identical; the real clock applies right after
  // mount, and again at each hideAfter instant while the tab stays open.
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    setNow(Date.now());
  }, []);

  // Live deadline overrides: url → the form's current closesAt, or CLOSED for
  // a form shut by hand on Inside. Fetched once per distinct endpoint.
  const CLOSED = "closed";
  const [liveDeadlines, setLiveDeadlines] = useState<Record<string, string>>({});
  useEffect(() => {
    const urls = Array.from(new Set(slides.map((s) => s.liveDeadlineUrl).filter((u): u is string => !!u)));
    if (urls.length === 0) return;
    const ctl = new AbortController();
    for (const u of urls) {
      fetch(u, { signal: ctl.signal })
        .then((r) => (r.ok ? r.json() : null))
        .then((m) => {
          if (!m) return;
          const v =
            m.open === false
              ? CLOSED
              : typeof m.closesAt === "string" && Number.isFinite(bstInstant(m.closesAt))
                ? m.closesAt
                : null;
          if (v) setLiveDeadlines((prev) => ({ ...prev, [u]: v }));
        })
        .catch(() => {});
    }
    return () => ctl.abort();
  }, [slides]);

  // When a slide stops being shown: its live deadline if known, else the baked
  // hideAfter, else never.
  const expiry = (s: Slide): number => {
    const live = s.liveDeadlineUrl ? liveDeadlines[s.liveDeadlineUrl] : undefined;
    if (live === CLOSED) return -Infinity;
    const v = live ?? s.hideAfter;
    return v ? bstInstant(v) : Infinity;
  };

  useEffect(() => {
    if (now === null) return;
    const next = Math.min(...slides.map(expiry).filter((t) => Number.isFinite(t) && t > now));
    if (!Number.isFinite(next)) return;
    // Clamp: setTimeout overflows past ~24.8 days; a far deadline just re-arms.
    const id = window.setTimeout(() => setNow(Date.now()), Math.min(next - now + 1000, 2 ** 31 - 1));
    return () => window.clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [now, slides, liveDeadlines]);

  const visible = useMemo(() => {
    const live = now === null ? slides : slides.filter((s) => expiry(s) > now);
    return live.slice(0, MAX_SLIDES); // order = the page's (newest first)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slides, now, liveDeadlines]);

  const n = visible.length;
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reduce, setReduce] = useState(false);

  // If an expired slide just dropped out from under the pointer, restart.
  useEffect(() => {
    if (index >= n && n > 0) setIndex(0);
  }, [n, index]);

  useEffect(() => {
    const mq = matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setReduce(mq.matches);
    apply();
    mq.addEventListener?.("change", apply);
    return () => mq.removeEventListener?.("change", apply);
  }, []);

  useEffect(() => {
    if (reduce || paused || n <= 1) return;
    const id = window.setTimeout(() => setIndex((i) => (i + 1) % n), DURATION);
    return () => window.clearTimeout(id);
  }, [index, paused, reduce, n]);

  const go = (i: number) => setIndex(((i % n) + n) % n);

  return (
    <section
      className={`fslider${reduce ? " is-reduce" : ""}${paused ? " is-paused" : ""}`}
      role="region"
      aria-roledescription="carousel"
      aria-label="Featured news"
      tabIndex={0}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setPaused(false);
      }}
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") { e.preventDefault(); go(index + 1); }
        else if (e.key === "ArrowLeft") { e.preventDefault(); go(index - 1); }
      }}
    >
      {/* Institutional identity — shared hero stamp (see HeroIdent.astro), fixed
          under the logo and unchanged as slides fade. Full name, one sentence. */}
      <div className="hero-ident" aria-hidden="true">
        <div className="wrap">
          <p className="hero-ident__line">Center for Astronomy, Space Science and Astrophysics, Independent University, Bangladesh (IUB)</p>
        </div>
      </div>

      {visible.map((s, i) => (
        <article
          key={s.href}
          className={`fslide${i === index ? " is-active" : ""}`}
          aria-roledescription="slide"
          aria-label={`${i + 1} of ${n}: ${s.title}`}
          aria-hidden={i !== index}
        >
          <SkyCanvas theme={s.theme} active={i === index} />
          <div className="fslide__scrim" />
          <div className="wrap fslide__content">
            <p className="eyebrow">{s.eyebrow}</p>
            <h2 className="fslide__title">{s.title}</h2>
            <p className="fslide__excerpt">{s.excerpt}</p>
            <a className="btn btn--solid" href={s.href}>{s.cta ?? "Read the story"} →</a>
          </div>
        </article>
      ))}

      {n > 1 && (
        <>
          <button className="farrow farrow--prev" type="button" aria-label="Previous story" onClick={() => go(index - 1)}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M15 18l-6-6 6-6" /></svg>
          </button>
          <button className="farrow farrow--next" type="button" aria-label="Next story" onClick={() => go(index + 1)}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M9 18l6-6-6-6" /></svg>
          </button>

          <div className="fslider__dots" role="tablist" aria-label="Choose a story">
            {visible.map((s, i) => (
              <button
                key={s.href}
                className="fdot"
                type="button"
                role="tab"
                aria-current={i === index}
                aria-label={`Story ${i + 1}: ${s.title}`}
                onClick={() => go(i)}
              />
            ))}
          </div>

          <div className="fprogress" aria-hidden="true">
            <div key={index} className="fprogress__bar run" />
          </div>
        </>
      )}
    </section>
  );
}
