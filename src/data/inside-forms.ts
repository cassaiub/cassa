// Inside (inside.cassa.bd) is the system of record for application/RSVP forms,
// and the form builder's Settings there is the governing value for a form's
// deadline. Its read-only public API exposes per-form metadata:
//   form:  https://inside.cassa.bd/forms/<category>/<slug>
//   meta:  https://inside.cassa.bd/api/forms/<category>/<slug>/meta → { closesAt, open }
// (The seat tally at …/count is consumed by SeatCounter the same way.)
// Deriving the endpoint from the form's public URL lets any page that links an
// Inside form follow a deadline changed in the builder WITHOUT a rebuild: the
// Countdown island and the home-hero call slide fetch it on load, falling back
// to the value baked in at build time if Inside is unreachable.
const FORM_URL_RE = /^https:\/\/inside\.cassa\.bd\/forms\/([a-z0-9-]+)\/([a-z0-9-]+)\/?$/;

/** The live-deadline endpoint for an Inside form URL; undefined for any other link. */
export function insideFormMetaUrl(formUrl: string | undefined): string | undefined {
  const m = formUrl?.match(FORM_URL_RE);
  return m ? `https://inside.cassa.bd/api/forms/${m[1]}/${m[2]}/meta` : undefined;
}
