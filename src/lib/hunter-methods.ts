/**
 * Hunter production methods (simple input→output / multi-output).
 * Complex activities (Herbiboar) live in activity-methods.ts.
 *
 * Birdhouse runs use effective rates (active-time XP/h from the wiki table).
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
  outputs?: MethodPart[];
};

function birdhouseOutputs(expectedNestsPerHouse: number): MethodPart[] {
  return [
    { name: "Feather", qty: 45 },
    { name: "Bird nest (empty)", qty: Math.round(expectedNestsPerHouse * 0.65 * 100) / 100 },
  ];
}

export const HUNTER_METHODS: HunterMethod[] = [
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
    actionsPerHour: 400,
    inputs: [],
    output: { name: "Red chinchompa", qty: 1 },
  },
  {
    id: "black-chins",
    label: "Black chinchompas",
    level: 73,
    xp: 315,
    actionsPerHour: 350,
    inputs: [],
    output: { name: "Black chinchompa", qty: 1 },
  },
  {
    id: "spotted-kebbit",
    label: "Falconry — Spotted kebbit",
    level: 43,
    xp: 104,
    actionsPerHour: 480,
    inputs: [],
    output: null,
  },
  {
    id: "dark-kebbit",
    label: "Falconry — Dark kebbit",
    level: 57,
    xp: 132,
    actionsPerHour: 480,
    inputs: [],
    output: null,
  },
  {
    id: "dashing-kebbit",
    label: "Falconry — Dashing kebbit",
    level: 69,
    xp: 156,
    actionsPerHour: 450,
    inputs: [],
    output: null,
  },
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
    xp: 344,
    actionsPerHour: 380,
    inputs: [],
    output: null,
    outputs: [
      { name: "Immature tecu salamander", qty: 0.999 },
      { name: "Tecu salamander", qty: 0.001 },
    ],
  },
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
    actionsPerHour: 250,
    inputs: [],
    output: { name: "Moonlight antelope antler", qty: 1 },
  },
  {
    id: "birdhouse-oak",
    label: "Birdhouse runs (Oak, effective)",
    level: 14,
    xp: 105,
    actionsPerHour: 34,
    inputs: [{ name: "Oak logs", qty: 1 }],
    output: null,
    outputs: birdhouseOutputs(0.8),
  },
  {
    id: "birdhouse-willow",
    label: "Birdhouse runs (Willow, effective)",
    level: 24,
    xp: 140,
    actionsPerHour: 32,
    inputs: [{ name: "Willow logs", qty: 1 }],
    output: null,
    outputs: birdhouseOutputs(1.0),
  },
  {
    id: "birdhouse-teak",
    label: "Birdhouse runs (Teak, effective)",
    level: 34,
    xp: 175,
    actionsPerHour: 31,
    inputs: [{ name: "Teak logs", qty: 1 }],
    output: null,
    outputs: birdhouseOutputs(1.2),
  },
  {
    id: "birdhouse-maple",
    label: "Birdhouse runs (Maple, effective)",
    level: 44,
    xp: 205,
    actionsPerHour: 31,
    inputs: [{ name: "Maple logs", qty: 1 }],
    output: null,
    outputs: birdhouseOutputs(1.4),
  },
  {
    id: "birdhouse-mahogany",
    label: "Birdhouse runs (Mahogany, effective)",
    level: 49,
    xp: 240,
    actionsPerHour: 30,
    inputs: [{ name: "Mahogany logs", qty: 1 }],
    output: null,
    outputs: birdhouseOutputs(1.6),
  },
  {
    id: "birdhouse-yew",
    label: "Birdhouse runs (Yew, effective)",
    level: 59,
    xp: 255,
    actionsPerHour: 32,
    inputs: [{ name: "Yew logs", qty: 1 }],
    output: null,
    outputs: birdhouseOutputs(1.9),
  },
  {
    id: "birdhouse-magic",
    label: "Birdhouse runs (Magic, effective)",
    level: 74,
    xp: 285,
    actionsPerHour: 32,
    inputs: [{ name: "Magic logs", qty: 1 }],
    output: null,
    outputs: birdhouseOutputs(2.2),
  },
  {
    id: "birdhouse-redwood",
    label: "Birdhouse runs (Redwood, effective)",
    level: 89,
    xp: 300,
    actionsPerHour: 33,
    inputs: [{ name: "Redwood logs", qty: 1 }],
    output: null,
    outputs: birdhouseOutputs(2.5),
  },
  {
    id: "snowy-knights",
    label: "Snowy knights",
    level: 35,
    xp: 44,
    actionsPerHour: 504,
    inputs: [{ name: "Butterfly jar", qty: 1 }],
    output: { name: "Snowy knight (item)", qty: 1 },
  },
  {
    id: "pyre-foxes",
    label: "Pyre foxes",
    level: 57,
    xp: 222,
    actionsPerHour: 180,
    inputs: [],
    output: null,
    outputs: [
      { name: "Fox fur", qty: 1 },
      { name: "Raw pyre fox", qty: 1 },
    ],
  },
  {
    id: "rainbow-crabs",
    label: "Rainbow crabs",
    level: 65,
    xp: 180,
    actionsPerHour: 220,
    inputs: [],
    output: { name: "Rainbow crab meat", qty: 1 },
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
