/**
 * Firemaking training methods (P2P).
 * https://oldschool.runescape.wiki/w/Pay-to-play_Firemaking_training
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

const LOGS_PER_HOUR = 1485;

export const FIREMAKING_METHODS: FiremakingMethod[] = [
  { id: "burn-logs", label: "Burn logs", level: 1, xp: 40, actionsPerHour: LOGS_PER_HOUR, inputs: [{ name: "Logs", qty: 1 }], output: null },
  { id: "burn-oak", label: "Burn oak logs", level: 15, xp: 60, actionsPerHour: LOGS_PER_HOUR, inputs: [{ name: "Oak logs", qty: 1 }], output: null },
  { id: "burn-willow", label: "Burn willow logs", level: 30, xp: 90, actionsPerHour: LOGS_PER_HOUR, inputs: [{ name: "Willow logs", qty: 1 }], output: null },
  { id: "burn-teak", label: "Burn teak logs", level: 35, xp: 105, actionsPerHour: LOGS_PER_HOUR, inputs: [{ name: "Teak logs", qty: 1 }], output: null },
  { id: "burn-maple", label: "Burn maple logs", level: 45, xp: 135, actionsPerHour: LOGS_PER_HOUR, inputs: [{ name: "Maple logs", qty: 1 }], output: null },
  { id: "burn-mahogany", label: "Burn mahogany logs", level: 50, xp: 157.5, actionsPerHour: LOGS_PER_HOUR, inputs: [{ name: "Mahogany logs", qty: 1 }], output: null },
  { id: "burn-yew", label: "Burn yew logs", level: 60, xp: 202.5, actionsPerHour: LOGS_PER_HOUR, inputs: [{ name: "Yew logs", qty: 1 }], output: null },
  { id: "burn-magic", label: "Burn magic logs", level: 75, xp: 303.8, actionsPerHour: LOGS_PER_HOUR, inputs: [{ name: "Magic logs", qty: 1 }], output: null },
  { id: "burn-redwood", label: "Burn redwood logs", level: 90, xp: 350, actionsPerHour: LOGS_PER_HOUR, inputs: [{ name: "Redwood logs", qty: 1 }], output: null },
  { id: "burn-rosewood", label: "Burn rosewood logs", level: 92, xp: 350, actionsPerHour: LOGS_PER_HOUR, inputs: [{ name: "Rosewood logs", qty: 1 }], output: null },
  { id: "campfire-yew", label: "Bonfire / campfire (yew)", level: 60, xp: 222.8, actionsPerHour: 1485, inputs: [{ name: "Yew logs", qty: 1 }], output: null },
  { id: "campfire-magic", label: "Bonfire / campfire (magic)", level: 75, xp: 334.2, actionsPerHour: 1485, inputs: [{ name: "Magic logs", qty: 1 }], output: null },
  { id: "campfire-redwood", label: "Bonfire / campfire (redwood)", level: 90, xp: 385, actionsPerHour: 1485, inputs: [{ name: "Redwood logs", qty: 1 }], output: null },
];

export function firemakingMethodItemNames(): string[] {
  const names = new Set<string>();
  for (const m of FIREMAKING_METHODS) {
    for (const p of m.inputs) names.add(p.name);
    if (m.output) names.add(m.output.name);
  }
  return [...names];
}
