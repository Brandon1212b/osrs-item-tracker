import type { RankedMethod } from "@/components/skilling-types";

/** True when `best` is at least as fast and at least as profitable as `other`, and better on one. */
export function dominatesMethod(best: RankedMethod, other: RankedMethod): boolean {
  if (best.id === other.id) return false;
  if (best.locked || other.locked) return false;
  if (best.gpPerHour == null || other.gpPerHour == null) return false;
  if (best.xpPerHour < other.xpPerHour) return false;
  if (best.gpPerHour < other.gpPerHour) return false;
  return best.xpPerHour > other.xpPerHour || best.gpPerHour > other.gpPerHour;
}

/** Label of the first unlocked method that is strictly better on XP/h and GP/h. */
export function findDominator(row: RankedMethod, list: RankedMethod[]): RankedMethod | null {
  if (row.locked || row.gpPerHour == null) return null;
  return list.find((other) => dominatesMethod(other, row)) ?? null;
}

export function applyDominance(list: RankedMethod[]): void {
  for (const row of list) {
    const better = findDominator(row, list);
    row.dominatedBy = better?.label ?? null;
  }
}
