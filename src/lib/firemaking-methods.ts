/**
 * Firemaking training methods (P2P).
 * https://oldschool.runescape.wiki/w/Pay-to-play_Firemaking_training
 * https://oldschool.runescape.wiki/w/Forester%27s_Campfire
 *
 * Line burning: wiki assumes 1,485 logs/hr.
 * Forester's campfire: same XP per log as a ground fire, but slower —
 * 665 logs/hr AFK / 975 logs/hr if you tend immediately. We use 975
 * (focused, not 1-tick).
 * Making pyre logs: 5 FM XP per sacred-oil dose; ~1,470/hr without 1-tick.
 */
export type MethodPart = { name: string; qty: number };

export type FiremakingMethod = {
  id: string;
  label: string;
  level: number;
  xp: number;
  actionsPerHour: number;
  inputs: MethodPart[];
  output: MethodPart | null;
};

const LINE_BURN_PER_HOUR = 1485;
const CAMPFIRE_TEND_PER_HOUR = 975;
const PYRE_MAKE_PER_HOUR = 1470;

export const FIREMAKING_METHODS: FiremakingMethod[] = [
  { id: "burn-logs", label: "Burn logs", level: 1, xp: 40, actionsPerHour: LINE_BURN_PER_HOUR, inputs: [{ name: "Logs", qty: 1 }], output: null },
  { id: "burn-oak", label: "Burn oak logs", level: 15, xp: 60, actionsPerHour: LINE_BURN_PER_HOUR, inputs: [{ name: "Oak logs", qty: 1 }], output: null },
  { id: "burn-willow", label: "Burn willow logs", level: 30, xp: 90, actionsPerHour: LINE_BURN_PER_HOUR, inputs: [{ name: "Willow logs", qty: 1 }], output: null },
  { id: "burn-teak", label: "Burn teak logs", level: 35, xp: 105, actionsPerHour: LINE_BURN_PER_HOUR, inputs: [{ name: "Teak logs", qty: 1 }], output: null },
  { id: "burn-maple", label: "Burn maple logs", level: 45, xp: 135, actionsPerHour: LINE_BURN_PER_HOUR, inputs: [{ name: "Maple logs", qty: 1 }], output: null },
  { id: "burn-mahogany", label: "Burn mahogany logs", level: 50, xp: 157.5, actionsPerHour: LINE_BURN_PER_HOUR, inputs: [{ name: "Mahogany logs", qty: 1 }], output: null },
  { id: "burn-yew", label: "Burn yew logs", level: 60, xp: 202.5, actionsPerHour: LINE_BURN_PER_HOUR, inputs: [{ name: "Yew logs", qty: 1 }], output: null },
  { id: "burn-magic", label: "Burn magic logs", level: 75, xp: 303.8, actionsPerHour: LINE_BURN_PER_HOUR, inputs: [{ name: "Magic logs", qty: 1 }], output: null },
  { id: "burn-ironwood", label: "Burn ironwood logs", level: 80, xp: 220.5, actionsPerHour: LINE_BURN_PER_HOUR, inputs: [{ name: "Ironwood logs", qty: 1 }], output: null },
  { id: "burn-redwood", label: "Burn redwood logs", level: 90, xp: 350, actionsPerHour: LINE_BURN_PER_HOUR, inputs: [{ name: "Redwood logs", qty: 1 }], output: null },
  { id: "burn-rosewood", label: "Burn rosewood logs", level: 92, xp: 268, actionsPerHour: LINE_BURN_PER_HOUR, inputs: [{ name: "Rosewood logs", qty: 1 }], output: null },
  { id: "campfire-yew", label: "Campfire (yew)", level: 60, xp: 202.5, actionsPerHour: CAMPFIRE_TEND_PER_HOUR, inputs: [{ name: "Yew logs", qty: 1 }], output: null },
  { id: "campfire-magic", label: "Campfire (magic)", level: 75, xp: 303.8, actionsPerHour: CAMPFIRE_TEND_PER_HOUR, inputs: [{ name: "Magic logs", qty: 1 }], output: null },
  { id: "campfire-ironwood", label: "Campfire (ironwood)", level: 80, xp: 220.5, actionsPerHour: CAMPFIRE_TEND_PER_HOUR, inputs: [{ name: "Ironwood logs", qty: 1 }], output: null },
  { id: "campfire-redwood", label: "Campfire (redwood)", level: 90, xp: 350, actionsPerHour: CAMPFIRE_TEND_PER_HOUR, inputs: [{ name: "Redwood logs", qty: 1 }], output: null },
  { id: "campfire-rosewood", label: "Campfire (rosewood)", level: 92, xp: 268, actionsPerHour: CAMPFIRE_TEND_PER_HOUR, inputs: [{ name: "Rosewood logs", qty: 1 }], output: null },
  {
    id: "redwood-pyre",
    label: "Make redwood pyre logs",
    level: 95,
    xp: 20, // 5 XP per sacred-oil dose × 4 doses
    actionsPerHour: PYRE_MAKE_PER_HOUR,
    inputs: [
      { name: "Redwood logs", qty: 1 },
      { name: "Sacred oil(4)", qty: 0.25 },
    ],
    output: { name: "Redwood pyre logs", qty: 1 },
  },
];

export function firemakingMethodItemNames(): string[] {
  const names = new Set<string>();
  for (const m of FIREMAKING_METHODS) {
    for (const p of m.inputs) names.add(p.name);
    if (m.output) names.add(m.output.name);
  }
  return [...names];
}
