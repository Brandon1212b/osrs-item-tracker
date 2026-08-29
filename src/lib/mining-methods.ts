/**
 * Mining training methods (P2P).
 * https://oldschool.runescape.wiki/w/Pay-to-play_Mining_training
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
  outputs?: MethodPart[];
};

export const MINING_METHODS: MiningMethod[] = [
  { id: "copper-ore", label: "Copper ore", level: 1, xp: 17.5, actionsPerHour: 900, inputs: [], output: { name: "Copper ore", qty: 1 } },
  { id: "tin-ore", label: "Tin ore", level: 1, xp: 17.5, actionsPerHour: 900, inputs: [], output: { name: "Tin ore", qty: 1 } },
  { id: "iron-ore", label: "Iron ore", level: 15, xp: 35, actionsPerHour: 1600, inputs: [], output: { name: "Iron ore", qty: 1 } },
  { id: "coal", label: "Coal", level: 30, xp: 50, actionsPerHour: 700, inputs: [], output: { name: "Coal", qty: 1 } },
  { id: "gold-ore", label: "Gold ore", level: 40, xp: 65, actionsPerHour: 550, inputs: [], output: { name: "Gold ore", qty: 1 } },
  { id: "mithril-ore", label: "Mithril ore", level: 55, xp: 80, actionsPerHour: 400, inputs: [], output: { name: "Mithril ore", qty: 1 } },
  { id: "adamantite-ore", label: "Adamantite ore", level: 70, xp: 95, actionsPerHour: 280, inputs: [], output: { name: "Adamantite ore", qty: 1 } },
  { id: "runite-ore", label: "Runite ore", level: 85, xp: 125, actionsPerHour: 80, inputs: [], output: { name: "Runite ore", qty: 1 } },
  { id: "sandstone", label: "Sandstone (power-mine)", level: 35, xp: 60, actionsPerHour: 900, inputs: [], output: null },
  { id: "granite", label: "Granite (power-mine)", level: 45, xp: 75, actionsPerHour: 1100, inputs: [], output: null },
  {
    id: "gem-rock",
    label: "Gem rocks",
    level: 40,
    xp: 65,
    actionsPerHour: 850,
    inputs: [],
    output: null,
    outputs: [
      { name: "Uncut opal", qty: 60 / 128 },
      { name: "Uncut jade", qty: 30 / 128 },
      { name: "Uncut red topaz", qty: 15 / 128 },
      { name: "Uncut sapphire", qty: 9 / 128 },
      { name: "Uncut emerald", qty: 5 / 128 },
      { name: "Uncut ruby", qty: 5 / 128 },
      { name: "Uncut diamond", qty: 4 / 128 },
    ],
  },
  { id: "volcanic-ash", label: "Volcanic ash", level: 22, xp: 10, actionsPerHour: 2500, inputs: [], output: { name: "Volcanic ash", qty: 1 } },
  { id: "amethyst", label: "Amethyst", level: 92, xp: 240, actionsPerHour: 95, inputs: [], output: { name: "Amethyst", qty: 1 } },
  { id: "lead-ore-deepfin", label: "Lead ore (Deepfin mine)", level: 25, xp: 40.5, actionsPerHour: 1800, inputs: [], output: { name: "Lead ore", qty: 1 } },
  { id: "granite-3tick", label: "Granite (3-tick)", level: 45, xp: 75, actionsPerHour: 1620, inputs: [], output: null },
  { id: "basalt", label: "Basalt", level: 72, xp: 5, actionsPerHour: 700, inputs: [], output: { name: "Basalt", qty: 1 } },
  { id: "zeah-salts", label: "Kourend salts (Te Salt)", level: 70, xp: 5, actionsPerHour: 3500, inputs: [], output: { name: "Te salt", qty: 1 } },
];

export function miningMethodItemNames(): string[] {
  const names = new Set<string>();
  for (const m of MINING_METHODS) {
    for (const p of m.inputs) names.add(p.name);
    if (m.output) names.add(m.output.name);
    if (m.outputs) for (const p of m.outputs) names.add(p.name);
  }
  return [...names];
}
