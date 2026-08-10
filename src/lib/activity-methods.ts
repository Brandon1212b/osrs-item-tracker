/**
 * Activity / minigame training methods that do not fit simple input→output.
 *
 * Use when rewards are multi-item, points-based, or quality-scored.
 * Valuation: expectedLootGpPerHour + itemized rewards − consumable costs.
 *
 * Level-scaled activities use a rate table; the UI shows a single card
 * resolved to the highest band the player can access.
 *
 * Pilot: Wintertodt (Firemaking).
 * Sources: oldschool.runescape.wiki Pay-to-play Firemaking training (2026).
 */

export type MethodPart = { name: string; qty: number };

/** Expected GE-traded reward per hour (when itemizable). */
export type ActivityReward = {
  name: string;
  expectedQtyPerHour: number;
};

/** One row in a level-scaled rate table (highest band ≤ player level wins). */
export type ActivityRateBand = {
  level: number;
  xpPerHour: number;
  expectedLootGpPerHour?: number;
  secondaryXpPerHour?: number;
};

export type ActivityMethod = {
  id: string;
  label: string;
  skillKey: string;
  /** Minimum level to unlock the activity. */
  level: number;
  /**
   * Level-scaled rates. UI picks the highest band with band.level ≤ player level.
   * If no player is loaded, uses the highest band (optimistic / end-game rates).
   */
  rateBands: ActivityRateBand[];
  /** Optional secondary skill label for passive XP (e.g. woodcutting). */
  secondarySkill?: string;
  /** GE consumables used per hour (often empty for Wintertodt). */
  consumables: MethodPart[];
  /** Itemized rewards when the drop table is stable enough. */
  rewards: ActivityReward[];
  intensity?: "low" | "medium" | "high";
  notes?: string;
};

/**
 * Wintertodt — official mass worlds, no kindling (roots only).
 * Wiki XP/hr scales with FM level.
 * Loot EV is conservative community average excluding rare unique EV.
 */
export const WINTERTODT_METHODS: ActivityMethod[] = [
  {
    id: "wintertodt-mass",
    label: "Wintertodt (mass)",
    skillKey: "firemaking",
    level: 50,
    secondarySkill: "woodcutting",
    rateBands: [
      { level: 50, xpPerHour: 161_000, expectedLootGpPerHour: 150_000, secondaryXpPerHour: 10_000 },
      { level: 70, xpPerHour: 226_000, expectedLootGpPerHour: 180_000, secondaryXpPerHour: 15_000 },
      { level: 90, xpPerHour: 290_000, expectedLootGpPerHour: 220_000, secondaryXpPerHour: 19_000 },
      { level: 99, xpPerHour: 320_000, expectedLootGpPerHour: 250_000, secondaryXpPerHour: 21_000 },
    ],
    consumables: [],
    rewards: [],
    intensity: "low",
    notes:
      "Official worlds (~4 min games). Roots only (no fletch). Reward cart EV excl. rare uniques. Rates scale with your Firemaking level.",
  },
];

/** Pick the best rate band for a player level (or the top band if unknown). */
export function resolveActivityBand(
  method: ActivityMethod,
  playerLevel: number | null | undefined,
): ActivityRateBand {
  const bands = [...method.rateBands].sort((a, b) => a.level - b.level);
  if (playerLevel == null) return bands[bands.length - 1]!;
  let best = bands[0]!;
  for (const b of bands) {
    if (b.level <= playerLevel) best = b;
  }
  return best;
}

/** All activity methods registered so far (by skill). */
export function activitiesForSkill(skillKey: string): ActivityMethod[] {
  if (skillKey === "firemaking") return WINTERTODT_METHODS;
  return [];
}

export function activityMethodItemNames(methods: ActivityMethod[]): string[] {
  const names = new Set<string>();
  for (const m of methods) {
    for (const p of m.consumables) names.add(p.name);
    for (const r of m.rewards) names.add(r.name);
  }
  return [...names];
}
