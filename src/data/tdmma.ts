// The instant TDMMA 2026 applications close — end of 18 August, Dhaka (BST).
// This is the SAME instant as the Deadline field in the Inside form's Settings
// (inside.cassa.bd → Forms → TDMMA Workshop 2026 — Application), which is what
// actually gates submission — change the two together, always. Consumed by the
// TDMMA page's countdown and by the home hero, which drops the TDMMA slide the
// moment this instant passes (client-side, no rebuild needed).
// Extension history lives in src/pages/tdmma-2026.astro.
export const TDMMA_APPLY_CLOSES = "2026-08-18T23:59:00+06:00";
