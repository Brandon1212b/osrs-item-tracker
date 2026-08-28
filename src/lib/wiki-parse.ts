/** Parse XP/h and GP/h out of an OSRS Wiki HTML page. */

export type ParsedWikiRates = {
  xpPerHour?: number;
  xpBySkill?: Record<string, number>;
  gpPerHour?: number;
};

function parseCommaNumber(raw: string): number | undefined {
  const n = Number(raw.replace(/,/g, ""));
  return Number.isFinite(n) ? n : undefined;
}

function sliceAround(html: string, needle: RegExp, after = 5000): string {
  const m = needle.exec(html);
  if (!m || m.index == null) return "";
  return html.slice(m.index, m.index + after);
}

/** MMG Results table: Profit coins + Experience gained skill chips. */
export function parseWikiRates(html: string, preferSkill?: string): ParsedWikiRates {
  const out: ParsedWikiRates = {};

  const profitBlock = sliceAround(html, />Profit</i) || sliceAround(html, /Profit</i);
  const profitCoin = profitBlock.match(/coins[^>]*>\s*([\d,]+)/i);
  if (profitCoin) out.gpPerHour = parseCommaNumber(profitCoin[1]!);

  const xpBySkill: Record<string, number> = {};
  const chipRe = /data-skill="([^"]+)"[^>]*data-level="([\d,]+)"/gi;
  let chip: RegExpExecArray | null;
  while ((chip = chipRe.exec(html))) {
    const skill = chip[1]!.toLowerCase();
    const xp = parseCommaNumber(chip[2]!);
    if (xp != null && xp >= 100 && xpBySkill[skill] == null) xpBySkill[skill] = xp;
  }
  if (Object.keys(xpBySkill).length > 0) {
    out.xpBySkill = xpBySkill;
    const prefer = preferSkill?.toLowerCase();
    if (prefer && xpBySkill[prefer] != null) out.xpPerHour = xpBySkill[prefer];
    else out.xpPerHour = Object.values(xpBySkill)[0];
  }

  if (out.xpPerHour == null) {
    const xpBlock = sliceAround(html, /Experience gained/i);
    const first = xpBlock.match(/([\d]{1,3}(?:,\d{3})+)/);
    if (first) out.xpPerHour = parseCommaNumber(first[1]!);
  }

  if (out.xpPerHour == null) {
    const xph = html.match(/([\d]{1,3}(?:,\d{3})+)\s*(?:XP\/h|xp\/h|XP per hour)/i);
    if (xph) out.xpPerHour = parseCommaNumber(xph[1]!);
  }

  return out;
}
