/** Official OSRS experience curve (same for every skill). Level 99 = 13,034,431 XP. */

const MAX_LEVEL = 99;

function computeXpTable(maxLevel: number): number[] {
  const table = new Array<number>(maxLevel + 1);
  table[0] = 0;
  table[1] = 0;
  let points = 0;
  for (let n = 1; n < maxLevel; n++) {
    points += Math.floor(n + 300 * Math.pow(2, n / 7));
    table[n + 1] = Math.floor(points / 4);
  }
  return table;
}

const XP_TABLE = computeXpTable(MAX_LEVEL);

export function xpForLevel(level: number): number {
  if (!Number.isFinite(level) || level <= 1) return 0;
  const lvl = Math.min(MAX_LEVEL, Math.max(1, Math.floor(level)));
  return XP_TABLE[lvl] ?? 0;
}

export function levelFromXp(xp: number): number {
  if (!Number.isFinite(xp) || xp <= 0) return 1;
  for (let level = MAX_LEVEL; level >= 1; level--) {
    if (xp >= (XP_TABLE[level] ?? 0)) return level;
  }
  return 1;
}

export function clampSkillLevel(level: number, min = 1, max = MAX_LEVEL): number {
  if (!Number.isFinite(level)) return min;
  return Math.min(max, Math.max(min, Math.round(level)));
}

/** XP still needed to reach targetLevel from currentXp. Never negative. */
export function xpRemainingToLevel(currentXp: number, targetLevel: number): number {
  const need = xpForLevel(targetLevel);
  const have = Number.isFinite(currentXp) ? Math.max(0, currentXp) : 0;
  return Math.max(0, need - have);
}

export function hoursToXp(xpRemaining: number, xpPerHour: number): number | null {
  if (!Number.isFinite(xpPerHour) || xpPerHour <= 0) return null;
  if (!Number.isFinite(xpRemaining) || xpRemaining <= 0) return 0;
  return xpRemaining / xpPerHour;
}

export const XP_FOR_99 = XP_TABLE[99]!;
export const MAX_SKILL_LEVEL = MAX_LEVEL;
