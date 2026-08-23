/**
 * Construction training methods (P2P guide rates).
 * https://oldschool.runescape.wiki/w/Construction_training
 */
export type MethodPart = { name: string; qty: number };

export type ConstructionMethod = {
  id: string;
  label: string;
  level: number;
  xp: number;
  actionsPerHour: number;
  inputs: MethodPart[];
  output: MethodPart | null;
};

export const CONSTRUCTION_METHODS: ConstructionMethod[] = [
  { id: "oak-larder", label: "Oak larder", level: 33, xp: 480, actionsPerHour: 900, inputs: [{ name: "Oak plank", qty: 8 }], output: null },
  { id: "oak-dining-table", label: "Oak dining table", level: 33, xp: 240, actionsPerHour: 1100, inputs: [{ name: "Oak plank", qty: 4 }], output: null },
  { id: "teak-armchair", label: "Teak armchair", level: 35, xp: 180, actionsPerHour: 1200, inputs: [{ name: "Teak plank", qty: 2 }], output: null },
  { id: "mythical-cape", label: "Mounted mythical cape", level: 50, xp: 370, actionsPerHour: 1162, inputs: [{ name: "Teak plank", qty: 3 }], output: null },
  { id: "mahogany-table", label: "Mahogany table", level: 52, xp: 840, actionsPerHour: 1071, inputs: [{ name: "Mahogany plank", qty: 6 }], output: null },
  { id: "teak-garden-bench", label: "Teak garden bench", level: 66, xp: 540, actionsPerHour: 1111, inputs: [{ name: "Teak plank", qty: 6 }], output: null },
  { id: "oak-door", label: "Oak dungeon door", level: 74, xp: 600, actionsPerHour: 917, inputs: [{ name: "Oak plank", qty: 10 }], output: null },
  { id: "mahogany-gnome-bench", label: "Mahogany gnome bench", level: 77, xp: 840, actionsPerHour: 1310, inputs: [{ name: "Mahogany plank", qty: 6 }], output: null },
  { id: "mahogany-hull-parts", label: "Mahogany hull parts", level: 41, xp: 350, actionsPerHour: 1000, inputs: [{ name: "Mahogany plank", qty: 5 }], output: { name: "Mahogany hull parts", qty: 1 } },
  { id: "mahogany-repair-kit", label: "Mahogany repair kit", level: 47, xp: 210, actionsPerHour: 600, inputs: [{ name: "Mahogany plank", qty: 2 }, { name: "Mithril nails", qty: 10 }, { name: "Swamp paste", qty: 5 }], output: { name: "Mahogany repair kit", qty: 2 } },
  { id: "teak-larder", label: "Teak larder", level: 43, xp: 480, actionsPerHour: 900, inputs: [{ name: "Teak plank", qty: 8 }], output: null },
  { id: "teak-table", label: "Teak table", level: 38, xp: 240, actionsPerHour: 1100, inputs: [{ name: "Teak plank", qty: 4 }], output: null },
  { id: "demonic-throne", label: "Demonic throne", level: 99, xp: 6666, actionsPerHour: 140, inputs: [{ name: "Magic stone", qty: 25 }], output: null },
  { id: "marble-cape-rack", label: "Marble cape rack", level: 80, xp: 500, actionsPerHour: 400, inputs: [{ name: "Marble block", qty: 1 }], output: null },
];

export function constructionMethodItemNames(): string[] {
  const names = new Set<string>();
  for (const m of CONSTRUCTION_METHODS) {
    for (const p of m.inputs) names.add(p.name);
    if (m.output) names.add(m.output.name);
  }
  return [...names];
}
