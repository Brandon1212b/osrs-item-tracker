import type { GearSetDef } from "./gear-sets";

/** Endgame wealth / rare armour sets not on the main progression tables. */
export const GEAR_SETS_EXTRA: GearSetDef[] = [
  {
    key: "oathplate",
    label: "Oathplate",
    tier: "end",
    combat: "melee",
    items: [
      "Oathplate helm",
      "Oathplate chest",
      "Oathplate legs",
    ],
  },
  {
    key: "3rd-age-melee",
    label: "3rd age melee",
    tier: "end",
    combat: "melee",
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
    tier: "end",
    combat: "range",
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
    tier: "end",
    combat: "magic",
    items: [
      "3rd age mage hat",
      "3rd age robe top",
      "3rd age robe",
      "3rd age amulet",
      "3rd age wand",
    ],
  },
];
