import { useEffect, useState } from "react";

/**
 * Live "N / capacity seats reserved" tally for events whose RSVP form lives on
 * Inside. Fetches {count, capacity} from the Inside count API (see
 * src/data/venues.ts for the URL mapping); `capacity` is the venue-derived
 * fallback used until the API answers (the API's capacity wins — it is the
 * enforced cap). Renders nothing while loading or if the fetch fails, so the
 * static page never shows a broken counter.
 */
export default function SeatCounter({
  countUrl,
  capacity,
}: {
  countUrl: string;
  capacity: number | null;
}) {
  const [state, setState] = useState<{ count: number; capacity: number } | null>(null);

  useEffect(() => {
    let alive = true;
    fetch(countUrl)
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
      .then((d: { count?: number; capacity?: number | null }) => {
        if (!alive || typeof d.count !== "number") return;
        const cap = typeof d.capacity === "number" ? d.capacity : capacity;
        if (cap == null) return; // no cap anywhere → nothing to show
        setState({ count: d.count, capacity: cap });
      })
      .catch(() => {}); // API unreachable → stay hidden
    return () => {
      alive = false;
    };
  }, [countUrl, capacity]);

  if (!state) return null;
  const taken = Math.min(state.count, state.capacity);
  const full = state.count >= state.capacity;
  return (
    <p className={`seat-counter${full ? " seat-counter--full" : ""}`} role="status">
      <span className="seat-counter__bar" aria-hidden="true">
        <span
          className="seat-counter__fill"
          style={{ width: `${Math.round((taken / state.capacity) * 100)}%` }}
        />
      </span>
      {full ? (
        <>All <strong>{state.capacity}</strong> seats reserved</>
      ) : (
        <>
          <strong>{taken}</strong> / <strong>{state.capacity}</strong> seats reserved
        </>
      )}
    </p>
  );
}
