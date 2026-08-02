import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useMemo, useRef } from "react";
import {
  Search,
  Shield,
  Pickaxe,
  Sword,
  Target,
  Sparkles,
  Package,
} from "lucide-react";
import { z } from "zod";

import {
  CATALOG,
  GEAR_COMBAT_FILTERS,
  GEAR_SLOT_FILTERS,
  GEAR_TIER_FILTERS,
  SKILLING_FILTERS,
  type CatalogItem,
} from "@/lib/osrs-catalog";
import { fetchSnapshot, fetchTrends } from "@/lib/osrs.functions";
import { ItemCard } from "@/components/ItemCard";
import { CraftingMethodsPanel } from "@/components/CraftingMethods";
import type { PriceRow, Trend } from "@/lib/osrs.server";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Filter = "all" | "gear" | "skilling" | "supplies";
type SortKey = "drop" | "cheap" | "upgrade";

const DEFAULT_G = 2_000_000;

const homeSearchSchema = z.object({
  filter: z.enum(["all", "gear", "skilling", "supplies"]).catch("all"),
  sort: z.enum(["drop", "cheap", "upgrade"]).catch("drop"),
  q: z.string().catch(""),
  combat: z.string().catch("all"),
  slot: z.string().catch("all"),
  tier: z.string().catch("all"),
  skill: z.string().catch("all"),
  g: z.coerce.number().catch(DEFAULT_G),
});

export type HomeSearch = z.infer<typeof homeSearchSchema>;

const SCROLL_KEY = "ge-watch-home-scroll";

export const Route = createFileRoute("/")({
  validateSearch: (search: Record<string, unknown>): HomeSearch => homeSearchSchema.parse(search),
  head: () => ({
    meta: [
      { title: "GE Watch — OSRS Gear & Skilling Price Tracker" },
      {
        name: "description",
        content:
          "Live OSRS Grand Exchange prices for gear and skilling supplies, with 180-day buy signals so you know when an item is actually cheap.",
      },
      { property: "og:title", content: "GE Watch — OSRS Gear & Skilling Price Tracker" },
      {
        property: "og:description",
        content:
          "Live OSRS prices for gear upgrades and wiki-recommended skilling supplies, scored against their 180-day range.",
      },
    ],
  }),
  component: Home,
});

const WIKI_IMG = "https://oldschool.runescape.wiki/images/";

const STR_BONUS: Record<string, number> = {
  "Abyssal whip": 82,
  "Dragon scimitar": 67,
  "Bandos chestplate": 4,
  "Bandos tassets": 2,
  "Amulet of torture": 10,
  "Amulet of fury": 8,
  "Amulet of strength": 10,
  "Primordial boots": 5,
  "Dragon claws": 56,
  "Ghrazi rapier": 94,
  "Scythe of vitur (uncharged)": 75,
  "Inquisitor's mace": 89,
  "Torva full helm": 8,
  "Torva platebody": 6,
  "Torva platelegs": 4,
  "Toxic blowpipe (empty)": 40,
  "Dragon boots": 4,
  "Ferocious gloves": 14,
  "Berserker ring": 8,
  "Ultor ring": 12,
  "Amulet of rancour": 12,
};

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  Sword,
  Target,
  Sparkles,
  Package,
};

function priceOf(row: PriceRow): number {
  return row.high ?? row.low ?? 0;
}

function dropFraction(row: PriceRow, trend?: Trend): number {
  if (!trend?.high180) return 0;
  const p = priceOf(row);
  if (p <= 0) return 0;
  return Math.max(0, (trend.high180 - p) / trend.high180);
}

function upgradeScore(row: PriceRow): number {
  const str = STR_BONUS[row.name];
  if (str == null || str <= 0) return -1;
  const p = priceOf(row);
  if (p <= 0) return -1;
  return (str / p) * 1_000_000;
}

function isSuppliesItem(tags: string[]) {
  return tags.includes("supplies") || tags.includes("food") || tags.includes("potion");
}

function uniqueById(rows: PriceRow[]): PriceRow[] {
  const seen = new Set<number>();
  const out: PriceRow[] = [];
  for (const row of rows) {
    if (seen.has(row.id)) continue;
    seen.add(row.id);
    out.push(row);
  }
  return out;
}

function Home() {
  const navigate = useNavigate({ from: "/" });
  const search = Route.useSearch();
  const { filter, sort, q: query, combat: gearCombat, slot: gearSlot, tier: gearTier, skill, g } = search;
  const moneyPerHour = Number.isFinite(g) && g > 0 ? g : DEFAULT_G;

  const patchSearch = (patch: Partial<HomeSearch>) => {
    void navigate({
      search: (prev) => {
        const next = { ...prev, ...patch };
        const cleaned: Record<string, string | number> = {};
        if (next.filter && next.filter !== "all") cleaned.filter = next.filter;
        if (next.sort && next.sort !== "drop") cleaned.sort = next.sort;
        if (next.q) cleaned.q = next.q;
        if (next.combat && next.combat !== "all") cleaned.combat = next.combat;
        if (next.slot && next.slot !== "all") cleaned.slot = next.slot;
        if (next.tier && next.tier !== "all") cleaned.tier = next.tier;
        if (next.skill && next.skill !== "all") cleaned.skill = next.skill;
        if (next.g && next.g !== DEFAULT_G) cleaned.g = next.g;
        return cleaned as HomeSearch;
      },
      replace: true,
    });
  };

  const snapshotFn = useServerFn(fetchSnapshot);
  const trendsFn = useServerFn(fetchTrends);

  const snapshot = useQuery({
    queryKey: ["osrs-snapshot"],
    queryFn: () => snapshotFn(),
    refetchInterval: 120_000,
  });
  const trends = useQuery({
    queryKey: ["osrs-trends"],
    queryFn: () => trendsFn(),
    staleTime: 30 * 60_000,
  });

  const rowsByName = useMemo(
    () => new Map((snapshot.data ?? []).map((r) => [r.name, r])),
    [snapshot.data],
  );

  const itemByName = useMemo(() => {
    const map = new Map<string, CatalogItem>();
    for (const g of CATALOG) {
      for (const i of g.items) {
        const existing = map.get(i.name);
        if (existing) {
          map.set(i.name, {
            name: i.name,
            tags: [...new Set([...existing.tags, ...i.tags])],
          });
        } else {
          map.set(i.name, i);
        }
      }
    }
    return map;
  }, []);

  const showCraftingMethods = filter === "skilling" && skill === "crafting";

  const groups = useMemo(() => {
    if (showCraftingMethods) return [];
    const q = query.trim().toLowerCase();
    return CATALOG.filter((g) => {
      if (filter === "all") return true;
      if (filter === "skilling") return g.kind === "skilling";
      if (filter === "gear") return g.kind === "gear" && g.id !== "utility";
      if (filter === "supplies") return g.id === "utility";
      return true;
    })
      .map((g) => ({
        ...g,
        rows: g.items
          .map((item) => rowsByName.get(item.name))
          .filter((r): r is NonNullable<typeof r> => !!r)
          .filter((r) => (q ? r.name.toLowerCase().includes(q) : true))
          .filter((r) => {
            const tags = itemByName.get(r.name)?.tags ?? [];
            if (filter === "gear") {
              if (isSuppliesItem(tags)) return false;
              if (gearCombat !== "all" && !tags.includes(gearCombat)) return false;
              if (gearSlot !== "all" && !tags.includes(gearSlot)) return false;
              if (gearTier !== "all" && !tags.includes(gearTier)) return false;
            }
            if (filter === "skilling") {
              if (skill !== "all" && !tags.includes(skill)) return false;
            }
            if (filter === "supplies") {
              return isSuppliesItem(tags) || tags.includes("neck");
            }
            return true;
          }),
      }))
      .filter((g) => g.rows.length > 0);
  }, [
    showCraftingMethods,
    filter,
    query,
    rowsByName,
    gearCombat,
    gearSlot,
    gearTier,
    skill,
    itemByName,
  ]);

  const allRows = useMemo(() => {
    const rows = uniqueById(groups.flatMap((g) => g.rows));
    const trendMap = trends.data ?? {};

    return [...rows].sort((a, b) => {
      if (sort === "cheap") {
        return priceOf(a) - priceOf(b) || a.name.localeCompare(b.name);
      }
      if (sort === "upgrade") {
        const ua = upgradeScore(a);
        const ub = upgradeScore(b);
        if (ua < 0 && ub < 0) return a.name.localeCompare(b.name);
        if (ua < 0) return 1;
        if (ub < 0) return -1;
        return ub - ua || a.name.localeCompare(b.name);
      }
      const da = dropFraction(a, trendMap[a.id]);
      const db = dropFraction(b, trendMap[b.id]);
      return db - da || a.name.localeCompare(b.name);
    });
  }, [groups, trends.data, sort]);

  const restoredScroll = useRef(false);
  useEffect(() => {
    if (restoredScroll.current || snapshot.isLoading) return;
    try {
      const raw = sessionStorage.getItem(SCROLL_KEY);
      if (raw == null) return;
      const y = Number(raw);
      sessionStorage.removeItem(SCROLL_KEY);
      if (!Number.isFinite(y) || y <= 0) return;
      restoredScroll.current = true;
      requestAnimationFrame(() => {
        window.scrollTo(0, y);
      });
    } catch {
      /* private mode */
    }
  }, [snapshot.isLoading, allRows.length]);

  const handleFilterChange = (next: Filter) => {
    patchSearch({
      filter: next,
      combat: "all",
      slot: "all",
      tier: "all",
      skill: "all",
    });
  };

  const showGearSub = filter === "gear";
  const showSkillSub = filter === "skilling";
  const gridKey = `${filter}:${gearCombat}:${gearSlot}:${gearTier}:${skill}:${sort}:${query}`;

  return (
    <main className="mx-auto w-full max-w-7xl px-4 pb-24 pt-8 sm:px-6">
      <div className="sticky top-0 z-10 -mx-4 flex flex-col gap-3 bg-background/85 px-4 py-3 backdrop-blur sm:-mx-6 sm:flex-row sm:items-start sm:px-6">
        <div className="flex flex-1 flex-wrap gap-2">
          <Tab active={filter === "all"} onClick={() => handleFilterChange("all")} label="Everything" />
          <Tab
            active={filter === "gear"}
            onClick={() => handleFilterChange("gear")}
            label="Gear"
            icon={<Shield className="size-3.5" />}
          />
          <Tab
            active={filter === "skilling"}
            onClick={() => handleFilterChange("skilling")}
            label="Skilling"
            icon={<Pickaxe className="size-3.5" />}
          />
          <Tab
            active={filter === "supplies"}
            onClick={() => handleFilterChange("supplies")}
            label="Supplies"
            icon={<Package className="size-3.5" />}
          />
        </div>
        {!showCraftingMethods && (
          <div className="flex flex-col gap-2 sm:w-72">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => patchSearch({ q: e.target.value })}
                placeholder="Search items…"
                className="pl-9"
              />
            </div>
            <Select value={sort} onValueChange={(v) => patchSearch({ sort: v as SortKey })}>
              <SelectTrigger className="h-9 w-full text-xs" aria-label="Sort items">
                <SelectValue placeholder="Sort by…" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="drop">Largest drop</SelectItem>
                <SelectItem value="cheap">Cheapest</SelectItem>
                <SelectItem value="upgrade">Best upgrade</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      {showGearSub && (
        <div className="mt-4 flex flex-col gap-3">
          <div className="flex flex-wrap gap-1.5">
            <SubTab
              active={gearCombat === "all"}
              onClick={() => patchSearch({ combat: "all" })}
              label="All combat"
            />
            {GEAR_COMBAT_FILTERS.map((f) => (
              <SubTab
                key={f.key}
                active={gearCombat === f.key}
                onClick={() => patchSearch({ combat: f.key })}
                label={f.label}
                icon={ICONS[f.icon]}
              />
            ))}
          </div>

          <div className="flex flex-wrap items-start gap-3">
            <EquipmentPaperDoll
              active={gearSlot}
              onSelect={(slot) => patchSearch({ slot })}
            />
            <div className="flex flex-col gap-1.5">
              <span className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                Progression
              </span>
              <div className="flex flex-col gap-1">
                <SubTab
                  active={gearTier === "all"}
                  onClick={() => patchSearch({ tier: "all" })}
                  label="All stages"
                />
                {GEAR_TIER_FILTERS.map((t) => (
                  <SubTab
                    key={t.key}
                    active={gearTier === t.key}
                    onClick={() => patchSearch({ tier: gearTier === t.key ? "all" : t.key })}
                    label={t.label}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {showSkillSub && (
        <div className="mt-4 flex flex-wrap items-center gap-1.5">
          <SubTab active={skill === "all"} onClick={() => patchSearch({ skill: "all" })} label="All" />
          {SKILLING_FILTERS.map((f) => (
            <WikiIconTab
              key={f.key}
              active={skill === f.key}
              onClick={() => patchSearch({ skill: f.key })}
              label={f.label}
              wikiIcon={f.wikiIcon}
            />
          ))}
        </div>
      )}

      {snapshot.isLoading && (
        <div className="mt-6 grid grid-cols-2 gap-2 sm:gap-3 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="panel h-36 animate-pulse opacity-60 sm:h-56" />
          ))}
        </div>
      )}

      {snapshot.isError && (
        <p className="mt-8 text-sm text-destructive">
          Couldn't reach the live price feed. Try refreshing in a moment.
        </p>
      )}

      {!snapshot.isLoading && showCraftingMethods && (
        <CraftingMethodsPanel
          rowsByName={rowsByName}
          moneyPerHour={moneyPerHour}
          onMoneyPerHourChange={(n) => patchSearch({ g: n })}
        />
      )}

      {!snapshot.isLoading && !showCraftingMethods && allRows.length > 0 && (
        <div
          key={gridKey}
          className="mt-6 grid grid-cols-2 gap-2 sm:gap-3 lg:grid-cols-3 xl:grid-cols-4"
        >
          {allRows.map((row) => (
            <ItemCard key={row.id} row={row} trend={trends.data?.[row.id]} />
          ))}
        </div>
      )}

      {!snapshot.isLoading && !showCraftingMethods && allRows.length === 0 && (
        <p className="mt-10 text-center text-sm text-muted-foreground">
          Nothing matches that filter right now.
        </p>
      )}

      <footer className="mt-16 border-t border-border/60 pt-6 text-xs text-muted-foreground">
        Price data from the OSRS Wiki real-time Grand Exchange API. Not affiliated with Jagex.
      </footer>
    </main>
  );
}

function EquipmentPaperDoll({
  active,
  onSelect,
}: {
  active: string;
  onSelect: (key: string) => void;
}) {
  return (
    <div
      className="inline-grid shrink-0 grid-cols-3 gap-1 rounded-lg border border-border/60 bg-secondary/20 p-1.5"
      style={{ width: "fit-content" }}
    >
      {GEAR_SLOT_FILTERS.map((slot) => (
        <button
          key={slot.key}
          type="button"
          title={slot.label}
          aria-label={slot.label}
          aria-pressed={active === slot.key}
          onClick={() => onSelect(active === slot.key ? "all" : slot.key)}
          style={{ gridRow: slot.row, gridColumn: slot.col }}
          className={`flex size-9 shrink-0 items-center justify-center rounded-md border transition-colors ${
            active === slot.key
              ? "border-primary/70 bg-primary/15 ring-1 ring-primary/40"
              : "border-border/50 bg-background/60 hover:bg-secondary/60"
          }`}
        >
          <img
            src={`${WIKI_IMG}${encodeURIComponent(slot.wikiIcon)}`}
            alt=""
            width={24}
            height={24}
            className="size-6 object-contain opacity-90"
            draggable={false}
          />
        </button>
      ))}
    </div>
  );
}

function Tab({
  active,
  onClick,
  label,
  icon,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  icon?: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-colors ${
        active
          ? "border-primary bg-primary text-primary-foreground"
          : "border-border bg-secondary/50 text-muted-foreground hover:text-foreground"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}

function SubTab({
  active,
  onClick,
  label,
  icon: Icon,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  icon?: React.ComponentType<{ className?: string }> | undefined;
}) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] font-medium transition-colors ${
        active
          ? "border-primary/70 bg-primary/15 text-primary"
          : "border-border/60 bg-secondary/30 text-muted-foreground hover:text-foreground"
      }`}
    >
      {Icon && <Icon className="size-3" />}
      {label}
    </button>
  );
}

function WikiIconTab({
  active,
  onClick,
  label,
  wikiIcon,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  wikiIcon: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={label}
      aria-label={label}
      aria-pressed={active}
      className={`inline-flex size-8 items-center justify-center rounded-full border transition-colors ${
        active
          ? "border-primary/70 bg-primary/15 ring-1 ring-primary/40"
          : "border-border/60 bg-secondary/30 hover:bg-secondary/50"
      }`}
    >
      <img
        src={`${WIKI_IMG}${encodeURIComponent(wikiIcon)}`}
        alt=""
        width={20}
        height={20}
        className="size-5 object-contain"
        draggable={false}
      />
    </button>
  );
}
