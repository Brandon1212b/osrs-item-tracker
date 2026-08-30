/**
 * Untradeable gear that should still appear with an implied GE price
 * from the tradeable materials used to make it.
 */
export type CompositeSource = {
  name: string;
  qty: number;
};

export type CompositeItem = {
  name: string;
  id: number;
  icon: string;
  examine: string;
  sources: CompositeSource[];
  /** Shop / NPC fee with no GE component. */
  fixedCoins?: number;
};

export const COMPOSITE_ITEMS: CompositeItem[] = [
  {
    name: "Scorching bow",
    id: 29591,
    icon: "Scorching bow.png",
    examine: "Implied price of 1 × Tormented synapse.",
    sources: [{ name: "Tormented synapse", qty: 1 }],
  },
  {
    name: "Purging staff",
    id: 29594,
    icon: "Purging staff.png",
    examine: "Implied price of 1 × Tormented synapse.",
    sources: [{ name: "Tormented synapse", qty: 1 }],
  },
  {
    name: "Crystal helm",
    id: 23971,
    icon: "Crystal helm.png",
    examine: "Implied price of 1 × Crystal armour seed.",
    sources: [{ name: "Crystal armour seed", qty: 1 }],
  },
  {
    name: "Crystal legs",
    id: 23979,
    icon: "Crystal legs.png",
    examine: "Implied price of 2 × Crystal armour seed.",
    sources: [{ name: "Crystal armour seed", qty: 2 }],
  },
  {
    name: "Crystal body",
    id: 23975,
    icon: "Crystal body.png",
    examine: "Implied price of 3 × Crystal armour seed.",
    sources: [{ name: "Crystal armour seed", qty: 3 }],
  },
  {
    name: "Ferocious gloves",
    id: 22981,
    icon: "Ferocious gloves.png",
    examine: "Implied price of 1 × Hydra leather.",
    sources: [{ name: "Hydra leather", qty: 1 }],
  },
  {
    name: "Neitiznot faceguard",
    id: 24271,
    icon: "Neitiznot faceguard.png",
    examine: "Implied price of Basilisk jaw + Helm of Neitiznot.",
    sources: [
      { name: "Basilisk jaw", qty: 1 },
      { name: "Helm of Neitiznot", qty: 1 },
    ],
  },
  {
    name: "Amulet of blood fury",
    id: 24780,
    icon: "Amulet of blood fury.png",
    examine: "Implied price of Amulet of fury + Blood shard.",
    sources: [
      { name: "Amulet of fury", qty: 1 },
      { name: "Blood shard", qty: 1 },
    ],
  },
  {
    name: "Elidinis' ward (f)",
    id: 27251,
    icon: "Elidinis' ward (f).png",
    examine: "Implied price of Elidinis' ward + Arcane sigil.",
    sources: [
      { name: "Elidinis' ward", qty: 1 },
      { name: "Arcane sigil", qty: 1 },
    ],
  },
  {
    name: "Keris partisan",
    id: 27287,
    icon: "Keris partisan.png",
    examine: "Shop price from Selim (60,000 coins).",
    sources: [],
    fixedCoins: 60_000,
  },
  {
    name: "Iban's staff (u)",
    id: 1410,
    icon: "Iban's staff (u).png",
    examine: "Dark Mage upgrade fee (200,000 coins).",
    sources: [],
    fixedCoins: 200_000,
  },
];

export const COMPOSITE_BY_ID = new Map(COMPOSITE_ITEMS.map((c) => [c.id, c]));
export const COMPOSITE_BY_NAME = new Map(COMPOSITE_ITEMS.map((c) => [c.name.toLowerCase(), c]));
