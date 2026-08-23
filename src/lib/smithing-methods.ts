/**
 * Smithing training methods (P2P guide rates).
 *
 * Blast Furnace bars/h from:
 *   https://oldschool.runescape.wiki/w/Money_making_guide/Blast_Furnace
 *   (coal bag + ice gloves + stamina; 200 trips/h model)
 *
 * Anvil / cannonball rates from wiki calculators & money-making pages.
 * XP/h = xp * actionsPerHour. GP/h is computed live from GE prices (not hardcoded).
 * Blast Furnace coal is already halved vs normal furnace.
 * Official BF worlds: 72,000 gp/hr coffer fee amortized into each bar as Coins.
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
  /** Actions (bars) per hour — wiki focused / MMG rate */
  actionsPerHour: number;
  inputs: MethodPart[];
  output: MethodPart;
};

// ── Throughput (wiki MMG / calculator) ──────────────────────────────────
// BF single-bar: Money_making_guide/Blast_Furnace table
const BF_IRON_APH = 6000; // 75,000 xp/h
const BF_STEEL_APH = 5400; // 94,500 xp/h
const BF_MITHRIL_APH = 3600; // 108,000 xp/h
const BF_ADAMANT_APH = 2700; // 101,250 xp/h
const BF_RUNITE_APH = 2160; // 108,000 xp/h (wiki lists 107,500)
// Gold + goldsmith gauntlets: strategies mid of 5600–6600 → ~380k xp/h
const BF_GOLD_APH = 6200; // ~348k xp/h @ 56.2

// Dart tips / nails: continuous anvil, stackable product, noted bars
const DART_BAR_APH = 1300;
const NAIL_BAR_APH = 1300;

// Cannonballs — Money_making_guide/Smithing_steel_cannonballs
const CANNON_BAR_APH = 600; // 2,400 balls/h regular mould
const CANNON_DOUBLE_BAR_APH = 1200; // 4,800 balls/h double mould

// Anvil platebodies / 3-bar: Calculator:Smithing/Bars (3s action + bank)
const PLATE_APH = 750; // 5-bar items → rune plate ~281k xp/h
const RUNE3_APH = 900; // 3-bar items → ~202k xp/h

export const SMITHING_METHODS: SmithingMethod[] = [
  // ── Blast Furnace bars ────────────────────────────────────────────────
  {
    id: "bf-iron",
    label: "Iron bars (Blast Furnace)",
    level: 15,
    xp: 12.5,
    actionsPerHour: BF_IRON_APH,
    inputs: [
      { name: "Iron ore", qty: 1 },
      { name: "Coins", qty: 72000 / 6000 }, // BF world coffer ~72k/hr
    ],
    output: { name: "Iron bar", qty: 1 },
  },
  {
    id: "bf-steel",
    label: "Steel bars (Blast Furnace)",
    level: 30,
    xp: 17.5,
    actionsPerHour: BF_STEEL_APH,
    inputs: [
      { name: "Iron ore", qty: 1 },
      { name: "Coal", qty: 1 }, // BF halves coal
      { name: "Coins", qty: 72000 / 5400 }, // BF world coffer ~72k/hr
    ],
    output: { name: "Steel bar", qty: 1 },
  },
  {
    id: "bf-gold",
    label: "Gold bars (Blast Furnace + gauntlets)",
    level: 40,
    xp: 56.2,
    actionsPerHour: BF_GOLD_APH,
    inputs: [
      { name: "Gold ore", qty: 1 },
      { name: "Coins", qty: 72000 / 6200 }, // BF world coffer ~72k/hr
    ],
    output: { name: "Gold bar", qty: 1 },
  },
  {
    id: "bf-mithril",
    label: "Mithril bars (Blast Furnace)",
    level: 50,
    xp: 30,
    actionsPerHour: BF_MITHRIL_APH,
    inputs: [
      { name: "Mithril ore", qty: 1 },
      { name: "Coal", qty: 2 },
      { name: "Coins", qty: 72000 / 3600 }, // BF world coffer ~72k/hr
    ],
    output: { name: "Mithril bar", qty: 1 },
  },
  {
    id: "bf-adamant",
    label: "Adamantite bars (Blast Furnace)",
    level: 70,
    xp: 37.5,
    actionsPerHour: BF_ADAMANT_APH,
    inputs: [
      { name: "Adamantite ore", qty: 1 },
      { name: "Coal", qty: 3 },
      { name: "Coins", qty: 72000 / 2700 }, // BF world coffer ~72k/hr
    ],
    output: { name: "Adamantite bar", qty: 1 },
  },
  {
    id: "bf-rune",
    label: "Runite bars (Blast Furnace)",
    level: 85,
    xp: 50,
    actionsPerHour: BF_RUNITE_APH,
    inputs: [
      { name: "Runite ore", qty: 1 },
      { name: "Coal", qty: 4 },
      { name: "Coins", qty: 72000 / 2160 }, // BF world coffer ~72k/hr
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
