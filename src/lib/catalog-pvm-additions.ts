import { CATALOG, type CatalogItem } from "./osrs-catalog";

/** Tradeable PvM kit that was missing from the wiki-progression catalog. */
const ADDITIONS: Record<string, CatalogItem[]> = {
  melee: [
    { name: "Bellator ring", tags: ["melee", "ring", "late", "end"] },
    { name: "Tyrannical ring", tags: ["melee", "ring", "mid", "late"] },
    { name: "Treasonous ring", tags: ["melee", "ring", "mid", "late"] },
    { name: "Lightbearer", tags: ["melee", "ring", "late", "end"] },
    { name: "Ring of suffering", tags: ["melee", "ring", "late", "end"] },
    { name: "Ring of the gods", tags: ["melee", "ring", "mid", "late"] },
    { name: "Sunfire fanatic helm", tags: ["melee", "head", "mid", "late"] },
    { name: "Sunfire fanatic cuirass", tags: ["melee", "chest", "mid", "late"] },
    { name: "Sunfire fanatic chausses", tags: ["melee", "legs", "mid", "late"] },
    { name: "Saradomin godsword", tags: ["melee", "weapon", "two-handed", "late"] },
    { name: "Armadyl godsword", tags: ["melee", "weapon", "two-handed", "late"] },
    { name: "Zamorak godsword", tags: ["melee", "weapon", "two-handed", "late"] },
    { name: "Avernic defender hilt", tags: ["melee", "shield", "late", "end"] },
    { name: "Tormented synapse", tags: ["melee", "late"] },
  ],
  ranged: [
    { name: "Archers ring", tags: ["range", "ring", "mid", "late"] },
    { name: "Lightbearer", tags: ["range", "ring", "late", "end"] },
    { name: "Ring of suffering", tags: ["range", "ring", "late", "end"] },
    { name: "Ring of the gods", tags: ["range", "ring", "mid", "late"] },
    { name: "Sunfire fanatic helm", tags: ["range", "head", "mid", "late"] },
    { name: "Sunfire fanatic cuirass", tags: ["range", "chest", "mid", "late"] },
    { name: "Sunfire fanatic chausses", tags: ["range", "legs", "mid", "late"] },
  ],
  magic: [
    { name: "Master wand", tags: ["magic", "weapon", "one-handed", "mid"] },
    { name: "Lightbearer", tags: ["magic", "ring", "late", "end"] },
    { name: "Ring of suffering", tags: ["magic", "ring", "late", "end"] },
    { name: "Ring of the gods", tags: ["magic", "ring", "mid", "late"] },
    { name: "Sunfire fanatic helm", tags: ["magic", "head", "mid", "late"] },
    { name: "Sunfire fanatic cuirass", tags: ["magic", "chest", "mid", "late"] },
    { name: "Sunfire fanatic chausses", tags: ["magic", "legs", "mid", "late"] },
  ],
  utility: [
    { name: "Tormented synapse", tags: ["supplies"] },
  ],
};

let applied = false;

/** Merge missing PvM items into CATALOG. Safe to call more than once. */
export function applyPvmCatalogAdditions(): void {
  if (applied) return;
  applied = true;
  for (const group of CATALOG) {
    const extra = ADDITIONS[group.id];
    if (!extra) continue;
    const have = new Set(group.items.map((i) => i.name));
    for (const item of extra) {
      if (!have.has(item.name)) group.items.push(item);
    }
  }
}

applyPvmCatalogAdditions();
