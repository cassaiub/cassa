import { useEffect, useState } from "react";
import SkyCanvas, { type SkyTheme } from "./SkyCanvas.tsx";

export type Slide = {
  theme: SkyTheme;
  eyebrow: string;
  title: string;
  excerpt: string;
  href: string;
};

const DURATION = 7000; // ms each story holds — slow succession

export default function FeatureSlider({ slides }: { slides: Slide[] }) {
  const n = slides.length;
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reduce, setReduce] = useState(false);

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
      {slides.map((s, i) => (
        <article
          key={i}
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
            <a className="btn btn--solid" href={s.href}>Read the story →</a>
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
            {slides.map((s, i) => (
              <button
                key={i}
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
