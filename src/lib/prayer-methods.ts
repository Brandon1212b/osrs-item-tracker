/**
 * Prayer training methods (P2P guide rates).
 * https://oldschool.runescape.wiki/w/Pay-to-play_Prayer_training
 *
 * XP/h from wiki focused rates; GP/h is computed live from GE prices.
 * Bones / ashes / heads are consumed (no GE product).
 * Chaos altar: 50% bone-save → model as 0.5 bone input per offer.
 * Sinister Offering: 1 blood + 1 wrath per cast (3 bones).
 * Demonic Offering: 1 soul + 1 wrath per cast (3 ashes).
 */
export type MethodPart = {
  name: string;
  qty: number;
};

export type PrayerMethod = {
  id: string;
  label: string;
  /** Prayer level required (1 for most; 70 for superior dragon bones) */
  level: number;
  /** XP per action */
  xp: number;
  /** Actions per hour (wiki / focused rate) */
  actionsPerHour: number;
  inputs: MethodPart[];
  /** Always null — materials are consumed */
  output: MethodPart | null;
  /** Optional Magic level for ensouled-head / offering spells */
  magicLevel?: number;
};

// Base bone XP × multipliers
// Gilded / Chaos (2 burners): 3.5×
// Sinister / Demonic offering: 3× (3 items per cast)
// Shards (sunfire wine): ~4.72× base (Varlamore libation bowl)

const GILDED_APH = 2550; // manual use on altar
const CHAOS_APH = 2000; // offers/hr; bones used ≈ half
const OFFERING_APH = 600; // casts/hr × 3 items
const ENSOULED_APH = 220; // reanimations/hr (combat-dependent)
const SHARDS_APH = 1700; // bless + chisel + offer

function boneMethods(
  id: string,
  label: string,
  bone: string,
  baseXp: number,
  prayerLevel = 1,
): PrayerMethod[] {
  const gildedXp = baseXp * 3.5;
  const sinisterXp = baseXp * 3 * 3; // 3 bones per cast
  return [
    {
      id: `${id}-gilded`,
      label: `${label} (gilded altar)`,
      level: prayerLevel,
      xp: gildedXp,
      actionsPerHour: GILDED_APH,
      inputs: [{ name: bone, qty: 1 }],
      output: null,
    },
    {
      id: `${id}-chaos`,
      label: `${label} (chaos altar)`,
      level: prayerLevel,
      xp: gildedXp,
      actionsPerHour: CHAOS_APH,
      // 50% save → average 0.5 bone consumed per offer
      inputs: [{ name: bone, qty: 0.5 }],
      output: null,
    },
    {
      id: `${id}-sinister`,
      label: `${label} (sinister offering)`,
      level: prayerLevel,
      xp: sinisterXp,
      actionsPerHour: OFFERING_APH,
      inputs: [
        { name: bone, qty: 3 },
        { name: "Blood rune", qty: 1 },
        { name: "Wrath rune", qty: 1 },
      ],
      output: null,
      magicLevel: 92,
    },
  ];
}

export const PRAYER_METHODS: PrayerMethod[] = [
  // ── Bones: gilded, chaos, sinister offering ──────────────────────────
  ...boneMethods("big-bones", "Big bones", "Big bones", 15),
  ...boneMethods("dragon-bones", "Dragon bones", "Dragon bones", 72),
  ...boneMethods("wyrm-bones", "Wyrm bones", "Wyrm bones", 50),
  ...boneMethods("lava-dragon-bones", "Lava dragon bones", "Lava dragon bones", 85),
  ...boneMethods("dagannoth-bones", "Dagannoth bones", "Dagannoth bones", 125),
  ...boneMethods("hydra-bones", "Hydra bones", "Hydra bones", 110),
  ...boneMethods("superior-dragon-bones", "Superior dragon bones", "Superior dragon bones", 150, 70),

  // Varlamore libation bowl with sunfire wine ≈ 4.72× base (340 xp / dragon bone)
  {
    id: "dragon-bones-shards",
    label: "Dragon bones (bone shards)",
    level: 30,
    xp: 340,
    actionsPerHour: SHARDS_APH,
    inputs: [{ name: "Dragon bones", qty: 1 }],
    output: null,
  },
  {
    id: "superior-dragon-bones-shards",
    label: "Superior dragon bones (bone shards)",
    level: 70,
    xp: 708, // 150 × (340/72)
    actionsPerHour: SHARDS_APH,
    inputs: [{ name: "Superior dragon bones", qty: 1 }],
    output: null,
  },
  {
    id: "dagannoth-bones-shards",
    label: "Dagannoth bones (bone shards)",
    level: 30,
    xp: 590, // 125 × (340/72)
    actionsPerHour: SHARDS_APH,
    inputs: [{ name: "Dagannoth bones", qty: 1 }],
    output: null,
  },

  // ── Demonic offering (ashes, 3× base, 3 per cast) ────────────────────
  {
    id: "fiendish-ashes-demonic",
    label: "Fiendish ashes (demonic offering)",
    level: 1,
    xp: 10 * 3 * 3,
    actionsPerHour: OFFERING_APH,
    inputs: [
      { name: "Fiendish ashes", qty: 3 },
      { name: "Soul rune", qty: 1 },
      { name: "Wrath rune", qty: 1 },
    ],
    output: null,
    magicLevel: 84,
  },
  {
    id: "vile-ashes-demonic",
    label: "Vile ashes (demonic offering)",
    level: 1,
    xp: 25 * 3 * 3,
    actionsPerHour: OFFERING_APH,
    inputs: [
      { name: "Vile ashes", qty: 3 },
      { name: "Soul rune", qty: 1 },
      { name: "Wrath rune", qty: 1 },
    ],
    output: null,
    magicLevel: 84,
  },
  {
    id: "malicious-ashes-demonic",
    label: "Malicious ashes (demonic offering)",
    level: 1,
    xp: 65 * 3 * 3,
    actionsPerHour: OFFERING_APH,
    inputs: [
      { name: "Malicious ashes", qty: 3 },
      { name: "Soul rune", qty: 1 },
      { name: "Wrath rune", qty: 1 },
    ],
    output: null,
    magicLevel: 84,
  },
  {
    id: "abyssal-ashes-demonic",
    label: "Abyssal ashes (demonic offering)",
    level: 1,
    xp: 85 * 3 * 3,
    actionsPerHour: OFFERING_APH,
    inputs: [
      { name: "Abyssal ashes", qty: 3 },
      { name: "Soul rune", qty: 1 },
      { name: "Wrath rune", qty: 1 },
    ],
    output: null,
    magicLevel: 84,
  },
  {
    id: "infernal-ashes-demonic",
    label: "Infernal ashes (demonic offering)",
    level: 1,
    xp: 110 * 3 * 3,
    actionsPerHour: OFFERING_APH,
    inputs: [
      { name: "Infernal ashes", qty: 3 },
      { name: "Soul rune", qty: 1 },
      { name: "Wrath rune", qty: 1 },
    ],
    output: null,
    magicLevel: 84,
  },

  // ── Ensouled heads (all tiers) ───────────────────────────────────────
  // XP = Prayer XP on kill after reanimation. aph ≈ 220 focused.
  ...([
    ["goblin", "Ensouled goblin head", 130, 16],
    ["monkey", "Ensouled monkey head", 182, 16],
    ["imp", "Ensouled imp head", 286, 16],
    ["minotaur", "Ensouled minotaur head", 364, 16],
    ["scorpion", "Ensouled scorpion head", 454, 16],
    ["bear", "Ensouled bear head", 480, 16],
    ["unicorn", "Ensouled unicorn head", 494, 16],
    ["dog", "Ensouled dog head", 520, 41],
    ["chaos-druid", "Ensouled chaos druid head", 584, 41],
    ["giant", "Ensouled giant head", 650, 41],
    ["ogre", "Ensouled ogre head", 716, 41],
    ["elf", "Ensouled elf head", 754, 41],
    ["troll", "Ensouled troll head", 780, 41],
    ["horror", "Ensouled horror head", 832, 41],
    ["kalphite", "Ensouled kalphite head", 884, 72],
    ["dagannoth", "Ensouled dagannoth head", 936, 72],
    ["bloodveld", "Ensouled bloodveld head", 1040, 72],
    ["tzhaar", "Ensouled tzhaar head", 1104, 72],
    ["demon", "Ensouled demon head", 1170, 72],
    ["hellhound", "Ensouled hellhound head", 1200, 72],
    ["aviansie", "Ensouled aviansie head", 1234, 90],
    ["abyssal", "Ensouled abyssal head", 1300, 90],
    ["dragon", "Ensouled dragon head", 1560, 90],
  ] as const).map(([id, name, xp, magic]) => ({
    id: `ensouled-${id}`,
    label: name,
    level: 1,
    xp,
    actionsPerHour: ENSOULED_APH,
    inputs: [{ name, qty: 1 }],
    output: null as MethodPart | null,
    magicLevel: magic,
  })),
];

/** All GE item names referenced by prayer methods (for price snapshot). */
export function prayerMethodItemNames(): string[] {
  const names = new Set<string>();
  for (const m of PRAYER_METHODS) {
    for (const p of m.inputs) names.add(p.name);
    if (m.output) names.add(m.output.name);
  }
  return [...names];
}
