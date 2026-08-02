/**
 * Crafting training methods (P2P guide rates).
 * https://oldschool.runescape.wiki/w/Pay-to-play_Crafting_training
 *
 * XP/h from wiki assumptions; GP/h is computed live from GE prices.
 */
export type MethodPart = {
  name: string;
  qty: number;
};

export type CraftingMethod = {
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

export const CRAFTING_METHODS: CraftingMethod[] = [
  // Gem cutting — 2780 gems/h
  {
    id: "cut-sapphire",
    label: "Cut sapphire",
    level: 20,
    xp: 50,
    actionsPerHour: 2780,
    inputs: [{ name: "Uncut sapphire", qty: 1 }],
    output: { name: "Sapphire", qty: 1 },
  },
  {
    id: "cut-emerald",
    label: "Cut emerald",
    level: 27,
    xp: 67.5,
    actionsPerHour: 2780,
    inputs: [{ name: "Uncut emerald", qty: 1 }],
    output: { name: "Emerald", qty: 1 },
  },
  {
    id: "cut-ruby",
    label: "Cut ruby",
    level: 34,
    xp: 85,
    actionsPerHour: 2780,
    inputs: [{ name: "Uncut ruby", qty: 1 }],
    output: { name: "Ruby", qty: 1 },
  },
  {
    id: "cut-diamond",
    label: "Cut diamond",
    level: 43,
    xp: 107.5,
    actionsPerHour: 2780,
    inputs: [{ name: "Uncut diamond", qty: 1 }],
    output: { name: "Diamond", qty: 1 },
  },
  // Battlestaves — 2450/h
  {
    id: "water-battlestaff",
    label: "Water battlestaff",
    level: 54,
    xp: 100,
    actionsPerHour: 2450,
    inputs: [
      { name: "Battlestaff", qty: 1 },
      { name: "Water orb", qty: 1 },
    ],
    output: { name: "Water battlestaff", qty: 1 },
  },
  {
    id: "earth-battlestaff",
    label: "Earth battlestaff",
    level: 58,
    xp: 112.5,
    actionsPerHour: 2450,
    inputs: [
      { name: "Battlestaff", qty: 1 },
      { name: "Earth orb", qty: 1 },
    ],
    output: { name: "Earth battlestaff", qty: 1 },
  },
  {
    id: "fire-battlestaff",
    label: "Fire battlestaff",
    level: 62,
    xp: 125,
    actionsPerHour: 2450,
    inputs: [
      { name: "Battlestaff", qty: 1 },
      { name: "Fire orb", qty: 1 },
    ],
    output: { name: "Fire battlestaff", qty: 1 },
  },
  {
    id: "air-battlestaff",
    label: "Air battlestaff",
    level: 66,
    xp: 137.5,
    actionsPerHour: 2450,
    inputs: [
      { name: "Battlestaff", qty: 1 },
      { name: "Air orb", qty: 1 },
    ],
    output: { name: "Air battlestaff", qty: 1 },
  },
  // D'hide bodies — ~1705/h (costume needle, no tick manip)
  {
    id: "green-dhide-body",
    label: "Green d'hide body",
    level: 63,
    xp: 186,
    actionsPerHour: 1705,
    inputs: [{ name: "Green dragon leather", qty: 3 }],
    output: { name: "Green d'hide body", qty: 1 },
  },
  {
    id: "blue-dhide-body",
    label: "Blue d'hide body",
    level: 71,
    xp: 210,
    actionsPerHour: 1705,
    inputs: [{ name: "Blue dragon leather", qty: 3 }],
    output: { name: "Blue d'hide body", qty: 1 },
  },
  {
    id: "red-dhide-body",
    label: "Red d'hide body",
    level: 77,
    xp: 234,
    actionsPerHour: 1705,
    inputs: [{ name: "Red dragon leather", qty: 3 }],
    output: { name: "Red d'hide body", qty: 1 },
  },
  {
    id: "black-dhide-body",
    label: "Black d'hide body",
    level: 84,
    xp: 258,
    actionsPerHour: 1705,
    inputs: [{ name: "Black dragon leather", qty: 3 }],
    output: { name: "Black d'hide body", qty: 1 },
  },
  // Amethyst cutting — ~2750/h (wiki money-making / same chisel pace as gems)
  // https://oldschool.runescape.wiki/w/Money_making_guide/Cutting_amethyst_bolt_tips
  {
    id: "amethyst-bolt-tips",
    label: "Amethyst bolt tips",
    level: 83,
    xp: 60,
    actionsPerHour: 2750,
    inputs: [{ name: "Amethyst", qty: 1 }],
    output: { name: "Amethyst bolt tips", qty: 15 },
  },
  {
    id: "amethyst-arrowtips",
    label: "Amethyst arrowtips",
    level: 85,
    xp: 60,
    actionsPerHour: 2750,
    inputs: [{ name: "Amethyst", qty: 1 }],
    output: { name: "Amethyst arrowtips", qty: 15 },
  },
  {
    id: "amethyst-javelin-tips",
    label: "Amethyst javelin tips",
    level: 87,
    xp: 60,
    actionsPerHour: 2750,
    inputs: [{ name: "Amethyst", qty: 1 }],
    output: { name: "Amethyst javelin tips", qty: 5 },
  },
  {
    id: "amethyst-dart-tip",
    label: "Amethyst dart tips",
    level: 89,
    xp: 60,
    actionsPerHour: 2750,
    inputs: [{ name: "Amethyst", qty: 1 }],
    output: { name: "Amethyst dart tip", qty: 8 },
  },
];

/** All GE item names referenced by crafting methods (for price snapshot). */
export function craftingMethodItemNames(): string[] {
  const names = new Set<string>();
  for (const m of CRAFTING_METHODS) {
    for (const p of m.inputs) names.add(p.name);
    names.add(m.output.name);
  }
  return [...names];
}
