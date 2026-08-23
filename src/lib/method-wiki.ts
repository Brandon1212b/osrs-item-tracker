/**
 * Best OSRS Wiki page for each /methods row.
 * Preference: exact MMG, then activity/course page, then skill training guide.
 * Titles checked against oldschool.runescape.wiki (Aug 2026).
 */

export type WikiRef = {
  page: string;
  title: string;
};

const WIKI_ORIGIN = "https://oldschool.runescape.wiki/w/";

export function wikiHref(page: string): string {
  return WIKI_ORIGIN + page.replace(/ /g, "_");
}

const SKILL_TRAINING: Record<string, WikiRef> = {
  agility: { page: "Agility training", title: "Agility training" },
  construction: { page: "Construction training", title: "Construction training" },
  cooking: { page: "Pay-to-play Cooking training", title: "Cooking training" },
  crafting: { page: "Pay-to-play Crafting training", title: "Crafting training" },
  farming: { page: "Farming training", title: "Farming training" },
  firemaking: { page: "Pay-to-play Firemaking training", title: "Firemaking training" },
  fishing: { page: "Pay-to-play Fishing training", title: "Fishing training" },
  fletching: { page: "Fletching training", title: "Fletching training" },
  herblore: { page: "Herblore training", title: "Herblore training" },
  hunter: { page: "Hunter training", title: "Hunter training" },
  magic: { page: "Pay-to-play Magic training", title: "Magic training" },
  mining: { page: "Pay-to-play Mining training", title: "Mining training" },
  prayer: { page: "Pay-to-play Prayer training", title: "Prayer training" },
  runecraft: { page: "Pay-to-play Runecraft training", title: "Runecraft training" },
  sailing: { page: "Sailing training", title: "Sailing training" },
  smithing: { page: "Pay-to-play Smithing training", title: "Smithing training" },
  thieving: { page: "Thieving training", title: "Thieving training" },
  woodcutting: { page: "Pay-to-play Woodcutting training", title: "Woodcutting training" },
};

/** Same method id in two skills (cook vs fish). */
const BY_SKILL_ID: Record<string, WikiRef> = {
  "cooking:karambwan": { page: "Money making guide/Cooking raw karambwan", title: "Cooking karambwan (MMG)" },
  "cooking:karambwan-1tick": { page: "Pay-to-play Cooking training", title: "Cooking training (1-tick)" },
  "cooking:tuna": { page: "Money making guide/Cooking raw tuna", title: "Cooking tuna (MMG)" },
  "cooking:lobster": { page: "Lobster", title: "Cooked lobster" },
  "cooking:swordfish": { page: "Money making guide/Cooking raw swordfish", title: "Cooking swordfish (MMG)" },
  "cooking:monkfish": { page: "Money making guide/Cooking raw monkfish", title: "Cooking monkfish (MMG)" },
  "cooking:shark": { page: "Money making guide/Cooking raw sharks", title: "Cooking sharks (MMG)" },
  "cooking:anglerfish": { page: "Money making guide/Cooking raw anglerfish", title: "Cooking anglerfish (MMG)" },
  "cooking:dark-crab": { page: "Money making guide/Cooking raw dark crabs", title: "Cooking dark crabs (MMG)" },
  "fishing:lobster": { page: "Money making guide/Catching lobsters", title: "Catching lobsters (MMG)" },
  "fishing:monkfish": { page: "Money making guide/Catching monkfish", title: "Catching monkfish (MMG)" },
  "fishing:shark": { page: "Money making guide/Catching sharks", title: "Catching sharks (MMG)" },
  "fishing:anglerfish": { page: "Money making guide/Catching anglerfish", title: "Catching anglerfish (MMG)" },
  "fishing:dark-crab": { page: "Money making guide/Catching dark crabs", title: "Catching dark crabs (MMG)" },
};

const BY_ID: Record<string, WikiRef> = {
  "wintertodt-mass": { page: "Wintertodt", title: "Wintertodt" },
  "tempoross-mass-cook": { page: "Tempoross", title: "Tempoross" },
  "gotr-mass": { page: "Money making guide/Guardians of the Rift", title: "Guardians of the Rift (MMG)" },
  "giants-foundry": { page: "Giants' Foundry", title: "Giants' Foundry" },
  "mahogany-homes": { page: "Mahogany Homes", title: "Mahogany Homes" },
  "motherlode-mine": { page: "Money making guide/Motherlode Mine", title: "Motherlode Mine (MMG)" },
  "volcanic-mine": { page: "Volcanic Mine", title: "Volcanic Mine" },
  "blast-mine": { page: "Money making guide/Blast mining", title: "Blast mining (MMG)" },
  "shooting-stars": { page: "Shooting Stars", title: "Shooting Stars" },
  "pyramid-plunder": { page: "Pyramid Plunder", title: "Pyramid Plunder" },
  "stealing-artefacts": { page: "Stealing artefacts", title: "Stealing artefacts" },
  "mta-enchanting": { page: "Mage Training Arena", title: "Mage Training Arena" },
  herbiboar: { page: "Money making guide/Hunting herbiboars", title: "Hunting herbiboars (MMG)" },
  "mastering-mixology": { page: "Money making guide/Mastering Mixology", title: "Mastering Mixology (MMG)" },
  "tithe-farm": { page: "Tithe Farm", title: "Tithe Farm" },
  "farming-contracts": { page: "Farming contracts", title: "Farming contracts" },
  hespori: { page: "Hespori", title: "Hespori" },
  "forestry-events": { page: "Forestry", title: "Forestry" },
  "hunter-rumours": { page: "Hunters' Rumours", title: "Hunters' Rumours" },
  "hunter-implings": { page: "Money making guide/Hunting implings", title: "Hunting implings (MMG)" },
  "trawl-yellowfin": { page: "Money making guide/Deep sea trawling for yellowfin", title: "Deep sea trawling — yellowfin (MMG)" },
  "trawl-halibut": { page: "Money making guide/Deep sea trawling for halibut", title: "Deep sea trawling — halibut (MMG)" },
  "trawl-bluefin": { page: "Money making guide/Deep sea trawling for bluefin", title: "Deep sea trawling — bluefin (MMG)" },
  "trawl-marlin": { page: "Money making guide/Deep sea trawling for marlin", title: "Deep sea trawling — marlin (MMG)" },
  "wilderness-agility-tickets": { page: "Money making guide/Wilderness Agility Course", title: "Wilderness Agility Course (MMG)" },
  "sepulchre-floor-3": { page: "Money making guide/Hallowed Sepulchre (Floor 3)", title: "Hallowed Sepulchre floor 3 (MMG)" },
  "sepulchre-floor-4": { page: "Money making guide/Hallowed Sepulchre (Floor 4)", title: "Hallowed Sepulchre floor 4 (MMG)" },
  "sepulchre-floor-5-loot": { page: "Money making guide/Hallowed Sepulchre (Floor 5)", title: "Hallowed Sepulchre floor 5 (MMG)" },
  "brimhaven-arena": { page: "Brimhaven Agility Arena", title: "Brimhaven Agility Arena" },
  "agility-pyramid": { page: "Agility Pyramid", title: "Agility Pyramid" },
  "varrock-rooftop": { page: "Varrock Rooftop Course", title: "Varrock rooftop" },
  "canifis-rooftop": { page: "Canifis Rooftop Course", title: "Canifis rooftop" },
  "falador-rooftop": { page: "Falador Rooftop Course", title: "Falador rooftop" },
  "seers-rooftop": { page: "Seers' Village Rooftop Course", title: "Seers' Village rooftop" },
  "pollnivneach-rooftop": { page: "Pollnivneach Rooftop Course", title: "Pollnivneach rooftop" },
  "relekka-rooftop": { page: "Rellekka Rooftop Course", title: "Rellekka rooftop" },
  "ardougne-rooftop": { page: "Ardougne Rooftop Course", title: "Ardougne rooftop" },
  "colossal-wyrm-basic": { page: "Colossal Wyrm Agility Course", title: "Colossal Wyrm course" },
  "colossal-wyrm-advanced": { page: "Colossal Wyrm Agility Course", title: "Colossal Wyrm course" },
  "wilderness-agility": { page: "Wilderness Agility Course", title: "Wilderness Agility Course" },
  werewolf: { page: "Werewolf Agility Course", title: "Werewolf Agility Course" },
  prifddinas: { page: "Prifddinas Agility Course", title: "Prifddinas Agility Course" },
  "ape-atoll": { page: "Ape Atoll Agility Course", title: "Ape Atoll Agility Course" },
  "dorgesh-kaan": { page: "Dorgesh-Kaan Agility Course", title: "Dorgesh-Kaan Agility Course" },
  "hallowed-sepulchre": { page: "Hallowed Sepulchre", title: "Hallowed Sepulchre" },
  "sunfire-runes": { page: "Money making guide/Crafting sunfire runes", title: "Crafting sunfire runes (MMG)" },
  "nature-runes-double-diary": { page: "Money making guide/Crafting double nature runes (Achievement Diary Cape teleport)", title: "Double nature runes (MMG)" },
  "aether-runes": { page: "Money making guide/Crafting aether runes", title: "Crafting aether runes (MMG)" },
  "mud-runes": { page: "Money making guide/Crafting mud runes", title: "Crafting mud runes (MMG)" },
  "astral-runes": { page: "Money making guide/Crafting astral runes", title: "Crafting astral runes (MMG)" },
  "blood-runes-abyss": { page: "Money making guide/Crafting blood runes through the Abyss", title: "Blood runes through the Abyss (MMG)" },
  "blood-runes-true": { page: "Money making guide/Crafting blood runes", title: "Crafting blood runes (MMG)" },
  "nature-runes-abyss": { page: "Money making guide/Crafting nature runes through the Abyss", title: "Nature runes through the Abyss (MMG)" },
  "air-runes": { page: "Money making guide/Crafting air runes (high level)", title: "Crafting air runes (MMG)" },
  "zmi-ourania": { page: "Ourania Altar", title: "Ourania Altar (ZMI)" },
  "snowy-knights": { page: "Money making guide/Catching snowy knights", title: "Catching snowy knights (MMG)" },
  "pyre-foxes": { page: "Money making guide/Hunting pyre foxes", title: "Hunting pyre foxes (MMG)" },
  "grey-chins": { page: "Money making guide/Hunting chinchompas", title: "Hunting chinchompas (MMG)" },
  "red-chins": { page: "Money making guide/Hunting carnivorous chinchompas", title: "Hunting red chinchompas (MMG)" },
  "black-chins": { page: "Money making guide/Hunting black chinchompas", title: "Hunting black chinchompas (MMG)" },
  "sunlight-antelope": { page: "Money making guide/Hunting sunlight antelopes", title: "Hunting sunlight antelopes (MMG)" },
  "moonlight-antelope": { page: "Money making guide/Hunting moonlight antelopes", title: "Hunting moonlight antelopes (MMG)" },
  elves: { page: "Money making guide/Pickpocketing elves", title: "Pickpocketing elves (MMG)" },
  vyres: { page: "Money making guide/Pickpocketing vyres", title: "Pickpocketing vyres (MMG)" },
  "master-farmers": { page: "Money making guide/Pickpocketing master farmers", title: "Master farmers (MMG)" },
  "rogues-castle-medium": { page: "Money making guide/Stealing from Rogues' Castle chests", title: "Rogues' Castle chests (MMG)" },
  "rogues-castle-hard": { page: "Money making guide/Stealing from Rogues' Castle chests", title: "Rogues' Castle chests (MMG)" },
  blackjacking: { page: "Blackjack", title: "Blackjacking" },

  // Smithing
  "bf-iron": { page: "Money making guide/Smelting iron bars at Blast Furnace", title: "Blast Furnace iron (MMG)" },
  "bf-steel": { page: "Money making guide/Smelting steel bars at Blast Furnace", title: "Blast Furnace steel (MMG)" },
  "bf-gold": { page: "Money making guide/Blast Furnace", title: "Blast Furnace (MMG)" },
  "bf-mithril": { page: "Money making guide/Smelting mithril bars at Blast Furnace", title: "Blast Furnace mithril (MMG)" },
  "bf-adamant": { page: "Money making guide/Smelting adamantite bars at Blast Furnace", title: "Blast Furnace adamant (MMG)" },
  "bf-rune": { page: "Money making guide/Smelting runite bars at Blast Furnace", title: "Blast Furnace runite (MMG)" },
  cannonballs: { page: "Money making guide/Smithing steel cannonballs", title: "Steel cannonballs (MMG)" },
  "cannonballs-double": { page: "Money making guide/Smithing steel cannonballs", title: "Steel cannonballs (MMG)" },
  "iron-platebody": { page: "Iron platebody", title: "Iron platebody" },
  "steel-platebody": { page: "Steel platebody", title: "Steel platebody" },
  "mithril-platebody": { page: "Mithril platebody", title: "Mithril platebody" },
  "adamant-platebody": { page: "Adamant platebody", title: "Adamant platebody" },
  "rune-platebody": { page: "Money making guide/Smithing rune items", title: "Smithing rune items (MMG)" },
  "rune-platelegs": { page: "Money making guide/Smithing rune items", title: "Smithing rune items (MMG)" },
  "rune-plateskirt": { page: "Money making guide/Smithing rune items", title: "Smithing rune items (MMG)" },
  "rune-2h": { page: "Money making guide/Smithing rune items", title: "Smithing rune items (MMG)" },
  "rune-kiteshield": { page: "Money making guide/Smithing rune items", title: "Smithing rune items (MMG)" },
  "rune-battleaxe": { page: "Money making guide/Smithing rune items", title: "Smithing rune items (MMG)" },
  "rune-warhammer": { page: "Money making guide/Smithing rune items", title: "Smithing rune items (MMG)" },
  "rune-dart-tips": { page: "Money making guide/Smithing rune items", title: "Smithing rune items (MMG)" },
  "rune-nails": { page: "Money making guide/Smithing rune items", title: "Smithing rune items (MMG)" },

  amethyst: { page: "Money making guide/Mining amethyst", title: "Mining amethyst (MMG)" },
  "runite-ore": { page: "Money making guide/Mining runite ore", title: "Mining runite ore (MMG)" },
  "sacred-eel": { page: "Money making guide/Catching sacred eels", title: "Catching sacred eels (MMG)" },
  "infernal-eel": { page: "Money making guide/Catching infernal eels", title: "Catching infernal eels (MMG)" },
  "drift-net": { page: "Money making guide/Drift net fishing", title: "Drift net fishing (MMG)" },
  "engorged-bloodwood": { page: "Money making guide/Chopping the engorged bloodwood tree", title: "Engorged bloodwood (MMG)" },
  "redwood-logs": { page: "Money making guide/Cutting redwood logs", title: "Cutting redwood logs (MMG)" },
  "magic-logs": { page: "Money making guide/Cutting magic logs", title: "Cutting magic logs (MMG)" },
  "yew-longbow": { page: "Money making guide/Stringing yew longbows", title: "Stringing yew longbows (MMG)" },
  "magic-longbow": { page: "Money making guide/Stringing magic longbows", title: "Stringing magic longbows (MMG)" },
  "sanfew-serum": { page: "Money making guide/Making sanfew serum(4)", title: "Making sanfew serum (MMG)" },
  "super-combat": { page: "Money making guide/Making super combat potions (with prescription goggles)", title: "Super combat potions (MMG)" },
  "sacred-oil": { page: "Money making guide/Making sacred oil", title: "Making sacred oil (MMG)" },
  "sea-charting": { page: "Sea charting", title: "Sea charting" },
};

type PrefixRule = { match: (id: string) => boolean; ref: WikiRef };

const PREFIX_RULES: PrefixRule[] = [
  { match: (id) => id.startsWith("birdhouse-"), ref: { page: "Bird house trapping", title: "Bird house trapping" } },
  { match: (id) => id.startsWith("clean-"), ref: { page: "Herblore#Cleaning herbs", title: "Cleaning herbs" } },
  { match: (id) => id.startsWith("degrime-"), ref: { page: "Degrime", title: "Degrime" } },
  { match: (id) => id.endsWith("-gilded"), ref: { page: "Gilded altar", title: "Gilded altar" } },
  { match: (id) => id.endsWith("-chaos"), ref: { page: "Chaos Temple (Wilderness)", title: "Wilderness chaos altar" } },
  { match: (id) => id.endsWith("-sinister"), ref: { page: "Sinister Offering", title: "Sinister Offering" } },
  { match: (id) => id.startsWith("ensouled-"), ref: { page: "Reanimation spells", title: "Reanimation spells" } },
  { match: (id) => id.startsWith("enchant-"), ref: { page: "Enchantment", title: "Enchant jewellery" } },
  { match: (id) => id.startsWith("plank-make-"), ref: { page: "Plank Make", title: "Plank Make" } },
  { match: (id) => id.startsWith("tan-"), ref: { page: "Money making guide/Casting Tan Leather", title: "Tan Leather (MMG)" } },
  { match: (id) => id.startsWith("superheat-"), ref: { page: "Superheat Item", title: "Superheat Item" } },
  { match: (id) => id.startsWith("bf-"), ref: { page: "Blast Furnace", title: "Blast Furnace" } },
  { match: (id) => id.startsWith("campfire-"), ref: { page: "Bonfire", title: "Bonfire / campfire" } },
  { match: (id) => id.startsWith("burn-"), ref: { page: "Pay-to-play Firemaking training", title: "Firemaking training" } },
  { match: (id) => id.startsWith("cut-"), ref: { page: "Crafting#Gems", title: "Cutting gems" } },
  { match: (id) => id.startsWith("golem-"), ref: { page: "Golem crafting", title: "Golem crafting" } },
  { match: (id) => id.startsWith("salvage-"), ref: { page: "Shipwreck salvaging", title: "Shipwreck salvaging" } },
  { match: (id) => id.startsWith("courier-"), ref: { page: "Courier tasks", title: "Courier tasks" } },
  { match: (id) => id.startsWith("barracuda-"), ref: { page: "Barracuda Trials", title: "Barracuda Trials" } },
  // Rune anvil products → dedicated MMG
  { match: (id) => id.startsWith("rune-") && !id.includes("runes"), ref: { page: "Money making guide/Smithing rune items", title: "Smithing rune items (MMG)" } },
  { match: (id) => id.includes("battlestaff"), ref: { page: "Battlestaff", title: "Battlestaves" } },
  { match: (id) => id.includes("dhide"), ref: { page: "Crafting#Dragonhide", title: "Dragonhide crafting" } },
  { match: (id) => id.endsWith("-herbs"), ref: { page: "Money making guide/Farming herbs", title: "Farming herbs (MMG)" } },
  { match: (id) => id.endsWith("-tree") || id === "calquat" || id === "celastrus", ref: { page: "Farming training", title: "Farming training" } },
  { match: (id) => id.endsWith("-platebody"), ref: { page: "Pay-to-play Smithing training", title: "Smithing training" } },
  { match: (id) => id.includes("dart-tip") || id.endsWith("-darts"), ref: { page: "Dart", title: "Darts" } },
  { match: (id) => id.includes("nails"), ref: { page: "Nails", title: "Nails" } },
  { match: (id) => id.includes("bolt-tips"), ref: { page: "Bolt tips", title: "Bolt tips" } },
  { match: (id) => id.includes("bolts"), ref: { page: "Bolts", title: "Bolts" } },
  { match: (id) => id.includes("arrow"), ref: { page: "Arrows", title: "Arrows" } },
  { match: (id) => id.includes("longbow"), ref: { page: "Fletching training", title: "Fletching training" } },
  { match: (id) => id.startsWith("divine-"), ref: { page: "Divine potion", title: "Divine potions" } },
  { match: (id) => id.startsWith("super-") || id.endsWith("-potion"), ref: { page: "Herblore training", title: "Herblore training" } },
];

export function resolveMethodWiki(id: string, skillKey?: string | null): WikiRef {
  if (skillKey) {
    const keyed = BY_SKILL_ID[`${skillKey}:${id}`];
    if (keyed) return keyed;
  }
  const exact = BY_ID[id];
  if (exact) return exact;
  for (const rule of PREFIX_RULES) {
    if (rule.match(id)) return rule.ref;
  }
  const skill = skillKey ? SKILL_TRAINING[skillKey] : undefined;
  if (skill) return skill;
  return { page: "Money making guide/Skilling", title: "Skilling money-making guide" };
}

export function methodWikiLink(id: string, skillKey?: string | null): { href: string; title: string } {
  const ref = resolveMethodWiki(id, skillKey);
  return { href: wikiHref(ref.page), title: ref.title };
}
