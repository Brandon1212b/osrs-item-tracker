/**
 * Last time we checked stored XP/GP model against the linked wiki/MMG.
 * Only mark validated when numbers matched the guide (or were fixed to match).
 * Omit an id until a real check is done — UI shows red “Not validated”.
 */
export type MethodValidation = {
  /** ISO date YYYY-MM-DD of the last successful match against the linked guide(s). */
  checkedAt: string;
};

const VALIDATED: Record<string, MethodValidation> = {
  // Fixed + checked against wiki MMG (Aug 2026)
  "sunfire-runes": { checkedAt: "2026-08-26" },
  "sepulchre-floor-5-loot": { checkedAt: "2026-08-26" },
  "redwood-pyre": { checkedAt: "2026-08-26" },
  "wintertodt-mass": { checkedAt: "2026-08-26" },
};

export type ValidationDisplay =
  | { status: "fresh" | "stale"; checkedAt: string; label: string }
  | { status: "none"; checkedAt: null; label: string };

const MS_DAY = 86_400_000;
const FRESH_DAYS = 30;

export function getMethodValidation(methodId: string): ValidationDisplay {
  const entry = VALIDATED[methodId];
  if (!entry) {
    return {
      status: "none",
      checkedAt: null,
      label: "Not validated",
    };
  }
  const checked = Date.parse(`${entry.checkedAt}T12:00:00Z`);
  const ageDays = (Date.now() - checked) / MS_DAY;
  if (ageDays <= FRESH_DAYS) {
    return {
      status: "fresh",
      checkedAt: entry.checkedAt,
      label: `Validated ${entry.checkedAt}`,
    };
  }
  return {
    status: "stale",
    checkedAt: entry.checkedAt,
    label: `Last validated ${entry.checkedAt}`,
  };
}
