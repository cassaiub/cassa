import { useMemo, useRef, useState } from "react";

/*
 * Standalone registration form for camps that need a richer form than the
 * site-wide RSVP (dropdowns, multiple choice, declaration). Self-contained on
 * purpose — it shares NO code with the RSVP system. Posts to camp-register.php,
 * which appends to the same cassa-rsvp store so the admin viewer still works.
 */

type Field = {
  key: string;
  label: string;
  type: "text" | "email" | "tel" | "textarea" | "select" | "radio" | "checkbox" | "checkboxes";
  required?: boolean;
  placeholder?: string;
  maxLength?: number;
  options?: string[];
  /** Text beside a checkbox (the thing being agreed to). */
  checkboxLabel?: string;
  /** Show only when another field currently equals a value. */
  showIf?: { field: string; equals: string };
  hint?: string;
};

// Order mirrors the original Google Form (name/email first by convention).
const FIELDS: Field[] = [
  { key: "name", label: "Full name", type: "text", required: true, placeholder: "Your full name", maxLength: 120, hint: "(required · up to 120 characters)" },
  { key: "email", label: "Email", type: "email", required: true, placeholder: "you@example.com", maxLength: 160, hint: "(required · a valid email, up to 160 characters · we email selected participants here)" },
  { key: "class", label: "Class", type: "select", required: true, options: ["6", "7", "8", "9", "10"], placeholder: "Select your class", hint: "(required · choose your class, 6–10)" },
  { key: "school", label: "School", type: "text", required: true, placeholder: "Your school's name", maxLength: 160, hint: "(required · up to 160 characters)" },
  { key: "parentPhone", label: "Parent / guardian phone number", type: "tel", required: true, placeholder: "01XXXXXXXXXX", maxLength: 32, hint: "(required · up to 32 characters)" },
  { key: "district", label: "District / area of residence", type: "text", required: true, placeholder: "e.g. Dhaka", maxLength: 120, hint: "(required · up to 120 characters)" },
  {
    key: "attendance", label: "Attendance Confirmation", type: "checkboxes", required: true,
    options: [
      "Day 1: 10 July 2026 (10:00 AM – 4:00 PM)",
      "Day 2: 11 July 2026 (10:00 AM – 4:00 PM)",
    ],
    hint: "(required · tick at least one day you can attend at CASSA, IUB)",
  },
  {
    key: "howHeard", label: "How did you first learn about astronomy?", type: "radio", required: true,
    options: ["Books", "YouTube", "Teacher", "Social Media", "Other"],
    hint: "(required · choose one)",
  },
  {
    key: "howHeardOther", label: "Please specify", type: "text", required: true, maxLength: 160,
    placeholder: "How you first learned about astronomy", showIf: { field: "howHeard", equals: "Other" },
    hint: "(required when you choose “Other” · up to 160 characters)",
  },
  {
    key: "priorOlympiad", label: "Have you taken part in a BDOAA / astronomy olympiad before?", type: "radio", required: true,
    options: ["Yes", "No"],
    hint: "(required · choose one)",
  },
  {
    key: "priorDetails", label: "If yes, tell us about it", type: "textarea", maxLength: 1000,
    placeholder: "Which olympiad, year, and result…", showIf: { field: "priorOlympiad", equals: "Yes" },
    hint: "(optional · up to 1000 characters)",
  },
  { key: "whyJoin", label: "Which aspect(s) of the camp inspired you to apply?", type: "textarea", required: true, maxLength: 1000, hint: "(required · up to 1000 characters)" },
  { key: "whatLearn", label: "What do you hope to learn?", type: "textarea", required: true, maxLength: 1000, hint: "(required · up to 1000 characters)" },
  {
    key: "parentalPermission", label: "Do you have your parent's / guardian's permission to attend?", type: "radio", required: true,
    options: ["Yes", "No"],
    hint: "(required · choose one)",
  },
  {
    key: "declaration", label: "Declaration", type: "checkbox", required: true,
    checkboxLabel: "I confirm that the information provided above is accurate to the best of my knowledge.",
  },
];

const FIELD_BY_KEY: Record<string, Field> = Object.fromEntries(FIELDS.map((f) => [f.key, f]));
// Delimiter joining multi-select values into a single stored/submitted string.
const MULTI_SEP = ", ";

type Status = "idle" | "submitting" | "ok" | "error";

interface Props {
  eventSlug: string;
  eventTitle: string;
  /** Same-origin submit endpoint (already base-resolved by the caller). */
  endpoint: string;
  /** ISO datetime after which the form is closed. */
  deadline?: string;
  intro?: string;
}

export default function CampRegisterForm({ eventSlug, eventTitle, endpoint, deadline, intro }: Props) {
  const mountedAt = useRef(Date.now());
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string>("");
  const [values, setValues] = useState<Record<string, string>>({});

  const closed = useMemo(() => {
    if (!deadline) return false;
    const d = new Date(deadline).getTime();
    return Number.isFinite(d) && Date.now() > d;
  }, [deadline]);

  const visible = (f: Field) => !f.showIf || values[f.showIf.field] === f.showIf.equals;

  function onChange(e: React.ChangeEvent<HTMLFormElement>) {
    const t = e.target as HTMLInputElement;
    if (!t.name) return;
    // Multi-checkbox group: toggle this option in/out of the joined value.
    if (FIELD_BY_KEY[t.name]?.type === "checkboxes") {
      setValues((prev) => {
        const current = (prev[t.name] ?? "").split(MULTI_SEP).filter(Boolean);
        const next = t.checked ? [...current, t.value] : current.filter((o) => o !== t.value);
        return { ...prev, [t.name]: next.join(MULTI_SEP) };
      });
      return;
    }
    const v = t.type === "checkbox" ? (t.checked ? "Yes" : "") : t.value;
    setValues((prev) => ({ ...prev, [t.name]: v }));
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "submitting") return;

    // Client-side required check (the form uses noValidate for custom errors).
    for (const f of FIELDS) {
      if (!f.required || !visible(f)) continue;
      const v = (values[f.key] ?? "").trim();
      if (v === "") {
        setStatus("error");
        setError(f.type === "checkbox" ? "Please confirm the declaration." : `Please complete: ${f.label}.`);
        return;
      }
    }

    setStatus("submitting");
    setError("");

    const payload: Record<string, string> = {};
    for (const f of FIELDS) {
      if (visible(f)) payload[f.key] = (values[f.key] ?? "").trim();
    }
    payload.slug = eventSlug;
    payload.eventTitle = eventTitle;
    payload.website = values.website ?? ""; // honeypot
    payload.elapsed = String(Date.now() - mountedAt.current);

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
      setValues({});
      e.currentTarget?.reset?.();
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Network error. Please try again.");
    }
  }

  if (closed) {
    return (
      <div className="rsvp rsvp--closed" id="register">
        <p className="rsvp__closed-msg">Registration for this camp is now closed.</p>
      </div>
    );
  }

  if (status === "ok") {
    return (
      <div className="rsvp rsvp--done" id="register" role="status">
        <p className="rsvp__done-h">Registration received. 🔭</p>
        <p className="rsvp__done-p">
          Thanks for registering for {eventTitle}. We'll email the selected participants by 6 July 2026.
        </p>
      </div>
    );
  }

  return (
    <div className="rsvp" id="register">
      <h2 className="rsvp__title">Register for the camp</h2>
      {intro && <p className="rsvp__intro">{intro}</p>}

      <form className="rsvp__form" onSubmit={onSubmit} onChange={onChange} noValidate>
        {FIELDS.filter(visible).map((f) => {
          const star = f.required ? <em aria-hidden="true">*</em> : null;

          if (f.type === "checkboxes") {
            return (
              <fieldset className="rsvp__field rsvp__choices" key={f.key}>
                <legend className="rsvp__lbl">{f.label} {star}</legend>
                <div className="rsvp__choice-row">
                  {f.options!.map((opt) => (
                    <label className="rsvp__choice" key={opt}>
                      <input type="checkbox" name={f.key} value={opt} />
                      <span>{opt}</span>
                    </label>
                  ))}
                </div>
                {f.hint && <span className="rsvp__hint">{f.hint}</span>}
              </fieldset>
            );
          }

          if (f.type === "checkbox") {
            return (
              <label className="rsvp__check" key={f.key}>
                <input type="checkbox" name={f.key} value="Yes" />
                <span className="rsvp__check-lbl">{f.checkboxLabel} {star}</span>
              </label>
            );
          }

          if (f.type === "radio") {
            return (
              <fieldset className="rsvp__field rsvp__choices" key={f.key}>
                <legend className="rsvp__lbl">{f.label} {star}</legend>
                <div className="rsvp__choice-row">
                  {f.options!.map((opt) => (
                    <label className="rsvp__choice" key={opt}>
                      <input type="radio" name={f.key} value={opt} />
                      <span>{opt}</span>
                    </label>
                  ))}
                </div>
                {f.hint && <span className="rsvp__hint">{f.hint}</span>}
              </fieldset>
            );
          }

          return (
            <label className="rsvp__field" key={f.key}>
              <span className="rsvp__lbl">{f.label} {star}</span>
              {f.type === "select" ? (
                <select className="rsvp__input" name={f.key} defaultValue="">
                  <option value="" disabled>{f.placeholder ?? "Select…"}</option>
                  {f.options!.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              ) : f.type === "textarea" ? (
                <textarea className="rsvp__input rsvp__input--area" name={f.key} rows={3} maxLength={f.maxLength} placeholder={f.placeholder} />
              ) : (
                <input className="rsvp__input" name={f.key} type={f.type} placeholder={f.placeholder} maxLength={f.maxLength} />
              )}
              {f.hint && <span className="rsvp__hint">{f.hint}</span>}
            </label>
          );
        })}

        {/* Honeypot — must stay empty; hidden from real users. */}
        <div className="rsvp__hp" aria-hidden="true">
          <label>Website<input name="website" tabIndex={-1} autoComplete="off" /></label>
        </div>

        {status === "error" && <p className="rsvp__err" role="alert">{error}</p>}

        <button className="btn btn--solid rsvp__submit" type="submit" disabled={status === "submitting"}>
          {status === "submitting" ? "Sending…" : "Submit registration"}
        </button>
        <p className="rsvp__fine">We use your details only to manage this camp's registration.</p>
      </form>
    </div>
  );
}
