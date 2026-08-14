// The instant TDMMA 2026 applications close — end of 18 August, Dhaka (BST).
// This must equal CLOSES_AT in ../inside/scripts/create-tdmma-2026-form.ts,
// the GOVERNING value: that script re-asserts the Inside form's deadline on
// every inside deploy, so an extension made only in the form builder's
// Settings is silently reverted (that is what ate the first 18-Aug edit,
// 2026-08-14). To extend: change the script constant AND this one, deploy
// inside, deploy cassa. Consumed by the TDMMA page's countdown and by the
// home hero, which drops the TDMMA slide the moment this instant passes
// (client-side, no rebuild needed).
// Extension history lives in src/pages/tdmma-2026.astro.
export const TDMMA_APPLY_CLOSES = "2026-08-18T23:59:00+06:00";
