/* Single rule for the prominent "personal site" link on a PersonCard.
 *   - Asad → his internal CASSA profile page.
 *   - Director / Core / Associate / Graduate Member → their links.Website (if any).
 *   - Everyone else (Affiliate, Staff, RA, Intern, Ambassador, Alumni) → none.
 * Used wherever a PersonCard is rendered so the behaviour is identical site-wide. */
import { withBase } from "../site-nav.ts";

const MEMBER_TIERS = new Set([
  "Director", "Core Member", "Associate Member", "Graduate Member",
]);

/** Directors + members get a clickable name → PersonCard drawer on the people page. */
export const isMemberTier = (tier: string): boolean => MEMBER_TIERS.has(tier);

export function personalSite(
  slug: string,
  data: { tier: string; links?: Record<string, string> },
): string | undefined {
  if (slug === "asad") return withBase("/people/asad");
  if (!MEMBER_TIERS.has(data.tier)) return undefined;
  return data.links?.Website;
}
