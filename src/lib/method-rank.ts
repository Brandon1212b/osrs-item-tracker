import type { RankedMethod } from "@/components/skilling-types";

/** Fastest unlocked XP/h on the list. Used to put XP and GP on one hourly scale. */
export function referenceXpPerHour(list: Pick<RankedMethod, "locked" | "xpPerHour">[]): number {
  const unlocked = list.filter((r) => !r.locked && r.xpPerHour > 0);
  const pool = unlocked.length > 0 ? unlocked : list.filter((r) => r.xpPerHour > 0);
  let max = 0;
  for (const r of pool) if (r.xpPerHour > max) max = r.xpPerHour;
  return max > 0 ? max : 1;
}

/**
 * Value of one hour on this method.
 * gp/h + yourRate * (xp/h / fastest xp/h)
 *
 * Rank by this (higher is better). Do not rank by (rate - gp) / xp:
 * dividing by XP turns a better hour into a worse per-XP score.
 */
export function methodValuePerHour(
  xpPerHour: number,
  gpPerHour: number | null,
  moneyPerHour: number,
  refXpPerHour: number,
): number | null {
  if (gpPerHour == null && !(xpPerHour > 0)) return null;
  const gp = gpPerHour ?? 0;
  const ref = refXpPerHour > 0 ? refXpPerHour : 1;
  const rate = Number.isFinite(moneyPerHour) && moneyPerHour > 0 ? moneyPerHour : 0;
  return gp + rate * (xpPerHour / ref);
}

export function applyMethodValues(list: RankedMethod[], moneyPerHour: number): void {
  const ref = referenceXpPerHour(list);
  for (const row of list) {
    row.netValuePerHour = methodValuePerHour(row.xpPerHour, row.gpPerHour, moneyPerHour, ref);
  }
}
