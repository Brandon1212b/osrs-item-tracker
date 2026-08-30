/**
 * Offensive bonuses used for Cost / bonus efficiency sorting.
 * Sourced from wiki gear progression Cost / Δ tables:
 * - https://oldschool.runescape.wiki/w/Guide:Melee_Gear_Progression (Strength)
 * - https://oldschool.runescape.wiki/w/Guide:Ranged_Gear_Progression (Ranged Strength)
 * - Magic damage % from common BiS / progression items
 *
 * Values are the absolute worn bonus (not Δ). Sort uses price / bonus
 * so lower is better efficiency. Weapons use their strength score;
 * armour uses the strength (or rstr / mdmg) the piece contributes.
 */
export type OffensiveBonus = {
  /** Melee Strength bonus */
  str?: number;
  /** Ranged Strength bonus */
  rstr?: number;
  /** Magic damage % */
  mdmg?: number;
};

export const ITEM_OFFENSIVE: Record<string, OffensiveBonus> = {
  // ── Melee Strength ─────────────────────────────────
  "Amulet of strength": { str: 10 },
  "Combat bracelet": { str: 6 },
  "Rune boots": { str: 2 },
  "Berserker helm": { str: 3 },
  "Dragon scimitar": { str: 66 },
  "Helm of neitiznot": { str: 3 },
  "Mixed hide cape": { str: 1 },
  "Dragon boots": { str: 4 },
  "Abyssal whip": { str: 82 },
  "Kraken tentacle": { str: 4 }, // tentacle adds +4 over whip when attached; treat as upgrade piece
  "Amulet of fury": { str: 8 },
  "Zamorakian hasta": { str: 55 },
  "Zombie axe": { str: 90 },
  "Obsidian helmet": { str: 3 },
  "Obsidian platebody": { str: 1 },
  "Obsidian platelegs": { str: 1 },
  "Berserker necklace": { str: 7 },
  "Toktz-xil-ak": { str: 49 },
  "Toktz-xil-ek": { str: 28 },
  "Berserker ring": { str: 4 },
  "Ursine chainmace": { str: 71 },
  "Dharok's helm": { str: 0 },
  "Dharok's platebody": { str: 0 },
  "Dharok's platelegs": { str: 0 },
  "Dharok's greataxe": { str: 105 },
  "Guthan's warspear": { str: 75 },
  "Torag's hammers": { str: 82 },
  "Verac's flail": { str: 72 },
  "Serpentine helm": { str: 5 },
  "Blood moon helm": { str: 4 },
  "Blood moon chestplate": { str: 2 },
  "Blood moon tassets": { str: 2 },
  "Dual macuahuitl": { str: 88 },
  "Amulet of torture": { str: 10 },
  "Bandos chestplate": { str: 4 },
  "Bandos tassets": { str: 2 },
  "Bandos boots": { str: 1 },
  "Primordial boots": { str: 5 },
  "Ferocious gloves": { str: 14 },
  "Neitiznot faceguard": { str: 6 },
  "Burning claws": { str: 42 },
  "Osmumten's fang": { str: 86 },
  "Abyssal bludgeon": { str: 85 },
  "Dragon warhammer": { str: 85 },
  "Bandos godsword": { str: 132 },
  "Saradomin godsword": { str: 132 },
  "Armadyl godsword": { str: 132 },
  "Zamorak godsword": { str: 132 },
  "Ancient godsword": { str: 132 },
  "Bellator ring": { str: 6 },
  "Dragon hunter lance": { str: 70 },
  "Voidwaker": { str: 80 },
  "Dragon claws": { str: 56 },
  "Noxious halberd": { str: 110 },
  "Ghrazi rapier": { str: 93 },
  "Inquisitor's mace": { str: 89 },
  "Scythe of vitur (uncharged)": { str: 75 },
  "Soulreaper axe": { str: 116 },
  "Blade of saeldor (inactive)": { str: 89 },
  "Amulet of rancour": { str: 12 },
  "Torva full helm": { str: 8 },
  "Torva platebody": { str: 6 },
  "Torva platelegs": { str: 4 },
  "Ultor ring": { str: 12 },
  "Avernic treads": { str: 5, rstr: 2, mdmg: 0 },

  // ── Ranged Strength ────────────────────────────
  "Antler guard": { rstr: 2 },
  "Odium ward": { rstr: 4 },
  "Necklace of anguish": { rstr: 5 },
  "Dragonfire ward": { rstr: 8 },
  "Twisted buckler": { rstr: 10 },
  "Masori mask": { rstr: 2 },
  "Masori chaps": { rstr: 2 },
  "Masori body": { rstr: 4 },
  "Masori mask (f)": { rstr: 2 },
  "Masori chaps (f)": { rstr: 2 },
  "Masori body (f)": { rstr: 4 },
  "Venator ring": { rstr: 2 },
  "Zaryte vambraces": { rstr: 2 },
  "Necklace of rupture": { rstr: 8 },
  "Pegasian boots": { rstr: 4 },
  "Armadyl helmet": { rstr: 0 },
  "Armadyl chestplate": { rstr: 0 },
  "Armadyl chainskirt": { rstr: 0 },
  "Toxic blowpipe (empty)": { rstr: 40 },
  "Twisted bow": { rstr: 20 },
  "Zaryte crossbow": { rstr: 0 },
  "Bow of faerdhinen (inactive)": { rstr: 0 },
  "Dragon hunter crossbow": { rstr: 0 },
  "Armadyl crossbow": { rstr: 0 },
  "Dragon crossbow": { rstr: 0 },
  "Rune crossbow": { rstr: 0 },
  "Magic shortbow": { rstr: 0 },
  "Maple shortbow": { rstr: 0 },

  // ── Magic damage % ─────────────────────────────────
  "Occult necklace": { mdmg: 5 },
  "Tormented bracelet": { mdmg: 5 },
  "Ancestral hat": { mdmg: 3 },
  "Ancestral robe top": { mdmg: 3 },
  "Ancestral robe bottom": { mdmg: 3 },
  "Virtus mask": { mdmg: 2 },
  "Virtus robe top": { mdmg: 2 },
  "Virtus robe bottom": { mdmg: 2 },
  "Kodai wand": { mdmg: 15 },
  "Elidinis' ward (f)": { mdmg: 5 },
  "Elidinis' ward": { mdmg: 0 },
  "Magus ring": { mdmg: 2 },
  "Eternal boots": { mdmg: 1 },
  "Confliction gauntlets": { mdmg: 2 },
  "Ahrim's hood": { mdmg: 0 },
  "Ahrim's robetop": { mdmg: 0 },
  "Ahrim's robeskirt": { mdmg: 0 },
  "Ahrim's staff": { mdmg: 5 },
  "Tumeken's shadow (uncharged)": { mdmg: 0 },
  "Harmonised nightmare staff": { mdmg: 15 },
  "Volatile nightmare staff": { mdmg: 15 },
  "Eldritch nightmare staff": { mdmg: 15 },
  "Sanguinesti staff (uncharged)": { mdmg: 0 },
  "Trident of the seas (full)": { mdmg: 0 },
  "Uncharged toxic trident": { mdmg: 0 },
  "Ancient sceptre": { mdmg: 0 },
  "Seers ring": { mdmg: 0 },
  "Mage's book": { mdmg: 0 },
};

/**
 * Returns the relevant offensive bonus for efficiency sorting.
 * Prefers the combat style filter when set; otherwise uses the
 * item's primary combat tag, then falls back to the highest available.
 */
export function offensiveBonus(
  name: string,
  tags: string[],
  combat: string,
): number {
  const b = ITEM_OFFENSIVE[name];
  if (!b) return 0;

  const style =
    combat !== "all"
      ? combat
      : tags.includes("melee")
        ? "melee"
        : tags.includes("range")
          ? "range"
          : tags.includes("magic")
            ? "magic"
            : "all";

  if (style === "melee" && b.str != null && b.str > 0) return b.str;
  if (style === "range" && b.rstr != null && b.rstr > 0) return b.rstr;
  if (style === "magic" && b.mdmg != null && b.mdmg > 0) return b.mdmg;

  // Fallback: best available positive bonus
  return Math.max(b.str ?? 0, b.rstr ?? 0, b.mdmg ?? 0);
}

/** Cost per bonus point. Lower = better value. Infinity if no bonus. */
export function costPerBonus(
  price: number,
  name: string,
  tags: string[],
  combat: string,
): number {
  const bonus = offensiveBonus(name, tags, combat);
  if (bonus <= 0 || price <= 0) return Number.POSITIVE_INFINITY;
  return price / bonus;
}
