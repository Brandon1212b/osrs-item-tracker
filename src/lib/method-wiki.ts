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
