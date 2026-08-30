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
  "fishing:shark": { page: "Money making guide/Catching sharks", title: "Catching sharks (MMG)" },
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
};

type PrefixRule = { match: (id: string) => boolean; ref: WikiRef };

const PREFIX_RULES: PrefixRule[] = [
  { match: (id) => id.startsWith("rainbow-crabs"), ref: BY_ID["rainbow-crabs"] },
  { match: (id) => id.endsWith("-kebbit"), ref: { page: "Falconry", title: "Falconry" } },
  { match: (id) => id.startsWith("birdhouse-"), ref: { page: "Bird house trapping", title: "Bird house trapping" } },
  { match: (id) => id.startsWith("infernal-shale"), ref: BY_ID["infernal-shale"] },
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
