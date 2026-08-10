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
  expectedLootGpPerHour?: number;
  secondaryXpPerHour?: number;
};

export type ActivityMethod = {
  id: string;
  label: string;
  skillKey: string;
  level: number;
  rateBands: ActivityRateBand[];
  secondarySkill?: string;
  consumables: MethodPart[];
  rewards: ActivityReward[];
  intensity?: "low" | "medium" | "high";
  notes?: string;
};

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

export const GIANTS_FOUNDRY_METHODS: ActivityMethod[] = [
  {
    id: "giants-foundry",
    label: "Giants' Foundry",
    skillKey: "smithing",
    level: 15,
    rateBands: [
      { level: 30, xpPerHour: 134_000, expectedLootGpPerHour: 100_000 },
      { level: 50, xpPerHour: 165_000, expectedLootGpPerHour: 30_000 },
      { level: 70, xpPerHour: 198_000, expectedLootGpPerHour: -70_000 },
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

export const MOTHERLODE_METHODS: ActivityMethod[] = [
  {
    id: "motherlode-mine",
    label: "Motherlode Mine",
    skillKey: "mining",
    level: 30,
    rateBands: [
      { level: 30, xpPerHour: 13_000, expectedLootGpPerHour: 30_000 },
      { level: 40, xpPerHour: 26_000, expectedLootGpPerHour: 36_000 },
      { level: 50, xpPerHour: 33_000, expectedLootGpPerHour: 53_000 },
      { level: 61, xpPerHour: 45_000, expectedLootGpPerHour: 70_000 },
      { level: 70, xpPerHour: 48_000, expectedLootGpPerHour: 91_000 },
      { level: 80, xpPerHour: 52_000, expectedLootGpPerHour: 115_000 },
      { level: 90, xpPerHour: 59_000, expectedLootGpPerHour: 260_000 },
      { level: 99, xpPerHour: 64_000, expectedLootGpPerHour: 380_000 },
    ],
    consumables: [],
    rewards: [],
    intensity: "low",
    notes:
      "AFK pay-dirt → random ores + golden nuggets. Upper level at 72 Mining. Profit jumps hard once runite enters the table (85+). Prospector outfit assumed at higher bands.",
  },
];

export const VOLCANIC_MINE_METHODS: ActivityMethod[] = [
  {
    id: "volcanic-mine",
    label: "Volcanic Mine",
    skillKey: "mining",
    level: 50,
    rateBands: [
      { level: 50, xpPerHour: 40_000, expectedLootGpPerHour: 150_000 },
      { level: 70, xpPerHour: 66_000, expectedLootGpPerHour: 250_000 },
      { level: 80, xpPerHour: 75_000, expectedLootGpPerHour: 350_000 },
      { level: 85, xpPerHour: 81_000, expectedLootGpPerHour: 450_000 },
      { level: 90, xpPerHour: 85_000, expectedLootGpPerHour: 550_000 },
      { level: 99, xpPerHour: 90_000, expectedLootGpPerHour: 650_000 },
    ],
    consumables: [],
    rewards: [],
    intensity: "high",
    notes:
      "Fossil Island team minigame. XP/points scale with team quality and Mining level. Loot EV from ore shop + fossils; highly variable. Best non–3-tick Mining XP when coordinated.",
  },
];

export const BLAST_MINE_METHODS: ActivityMethod[] = [
  {
    id: "blast-mine",
    label: "Blast Mine",
    skillKey: "mining",
    level: 43,
    secondarySkill: "firemaking",
    rateBands: [
      { level: 43, xpPerHour: 40_000, expectedLootGpPerHour: 80_000, secondaryXpPerHour: 16_500 },
      { level: 70, xpPerHour: 55_000, expectedLootGpPerHour: 250_000, secondaryXpPerHour: 16_500 },
      { level: 75, xpPerHour: 70_000, expectedLootGpPerHour: 450_000, secondaryXpPerHour: 16_500 },
      { level: 85, xpPerHour: 85_000, expectedLootGpPerHour: 500_000, secondaryXpPerHour: 16_500 },
      { level: 99, xpPerHour: 95_000, expectedLootGpPerHour: 500_000, secondaryXpPerHour: 16_500 },
    ],
    consumables: [],
    rewards: [],
    intensity: "high",
    notes:
      "Requires dynamite (cost baked into net GP). Runite available from 75 effective (65 +10 boost). ~16.5k Firemaking XP/hr from lighting. Prospector for collect XP.",
  },
];

/**
 * Shooting Stars / crashed stars — ultra-AFK stardust mining.
 * XP from community guides; GP from stardust shop + gem rolls.
 */
export const SHOOTING_STARS_METHODS: ActivityMethod[] = [
  {
    id: "shooting-stars",
    label: "Shooting Stars",
    skillKey: "mining",
    level: 10,
    rateBands: [
      { level: 10, xpPerHour: 8_000, expectedLootGpPerHour: 25_000 },
      { level: 40, xpPerHour: 22_000, expectedLootGpPerHour: 45_000 },
      { level: 60, xpPerHour: 26_000, expectedLootGpPerHour: 60_000 },
      { level: 70, xpPerHour: 28_000, expectedLootGpPerHour: 70_000 },
      { level: 80, xpPerHour: 30_000, expectedLootGpPerHour: 80_000 },
      { level: 90, xpPerHour: 31_000, expectedLootGpPerHour: 85_000 },
      { level: 99, xpPerHour: 32_000, expectedLootGpPerHour: 90_000 },
    ],
    consumables: [],
    rewards: [],
    intensity: "low",
    notes:
      "Ultra-AFK (~7 min between clicks per tier). Find stars via CC/telescope. Stardust → Dusuri shop (soft clay packs / gem bags). Size 6+ stars need 60 Mining to start.",
  },
];

export const PYRAMID_PLUNDER_METHODS: ActivityMethod[] = [
  {
    id: "pyramid-plunder",
    label: "Pyramid Plunder",
    skillKey: "thieving",
    level: 21,
    rateBands: [
      { level: 21, xpPerHour: 40_000, expectedLootGpPerHour: 20_000 },
      { level: 51, xpPerHour: 70_000, expectedLootGpPerHour: 40_000 },
      { level: 71, xpPerHour: 120_000, expectedLootGpPerHour: 80_000 },
      { level: 81, xpPerHour: 190_000, expectedLootGpPerHour: 150_000 },
      { level: 91, xpPerHour: 260_000, expectedLootGpPerHour: 220_000 },
      { level: 99, xpPerHour: 275_000, expectedLootGpPerHour: 250_000 },
    ],
    consumables: [],
    rewards: [],
    intensity: "high",
    notes:
      "Icthlarin's Little Helper for Sophanem. Official world + last rooms for best XP. Pharaoh's sceptre skips entry. Artefact/sceptre EV in loot estimate.",
  },
];

/**
 * Stealing artefacts — Port Piscarilius (Captain Khaled).
 * XP scales with Thieving level; Book of the Dead / memoirs for teleports.
 */
export const STEALING_ARTEFACTS_METHODS: ActivityMethod[] = [
  {
    id: "stealing-artefacts",
    label: "Stealing artefacts",
    skillKey: "thieving",
    level: 49,
    rateBands: [
      { level: 49, xpPerHour: 150_000, expectedLootGpPerHour: 35_000 },
      { level: 60, xpPerHour: 174_000, expectedLootGpPerHour: 40_000 },
      { level: 70, xpPerHour: 197_000, expectedLootGpPerHour: 45_000 },
      { level: 80, xpPerHour: 219_000, expectedLootGpPerHour: 50_000 },
      { level: 90, xpPerHour: 241_000, expectedLootGpPerHour: 55_000 },
      { level: 99, xpPerHour: 261_000, expectedLootGpPerHour: 60_000 },
    ],
    consumables: [],
    rewards: [],
    intensity: "medium",
    notes:
      "Port Piscarilius. Lockpick + stamina recommended. Book of the Dead teleports push ~55 artefacts/hr. Coin reward 500–1k per delivery; low GP vs XP focus.",
  },
];

/**
 * Mage Training Arena — Enchanting Chamber (best XP room for most levels).
 * Net GP is rune cost (negative). Points go to shop (infinity, bones to peaches, etc.).
 */
export const MTA_METHODS: ActivityMethod[] = [
  {
    id: "mta-enchanting",
    label: "MTA Enchanting Chamber",
    skillKey: "magic",
    level: 7,
    rateBands: [
      { level: 7, xpPerHour: 55_000, expectedLootGpPerHour: -80_000 },
      { level: 27, xpPerHour: 84_000, expectedLootGpPerHour: -100_000 },
      { level: 49, xpPerHour: 116_000, expectedLootGpPerHour: -120_000 },
      { level: 57, xpPerHour: 128_000, expectedLootGpPerHour: -140_000 },
      { level: 68, xpPerHour: 144_000, expectedLootGpPerHour: -160_000 },
      { level: 87, xpPerHour: 172_000, expectedLootGpPerHour: -200_000 },
      { level: 99, xpPerHour: 190_000, expectedLootGpPerHour: -220_000 },
    ],
    consumables: [],
    rewards: [],
    intensity: "medium",
    notes:
      "Enchanting Chamber depositing orbs (wiki peak rates by enchant tier). Rune cost baked into net GP. Other rooms: Graveyard ~100k, Alchemists ~60–80k, Telekinetic lower XP. Points for shop rewards.",
  },
];

/**
 * Herbiboar — Fossil Island tracking. Needs 80 Hunter (boostable) + 31 Herblore.
 */
export const HERBIBOAR_METHODS: ActivityMethod[] = [
  {
    id: "herbiboar",
    label: "Herbiboar",
    skillKey: "hunter",
    level: 80,
    secondarySkill: "herblore",
    rateBands: [
      { level: 80, xpPerHour: 120_000, expectedLootGpPerHour: 300_000, secondaryXpPerHour: 2_500 },
      { level: 90, xpPerHour: 140_000, expectedLootGpPerHour: 350_000, secondaryXpPerHour: 3_000 },
      { level: 99, xpPerHour: 150_000, expectedLootGpPerHour: 390_000, secondaryXpPerHour: 3_300 },
    ],
    consumables: [],
    rewards: [],
    intensity: "medium",
    notes:
      "Bone Voyage + 31 Herblore. Magic secateurs + herb sack + stamina. ~60 catches/hr focused. Herb value scales with Herblore level. Herbi pet 1/6,500.",
  },
];

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
    case "mining":
      return [
        ...MOTHERLODE_METHODS,
        ...VOLCANIC_MINE_METHODS,
        ...BLAST_MINE_METHODS,
        ...SHOOTING_STARS_METHODS,
      ];
    case "thieving":
      return [...PYRAMID_PLUNDER_METHODS, ...STEALING_ARTEFACTS_METHODS];
    case "magic":
      return MTA_METHODS;
    case "hunter":
      return HERBIBOAR_METHODS;
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
