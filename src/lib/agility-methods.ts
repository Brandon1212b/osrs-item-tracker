/**
 * Agility methods with supply costs.
 * XP rates are focused rooftop / course rates from wiki training pages.
 * Outputs are null (XP training); cost is supplies + opportunity cost.
 */
export type MethodPart = { name: string; qty: number };

export type AgilityMethod = {
  id: string;
  label: string;
  level: number;
  xp: number;
  actionsPerHour: number;
  inputs: MethodPart[];
  output: MethodPart | null;
};

export const AGILITY_METHODS: AgilityMethod[] = [
  {
    id: "ardougne-rooftop",
    label: "Ardougne rooftop",
    level: 90,
    xp: 793,
    actionsPerHour: 70,
    inputs: [],
    output: null,
  },
  {
    id: "relekka-rooftop",
    label: "Rellekka rooftop",
    level: 80,
    xp: 780,
    actionsPerHour: 65,
    inputs: [],
    output: null,
  },
  {
    id: "seers-rooftop",
    label: "Seers' Village rooftop",
    level: 60,
    xp: 570,
    actionsPerHour: 75,
    inputs: [],
    output: null,
  },
  {
    id: "falador-rooftop",
    label: "Falador rooftop",
    level: 50,
    xp: 440,
    actionsPerHour: 75,
    inputs: [],
    output: null,
  },
  {
    id: "canifis-rooftop",
    label: "Canifis rooftop",
    level: 40,
    xp: 240,
    actionsPerHour: 90,
    inputs: [],
    output: null,
  },
  {
    id: "hallowed-sepulchre",
    label: "Hallowed Sepulchre (floor 5)",
    level: 92,
    xp: 42000,
    actionsPerHour: 5,
    inputs: [{ name: "Stamina potion(4)", qty: 2 }],
    output: null,
  },
];

export function agilityMethodItemNames(): string[] {
  const names = new Set<string>();
  for (const m of AGILITY_METHODS) {
    for (const p of m.inputs) names.add(p.name);
    if (m.output) names.add(m.output.name);
  }
  return [...names];
}
