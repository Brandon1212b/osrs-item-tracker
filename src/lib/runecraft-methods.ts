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
  // ── Combination / Abyss ──────────────────────────────────────────────────
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

  // ── Ourania / ZMI ────────────────────────────────────────────────────────
  // ~1.7× XP, ~4700 essence/h focused with colossal pouch. Random runes;
  // use Nature as representative output for economic scoring.
  {
    id: "zmi-ourania",
    label: "Ourania altar (ZMI)",
    level: 1,
    xp: 15, // approx average at mid–high level
    actionsPerHour: 4700,
    inputs: [{ name: "Pure essence", qty: 1 }],
    output: { name: "Nature rune", qty: 1 },
  },

  // ── Standard altars ──────────────────────────────────────────────────────
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
];

export function runecraftMethodItemNames(): string[] {
  const names = new Set<string>();
  for (const m of RUNECRAFT_METHODS) {
    for (const p of m.inputs) names.add(p.name);
    names.add(m.output.name);
  }
  return [...names];
}
