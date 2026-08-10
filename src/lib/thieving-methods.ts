/**
 * Thieving training methods (P2P).
 * https://oldschool.runescape.wiki/w/Pay-to-play_Thieving_training
 *
 * Multi-loot methods use `outputs` with expected qty per successful action
 * (fractional). Coins are special-cased at 1 gp in the panel.
 * Drop rates / averages from wiki Drop Rate Project + money-making guides (2026).
 */
export type MethodPart = { name: string; qty: number };

export type ThievingMethod = {
  id: string;
  label: string;
  level: number;
  xp: number;
  actionsPerHour: number;
  inputs: MethodPart[];
  /** Single primary output (legacy). Prefer `outputs` for multi-loot. */
  output: MethodPart | null;
  /** Expected outputs per action (fractional qty allowed). Takes precedence over `output`. */
  outputs?: MethodPart[];
};

export const THIEVING_METHODS: ThievingMethod[] = [
  {
    id: "pickpocket-man",
    label: "Pickpocket men/women",
    level: 1,
    xp: 8,
    actionsPerHour: 2000,
    inputs: [],
    output: null,
    // Mostly low coins; not worth modelling for ranking
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
    actionsPerHour: 1200, // two-stall focused ~34k
    inputs: [],
    output: null, // mixed fruit; not fixed GE
  },
  {
    id: "blackjacking",
    label: "Blackjacking (Pollnivneach)",
    level: 45,
    xp: 46.5, // typical bandit/thug average
    actionsPerHour: 1800, // ~84k mid; higher with practice
    inputs: [],
    output: null,
  },
  {
    id: "ardougne-knights",
    label: "Knights of Ardougne",
    level: 55,
    xp: 84.3,
    actionsPerHour: 1200, // ~100k+ with diary/dodgy; conservative
    inputs: [{ name: "Dodgy necklace", qty: 0.05 }], // approximate wear rate
    output: null,
    // Coins pouch + occasional gems; variable — leave XP-focused for now
  },
  {
    id: "stealing-valuables",
    label: "Stealing valuables (Varlamore)",
    level: 50,
    xp: 45,
    actionsPerHour: 1800, // ~80k mid
    inputs: [],
    output: null, // valuables exchanged for coins + jewellery; complex mix
  },
  {
    id: "elves",
    label: "Pickpocket elves (Prifddinas)",
    level: 85,
    xp: 353.3,
    actionsPerHour: 400, // ~140k at high level; higher with rogue + diary
    inputs: [],
    // Approx expected per successful pickpocket (rogue outfit doubles rare loot).
    // Enhanced crystal teleport seed 1/1024 base → ~0.001; crystal shards ~3%.
    // Coins + runes form bulk of common loot. Values will track live GE.
    outputs: [
      { name: "Coins", qty: 250 }, // rough average common coins
      { name: "Crystal shard", qty: 0.03 },
      { name: "Enhanced crystal teleport seed", qty: 0.001 },
      { name: "Death rune", qty: 0.25 },
      { name: "Nature rune", qty: 0.25 },
    ],
    output: null,
  },
  {
    id: "vyres",
    label: "Pickpocket vyres",
    level: 82,
    xp: 306.9,
    actionsPerHour: 450, // ~140k focused; higher with rogue
    inputs: [],
    // Blood shard 1/5000 base; rogue doubles. Coins + blood-related common.
    outputs: [
      { name: "Coins", qty: 200 },
      { name: "Blood shard", qty: 0.0002 },
      { name: "Death rune", qty: 0.2 },
      { name: "Blood rune", qty: 0.15 },
      { name: "Uncut ruby", qty: 0.08 },
    ],
    output: null,
  },
  {
    id: "master-farmers",
    label: "Master Farmers",
    level: 38,
    xp: 43,
    actionsPerHour: 1800, // ~77k; higher at 94+ 100%
    inputs: [],
    // Seed table is large; high-value seeds drive profit. Approximate EV of
    // common high-value seeds at 85+ Farming (wiki MMG). Refine later with
    // full expected table if needed.
    outputs: [
      { name: "Ranarr seed", qty: 0.012 },
      { name: "Snapdragon seed", qty: 0.006 },
      { name: "Snape grass seed", qty: 0.04 },
      { name: "Watermelon seed", qty: 0.02 },
      { name: "Toadflax seed", qty: 0.015 },
      { name: "Avantoe seed", qty: 0.012 },
      { name: "Kwuarm seed", qty: 0.01 },
      { name: "Cadantine seed", qty: 0.008 },
      { name: "Lantadyme seed", qty: 0.006 },
      { name: "Dwarf weed seed", qty: 0.005 },
      { name: "Torstol seed", qty: 0.003 },
    ],
    output: null,
  },
  {
    id: "rogues-castle",
    label: "Rogues' Castle chests",
    level: 84,
    xp: 100, // approximate per successful open cycle
    actionsPerHour: 400, // realistic with PKer risk (~385–425 wiki MMG)
    inputs: [],
    // Expected qty per chest (Medium Wilderness Diary). Derived from wiki
    // drop table (Drop Rate Project). Hard diary increases most resource
    // quantities ~15–25%; these numbers are medium baseline so GP tracks live.
    outputs: [
      { name: "Nature rune", qty: 6.667 }, // 40 × 1/6
      { name: "Red spiders' eggs", qty: 0.909 }, // 6 × 1/6.6
      { name: "Law rune", qty: 6.061 }, // 40 × 1/6.6
      { name: "Coal", qty: 2.424 }, // 20 × 1/8.25
      { name: "Coins", qty: 409.09 }, // 4500 × 1/11
      { name: "Vile ashes", qty: 0.682 }, // 15 × 1/22
      { name: "Uncut diamond", qty: 0.288 }, // 3×1/22 + 5×1/33
      { name: "Uncut emerald", qty: 0.303 }, // 10 × 1/33
      { name: "Blighted ancient ice sack", qty: 0.394 }, // 13 × 1/33
      { name: "Prayer potion(2)", qty: 0.03 }, // 1 × 1/33
      { name: "Iron ore", qty: 0.606 }, // 40 × 1/66
      { name: "Chaos rune", qty: 0.909 }, // 60 × 1/66
      { name: "Death rune", qty: 0.758 }, // 50 × 1/66
      { name: "Blighted manta ray", qty: 0.303 }, // 20 × 1/66
      { name: "Blighted anglerfish", qty: 0.227 }, // 15 × 1/66
      { name: "Uncut sapphire", qty: 0.227 }, // 15 × 1/66
      { name: "Dragonstone", qty: 0.03 }, // 2 × 1/66
    ],
    output: null,
  },
];

export function thievingMethodItemNames(): string[] {
  const names = new Set<string>();
  for (const m of THIEVING_METHODS) {
    for (const p of m.inputs) names.add(p.name);
    if (m.output) names.add(m.output.name);
    if (m.outputs) for (const p of m.outputs) names.add(p.name);
  }
  return [...names];
}
