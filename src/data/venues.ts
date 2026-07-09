// Venue seat capacities. An event that links an Inside RSVP form (via
// `register`) gets a live "N / capacity seats reserved" tally on its detail
// page; the capacity comes from the venue automatically so it never has to be
// hand-typed per event. Match is a case-insensitive substring test against the
// event's `venue` frontmatter — first hit wins. An explicit `seats:` in the
// event frontmatter overrides the venue-derived value.
//
// NOTE: the ENFORCED cap lives on the Inside form (`responseLimit`, set when
// the form is created — see inside/scripts/create-*-form.ts). Keep the two in
// sync via this table; the counter island prefers the capacity reported by the
// Inside count API when the two disagree.

export interface VenueCapacity {
  /** Case-insensitive substring matched against the event's `venue`. */
  match: string;
  capacity: number;
}

export const VENUE_CAPACITIES: VenueCapacity[] = [
  // The CASSA office (IUB Main Building Rooftop) seats 50.
  { match: "IUB Main Building Rooftop", capacity: 50 },
];

/** Capacity for a venue string, or null when no venue rule matches. */
export function capacityForVenue(venue: string | undefined): number | null {
  if (!venue) return null;
  const v = venue.toLowerCase();
  const hit = VENUE_CAPACITIES.find((r) => v.includes(r.match.toLowerCase()));
  return hit ? hit.capacity : null;
}

/**
 * The Inside seat-count API for a `register` URL, or null when the URL is not
 * an Inside form. https://inside.cassa.bd/forms/<category>/<slug> →
 * https://inside.cassa.bd/api/forms/<category>/<slug>/count
 */
export function seatCountUrl(register: string | undefined): string | null {
  if (!register) return null;
  const m = register.match(/^(https:\/\/inside\.cassa\.bd)\/forms\/([a-z0-9-]+)\/([a-z0-9-]+)\/?$/);
  return m ? `${m[1]}/api/forms/${m[2]}/${m[3]}/count` : null;
}
