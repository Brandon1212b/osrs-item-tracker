/** Endgame wealth / rare armour sets not on the main progression tables. */
export const GEAR_SETS_EXTRA = [
  {
    key: "oathplate",
    label: "Oathplate",
    tier: "end" as const,
    combat: "melee" as const,
    items: [
      "Oathplate helm",
      "Oathplate chest",
      "Oathplate legs",
    ],
  },
  {
    key: "3rd-age-melee",
    label: "3rd age melee",
    tier: "end" as const,
    combat: "melee" as const,
    items: [
      "3rd age full helmet",
      "3rd age platebody",
      "3rd age platelegs",
      "3rd age plateskirt",
      "3rd age kiteshield",
      "3rd age longsword",
    ],
  },
  {
    key: "3rd-age-range",
    label: "3rd age range",
    tier: "end" as const,
    combat: "range" as const,
    items: [
      "3rd age range coif",
      "3rd age range top",
      "3rd age range legs",
      "3rd age vambraces",
      "3rd age bow",
    ],
  },
  {
    key: "3rd-age-magic",
    label: "3rd age magic",
    tier: "end" as const,
    combat: "magic" as const,
    items: [
      "3rd age mage hat",
      "3rd age robe top",
      "3rd age robe",
      "3rd age amulet",
      "3rd age wand",
    ],
  },
] as const;
