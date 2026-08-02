/**
 * Fletching training methods (P2P).
 * https://oldschool.runescape.wiki/w/Fletching_training
 */
export type MethodPart = { name: string; qty: number };

export type FletchingMethod = {
  id: string;
  label: string;
  level: number;
  xp: number;
  actionsPerHour: number;
  inputs: MethodPart[];
  output: MethodPart;
};

export const FLETCHING_METHODS: FletchingMethod[] = [
  {
    id: "maple-longbow-u",
    label: "Maple longbow (u)",
    level: 55,
    xp: 58.3,
    actionsPerHour: 1800,
    inputs: [{ name: "Maple logs", qty: 1 }],
    output: { name: "Maple longbow (u)", qty: 1 },
  },
  {
    id: "maple-longbow",
    label: "String maple longbow",
    level: 55,
    xp: 58.3,
    actionsPerHour: 2700,
    inputs: [
      { name: "Maple longbow (u)", qty: 1 },
      { name: "Bow string", qty: 1 },
    ],
    output: { name: "Maple longbow", qty: 1 },
  },
  {
    id: "yew-longbow-u",
    label: "Yew longbow (u)",
    level: 70,
    xp: 75,
    actionsPerHour: 1800,
    inputs: [{ name: "Yew logs", qty: 1 }],
    output: { name: "Yew longbow (u)", qty: 1 },
  },
  {
    id: "yew-longbow",
    label: "String yew longbow",
    level: 70,
    xp: 75,
    actionsPerHour: 2700,
    inputs: [
      { name: "Yew longbow (u)", qty: 1 },
      { name: "Bow string", qty: 1 },
    ],
    output: { name: "Yew longbow", qty: 1 },
  },
  {
    id: "magic-longbow-u",
    label: "Magic longbow (u)",
    level: 85,
    xp: 91.5,
    actionsPerHour: 1800,
    inputs: [{ name: "Magic logs", qty: 1 }],
    output: { name: "Magic longbow (u)", qty: 1 },
  },
  {
    id: "magic-longbow",
    label: "String magic longbow",
    level: 85,
    xp: 91.5,
    actionsPerHour: 2700,
    inputs: [
      { name: "Magic longbow (u)", qty: 1 },
      { name: "Bow string", qty: 1 },
    ],
    output: { name: "Magic longbow", qty: 1 },
  },
  {
    id: "broad-arrows",
    label: "Broad arrows",
    level: 52,
    xp: 10,
    actionsPerHour: 3000,
    inputs: [
      { name: "Broad arrowheads", qty: 15 },
      { name: "Headless arrow", qty: 15 },
    ],
    output: { name: "Broad arrows", qty: 15 },
  },
  {
    id: "amethyst-arrows",
    label: "Amethyst arrows",
    level: 82,
    xp: 10.6,
    actionsPerHour: 3000,
    inputs: [
      { name: "Amethyst arrowtips", qty: 15 },
      { name: "Headless arrow", qty: 15 },
    ],
    output: { name: "Amethyst arrow", qty: 15 },
  },
  {
    id: "dragon-darts",
    label: "Dragon darts",
    level: 95,
    xp: 25,
    actionsPerHour: 3500,
    inputs: [
      { name: "Dragon dart tip", qty: 10 },
      { name: "Feather", qty: 10 },
    ],
    output: { name: "Dragon dart", qty: 10 },
  },
];

export function fletchingMethodItemNames(): string[] {
  const names = new Set<string>();
  for (const m of FLETCHING_METHODS) {
    for (const p of m.inputs) names.add(p.name);
    names.add(m.output.name);
  }
  return [...names];
}
