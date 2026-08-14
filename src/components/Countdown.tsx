import { useEffect, useState } from "react";

/**
 * Live countdown to an opportunity's deadline — mirrors the inside-portal form
 * counter so the vacancy page and the application form read the same. Renders a
 * stable placeholder on the server + first client paint (now === null) so
 * hydration matches, then ticks every second once mounted. Styling is inline
 * against the site's CSS tokens (var(--ink) etc.) so it follows the dark/light
 * theme with no global CSS.
 */
// Deadlines are Bangladesh Standard Time (UTC+6), never the viewer's zone.
// A value carrying an offset ("…T23:59:00+06:00") or a "Z" is already a fixed
// instant — the countdown to it is identical worldwide, which is what we want.
// The two ambiguous shapes are normalised to BST: a bare date means the END of
// that day, and a local-looking timestamp is read as BST rather than as the
// viewer's own clock (a reader in London must see the Dhaka deadline).
export function bstInstant(value: string): number {
  const s = value.trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return new Date(`${s}T23:59:59+06:00`).getTime();
  if (/^\d{4}-\d{2}-\d{2}[T ]\d{2}:\d{2}(:\d{2})?$/.test(s)) return new Date(`${s.replace(" ", "T")}+06:00`).getTime();
  return new Date(s).getTime();
}

export default function Countdown({ closesAt, liveUrl }: { closesAt: string; liveUrl?: string }) {
  // closesAt is the value baked in at build time — the fallback. When liveUrl
  // is given (the Inside form's /meta endpoint, see src/data/inside-forms.ts),
  // the form's CURRENT deadline replaces it right after mount, so a deadline
  // moved in the form builder's Settings reaches this counter on the next page
  // load with no rebuild. Any fetch failure just keeps the baked value.
  const [liveClosesAt, setLiveClosesAt] = useState<string | null>(null);
  useEffect(() => {
    if (!liveUrl) return;
    const ctl = new AbortController();
    fetch(liveUrl, { signal: ctl.signal })
      .then((r) => (r.ok ? r.json() : null))
      .then((m) => {
        if (m && typeof m.closesAt === "string" && Number.isFinite(bstInstant(m.closesAt)))
          setLiveClosesAt(m.closesAt);
      })
      .catch(() => {});
    return () => ctl.abort();
  }, [liveUrl]);

  const target = bstInstant(liveClosesAt ?? closesAt);
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    if (!Number.isFinite(target)) return;
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, [target]);

  if (!Number.isFinite(target)) return null;

  const urgent = now !== null && target - now < 3_600_000; // < 1 hour
  const closed = now !== null && target - now <= 0;
  const numColor = urgent || closed ? "#e5484d" : "var(--ink)";

  const wrap: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: ".7rem",
    flexWrap: "wrap",
    padding: ".7rem .85rem",
    borderRadius: 12,
    border: `1px solid ${urgent || closed ? "#e5484d55" : "var(--line)"}`,
    background:
      urgent || closed
        ? "color-mix(in srgb, #e5484d 10%, transparent)"
        : "color-mix(in srgb, var(--accent-2) 8%, transparent)",
  };
  const label: React.CSSProperties = {
    fontSize: ".6rem",
    letterSpacing: ".14em",
    textTransform: "uppercase",
    fontWeight: 700,
    color: closed ? "#e5484d" : "var(--ink-faint)",
  };
  const cells: React.CSSProperties = { display: "flex", gap: ".4rem" };
  const cell: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    minWidth: "2.6rem",
    padding: ".35rem .5rem",
    borderRadius: 9,
    background: "var(--bg-elev-2)",
    border: "1px solid var(--line)",
  };
  const num: React.CSSProperties = {
    fontSize: "1.2rem",
    fontWeight: 800,
    lineHeight: 1,
    fontVariantNumeric: "tabular-nums",
    color: numColor,
  };
  const unit: React.CSSProperties = {
    fontSize: ".55rem",
    letterSpacing: ".08em",
    textTransform: "uppercase",
    color: "var(--ink-faint)",
    marginTop: ".22rem",
  };

  // Stable placeholder for SSR + the first client paint (now === null), so the
  // server markup and first client render are byte-identical (no hydration
  // mismatch). Real values fill in on the next tick after mount.
  if (now === null) {
    return (
      <div style={wrap} role="timer" aria-label="Time remaining to apply">
        <span style={label}>Closes in</span>
        <div style={cells}>
          {["days", "hrs", "min", "sec"].map((u) => (
            <div style={cell} key={u}>
              <span style={num}>--</span>
              <span style={unit}>{u}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const diff = target - now;
  if (diff <= 0) {
    return (
      <div style={wrap} role="status">
        <span style={label}>Applications have closed</span>
      </div>
    );
  }

  const days = Math.floor(diff / 86_400_000);
  const hours = Math.floor((diff % 86_400_000) / 3_600_000);
  const mins = Math.floor((diff % 3_600_000) / 60_000);
  const secs = Math.floor((diff % 60_000) / 1000);

  // Hide the days cell once the deadline is under a day away.
  const shown: { v: number; l: string }[] = [
    ...(days > 0 ? [{ v: days, l: days === 1 ? "day" : "days" }] : []),
    { v: hours, l: "hrs" },
    { v: mins, l: "min" },
    { v: secs, l: "sec" },
  ];

  return (
    <div style={wrap} role="timer" aria-label="Time remaining to apply">
      <span style={label}>Closes in</span>
      <div style={cells}>
        {shown.map((c, i) => (
          <div style={cell} key={c.l + i}>
            <span style={num}>{String(c.v).padStart(2, "0")}</span>
            <span style={unit}>{c.l}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
