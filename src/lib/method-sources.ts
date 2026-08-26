/**
 * Audit tags for /sources.
 *
 * Tags are inferred (conservative: unknown → estimate/red).
 * They are NOT a live scrape of the wiki.
 *
 * Green means: our stored model matches the linked page's method
 * (same inputs / outputs / throughput assumptions), not merely that
 * a wiki page exists. Live GE only turns green when the recipe itself
 * is verified against that page (see VERIFIED_MMG_IDS).
 */
import type { ActivityMethod } from "@/lib/activity-methods";
import { resolveActivityBand } from "@/lib/activity-methods";
import type { SkillingMethod } from "@/components/skilling-types";
import type { PriceRow } from "@/lib/osrs.server";
import { methodWikiLink, resolveMethodWiki } from "@/lib/method-wiki";

export type SourceKind = "wiki-mmg" | "wiki-guide" | "live-ge" | "estimate";
export type LinkKind = "MMG" | "Skill Guide" | "Wiki Page";

export type GpPart = {
  amount: number | null;
  label: "live GE" | "residual";
  source: SourceKind;
  dynamic: boolean;
  missing?: boolean;
};

export type AuditedMethod = {
  skillKey: string;
  skillLabel: string;
  wikiIcon: string;
  id: string;
  label: string;
  level: number;
  kind: "recipe" | "activity";
  xpPerHour: number;
  xpSource: SourceKind;
  xpDynamic: boolean;
  xpLevelScaled: boolean;
  gpParts: GpPart[];
  link: { href: string; title: string; kind: LinkKind };
};

/**
 * Method ids whose inputs/outputs/actions were checked against the linked MMG.
 * Anything else that links to an MMG stays red until added here.
 */
const VERIFIED_MMG_IDS = new Set<string>([
  "sunfire-runes", // Crafting sunfire runes MMG
  "sepulchre-floor-5-loot", // Hallowed Sepulchre (Floor 5) MMG — full loot table
]);

function linkKind(title: string): LinkKind {
  if (/\bMMG\b/i.test(title)) return "MMG";
  if (/training/i.test(title)) return "Skill Guide";
  return "Wiki Page";
}

function isMmg(title: string, page: string): boolean {
  return /\bMMG\b/i.test(title) || /^Money making guide\//i.test(page);
}

function wikiSupportsRates(page: string, title: string): boolean {
  if (page === "Money making guide/Skilling") return false;
  if (isMmg(title, page)) return true;
  if (/training/i.test(title)) return true;
  if (/Strategies/i.test(page) || /Strategies/i.test(title)) return true;
  if (/Forester/i.test(page) || /Wintertodt/i.test(page)) return true;
  if (/Motherlode|Guardians of the Rift|Tempoross|Giants' Foundry|Mahogany Homes|Blast min/i.test(page))
    return true;
  return false;
}

function buyPrice(row: PriceRow | undefined): number | null {
  if (!row) return null;
  return row.high ?? row.low ?? null;
}
function sellPrice(row: PriceRow | undefined): number | null {
  if (!row) return null;
  return row.low ?? row.high ?? null;
}
function afterTaxSell(unitPrice: number): number {
  if (!Number.isFinite(unitPrice) || unitPrice <= 0) return unitPrice;
  const tax = Math.min(Math.floor(unitPrice * 0.02), 5_000_000);
  return unitPrice - tax;
}

function recipeXpSource(id: string, page: string, title: string): SourceKind {
  if (!wikiSupportsRates(page, title)) return "estimate";
  if (isMmg(title, page)) {
    return VERIFIED_MMG_IDS.has(id) ? "wiki-mmg" : "estimate";
  }
  return "wiki-guide";
}

export function auditRecipe(
  skillKey: string,
  skillLabel: string,
  wikiIcon: string,
  method: SkillingMethod,
  rowsByName: Map<string, PriceRow>,
): AuditedMethod {
  const wiki = methodWikiLink(method.id, skillKey);
  const ref = resolveMethodWiki(method.id, skillKey);
  const xpPerHour = method.xp * method.actionsPerHour;
  const mmg = isMmg(wiki.title, ref.page);
  const verifiedMmg = mmg && VERIFIED_MMG_IDS.has(method.id);

  let inputCost = 0;
  let outputValue = 0;
  let missing = false;
  let hasIo = false;

  for (const p of method.inputs) {
    hasIo = true;
    if (p.name === "Coins") {
      inputCost += p.qty;
      continue;
    }
    const unit = buyPrice(rowsByName.get(p.name));
    if (unit == null) {
      missing = true;
      continue;
    }
    inputCost += unit * p.qty;
  }
  const outs =
    method.outputs && method.outputs.length > 0
      ? method.outputs
      : method.output
        ? [method.output]
        : [];
  for (const p of outs) {
    hasIo = true;
    if (p.name === "Coins") {
      outputValue += p.qty;
      continue;
    }
    const unit = sellPrice(rowsByName.get(p.name));
    if (unit == null) {
      missing = true;
      continue;
    }
    outputValue += afterTaxSell(unit) * p.qty;
  }

  const gpParts: GpPart[] = [];
  if (hasIo) {
    const amount = missing ? null : Math.round((outputValue - inputCost) * method.actionsPerHour);
    const gpSource: SourceKind =
      mmg && !verifiedMmg ? "estimate" : missing ? "estimate" : "live-ge";
    gpParts.push({
      amount,
      label: "live GE",
      source: gpSource,
      dynamic: true,
      missing,
    });
  }

  return {
    skillKey,
    skillLabel,
    wikiIcon,
    id: method.id,
    label: method.label,
    level: method.level,
    kind: "recipe",
    xpPerHour,
    xpSource: recipeXpSource(method.id, ref.page, wiki.title),
    xpDynamic: false,
    xpLevelScaled: false,
    gpParts,
    link: { href: wiki.href, title: wiki.title, kind: linkKind(wiki.title) },
  };
}

export function auditActivity(
  skillKey: string,
  skillLabel: string,
  wikiIcon: string,
  activity: ActivityMethod,
  rowsByName: Map<string, PriceRow>,
): AuditedMethod {
  const wiki = methodWikiLink(activity.id, skillKey);
  const ref = resolveMethodWiki(activity.id, skillKey);
  const band = resolveActivityBand(activity, 99);
  const xpSupported = wikiSupportsRates(ref.page, wiki.title);
  const mmg = isMmg(wiki.title, ref.page);
  const verifiedMmg = mmg && VERIFIED_MMG_IDS.has(activity.id);
  const xpSource: SourceKind = !xpSupported
    ? "estimate"
    : mmg
      ? verifiedMmg
        ? "wiki-mmg"
        : "estimate"
      : "wiki-guide";

  let live = 0;
  let missing = false;
  const hasLive = activity.rewards.length > 0 || activity.consumables.length > 0;

  for (const r of activity.rewards) {
    if (r.name === "Coins") {
      live += r.expectedQtyPerHour;
      continue;
    }
    const unit = sellPrice(rowsByName.get(r.name));
    if (unit == null) {
      missing = true;
      continue;
    }
    live += afterTaxSell(unit) * r.expectedQtyPerHour;
  }
  for (const c of activity.consumables) {
    if (c.name === "Coins") {
      live -= c.qty;
      continue;
    }
    const unit = buyPrice(rowsByName.get(c.name));
    if (unit == null) {
      missing = true;
      continue;
    }
    live -= unit * c.qty;
  }

  const residual = band.expectedLootGpPerHour ?? 0;
  const gpParts: GpPart[] = [];
  if (hasLive) {
    const gpSource: SourceKind =
      mmg && !verifiedMmg ? "estimate" : missing ? "estimate" : "live-ge";
    gpParts.push({
      amount: missing ? null : Math.round(live),
      label: "live GE",
      source: gpSource,
      dynamic: true,
      missing,
    });
  }
  if (residual !== 0) {
    const residualFromMmg = verifiedMmg && !hasLive;
    gpParts.push({
      amount: residual,
      label: "residual",
      source: residualFromMmg ? "wiki-mmg" : "estimate",
      dynamic: false,
    });
  }

  return {
    skillKey,
    skillLabel,
    wikiIcon,
    id: activity.id,
    label: activity.label,
    level: activity.level,
    kind: "activity",
    xpPerHour: band.xpPerHour,
    xpSource,
    xpDynamic: false,
    xpLevelScaled: activity.rateBands.length > 1,
    gpParts,
    link: { href: wiki.href, title: wiki.title, kind: linkKind(wiki.title) },
  };
}

export function sourceIsTrusted(s: SourceKind): boolean {
  return s === "wiki-mmg" || s === "wiki-guide" || s === "live-ge";
}

export function rowHasRed(row: AuditedMethod): boolean {
  if (!sourceIsTrusted(row.xpSource)) return true;
  if (row.gpParts.some((p) => !sourceIsTrusted(p.source))) return true;
  return false;
}

export function rowHasLiveGe(row: AuditedMethod): boolean {
  return row.gpParts.some((p) => p.dynamic);
}
