/**
 * Runecraft methods (P2P focused rates).
 * https://oldschool.runescape.wiki/w/Pay-to-play_Runecraft_training
 */
export type MethodPart = { name: string; qty: number };

export type RunecraftMethod = {
  id: string;
  label: string;
  level: number;
  xp: number;
  actionsPerHour: number;
  inputs: MethodPart[];
  output: MethodPart;
};

export const RUNECRAFT_METHODS: RunecraftMethod[] = [
  {
    id: "lava-runes-abyss",
    label: "Lava runes (Abyss)",
    level: 23,
    xp: 10.5,
    actionsPerHour: 7000,
    inputs: [
      { name: "Pure essence", qty: 1 },
      { name: "Earth rune", qty: 1 },
    ],
    output: { name: "Lava rune", qty: 1 },
  },
  {
    id: "steam-runes-abyss",
    label: "Steam runes (Abyss)",
    level: 19,
    xp: 9.5,
    actionsPerHour: 7000,
    inputs: [
      { name: "Pure essence", qty: 1 },
      { name: "Water rune", qty: 1 },
    ],
    output: { name: "Steam rune", qty: 1 },
  },
  {
    id: "nature-runes-abyss",
    label: "Nature runes (Abyss)",
    level: 44,
    xp: 9,
    actionsPerHour: 5500,
    inputs: [{ name: "Pure essence", qty: 1 }],
    output: { name: "Nature rune", qty: 1 },
  },
  {
    id: "blood-runes-true",
    label: "Blood runes (True Blood altar)",
    level: 77,
    xp: 23.8,
    actionsPerHour: 4200,
    inputs: [{ name: "Dark essence fragments", qty: 1 }],
    output: { name: "Blood rune", qty: 1 },
  },
  {
    id: "soul-runes-true",
    label: "Soul runes (True Soul altar)",
    level: 90,
    xp: 29.7,
    actionsPerHour: 3800,
    inputs: [{ name: "Dark essence fragments", qty: 1 }],
    output: { name: "Soul rune", qty: 1 },
  },
  {
    id: "wrath-runes",
    label: "Wrath runes",
    level: 95,
    xp: 8,
    actionsPerHour: 5000,
    inputs: [{ name: "Pure essence", qty: 1 }],
    output: { name: "Wrath rune", qty: 1 },
  },
];

export function runecraftMethodItemNames(): string[] {
  const names = new Set<string>();
  for (const m of RUNECRAFT_METHODS) {
    for (const p of m.inputs) names.add(p.name);
    names.add(m.output.name);
  }
  return [...names];
}
