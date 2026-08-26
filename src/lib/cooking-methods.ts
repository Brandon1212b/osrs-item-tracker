/**
 * Cooking training methods (P2P).
 * https://oldschool.runescape.wiki/w/Pay-to-play_Cooking_training
 * Hosidius kitchen 1,365 fish/hr; Rogues' Den karambwan 1,385; 1-tick 5,000.
 * Wine ~2,400/hr → ~480k XP/h (wiki 470–490k).
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

const HOSIDIUS_FISH_PER_HOUR = 1365;

export const COOKING_METHODS: CookingMethod[] = [
  {
    id: "wine",
    label: "Jug of wine",
    level: 35,
    xp: 200,
    actionsPerHour: 2400,
    inputs: [
      { name: "Grapes", qty: 1 },
      { name: "Jug of water", qty: 1 },
    ],
    output: { name: "Jug of wine", qty: 1 },
  },
  {
    id: "karambwan",
    label: "Cooked karambwan",
    level: 30,
    xp: 190,
    actionsPerHour: 1385,
    inputs: [{ name: "Raw karambwan", qty: 1 }],
    output: { name: "Cooked karambwan", qty: 1 },
  },
  {
    id: "karambwan-1tick",
    label: "Cooked karambwan (1-tick)",
    level: 30,
    xp: 190,
    actionsPerHour: 5000,
    inputs: [{ name: "Raw karambwan", qty: 1 }],
    output: { name: "Cooked karambwan", qty: 1 },
  },
  {
    id: "poison-karambwan",
    label: "Poison karambwan",
    level: 30,
    xp: 80,
    actionsPerHour: 1385,
    inputs: [{ name: "Raw karambwan", qty: 1 }],
    output: { name: "Poison karambwan", qty: 1 },
  },
  {
    id: "tuna",
    label: "Cooked tuna",
    level: 30,
    xp: 100,
    actionsPerHour: HOSIDIUS_FISH_PER_HOUR,
    inputs: [{ name: "Raw tuna", qty: 1 }],
    output: { name: "Tuna", qty: 1 },
  },
  {
    id: "lobster",
    label: "Cooked lobster",
    level: 40,
    xp: 120,
    actionsPerHour: HOSIDIUS_FISH_PER_HOUR,
    inputs: [{ name: "Raw lobster", qty: 1 }],
    output: { name: "Lobster", qty: 1 },
  },
  {
    id: "swordfish",
    label: "Cooked swordfish",
    level: 45,
    xp: 140,
    actionsPerHour: HOSIDIUS_FISH_PER_HOUR,
    inputs: [{ name: "Raw swordfish", qty: 1 }],
    output: { name: "Swordfish", qty: 1 },
  },
  {
    id: "monkfish",
    label: "Cooked monkfish",
    level: 62,
    xp: 150,
    actionsPerHour: HOSIDIUS_FISH_PER_HOUR,
    inputs: [{ name: "Raw monkfish", qty: 1 }],
    output: { name: "Monkfish", qty: 1 },
  },
  {
    id: "shark",
    label: "Cooked shark",
    level: 80,
    xp: 210,
    actionsPerHour: HOSIDIUS_FISH_PER_HOUR,
    inputs: [{ name: "Raw shark", qty: 1 }],
    output: { name: "Shark", qty: 1 },
  },
  {
    id: "anglerfish",
    label: "Cooked anglerfish",
    level: 84,
    xp: 230,
    actionsPerHour: HOSIDIUS_FISH_PER_HOUR,
    inputs: [{ name: "Raw anglerfish", qty: 1 }],
    output: { name: "Anglerfish", qty: 1 },
  },
  {
    id: "manta-ray",
    label: "Cooked manta ray",
    level: 91,
    xp: 216.2,
    actionsPerHour: HOSIDIUS_FISH_PER_HOUR,
    inputs: [{ name: "Raw manta ray", qty: 1 }],
    output: { name: "Manta ray", qty: 1 },
  },
  {
    id: "dark-crab",
    label: "Cooked dark crab",
    level: 90,
    xp: 215,
    actionsPerHour: HOSIDIUS_FISH_PER_HOUR,
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
