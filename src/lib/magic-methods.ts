/**
 * Magic training / money methods with GE inputs & outputs.
 * Plank Make: https://oldschool.runescape.wiki/w/Plank_Make
 * Superheat / Tan leather lunar spells.
 */
export type MethodPart = { name: string; qty: number };

export type MagicMethod = {
  id: string;
  label: string;
  level: number;
  xp: number;
  actionsPerHour: number;
  inputs: MethodPart[];
  output: MethodPart;
};

export const MAGIC_METHODS: MagicMethod[] = [
  {
    id: "plank-make-mahogany",
    label: "Plank Make (mahogany)",
    level: 86,
    xp: 90,
    actionsPerHour: 1000,
    inputs: [
      { name: "Mahogany logs", qty: 1 },
      { name: "Nature rune", qty: 1 },
      { name: "Astral rune", qty: 2 },
    ],
    output: { name: "Mahogany plank", qty: 1 },
  },
  {
    id: "plank-make-teak",
    label: "Plank Make (teak)",
    level: 86,
    xp: 90,
    actionsPerHour: 1000,
    inputs: [
      { name: "Teak logs", qty: 1 },
      { name: "Nature rune", qty: 1 },
      { name: "Astral rune", qty: 2 },
    ],
    output: { name: "Teak plank", qty: 1 },
  },
  {
    id: "tan-black-dhide",
    label: "Tan leather (black d'hide)",
    level: 78,
    xp: 81,
    actionsPerHour: 1600,
    inputs: [
      { name: "Black dragonhide", qty: 5 },
      { name: "Nature rune", qty: 1 },
      { name: "Astral rune", qty: 2 },
    ],
    output: { name: "Black dragon leather", qty: 5 },
  },
  {
    id: "tan-red-dhide",
    label: "Tan leather (red d'hide)",
    level: 78,
    xp: 81,
    actionsPerHour: 1600,
    inputs: [
      { name: "Red dragonhide", qty: 5 },
      { name: "Nature rune", qty: 1 },
      { name: "Astral rune", qty: 2 },
    ],
    output: { name: "Red dragon leather", qty: 5 },
  },
  {
    id: "superheat-gold",
    label: "Superheat Item (gold)",
    level: 43,
    xp: 53,
    actionsPerHour: 1600,
    inputs: [
      { name: "Gold ore", qty: 1 },
      { name: "Nature rune", qty: 1 },
    ],
    output: { name: "Gold bar", qty: 1 },
  },
  {
    id: "superheat-rune",
    label: "Superheat Item (runite)",
    level: 43,
    xp: 53,
    actionsPerHour: 1600,
    inputs: [
      { name: "Runite ore", qty: 1 },
      { name: "Coal", qty: 8 },
      { name: "Nature rune", qty: 1 },
    ],
    output: { name: "Runite bar", qty: 1 },
  },
  {
    id: "humidify-jugs",
    label: "Humidify (jugs)",
    level: 68,
    xp: 65,
    actionsPerHour: 1600,
    inputs: [
      { name: "Jug", qty: 27 },
      { name: "Astral rune", qty: 1 },
      { name: "Fire rune", qty: 1 },
      { name: "Water rune", qty: 3 },
    ],
    output: { name: "Jug of water", qty: 27 },
  },
];

export function magicMethodItemNames(): string[] {
  const names = new Set<string>();
  for (const m of MAGIC_METHODS) {
    for (const p of m.inputs) names.add(p.name);
    names.add(m.output.name);
  }
  return [...names];
}
