/**
 * Activity / minigame training methods that do not fit simple input→output.
 *
 * Valuation: Σ(reward GE × qty/hr) + expectedLootGpPerHour − consumable costs.
 * Itemized rewards track the live GE snapshot; residual EV covers uniques,
 * shop conversions, and level-scaled leftovers.
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
    // https://oldschool.runescape.wiki/w/Wintertodt/Strategies — mass world, roots only (no fletch)
    rateBands: [
      { level: 50, xpPerHour: 177_000, expectedLootGpPerHour: 40_000, secondaryXpPerHour: 11_000 },
      { level: 60, xpPerHour: 212_000, expectedLootGpPerHour: 45_000, secondaryXpPerHour: 13_000 },
      { level: 70, xpPerHour: 247_000, expectedLootGpPerHour: 50_000, secondaryXpPerHour: 15_000 },
      { level: 80, xpPerHour: 283_000, expectedLootGpPerHour: 55_000, secondaryXpPerHour: 17_000 },
      { level: 90, xpPerHour: 318_000, expectedLootGpPerHour: 60_000, secondaryXpPerHour: 19_000 },
      { level: 99, xpPerHour: 350_000, expectedLootGpPerHour: 70_000, secondaryXpPerHour: 21_000 },
    ],
    consumables: [],
    // ~30–36 crates/hr mass; pages dominate tradeable EV. Residual = uniques
    // (tome/pyro pieces sold to Ignisia) + skill-scaled supply table variance.
    rewards: [
      { name: "Burnt page", expectedQtyPerHour: 15 },
      { name: "Magic logs", expectedQtyPerHour: 12 },
      { name: "Yew logs", expectedQtyPerHour: 17 },
      { name: "Mahogany logs", expectedQtyPerHour: 20 },
      { name: "Maple logs", expectedQtyPerHour: 17 },
      { name: "Raw shark", expectedQtyPerHour: 10 },
      { name: "Raw swordfish", expectedQtyPerHour: 10 },
      { name: "Uncut diamond", expectedQtyPerHour: 4 },
      { name: "Uncut ruby", expectedQtyPerHour: 5 },
      { name: "Runite ore", expectedQtyPerHour: 0.7 },
      { name: "Adamantite ore", expectedQtyPerHour: 2.7 },
      { name: "Mithril ore", expectedQtyPerHour: 6.8 },
      { name: "Gold ore", expectedQtyPerHour: 11 },
      { name: "Coal", expectedQtyPerHour: 8 },
    ],
    intensity: "low",
    notes:
      "Live GE on pages/logs/ores/fish. Residual ~40–70k for tome/pyro EV + herb/seed variance. Mass worlds, roots only (no fletch). FM XP from Wintertodt/Strategies table; scales with Firemaking.",
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
      { level: 35, xpPerHour: 22_000, expectedLootGpPerHour: 40_000, secondaryXpPerHour: 2_000 },
      { level: 70, xpPerHour: 52_000, expectedLootGpPerHour: 50_000, secondaryXpPerHour: 4_000 },
      { level: 80, xpPerHour: 56_000, expectedLootGpPerHour: 55_000, secondaryXpPerHour: 5_000 },
      { level: 90, xpPerHour: 60_000, expectedLootGpPerHour: 60_000, secondaryXpPerHour: 5_500 },
      { level: 99, xpPerHour: 66_000, expectedLootGpPerHour: 65_000, secondaryXpPerHour: 6_000 },
    ],
    consumables: [],
    // Wiki MMG ~60 permits/hr, 81+ Fishing. Residual = caskets/soaked pages/uniques/spirit flakes EV.
    rewards: [
      { name: "Raw shark", expectedQtyPerHour: 101 },
      { name: "Raw swordfish", expectedQtyPerHour: 190 },
      { name: "Raw sea turtle", expectedQtyPerHour: 56 },
      { name: "Raw manta ray", expectedQtyPerHour: 38 },
      { name: "Raw bass", expectedQtyPerHour: 295 },
      { name: "Plank", expectedQtyPerHour: 66 },
      { name: "Oak plank", expectedQtyPerHour: 37.5 },
      { name: "Steel nails", expectedQtyPerHour: 300 },
      { name: "Feather", expectedQtyPerHour: 900 },
      { name: "Fishing bait", expectedQtyPerHour: 900 },
      { name: "Seaweed", expectedQtyPerHour: 60 },
      { name: "Soaked page", expectedQtyPerHour: 7.82 },
      { name: "Dragon harpoon", expectedQtyPerHour: 0.0075 },
    ],
    intensity: "medium",
    notes:
      "Live GE on fish/planks/pages. Residual ~40–65k for reward-pool caskets, tackle box/fish barrel, tome of water, spirit flakes. ~60 permits/hr mass cook.",
  },
];

export const GOTR_METHODS: ActivityMethod[] = [
  {
    id: "gotr-mass",
    label: "Guardians of the Rift (mass)",
    skillKey: "runecraft",
    level: 27,
    rateBands: [
      { level: 27, xpPerHour: 25_000, expectedLootGpPerHour: 20_000 },
      { level: 40, xpPerHour: 32_000, expectedLootGpPerHour: 25_000 },
      { level: 50, xpPerHour: 40_000, expectedLootGpPerHour: 30_000 },
      { level: 65, xpPerHour: 48_000, expectedLootGpPerHour: 35_000 },
      { level: 75, xpPerHour: 55_000, expectedLootGpPerHour: 40_000 },
      { level: 85, xpPerHour: 62_000, expectedLootGpPerHour: 50_000 },
      { level: 99, xpPerHour: 68_000, expectedLootGpPerHour: 55_000 },
    ],
    consumables: [
      { name: "Astral rune", qty: 6 }, // NPC Contact + Magic Imbue ballpark
      { name: "Cosmic rune", qty: 12 },
      { name: "Binding necklace", qty: 0.75 },
    ],
    // Wiki MMG at 85 RC, ~30 pulls/hr. Residual = talismans / intricate pouch / needle variance.
    rewards: [
      { name: "Blood rune", expectedQtyPerHour: 604 },
      { name: "Death rune", expectedQtyPerHour: 604 },
      { name: "Law rune", expectedQtyPerHour: 604 },
      { name: "Nature rune", expectedQtyPerHour: 667 },
      { name: "Chaos rune", expectedQtyPerHour: 253 },
      { name: "Mud rune", expectedQtyPerHour: 2_419 },
      { name: "Steam rune", expectedQtyPerHour: 1_814 },
      { name: "Cosmic rune", expectedQtyPerHour: 60 },
      { name: "Air rune", expectedQtyPerHour: 432 },
      { name: "Water rune", expectedQtyPerHour: 432 },
      { name: "Earth rune", expectedQtyPerHour: 432 },
      { name: "Fire rune", expectedQtyPerHour: 432 },
      { name: "Mind rune", expectedQtyPerHour: 312 },
      { name: "Body rune", expectedQtyPerHour: 110 },
      { name: "Abyssal pearls", expectedQtyPerHour: 64.8 },
      { name: "Intricate pouch", expectedQtyPerHour: 1.2 },
    ],
    intensity: "medium",
    notes:
      "Live GE on runes/pearls/pouches. Residual ~20–55k for talismans + low-level access variance. Assumes combo runes + pearl shop conversion at high RC.",
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
      "Net GP is Kovac payout minus bar cost (path-dependent). Kept as residual EV — itemizing every alloy mix is unstable. Scavenged items are much cheaper for ironmen.",
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
      "Material cost only (no sell-back). Residual cost EV by contract tier. Plank sack + teleports push XP higher.",
  },
];

export const MOTHERLODE_METHODS: ActivityMethod[] = [
  {
    id: "motherlode-mine",
    label: "Motherlode Mine",
    skillKey: "mining",
    level: 30,
    rateBands: [
      // Residual approximates lower-tier ore mix before full GE list applies cleanly.
      { level: 30, xpPerHour: 13_000, expectedLootGpPerHour: 25_000 },
      { level: 40, xpPerHour: 26_000, expectedLootGpPerHour: 30_000 },
      { level: 50, xpPerHour: 33_000, expectedLootGpPerHour: 40_000 },
      { level: 61, xpPerHour: 45_000, expectedLootGpPerHour: 15_000 },
      { level: 70, xpPerHour: 48_000, expectedLootGpPerHour: 10_000 },
      { level: 80, xpPerHour: 52_000, expectedLootGpPerHour: 12_000 },
      { level: 90, xpPerHour: 59_000, expectedLootGpPerHour: 16_000 },
      { level: 99, xpPerHour: 64_000, expectedLootGpPerHour: 16_500 },
    ],
    consumables: [],
    // Wiki MMG at 99 / 550 pay-dirt/hr. Residual ≈ golden nugget → soft clay pack EV.
    // Lower bands use higher residual because runite/addy rates are overstated until 70/85.
    rewards: [
      { name: "Coal", expectedQtyPerHour: 135 },
      { name: "Gold ore", expectedQtyPerHour: 133 },
      { name: "Mithril ore", expectedQtyPerHour: 148 },
      { name: "Adamantite ore", expectedQtyPerHour: 104 },
      { name: "Runite ore", expectedQtyPerHour: 12.49 },
    ],
    intensity: "low",
    notes:
      "Live GE on ores (wiki 99 rates). Residual ~nugget→soft clay value. Lower levels: ore mix is optimistic until 70 (addy) / 85 (rune). Upper level + prospector assumed at higher bands.",
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
      "Points → ore shop + fossils; team-dependent. Kept as residual EV (no stable per-item MMG qty/hr).",
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
      { level: 43, xpPerHour: 40_000, expectedLootGpPerHour: 0, secondaryXpPerHour: 16_500 },
      { level: 70, xpPerHour: 55_000, expectedLootGpPerHour: 0, secondaryXpPerHour: 16_500 },
      { level: 75, xpPerHour: 70_000, expectedLootGpPerHour: 0, secondaryXpPerHour: 16_500 },
      { level: 85, xpPerHour: 85_000, expectedLootGpPerHour: 0, secondaryXpPerHour: 16_500 },
      { level: 99, xpPerHour: 95_000, expectedLootGpPerHour: 0, secondaryXpPerHour: 16_500 },
    ],
    consumables: [{ name: "Dynamite", qty: 330 }],
    // Wiki MMG assumes 75+ for runite. Lower levels overstated on runite until 75.
    rewards: [
      { name: "Runite ore", expectedQtyPerHour: 44.12 },
      { name: "Adamantite ore", expectedQtyPerHour: 135 },
      { name: "Mithril ore", expectedQtyPerHour: 157 },
      { name: "Gold ore", expectedQtyPerHour: 97.32 },
      { name: "Coal", expectedQtyPerHour: 61.84 },
    ],
    intensity: "high",
    notes:
      "Live GE on ores − dynamite cost. Wiki ~330 dynamite/hr. Runite from 75 effective (65+10 boost). ~16.5k FM XP/hr from lighting.",
  },
];

/**
 * Shooting Stars / crashed stars — ultra-AFK stardust mining.
 * XP from community guides; GP from stardust shop + gem rolls (residual).
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
      "Stardust → Dusuri shop (soft clay packs / gem bags). Residual EV only — stardust itself is untradeable.",
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
      "Artefact/sceptre EV in residual loot estimate. No stable per-item MMG qty/hr for all rooms.",
  },
];

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
      "Coin reward 500–1k per delivery; residual EV. Book of the Dead teleports push ~55 artefacts/hr.",
  },
];

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
      "Rune cost baked into residual net GP (path depends on enchant tier). Points for shop rewards not GE-valued here.",
  },
];

export const HERBIBOAR_METHODS: ActivityMethod[] = [
  {
    id: "herbiboar",
    label: "Herbiboar",
    skillKey: "hunter",
    level: 80,
    secondarySkill: "herblore",
    rateBands: [
      { level: 80, xpPerHour: 120_000, expectedLootGpPerHour: 0, secondaryXpPerHour: 2_500 },
      { level: 90, xpPerHour: 140_000, expectedLootGpPerHour: 0, secondaryXpPerHour: 3_000 },
      { level: 99, xpPerHour: 150_000, expectedLootGpPerHour: 0, secondaryXpPerHour: 3_300 },
    ],
    consumables: [{ name: "Stamina potion(4)", qty: 7.5 }],
    // Wiki MMG at 99 Herblore, ~60 catches/hr.
    rewards: [
      { name: "Grimy guam leaf", expectedQtyPerHour: 34.5 },
      { name: "Grimy ranarr weed", expectedQtyPerHour: 14.76 },
      { name: "Grimy irit leaf", expectedQtyPerHour: 13.26 },
      { name: "Grimy avantoe", expectedQtyPerHour: 14.94 },
      { name: "Grimy kwuarm", expectedQtyPerHour: 19.62 },
      { name: "Grimy snapdragon", expectedQtyPerHour: 12.42 },
      { name: "Grimy cadantine", expectedQtyPerHour: 20.46 },
      { name: "Grimy lantadyme", expectedQtyPerHour: 19.62 },
      { name: "Grimy dwarf weed", expectedQtyPerHour: 16.86 },
      { name: "Grimy torstol", expectedQtyPerHour: 13.56 },
      { name: "Numulite", expectedQtyPerHour: 802 },
    ],
    intensity: "medium",
    notes:
      "Live GE on herbs + numulite − stamina. Wiki assumes 99 Herblore + magic secateurs; lower Herblore sees fewer high-tier herbs.",
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

export function activityMethodItemNames(methods?: ActivityMethod[]): string[] {
  const list =
    methods ??
    [
      ...WINTERTODT_METHODS,
      ...TEMPOROSS_METHODS,
      ...GOTR_METHODS,
      ...GIANTS_FOUNDRY_METHODS,
      ...MAHOGANY_HOMES_METHODS,
      ...MOTHERLODE_METHODS,
      ...VOLCANIC_MINE_METHODS,
      ...BLAST_MINE_METHODS,
      ...SHOOTING_STARS_METHODS,
      ...PYRAMID_PLUNDER_METHODS,
      ...STEALING_ARTEFACTS_METHODS,
      ...MTA_METHODS,
      ...HERBIBOAR_METHODS,
    ];
  const names = new Set<string>();
  for (const m of list) {
    for (const p of m.consumables) names.add(p.name);
    for (const r of m.rewards) names.add(r.name);
  }
  return [...names];
}
