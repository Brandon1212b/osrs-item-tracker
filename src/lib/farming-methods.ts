/**
 * Farming methods — modelled as focused herb harvest actions.
 * Yields are approximate averages from wiki farm runs.
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

const HERB_APH = 50;

export const FARMING_METHODS: FarmingMethod[] = [
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
    id: "snapdragon-herbs",
    label: "Snapdragon (herb run)",
    level: 62,
    xp: 48.5,
    actionsPerHour: HERB_APH,
    inputs: [{ name: "Snapdragon seed", qty: 1 }],
    output: { name: "Grimy snapdragon", qty: 7 },
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
    id: "kwuarm-herbs",
    label: "Kwuarm (herb run)",
    level: 56,
    xp: 48,
    actionsPerHour: HERB_APH,
    inputs: [{ name: "Kwuarm seed", qty: 1 }],
    output: { name: "Grimy kwuarm", qty: 7 },
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
];

export function farmingMethodItemNames(): string[] {
  const names = new Set<string>();
  for (const m of FARMING_METHODS) {
    for (const p of m.inputs) names.add(p.name);
    names.add(m.output.name);
  }
  return [...names];
}
