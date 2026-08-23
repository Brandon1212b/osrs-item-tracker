/**
 * Runecraft methods (P2P focused rates).
 * https://oldschool.runescape.wiki/w/Pay-to-play_Runecraft_training
 *
 * Ourania/ZMI produces a random mix of runes; modelled with pure essence input
 * and a representative high-value output for cost scoring (not exact mix).
 * Guardians of the Rift is multi-reward activity — excluded from simple model.
 * Lava rune running often uses paid runners; GE model still valid for self-run.
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
    id: "zmi-ourania",
    label: "Ourania altar (ZMI)",
    level: 1,
    xp: 15,
    actionsPerHour: 4700,
    inputs: [{ name: "Pure essence", qty: 1 }],
    output: { name: "Nature rune", qty: 1 },
  },
  {
    id: "air-runes",
    label: "Air runes",
    level: 1,
    xp: 5,
    actionsPerHour: 5000,
    inputs: [{ name: "Pure essence", qty: 1 }],
    output: { name: "Air rune", qty: 1 },
  },
  {
    id: "water-runes",
    label: "Water runes",
    level: 5,
    xp: 6,
    actionsPerHour: 5000,
    inputs: [{ name: "Pure essence", qty: 1 }],
    output: { name: "Water rune", qty: 1 },
  },
  {
    id: "earth-runes",
    label: "Earth runes",
    level: 9,
    xp: 6.5,
    actionsPerHour: 5000,
    inputs: [{ name: "Pure essence", qty: 1 }],
    output: { name: "Earth rune", qty: 1 },
  },
  {
    id: "fire-runes",
    label: "Fire runes",
    level: 14,
    xp: 7,
    actionsPerHour: 5000,
    inputs: [{ name: "Pure essence", qty: 1 }],
    output: { name: "Fire rune", qty: 1 },
  },
  {
    id: "cosmic-runes",
    label: "Cosmic runes",
    level: 27,
    xp: 8,
    actionsPerHour: 4500,
    inputs: [{ name: "Pure essence", qty: 1 }],
    output: { name: "Cosmic rune", qty: 1 },
  },
  {
    id: "law-runes",
    label: "Law runes",
    level: 54,
    xp: 9.5,
    actionsPerHour: 4500,
    inputs: [{ name: "Pure essence", qty: 1 }],
    output: { name: "Law rune", qty: 1 },
  },
  {
    id: "death-runes",
    label: "Death runes",
    level: 65,
    xp: 10,
    actionsPerHour: 4500,
    inputs: [{ name: "Pure essence", qty: 1 }],
    output: { name: "Death rune", qty: 1 },
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
  {
    id: "sunfire-runes",
    label: "Sunfire runes (Shrine of Ralos)",
    level: 98,
    xp: 9,
    actionsPerHour: 3410,
    inputs: [
      { name: "Pure essence", qty: 1 },
      { name: "Fire rune", qty: 1 },
      { name: "Sunfire splinters", qty: 1 },
    ],
    output: { name: "Sunfire rune", qty: 4.8 },
  },
  {
    id: "nature-runes-double-diary",
    label: "Double nature runes (Diary cape)",
    level: 91,
    xp: 9,
    actionsPerHour: 7260,
    inputs: [{ name: "Pure essence", qty: 1 }],
    output: { name: "Nature rune", qty: 3.4 },
  },
  {
    id: "aether-runes",
    label: "Aether runes",
    level: 90,
    xp: 8,
    actionsPerHour: 4650,
    inputs: [
      { name: "Pure essence", qty: 1 },
      { name: "Soul rune", qty: 1 },
      { name: "Aether catalyst", qty: 1.6 },
      { name: "Binding necklace", qty: 0.003 },
    ],
    output: { name: "Aether rune", qty: 1.7 },
  },
  {
    id: "mud-runes",
    label: "Mud runes (combo)",
    level: 13,
    xp: 9.5,
    actionsPerHour: 10400,
    inputs: [
      { name: "Pure essence", qty: 1 },
      { name: "Water rune", qty: 1 },
    ],
    output: { name: "Mud rune", qty: 1.6 },
  },
  {
    id: "astral-runes",
    label: "Astral runes (Lunar)",
    level: 82,
    xp: 8.7,
    actionsPerHour: 5016,
    inputs: [
      { name: "Pure essence", qty: 1 },
      { name: "Stamina potion(4)", qty: 7.6 / 5016 },
    ],
    output: { name: "Astral rune", qty: 3.4 },
  },
  {
    id: "blood-runes-abyss",
    label: "Blood runes (Abyss)",
    level: 77,
    xp: 10.5,
    actionsPerHour: 3630,
    inputs: [
      { name: "Pure essence", qty: 1 },
      { name: "Blood essence", qty: 1.82 / 3630 },
      { name: "Stamina potion(4)", qty: 4.4 / 3630 },
    ],
    output: { name: "Blood rune", qty: 1.93 },
  },
  {
    id: "death-runes-abyss",
    label: "Death runes (Abyss)",
    level: 65,
    xp: 10,
    actionsPerHour: 3350,
    inputs: [
      { name: "Pure essence", qty: 1 },
      { name: "Stamina potion(4)", qty: 4 / 3350 },
    ],
    output: { name: "Death rune", qty: 3.4 },
  },
  {
    id: "chaos-runes-abyss",
    label: "Chaos runes (Abyss)",
    level: 74,
    xp: 8.5,
    actionsPerHour: 5000,
    inputs: [{ name: "Pure essence", qty: 1 }],
    output: { name: "Chaos rune", qty: 3.2 },
  },
  {
    id: "law-runes-abyss-double",
    label: "Double law runes (Abyss)",
    level: 95,
    xp: 9.5,
    actionsPerHour: 4500,
    inputs: [{ name: "Pure essence", qty: 1 }],
    output: { name: "Law rune", qty: 3.2 },
  },
  {
    id: "cosmic-runes-abyss",
    label: "Cosmic runes (Abyss)",
    level: 59,
    xp: 8,
    actionsPerHour: 4800,
    inputs: [{ name: "Pure essence", qty: 1 }],
    output: { name: "Cosmic rune", qty: 3.2 },
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
