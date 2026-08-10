/**
 * Cooking training methods (P2P).
 * https://oldschool.runescape.wiki/w/Cooking_training / Pay-to-play_Cooking_training
 * Standard (non 1-tick) rates unless noted. 1-tick Karambwan is a distinct method.
 */
export type MethodPart = { name: string; qty: number };

export type CookingMethod = {
  id: string;
  label: string;
  level: number;
  xp: number;
  actionsPerHour: number;
  inputs: MethodPart[];
  output: MethodPart;
};

export const COOKING_METHODS: CookingMethod[] = [
  {
    id: "wine",
    label: "Jug of wine",
    level: 35,
    xp: 200,
    actionsPerHour: 2000,
    inputs: [
      { name: "Grapes", qty: 1 },
      { name: "Jug of water", qty: 1 },
    ],
    output: { name: "Jug of wine", qty: 1 },
  },
  // Standard karambwan (no tick manip)
  {
    id: "karambwan",
    label: "Cooked karambwan",
    level: 30,
    xp: 190,
    actionsPerHour: 1300,
    inputs: [{ name: "Raw karambwan", qty: 1 }],
    output: { name: "Cooked karambwan", qty: 1 },
  },
  // 1-tick karambwan — distinct high-intensity method
  {
    id: "karambwan-1tick",
    label: "Cooked karambwan (1-tick)",
    level: 30,
    xp: 190,
    actionsPerHour: 4500, // focused realistic; wiki max ~5000–5470
    inputs: [{ name: "Raw karambwan", qty: 1 }],
    output: { name: "Cooked karambwan", qty: 1 },
  },
  {
    id: "poison-karambwan",
    label: "Poison karambwan",
    level: 30,
    xp: 80,
    actionsPerHour: 1300,
    inputs: [{ name: "Raw karambwan", qty: 1 }],
    output: { name: "Poison karambwan", qty: 1 },
  },
  {
    id: "tuna",
    label: "Cooked tuna",
    level: 30,
    xp: 100,
    actionsPerHour: 1300,
    inputs: [{ name: "Raw tuna", qty: 1 }],
    output: { name: "Tuna", qty: 1 },
  },
  {
    id: "lobster",
    label: "Cooked lobster",
    level: 40,
    xp: 120,
    actionsPerHour: 1300,
    inputs: [{ name: "Raw lobster", qty: 1 }],
    output: { name: "Lobster", qty: 1 },
  },
  {
    id: "swordfish",
    label: "Cooked swordfish",
    level: 45,
    xp: 140,
    actionsPerHour: 1300,
    inputs: [{ name: "Raw swordfish", qty: 1 }],
    output: { name: "Swordfish", qty: 1 },
  },
  {
    id: "monkfish",
    label: "Cooked monkfish",
    level: 62,
    xp: 150,
    actionsPerHour: 1300,
    inputs: [{ name: "Raw monkfish", qty: 1 }],
    output: { name: "Monkfish", qty: 1 },
  },
  {
    id: "shark",
    label: "Cooked shark",
    level: 80,
    xp: 210,
    actionsPerHour: 1300,
    inputs: [{ name: "Raw shark", qty: 1 }],
    output: { name: "Shark", qty: 1 },
  },
  {
    id: "anglerfish",
    label: "Cooked anglerfish",
    level: 84,
    xp: 230,
    actionsPerHour: 1300,
    inputs: [{ name: "Raw anglerfish", qty: 1 }],
    output: { name: "Anglerfish", qty: 1 },
  },
  {
    id: "manta-ray",
    label: "Cooked manta ray",
    level: 91,
    xp: 216.2,
    actionsPerHour: 1300,
    inputs: [{ name: "Raw manta ray", qty: 1 }],
    output: { name: "Manta ray", qty: 1 },
  },
  {
    id: "dark-crab",
    label: "Cooked dark crab",
    level: 90,
    xp: 215,
    actionsPerHour: 1300,
    inputs: [{ name: "Raw dark crab", qty: 1 }],
    output: { name: "Dark crab", qty: 1 },
  },
];

export function cookingMethodItemNames(): string[] {
  const names = new Set<string>();
  for (const m of COOKING_METHODS) {
    for (const p of m.inputs) names.add(p.name);
    names.add(m.output.name);
  }
  return [...names];
}
