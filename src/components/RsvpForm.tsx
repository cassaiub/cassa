import { useMemo, useRef, useState } from "react";
import { RSVP_FIELDS, type RsvpFieldKey } from "../data/rsvp.ts";

interface Props {
  eventSlug: string;
  eventTitle: string;
  fields: RsvpFieldKey[];
  /** Same-origin endpoint URL (already base-resolved by the caller). */
  endpoint: string;
  /** ISO datetime after which the form is closed. */
  deadline?: string;
  intro?: string;
}

type Status = "idle" | "submitting" | "ok" | "error";

export default function RsvpForm({ eventSlug, eventTitle, fields, endpoint, deadline, intro }: Props) {
  const mountedAt = useRef(Date.now());
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string>("");

  const closed = useMemo(() => {
    if (!deadline) return false;
    const d = new Date(deadline).getTime();
    return Number.isFinite(d) && Date.now() > d;
  }, [deadline]);

  // Always-present name field, then the event's chosen catalog fields.
  const defs = useMemo(
    () => fields.map((k) => RSVP_FIELDS[k]).filter(Boolean),
    [fields],
  );

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
      </div>
    );
  }

  if (status === "ok") {
    return (
      <div className="rsvp rsvp--done" id="rsvp" role="status">
        <p className="rsvp__done-h">You're on the list. 🔭</p>
        <p className="rsvp__done-p">Thanks for reserving your spot for {eventTitle}. We'll see you there.</p>
      </div>
    );
  }

  return (
    <div className="rsvp" id="rsvp">
      <h2 className="rsvp__title">Reserve your spot</h2>
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
