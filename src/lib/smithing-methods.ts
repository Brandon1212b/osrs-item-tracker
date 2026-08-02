/**
 * Smithing training methods (P2P guide rates).
 * https://oldschool.runescape.wiki/w/Pay-to-play_Smithing_training
 *
 * XP/h from wiki focused rates; GP/h is computed live from GE prices.
 * Blast Furnace coal is already halved vs normal furnace.
 */
export type MethodPart = {
  name: string;
  qty: number;
};

export type SmithingMethod = {
  id: string;
  label: string;
  level: number;
  /** XP per action */
  xp: number;
  /** Actions per hour (wiki / focused rate) */
  actionsPerHour: number;
  inputs: MethodPart[];
  output: MethodPart;
};

// ── Throughput assumptions ──────────────────────────────────────────────
const BF_GOLD_APH = 6760; // ~380k xp/h @ 56.2 with goldsmith gauntlets
const BF_BAR_APH = 4000; // steel/mithril focused BF
const BF_HEAVY_APH = 2800; // adamant / rune ore runs
const DART_BAR_APH = 1300; // bars/h with Smiths' Uniform → 13k tips
const NAIL_BAR_APH = 1300;
const CANNON_BAR_APH = 600; // regular mould 2400 balls
const CANNON_DOUBLE_BAR_APH = 1200; // double ammo mould
const PLATE_APH = 1000; // platebodies / 5-bar items
const RUNE3_APH = 1200; // 3-bar rune items at anvil

export const SMITHING_METHODS: SmithingMethod[] = [
  // ── Blast Furnace bars ────────────────────────────────────────────────
  {
    id: "bf-iron",
    label: "Iron bars (Blast Furnace)",
    level: 15,
    xp: 12.5,
    actionsPerHour: BF_BAR_APH,
    inputs: [{ name: "Iron ore", qty: 1 }],
    output: { name: "Iron bar", qty: 1 },
  },
  {
    id: "bf-steel",
    label: "Steel bars (Blast Furnace)",
    level: 30,
    xp: 17.5,
    actionsPerHour: BF_BAR_APH,
    inputs: [
      { name: "Iron ore", qty: 1 },
      { name: "Coal", qty: 1 }, // BF halves coal
    ],
    output: { name: "Steel bar", qty: 1 },
  },
  {
    id: "bf-gold",
    label: "Gold bars (Blast Furnace + gauntlets)",
    level: 40,
    xp: 56.2,
    actionsPerHour: BF_GOLD_APH,
    inputs: [{ name: "Gold ore", qty: 1 }],
    output: { name: "Gold bar", qty: 1 },
  },
  {
    id: "bf-mithril",
    label: "Mithril bars (Blast Furnace)",
    level: 50,
    xp: 30,
    actionsPerHour: BF_BAR_APH,
    inputs: [
      { name: "Mithril ore", qty: 1 },
      { name: "Coal", qty: 2 },
    ],
    output: { name: "Mithril bar", qty: 1 },
  },
  {
    id: "bf-adamant",
    label: "Adamantite bars (Blast Furnace)",
    level: 70,
    xp: 37.5,
    actionsPerHour: BF_HEAVY_APH,
    inputs: [
      { name: "Adamantite ore", qty: 1 },
      { name: "Coal", qty: 3 },
    ],
    output: { name: "Adamantite bar", qty: 1 },
  },
  {
    id: "bf-rune",
    label: "Runite bars (Blast Furnace)",
    level: 85,
    xp: 50,
    actionsPerHour: BF_HEAVY_APH,
    inputs: [
      { name: "Runite ore", qty: 1 },
      { name: "Coal", qty: 4 },
    ],
    output: { name: "Runite bar", qty: 1 },
  },

  // ── Dart tips (10 per bar) ────────────────────────────────────────────
  {
    id: "bronze-dart-tips",
    label: "Bronze dart tips",
    level: 4,
    xp: 12.5,
    actionsPerHour: DART_BAR_APH,
    inputs: [{ name: "Bronze bar", qty: 1 }],
    output: { name: "Bronze dart tip", qty: 10 },
  },
  {
    id: "iron-dart-tips",
    label: "Iron dart tips",
    level: 19,
    xp: 25,
    actionsPerHour: DART_BAR_APH,
    inputs: [{ name: "Iron bar", qty: 1 }],
    output: { name: "Iron dart tip", qty: 10 },
  },
  {
    id: "steel-dart-tips",
    label: "Steel dart tips",
    level: 34,
    xp: 37.5,
    actionsPerHour: DART_BAR_APH,
    inputs: [{ name: "Steel bar", qty: 1 }],
    output: { name: "Steel dart tip", qty: 10 },
  },
  {
    id: "mithril-dart-tips",
    label: "Mithril dart tips",
    level: 54,
    xp: 50,
    actionsPerHour: DART_BAR_APH,
    inputs: [{ name: "Mithril bar", qty: 1 }],
    output: { name: "Mithril dart tip", qty: 10 },
  },
  {
    id: "adamant-dart-tips",
    label: "Adamant dart tips",
    level: 74,
    xp: 62.5,
    actionsPerHour: DART_BAR_APH,
    inputs: [{ name: "Adamantite bar", qty: 1 }],
    output: { name: "Adamant dart tip", qty: 10 },
  },
  {
    id: "rune-dart-tips",
    label: "Rune dart tips",
    level: 89,
    xp: 75,
    actionsPerHour: DART_BAR_APH,
    inputs: [{ name: "Runite bar", qty: 1 }],
    output: { name: "Rune dart tip", qty: 10 },
  },

  // ── Nails (15 per bar) ────────────────────────────────────────────────
  {
    id: "bronze-nails",
    label: "Bronze nails",
    level: 4,
    xp: 12.5,
    actionsPerHour: NAIL_BAR_APH,
    inputs: [{ name: "Bronze bar", qty: 1 }],
    output: { name: "Bronze nails", qty: 15 },
  },
  {
    id: "iron-nails",
    label: "Iron nails",
    level: 19,
    xp: 25,
    actionsPerHour: NAIL_BAR_APH,
    inputs: [{ name: "Iron bar", qty: 1 }],
    output: { name: "Iron nails", qty: 15 },
  },
  {
    id: "steel-nails",
    label: "Steel nails",
    level: 34,
    xp: 37.5,
    actionsPerHour: NAIL_BAR_APH,
    inputs: [{ name: "Steel bar", qty: 1 }],
    output: { name: "Steel nails", qty: 15 },
  },
  {
    id: "mithril-nails",
    label: "Mithril nails",
    level: 54,
    xp: 50,
    actionsPerHour: NAIL_BAR_APH,
    inputs: [{ name: "Mithril bar", qty: 1 }],
    output: { name: "Mithril nails", qty: 15 },
  },
  {
    id: "adamant-nails",
    label: "Adamantite nails",
    level: 74,
    xp: 62.5,
    actionsPerHour: NAIL_BAR_APH,
    inputs: [{ name: "Adamantite bar", qty: 1 }],
    output: { name: "Adamantite nails", qty: 15 },
  },
  {
    id: "rune-nails",
    label: "Rune nails",
    level: 89,
    xp: 75,
    actionsPerHour: NAIL_BAR_APH,
    inputs: [{ name: "Runite bar", qty: 1 }],
    output: { name: "Rune nails", qty: 15 },
  },

  // ── Steel cannonballs ─────────────────────────────────────────────────
  {
    id: "cannonballs",
    label: "Steel cannonballs",
    level: 35,
    xp: 25.6,
    actionsPerHour: CANNON_BAR_APH,
    inputs: [{ name: "Steel bar", qty: 1 }],
    output: { name: "Steel cannonball", qty: 4 },
  },
  {
    id: "cannonballs-double",
    label: "Steel cannonballs (double mould)",
    level: 35,
    xp: 25.6,
    actionsPerHour: CANNON_DOUBLE_BAR_APH,
    inputs: [{ name: "Steel bar", qty: 1 }],
    output: { name: "Steel cannonball", qty: 8 },
  },

  // ── Platebodies / armour ──────────────────────────────────────────────
  {
    id: "iron-platebody",
    label: "Iron platebody",
    level: 33,
    xp: 125,
    actionsPerHour: PLATE_APH,
    inputs: [{ name: "Iron bar", qty: 5 }],
    output: { name: "Iron platebody", qty: 1 },
  },
  {
    id: "steel-platebody",
    label: "Steel platebody",
    level: 48,
    xp: 187.5,
    actionsPerHour: PLATE_APH,
    inputs: [{ name: "Steel bar", qty: 5 }],
    output: { name: "Steel platebody", qty: 1 },
  },
  {
    id: "mithril-platebody",
    label: "Mithril platebody",
    level: 68,
    xp: 250,
    actionsPerHour: PLATE_APH,
    inputs: [{ name: "Mithril bar", qty: 5 }],
    output: { name: "Mithril platebody", qty: 1 },
  },
  {
    id: "adamant-platebody",
    label: "Adamant platebody",
    level: 88,
    xp: 312.5,
    actionsPerHour: PLATE_APH,
    inputs: [{ name: "Adamantite bar", qty: 5 }],
    output: { name: "Adamant platebody", qty: 1 },
  },
  {
    id: "rune-platebody",
    label: "Rune platebody",
    level: 99,
    xp: 375,
    actionsPerHour: PLATE_APH,
    inputs: [{ name: "Runite bar", qty: 5 }],
    output: { name: "Rune platebody", qty: 1 },
  },

  // ── 3-bar rune items ──────────────────────────────────────────────────
  {
    id: "rune-2h",
    label: "Rune 2h sword",
    level: 99,
    xp: 225,
    actionsPerHour: RUNE3_APH,
    inputs: [{ name: "Runite bar", qty: 3 }],
    output: { name: "Rune 2h sword", qty: 1 },
  },
  {
    id: "rune-platelegs",
    label: "Rune platelegs",
    level: 99,
    xp: 225,
    actionsPerHour: RUNE3_APH,
    inputs: [{ name: "Runite bar", qty: 3 }],
    output: { name: "Rune platelegs", qty: 1 },
  },
  {
    id: "rune-plateskirt",
    label: "Rune plateskirt",
    level: 99,
    xp: 225,
    actionsPerHour: RUNE3_APH,
    inputs: [{ name: "Runite bar", qty: 3 }],
    output: { name: "Rune plateskirt", qty: 1 },
  },
  {
    id: "rune-kiteshield",
    label: "Rune kiteshield",
    level: 97,
    xp: 225,
    actionsPerHour: RUNE3_APH,
    inputs: [{ name: "Runite bar", qty: 3 }],
    output: { name: "Rune kiteshield", qty: 1 },
  },
  {
    id: "rune-battleaxe",
    label: "Rune battleaxe",
    level: 95,
    xp: 225,
    actionsPerHour: RUNE3_APH,
    inputs: [{ name: "Runite bar", qty: 3 }],
    output: { name: "Rune battleaxe", qty: 1 },
  },
  {
    id: "rune-warhammer",
    label: "Rune warhammer",
    level: 94,
    xp: 225,
    actionsPerHour: RUNE3_APH,
    inputs: [{ name: "Runite bar", qty: 3 }],
    output: { name: "Rune warhammer", qty: 1 },
  },
];

/** All GE item names referenced by smithing methods (for price snapshot). */
export function smithingMethodItemNames(): string[] {
  const names = new Set<string>();
  for (const m of SMITHING_METHODS) {
    for (const p of m.inputs) names.add(p.name);
    names.add(m.output.name);
  }
  return [...names];
}
