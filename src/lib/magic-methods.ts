/**
 * Magic training / money methods with GE inputs & outputs.
 * Sources: oldschool.runescape.wiki Magic training, Plank Make, Tan Leather,
 * Superheat Item, Enchant jewellery calculators (2026).
 *
 * High Alchemy: modelled as pure-XP (output null). Profit is alch-value based
 * (fixed), not GE sell — calculator shows opportunity + rune cost only.
 * Enchanting produces GE-tradeable items and fits the input→output model cleanly.
 */
export type MethodPart = { name: string; qty: number };

export type MagicMethod = {
  id: string;
  label: string;
  level: number;
  xp: number;
  actionsPerHour: number;
  inputs: MethodPart[];
  output: MethodPart | null;
};

export const MAGIC_METHODS: MagicMethod[] = [
  // ── High / Low Alchemy (pure XP + nature cost) ───────────────────────────
  {
    id: "high-alch",
    label: "High Level Alchemy",
    level: 55,
    xp: 65,
    actionsPerHour: 1200, // 5-tick cast, focused
    inputs: [{ name: "Nature rune", qty: 1 }],
    output: null,
  },
  {
    id: "low-alch",
    label: "Low Level Alchemy",
    level: 21,
    xp: 31,
    actionsPerHour: 1600,
    inputs: [{ name: "Nature rune", qty: 1 }],
    output: null,
  },

  // ── Jewellery enchanting (GE in → GE out) ────────────────────────────────
  {
    id: "enchant-sapphire-ring",
    label: "Enchant sapphire ring (recoil)",
    level: 7,
    xp: 17.5,
    actionsPerHour: 1600,
    inputs: [
      { name: "Sapphire ring", qty: 1 },
      { name: "Cosmic rune", qty: 1 },
    ],
    output: { name: "Ring of recoil", qty: 1 },
  },
  {
    id: "enchant-sapphire-necklace",
    label: "Enchant sapphire necklace (games)",
    level: 7,
    xp: 17.5,
    actionsPerHour: 1600,
    inputs: [
      { name: "Sapphire necklace", qty: 1 },
      { name: "Cosmic rune", qty: 1 },
    ],
    output: { name: "Games necklace(8)", qty: 1 },
  },
  {
    id: "enchant-emerald-ring",
    label: "Enchant emerald ring (dueling)",
    level: 27,
    xp: 37,
    actionsPerHour: 1600,
    inputs: [
      { name: "Emerald ring", qty: 1 },
      { name: "Cosmic rune", qty: 1 },
      { name: "Air rune", qty: 3 },
    ],
    output: { name: "Ring of dueling(8)", qty: 1 },
  },
  {
    id: "enchant-ruby-amulet",
    label: "Enchant ruby amulet (strength)",
    level: 49,
    xp: 59,
    actionsPerHour: 1600,
    inputs: [
      { name: "Ruby amulet", qty: 1 },
      { name: "Cosmic rune", qty: 1 },
      { name: "Fire rune", qty: 5 },
    ],
    output: { name: "Amulet of strength", qty: 1 },
  },
  {
    id: "enchant-diamond-amulet",
    label: "Enchant diamond amulet (power)",
    level: 57,
    xp: 67,
    actionsPerHour: 1600,
    inputs: [
      { name: "Diamond amulet", qty: 1 },
      { name: "Cosmic rune", qty: 1 },
      { name: "Earth rune", qty: 10 },
    ],
    output: { name: "Amulet of power", qty: 1 },
  },
  {
    id: "enchant-diamond-necklace",
    label: "Enchant diamond necklace (phoenix)",
    level: 57,
    xp: 67,
    actionsPerHour: 1600,
    inputs: [
      { name: "Diamond necklace", qty: 1 },
      { name: "Cosmic rune", qty: 1 },
      { name: "Earth rune", qty: 10 },
    ],
    output: { name: "Phoenix necklace", qty: 1 },
  },
  {
    id: "enchant-dragonstone-amulet",
    label: "Enchant dragonstone amulet (glory)",
    level: 68,
    xp: 78,
    actionsPerHour: 1600,
    inputs: [
      { name: "Dragonstone amulet", qty: 1 },
      { name: "Cosmic rune", qty: 1 },
      { name: "Earth rune", qty: 15 },
      { name: "Water rune", qty: 15 },
    ],
    output: { name: "Amulet of glory", qty: 1 },
  },

  // ── Plank Make ───────────────────────────────────────────────────────────
  {
    id: "plank-make-oak",
    label: "Plank Make (oak)",
    level: 86,
    xp: 90,
    actionsPerHour: 1000,
    inputs: [
      { name: "Oak logs", qty: 1 },
      { name: "Nature rune", qty: 1 },
      { name: "Astral rune", qty: 2 },
    ],
    output: { name: "Oak plank", qty: 1 },
  },
  {
    id: "plank-make-teak",
    label: "Plank Make (teak)",
    level: 86,
    xp: 90,
    actionsPerHour: 1000,
    inputs: [
      { name: "Teak logs", qty: 1 },
      { name: "Nature rune", qty: 1 },
      { name: "Astral rune", qty: 2 },
    ],
    output: { name: "Teak plank", qty: 1 },
  },
  {
    id: "plank-make-mahogany",
    label: "Plank Make (mahogany)",
    level: 86,
    xp: 90,
    actionsPerHour: 1000,
    inputs: [
      { name: "Mahogany logs", qty: 1 },
      { name: "Nature rune", qty: 1 },
      { name: "Astral rune", qty: 2 },
    ],
    output: { name: "Mahogany plank", qty: 1 },
  },

  // ── Tan leather ──────────────────────────────────────────────────────────
  {
    id: "tan-green-dhide",
    label: "Tan leather (green d'hide)",
    level: 78,
    xp: 81,
    actionsPerHour: 1600,
    inputs: [
      { name: "Green dragonhide", qty: 5 },
      { name: "Nature rune", qty: 1 },
      { name: "Astral rune", qty: 2 },
    ],
    output: { name: "Green dragon leather", qty: 5 },
  },
  {
    id: "tan-blue-dhide",
    label: "Tan leather (blue d'hide)",
    level: 78,
    xp: 81,
    actionsPerHour: 1600,
    inputs: [
      { name: "Blue dragonhide", qty: 5 },
      { name: "Nature rune", qty: 1 },
      { name: "Astral rune", qty: 2 },
    ],
    output: { name: "Blue dragon leather", qty: 5 },
  },
  {
    id: "tan-red-dhide",
    label: "Tan leather (red d'hide)",
    level: 78,
    xp: 81,
    actionsPerHour: 1600,
    inputs: [
      { name: "Red dragonhide", qty: 5 },
      { name: "Nature rune", qty: 1 },
      { name: "Astral rune", qty: 2 },
    ],
    output: { name: "Red dragon leather", qty: 5 },
  },
  {
    id: "tan-black-dhide",
    label: "Tan leather (black d'hide)",
    level: 78,
    xp: 81,
    actionsPerHour: 1600,
    inputs: [
      { name: "Black dragonhide", qty: 5 },
      { name: "Nature rune", qty: 1 },
      { name: "Astral rune", qty: 2 },
    ],
    output: { name: "Black dragon leather", qty: 5 },
  },

  // ── Superheat Item ───────────────────────────────────────────────────────
  {
    id: "superheat-steel",
    label: "Superheat Item (steel)",
    level: 43,
    xp: 53,
    actionsPerHour: 1600,
    inputs: [
      { name: "Iron ore", qty: 1 },
      { name: "Coal", qty: 2 },
      { name: "Nature rune", qty: 1 },
    ],
    output: { name: "Steel bar", qty: 1 },
  },
  {
    id: "superheat-mithril",
    label: "Superheat Item (mithril)",
    level: 43,
    xp: 53,
    actionsPerHour: 1600,
    inputs: [
      { name: "Mithril ore", qty: 1 },
      { name: "Coal", qty: 4 },
      { name: "Nature rune", qty: 1 },
    ],
    output: { name: "Mithril bar", qty: 1 },
  },
  {
    id: "superheat-adamant",
    label: "Superheat Item (adamant)",
    level: 43,
    xp: 53,
    actionsPerHour: 1600,
    inputs: [
      { name: "Adamantite ore", qty: 1 },
      { name: "Coal", qty: 6 },
      { name: "Nature rune", qty: 1 },
    ],
    output: { name: "Adamantite bar", qty: 1 },
  },
  {
    id: "superheat-gold",
    label: "Superheat Item (gold)",
    level: 43,
    xp: 53,
    actionsPerHour: 1600,
    inputs: [
      { name: "Gold ore", qty: 1 },
      { name: "Nature rune", qty: 1 },
    ],
    output: { name: "Gold bar", qty: 1 },
  },
  {
    id: "superheat-rune",
    label: "Superheat Item (runite)",
    level: 43,
    xp: 53,
    actionsPerHour: 1600,
    inputs: [
      { name: "Runite ore", qty: 1 },
      { name: "Coal", qty: 8 },
      { name: "Nature rune", qty: 1 },
    ],
    output: { name: "Runite bar", qty: 1 },
  },

  // ── Existing / other ─────────────────────────────────────────────────────
  {
    id: "humidify-jugs",
    label: "Humidify (jugs)",
    level: 68,
    xp: 65,
    actionsPerHour: 1600,
    inputs: [
      { name: "Jug", qty: 27 },
      { name: "Astral rune", qty: 1 },
      { name: "Fire rune", qty: 1 },
      { name: "Water rune", qty: 3 },
    ],
    output: { name: "Jug of water", qty: 27 },
  },
];

export function magicMethodItemNames(): string[] {
  const names = new Set<string>();
  for (const m of MAGIC_METHODS) {
    for (const p of m.inputs) names.add(p.name);
    if (m.output) names.add(m.output.name);
  }
  return [...names];
}
