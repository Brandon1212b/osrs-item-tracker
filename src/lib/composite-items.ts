/**
 * Untradeable gear that should still appear with an implied GE price
 * from the tradeable materials used to make it.
 */
export type CompositeItem = {
  /** Display / catalog name. */
  name: string;
  /** Stable id used in the UI (wiki item id when known). */
  id: number;
  icon: string;
  examine: string;
  /** Tradeable GE item whose price we copy. */
  sourceName: string;
  /** How many of the source item the craft consumes. */
  sourceQty: number;
};

export const COMPOSITE_ITEMS: CompositeItem[] = [
  {
    name: "Scorching bow",
    id: 29591,
    icon: "Scorching bow.png",
    examine: "Implied price of 1 × Tormented synapse.",
    sourceName: "Tormented synapse",
    sourceQty: 1,
  },
  {
    name: "Crystal helm",
    id: 23971,
    icon: "Crystal helm.png",
    examine: "Implied price of 1 × Crystal armour seed.",
    sourceName: "Crystal armour seed",
    sourceQty: 1,
  },
  {
    name: "Crystal legs",
    id: 23979,
    icon: "Crystal legs.png",
    examine: "Implied price of 2 × Crystal armour seed.",
    sourceName: "Crystal armour seed",
    sourceQty: 2,
  },
  {
    name: "Crystal body",
    id: 23975,
    icon: "Crystal body.png",
    examine: "Implied price of 3 × Crystal armour seed.",
    sourceName: "Crystal armour seed",
    sourceQty: 3,
  },
];

export const COMPOSITE_BY_ID = new Map(COMPOSITE_ITEMS.map((c) => [c.id, c]));
export const COMPOSITE_BY_NAME = new Map(COMPOSITE_ITEMS.map((c) => [c.name.toLowerCase(), c]));
