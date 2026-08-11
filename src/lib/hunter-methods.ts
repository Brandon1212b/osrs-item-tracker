/**
 * Hunter production methods (simple input→output / multi-output).
 * Complex activities (Herbiboar) live in activity-methods.ts.
 *
 * Birdhouse runs use effective rates (active-time XP/h from the wiki table).
 * Clockwork is returned on dismantle — never consumed.
 * Nest EV uses Bird nest (empty) as the tradeable proxy (most common nest type).
 *
 * Sources: oldschool.runescape.wiki Bird house trapping + chin MMGs + Hunter training (2026).
 */
export type MethodPart = { name: string; qty: number };

export type HunterMethod = {
  id: string;
  label: string;
  level: number;
  xp: number;
  actionsPerHour: number;
  inputs: MethodPart[];
  output: MethodPart | null;
  /** Expected outputs per action (fractional qty). Prefer over single output. */
  outputs?: MethodPart[];
};

/**
 * Expected nests per birdhouse scales with Hunter level + house tier.
 * Magic @99 ≈ 9.94 nests/run → ~2.485/house.
 * Empty nests dominate the nest table (~65%); ring/egg/seed are opened for value.
 * We model tradeable Bird nest (empty) at ~60–70% of expected nests + feathers.
 * Feathers ~45 always per house (raw bird meat omitted — low value).
 */
function birdhouseOutputs(expectedNestsPerHouse: number): MethodPart[] {
  return [
    { name: "Feather", qty: 45 },
    // ~65% of nest rolls are empty nests (GE tradeable / crushable)
    { name: "Bird nest (empty)", qty: Math.round(expectedNestsPerHouse * 0.65 * 100) / 100 },
  ];
}

export const HUNTER_METHODS: HunterMethod[] = [
  // ── Chinchompas ──────────────────────────────────────────────────────────
  {
    id: "grey-chins",
    label: "Grey chinchompas",
    level: 53,
    xp: 198.4,
    actionsPerHour: 225,
    inputs: [],
    output: { name: "Chinchompa", qty: 1 },
  },
  {
    id: "red-chins",
    label: "Red chinchompas",
    level: 63,
    xp: 265,
    actionsPerHour: 400, // focused mid-high; up to ~500+ at 80+
    inputs: [],
    output: { name: "Red chinchompa", qty: 1 },
  },
  {
    id: "black-chins",
    label: "Black chinchompas",
    level: 73,
    xp: 315,
    actionsPerHour: 350, // wilderness risk; focused
    inputs: [],
    output: { name: "Black chinchompa", qty: 1 },
  },

  // ── Box traps / salamanders ──────────────────────────────────────────────
  {
    id: "red-salamander",
    label: "Red salamander",
    level: 59,
    xp: 272,
    actionsPerHour: 280,
    inputs: [],
    output: { name: "Red salamander", qty: 1 },
  },
  {
    id: "black-salamander",
    label: "Black salamander",
    level: 67,
    xp: 319.5,
    actionsPerHour: 260,
    inputs: [],
    output: { name: "Black salamander", qty: 1 },
  },
  {
    id: "tecu-salamander",
    label: "Tecu salamander",
    level: 79,
    xp: 224,
    actionsPerHour: 300,
    inputs: [],
    output: { name: "Tecu salamander", qty: 1 },
  },

  // ── Pitfall (antelopes) ──────────────────────────────────────────────────
  // Strong money-makers; 100% catch on moonlight once lured.
  {
    id: "sunlight-antelope",
    label: "Sunlight antelope",
    level: 72,
    xp: 375,
    actionsPerHour: 220,
    inputs: [],
    output: { name: "Sunlight antelope antler", qty: 1 },
  },
  {
    id: "moonlight-antelope",
    label: "Moonlight antelope",
    level: 91,
    xp: 400,
    actionsPerHour: 250, // 200–300 catches/hr realistic; high GP from antlers
    inputs: [],
    output: { name: "Moonlight antelope antler", qty: 1 },
  },

  // ── Birdhouse runs (effective rates) ─────────────────────────────────────
  // Clockwork is always returned — only logs consumed (+ cheap seeds ignored).
  // actionsPerHour ≈ effective houses/h from wiki (active-time equivalent).
  // xp = Hunter XP per single house.
  {
    id: "birdhouse-oak",
    label: "Birdhouse runs (Oak, effective)",
    level: 14,
    xp: 105, // 420 / 4
    actionsPerHour: 34, // effective ~3,600 xp/h → 3600/105
    inputs: [{ name: "Oak logs", qty: 1 }],
    output: null,
    outputs: birdhouseOutputs(0.8),
  },
  {
    id: "birdhouse-willow",
    label: "Birdhouse runs (Willow, effective)",
    level: 24,
    xp: 140, // 560 / 4
    actionsPerHour: 32, // ~4,500 xp/h
    inputs: [{ name: "Willow logs", qty: 1 }],
    output: null,
    outputs: birdhouseOutputs(1.0),
  },
  {
    id: "birdhouse-teak",
    label: "Birdhouse runs (Teak, effective)",
    level: 34,
    xp: 175, // 700 / 4
    actionsPerHour: 31, // ~5,400 xp/h
    inputs: [{ name: "Teak logs", qty: 1 }],
    output: null,
    outputs: birdhouseOutputs(1.2),
  },
  {
    id: "birdhouse-maple",
    label: "Birdhouse runs (Maple, effective)",
    level: 44,
    xp: 205, // 820 / 4
    actionsPerHour: 31, // ~6,300 xp/h
    inputs: [{ name: "Maple logs", qty: 1 }],
    output: null,
    outputs: birdhouseOutputs(1.4),
  },
  {
    id: "birdhouse-mahogany",
    label: "Birdhouse runs (Mahogany, effective)",
    level: 49,
    xp: 240, // 960 / 4
    actionsPerHour: 30, // ~7,200 xp/h
    inputs: [{ name: "Mahogany logs", qty: 1 }],
    output: null,
    outputs: birdhouseOutputs(1.6),
  },
  {
    id: "birdhouse-yew",
    label: "Birdhouse runs (Yew, effective)",
    level: 59,
    xp: 255, // 1,020 / 4
    actionsPerHour: 32, // ~8,100 xp/h
    inputs: [{ name: "Yew logs", qty: 1 }],
    output: null,
    outputs: birdhouseOutputs(1.9),
  },
  {
    id: "birdhouse-magic",
    label: "Birdhouse runs (Magic, effective)",
    level: 74,
    xp: 285, // 1,140 / 4
    actionsPerHour: 32, // ~9,000 xp/h
    inputs: [{ name: "Magic logs", qty: 1 }],
    output: null,
    // Magic @74 ≈ 7.37 nests/run → ~1.84/house; @99 ≈ 2.49
    outputs: birdhouseOutputs(2.2),
  },
  {
    id: "birdhouse-redwood",
    label: "Birdhouse runs (Redwood, effective)",
    level: 89,
    xp: 300, // 1,200 / 4
    actionsPerHour: 33, // ~9,900 xp/h
    inputs: [{ name: "Redwood logs", qty: 1 }],
    output: null,
    // Redwood @89 ≈ 9.8 nests/run → ~2.45/house
    outputs: birdhouseOutputs(2.5),
  },
];

export function hunterMethodItemNames(): string[] {
  const names = new Set<string>();
  for (const m of HUNTER_METHODS) {
    for (const p of m.inputs) names.add(p.name);
    if (m.output) names.add(m.output.name);
    if (m.outputs) for (const p of m.outputs) names.add(p.name);
  }
  return [...names].filter((n) => n !== "Coins");
}
