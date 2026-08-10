/**
 * Farming methods — herb runs + major tree / fruit / hardwood / specialty runs.
 * Yields are approximate averages from wiki farm runs / training pages (2026).
 * Tree & fruit methods use low APH because growth is time-gated; score still
 * compares opportunity cost usefully for run planning.
 * https://oldschool.runescape.wiki/w/Farming
 */
export type MethodPart = { name: string; qty: number };

export type FarmingMethod = {
  id: string;
  label: string;
  level: number;
  xp: number;
  actionsPerHour: number;
  inputs: MethodPart[];
  output: MethodPart;
};

const HERB_APH = 50; // patches per focused hour of runs
const TREE_APH = 6; // realistic full tree run throughput
const FRUIT_APH = 6;
const HARDWOOD_APH = 4;
const SPECIAL_APH = 8;

export const FARMING_METHODS: FarmingMethod[] = [
  // ── Herb runs (existing + expanded) ──────────────────────────────────────
  {
    id: "ranarr-herbs",
    label: "Ranarr weeds (herb run)",
    level: 32,
    xp: 30.5,
    actionsPerHour: HERB_APH,
    inputs: [{ name: "Ranarr seed", qty: 1 }],
    output: { name: "Grimy ranarr weed", qty: 7 },
  },
  {
    id: "toadflax-herbs",
    label: "Toadflax (herb run)",
    level: 38,
    xp: 38.5,
    actionsPerHour: HERB_APH,
    inputs: [{ name: "Toadflax seed", qty: 1 }],
    output: { name: "Grimy toadflax", qty: 7 },
  },
  {
    id: "irit-herbs",
    label: "Irit (herb run)",
    level: 44,
    xp: 43,
    actionsPerHour: HERB_APH,
    inputs: [{ name: "Irit seed", qty: 1 }],
    output: { name: "Grimy irit leaf", qty: 7 },
  },
  {
    id: "avantoe-herbs",
    label: "Avantoe (herb run)",
    level: 50,
    xp: 48.5,
    actionsPerHour: HERB_APH,
    inputs: [{ name: "Avantoe seed", qty: 1 }],
    output: { name: "Grimy avantoe", qty: 7 },
  },
  {
    id: "kwuarm-herbs",
    label: "Kwuarm (herb run)",
    level: 56,
    xp: 48,
    actionsPerHour: HERB_APH,
    inputs: [{ name: "Kwuarm seed", qty: 1 }],
    output: { name: "Grimy kwuarm", qty: 7 },
  },
  {
    id: "snapdragon-herbs",
    label: "Snapdragon (herb run)",
    level: 62,
    xp: 48.5,
    actionsPerHour: HERB_APH,
    inputs: [{ name: "Snapdragon seed", qty: 1 }],
    output: { name: "Grimy snapdragon", qty: 7 },
  },
  {
    id: "cadantine-herbs",
    label: "Cadantine (herb run)",
    level: 67,
    xp: 54,
    actionsPerHour: HERB_APH,
    inputs: [{ name: "Cadantine seed", qty: 1 }],
    output: { name: "Grimy cadantine", qty: 7 },
  },
  {
    id: "lantadyme-herbs",
    label: "Lantadyme (herb run)",
    level: 73,
    xp: 54.5,
    actionsPerHour: HERB_APH,
    inputs: [{ name: "Lantadyme seed", qty: 1 }],
    output: { name: "Grimy lantadyme", qty: 7 },
  },
  {
    id: "dwarf-weed-herbs",
    label: "Dwarf weed (herb run)",
    level: 79,
    xp: 57,
    actionsPerHour: HERB_APH,
    inputs: [{ name: "Dwarf weed seed", qty: 1 }],
    output: { name: "Grimy dwarf weed", qty: 7 },
  },
  {
    id: "torstol-herbs",
    label: "Torstol (herb run)",
    level: 85,
    xp: 61,
    actionsPerHour: HERB_APH,
    inputs: [{ name: "Torstol seed", qty: 1 }],
    output: { name: "Grimy torstol", qty: 7 },
  },

  // ── Trees ────────────────────────────────────────────────────────────────
  {
    id: "oak-tree",
    label: "Oak tree",
    level: 15,
    xp: 467.5,
    actionsPerHour: TREE_APH,
    inputs: [{ name: "Acorn", qty: 1 }],
    output: { name: "Oak logs", qty: 1 }, // nominal; real value is XP
  },
  {
    id: "willow-tree",
    label: "Willow tree",
    level: 30,
    xp: 1481.5,
    actionsPerHour: TREE_APH,
    inputs: [{ name: "Willow seed", qty: 1 }],
    output: { name: "Willow logs", qty: 1 },
  },
  {
    id: "maple-tree",
    label: "Maple tree",
    level: 45,
    xp: 3403.1,
    actionsPerHour: TREE_APH,
    inputs: [{ name: "Maple seed", qty: 1 }],
    output: { name: "Maple logs", qty: 1 },
  },
  {
    id: "yew-tree",
    label: "Yew tree",
    level: 60,
    xp: 7150.9,
    actionsPerHour: TREE_APH,
    inputs: [{ name: "Yew seed", qty: 1 }],
    output: { name: "Yew logs", qty: 1 },
  },
  {
    id: "magic-tree",
    label: "Magic tree",
    level: 75,
    xp: 13768.3,
    actionsPerHour: TREE_APH,
    inputs: [{ name: "Magic seed", qty: 1 }],
    output: { name: "Magic logs", qty: 1 },
  },
  {
    id: "redwood-tree",
    label: "Redwood tree",
    level: 90,
    xp: 22450,
    actionsPerHour: 2,
    inputs: [{ name: "Redwood tree seed", qty: 1 }],
    output: { name: "Redwood logs", qty: 1 },
  },

  // ── Fruit trees ──────────────────────────────────────────────────────────
  {
    id: "apple-tree",
    label: "Apple tree",
    level: 27,
    xp: 1272.5,
    actionsPerHour: FRUIT_APH,
    inputs: [{ name: "Apple tree seed", qty: 1 }],
    output: { name: "Cooking apple", qty: 6 },
  },
  {
    id: "banana-tree",
    label: "Banana tree",
    level: 33,
    xp: 1841.5,
    actionsPerHour: FRUIT_APH,
    inputs: [{ name: "Banana tree seed", qty: 1 }],
    output: { name: "Banana", qty: 6 },
  },
  {
    id: "orange-tree",
    label: "Orange tree",
    level: 39,
    xp: 2505.7,
    actionsPerHour: FRUIT_APH,
    inputs: [{ name: "Orange tree seed", qty: 1 }],
    output: { name: "Orange", qty: 6 },
  },
  {
    id: "curry-tree",
    label: "Curry tree",
    level: 42,
    xp: 3036.9,
    actionsPerHour: FRUIT_APH,
    inputs: [{ name: "Curry tree seed", qty: 1 }],
    output: { name: "Curry leaf", qty: 6 },
  },
  {
    id: "pineapple-tree",
    label: "Pineapple tree",
    level: 51,
    xp: 4791.7,
    actionsPerHour: FRUIT_APH,
    inputs: [{ name: "Pineapple seed", qty: 1 }],
    output: { name: "Pineapple", qty: 6 },
  },
  {
    id: "papaya-tree",
    label: "Papaya tree",
    level: 57,
    xp: 6146.4,
    actionsPerHour: FRUIT_APH,
    inputs: [{ name: "Papaya tree seed", qty: 1 }],
    output: { name: "Papaya fruit", qty: 6 },
  },
  {
    id: "palm-tree",
    label: "Palm tree",
    level: 68,
    xp: 10509.6,
    actionsPerHour: FRUIT_APH,
    inputs: [{ name: "Palm tree seed", qty: 1 }],
    output: { name: "Coconut", qty: 6 },
  },
  {
    id: "dragonfruit-tree",
    label: "Dragonfruit tree",
    level: 81,
    xp: 17825,
    actionsPerHour: FRUIT_APH,
    inputs: [{ name: "Dragonfruit tree seed", qty: 1 }],
    output: { name: "Dragonfruit", qty: 6 },
  },

  // ── Hardwood ─────────────────────────────────────────────────────────────
  {
    id: "teak-tree",
    label: "Teak tree",
    level: 35,
    xp: 7291,
    actionsPerHour: HARDWOOD_APH,
    inputs: [{ name: "Teak seed", qty: 1 }],
    output: { name: "Teak logs", qty: 1 },
  },
  {
    id: "mahogany-tree",
    label: "Mahogany tree",
    level: 55,
    xp: 15720,
    actionsPerHour: HARDWOOD_APH,
    inputs: [{ name: "Mahogany seed", qty: 1 }],
    output: { name: "Mahogany logs", qty: 1 },
  },

  // ── Specialty ────────────────────────────────────────────────────────────
  {
    id: "calquat",
    label: "Calquat tree",
    level: 72,
    xp: 12516.5,
    actionsPerHour: SPECIAL_APH,
    inputs: [{ name: "Calquat tree seed", qty: 1 }],
    output: { name: "Calquat fruit", qty: 6 },
  },
  {
    id: "celastrus",
    label: "Celastrus tree",
    level: 85,
    xp: 14134,
    actionsPerHour: SPECIAL_APH,
    inputs: [{ name: "Celastrus seed", qty: 1 }],
    output: { name: "Celastrus bark", qty: 6 },
  },
  {
    id: "giant-seaweed",
    label: "Giant seaweed",
    level: 23,
    xp: 21,
    actionsPerHour: 40,
    inputs: [{ name: "Seaweed spore", qty: 1 }],
    output: { name: "Giant seaweed", qty: 3 },
  },
  {
    id: "cactus",
    label: "Cactus spines",
    level: 55,
    xp: 374,
    actionsPerHour: SPECIAL_APH,
    inputs: [{ name: "Cactus seed", qty: 1 }],
    output: { name: "Cactus spine", qty: 3 },
  },
];

export function farmingMethodItemNames(): string[] {
  const names = new Set<string>();
  for (const m of FARMING_METHODS) {
    for (const p of m.inputs) names.add(p.name);
    names.add(m.output.name);
  }
  return [...names];
}
