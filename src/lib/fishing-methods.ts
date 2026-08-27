/** Recipe fishing methods that do not have a wiki level table. */
export type MethodPart = { name: string; qty: number };

export type FishingMethod = {
  id: string;
  label: string;
  level: number;
  xp: number;
  actionsPerHour: number;
  inputs: MethodPart[];
  output: MethodPart | null;
};

export const FISHING_METHODS: FishingMethod[] = [
  { id: "shrimp", label: "Raw shrimps", level: 1, xp: 10, actionsPerHour: 400, inputs: [], output: { name: "Raw shrimps", qty: 1 } },
  { id: "lobster", label: "Raw lobster", level: 40, xp: 90, actionsPerHour: 350, inputs: [], output: { name: "Raw lobster", qty: 1 } },
  { id: "swordfish", label: "Raw swordfish", level: 50, xp: 100, actionsPerHour: 280, inputs: [], output: { name: "Raw swordfish", qty: 1 } },
  { id: "shark", label: "Raw shark", level: 76, xp: 110, actionsPerHour: 300, inputs: [], output: { name: "Raw shark", qty: 1 } },
  { id: "leechfin", label: "Leechfin", level: 78, xp: 33.2, actionsPerHour: 3600, inputs: [], output: null },
  { id: "anglerfish", label: "Raw anglerfish", level: 82, xp: 120, actionsPerHour: 220, inputs: [{ name: "Sandworms", qty: 1 }], output: { name: "Raw anglerfish", qty: 1 } },
  { id: "dark-crab", label: "Raw dark crab", level: 85, xp: 130, actionsPerHour: 308, inputs: [{ name: "Dark fishing bait", qty: 1 }], output: { name: "Raw dark crab", qty: 1 } },
];

export function fishingMethodItemNames(): string[] {
  const names = new Set<string>([
    "Feather",
    "Raw salmon",
    "Raw monkfish",
    "Raw karambwanji",
    "Raw karambwan",
    "Fishing bait",
    "Raw shark",
    "Drift net",
  ]);
  for (const m of FISHING_METHODS) {
    for (const p of m.inputs) names.add(p.name);
    if (m.output) names.add(m.output.name);
  }
  return [...names];
}
