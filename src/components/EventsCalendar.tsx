import { useState, useMemo, useEffect, useRef, useCallback } from "react";

/* ── Types ─────────────────────────────────────────────────────────────── */
export type CalendarEvent = {
  slug: string;
  title: string;
  start: string; // ISO (UTC) string
  end: string | null;
  allDay: boolean;
  venue: string | null;
  organizer: string | null;
  series: string;
  category: string | null;
  summary: string | null;
  hero: string | null; // pre-rendered thumbnail URL (optimized by astro:assets)
  lang: string;
  href: string; // pre-computed permalink (withBase)
};

type View = "list" | "week" | "month" | "year";

type EventVM = CalendarEvent & {
  _start: Date;
  _end: Date | null;
  dayKey: string; // YYYY-MM-DD in Asia/Dhaka
};

/* ── Date helpers — civil-date grid + Dhaka-pinned bucketing ───────────── */
const TZ = "Asia/Dhaka";
const WEEK_START = 0; // 0 = Sunday

const pad = (n: number) => String(n).padStart(2, "0");
const civilKey = (y: number, m: number, d: number) => `${y}-${pad(m + 1)}-${pad(d)}`;

// Bucket an instant into its Asia/Dhaka calendar day (YYYY-MM-DD).
const dhakaKeyFmt = new Intl.DateTimeFormat("en-CA", { timeZone: TZ, year: "numeric", month: "2-digit", day: "2-digit" });
const eventDayKey = (iso: string) => dhakaKeyFmt.format(new Date(iso));
const todayKey = () => dhakaKeyFmt.format(new Date());

// Formatters for instants (event times) — pinned to Dhaka.
const tCache = new Map<string, Intl.DateTimeFormat>();
const tf = (opts: Intl.DateTimeFormatOptions) => {
  const k = JSON.stringify(opts);
  let f = tCache.get(k);
  if (!f) { f = new Intl.DateTimeFormat("en-GB", { timeZone: TZ, ...opts }); tCache.set(k, f); }
  return f;
};
const timeLabel = (d: Date) => tf({ hour: "numeric", minute: "2-digit", hour12: true }).format(d);

// Formatters for civil grid dates (constructed local; NO timezone option).
const cCache = new Map<string, Intl.DateTimeFormat>();
const cf = (opts: Intl.DateTimeFormatOptions) => {
  const k = JSON.stringify(opts);
  let f = cCache.get(k);
  if (!f) { f = new Intl.DateTimeFormat("en-GB", opts); cCache.set(k, f); }
  return f;
};

const WEEKDAY_LABELS = Array.from({ length: 7 }, (_, i) => {
  const d = new Date(2024, 0, 7 + ((i + WEEK_START) % 7)); // Jan 7 2024 is a Sunday
  return cf({ weekday: "short" }).format(d);
});

/* ── Series → colour token (CSS classes carry the colour) ──────────────── */
const SERIES_ORDER = ["colloquium", "journal-talk", "workshop", "outreach", "other"];
const SERIES_LABELS: Record<string, string> = {
  colloquium: "Colloquium", "journal-talk": "Journal Talk", workshop: "Workshop", outreach: "Outreach", other: "Other",
};

/* ── Component ─────────────────────────────────────────────────────────── */
export default function EventsCalendar({ events }: { events: CalendarEvent[] }) {
  const vms = useMemo<EventVM[]>(
    () =>
      events
        .map((e) => ({
          ...e,
          _start: new Date(e.start),
          _end: e.end ? new Date(e.end) : null,
          dayKey: eventDayKey(e.start),
        }))
        .sort((a, b) => +a._start - +b._start),
    [events]
  );

  const byDay = useMemo(() => {
    const m = new Map<string, EventVM[]>();
    for (const v of vms) {
      if (!m.has(v.dayKey)) m.set(v.dayKey, []);
      m.get(v.dayKey)!.push(v);
    }
    // all-day first, then by start time
    for (const list of m.values())
      list.sort((a, b) => (a.allDay === b.allDay ? +a._start - +b._start : a.allDay ? -1 : 1));
    return m;
  }, [vms]);

  const monthCounts = useMemo(() => {
    const m = new Map<string, number>();
    for (const v of vms) {
      const key = v.dayKey.slice(0, 7); // YYYY-MM
      m.set(key, (m.get(key) ?? 0) + 1);
    }
    return m;
  }, [vms]);

  // Default anchor: today if it's within/near the data, else the most-recent event's day.
  const initialAnchor = useMemo(() => {
    const tk = todayKey();
    const last = vms.length ? vms[vms.length - 1] : null;
    if (last && last.dayKey < tk) {
      const [y, m, d] = last.dayKey.split("-").map(Number);
      return new Date(y, m - 1, d);
    }
    const [y, m, d] = tk.split("-").map(Number);
    return new Date(y, m - 1, d);
  }, [vms]);

  const [view, setView] = useState<View>("month");
  const [anchor, setAnchor] = useState<Date>(initialAnchor);
  const [selected, setSelected] = useState<EventVM | null>(null);
  const [reduce, setReduce] = useState(false);
  const tk = todayKey();

  // Hydration-time adjustments: mobile defaults to list; signal the page to hide the no-JS fallback.
  useEffect(() => {
    document.documentElement.setAttribute("data-cal-ready", "");
    if (typeof window !== "undefined" && window.innerWidth < 640) setView("list");
    const mq = matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setReduce(mq.matches);
    apply();
    mq.addEventListener?.("change", apply);
    return () => {
      document.documentElement.removeAttribute("data-cal-ready");
      mq.removeEventListener?.("change", apply);
    };
  }, []);

  /* navigation */
  const go = useCallback(
    (dir: -1 | 1) => {
      setAnchor((a) => {
        const n = new Date(a);
        if (view === "month") n.setMonth(n.getMonth() + dir);
        else if (view === "week") n.setDate(n.getDate() + 7 * dir);
        else if (view === "year") n.setFullYear(n.getFullYear() + dir);
        else n.setMonth(n.getMonth() + dir); // list paginates by month
        return n;
      });
    },
    [view]
  );
  const reallyToday = useCallback(() => {
    const [y, m, d] = todayKey().split("-").map(Number);
    setAnchor(new Date(y, m - 1, d));
  }, []);

  /* period label */
  const periodLabel = useMemo(() => {
    if (view === "year") return String(anchor.getFullYear());
    if (view === "week") {
      const s = startOfWeek(anchor);
      const e = new Date(s);
      e.setDate(s.getDate() + 6);
      const sM = cf({ month: "short" }).format(s);
      const eM = cf({ month: "short" }).format(e);
      const sameMonth = s.getMonth() === e.getMonth();
      return sameMonth
        ? `${sM} ${s.getDate()} – ${e.getDate()}, ${e.getFullYear()}`
        : `${sM} ${s.getDate()} – ${eM} ${e.getDate()}, ${e.getFullYear()}`;
    }
    return cf({ month: "long", year: "numeric" }).format(anchor);
  }, [view, anchor]);

  /* keyboard: view hotkeys + period nav (ignored when typing/drawer open) */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (selected) return;
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;
      const k = e.key.toLowerCase();
      if (k === "m") setView("month");
      else if (k === "w") setView("week");
      else if (k === "y") setView("year");
      else if (k === "l") setView("list");
      else if (k === "t") reallyToday();
      else if (e.key === "ArrowLeft") go(-1);
      else if (e.key === "ArrowRight") go(1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selected, go, reallyToday]);

  const open = useCallback((v: EventVM) => setSelected(v), []);

  return (
    <div className={`cal${reduce ? " cal--reduce" : ""}`}>
      <Toolbar
        period={periodLabel}
        view={view}
        onView={setView}
        onPrev={() => go(-1)}
        onNext={() => go(1)}
        onToday={reallyToday}
      />

      {view === "month" && <MonthView anchor={anchor} byDay={byDay} todayKey={tk} onOpen={open} onPickDay={(d) => { setAnchor(d); setView("week"); }} />}
      {view === "week" && <WeekView anchor={anchor} byDay={byDay} todayKey={tk} onOpen={open} />}
      {view === "year" && <YearView anchor={anchor} monthCounts={monthCounts} onPickMonth={(d) => { setAnchor(d); setView("month"); }} />}
      {view === "list" && <ListView vms={vms} todayKey={tk} onOpen={open} />}

      <Legend />

      {selected && <EventDrawer ev={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}

/* ── Date primitives ───────────────────────────────────────────────────── */
function startOfWeek(d: Date) {
  const n = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  n.setDate(n.getDate() - ((n.getDay() - WEEK_START + 7) % 7));
  return n;
}
function monthGrid(anchor: Date) {
  const y = anchor.getFullYear();
  const m = anchor.getMonth();
  const first = new Date(y, m, 1);
  const gridStart = new Date(y, m, 1 - ((first.getDay() - WEEK_START + 7) % 7));
  const cells: Date[] = [];
  for (let i = 0; i < 42; i++) cells.push(new Date(gridStart.getFullYear(), gridStart.getMonth(), gridStart.getDate() + i));
  return cells;
}

/* ── Toolbar ───────────────────────────────────────────────────────────── */
function Toolbar({
  period, view, onView, onPrev, onNext, onToday,
}: {
  period: string; view: View;
  onView: (v: View) => void; onPrev: () => void; onNext: () => void; onToday: () => void;
}) {
  const views: View[] = ["list", "week", "month", "year"];
  return (
    <div className="cal__toolbar">
      <div className="cal__nav">
        <button className="cal__icon" onClick={onPrev} aria-label="Previous period">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
        </button>
        <button className="cal__today" onClick={onToday}>Today</button>
        <button className="cal__icon" onClick={onNext} aria-label="Next period">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg>
        </button>
        <h3 className="cal__period" aria-live="polite">{period}</h3>
      </div>
      <div className="cal__views" role="tablist" aria-label="Calendar view">
        {views.map((v) => (
          <button
            key={v}
            role="tab"
            aria-selected={view === v}
            className="cal__viewbtn"
            onClick={() => onView(v)}
          >
            {v[0].toUpperCase() + v.slice(1)}
          </button>
        ))}
      </div>
    </div>
  );
}

/* ── Chip ──────────────────────────────────────────────────────────────── */
function Chip({ ev, onOpen }: { ev: EventVM; onOpen: (v: EventVM) => void }) {
  return (
    <button
      className="cal__chip"
      data-series={ev.series}
      onClick={(e) => { e.stopPropagation(); onOpen(ev); }}
      title={ev.title}
    >
      {ev.hero && <img className="cal__chipthumb" src={ev.hero} alt="" loading="lazy" />}
      {!ev.allDay && <span className="cal__chiptime">{timeLabel(ev._start)}</span>}
      <span className="cal__chiptitle">{ev.title}</span>
    </button>
  );
}

/* ── Month view ────────────────────────────────────────────────────────── */
function MonthView({
  anchor, byDay, todayKey, onOpen, onPickDay,
}: {
  anchor: Date; byDay: Map<string, EventVM[]>; todayKey: string;
  onOpen: (v: EventVM) => void; onPickDay: (d: Date) => void;
}) {
  const cells = monthGrid(anchor);
  const month = anchor.getMonth();
  return (
    <div className="cal__month" role="grid" aria-label="Month">
      <div className="cal__weekhead" role="row">
        {WEEKDAY_LABELS.map((w) => (<div key={w} role="columnheader" className="cal__wd">{w}</div>))}
      </div>
      <div className="cal__grid">
        {cells.map((c) => {
          const key = civilKey(c.getFullYear(), c.getMonth(), c.getDate());
          const evs = byDay.get(key) ?? [];
          const isToday = key === todayKey;
          const out = c.getMonth() !== month;
          const shown = evs.slice(0, 3);
          const extra = evs.length - shown.length;
          return (
            <div key={key} role="gridcell" className={`cal__cell${out ? " cal__cell--out" : ""}${isToday ? " cal__cell--today" : ""}`}>
              <button className="cal__daynum" onClick={() => onPickDay(c)} aria-label={cf({ weekday: "long", day: "numeric", month: "long", year: "numeric" }).format(c)} aria-current={isToday ? "date" : undefined}>
                {c.getDate()}
              </button>
              <div className="cal__cellevents">
                {shown.map((ev) => (<Chip key={ev.slug} ev={ev} onOpen={onOpen} />))}
                {extra > 0 && (<button className="cal__more" onClick={() => onPickDay(c)}>+{extra} more</button>)}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ── Week view ─────────────────────────────────────────────────────────── */
function WeekView({
  anchor, byDay, todayKey, onOpen,
}: {
  anchor: Date; byDay: Map<string, EventVM[]>; todayKey: string; onOpen: (v: EventVM) => void;
}) {
  const start = startOfWeek(anchor);
  const days = Array.from({ length: 7 }, (_, i) => new Date(start.getFullYear(), start.getMonth(), start.getDate() + i));
  return (
    <div className="cal__week" role="grid" aria-label="Week">
      {days.map((c) => {
        const key = civilKey(c.getFullYear(), c.getMonth(), c.getDate());
        const evs = byDay.get(key) ?? [];
        const isToday = key === todayKey;
        return (
          <div key={key} role="gridcell" className={`cal__weekcol${isToday ? " cal__weekcol--today" : ""}`}>
            <div className="cal__weekhd">
              <span className="cal__weekwd">{cf({ weekday: "short" }).format(c)}</span>
              <span className="cal__weekdn">{c.getDate()}</span>
            </div>
            <div className="cal__weekbody">
              {evs.length === 0 ? (
                <span className="cal__weakempty" aria-hidden="true">·</span>
              ) : (
                evs.map((ev) => (<Chip key={ev.slug} ev={ev} onOpen={onOpen} />))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ── Year view ─────────────────────────────────────────────────────────── */
function YearView({
  anchor, monthCounts, onPickMonth,
}: {
  anchor: Date; monthCounts: Map<string, number>; onPickMonth: (d: Date) => void;
}) {
  const y = anchor.getFullYear();
  return (
    <div className="cal__year">
      {Array.from({ length: 12 }, (_, m) => {
        const first = new Date(y, m, 1);
        const count = monthCounts.get(`${y}-${pad(m + 1)}`) ?? 0;
        const cells = monthGrid(first);
        return (
          <button key={m} className="cal__mini" onClick={() => onPickMonth(first)}>
            <div className="cal__minihd">
              <span>{cf({ month: "long" }).format(first)}</span>
              {count > 0 && <span className="cal__minibadge">{count}</span>}
            </div>
            <div className="cal__minigrid" aria-hidden="true">
              {WEEKDAY_LABELS.map((w) => (<span key={w} className="cal__miniwd">{w[0]}</span>))}
              {cells.map((c, i) => {
                const out = c.getMonth() !== m;
                return (<span key={i} className={`cal__minicell${out ? " cal__minicell--out" : ""}`}>{c.getDate()}</span>);
              })}
            </div>
          </button>
        );
      })}
    </div>
  );
}

/* ── List view ─────────────────────────────────────────────────────────── */
function ListView({ vms, todayKey, onOpen }: { vms: EventVM[]; todayKey: string; onOpen: (v: EventVM) => void }) {
  // Type filter — empty set means "all". Only show buttons for series present in the data.
  const [active, setActive] = useState<Set<string>>(new Set());
  const present = SERIES_ORDER.filter((s) => vms.some((v) => v.series === s));
  const counts = useMemo(() => {
    const m: Record<string, number> = {};
    for (const v of vms) m[v.series] = (m[v.series] ?? 0) + 1;
    return m;
  }, [vms]);
  const toggle = (s: string) =>
    setActive((prev) => {
      const next = new Set(prev);
      next.has(s) ? next.delete(s) : next.add(s);
      return next;
    });

  const shown = active.size === 0 ? vms : vms.filter((v) => active.has(v.series));
  // upcoming first (asc), then past (desc); divider between
  const upcoming = shown.filter((v) => v.dayKey >= todayKey);
  const past = shown.filter((v) => v.dayKey < todayKey).reverse();
  const render = (list: EventVM[]) =>
    list.map((ev) => (
      <button key={ev.slug} className="cal__lrow" data-series={ev.series} onClick={() => onOpen(ev)}>
        <span className="cal__ldate">
          <span className="cal__ld">{cf({ day: "2-digit" }).format(ev._start)}</span>
          <span className="cal__lm">{cf({ month: "short" }).format(ev._start)}</span>
          <span className="cal__ly">{cf({ year: "numeric" }).format(ev._start)}</span>
        </span>
        {ev.hero && (
          <span className="cal__lthumb"><img src={ev.hero} alt="" loading="lazy" /></span>
        )}
        <span className="cal__lbody">
          <span className="cal__lmeta">
            <span className="cal__chiptag" data-series={ev.series}>{ev.category ?? ev.series}</span>
            <span className="cal__ltime">{ev.allDay ? "All day" : timeLabel(ev._start)}</span>
          </span>
          <span className="cal__ltitle">{ev.title}</span>
          {ev.venue && <span className="cal__lvenue">{ev.venue}</span>}
        </span>
      </button>
    ));
  return (
    <div className="cal__list">
      {present.length > 1 && (
        <div className="cal__filter" role="group" aria-label="Filter events by type">
          <button
            type="button"
            className="cal__filterbtn"
            aria-pressed={active.size === 0}
            onClick={() => setActive(new Set())}
          >
            All<span className="cal__filtercount">{vms.length}</span>
          </button>
          {present.map((s) => (
            <button
              key={s}
              type="button"
              className="cal__filterbtn"
              data-series={s}
              aria-pressed={active.has(s)}
              onClick={() => toggle(s)}
            >
              {SERIES_LABELS[s] ?? s}<span className="cal__filtercount">{counts[s]}</span>
            </button>
          ))}
        </div>
      )}
      {shown.length === 0 && <p className="cal__empty">No events of the selected type{active.size > 1 ? "s" : ""}.</p>}
      {upcoming.length > 0 && (<><p className="cal__ldiv">Upcoming</p>{render(upcoming)}</>)}
      {past.length > 0 && (<><p className="cal__ldiv">Past</p>{render(past)}</>)}
    </div>
  );
}

/* ── Legend ────────────────────────────────────────────────────────────── */
function Legend() {
  return (
    <div className="cal__legend" aria-hidden="true">
      {SERIES_ORDER.map((s) => (
        <span key={s} className="cal__legitem"><span className="cal__legdot" data-series={s} />{SERIES_LABELS[s]}</span>
      ))}
    </div>
  );
}

/* ── Event detail drawer ───────────────────────────────────────────────── */
function EventDrawer({ ev, onClose }: { ev: EventVM; onClose: () => void }) {
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const prevFocus = document.activeElement as HTMLElement | null;
    const prevOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { e.preventDefault(); onClose(); return; }
      if (e.key === "Tab") {
        const f = panelRef.current?.querySelectorAll<HTMLElement>('a[href],button,[tabindex]:not([tabindex="-1"])');
        if (!f || f.length === 0) return;
        const first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = prevOverflow;
      prevFocus?.focus?.();
    };
  }, [onClose]);

  const sameDay = ev._end && eventDayKey(ev.start) === eventDayKey(ev.end!);
  const when = ev.allDay
    ? tf({ weekday: "long", day: "numeric", month: "long", year: "numeric" }).format(ev._start)
    : `${tf({ weekday: "long", day: "numeric", month: "long", year: "numeric" }).format(ev._start)} · ${timeLabel(ev._start)}${ev._end ? (sameDay ? `–${timeLabel(ev._end)}` : "") : ""}`;

  return (
    <div className="cal__drawer" role="dialog" aria-modal="true" aria-labelledby="cal-drawer-title">
      <div className="cal__backdrop" onClick={onClose} />
      <div className="cal__panel" ref={panelRef}>
        <div className="cal__panelhd">
          <span className="cal__chiptag" data-series={ev.series}>{ev.category ?? ev.series}</span>
          <button className="cal__close" ref={closeRef} onClick={onClose} aria-label="Close">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
          </button>
        </div>
        {ev.hero && (
          <div className="cal__panelhero"><img src={ev.hero} alt="" /></div>
        )}
        <h2 id="cal-drawer-title" className="cal__paneltitle">{ev.title}</h2>
        <dl className="cal__panelmeta">
          <div><dt>When</dt><dd>{when}{ev.allDay && <span className="cal__allday"> · All day</span>}</dd></div>
          {ev.venue && <div><dt>Where</dt><dd>{ev.venue}</dd></div>}
          {ev.organizer && <div><dt>Organizer</dt><dd>{ev.organizer}</dd></div>}
        </dl>
        {ev.summary && <p className="cal__panelsummary">{ev.summary}</p>}
        <div className="cal__panelcta">
          <a className="btn btn--solid" href={ev.href}>View full page ↗</a>
          {ev.link && <a className="btn" href={ev.link} target="_blank" rel="noopener">Event link ↗</a>}
        </div>
      </div>
    </div>
  );
}
