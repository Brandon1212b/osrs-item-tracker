/**
 * Construction training methods (P2P guide rates).
 * https://oldschool.runescape.wiki/w/Construction_training
 *
 * XP/h from wiki focused rates; GP/h is computed live from GE prices.
 * POH furniture methods consume planks (no GE product).
 * Hull parts / repair kits produce tradeable items.
 */
export type MethodPart = {
  name: string;
  qty: number;
};

export type ConstructionMethod = {
  id: string;
  label: string;
  level: number;
  /** XP per action */
  xp: number;
  /** Actions per hour (wiki / focused rate) */
  actionsPerHour: number;
  inputs: MethodPart[];
  /**
   * GE-sellable product. null = materials consumed (build + remove in POH).
   */
  output: MethodPart | null;
};

export const CONSTRUCTION_METHODS: ConstructionMethod[] = [
  // Oak larders — main mid method 33–52
  {
    id: "oak-larder",
    label: "Oak larder",
    level: 33,
    xp: 480,
    actionsPerHour: 900, // ~430k xp/h with butler
    inputs: [{ name: "Oak plank", qty: 8 }],
    output: null,
  },
  // Oak dining table — cheaper oak alternative
  {
    id: "oak-dining-table",
    label: "Oak dining table",
    level: 33,
    xp: 240,
    actionsPerHour: 1100,
    inputs: [{ name: "Oak plank", qty: 4 }],
    output: null,
  },
  // Teak armchair — teak training before mythical cape / tables
  {
    id: "teak-armchair",
    label: "Teak armchair",
    level: 35,
    xp: 180,
    actionsPerHour: 1200,
    inputs: [{ name: "Teak plank", qty: 2 }],
    output: null,
  },
  // Mounted mythical cape — 3 teak planks (cape returned), ~430k xp/h
  // Requires Dragon Slayer II; level 47 object, demon butler from 50
  {
    id: "mythical-cape",
    label: "Mounted mythical cape",
    level: 50,
    xp: 370,
    actionsPerHour: 1162,
    inputs: [{ name: "Teak plank", qty: 3 }],
    output: null,
  },
  // Mahogany tables — 6 mahogany planks, 840 xp, ~900k xp/h
  {
    id: "mahogany-table",
    label: "Mahogany table",
    level: 52,
    xp: 840,
    actionsPerHour: 1071,
    inputs: [{ name: "Mahogany plank", qty: 6 }],
    output: null,
  },
  // Teak garden benches — 6 teak planks, 540 xp, ~600k xp/h realistic
  {
    id: "teak-garden-bench",
    label: "Teak garden bench",
    level: 66,
    xp: 540,
    actionsPerHour: 1111,
    inputs: [{ name: "Teak plank", qty: 6 }],
    output: null,
  },
  // Oak dungeon doors — 10 oak planks, 600 xp, ~550k xp/h
  {
    id: "oak-door",
    label: "Oak dungeon door",
    level: 74,
    xp: 600,
    actionsPerHour: 917,
    inputs: [{ name: "Oak plank", qty: 10 }],
    output: null,
  },
  // Mahogany gnome benches — 6 mahogany planks, 840 xp, ~1.1m xp/h
  {
    id: "mahogany-gnome-bench",
    label: "Mahogany gnome bench",
    level: 77,
    xp: 840,
    actionsPerHour: 1310,
    inputs: [{ name: "Mahogany plank", qty: 6 }],
    output: null,
  },
  // Shipwright workbench products (Sailing) — sellable outputs
  {
    id: "mahogany-hull-parts",
    label: "Mahogany hull parts",
    level: 41,
    xp: 350,
    actionsPerHour: 1000,
    inputs: [{ name: "Mahogany plank", qty: 5 }],
    output: { name: "Mahogany hull parts", qty: 1 },
  },
  {
    id: "mahogany-repair-kit",
    label: "Mahogany repair kit",
    level: 47,
    xp: 210,
    actionsPerHour: 600,
    inputs: [
      { name: "Mahogany plank", qty: 2 },
      { name: "Mithril nails", qty: 10 },
      { name: "Swamp paste", qty: 5 },
    ],
    output: { name: "Mahogany repair kit", qty: 2 },
  },
];

/** All GE item names referenced by construction methods (for price snapshot). */
export function constructionMethodItemNames(): string[] {
  const names = new Set<string>();
  for (const m of CONSTRUCTION_METHODS) {
    for (const p of m.inputs) names.add(p.name);
    if (m.output) names.add(m.output.name);
  }
  return [...names];
}
