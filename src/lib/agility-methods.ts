/**
 * Agility methods with supply costs.
 * XP rates are focused rooftop / course rates from current OSRS Wiki training pages (2026).
 * Outputs are null (XP training); cost is supplies + opportunity cost.
 * Sources: oldschool.runescape.wiki Agility training / individual course pages.
 * Rates are typical focused rates (not theoretical tick-perfect max).
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
    id: "varrock-rooftop",
    label: "Varrock rooftop",
    level: 30,
    xp: 270,
    actionsPerHour: 52,
    inputs: [],
    output: null,
  },
  {
    id: "canifis-rooftop",
    label: "Canifis rooftop",
    level: 40,
    xp: 240,
    actionsPerHour: 70,
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
    id: "seers-rooftop",
    label: "Seers' Village rooftop",
    level: 60,
    xp: 570,
    actionsPerHour: 80,
    inputs: [],
    output: null,
  },
  {
    id: "pollnivneach-rooftop",
    label: "Pollnivneach rooftop",
    level: 70,
    xp: 890,
    actionsPerHour: 60,
    inputs: [],
    output: null,
  },
  {
    id: "relekka-rooftop",
    label: "Rellekka rooftop",
    level: 80,
    xp: 780,
    actionsPerHour: 70,
    inputs: [],
    output: null,
  },
  {
    id: "ardougne-rooftop",
    label: "Ardougne rooftop",
    level: 90,
    xp: 889,
    actionsPerHour: 78,
    inputs: [],
    output: null,
  },
  {
    id: "colossal-wyrm-basic",
    label: "Colossal Wyrm (basic)",
    level: 50,
    xp: 504,
    actionsPerHour: 61,
    inputs: [],
    output: null,
  },
  {
    id: "colossal-wyrm-advanced",
    label: "Colossal Wyrm (advanced)",
    level: 62,
    xp: 750,
    actionsPerHour: 57,
    inputs: [],
    output: null,
  },
  {
    id: "wilderness-agility",
    label: "Wilderness Agility Course",
    level: 52,
    xp: 571,
    actionsPerHour: 85,
    inputs: [],
    output: null,
  },
  {
    id: "werewolf",
    label: "Werewolf Agility Course",
    level: 60,
    xp: 730,
    actionsPerHour: 90,
    inputs: [],
    output: null,
  },
  {
    id: "prifddinas",
    label: "Prifddinas Agility Course",
    level: 75,
    xp: 1340,
    actionsPerHour: 48,
    inputs: [],
    output: null,
  },
  {
    id: "ape-atoll",
    label: "Ape Atoll Agility Course",
    level: 48,
    xp: 580,
    actionsPerHour: 90,
    inputs: [],
    output: null,
  },
  {
    id: "dorgesh-kaan",
    label: "Dorgesh-Kaan Agility Course",
    level: 70,
    xp: 2375,
    actionsPerHour: 25,
    inputs: [],
    output: null,
  },
  {
    id: "hallowed-sepulchre",
    label: "Hallowed Sepulchre (floor 5)",
    level: 92,
    xp: 11700,
    actionsPerHour: 8,
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
