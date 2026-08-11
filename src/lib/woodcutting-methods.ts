/**
 * Woodcutting training methods (P2P).
 * https://oldschool.runescape.wiki/w/Pay-to-play_Woodcutting_training
 * Rates are typical focused / low-effort unless noted (not max 1.5/2-tick).
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
  {
    id: "logs",
    label: "Logs",
    level: 1,
    xp: 25,
    actionsPerHour: 800,
    inputs: [],
    output: { name: "Logs", qty: 1 },
  },
  {
    id: "oak-logs",
    label: "Oak logs",
    level: 15,
    xp: 37.5,
    actionsPerHour: 900,
    inputs: [],
    output: { name: "Oak logs", qty: 1 },
  },
  {
    id: "willow-logs",
    label: "Willow logs",
    level: 30,
    xp: 67.5,
    actionsPerHour: 700,
    inputs: [],
    output: { name: "Willow logs", qty: 1 },
  },
  {
    id: "teak-logs",
    label: "Teak logs",
    level: 35,
    xp: 85,
    actionsPerHour: 900, // focused non-tick; 2-tick much higher
    inputs: [],
    output: { name: "Teak logs", qty: 1 },
  },
  {
    id: "maple-logs",
    label: "Maple logs",
    level: 45,
    xp: 100,
    actionsPerHour: 500,
    inputs: [],
    output: { name: "Maple logs", qty: 1 },
  },
  {
    id: "mahogany-logs",
    label: "Mahogany logs",
    level: 50,
    xp: 125,
    actionsPerHour: 450,
    inputs: [],
    output: { name: "Mahogany logs", qty: 1 },
  },
  {
    id: "yew-logs",
    label: "Yew logs",
    level: 60,
    xp: 175,
    actionsPerHour: 280,
    inputs: [],
    output: { name: "Yew logs", qty: 1 },
  },
  {
    id: "blisterwood",
    label: "Blisterwood logs",
    level: 62,
    xp: 76,
    actionsPerHour: 900, // ~68k mid; higher with crystal axe
    inputs: [],
    output: { name: "Blisterwood logs", qty: 1 },
  },
  {
    id: "sulliusceps",
    label: "Sulliusceps",
    level: 65,
    xp: 127,
    actionsPerHour: 700, // ~89k at high level focused
    inputs: [],
    output: null, // usually chopped for XP; fungi not primary GE model
  },
  {
    id: "camphor-logs",
    label: "Camphor logs",
    level: 66,
    xp: 143,
    actionsPerHour: 450,
    inputs: [],
    output: { name: "Camphor logs", qty: 1 },
  },
  {
    id: "magic-logs",
    label: "Magic logs",
    level: 75,
    xp: 250,
    actionsPerHour: 180,
    inputs: [],
    output: { name: "Magic logs", qty: 1 },
  },
  // Bloodwood trees (Vampyrium) — The Blood Moon Rises required.
  // High-intensity 2-tick method; XP is awarded on successful chops / full tree.
  // ~90–100 buckets of bloodwood sap/hr; 130–210k+ XP/hr with felling axes.
  {
    id: "bloodwood",
    label: "Bloodwood trees",
    level: 77,
    xp: 1364, // XP for fully processing a tree (sap collection)
    actionsPerHour: 140, // ~190k XP/hr focused (higher with crystal felling axe)
    inputs: [{ name: "Bucket", qty: 1 }],
    output: { name: "Bucket of bloodwood sap", qty: 1 },
  },
  // Engorged bloodwood — lower intensity alternative, still profitable via sap.
  // ~65–70k XP/hr, ~20–22 buckets/hr.
  {
    id: "engorged-bloodwood",
    label: "Engorged bloodwood tree",
    level: 77,
    xp: 165,
    actionsPerHour: 420, // ~69k XP/hr focused
    inputs: [{ name: "Bucket", qty: 1 }],
    output: { name: "Bucket of bloodwood sap", qty: 1 },
  },
  {
    id: "ironwood-logs",
    label: "Ironwood logs",
    level: 80,
    xp: 175,
    actionsPerHour: 450, // ~79k AFK mid
    inputs: [],
    output: { name: "Ironwood logs", qty: 1 },
  },
  {
    id: "redwood-logs",
    label: "Redwood logs",
    level: 90,
    xp: 380,
    actionsPerHour: 180, // ~68k AFK drop
    inputs: [],
    output: { name: "Redwood logs", qty: 1 },
  },
  {
    id: "rosewood-logs",
    label: "Rosewood logs",
    level: 92,
    xp: 212.5,
    actionsPerHour: 400,
    inputs: [],
    output: { name: "Rosewood logs", qty: 1 },
  },
];

export function woodcuttingMethodItemNames(): string[] {
  const names = new Set<string>();
  for (const m of WOODCUTTING_METHODS) {
    for (const p of m.inputs) names.add(p.name);
    if (m.output) names.add(m.output.name);
  }
  return [...names];
}
