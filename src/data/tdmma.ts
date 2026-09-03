import { insideFormMetaUrl } from "./inside-forms.ts";

// The TDMMA 2026 application form on Inside. The form builder's Settings there
// (inside.cassa.bd → Forms → TDMMA Workshop 2026 — Application) is the
// GOVERNING value for the deadline: editing it updates the public form
// instantly, and this site follows on its own — the page countdown and the
// home-hero slide fetch the live deadline from the form's /meta endpoint on
// every page load (since 2026-08-14; before that, deploys of inside re-asserted
// a constant from scripts/create-tdmma-2026-form.ts onto the form, which is
// what kept reverting extensions).
export const TDMMA_FORM_URL = "https://inside.cassa.bd/forms/event/2026-07-12-b";
export const TDMMA_FORM_META_URL = insideFormMetaUrl(TDMMA_FORM_URL)!;

// STATIC FALLBACK for that live value — end of 5 September, Dhaka (BST), the
// close of the SECOND, full-fee-only round (round one closed 18 August). Baked
// into the page at build time and used whenever the /meta fetch fails (Inside
// down, offline, no JS). Keep it in step with the form's Settings when the
// deadline moves so the fallback never lies for long.
// Read off the live /meta on 2026-09-03: closesAt was 2026-09-02T17:59:00Z —
// i.e. 2 Sep 23:59 BST, a day EARLIER than the 3 September this constant then
// claimed, so the form had already shut. The 2026-08-28 note that read that
// same value as "3 Sep 23:59 BST" was simply wrong (17:59Z + 6h = 2 Sep 23:59).
// EXTENDED to 5 September 2026, 23:59 Dhaka (user, 2026-09-03) — strictly, and
// set in the form's Settings, which is the governing value.
// Extension history lives in src/pages/tdmma-2026.astro.
export const TDMMA_APPLY_CLOSES = "2026-09-05T23:59:00+06:00";
