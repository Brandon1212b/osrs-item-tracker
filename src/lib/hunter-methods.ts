/**
 * Hunter production methods (simple input→output / multi-output).
 * Complex activities (Herbiboar) live in activity-methods.ts.
 *
 * Birdhouses use effective rates (XP/h for active time spent on runs).
 * Chin rates are focused box-trap catches; refine with live playtesting.
 *
 * Sources: oldschool.runescape.wiki Hunter training + money-making guides (2026).
 */
export type MethodPart = { name: string; qty: number };

export type HunterMethod = {
  id: string;
  label: string;
  level: number;
  xp: number;
  actionsPerHour: number;
  inputs: MethodPart[];
  /** Single primary output (legacy). Prefer `outputs` for multi-loot. */
  output: MethodPart | null;
  /** Expected outputs per action (fractional qty allowed). Takes precedence over `output`. */
  outputs?: MethodPart[];
};

/**
 * Production list.
 * Birdhouse "actions" are individual houses; actionsPerHour uses effective
 * active-time rates from the wiki table (not wall-clock passive time).
 */
export const HUNTER_METHODS: HunterMethod[] = [
  // ── Chinchompas ─────────────────────────────────────────────────────────
  {
    id: "grey-chins",
    label: "Grey chinchompas",
    level: 53,
    xp: 198.4,
    actionsPerHour: 225, // wiki ~225 focused
    inputs: [],
    output: { name: "Chinchompa", qty: 1 },
  },
  {
    id: "red-chins",
    label: "Red chinchompas",
    level: 63,
    xp: 265,
    actionsPerHour: 400, // ~400 at 80; higher with good spots / horn
    inputs: [],
    output: { name: "Red chinchompa", qty: 1 },
  },
  {
    id: "black-chins",
    label: "Black chinchompas",
    level: 73,
    xp: 315,
    actionsPerHour: 280, // wilderness; lower intensity / risk
    inputs: [],
    output: { name: "Black chinchompa", qty: 1 },
  },

  // ── Birdhouses (effective rates) ────────────────────────────────────────
  // XP and actionsPerHour are effective (active time only).
  // One run = 4 houses; wiki effective Hunter XP/h assumes continuous runs.
  // Nested loot is variable — nests/seeds not modelled as fixed GE output yet.
  {
    id: "birdhouse-oak",
    label: "Birdhouse runs (Oak)",
    level: 14,
    xp: 80, // per house (320 per run of 4)
    actionsPerHour: 45, // ~effective from wiki table active time
    inputs: [
      { name: "Oak logs", qty: 1 },
      { name: "Clockwork", qty: 1 },
      // cheap seeds omitted (negligible)
    ],
    output: null, // nests / feathers / bird meat — multi-loot later
  },
  {
    id: "birdhouse-willow",
    label: "Birdhouse runs (Willow)",
    level: 24,
    xp: 100,
    actionsPerHour: 45,
    inputs: [
      { name: "Willow logs", qty: 1 },
      { name: "Clockwork", qty: 1 },
    ],
    output: null,
  },
  {
    id: "birdhouse-teak",
    label: "Birdhouse runs (Teak)",
    level: 34,
    xp: 120,
    actionsPerHour: 45,
    inputs: [
      { name: "Teak logs", qty: 1 },
      { name: "Clockwork", qty: 1 },
    ],
    output: null,
  },
  {
    id: "birdhouse-maple",
    label: "Birdhouse runs (Maple)",
    level: 44,
    xp: 140,
    actionsPerHour: 45,
    inputs: [
      { name: "Maple logs", qty: 1 },
      { name: "Clockwork", qty: 1 },
    ],
    output: null,
  },
  {
    id: "birdhouse-mahogany",
    label: "Birdhouse runs (Mahogany)",
    level: 49,
    xp: 160,
    actionsPerHour: 45,
    inputs: [
      { name: "Mahogany logs", qty: 1 },
      { name: "Clockwork", qty: 1 },
    ],
    output: null,
  },
  {
    id: "birdhouse-yew",
    label: "Birdhouse runs (Yew)",
    level: 59,
    xp: 180,
    actionsPerHour: 45,
    inputs: [
      { name: "Yew logs", qty: 1 },
      { name: "Clockwork", qty: 1 },
    ],
    output: null,
  },
  {
    id: "birdhouse-magic",
    label: "Birdhouse runs (Magic)",
    level: 74,
    xp: 200,
    actionsPerHour: 45,
    inputs: [
      { name: "Magic logs", qty: 1 },
      { name: "Clockwork", qty: 1 },
    ],
    output: null,
  },
  {
    id: "birdhouse-redwood",
    label: "Birdhouse runs (Redwood)",
    level: 89,
    xp: 220,
    actionsPerHour: 45, // effective ~9.9k Hunter XP/h active
    inputs: [
      { name: "Redwood logs", qty: 1 },
      { name: "Clockwork", qty: 1 },
    ],
    output: null,
  },
];

export function hunterMethodItemNames(): string[] {
  const names = new Set<string>();
  for (const m of HUNTER_METHODS) {
    for (const p of m.inputs) names.add(p.name);
    if (m.output) names.add(m.output.name);
    if (m.outputs) for (const p of m.outputs) names.add(p.name);
  }
  return [...names];
}
