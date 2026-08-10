/**
 * Thieving training methods (P2P).
 * https://oldschool.runescape.wiki/w/Pay-to-play_Thieving_training
 * Most pickpocket methods yield coins/pouches — modelled as pure XP
 * (coin output is not a stable GE "item" for the calculator).
 * Stalls that produce tradeable goods use fixed outputs where practical.
 */
export type MethodPart = { name: string; qty: number };

export type ThievingMethod = {
  id: string;
  label: string;
  level: number;
  xp: number;
  actionsPerHour: number;
  inputs: MethodPart[];
  output: MethodPart | null;
};

export const THIEVING_METHODS: ThievingMethod[] = [
  {
    id: "pickpocket-man",
    label: "Pickpocket men/women",
    level: 1,
    xp: 8,
    actionsPerHour: 2000,
    inputs: [],
    output: null,
  },
  {
    id: "silk-stall",
    label: "Silk stall",
    level: 20,
    xp: 24,
    actionsPerHour: 700,
    inputs: [],
    output: { name: "Silk", qty: 1 },
  },
  {
    id: "fruit-stall",
    label: "Fruit stall (Hosidius)",
    level: 25,
    xp: 28.5,
    actionsPerHour: 1200, // two-stall focused ~34k
    inputs: [],
    output: null, // mixed fruit; not fixed GE
  },
  {
    id: "blackjacking",
    label: "Blackjacking (Pollnivneach)",
    level: 45,
    xp: 46.5, // typical bandit/thug average
    actionsPerHour: 1800, // ~84k mid; higher with practice
    inputs: [],
    output: null,
  },
  {
    id: "ardougne-knights",
    label: "Knights of Ardougne",
    level: 55,
    xp: 84.3,
    actionsPerHour: 1200, // ~100k+ with diary/dodgy; conservative
    inputs: [{ name: "Dodgy necklace", qty: 0.05 }], // approximate wear rate
    output: null,
  },
  {
    id: "stealing-valuables",
    label: "Stealing valuables (Varlamore)",
    level: 50,
    xp: 45,
    actionsPerHour: 1800, // ~80k mid
    inputs: [],
    output: null, // valuables exchanged
  },
  {
    id: "elves",
    label: "Pickpocket elves (Prifddinas)",
    level: 85,
    xp: 353.3, // high XP per success
    actionsPerHour: 400, // ~140k at high level
    inputs: [],
    output: null,
  },
  {
    id: "vyres",
    label: "Pickpocket vyres",
    level: 82,
    xp: 306.9,
    actionsPerHour: 450, // ~140k focused
    inputs: [],
    output: null,
  },
  {
    id: "master-farmers",
    label: "Master Farmers",
    level: 38,
    xp: 43,
    actionsPerHour: 1800, // ~77k; higher at 94+ 100%
    inputs: [],
    output: null, // seeds vary
  },
  {
    id: "rogues-castle",
    label: "Rogues' Castle chests",
    level: 84,
    xp: 100, // approximate per successful open cycle
    actionsPerHour: 2500, // high intensity wilderness
    inputs: [],
    output: null,
  },
];

export function thievingMethodItemNames(): string[] {
  const names = new Set<string>();
  for (const m of THIEVING_METHODS) {
    for (const p of m.inputs) names.add(p.name);
    if (m.output) names.add(m.output.name);
  }
  return [...names];
}
