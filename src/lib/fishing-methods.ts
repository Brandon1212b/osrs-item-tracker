/**
 * Fishing training methods (P2P).
 * https://oldschool.runescape.wiki/w/Pay-to-play_Fishing_training
 * Rates are typical focused / low-effort unless noted (not max 2/3-tick).
 * Tempoross excluded — activity multi-output rewards.
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
  {
    id: "shrimp",
    label: "Raw shrimps",
    level: 1,
    xp: 10,
    actionsPerHour: 400,
    inputs: [],
    output: { name: "Raw shrimps", qty: 1 },
  },
  {
    id: "trout",
    label: "Raw trout (fly)",
    level: 20,
    xp: 50,
    actionsPerHour: 500, // powerfishing mid rates
    inputs: [{ name: "Feather", qty: 1 }],
    output: { name: "Raw trout", qty: 1 },
  },
  {
    id: "salmon",
    label: "Raw salmon (fly)",
    level: 30,
    xp: 70,
    actionsPerHour: 450,
    inputs: [{ name: "Feather", qty: 1 }],
    output: { name: "Raw salmon", qty: 1 },
  },
  {
    id: "lobster",
    label: "Raw lobster",
    level: 40,
    xp: 90,
    actionsPerHour: 350,
    inputs: [],
    output: { name: "Raw lobster", qty: 1 },
  },
  {
    id: "swordfish",
    label: "Raw swordfish",
    level: 50,
    xp: 100,
    actionsPerHour: 280,
    inputs: [],
    output: { name: "Raw swordfish", qty: 1 },
  },
  {
    id: "monkfish",
    label: "Raw monkfish",
    level: 62,
    xp: 120,
    actionsPerHour: 320, // ~38k xp/hr
    inputs: [],
    output: { name: "Raw monkfish", qty: 1 },
  },
  {
    id: "karambwan",
    label: "Raw karambwan",
    level: 65,
    xp: 50,
    actionsPerHour: 750, // ~37k with barrel/banking
    inputs: [{ name: "Raw karambwanji", qty: 1 }],
    output: { name: "Raw karambwan", qty: 1 },
  },
  {
    id: "shark",
    label: "Raw shark",
    level: 76,
    xp: 110,
    actionsPerHour: 300,
    inputs: [],
    output: { name: "Raw shark", qty: 1 },
  },
  // Leechfin — high-intensity method after The Blood Moon Rises.
  // ~100–130k Fishing XP/hr at full focus (33.2 XP per successful catch).
  // Can also yield blood sacs / vials of blood when cut.
  {
    id: "leechfin",
    label: "Leechfin",
    level: 78,
    xp: 33.2,
    actionsPerHour: 3500, // ~116k XP/hr focused high-intensity
    inputs: [],
    output: null, // primarily XP; optional cut for blood sacs
  },
  {
    id: "anglerfish",
    label: "Raw anglerfish",
    level: 82,
    xp: 120,
    actionsPerHour: 200, // ~24k base; higher with diabolic worms
    inputs: [{ name: "Sandworms", qty: 1 }],
    output: { name: "Raw anglerfish", qty: 1 },
  },
  {
    id: "minnows",
    label: "Minnows → sharks",
    level: 82,
    xp: 26.1,
    actionsPerHour: 1800, // ~47k xp/hr mid; converts to sharks
    inputs: [],
    output: { name: "Raw shark", qty: 0.04 }, // ~1 shark / 25 minnows approx; rough
  },
  {
    id: "dark-crab",
    label: "Raw dark crab",
    level: 85,
    xp: 130,
    actionsPerHour: 280,
    inputs: [{ name: "Dark fishing bait", qty: 1 }],
    output: { name: "Raw dark crab", qty: 1 },
  },
  {
    id: "sacred-eel",
    label: "Sacred eel",
    level: 87,
    xp: 105,
    actionsPerHour: 200,
    inputs: [{ name: "Fishing bait", qty: 1 }],
    output: null, // dissected for scales
  },
  {
    id: "infernal-eel",
    label: "Infernal eel",
    level: 80,
    xp: 95,
    actionsPerHour: 320,
    inputs: [{ name: "Fishing bait", qty: 1 }],
    output: null, // smashed for loot
  },
  // Barbarian fishing — leaping fish are not standard GE raw fish in the same way;
  // model as pure XP with feather cost for comparison.
  {
    id: "barbarian-fishing",
    label: "Barbarian fishing (leaping)",
    level: 58,
    xp: 70, // leaping salmon typical
    actionsPerHour: 650, // ~45k AFK mid levels
    inputs: [{ name: "Feather", qty: 1 }],
    output: null,
  },
  // Drift net fishing (Fossil Island underwater) — dual Fishing + Hunter.
  // Models the Fishing side; strong mid-game rates (~70–100k Fishing XP/hr depending on level).
  // Requires 47 Fishing, 44 Hunter, drift nets, and underwater access.
  {
    id: "drift-net",
    label: "Drift net fishing",
    level: 47,
    xp: 80, // approximate average XP per shoal catch (scales with level)
    actionsPerHour: 950, // ~76k Fishing XP/hr mid; higher at 90+
    inputs: [{ name: "Drift net", qty: 1 }],
    output: { name: "Raw shark", qty: 0.3 }, // rough mix of lobster→manta; GE proxy
  },
];

export function fishingMethodItemNames(): string[] {
  const names = new Set<string>();
  for (const m of FISHING_METHODS) {
    for (const p of m.inputs) names.add(p.name);
    if (m.output) names.add(m.output.name);
  }
  return [...names];
}
