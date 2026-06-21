// Single source of truth for the site-wide RSVP system.
//
// One backend (`public/api/rsvp.php`) and one form component (`RsvpForm.tsx`)
// serve EVERY event. An event opts in by adding an `rsvp` block to its
// frontmatter (see `src/content.config.ts`); the field catalog below defines
// every field an event may choose to collect. "name" is always collected and
// is not part of the catalog.

export type RsvpFieldKey =
  | "email"
  | "phone"
  | "affiliation"
  | "studentId"
  | "guests"
  | "notes";

export interface RsvpFieldDef {
  key: RsvpFieldKey;
  label: string;
  /** Maps to the HTML input type, or "textarea". */
  type: "email" | "tel" | "text" | "number" | "textarea";
  /** Required fields block submission until filled. */
  required?: boolean;
  placeholder?: string;
  min?: number;
  max?: number;
  maxLength?: number;
  /** Helper hint shown under the field. */
  hint?: string;
}

/** Every field an event may request. Order here is the render order. */
export const RSVP_FIELDS: Record<RsvpFieldKey, RsvpFieldDef> = {
  email: { key: "email", label: "Email", type: "email", required: true, placeholder: "you@example.com", maxLength: 160 },
  phone: { key: "phone", label: "Phone", type: "tel", placeholder: "01XXXXXXXXXX", maxLength: 32 },
  affiliation: { key: "affiliation", label: "Affiliation", type: "text", placeholder: "IUB / school / organization", maxLength: 120 },
  studentId: { key: "studentId", label: "IUB Student ID", type: "text", placeholder: "e.g. 2310000", maxLength: 32 },
  guests: { key: "guests", label: "Number of guests", type: "number", min: 0, max: 20, placeholder: "0", hint: "Besides yourself." },
  notes: { key: "notes", label: "Anything you'd like us to know?", type: "textarea", maxLength: 1000, hint: "Optional." },
};

/** Used when an event sets `rsvp: true` (no explicit field list). Name is always added. */
export const DEFAULT_RSVP_FIELDS: RsvpFieldKey[] = ["email", "guests", "notes"];

/** Default seat capacity when an event doesn't set its own. Drives the live "reserved / remaining" tally. */
export const DEFAULT_RSVP_CAPACITY = 100;

/** Same-origin endpoints. Wrap with withBase() at call sites for a future subpath deploy. */
export const RSVP_ENDPOINT = "/api/rsvp.php";
export const RSVP_COUNT_ENDPOINT = "/api/rsvp-count.php";

/** Frontmatter shape (mirrors the zod schema in content.config.ts). */
export interface RsvpConfig {
  fields?: RsvpFieldKey[];
  /** ISO datetime after which the form closes. */
  deadline?: string;
  /** Optional sentence shown above the form. */
  intro?: string;
  /** Total seats. When set, the form shows a live "reserved / remaining" count. */
  capacity?: number;
}

export interface ResolvedRsvp {
  fields: RsvpFieldKey[];
  deadline?: string;
  intro?: string;
  capacity?: number;
}

/** Normalize the frontmatter `rsvp` value (boolean | object | undefined) into a config, or null if no form. */
export function resolveRsvp(rsvp: boolean | RsvpConfig | undefined | null): ResolvedRsvp | null {
  if (!rsvp) return null;
  if (rsvp === true) return { fields: DEFAULT_RSVP_FIELDS, capacity: DEFAULT_RSVP_CAPACITY };
  const fields = rsvp.fields && rsvp.fields.length ? rsvp.fields : DEFAULT_RSVP_FIELDS;
  return { fields, deadline: rsvp.deadline, intro: rsvp.intro, capacity: rsvp.capacity ?? DEFAULT_RSVP_CAPACITY };
}
