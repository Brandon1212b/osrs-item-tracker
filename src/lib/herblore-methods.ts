/**
 * Herblore training methods (P2P).
 * Rates from https://oldschool.runescape.wiki/w/Herblore_training
 */
export type MethodPart = {
  name: string;
  qty: number;
  isSecondary?: boolean;
};

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
const STAMINA_APH = 2750;
const SUPER_COMBAT_APH = 2166;
const GUTHIX_APH = 1400;
const CLEAN_APH = 10_000;
const DEGRIME_HERBS = 27;
const DEGRIME_CASTS_PER_HOUR = 600;

const HERBS: [string, string, number, number][] = [
  ["Grimy guam leaf", "Guam leaf", 3, 2.5],
  ["Grimy marrentill", "Marrentill", 5, 3.8],
  ["Grimy tarromin", "Tarromin", 11, 5],
  ["Grimy harralander", "Harralander", 20, 6.3],
  ["Grimy ranarr weed", "Ranarr weed", 25, 7.5],
  ["Grimy toadflax", "Toadflax", 30, 8],
  ["Grimy irit leaf", "Irit leaf", 40, 8.8],
  ["Grimy avantoe", "Avantoe", 48, 10],
  ["Grimy kwuarm", "Kwuarm", 54, 11.3],
  ["Grimy huasca", "Huasca", 58, 11.8],
  ["Grimy snapdragon", "Snapdragon", 59, 11.8],
  ["Grimy cadantine", "Cadantine", 65, 12.5],
  ["Grimy lantadyme", "Lantadyme", 67, 13.1],
  ["Grimy dwarf weed", "Dwarf weed", 70, 13.8],
  ["Grimy torstol", "Torstol", 75, 15],
];

function manualCleanMethods(): HerbloreMethod[] {
  return HERBS.map(([grimy, clean, level, xp]) => ({
    id: `clean-${clean.toLowerCase().replace(/ /g, "-")}`,
    label: `Clean ${clean}`,
    level,
    xp,
    actionsPerHour: CLEAN_APH,
    inputs: [{ name: grimy, qty: 1 }],
    output: { name: clean, qty: 1 },
  }));
}

function degrimeMethods(): HerbloreMethod[] {
  return HERBS.map(([grimy, clean, level, xp]) => ({
    id: `degrime-${clean.toLowerCase().replace(/ /g, "-")}`,
    label: `Degrime ${clean}`,
    level,
    xp: (xp / 2) * DEGRIME_HERBS,
    actionsPerHour: DEGRIME_CASTS_PER_HOUR,
    inputs: [
      { name: grimy, qty: DEGRIME_HERBS },
      { name: "Law rune", qty: 4 },
    ],
    output: { name: clean, qty: DEGRIME_HERBS },
  }));
}

export const HERBLORE_METHODS: HerbloreMethod[] = [
  {
    id: "guthix-rest",
    label: "Guthix rest(3)",
    level: 18,
    xp: 59,
    actionsPerHour: GUTHIX_APH,
    inputs: [
      { name: "Cup of hot water", qty: 1 },
      { name: "Guam leaf", qty: 2 },
      { name: "Marrentill", qty: 1 },
      { name: "Harralander", qty: 1 },
    ],
    output: { name: "Guthix rest(3)", qty: 1 },
  },
  {
    id: "prayer-potion",
    label: "Prayer potion(3)",
    level: 38,
    xp: 87.5,
    actionsPerHour: POTION_APH,
    inputs: [
      { name: "Ranarr potion (unf)", qty: 1 },
      { name: "Snape grass", qty: 1, isSecondary: true },
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
      { name: "Eye of newt", qty: 1, isSecondary: true },
    ],
    output: { name: "Super attack(3)", qty: 1 },
  },
  {
    id: "super-energy",
    label: "Super energy(3)",
    level: 52,
    xp: 117.5,
    actionsPerHour: POTION_APH,
    inputs: [
      { name: "Avantoe potion (unf)", qty: 1 },
      { name: "Mort myre fungus", qty: 1, isSecondary: true },
    ],
    output: { name: "Super energy(3)", qty: 1 },
  },
  {
    id: "super-strength",
    label: "Super strength(3)",
    level: 55,
    xp: 125,
    actionsPerHour: POTION_APH,
    inputs: [
      { name: "Kwuarm potion (unf)", qty: 1 },
      { name: "Limpwurt root", qty: 1, isSecondary: true },
    ],
    output: { name: "Super strength(3)", qty: 1 },
  },
  {
    id: "super-restore",
    label: "Super restore(3)",
    level: 63,
    xp: 142.5,
    actionsPerHour: POTION_APH,
    inputs: [
      { name: "Snapdragon potion (unf)", qty: 1 },
      { name: "Red spiders' eggs", qty: 1, isSecondary: true },
    ],
    output: { name: "Super restore(3)", qty: 1 },
  },
  {
    id: "super-defence",
    label: "Super defence(3)",
    level: 66,
    xp: 150,
    actionsPerHour: POTION_APH,
    inputs: [
      { name: "Cadantine potion (unf)", qty: 1 },
      { name: "White berries", qty: 1, isSecondary: true },
    ],
    output: { name: "Super defence(3)", qty: 1 },
  },
  {
    id: "ranging-potion",
    label: "Ranging potion(3)",
    level: 72,
    xp: 162.5,
    actionsPerHour: POTION_APH,
    inputs: [
      { name: "Dwarf weed potion (unf)", qty: 1 },
      { name: "Wine of zamorak", qty: 1, isSecondary: true },
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
      { name: "Potato cactus", qty: 1, isSecondary: true },
    ],
    output: { name: "Magic potion(3)", qty: 1 },
  },
  {
    id: "stamina-potion",
    label: "Stamina potion(4)",
    level: 77,
    xp: 102,
    actionsPerHour: STAMINA_APH,
    inputs: [
      { name: "Super energy(4)", qty: 1 },
      { name: "Amylase crystal", qty: 4, isSecondary: true },
    ],
    output: { name: "Stamina potion(4)", qty: 1 },
  },
  {
    id: "saradomin-brew",
    label: "Saradomin brew(3)",
    level: 81,
    xp: 180,
    actionsPerHour: POTION_APH,
    inputs: [
      { name: "Toadflax potion (unf)", qty: 1 },
      { name: "Crushed nest", qty: 1, isSecondary: true },
    ],
    output: { name: "Saradomin brew(3)", qty: 1 },
  },
  {
    id: "armadyl-brew",
    label: "Armadyl brew(3)",
    level: 89,
    xp: 205,
    actionsPerHour: POTION_APH,
    inputs: [
      { name: "Umbral potion (unf)", qty: 1 },
      { name: "Rainbow crab paste", qty: 1, isSecondary: true },
    ],
    output: { name: "Armadyl brew(3)", qty: 1 },
  },
  {
    id: "super-combat",
    label: "Super combat potion(4)",
    level: 90,
    xp: 150,
    actionsPerHour: SUPER_COMBAT_APH,
    inputs: [
      { name: "Torstol potion (unf)", qty: 1 },
      { name: "Super attack(4)", qty: 1, isSecondary: true },
      { name: "Super strength(4)", qty: 1, isSecondary: true },
      { name: "Super defence(4)", qty: 1, isSecondary: true },
    ],
    output: { name: "Super combat potion(4)", qty: 1 },
  },
  {
    id: "divine-super-combat",
    label: "Divine super combat potion(4)",
    level: 97,
    xp: 2,
    actionsPerHour: 2500,
    inputs: [
      { name: "Super combat potion(4)", qty: 1 },
      { name: "Crystal dust", qty: 1, isSecondary: true },
    ],
    output: { name: "Divine super combat potion(4)", qty: 1 },
  },
  {
    id: "divine-bastion",
    label: "Divine bastion potion(4)",
    level: 86,
    xp: 2,
    actionsPerHour: 2500,
    inputs: [
      { name: "Bastion potion(4)", qty: 1 },
      { name: "Crystal dust", qty: 1, isSecondary: true },
    ],
    output: { name: "Divine bastion potion(4)", qty: 1 },
  },
  {
    id: "divine-battlemage",
    label: "Divine battlemage potion(4)",
    level: 86,
    xp: 2,
    actionsPerHour: 2500,
    inputs: [
      { name: "Battlemage potion(4)", qty: 1 },
      { name: "Crystal dust", qty: 1, isSecondary: true },
    ],
    output: { name: "Divine battlemage potion(4)", qty: 1 },
  },
  {
    id: "divine-ranging",
    label: "Divine ranging potion(4)",
    level: 74,
    xp: 2,
    actionsPerHour: 2500,
    inputs: [
      { name: "Ranging potion(4)", qty: 1 },
      { name: "Crystal dust", qty: 1, isSecondary: true },
    ],
    output: { name: "Divine ranging potion(4)", qty: 1 },
  },
  {
    id: "divine-magic",
    label: "Divine magic potion(4)",
    level: 78,
    xp: 2,
    actionsPerHour: 2500,
    inputs: [
      { name: "Magic potion(4)", qty: 1 },
      { name: "Crystal dust", qty: 1, isSecondary: true },
    ],
    output: { name: "Divine magic potion(4)", qty: 1 },
  },
  ...manualCleanMethods(),
  ...degrimeMethods(),
];

export function herbloreMethodItemNames(): string[] {
  const names = new Set<string>();
  for (const m of HERBLORE_METHODS) {
    for (const p of m.inputs) names.add(p.name);
    names.add(m.output.name);
  }
  names.add("Amulet of chemistry");
  return [...names];
}
