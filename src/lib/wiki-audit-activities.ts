/**
 * Wiki MMG / training extras plus live GE valuation for activity rows.
 */
import type { ActivityMethod, ActivityRateBand } from "@/lib/activity-methods";

export type ActivityPriceLookup = {
  buy: (name: string) => number | null;
  sell: (name: string) => number | null;
};

/** Live GE: sum(reward sell * qty/hr) - sum(consumable buy * qty/hr) + residual EV. */
export function activityLiveGpPerHour(
  method: ActivityMethod,
  band: ActivityRateBand,
  prices: ActivityPriceLookup,
): { gpPerHour: number; missing: boolean } {
  let gp = band.expectedLootGpPerHour ?? 0;
  let missing = false;
  for (const r of method.rewards) {
    if (r.name === "Coins") {
      gp += r.expectedQtyPerHour;
      continue;
    }
    const unit = prices.sell(r.name);
    if (unit == null) {
      missing = true;
      continue;
    }
    gp += unit * r.expectedQtyPerHour;
  }
  for (const c of method.consumables) {
    if (c.name === "Coins") {
      gp -= c.qty;
      continue;
    }
    const unit = prices.buy(c.name);
    if (unit == null) {
      missing = true;
      continue;
    }
    gp -= unit * c.qty;
  }
  return { gpPerHour: Math.round(gp), missing };
}

export const TITHE_FARM_METHODS: ActivityMethod[] = [
  {
    id: "tithe-farm",
    label: "Tithe Farm",
    skillKey: "farming",
    level: 34,
    rateBands: [
      { level: 34, xpPerHour: 70_000, expectedLootGpPerHour: 80_000 },
      { level: 54, xpPerHour: 90_000, expectedLootGpPerHour: 120_000 },
      { level: 74, xpPerHour: 110_000, expectedLootGpPerHour: 180_000 },
      { level: 99, xpPerHour: 130_000, expectedLootGpPerHour: 220_000 },
    ],
    consumables: [],
    rewards: [],
    intensity: "high",
    notes: "Points to grape seeds / herb boxes. Residual EV. XP scales with fruit tier.",
  },
];

export const FARMING_CONTRACT_METHODS: ActivityMethod[] = [
  {
    id: "farming-contracts",
    label: "Farming contracts (Guild)",
    skillKey: "farming",
    level: 45,
    rateBands: [
      { level: 45, xpPerHour: 15_000, expectedLootGpPerHour: 150_000 },
      { level: 65, xpPerHour: 25_000, expectedLootGpPerHour: 350_000 },
      { level: 85, xpPerHour: 35_000, expectedLootGpPerHour: 550_000 },
      { level: 99, xpPerHour: 45_000, expectedLootGpPerHour: 700_000 },
    ],
    consumables: [],
    rewards: [],
    intensity: "medium",
    notes: "Guild contracts between herb/tree runs. Residual seed-pack EV.",
  },
];

export const HESPORI_METHODS: ActivityMethod[] = [
  {
    id: "hespori",
    label: "Hespori (patch)",
    skillKey: "farming",
    level: 65,
    rateBands: [{ level: 65, xpPerHour: 12_000, expectedLootGpPerHour: 200_000 }],
    consumables: [],
    rewards: [{ name: "Ancient essence", expectedQtyPerHour: 1800 }],
    intensity: "medium",
    notes: "~2 kills/hr on cooldown. Live GE on ancient essence + residual anima-seed EV.",
  },
];

export const FORESTRY_METHODS: ActivityMethod[] = [
  {
    id: "forestry-events",
    label: "Forestry (event worlds)",
    skillKey: "woodcutting",
    level: 15,
    secondarySkill: "fletching",
    rateBands: [
      { level: 15, xpPerHour: 20_000, expectedLootGpPerHour: 40_000, secondaryXpPerHour: 2_000 },
      { level: 60, xpPerHour: 55_000, expectedLootGpPerHour: 80_000, secondaryXpPerHour: 6_000 },
      { level: 90, xpPerHour: 80_000, expectedLootGpPerHour: 140_000, secondaryXpPerHour: 10_000 },
      { level: 99, xpPerHour: 90_000, expectedLootGpPerHour: 180_000, secondaryXpPerHour: 12_000 },
    ],
    consumables: [],
    rewards: [
      { name: "Oak logs", expectedQtyPerHour: 80 },
      { name: "Willow logs", expectedQtyPerHour: 40 },
      { name: "Yew logs", expectedQtyPerHour: 20 },
    ],
    intensity: "medium",
    notes: "Live GE on logs + residual bark-shop EV.",
  },
];

export const HUNTER_RUMOUR_METHODS: ActivityMethod[] = [
  {
    id: "hunter-rumours",
    label: "Hunter rumours (Guild)",
    skillKey: "hunter",
    level: 46,
    rateBands: [
      { level: 46, xpPerHour: 40_000, expectedLootGpPerHour: 200_000 },
      { level: 72, xpPerHour: 70_000, expectedLootGpPerHour: 450_000 },
      { level: 91, xpPerHour: 95_000, expectedLootGpPerHour: 700_000 },
      { level: 99, xpPerHour: 110_000, expectedLootGpPerHour: 850_000 },
    ],
    consumables: [],
    rewards: [],
    intensity: "medium",
    notes: "Varlamore Hunter Guild rumours. Residual meat/hide/antler EV.",
  },
];

export const IMPLING_METHODS: ActivityMethod[] = [
  {
    id: "hunter-implings",
    label: "Hunting implings (Puro-Puro / world)",
    skillKey: "hunter",
    level: 58,
    rateBands: [
      { level: 58, xpPerHour: 20_000, expectedLootGpPerHour: 150_000 },
      { level: 74, xpPerHour: 30_000, expectedLootGpPerHour: 400_000 },
      { level: 83, xpPerHour: 40_000, expectedLootGpPerHour: 700_000 },
      { level: 99, xpPerHour: 50_000, expectedLootGpPerHour: 900_000 },
    ],
    consumables: [{ name: "Impling jar", qty: 40 }],
    rewards: [
      { name: "Nature impling jar", expectedQtyPerHour: 8 },
      { name: "Magpie impling jar", expectedQtyPerHour: 6 },
      { name: "Ninja impling jar", expectedQtyPerHour: 4 },
      { name: "Dragon impling jar", expectedQtyPerHour: 1.2 },
    ],
    intensity: "high",
    notes: "Live GE on high-tier jars minus empty jars. Dragon ~1/hr typical.",
  },
];

export const DEEP_SEA_TRAWL_METHODS: ActivityMethod[] = [
  {
    id: "trawl-yellowfin",
    label: "Deep sea trawling (yellowfin)",
    skillKey: "fishing",
    secondarySkill: "sailing",
    level: 50,
    rateBands: [
      { level: 50, xpPerHour: 18_000, expectedLootGpPerHour: 40_000, secondaryXpPerHour: 8_000 },
      { level: 72, xpPerHour: 22_000, expectedLootGpPerHour: 50_000, secondaryXpPerHour: 10_000 },
    ],
    consumables: [],
    rewards: [{ name: "Raw yellowfin", expectedQtyPerHour: 420 }],
    intensity: "medium",
    notes: "Live GE on raw yellowfin. Residual paint / encounter EV.",
  },
  {
    id: "trawl-halibut",
    label: "Deep sea trawling (halibut)",
    skillKey: "fishing",
    secondarySkill: "sailing",
    level: 72,
    rateBands: [
      { level: 72, xpPerHour: 26_000, expectedLootGpPerHour: 80_000, secondaryXpPerHour: 12_000 },
      { level: 83, xpPerHour: 30_000, expectedLootGpPerHour: 100_000, secondaryXpPerHour: 14_000 },
    ],
    consumables: [],
    rewards: [{ name: "Raw halibut", expectedQtyPerHour: 440 }],
    intensity: "medium",
    notes: "Live GE on raw halibut + residual encounters.",
  },
  {
    id: "trawl-bluefin",
    label: "Deep sea trawling (bluefin)",
    skillKey: "fishing",
    secondarySkill: "sailing",
    level: 78,
    rateBands: [
      { level: 78, xpPerHour: 27_000, expectedLootGpPerHour: 70_000, secondaryXpPerHour: 13_000 },
      { level: 91, xpPerHour: 31_000, expectedLootGpPerHour: 90_000, secondaryXpPerHour: 15_000 },
    ],
    consumables: [],
    rewards: [
      { name: "Raw bluefin", expectedQtyPerHour: 400 },
      { name: "Raw yellowfin", expectedQtyPerHour: 20 },
    ],
    intensity: "medium",
    notes: "Live GE on raw bluefin.",
  },
  {
    id: "trawl-marlin",
    label: "Deep sea trawling (marlin)",
    skillKey: "fishing",
    secondarySkill: "sailing",
    level: 91,
    rateBands: [
      { level: 91, xpPerHour: 28_750, expectedLootGpPerHour: 120_000, secondaryXpPerHour: 16_000 },
      { level: 99, xpPerHour: 32_000, expectedLootGpPerHour: 140_000, secondaryXpPerHour: 18_000 },
    ],
    consumables: [],
    rewards: [
      { name: "Raw marlin", expectedQtyPerHour: 437 },
      { name: "Raw bluefin", expectedQtyPerHour: 23 },
    ],
    intensity: "medium",
    notes: "Wiki qty 437 marlin + 23 bluefin/hr. Residual includes angler paint EV.",
  },
];

export const WILDERNESS_AGILITY_ACTIVITY: ActivityMethod[] = [
  {
    id: "wilderness-agility-tickets",
    label: "Wilderness Agility Course (tickets)",
    skillKey: "agility",
    level: 52,
    rateBands: [
      { level: 52, xpPerHour: 47_400, expectedLootGpPerHour: 0 },
      { level: 80, xpPerHour: 55_000, expectedLootGpPerHour: 0 },
      { level: 99, xpPerHour: 65_800, expectedLootGpPerHour: 0 },
    ],
    consumables: [{ name: "Coins", qty: 150_000 }],
    rewards: [
      { name: "Rune kiteshield", expectedQtyPerHour: 24.9 },
      { name: "Rune chainbody", expectedQtyPerHour: 24.9 },
      { name: "Blighted super restore(4)", expectedQtyPerHour: 118 },
      { name: "Blighted anglerfish", expectedQtyPerHour: 390 },
      { name: "Blighted manta ray", expectedQtyPerHour: 390 },
      { name: "Blighted karambwan", expectedQtyPerHour: 390 },
      { name: "Rune med helm", expectedQtyPerHour: 8.3 },
      { name: "Adamant platebody", expectedQtyPerHour: 8.3 },
      { name: "Adamant platelegs", expectedQtyPerHour: 4.15 },
      { name: "Adamant full helm", expectedQtyPerHour: 4.15 },
      { name: "Mithril plateskirt", expectedQtyPerHour: 4.15 },
      { name: "Mithril platelegs", expectedQtyPerHour: 4.15 },
    ],
    intensity: "high",
    notes: "Wiki MMG ~83 laps/hr. Live GE on dispenser loot minus 150k fee.",
  },
];

export const SEPULCHRE_ACTIVITY: ActivityMethod[] = [
  {
    id: "sepulchre-floor-3",
    label: "Hallowed Sepulchre (floor 3 loot)",
    skillKey: "agility",
    level: 72,
    rateBands: [{ level: 72, xpPerHour: 68_900, expectedLootGpPerHour: 661_000 }],
    consumables: [{ name: "Stamina potion(4)", qty: 2 }],
    rewards: [],
    intensity: "high",
    notes: "Wiki MMG floor-3 coffer EV as residual.",
  },
  {
    id: "sepulchre-floor-4",
    label: "Hallowed Sepulchre (floor 4 loot)",
    skillKey: "agility",
    level: 82,
    rateBands: [{ level: 82, xpPerHour: 79_700, expectedLootGpPerHour: 957_000 }],
    consumables: [{ name: "Stamina potion(4)", qty: 2 }],
    rewards: [],
    intensity: "high",
    notes: "Wiki MMG floor-4 EV residual.",
  },
  {
    id: "sepulchre-floor-5-loot",
    label: "Hallowed Sepulchre (floor 5 loot)",
    skillKey: "agility",
    level: 92,
    rateBands: [{ level: 92, xpPerHour: 88_000, expectedLootGpPerHour: 1_686_000 }],
    consumables: [{ name: "Stamina potion(4)", qty: 2 }],
    rewards: [],
    intensity: "high",
    notes: "Wiki MMG ~6-7 runs/hr including grand coffins.",
  },
];

export const BRIMHAVEN_AGILITY_ACTIVITY: ActivityMethod[] = [
  {
    id: "brimhaven-arena",
    label: "Brimhaven Agility Arena",
    skillKey: "agility",
    level: 40,
    rateBands: [
      { level: 40, xpPerHour: 36_000, expectedLootGpPerHour: 40_000 },
      { level: 60, xpPerHour: 45_000, expectedLootGpPerHour: 55_000 },
      { level: 99, xpPerHour: 52_000, expectedLootGpPerHour: 70_000 },
    ],
    consumables: [],
    rewards: [],
    intensity: "high",
    notes: "Tickets to totem / graceful / XP lamps. Residual shop EV.",
  },
];

export const AGILITY_PYRAMID_ACTIVITY: ActivityMethod[] = [
  {
    id: "agility-pyramid",
    label: "Agility Pyramid",
    skillKey: "agility",
    level: 30,
    rateBands: [
      { level: 30, xpPerHour: 20_000 },
      { level: 55, xpPerHour: 28_000 },
      { level: 75, xpPerHour: 42_100 },
      { level: 88, xpPerHour: 44_700 },
    ],
    consumables: [],
    rewards: [{ name: "Coins", expectedQtyPerHour: 260_000 }],
    intensity: "high",
    notes: "26 laps/hr max times 10k pyramid top.",
  },
];

export const ZALCANO_METHODS: ActivityMethod[] = [
  {
    id: "zalcano",
    label: "Zalcano (loot)",
    skillKey: "mining",
    secondarySkill: "smithing",
    level: 70,
    rateBands: [
      { level: 70, xpPerHour: 12_000, expectedLootGpPerHour: 400_000, secondaryXpPerHour: 1_440 },
      { level: 90, xpPerHour: 12_000, expectedLootGpPerHour: 500_000, secondaryXpPerHour: 1_440 },
    ],
    consumables: [
      { name: "Stamina potion(4)", qty: 3 },
      { name: "Saradomin brew(4)", qty: 3 },
    ],
    rewards: [
      { name: "Crystal shard", expectedQtyPerHour: 99.36 },
      { name: "Gold ore", expectedQtyPerHour: 107.6 },
      { name: "Coal", expectedQtyPerHour: 48.7 },
      { name: "Runite ore", expectedQtyPerHour: 6 },
      { name: "Adamantite bar", expectedQtyPerHour: 12 },
      { name: "Mithril bar", expectedQtyPerHour: 68.4 },
      { name: "Steel bar", expectedQtyPerHour: 81.6 },
    ],
    intensity: "high",
    notes: "Wiki MMG ~48 kc/hr. Live GE on shards/ores/bars minus brews/stams. Residual = rune pack + unique EV.",
  },
  {
    id: "zalcano-xp",
    label: "Zalcano (experience)",
    skillKey: "mining",
    secondarySkill: "smithing",
    level: 70,
    rateBands: [{ level: 70, xpPerHour: 52_800, expectedLootGpPerHour: 200_000, secondaryXpPerHour: 6_240 }],
    consumables: [
      { name: "Stamina potion(4)", qty: 3 },
      { name: "Saradomin brew(4)", qty: 3 },
    ],
    rewards: [{ name: "Crystal shard", expectedQtyPerHour: 99.36 }],
    intensity: "high",
    notes: "Wiki MMG experience variant (~1100 Mining XP/kill). Lower loot focus.",
  },
];
