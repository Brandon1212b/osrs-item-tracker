export type GearSetRow = {
  key: string;
  label: string;
  tier: "early" | "mid" | "late" | "end";
  combat?: "melee" | "range" | "magic";
  items: readonly string[];
};

export const GEAR_SETS_EARLY: GearSetRow[] = [
  {
    key: "lvl20",
    label: "20+",
    tier: "early",
    items: ["Maple shortbow", "Adamant arrow", "Mystic hat (dark)", "Mystic robe top (dark)", "Mystic robe bottom (dark)", "Mystic gloves (dark)", "Mystic boots (dark)", "Iban's staff (u)"],
  },
  {
    key: "lvl30",
    label: "30+",
    tier: "early",
    combat: "melee",
    items: ["Amulet of strength", "Combat bracelet", "Rune boots", "Berserker helm", "Mixed hide cape"],
  },
  {
    key: "lvl40",
    label: "40+",
    tier: "early",
    items: ["Dragon scimitar", "Dragon boots", "Helm of neitiznot", "Amulet of strength", "Combat bracelet", "Rune boots", "Berserker helm", "Maple shortbow", "Adamant arrow", "Magic shortbow", "Rune arrow", "Dorgeshuun crossbow", "Bone bolts", "Mystic hat (dark)", "Mystic robe top (dark)", "Mystic robe bottom (dark)", "Mystic gloves (dark)", "Mystic boots (dark)", "Iban's staff (u)"],
  },
  {
    key: "pre-rfd",
    label: "Pre-RfD",
    tier: "mid",
    items: ["Abyssal whip", "Amulet of fury", "Zamorakian hasta", "Zombie axe", "Obsidian helmet", "Obsidian platebody", "Obsidian platelegs", "Berserker necklace", "Toktz-xil-ak", "Toktz-xil-ek", "Ursine chainmace", "Helm of neitiznot", "Dragon boots", "Dorgeshuun crossbow", "Bone bolts", "Magic shortbow", "Rune arrow", "Rune crossbow", "Broad bolts"],
  },
  {
    key: "post-rfd",
    label: "Post-RfD",
    tier: "mid",
    items: ["Abyssal whip", "Kraken tentacle", "Amulet of fury", "Zamorakian hasta", "Zombie axe", "Berserker ring", "Ursine chainmace", "Dragon boots", "Helm of neitiznot", "Dharok's helm", "Dharok's platebody", "Dharok's platelegs", "Dharok's greataxe", "Magic shortbow", "Rune arrow", "Amethyst arrow", "Rune crossbow", "Broad bolts", "Diamond bolts (e)", "Ruby bolts (e)", "Infinity hat", "Infinity top", "Infinity bottoms", "Infinity gloves", "Infinity boots", "Bloodbark helm", "Bloodbark body", "Bloodbark legs", "Bloodbark gauntlets", "Bloodbark boots", "Dagon'hai hat", "Dagon'hai robe top", "Dagon'hai robe bottom", "Warped sceptre", "Iban's staff (u)"],
  },
  {
    key: "barrows",
    label: "Barrows",
    tier: "mid",
    combat: "melee",
    items: ["Dharok's helm", "Dharok's platebody", "Dharok's platelegs", "Dharok's greataxe", "Guthan's helm", "Guthan's platebody", "Guthan's chainskirt", "Guthan's warspear", "Torag's helm", "Torag's platebody", "Torag's platelegs", "Torag's hammers", "Verac's helm", "Verac's brassard", "Verac's plateskirt", "Verac's flail"],
  },
  {
    key: "obsidian",
    label: "Obsidian",
    tier: "mid",
    combat: "melee",
    items: ["Obsidian helmet", "Obsidian platebody", "Obsidian platelegs", "Berserker necklace", "Toktz-xil-ak", "Toktz-xil-ek"],
  },
  {
    key: "lvl60",
    label: "60+",
    tier: "mid",
    combat: "range",
    items: ["Amethyst arrow", "Hunters' sunlight crossbow", "Sunlight antler bolts", "Moonlight antler bolts", "Rune crossbow", "Broad bolts", "Diamond bolts (e)", "Ruby bolts (e)", "Steel cannonball"],
  },
  {
    key: "lvl65",
    label: "65+",
    tier: "mid",
    combat: "melee",
    items: ["Abyssal whip", "Kraken tentacle", "Amulet of fury", "Berserker ring", "Dragon boots", "Helm of neitiznot", "Zamorakian hasta", "Zombie axe", "Ursine chainmace"],
  },
  {
    key: "lvl70",
    label: "70+",
    tier: "mid",
    items: ["Abyssal whip", "Kraken tentacle", "Amulet of fury", "Berserker ring", "Dragon boots", "Helm of neitiznot", "Dharok's helm", "Dharok's platebody", "Dharok's platelegs", "Dharok's greataxe", "Obsidian helmet", "Obsidian platebody", "Obsidian platelegs", "Berserker necklace", "Rune crossbow", "Broad bolts", "Diamond bolts (e)", "Ruby bolts (e)", "Amethyst arrow", "Magic shortbow", "Rune arrow", "Steel cannonball", "Red chinchompa", "Black chinchompa", "Ahrim's hood", "Ahrim's robetop", "Ahrim's robeskirt", "Ahrim's staff", "Ancient sceptre", "Trident of the seas (full)", "Uncharged trident", "Occult necklace", "Seers ring", "Mage's book", "Tome of fire", "Tome of water", "Tome of earth", "Blue moon helm", "Blue moon chestplate", "Blue moon tassets"],
  },
  {
    key: "ahrims",
    label: "Ahrim's",
    tier: "mid",
    combat: "magic",
    items: ["Ahrim's hood", "Ahrim's robetop", "Ahrim's robeskirt", "Ahrim's staff"],
  },
];
