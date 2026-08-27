/**
 * Fishing training methods (P2P).
 * XP/h from https://oldschool.runescape.wiki/w/Pay-to-play_Fishing_training (Aug 2026).
 * actionsPerHour = focused mid-rate (not 2/3-tick max) so XP/h lands in the wiki band.
 */
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
  { id: "trout", label: "Raw trout (fly)", level: 20, xp: 50, actionsPerHour: 500, inputs: [{ name: "Feather", qty: 1 }], output: { name: "Raw trout", qty: 1 } },
  { id: "salmon", label: "Raw salmon (fly)", level: 30, xp: 70, actionsPerHour: 450, inputs: [{ name: "Feather", qty: 1 }], output: { name: "Raw salmon", qty: 1 } },
  { id: "lobster", label: "Raw lobster", level: 40, xp: 90, actionsPerHour: 350, inputs: [], output: { name: "Raw lobster", qty: 1 } },
  { id: "swordfish", label: "Raw swordfish", level: 50, xp: 100, actionsPerHour: 280, inputs: [], output: { name: "Raw swordfish", qty: 1 } },
  { id: "monkfish", label: "Raw monkfish", level: 62, xp: 120, actionsPerHour: 330, inputs: [], output: { name: "Raw monkfish", qty: 1 } },
  { id: "karambwan", label: "Raw karambwan", level: 65, xp: 50, actionsPerHour: 750, inputs: [{ name: "Raw karambwanji", qty: 1 }], output: { name: "Raw karambwan", qty: 1 } },
  { id: "shark", label: "Raw shark", level: 76, xp: 110, actionsPerHour: 300, inputs: [], output: { name: "Raw shark", qty: 1 } },
  { id: "leechfin", label: "Leechfin", level: 78, xp: 33.2, actionsPerHour: 3600, inputs: [], output: null },
  { id: "anglerfish", label: "Raw anglerfish", level: 82, xp: 120, actionsPerHour: 220, inputs: [{ name: "Sandworms", qty: 1 }], output: { name: "Raw anglerfish", qty: 1 } },
  { id: "minnows", label: "Minnows → sharks", level: 82, xp: 26.1, actionsPerHour: 1850, inputs: [], output: { name: "Raw shark", qty: 0.04 } },
  { id: "dark-crab", label: "Raw dark crab", level: 85, xp: 130, actionsPerHour: 308, inputs: [{ name: "Dark fishing bait", qty: 1 }], output: { name: "Raw dark crab", qty: 1 } },
  { id: "sacred-eel", label: "Sacred eel", level: 87, xp: 105, actionsPerHour: 210, inputs: [{ name: "Fishing bait", qty: 1 }], output: null },
  { id: "infernal-eel", label: "Infernal eel", level: 80, xp: 95, actionsPerHour: 330, inputs: [{ name: "Fishing bait", qty: 1 }], output: null },
  { id: "barbarian-fishing", label: "Barbarian fishing (leaping)", level: 58, xp: 70, actionsPerHour: 650, inputs: [{ name: "Feather", qty: 1 }], output: null },
  { id: "drift-net", label: "Drift net fishing", level: 47, xp: 80, actionsPerHour: 1150, inputs: [{ name: "Drift net", qty: 1 }], output: { name: "Raw shark", qty: 0.3 } },
];

export function fishingMethodItemNames(): string[] {
  const names = new Set<string>();
  for (const m of FISHING_METHODS) {
    for (const p of m.inputs) names.add(p.name);
    if (m.output) names.add(m.output.name);
  }
  return [...names];
}
