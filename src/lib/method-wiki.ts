/**
 * Best OSRS Wiki page for each /methods row.
 *
 * Preference order:
 *  1. Dedicated money-making guide for that exact method
 *  2. The activity / course / spell / item article
 *  3. Members skill training guide
 *
 * Pages checked against oldschool.runescape.wiki (Aug 2026).
 */

import wikiPages from "./method-wiki-pages.json";

export type WikiRef = {
  /** Wiki page title (spaces OK; turned into /w/Title) */
  page: string;
  /** Short label shown in the ? popover */
  title: string;
};

const WIKI_ORIGIN = "https://oldschool.runescape.wiki/w/";

export function wikiHref(page: string): string {
  return WIKI_ORIGIN + page.replace(/ /g, "_");
}

type WikiMaps = {
  skillTraining: Record<string, WikiRef>;
  bySkillId: Record<string, WikiRef>;
  byId: Record<string, WikiRef>;
};

const pages = wikiPages as WikiMaps;
const SKILL_TRAINING = pages.skillTraining;
const BY_SKILL_ID = pages.bySkillId;
const BY_ID = pages.byId;

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
  { match: (id) => id.includes("battlestaff"), ref: { page: "Battlestaff", title: "Battlestaves" } },
  { match: (id) => id.includes("dhide"), ref: { page: "Crafting#Dragonhide", title: "Dragonhide crafting" } },
  { match: (id) => id.endsWith("-herbs"), ref: { page: "Money making guide/Farming herbs", title: "Farming herbs (MMG)" } },
  { match: (id) => id.endsWith("-tree") || id === "calquat" || id === "celastrus", ref: { page: "Farming training", title: "Farming training" } },
  { match: (id) => id.includes("dart-tip") || id.endsWith("-darts"), ref: { page: "Dart", title: "Darts" } },
  { match: (id) => id.includes("nails"), ref: { page: "Nails", title: "Nails" } },
  { match: (id) => id.includes("bolt-tips"), ref: { page: "Bolt tips", title: "Bolt tips" } },
  { match: (id) => id.includes("bolts"), ref: { page: "Bolts", title: "Bolts" } },
  { match: (id) => id.includes("arrow"), ref: { page: "Arrows", title: "Arrows" } },
  { match: (id) => id.includes("longbow"), ref: { page: "Pay-to-play Fletching training", title: "Fletching training" } },
  { match: (id) => id.startsWith("divine-"), ref: { page: "Divine potion", title: "Divine potions" } },
  { match: (id) => id.startsWith("super-") || id.endsWith("-potion"), ref: { page: "Pay-to-play Herblore training", title: "Herblore training" } },
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
