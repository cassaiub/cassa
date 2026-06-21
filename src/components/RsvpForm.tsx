import { useEffect, useMemo, useRef, useState } from "react";
import { RSVP_FIELDS, type RsvpFieldKey } from "../data/rsvp.ts";

interface Props {
  eventSlug: string;
  eventTitle: string;
  fields: RsvpFieldKey[];
  /** Same-origin submit endpoint (already base-resolved by the caller). */
  endpoint: string;
  /** Same-origin count endpoint (already base-resolved by the caller). */
  countEndpoint: string;
  /** ISO datetime after which the form is closed. */
  deadline?: string;
  intro?: string;
  /** Total seats. When set, a live "reserved / remaining" tally is shown. */
  capacity?: number;
}

type Status = "idle" | "submitting" | "ok" | "error";
type Counts = { count: number };

export default function RsvpForm({ eventSlug, eventTitle, fields, endpoint, countEndpoint, deadline, intro, capacity }: Props) {
  const mountedAt = useRef(Date.now());
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string>("");
  const [counts, setCounts] = useState<Counts | null>(null);

  // Live tally (best-effort; PHP-backed, so only populated on the deployed site).
  useEffect(() => {
    let alive = true;
    fetch(`${countEndpoint}?slug=${encodeURIComponent(eventSlug)}`)
      .then((r) => r.json())
      .then((b) => { if (alive && b && b.ok) setCounts({ count: b.count }); })
      .catch(() => {});
    return () => { alive = false; };
  }, [countEndpoint, eventSlug]);

  const closed = useMemo(() => {
    if (!deadline) return false;
    const d = new Date(deadline).getTime();
    return Number.isFinite(d) && Date.now() > d;
  }, [deadline]);

  const remaining = capacity != null && counts != null ? Math.max(0, capacity - counts.count) : null;
  const full = capacity != null && counts != null && counts.count >= capacity;

  // Always-present name field, then the event's chosen catalog fields.
  const defs = useMemo(
    () => fields.map((k) => RSVP_FIELDS[k]).filter(Boolean),
    [fields],
  );

  const seats = () => {
    if (!counts) return null;
    if (capacity != null && remaining != null) {
      return (
        <div className={`rsvp__seats${remaining <= 10 ? " rsvp__seats--low" : ""}`}>
          <span className="rsvp__seats-num">{remaining}</span>
          <span className="rsvp__seats-lbl">
            {remaining === 1 ? "seat" : "seats"} left
            <span className="rsvp__seats-of">of {capacity}</span>
          </span>
        </div>
      );
    }
    if (counts.count > 0) {
      return (
        <p className="rsvp__count">
          <strong>{counts.count}</strong> {counts.count === 1 ? "person has" : "people have"} RSVP'd
        </p>
      );
    }
    return null;
  };

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "submitting") return;
    setStatus("submitting");
    setError("");

    const form = e.currentTarget;
    const data = new FormData(form);
    const payload: Record<string, string> = {};
    data.forEach((v, k) => { payload[k] = String(v).trim(); });
    payload.slug = eventSlug;
    payload.eventTitle = eventTitle;
    payload.elapsed = String(Date.now() - mountedAt.current); // submit-time trap

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok || !body.ok) {
        throw new Error(body.error || "Something went wrong. Please try again.");
      }
      setCounts((c) => (c ? { count: c.count + 1 } : c)); // one seat per registration
      setStatus("ok");
      form.reset();
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Network error. Please try again.");
    }
  }

  if (closed) {
    return (
      <div className="rsvp rsvp--closed" id="rsvp">
        <p className="rsvp__closed-msg">RSVPs for this event are now closed.</p>
        {seats()}
      </div>
    );
  }

  if (status === "ok") {
    return (
      <div className="rsvp rsvp--done" id="rsvp" role="status">
        <p className="rsvp__done-h">You're on the list. 🔭</p>
        <p className="rsvp__done-p">Thanks for reserving your spot for {eventTitle}. We'll see you there.</p>
        {seats()}
      </div>
    );
  }

  if (full) {
    return (
      <div className="rsvp rsvp--closed" id="rsvp">
        <p className="rsvp__closed-msg">This event is fully booked.</p>
        {seats()}
      </div>
    );
  }

  return (
    <div className="rsvp" id="rsvp">
      <h2 className="rsvp__title">Reserve your spot</h2>
      {seats()}
      {intro && <p className="rsvp__intro">{intro}</p>}

      <form className="rsvp__form" onSubmit={onSubmit} noValidate>
        {/* Name — always collected. */}
        <label className="rsvp__field">
          <span className="rsvp__lbl">Name <em aria-hidden="true">*</em></span>
          <input className="rsvp__input" name="name" type="text" required maxLength={120} autoComplete="name" placeholder="Your full name" />
        </label>

        {defs.map((f) => (
          <label className="rsvp__field" key={f.key}>
            <span className="rsvp__lbl">
              {f.label} {f.required && <em aria-hidden="true">*</em>}
            </span>
            {f.type === "textarea" ? (
              <textarea className="rsvp__input rsvp__input--area" name={f.key} rows={3} maxLength={f.maxLength} placeholder={f.placeholder} />
            ) : (
              <input
                className="rsvp__input"
                name={f.key}
                type={f.type}
                required={f.required}
                placeholder={f.placeholder}
                maxLength={f.maxLength}
                min={f.min}
                max={f.max}
              />
            )}
            {f.hint && <span className="rsvp__hint">{f.hint}</span>}
          </label>
        ))}

        {/* Honeypot — must stay empty; hidden from real users. */}
        <div className="rsvp__hp" aria-hidden="true">
          <label>Website<input name="website" tabIndex={-1} autoComplete="off" /></label>
        </div>

        {status === "error" && <p className="rsvp__err" role="alert">{error}</p>}

        <button className="btn btn--solid rsvp__submit" type="submit" disabled={status === "submitting"}>
          {status === "submitting" ? "Sending…" : "RSVP"}
        </button>
        <p className="rsvp__fine">We use your details only to manage attendance for this event.</p>
      </form>
    </div>
  );
}
