/**
 * Herblore training methods (P2P).
 * https://oldschool.runescape.wiki/w/Herblore_training
 * ~2,500 finished potions/h with clean banking.
 */
export type MethodPart = { name: string; qty: number };

export type HerbloreMethod = {
  id: string;
  label: string;
  level: number;
  xp: number;
  actionsPerHour: number;
  inputs: MethodPart[];
  output: MethodPart;
};

const POTION_APH = 2500;

export const HERBLORE_METHODS: HerbloreMethod[] = [
  {
    id: "prayer-potion",
    label: "Prayer potion(3)",
    level: 38,
    xp: 87.5,
    actionsPerHour: POTION_APH,
    inputs: [
      { name: "Ranarr potion (unf)", qty: 1 },
      { name: "Snape grass", qty: 1 },
    ],
    output: { name: "Prayer potion(3)", qty: 1 },
  },
  {
    id: "super-attack",
    label: "Super attack(3)",
    level: 45,
    xp: 100,
    actionsPerHour: POTION_APH,
    inputs: [
      { name: "Irit potion (unf)", qty: 1 },
      { name: "Eye of newt", qty: 1 },
    ],
    output: { name: "Super attack(3)", qty: 1 },
  },
  {
    id: "super-strength",
    label: "Super strength(3)",
    level: 55,
    xp: 125,
    actionsPerHour: POTION_APH,
    inputs: [
      { name: "Kwuarm potion (unf)", qty: 1 },
      { name: "Limpwurt root", qty: 1 },
    ],
    output: { name: "Super strength(3)", qty: 1 },
  },
  {
    id: "super-defence",
    label: "Super defence(3)",
    level: 66,
    xp: 150,
    actionsPerHour: POTION_APH,
    inputs: [
      { name: "Cadantine potion (unf)", qty: 1 },
      { name: "White berries", qty: 1 },
    ],
    output: { name: "Super defence(3)", qty: 1 },
  },
  {
    id: "super-restore",
    label: "Super restore(3)",
    level: 63,
    xp: 142.5,
    actionsPerHour: POTION_APH,
    inputs: [
      { name: "Snapdragon potion (unf)", qty: 1 },
      { name: "Red spiders' eggs", qty: 1 },
    ],
    output: { name: "Super restore(3)", qty: 1 },
  },
  {
    id: "ranging-potion",
    label: "Ranging potion(3)",
    level: 72,
    xp: 162.5,
    actionsPerHour: POTION_APH,
    inputs: [
      { name: "Dwarf weed potion (unf)", qty: 1 },
      { name: "Wine of zamorak", qty: 1 },
    ],
    output: { name: "Ranging potion(3)", qty: 1 },
  },
  {
    id: "magic-potion",
    label: "Magic potion(3)",
    level: 76,
    xp: 172.5,
    actionsPerHour: POTION_APH,
    inputs: [
      { name: "Lantadyme potion (unf)", qty: 1 },
      { name: "Potato cactus", qty: 1 },
    ],
    output: { name: "Magic potion(3)", qty: 1 },
  },
  {
    id: "saradomin-brew",
    label: "Saradomin brew(3)",
    level: 81,
    xp: 180,
    actionsPerHour: POTION_APH,
    inputs: [
      { name: "Toadflax potion (unf)", qty: 1 },
      { name: "Crushed nest", qty: 1 },
    ],
    output: { name: "Saradomin brew(3)", qty: 1 },
  },
  {
    id: "super-combat",
    label: "Super combat potion(4)",
    level: 90,
    xp: 150,
    actionsPerHour: 2000,
    inputs: [
      { name: "Torstol potion (unf)", qty: 1 },
      { name: "Super attack(4)", qty: 1 },
      { name: "Super strength(4)", qty: 1 },
      { name: "Super defence(4)", qty: 1 },
    ],
    output: { name: "Super combat potion(4)", qty: 1 },
  },
  {
    id: "clean-ranarr",
    label: "Clean ranarr weed",
    level: 25,
    xp: 7.5,
    actionsPerHour: 5000,
    inputs: [{ name: "Grimy ranarr weed", qty: 1 }],
    output: { name: "Ranarr weed", qty: 1 },
  },
];

export function herbloreMethodItemNames(): string[] {
  const names = new Set<string>();
  for (const m of HERBLORE_METHODS) {
    for (const p of m.inputs) names.add(p.name);
    names.add(m.output.name);
  }
  return [...names];
}
