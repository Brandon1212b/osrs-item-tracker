/**
 * Woodcutting recipe methods (P2P).
 * Teak + sulliusceps + several trees live in woodcutting-activities.ts.
 * https://oldschool.runescape.wiki/w/Pay-to-play_Woodcutting_training
 */
export type MethodPart = { name: string; qty: number };

export type WoodcuttingMethod = {
  id: string;
  label: string;
  level: number;
  xp: number;
  actionsPerHour: number;
  inputs: MethodPart[];
  output: MethodPart | null;
};

export const WOODCUTTING_METHODS: WoodcuttingMethod[] = [
  { id: "logs", label: "Logs", level: 1, xp: 25, actionsPerHour: 800, inputs: [], output: { name: "Logs", qty: 1 } },
  { id: "oak-logs", label: "Oak logs", level: 15, xp: 37.5, actionsPerHour: 900, inputs: [], output: { name: "Oak logs", qty: 1 } },
  { id: "willow-logs", label: "Willow logs", level: 30, xp: 67.5, actionsPerHour: 700, inputs: [], output: { name: "Willow logs", qty: 1 } },
  { id: "maple-logs", label: "Maple logs", level: 45, xp: 100, actionsPerHour: 500, inputs: [], output: { name: "Maple logs", qty: 1 } },
  { id: "mahogany-logs", label: "Mahogany logs", level: 50, xp: 125, actionsPerHour: 450, inputs: [], output: { name: "Mahogany logs", qty: 1 } },
  { id: "yew-logs", label: "Yew logs", level: 60, xp: 175, actionsPerHour: 280, inputs: [], output: { name: "Yew logs", qty: 1 } },
  { id: "camphor-logs", label: "Camphor logs", level: 66, xp: 143, actionsPerHour: 450, inputs: [], output: { name: "Camphor logs", qty: 1 } },
  { id: "magic-logs", label: "Magic logs", level: 75, xp: 250, actionsPerHour: 130, inputs: [], output: { name: "Magic logs", qty: 1 } },
  { id: "engorged-bloodwood", label: "Engorged bloodwood tree", level: 77, xp: 165, actionsPerHour: 430, inputs: [], output: null },
  {
    id: "infected-roots",
    label: "Chop infected roots (demon tears)",
    level: 80,
    xp: 13,
    actionsPerHour: 700,
    inputs: [],
    output: { name: "Demon tear", qty: 1 },
  },
];

export function woodcuttingMethodItemNames(): string[] {
  const names = new Set<string>(["Teak logs", "Blisterwood logs", "Ironwood logs", "Redwood logs", "Rosewood logs"]);
  for (const m of WOODCUTTING_METHODS) {
    for (const p of m.inputs) names.add(p.name);
    if (m.output) names.add(m.output.name);
  }
  return [...names];
}
