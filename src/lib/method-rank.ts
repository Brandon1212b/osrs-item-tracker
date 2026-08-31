import type { RankedMethod } from "@/components/skilling-types";

export type MethodSort =
  | "value_desc"
  | "value_asc"
  | "gp_desc"
  | "gp_asc"
  | "xp_desc"
  | "xp_asc"
  | "cost_desc"
  | "cost_asc";

export const DEFAULT_METHOD_SORT: MethodSort = "value_desc";

export function referenceXpPerHour(list: Pick<RankedMethod, "locked" | "xpPerHour">[]): number {
  const unlocked = list.filter((r) => !r.locked && r.xpPerHour > 0);
  const pool = unlocked.length > 0 ? unlocked : list.filter((r) => r.xpPerHour > 0);
  let max = 0;
  for (const r of pool) if (r.xpPerHour > max) max = r.xpPerHour;
  return max > 0 ? max : 1;
}

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

function nullsLast(a: number | null, b: number | null, dir: 1 | -1): number {
  if (a == null && b == null) return 0;
  if (a == null) return 1;
  if (b == null) return -1;
  return (a - b) * dir;
}

export function compareMethods(
  a: RankedMethod,
  b: RankedMethod,
  sort: MethodSort,
  lockedLast: boolean,
  goalView: "rate" | "goal",
): number {
  if (lockedLast && a.locked !== b.locked) return a.locked ? 1 : -1;
  switch (sort) {
    case "value_desc":
      return nullsLast(b.netValuePerHour ?? null, a.netValuePerHour ?? null, 1);
    case "value_asc":
      return nullsLast(a.netValuePerHour ?? null, b.netValuePerHour ?? null, 1);
    case "gp_desc":
      return goalView === "goal"
        ? nullsLast(b.totalGp ?? null, a.totalGp ?? null, 1)
        : nullsLast(b.gpPerHour, a.gpPerHour, 1);
    case "gp_asc":
      return goalView === "goal"
        ? nullsLast(a.totalGp ?? null, b.totalGp ?? null, 1)
        : nullsLast(a.gpPerHour, b.gpPerHour, 1);
    case "xp_desc":
      return goalView === "goal"
        ? nullsLast(a.hoursToTarget ?? null, b.hoursToTarget ?? null, 1)
        : b.xpPerHour - a.xpPerHour;
    case "xp_asc":
      return goalView === "goal"
        ? nullsLast(b.hoursToTarget ?? null, a.hoursToTarget ?? null, 1)
        : a.xpPerHour - b.xpPerHour;
    case "cost_desc":
      return nullsLast(b.costPerXp, a.costPerXp, 1);
    case "cost_asc":
    default:
      return nullsLast(a.costPerXp, b.costPerXp, 1);
  }
}
