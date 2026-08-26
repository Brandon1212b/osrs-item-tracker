import {
  methodWikiLink,
  resolveMethodWiki,
  wikiHref,
} from "@/lib/method-wiki";

export type WikiSlot = { href: string; title: string } | null;

export type MethodLinkTrio = {
  mmg: WikiSlot;
  skillGuide: WikiSlot;
  wiki: WikiSlot;
};

const SKILL_TRAINING_PAGE: Record<string, { page: string; title: string }> = {
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

/** Specific wiki pages that sit alongside an MMG (not the training guide). */
const WIKI_PAGE_BY_ID: Record<string, { page: string; title: string }> = {
  "wintertodt-mass": { page: "Wintertodt", title: "Wintertodt" },
  "tempoross-mass-cook": { page: "Tempoross", title: "Tempoross" },
  "gotr-mass": { page: "Guardians of the Rift", title: "Guardians of the Rift" },
  "giants-foundry": { page: "Giants' Foundry", title: "Giants' Foundry" },
  "mahogany-homes": { page: "Mahogany Homes", title: "Mahogany Homes" },
  "motherlode-mine": { page: "Motherlode Mine", title: "Motherlode Mine" },
  "volcanic-mine": { page: "Volcanic Mine", title: "Volcanic Mine" },
  "blast-mine": { page: "Blast Mine", title: "Blast Mine" },
  "shooting-stars": { page: "Shooting Stars", title: "Shooting Stars" },
  "pyramid-plunder": { page: "Pyramid Plunder", title: "Pyramid Plunder" },
  "stealing-artefacts": { page: "Stealing artefacts", title: "Stealing artefacts" },
  "mta-enchanting": { page: "Mage Training Arena", title: "Mage Training Arena" },
  herbiboar: { page: "Herbiboar", title: "Herbiboar" },
  "mastering-mixology": { page: "Mastering Mixology", title: "Mastering Mixology" },
  "sunfire-runes": { page: "Sunfire rune", title: "Sunfire rune" },
  "hallowed-sepulchre": { page: "Hallowed Sepulchre", title: "Hallowed Sepulchre" },
  "sepulchre-floor-5-loot": { page: "Hallowed Sepulchre", title: "Hallowed Sepulchre" },
  "sepulchre-floor-3": { page: "Hallowed Sepulchre", title: "Hallowed Sepulchre" },
  "sepulchre-floor-4": { page: "Hallowed Sepulchre", title: "Hallowed Sepulchre" },
  "redwood-pyre": { page: "Redwood pyre logs", title: "Redwood pyre logs" },
};

function slot(page: string, title: string): WikiSlot {
  return { href: wikiHref(page), title };
}

export function methodLinkTrio(id: string, skillKey?: string | null): MethodLinkTrio {
  const ref = resolveMethodWiki(id, skillKey);
  const isMmg =
    ref.page.startsWith("Money making guide/") && ref.page !== "Money making guide/Skilling";
  const skill = skillKey ? SKILL_TRAINING_PAGE[skillKey] : undefined;
  const extra = WIKI_PAGE_BY_ID[id];

  let wiki: WikiSlot = extra ? slot(extra.page, extra.title) : null;
  if (!wiki && !isMmg && skill && ref.page !== skill.page && ref.page !== "Money making guide/Skilling") {
    wiki = slot(ref.page, ref.title);
  }

  return {
    mmg: isMmg ? slot(ref.page, ref.title) : null,
    skillGuide: skill ? slot(skill.page, skill.title) : null,
    wiki,
  };
}

export { methodWikiLink };
