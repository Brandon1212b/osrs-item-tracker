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

const BY_SKILL_ID: Record<string, WikiRef> = {
  "cooking:karambwan": { page: "Money making guide/Cooking raw karambwan", title: "Cooking karambwan (MMG)" },
  "cooking:shark": { page: "Money making guide/Cooking raw sharks", title: "Cooking sharks (MMG)" },
  "cooking:dark-crab": { page: "Money making guide/Cooking raw dark crabs", title: "Cooking dark crabs (MMG)" },
  "cooking:anglerfish": { page: "Money making guide/Cooking raw anglerfish", title: "Cooking anglerfish (MMG)" },
  "fishing:shark": { page: "Money making guide/Catching sharks", title: "Catching sharks (MMG)" },
  "fishing:dark-crab": { page: "Money making guide/Catching dark crabs", title: "Catching dark crabs (MMG)" },
  "fishing:anglerfish": { page: "Money making guide/Catching anglerfish", title: "Catching anglerfish (MMG)" },
  "fishing:minnows": { page: "Money making guide/Catching minnows", title: "Catching minnows (MMG)" },
  "fishing:karambwan": { page: "Money making guide/Catching raw karambwan", title: "Catching raw karambwan (MMG)" },
  "woodcutting:magic-logs": { page: "Money making guide/Cutting magic logs", title: "Cutting magic logs (MMG)" },
  "woodcutting:redwood-logs": { page: "Money making guide/Cutting redwood logs", title: "Cutting redwood logs (MMG)" },
  "woodcutting:yew-logs": { page: "Money making guide/Cutting yew logs", title: "Cutting yew logs (MMG)" },
  "woodcutting:camphor-logs": { page: "Money making guide/Cutting camphor logs", title: "Cutting camphor logs (MMG)" },
};

const BY_ID: Record<string, WikiRef> = {
  herbiboar: { page: "Money making guide/Hunting herbiboars", title: "Hunting herbiboars (MMG)" },
  "hunter-rumours": { page: "Hunters' Rumours", title: "Hunters' Rumours" },
  "hunter-implings": { page: "Money making guide/Hunting implings", title: "Hunting implings (MMG)" },
  "snowy-knights": { page: "Money making guide/Catching snowy knights", title: "Catching snowy knights (MMG)" },
  "pyre-foxes": { page: "Money making guide/Hunting pyre foxes", title: "Hunting pyre foxes (MMG)" },
  "rainbow-crabs": { page: "Money making guide/Catching rainbow crabs", title: "Catching rainbow crabs (MMG)" },
  "rainbow-crabs-4trap": { page: "Money making guide/Catching rainbow crabs", title: "Catching rainbow crabs (MMG)" },
  "spotted-kebbit": { page: "Falconry", title: "Falconry" },
  "dark-kebbit": { page: "Falconry", title: "Falconry" },
  "dashing-kebbit": { page: "Falconry", title: "Falconry" },
  "grey-chins": { page: "Money making guide/Hunting chinchompas", title: "Hunting chinchompas (MMG)" },
  "red-chins": { page: "Money making guide/Hunting carnivorous chinchompas", title: "Hunting red chinchompas (MMG)" },
  "black-chins": { page: "Money making guide/Hunting black chinchompas", title: "Hunting black chinchompas (MMG)" },
  "sunlight-antelope": { page: "Money making guide/Hunting sunlight antelopes", title: "Hunting sunlight antelopes (MMG)" },
  "moonlight-antelope": { page: "Money making guide/Hunting moonlight antelopes", title: "Hunting moonlight antelopes (MMG)" },
  "infernal-shale-afk": { page: "Money making guide/Mining and crushing infernal shale (Infernal shale deposit)", title: "Infernal shale deposit (MMG)" },
  "infernal-shale-rocks": { page: "Money making guide/Mining and crushing infernal shale (Infernal shale rocks)", title: "Infernal shale rocks (MMG)" },
  "infernal-shale": { page: "Money making guide/Mining and crushing infernal shale (Tick manipulation)", title: "Infernal shale tick manip (MMG)" },
  amethyst: { page: "Money making guide/Mining amethyst", title: "Mining amethyst (MMG)" },
  "zeah-salts": { page: "Money making guide/Mining salts", title: "Mining salts (MMG)" },
  "volcanic-ash": { page: "Money making guide/Mining volcanic ash", title: "Mining volcanic ash (MMG)" },
  "lead-ore-deepfin": { page: "Money making guide/Mining lead ore (Deepfin mine)", title: "Mining lead ore Deepfin (MMG)" },
  basalt: { page: "Money making guide/Mining basalt", title: "Mining basalt (MMG)" },
  "runite-ore": { page: "Money making guide/Mining runite ore", title: "Mining runite ore (MMG)" },
  "iron-ore": { page: "Money making guide/Mining iron ore", title: "Mining iron ore (MMG)" },
  "gem-rock": { page: "Money making guide/Mining gemstones", title: "Mining gemstones (MMG)" },
  "rubium-splinters": { page: "Money making guide/Mining rubium splinters", title: "Mining rubium splinters (MMG)" },
  "rubium-splinters-afk": { page: "Money making guide/Mining rubium splinters", title: "Mining rubium splinters (MMG)" },
  "motherlode-mine": { page: "Money making guide/Motherlode Mine", title: "Motherlode Mine (MMG)" },
  "blast-mine": { page: "Money making guide/Blast mining", title: "Blast mining (MMG)" },
  "dark-crab": { page: "Money making guide/Catching dark crabs", title: "Catching dark crabs (MMG)" },
  minnows: { page: "Money making guide/Catching minnows", title: "Catching minnows (MMG)" },
  "sacred-eel": { page: "Money making guide/Catching sacred eels", title: "Catching sacred eels (MMG)" },
  "infernal-eel": { page: "Money making guide/Catching infernal eels", title: "Catching infernal eels (MMG)" },
  "drift-net": { page: "Money making guide/Drift net fishing", title: "Drift net fishing (MMG)" },
  "magic-logs": { page: "Money making guide/Cutting magic logs", title: "Cutting magic logs (MMG)" },
  "redwood-logs": { page: "Money making guide/Cutting redwood logs", title: "Cutting redwood logs (MMG)" },
  "yew-logs": { page: "Money making guide/Cutting yew logs", title: "Cutting yew logs (MMG)" },
  "camphor-logs": { page: "Money making guide/Cutting camphor logs", title: "Cutting camphor logs (MMG)" },
  "engorged-bloodwood": { page: "Money making guide/Chopping the engorged bloodwood tree", title: "Engorged bloodwood (MMG)" },
  "bf-iron": { page: "Money making guide/Smelting iron bars at Blast Furnace", title: "BF iron bars (MMG)" },
  "bf-steel": { page: "Money making guide/Smelting steel bars at Blast Furnace", title: "BF steel bars (MMG)" },
  "bf-mithril": { page: "Money making guide/Smelting mithril bars at Blast Furnace", title: "BF mithril bars (MMG)" },
  "bf-adamant": { page: "Money making guide/Smelting adamantite bars at Blast Furnace", title: "BF adamant bars (MMG)" },
  "bf-rune": { page: "Money making guide/Smelting runite bars at Blast Furnace", title: "BF rune bars (MMG)" },
  cannonballs: { page: "Money making guide/Smithing steel cannonballs", title: "Smithing cannonballs (MMG)" },
  "cannonballs-double": { page: "Money making guide/Smithing steel cannonballs", title: "Smithing cannonballs (MMG)" },
  "rune-2h": { page: "Money making guide/Smithing rune items", title: "Smithing rune items (MMG)" },
  "astral-runes": { page: "Money making guide/Crafting astral runes", title: "Crafting astral runes (MMG)" },
  "mud-runes": { page: "Money making guide/Crafting mud runes", title: "Crafting mud runes (MMG)" },
  "aether-runes": { page: "Money making guide/Crafting aether runes using scarred extract", title: "Crafting aether runes (MMG)" },
  "sunfire-runes": { page: "Money making guide/Crafting sunfire runes", title: "Crafting sunfire runes (MMG)" },
  elves: { page: "Money making guide/Pickpocketing elves", title: "Pickpocketing elves (MMG)" },
  vyres: { page: "Money making guide/Pickpocketing vyres", title: "Pickpocketing vyres (MMG)" },
  "master-farmers": { page: "Money making guide/Pickpocketing master farmers", title: "Pickpocketing master farmers (MMG)" },
  "ardougne-knights": { page: "Money making guide/Pickpocketing Knights of Ardougne", title: "Pickpocketing knights (MMG)" },
  "yew-longbow": { page: "Money making guide/Fletching yew longbows", title: "Fletching yew longbows (MMG)" },
  "magic-longbow": { page: "Money making guide/Fletching magic longbows", title: "Fletching magic longbows (MMG)" },
  "redwood-pyre": { page: "Money making guide/Making redwood pyre logs", title: "Making redwood pyre logs (MMG)" },
  "sepulchre-floor-5-loot": { page: "Money making guide/Looting the Hallowed Sepulchre", title: "Looting Hallowed Sepulchre (MMG)" },
  "wilderness-agility-tickets": { page: "Money making guide/Wilderness Agility Course", title: "Wilderness Agility Course (MMG)" },
};

type PrefixRule = { match: (id: string) => boolean; ref: WikiRef };

const PREFIX_RULES: PrefixRule[] = [
  { match: (id) => id.startsWith("rainbow-crabs"), ref: BY_ID["rainbow-crabs"] },
  { match: (id) => id.endsWith("-kebbit"), ref: { page: "Falconry", title: "Falconry" } },
  { match: (id) => id.startsWith("birdhouse-"), ref: { page: "Bird house trapping", title: "Bird house trapping" } },
  { match: (id) => id.startsWith("infernal-shale"), ref: BY_ID["infernal-shale"] },
  { match: (id) => id.startsWith("rubium-splinters"), ref: BY_ID["rubium-splinters"] },
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
