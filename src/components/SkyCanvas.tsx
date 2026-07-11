import { useEffect, useRef } from "react";

export type SkyTheme = "cosmic" | "lensing" | "galaxy" | "evolution";

/** Original, code-generated immersive backgrounds — one motif per topic, never
 *  a photograph:
 *   - cosmic    : an expanding field of galaxies linked into a distance network
 *   - lensing   : a star field warped by a drifting gravitational lens
 *   - galaxy    : a slowly rotating spiral disk with star-forming knots
 *   - evolution : galaxies aging — born blue, brightening to gold, reddening
 *                 and fading as their stellar populations evolve (Tinsley)
 *  Theme-aware: each motif has a night palette (dark, the default) and a "day"
 *  palette (pale sky, ink-dark marks) picked from <html data-theme>; a
 *  MutationObserver repaints live when the ThemeToggle flips it.
 *  Animation runs only when the canvas is on-screen, the tab is visible,
 *  `active` is true, and reduced-motion is off — otherwise a single static
 *  frame is painted. */
export default function SkyCanvas({ theme, active = true }: { theme: SkyTheme; active?: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let isLight = document.documentElement.dataset.theme === "light";
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const rnd = (a: number, b: number) => a + Math.random() * (b - a);

    let w = 0, h = 0, raf = 0;
    let onScreen = true;
    let animating = false;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let parts: any[] = [];

    const want = () => active && onScreen && !document.hidden && !reduce;

    function build() {
      parts = [];
      if (theme === "cosmic") {
        const n = Math.round(Math.min(190, (w * h) / 9000));
        const maxR = Math.hypot(w, h) / 2;
        for (let i = 0; i < n; i++)
          parts.push({ ang: rnd(0, Math.PI * 2), rad: rnd(0, maxR), speed: rnd(4, 18), size: rnd(0.6, 2), warm: Math.random() });
      } else if (theme === "lensing") {
        const n = Math.round(Math.min(280, (w * h) / 5500));
        for (let i = 0; i < n; i++)
          parts.push({ x: rnd(0, w), y: rnd(0, h), size: rnd(0.5, 1.8), tw: rnd(0, Math.PI * 2), tws: rnd(0.4, 1.4) });
      } else if (theme === "evolution") {
        const nG = Math.round(Math.min(64, (w * h) / 26000));
        for (let i = 0; i < nG; i++)
          parts.push({ gal: true, x: rnd(0, w), y: rnd(0, h), drift: rnd(2, 7), size: rnd(5, 13), age: rnd(0, 1), rate: rnd(0.008, 0.02), tilt: rnd(0, Math.PI) });
        const nS = Math.round(Math.min(160, (w * h) / 9500));
        for (let i = 0; i < nS; i++)
          parts.push({ gal: false, x: rnd(0, w), y: rnd(0, h), size: rnd(0.4, 1.3), tw: rnd(0, Math.PI * 2), tws: rnd(0.4, 1.2) });
      } else {
        const n = Math.round(Math.min(460, (w * h) / 3200));
        const R = Math.min(w, h) * 0.46;
        for (let i = 0; i < n; i++) {
          const t = Math.pow(Math.random(), 0.6);
          const radius = t * R;
          const arm = Math.floor(rnd(0, 2));
          const angle = arm * Math.PI + radius * 0.02 + rnd(-0.28, 0.28) * (1.2 - t);
          parts.push({ radius, angle, size: rnd(0.5, 1.7), knot: Math.random() < 0.12, tw: rnd(0, Math.PI * 2) });
        }
      }
    }

    function draw(now: number) {
      if (!ctx) return;
      const cx = w / 2, cy = h / 2, time = now / 1000;
      const L = isLight; // day palette: pale sky, ink-dark marks

      if (theme === "cosmic") {
        const g = ctx.createRadialGradient(cx, cy * 0.85, 0, cx, cy, Math.hypot(w, h) / 1.4);
        if (L) { g.addColorStop(0, "#e4edf9"); g.addColorStop(1, "#bfd1ea"); }
        else { g.addColorStop(0, "#0b1126"); g.addColorStop(1, "#05060d"); }
        ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);

        const maxR = Math.hypot(w, h) / 2;
        const pts = parts.map((p) => {
          if (animating) { p.rad += p.speed * 0.016; if (p.rad > maxR) { p.rad = rnd(0, maxR * 0.22); p.ang = rnd(0, Math.PI * 2); } }
          return { x: cx + Math.cos(p.ang) * p.rad, y: cy + Math.sin(p.ang) * p.rad * 0.72, p };
        });
        ctx.lineWidth = 1;
        for (let i = 0; i < pts.length; i++)
          for (let j = i + 1; j < Math.min(i + 6, pts.length); j++) {
            const dx = pts[i].x - pts[j].x, dy = pts[i].y - pts[j].y, d2 = dx * dx + dy * dy;
            if (d2 < 14400) {
              const a = (1 - Math.sqrt(d2) / 120) * (L ? 0.22 : 0.16);
              ctx.strokeStyle = L ? `rgba(36,84,156,${a})` : `rgba(120,175,230,${a})`;
              ctx.beginPath(); ctx.moveTo(pts[i].x, pts[i].y); ctx.lineTo(pts[j].x, pts[j].y); ctx.stroke();
            }
          }
        for (const { x, y, p } of pts) {
          const near = 1 - p.rad / maxR;
          ctx.fillStyle = L
            ? `rgba(${(60 + p.warm * 85) | 0},${(78 + p.warm * 15) | 0},${(130 - p.warm * 80) | 0},${0.4 + near * 0.45})`
            : `rgba(${(210 + p.warm * 40) | 0},${(195 - p.warm * 20) | 0},${(160 + near * 90) | 0},${0.45 + near * 0.5})`;
          ctx.beginPath(); ctx.arc(x, y, p.size, 0, 7); ctx.fill();
        }
        const core = ctx.createRadialGradient(cx, cy * 0.85, 0, cx, cy * 0.85, 160);
        core.addColorStop(0, L ? "rgba(179,116,26,0.16)" : "rgba(236,180,90,0.10)");
        core.addColorStop(1, L ? "rgba(179,116,26,0)" : "rgba(236,180,90,0)");
        ctx.fillStyle = core; ctx.fillRect(0, 0, w, h);
      } else if (theme === "lensing") {
        ctx.fillStyle = L ? "#d9e4f4" : "#05060d"; ctx.fillRect(0, 0, w, h);
        const lx = cx + Math.cos(time * 0.14) * w * 0.18;
        const ly = cy + Math.sin(time * 0.1) * h * 0.12;
        const k = Math.min(w, h) * 0.6;
        for (const p of parts) {
          const dx = p.x - lx, dy = p.y - ly, r = Math.hypot(dx, dy) + 0.001;
          const defl = Math.min(k / r, r * 0.9);
          const nx = p.x + (dx / r) * defl, ny = p.y + (dy / r) * defl;
          const tw = 0.6 + 0.4 * Math.sin(time * p.tws + p.tw);
          const bright = Math.min(1, k / (r * 1.3));
          ctx.fillStyle = L
            ? `rgba(${(70 - bright * 40) | 0},${(90 - bright * 42) | 0},${(138 - bright * 50) | 0},${(0.4 + bright * 0.45) * tw})`
            : `rgba(${(200 + bright * 55) | 0},215,235,${(0.32 + bright * 0.5) * tw})`;
          ctx.beginPath(); ctx.arc(nx, ny, p.size * (0.8 + bright), 0, 7); ctx.fill();
        }
        const rg = ctx.createRadialGradient(lx, ly, k * 0.05, lx, ly, k * 0.42);
        const halo = L ? "18,118,132" : "94,200,214";
        rg.addColorStop(0, `rgba(${halo},0)`); rg.addColorStop(0.72, `rgba(${halo},${L ? 0.16 : 0.12})`); rg.addColorStop(1, `rgba(${halo},0)`);
        ctx.fillStyle = rg; ctx.fillRect(0, 0, w, h);
      } else if (theme === "evolution") {
        // Cosmic time runs left→right: deep blue (early) shading to warm dark
        // red (late); each galaxy lives a life — blue youth, golden middle age,
        // red fade — then is reborn elsewhere in the field.
        const g = ctx.createLinearGradient(0, 0, w, 0);
        if (L) { g.addColorStop(0, "#dfe9f8"); g.addColorStop(1, "#f0e2de"); }
        else { g.addColorStop(0, "#070b1c"); g.addColorStop(1, "#180b0e"); }
        ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);

        for (const p of parts) {
          if (!p.gal) {
            const tw = 0.55 + 0.45 * Math.sin(time * p.tws + p.tw);
            ctx.fillStyle = L ? `rgba(52,72,110,${0.35 * tw})` : `rgba(205,215,235,${0.4 * tw})`;
            ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, 7); ctx.fill();
            continue;
          }
          if (animating) { p.x += p.drift * 0.016; if (p.x > w + 34) p.x = -34; }
          const age = (p.age + time * p.rate) % 1;
          const env = Math.sin(age * Math.PI); // fade in → live → fade out
          let r: number, gc: number, b: number;
          if (age < 0.5) { const t = age / 0.5; r = 150 + t * 105; gc = 190 + t * 25; b = 255 - t * 105; }
          else { const t = (age - 0.5) / 0.5; r = 255; gc = 215 - t * 95; b = 150 - t * 40; }
          if (L) { r *= 0.55; gc *= 0.5; b *= 0.6; }
          const s = p.size * (0.55 + age * 0.9);
          ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.tilt); ctx.scale(1, 0.55);
          const halo = ctx.createRadialGradient(0, 0, 0, 0, 0, s * 2.6);
          halo.addColorStop(0, `rgba(${r | 0},${gc | 0},${b | 0},${(L ? 0.55 : 0.6) * env})`);
          halo.addColorStop(0.45, `rgba(${r | 0},${gc | 0},${b | 0},${(L ? 0.22 : 0.24) * env})`);
          halo.addColorStop(1, `rgba(${r | 0},${gc | 0},${b | 0},0)`);
          ctx.fillStyle = halo;
          ctx.beginPath(); ctx.arc(0, 0, s * 2.6, 0, 7); ctx.fill();
          ctx.restore();
        }
      } else {
        const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.min(w, h) * 0.62);
        if (L) { g.addColorStop(0, "#e9e2f5"); g.addColorStop(1, "#c6d3ec"); }
        else { g.addColorStop(0, "#150f24"); g.addColorStop(1, "#05060d"); }
        ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
        ctx.save(); ctx.translate(cx, cy);
        const R = Math.min(w, h) * 0.46;
        for (const p of parts) {
          const speed = animating ? 0.05 / (0.3 + p.radius / R) : 0;
          const a = p.angle + time * speed;
          const x = Math.cos(a) * p.radius, y = Math.sin(a) * p.radius * 0.42;
          const tw = 0.6 + 0.4 * Math.sin(time * 1.5 + p.tw);
          if (p.knot) ctx.fillStyle = L ? `rgba(168,36,92,${0.45 * tw + 0.32})` : `rgba(255,150,190,${0.45 * tw + 0.3})`;
          else {
            const c = 1 - Math.min(1, p.radius / R);
            ctx.fillStyle = L
              ? `rgba(${(92 - c * 42) | 0},${(84 - c * 30) | 0},${(148 - c * 40) | 0},${0.42 + 0.35 * tw})`
              : `rgba(${(190 + c * 65) | 0},${(200 - c * 15) | 0},${(255 - c * 35) | 0},${0.42 + 0.4 * tw})`;
          }
          ctx.beginPath(); ctx.arc(x, y, p.size, 0, 7); ctx.fill();
        }
        const bg = ctx.createRadialGradient(0, 0, 0, 0, 0, R * 0.36);
        bg.addColorStop(0, L ? "rgba(186,122,32,0.26)" : "rgba(255,220,150,0.22)");
        bg.addColorStop(1, L ? "rgba(186,122,32,0)" : "rgba(255,220,150,0)");
        ctx.fillStyle = bg; ctx.beginPath(); ctx.arc(0, 0, R * 0.36, 0, 7); ctx.fill();
        ctx.restore();
      }
    }

    function tick(now: number) { draw(now); raf = requestAnimationFrame(tick); }

    function sync() {
      const w2 = want();
      if (w2 && !animating) { animating = true; cancelAnimationFrame(raf); raf = requestAnimationFrame(tick); }
      else if (!w2 && animating) { animating = false; cancelAnimationFrame(raf); draw(performance.now()); }
      else if (!w2) { draw(performance.now()); }
    }

    function resize() {
      const rect = canvas.getBoundingClientRect();
      w = Math.max(1, rect.width); h = Math.max(1, rect.height);
      canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      build();
      if (!animating) draw(performance.now());
    }

    const io = new IntersectionObserver((es) => { onScreen = es[0].isIntersecting; sync(); }, { threshold: 0 });
    const onVis = () => sync();
    // Repaint in the new palette the moment ThemeToggle flips <html data-theme>
    // (a static/reduced-motion frame would otherwise keep the old sky).
    const mo = new MutationObserver(() => {
      const next = document.documentElement.dataset.theme === "light";
      if (next !== isLight) { isLight = next; if (!animating) draw(performance.now()); }
    });

    resize();
    io.observe(canvas);
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    document.addEventListener("visibilitychange", onVis);
    window.addEventListener("resize", resize);
    sync();

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      mo.disconnect();
      document.removeEventListener("visibilitychange", onVis);
      window.removeEventListener("resize", resize);
    };
  }, [theme, active]);

  return <canvas ref={ref} className="fslide__canvas" aria-hidden="true" />;
}
