/**
 * Activity / minigame training methods that do not fit simple input→output.
 *
 * Use when rewards are multi-item, points-based, or quality-scored.
 * Valuation: expectedLootGpPerHour + itemized rewards − consumable costs.
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

export type ActivityMethod = {
  id: string;
  label: string;
  skillKey: string;
  level: number;
  /** Focused / typical XP per hour (not theoretical max). */
  xpPerHour: number;
  /** Optional passive secondary XP. */
  secondaryXp?: { skill: string; xpPerHour: number };
  /** GE consumables used per hour (often empty for Wintertodt). */
  consumables: MethodPart[];
  /** Itemized rewards when the drop table is stable enough. */
  rewards: ActivityReward[];
  /**
   * Escape hatch for highly random loot tables (crates, reward carts).
   * Community / wiki typical GP/hr from rewards. Prefer itemizing when possible.
   * Not a hardcoded GE price of a specific item — an expected value aggregate.
   */
  expectedLootGpPerHour?: number;
  intensity?: "low" | "medium" | "high";
  notes?: string;
};

/**
 * Wintertodt — official mass worlds, no kindling (roots only).
 * Wiki XP/hr scales with FM level; we expose representative bands.
 * Loot: Reward cart rolls; average ~150–300k gp/hr depending on other skills.
 * Using conservative mid ~200k expected loot gp/hr (excludes rare uniques EV).
 */
export const WINTERTODT_METHODS: ActivityMethod[] = [
  {
    id: "wintertodt-50",
    label: "Wintertodt (mass, lvl 50)",
    skillKey: "firemaking",
    level: 50,
    xpPerHour: 161_000,
    secondaryXp: { skill: "woodcutting", xpPerHour: 10_000 },
    consumables: [],
    rewards: [],
    expectedLootGpPerHour: 150_000,
    intensity: "low",
    notes:
      "Official worlds (~4 min games). Roots only (no fletch). Reward cart EV excl. rare uniques.",
  },
  {
    id: "wintertodt-70",
    label: "Wintertodt (mass, lvl 70)",
    skillKey: "firemaking",
    level: 70,
    xpPerHour: 226_000,
    secondaryXp: { skill: "woodcutting", xpPerHour: 15_000 },
    consumables: [],
    rewards: [],
    expectedLootGpPerHour: 180_000,
    intensity: "low",
    notes: "Official worlds. Roots only. Higher other skills improve crate loot quality.",
  },
  {
    id: "wintertodt-90",
    label: "Wintertodt (mass, lvl 90)",
    skillKey: "firemaking",
    level: 90,
    xpPerHour: 290_000,
    secondaryXp: { skill: "woodcutting", xpPerHour: 19_000 },
    consumables: [],
    rewards: [],
    expectedLootGpPerHour: 220_000,
    intensity: "low",
    notes: "Official worlds. Roots only. Wiki ~290k FM xp/hr at 90.",
  },
  {
    id: "wintertodt-99",
    label: "Wintertodt (mass, lvl 99)",
    skillKey: "firemaking",
    level: 99,
    xpPerHour: 320_000,
    secondaryXp: { skill: "woodcutting", xpPerHour: 21_000 },
    consumables: [],
    rewards: [],
    expectedLootGpPerHour: 250_000,
    intensity: "low",
    notes: "Official worlds. Roots only. Wiki ~320k FM xp/hr at 99.",
  },
];

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
