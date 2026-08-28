import { createServerFn } from "@tanstack/react-start";
import { parseWikiRates } from "@/lib/wiki-parse";

const WIKI_API = "https://oldschool.runescape.wiki/api.php";
const UA = "GEWatch/1.0 (method rate check; https://github.com/Brandon1212b/osrs-item-tracker)";

export type WikiCheckPageInput = {
  slot: "mmg" | "skillGuide" | "wiki";
  href: string;
};

export type WikiCheckPageResult = {
  slot: "mmg" | "skillGuide" | "wiki";
  href: string;
  title?: string;
  xpPerHour?: number;
  gpPerHour?: number;
  xpBySkill?: Record<string, number>;
  error?: string;
};

function pageFromHref(href: string): string | null {
  try {
    const u = new URL(href);
    const marker = "/w/";
    const i = u.pathname.indexOf(marker);
    if (i < 0) return null;
    return decodeURIComponent(u.pathname.slice(i + marker.length).replace(/_/g, " "));
  } catch {
    return null;
  }
}

async function fetchParsedHtml(page: string): Promise<{ html: string; title?: string }> {
  const url = `${WIKI_API}?${new URLSearchParams({
    action: "parse",
    page,
    prop: "text|displaytitle",
    format: "json",
    redirects: "1",
  }).toString()}`;
  const res = await fetch(url, {
    headers: { "User-Agent": UA, Accept: "application/json" },
  });
  if (!res.ok) throw new Error(`Wiki ${res.status}`);
  const json = (await res.json()) as {
    error?: { info?: string };
    parse?: { text?: { "*"?: string }; title?: string };
  };
  if (json.error?.info) throw new Error(json.error.info);
  const html = json.parse?.text?.["*"];
  if (!html) throw new Error("Empty wiki parse");
  return { html, title: json.parse?.title };
}

export const checkWikiPages = createServerFn({ method: "POST" })
  .inputValidator((d: { pages: WikiCheckPageInput[]; skillKey?: string }) => d)
  .handler(async ({ data }): Promise<WikiCheckPageResult[]> => {
    const results: WikiCheckPageResult[] = [];
    for (const page of data.pages) {
      const title = pageFromHref(page.href);
      if (!title) {
        results.push({ slot: page.slot, href: page.href, error: "Bad wiki URL" });
        continue;
      }
      try {
        const parsed = await fetchParsedHtml(title);
        const rates = parseWikiRates(parsed.html, data.skillKey);
        results.push({
          slot: page.slot,
          href: page.href,
          title: parsed.title ?? title,
          xpPerHour: rates.xpPerHour,
          gpPerHour: rates.gpPerHour,
          xpBySkill: rates.xpBySkill,
        });
      } catch (err) {
        results.push({
          slot: page.slot,
          href: page.href,
          title,
          error: err instanceof Error ? err.message : "Wiki fetch failed",
        });
      }
    }
    return results;
  });
