/**
 * Activity / minigame training methods that do not fit simple input→output.
 *
 * Use when rewards are multi-item, points-based, or quality-scored.
 * Valuation: expectedLootGpPerHour + itemized rewards − consumable costs.
 *
 * Level-scaled activities use a rate table; the UI shows a single card
 * resolved to the highest band the player can access.
 *
 * Sources: oldschool.runescape.wiki training + money-making guides (2026).
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
  /**
   * Net GP/hr from the activity after typical material costs when those costs
   * are hard to itemize, OR gross reward EV when consumables[] covers costs.
   */
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
  /** GE consumables used per hour (often empty when EV is net of costs). */
  consumables: MethodPart[];
  /** Itemized rewards when the drop table is stable enough. */
  rewards: ActivityReward[];
  intensity?: "low" | "medium" | "high";
  notes?: string;
};

/**
 * Wintertodt — official mass worlds, no kindling (roots only).
 * Wiki XP/hr scales with FM level. Loot EV excl. rare unique EV.
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
      "Official worlds (~4 min games). Roots only (no fletch). Reward cart EV excl. rare uniques. Rates scale with Firemaking.",
  },
];

/**
 * Tempoross — mass worlds, cook harpoonfish (points/loot focus).
 * XP from wiki Tempoross page (regular harpoon, cooking strategy).
 * GP from money-making guide ~60 permits/hr at high fishing.
 */
export const TEMPOROSS_METHODS: ActivityMethod[] = [
  {
    id: "tempoross-mass-cook",
    label: "Tempoross (mass, cook)",
    skillKey: "fishing",
    level: 35,
    secondarySkill: "cooking",
    rateBands: [
      { level: 35, xpPerHour: 22_000, expectedLootGpPerHour: 120_000, secondaryXpPerHour: 2_000 },
      { level: 70, xpPerHour: 52_000, expectedLootGpPerHour: 220_000, secondaryXpPerHour: 4_000 },
      { level: 80, xpPerHour: 56_000, expectedLootGpPerHour: 280_000, secondaryXpPerHour: 5_000 },
      { level: 90, xpPerHour: 60_000, expectedLootGpPerHour: 320_000, secondaryXpPerHour: 5_500 },
      { level: 99, xpPerHour: 66_000, expectedLootGpPerHour: 340_000, secondaryXpPerHour: 6_000 },
    ],
    consumables: [],
    rewards: [],
    intensity: "medium",
    notes:
      "Mass worlds, cook fish for permits. Loot EV ~wiki MMG (~60 permits/hr at high level). Crystal harpoon / solo XP focus is faster XP, lower loot.",
  },
];

/**
 * Guardians of the Rift — mass worlds, balanced elemental/catalytic.
 * XP/GP scale with RC level and pouch tier. Reward EV is rune + pouch loot.
 */
export const GOTR_METHODS: ActivityMethod[] = [
  {
    id: "gotr-mass",
    label: "Guardians of the Rift (mass)",
    skillKey: "runecraft",
    level: 27,
    rateBands: [
      { level: 27, xpPerHour: 25_000, expectedLootGpPerHour: 80_000 },
      { level: 40, xpPerHour: 32_000, expectedLootGpPerHour: 120_000 },
      { level: 50, xpPerHour: 40_000, expectedLootGpPerHour: 180_000 },
      { level: 65, xpPerHour: 48_000, expectedLootGpPerHour: 250_000 },
      { level: 75, xpPerHour: 55_000, expectedLootGpPerHour: 320_000 },
      { level: 85, xpPerHour: 62_000, expectedLootGpPerHour: 400_000 },
      { level: 99, xpPerHour: 68_000, expectedLootGpPerHour: 450_000 },
    ],
    consumables: [],
    rewards: [],
    intensity: "medium",
    notes:
      "Temple of the Eye required. Mass worlds; XP/GP scale with pouches and altar access. Reward Guardian EV excl. rare uniques (needle/pet).",
  },
];

/**
 * Giants' Foundry — optimal alloy for band, average commission score.
 * expectedLootGpPerHour is approx net profit (Kovac reward − bar cost) from wiki strategies.
 * Positive at lower alloys; expensive at addy/rune.
 */
export const GIANTS_FOUNDRY_METHODS: ActivityMethod[] = [
  {
    id: "giants-foundry",
    label: "Giants' Foundry",
    skillKey: "smithing",
    level: 15,
    rateBands: [
      // Iron/steel — wiki strategies ~108k net with items; XP ~134k
      { level: 30, xpPerHour: 134_000, expectedLootGpPerHour: 100_000 },
      // Steel/mithril
      { level: 50, xpPerHour: 165_000, expectedLootGpPerHour: 30_000 },
      // Mith/addy — often slightly negative on bars
      { level: 70, xpPerHour: 198_000, expectedLootGpPerHour: -70_000 },
      // Addy/rune — high XP, heavy loss on pure bars
      { level: 85, xpPerHour: 250_000, expectedLootGpPerHour: -400_000 },
      { level: 99, xpPerHour: 265_000, expectedLootGpPerHour: -450_000 },
    ],
    consumables: [],
    rewards: [],
    intensity: "medium",
    notes:
      "Optimal moulds, average commissions, no Smiths' Uniform. Net GP is Kovac payout minus typical bar cost (bars path). Using scavenged items is much cheaper for ironmen.",
  },
];

/**
 * Mahogany Homes — contract tier by Construction level.
 * expectedLootGpPerHour is approximate net cost (negative) at mid plank prices.
 * Plank sack / teleports improve XP; rates are focused mid estimates.
 */
export const MAHOGANY_HOMES_METHODS: ActivityMethod[] = [
  {
    id: "mahogany-homes",
    label: "Mahogany Homes",
    skillKey: "construction",
    level: 1,
    rateBands: [
      { level: 1, xpPerHour: 35_000, expectedLootGpPerHour: -55_000 },
      { level: 20, xpPerHour: 75_000, expectedLootGpPerHour: -170_000 },
      { level: 50, xpPerHour: 130_000, expectedLootGpPerHour: -320_000 },
      { level: 70, xpPerHour: 200_000, expectedLootGpPerHour: -900_000 },
      { level: 99, xpPerHour: 220_000, expectedLootGpPerHour: -950_000 },
    ],
    consumables: [],
    rewards: [],
    intensity: "medium",
    notes:
      "Contract tier follows Construction level (Beginner→Expert). Much cheaper GP/XP than POH tables. Plank sack + teleports push XP higher. Net GP is material cost (no sell-back).",
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
  switch (skillKey) {
    case "firemaking":
      return WINTERTODT_METHODS;
    case "fishing":
      return TEMPOROSS_METHODS;
    case "runecraft":
      return GOTR_METHODS;
    case "smithing":
      return GIANTS_FOUNDRY_METHODS;
    case "construction":
      return MAHOGANY_HOMES_METHODS;
    default:
      return [];
  }
}

export function activityMethodItemNames(methods: ActivityMethod[]): string[] {
  const names = new Set<string>();
  for (const m of methods) {
    for (const p of m.consumables) names.add(p.name);
    for (const r of m.rewards) names.add(r.name);
  }
  return [...names];
}
