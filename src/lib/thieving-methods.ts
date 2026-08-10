/**
 * Thieving training methods (P2P).
 * https://oldschool.runescape.wiki/w/Pay-to-play_Thieving_training
 *
 * Multi-loot methods use `outputs` with expected qty per action
 * (fractional allowed). Coins are special-cased at 1 gp in the panel.
 * Sources: wiki Drop Rate Project + money-making guides (2026).
 */
export type MethodPart = { name: string; qty: number };

export type ThievingMethod = {
  id: string;
  label: string;
  level: number;
  xp: number;
  actionsPerHour: number;
  inputs: MethodPart[];
  output: MethodPart | null;
  /** Expected outputs per action (fractional qty). Prefer over single output. */
  outputs?: MethodPart[];
};

/**
 * Expected loot per Rogues' Castle chest — Medium Wilderness Diary.
 * Rarities from wiki Drop Rate Project (n/66 table).
 * Average value ~4,648 (live GE).
 */
const ROGUES_MEDIUM_OUTPUTS: MethodPart[] = [
  { name: "Nature rune", qty: 40 * (11 / 66) },
  { name: "Red spiders' eggs", qty: 6 * (10 / 66) },
  { name: "Law rune", qty: 40 * (10 / 66) },
  { name: "Coal", qty: 20 * (8 / 66) },
  { name: "Coins", qty: 4500 * (6 / 66) },
  { name: "Vile ashes", qty: 15 * (3 / 66) },
  { name: "Uncut diamond", qty: 3 * (3 / 66) + 5 * (2 / 66) },
  { name: "Uncut emerald", qty: 10 * (2 / 66) },
  { name: "Blighted ancient ice sack", qty: 13 * (2 / 66) },
  { name: "Iron ore", qty: 40 * (1 / 66) },
  { name: "Chaos rune", qty: 60 * (1 / 66) },
  { name: "Death rune", qty: 50 * (1 / 66) },
  { name: "Blighted manta ray", qty: 20 * (1 / 66) },
  { name: "Blighted anglerfish", qty: 15 * (1 / 66) },
  { name: "Uncut sapphire", qty: 15 * (1 / 66) },
  { name: "Prayer potion(2)", qty: 1 * (2 / 66) },
  { name: "Dragonstone", qty: 2 * (1 / 66) },
];

/**
 * Expected loot per Rogues' Castle chest — Hard Wilderness Diary
 * (also used for Elite). Quantities increased ~15–25% on most resources.
 * Average value ~5,557 (live GE).
 */
const ROGUES_HARD_OUTPUTS: MethodPart[] = [
  { name: "Nature rune", qty: 50 * (11 / 66) },
  { name: "Red spiders' eggs", qty: 7 * (10 / 66) },
  { name: "Law rune", qty: 50 * (10 / 66) },
  { name: "Coal", qty: 25 * (8 / 66) },
  { name: "Coins", qty: 5625 * (6 / 66) },
  { name: "Vile ashes", qty: 18 * (3 / 66) },
  { name: "Uncut diamond", qty: 3 * (3 / 66) + 6 * (2 / 66) },
  { name: "Uncut emerald", qty: 12 * (2 / 66) },
  { name: "Blighted ancient ice sack", qty: 16 * (2 / 66) },
  { name: "Iron ore", qty: 50 * (1 / 66) },
  { name: "Chaos rune", qty: 75 * (1 / 66) },
  { name: "Death rune", qty: 62 * (1 / 66) },
  { name: "Blighted manta ray", qty: 25 * (1 / 66) },
  { name: "Blighted anglerfish", qty: 18 * (1 / 66) },
  { name: "Uncut sapphire", qty: 18 * (1 / 66) },
  { name: "Prayer potion(2)", qty: 1 * (2 / 66) },
  { name: "Dragonstone", qty: 2 * (1 / 66) },
];

export const THIEVING_METHODS: ThievingMethod[] = [
  {
    id: "pickpocket-man",
    label: "Pickpocket men/women",
    level: 1,
    xp: 8,
    actionsPerHour: 2000,
    inputs: [],
    output: null,
  },
  {
    id: "silk-stall",
    label: "Silk stall",
    level: 20,
    xp: 24,
    actionsPerHour: 700,
    inputs: [],
    output: { name: "Silk", qty: 1 },
  },
  {
    id: "fruit-stall",
    label: "Fruit stall (Hosidius)",
    level: 25,
    xp: 28.5,
    actionsPerHour: 1200,
    inputs: [],
    output: null, // mixed fruit; not fixed GE
  },
  {
    id: "blackjacking",
    label: "Blackjacking (Pollnivneach)",
    level: 45,
    xp: 46.5,
    actionsPerHour: 1800,
    inputs: [],
    output: null,
  },
  /**
   * Knights of Ardougne — always 50 coins per success.
   * Full Rogue outfit doubles loot → model 100 coins (standard for ranking).
   * At 95+ with diary ~100% success → ~3000 successful /h → ~300k gp/h.
   * actionsPerHour is successful pickpockets (conservative mid-high).
   */
  {
    id: "ardougne-knights",
    label: "Knights of Ardougne (Rogue outfit)",
    level: 55,
    xp: 84.3,
    actionsPerHour: 2500, // ~210k xp/h mid; ~3000 theoretical at 95+
    inputs: [{ name: "Dodgy necklace", qty: 0.04 }],
    output: null,
    outputs: [{ name: "Coins", qty: 100 }], // 50 base × 2 Rogue
  },
  {
    id: "stealing-valuables",
    label: "Stealing valuables (Varlamore)",
    level: 50,
    xp: 45,
    actionsPerHour: 1800,
    inputs: [],
    output: null,
  },
  {
    id: "elves",
    label: "Pickpocket elves (Prifddinas)",
    level: 85,
    xp: 353.3,
    actionsPerHour: 400,
    inputs: [],
    output: null,
    outputs: [
      { name: "Coins", qty: 350 },
      { name: "Crystal shard", qty: 0.03 },
      { name: "Death rune", qty: 0.25 },
      { name: "Nature rune", qty: 0.23 },
    ],
  },
  {
    id: "vyres",
    label: "Pickpocket vyres",
    level: 82,
    xp: 306.9,
    actionsPerHour: 450,
    inputs: [],
    output: null,
    outputs: [
      { name: "Coins", qty: 400 },
      { name: "Death rune", qty: 0.24 },
      { name: "Blood rune", qty: 0.12 },
      { name: "Uncut ruby", qty: 0.075 },
    ],
  },
  {
    id: "master-farmers",
    label: "Master Farmers",
    level: 38,
    xp: 43,
    actionsPerHour: 1800,
    inputs: [],
    output: null,
    outputs: [
      { name: "Ranarr seed", qty: 0.012 },
      { name: "Snapdragon seed", qty: 0.008 },
      { name: "Snape grass seed", qty: 0.02 },
      { name: "Toadflax seed", qty: 0.015 },
      { name: "Irit seed", qty: 0.025 },
      { name: "Avantoe seed", qty: 0.015 },
      { name: "Kwuarm seed", qty: 0.012 },
      { name: "Cadantine seed", qty: 0.01 },
      { name: "Lantadyme seed", qty: 0.008 },
      { name: "Dwarf weed seed", qty: 0.008 },
      { name: "Torstol seed", qty: 0.005 },
      { name: "Watermelon seed", qty: 0.018 },
    ],
  },
  /**
   * Rogues' Castle — Medium Wilderness Diary required for any loot.
   * XP 701.7 per successful open (wiki). ~350–400 chests/h realistic with PKers.
   */
  {
    id: "rogues-castle-medium",
    label: "Rogues' Castle chests (Medium diary)",
    level: 84,
    xp: 701.7,
    actionsPerHour: 350,
    inputs: [],
    output: null,
    outputs: ROGUES_MEDIUM_OUTPUTS,
  },
  /**
   * Rogues' Castle — Hard (or Elite) Wilderness Diary.
   * ~20% higher average loot value; also enables better obelisk returns.
   */
  {
    id: "rogues-castle-hard",
    label: "Rogues' Castle chests (Hard diary)",
    level: 84,
    xp: 701.7,
    actionsPerHour: 385, // slightly higher sustained with hard diary obelisks
    inputs: [],
    output: null,
    outputs: ROGUES_HARD_OUTPUTS,
  },
];

export function thievingMethodItemNames(): string[] {
  const names = new Set<string>();
  for (const m of THIEVING_METHODS) {
    for (const p of m.inputs) names.add(p.name);
    if (m.output) names.add(m.output.name);
    if (m.outputs) for (const p of m.outputs) names.add(p.name);
  }
  return [...names].filter((n) => n !== "Coins");
}
