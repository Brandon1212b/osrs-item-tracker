/**
 * Mining training methods (P2P).
 * https://oldschool.runescape.wiki/w/Pay-to-play_Mining_training
 * Rates are typical focused (not theoretical max 3-tick unless noted).
 * Activity methods (Motherlode, Volcanic Mine, Blast Mine) live in activity-methods.ts.
 */
export type MethodPart = { name: string; qty: number };

export type MiningMethod = {
  id: string;
  label: string;
  level: number;
  xp: number;
  actionsPerHour: number;
  inputs: MethodPart[];
  output: MethodPart | null;
};

export const MINING_METHODS: MiningMethod[] = [
  // ── Early ores ──────────────────────────────────────────────────────────
  {
    id: "copper-ore",
    label: "Copper ore",
    level: 1,
    xp: 17.5,
    actionsPerHour: 900,
    inputs: [],
    output: { name: "Copper ore", qty: 1 },
  },
  {
    id: "tin-ore",
    label: "Tin ore",
    level: 1,
    xp: 17.5,
    actionsPerHour: 900,
    inputs: [],
    output: { name: "Tin ore", qty: 1 },
  },
  {
    id: "iron-ore",
    label: "Iron ore",
    level: 15,
    xp: 35,
    actionsPerHour: 1600, // ~56k xp/hr mid; higher in Mining Guild
    inputs: [],
    output: { name: "Iron ore", qty: 1 },
  },
  {
    id: "coal",
    label: "Coal",
    level: 30,
    xp: 50,
    actionsPerHour: 700,
    inputs: [],
    output: { name: "Coal", qty: 1 },
  },
  {
    id: "gold-ore",
    label: "Gold ore",
    level: 40,
    xp: 65,
    actionsPerHour: 550,
    inputs: [],
    output: { name: "Gold ore", qty: 1 },
  },
  {
    id: "mithril-ore",
    label: "Mithril ore",
    level: 55,
    xp: 80,
    actionsPerHour: 400,
    inputs: [],
    output: { name: "Mithril ore", qty: 1 },
  },
  {
    id: "adamantite-ore",
    label: "Adamantite ore",
    level: 70,
    xp: 95,
    actionsPerHour: 280,
    inputs: [],
    output: { name: "Adamantite ore", qty: 1 },
  },
  {
    id: "runite-ore",
    label: "Runite ore",
    level: 85,
    xp: 125,
    actionsPerHour: 80, // sparse rocks; focused banking runs
    inputs: [],
    output: { name: "Runite ore", qty: 1 },
  },

  // ── Specialty ───────────────────────────────────────────────────────────
  {
    id: "sandstone",
    label: "Sandstone",
    level: 35,
    xp: 60, // average across sizes
    actionsPerHour: 900,
    inputs: [],
    output: { name: "Sandstone (10kg)", qty: 1 },
  },
  {
    id: "granite",
    label: "Granite (power-mine)",
    level: 45,
    xp: 75, // 5kg granite typical
    actionsPerHour: 1100, // focused non-3tick; 3-tick much higher
    inputs: [],
    output: null, // usually dropped
  },
  {
    id: "gem-rock",
    label: "Gem rocks",
    level: 40,
    xp: 65,
    actionsPerHour: 700,
    inputs: [],
    output: null, // random uncut gems — not a fixed GE output
  },
  {
    id: "volcanic-ash",
    label: "Volcanic ash",
    level: 22,
    xp: 10,
    actionsPerHour: 2500,
    inputs: [],
    output: { name: "Volcanic ash", qty: 1 },
  },
  {
    id: "amethyst",
    label: "Amethyst",
    level: 92,
    xp: 240,
    actionsPerHour: 95, // ~22–25k xp/hr low intensity
    inputs: [],
    output: { name: "Amethyst", qty: 1 },
  },
];

export function miningMethodItemNames(): string[] {
  const names = new Set<string>();
  for (const m of MINING_METHODS) {
    for (const p of m.inputs) names.add(p.name);
    if (m.output) names.add(m.output.name);
  }
  return [...names];
}
