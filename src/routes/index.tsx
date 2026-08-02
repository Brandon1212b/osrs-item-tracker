import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Search,
  Shield,
  Pickaxe,
  Sword,
  Target,
  Sparkles,
  Package,
  User,
  X,
  Loader2,
} from "lucide-react";
import { z } from "zod";

import {
  CATALOG,
  GEAR_COMBAT_FILTERS,
  GEAR_SLOT_FILTERS,
  GEAR_TIER_FILTERS,
  SKILLING_FILTERS,
  SUPPLIES_FILTERS,
  type CatalogItem,
} from "@/lib/osrs-catalog";
import { gearSetsForTier, gearSetItemNames } from "@/lib/gear-sets";
import { costPerBonus } from "@/lib/item-bonuses";
import { fetchSnapshot, fetchTrends, fetchPlayerStats, fetchItemRequirements } from "@/lib/osrs.functions";
import {
  PLAYER_STORAGE_KEY,
  meetsRequirements,
  firstMissingRequirement,
  type PlayerSkills,
} from "@/lib/player-stats";
import { ItemCard } from "@/components/ItemCard";
import { CraftingMethodsPanel } from "@/components/CraftingMethods";
import { WikiImage } from "@/components/WikiImage";
import type { PriceRow, RangeKey, Trend } from "@/lib/osrs.server";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Filter = "all" | "gear" | "skilling" | "supplies";
type SortKey = "gainers" | "losers" | "expensive" | "cheap" | "value";

const DEFAULT_G = 2_000_000;
const DEFAULT_RANGE: RangeKey = "6m";
const DEFAULT_SORT: SortKey = "losers";

const RANGE_OPTIONS: { key: RangeKey; label: string }[] = [
  { key: "1d", label: "24h" },
  { key: "1w", label: "1w" },
  { key: "1m", label: "1m" },
  { key: "3m", label: "3m" },
  { key: "6m", label: "6m" },
  { key: "1y", label: "1y" },
];

const homeSearchSchema = z.object({
  filter: z.enum(["all", "gear", "skilling", "supplies"]).catch("all"),
  sort: z.enum(["gainers", "losers", "expensive", "cheap", "value"]).catch(DEFAULT_SORT),
  range: z.enum(["1d", "1w", "1m", "3m", "6m", "1y"]).catch(DEFAULT_RANGE),
  q: z.string().catch(""),
  combat: z.string().catch("all"),
  slot: z.string().catch("all"),
  tier: z.string().catch("all"),
  set: z.string().catch("all"),
  skill: z.string().catch("all"),
  supply: z.string().catch("all"),
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
          "Live OSRS Grand Exchange prices for gear and skilling supplies, with range-based buy signals so you know when an item is actually cheap.",
      },
      { property: "og:title", content: "GE Watch — OSRS Gear & Skilling Price Tracker" },
      {
        property: "og:description",
        content:
          "Live OSRS prices for gear upgrades and wiki-recommended skilling supplies, scored against their selected range.",
      },
    ],
  }),
  component: Home,
});

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  Sword,
  Target,
  Sparkles,
  Package,
};

function priceOf(row: PriceRow): number {
  return row.high ?? row.low ?? 0;
}

function rangeChange(trend?: Trend): number {
  return trend?.change30 ?? 0;
}

function isSuppliesItem(tags: string[]) {
  return (
    tags.includes("supplies") ||
    tags.includes("food") ||
    tags.includes("potion") ||
    tags.includes("ammo")
  );
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

function formatGp(n: number): string {
  if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(2)}B`;
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toLocaleString();
}

function Home() {
  const navigate = useNavigate({ from: "/" });
  const search = Route.useSearch();
  const {
    filter,
    sort,
    range,
    q: query,
    combat: gearCombat,
    slot: gearSlot,
    tier: gearTier,
    set: gearSet,
    skill,
    supply: supplyType,
    g,
  } = search;
  const moneyPerHour = Number.isFinite(g) && g > 0 ? g : DEFAULT_G;

  const [rsnDraft, setRsnDraft] = useState("");
  const [activeRsn, setActiveRsn] = useState<string | null>(() => {
    try {
      return localStorage.getItem(PLAYER_STORAGE_KEY);
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (activeRsn) setRsnDraft(activeRsn);
  }, [activeRsn]);

  const patchSearch = (patch: Partial<HomeSearch>) => {
    void navigate({
      search: (prev) => {
        const next = { ...prev, ...patch };
        const cleaned: Record<string, string | number> = {};
        if (next.filter && next.filter !== "all") cleaned.filter = next.filter;
        if (next.sort && next.sort !== DEFAULT_SORT) cleaned.sort = next.sort;
        if (next.range && next.range !== DEFAULT_RANGE) cleaned.range = next.range;
        if (next.q) cleaned.q = next.q;
        if (next.combat && next.combat !== "all") cleaned.combat = next.combat;
        if (next.slot && next.slot !== "all") cleaned.slot = next.slot;
        if (next.tier && next.tier !== "all") cleaned.tier = next.tier;
        if (next.set && next.set !== "all") cleaned.set = next.set;
        if (next.skill && next.skill !== "all") cleaned.skill = next.skill;
        if (next.supply && next.supply !== "all") cleaned.supply = next.supply;
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
    queryKey: ["osrs-trends", range],
    queryFn: () => trendsFn({ data: { range } }),
    staleTime: range === "1d" || range === "1w" ? 5 * 60_000 : 30 * 60_000,
  });

  const playerStatsFn = useServerFn(fetchPlayerStats);
  const itemReqsFn = useServerFn(fetchItemRequirements);

  const playerQuery = useQuery({
    queryKey: ["osrs-player", activeRsn],
    queryFn: () => playerStatsFn({ data: { rsn: activeRsn! } }),
    enabled: !!activeRsn,
    staleTime: 10 * 60_000,
    retry: 1,
  });

  const playerSkills: PlayerSkills | null = playerQuery.data?.skills ?? null;

  const itemReqsQuery = useQuery({
    queryKey: ["osrs-item-reqs"],
    queryFn: () => itemReqsFn(),
    enabled: !!playerSkills,
    staleTime: 24 * 60 * 60_000,
  });

  const itemReqs = itemReqsQuery.data ?? {};

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

  const setItemNames = useMemo(() => gearSetItemNames(gearSet), [gearSet]);

  const availableSets = useMemo(
    () => gearSetsForTier(gearTier, gearCombat),
    [gearTier, gearCombat],
  );

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
              if (setItemNames && !setItemNames.has(r.name)) return false;
            }
            if (filter === "skilling") {
              if (skill !== "all" && !tags.includes(skill)) return false;
            }
            if (filter === "supplies") {
              if (!(isSuppliesItem(tags) || tags.includes("neck"))) return false;
              if (supplyType !== "all" && !tags.includes(supplyType)) return false;
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
    setItemNames,
    skill,
    supplyType,
    itemByName,
  ]);

  const allRows = useMemo(() => {
    const rows = uniqueById(groups.flatMap((g) => g.rows));
    const trendMap = trends.data ?? {};

    return [...rows].sort((a, b) => {
      if (sort === "cheap") {
        return priceOf(a) - priceOf(b) || a.name.localeCompare(b.name);
      }
      if (sort === "expensive") {
        return priceOf(b) - priceOf(a) || a.name.localeCompare(b.name);
      }
      if (sort === "value") {
        const va = costPerBonus(a, trendMap[a.id], gearCombat);
        const vb = costPerBonus(b, trendMap[b.id], gearCombat);
        if (va == null && vb == null) return a.name.localeCompare(b.name);
        if (va == null) return 1;
        if (vb == null) return -1;
        return va - vb || a.name.localeCompare(b.name);
      }
      const ca = rangeChange(trendMap[a.id]);
      const cb = rangeChange(trendMap[b.id]);
      if (sort === "gainers") return cb - ca || a.name.localeCompare(b.name);
      return ca - cb || a.name.localeCompare(b.name);
    });
  }, [groups, trends.data, sort, gearCombat]);

  const totalCost = useMemo(() => {
    if (filter !== "gear" || gearSet === "all") return null;
    let sum = 0;
    let missing = 0;
    for (const row of allRows) {
      const p = priceOf(row);
      if (p > 0) sum += p;
      else missing += 1;
    }
    return { sum, count: allRows.length, missing };
  }, [filter, gearSet, allRows]);

  // restore scroll
  useEffect(() => {
    try {
      const y = sessionStorage.getItem(SCROLL_KEY);
      if (y) {
        sessionStorage.removeItem(SCROLL_KEY);
        requestAnimationFrame(() => window.scrollTo(0, Number(y)));
      }
    } catch {
      /* */
    }
  }, []);

  const handleFilterChange = (f: Filter) => {
    patchSearch({
      filter: f,
      combat: "all",
      slot: "all",
      tier: "all",
      set: "all",
      skill: "all",
      supply: "all",
    });
  };

  const combatSkillsSummary = useMemo(() => {
    if (!playerSkills) return null;
    const keys = ["attack", "strength", "defence", "ranged", "magic", "prayer", "hitpoints"] as const;
    return keys
      .map((k) => {
        const lvl = playerSkills[k];
        if (lvl == null) return null;
        const short = k === "hitpoints" ? "HP" : k.slice(0, 3).toUpperCase();
        return `${short} ${lvl}`;
      })
      .filter(Boolean)
      .join(" · ");
  }, [playerSkills]);

  return (
    <div className="mx-auto max-w-6xl px-4 pb-16 pt-4 sm:px-6 sm:pt-6">
      <header className="mb-4 flex flex-col gap-1 sm:mb-6">
        <h1 className="font-sans text-xl font-bold tracking-tight text-foreground sm:text-2xl">
          GE Watch
        </h1>
        <p className="text-sm text-muted-foreground">
          Live Grand Exchange prices for gear upgrades and skilling supplies.
        </p>
      </header>

      {/* Sticky filter bar */}
      <div className="sticky top-0 z-30 -mx-4 flex flex-col gap-3 border-b border-border/40 bg-background/95 px-4 py-3 backdrop-blur supports-[backdrop-filter]:bg-background/80 sm:-mx-6 sm:flex-row sm:items-start sm:px-6 pointer-events-auto isolate">
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

        {/* Player RSN lookup */}
        <div className="flex w-full flex-col gap-1 sm:w-auto sm:min-w-[12rem]">
          <form
            className="flex items-center gap-1.5"
            onSubmit={(e) => {
              e.preventDefault();
              const next = rsnDraft.trim();
              if (!next) return;
              try {
                localStorage.setItem(PLAYER_STORAGE_KEY, next);
              } catch {
                /* private mode */
              }
              setActiveRsn(next);
            }}
          >
            <div className="relative min-w-0 flex-1">
              <User className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={rsnDraft}
                onChange={(e) => setRsnDraft(e.target.value)}
                placeholder="RSN…"
                className="h-9 pl-8 pr-8 text-xs"
                aria-label="Old School RuneScape username"
                autoComplete="username"
              />
              {activeRsn && (
                <button
                  type="button"
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  aria-label="Clear player"
                  onClick={() => {
                    try {
                      localStorage.removeItem(PLAYER_STORAGE_KEY);
                    } catch {
                      /* */
                    }
                    setActiveRsn(null);
                    setRsnDraft("");
                  }}
                >
                  <X className="size-3.5" />
                </button>
              )}
            </div>
            <button
              type="submit"
              disabled={!rsnDraft.trim() || playerQuery.isFetching}
              className="inline-flex h-9 shrink-0 items-center justify-center rounded-md border border-border bg-secondary/60 px-2.5 text-xs font-semibold transition-colors hover:bg-secondary disabled:opacity-50"
            >
              {playerQuery.isFetching ? <Loader2 className="size-3.5 animate-spin" /> : "Load"}
            </button>
          </form>
          {playerQuery.isError && (
            <p className="text-[11px] text-destructive">{(playerQuery.error as Error)?.message ?? "Lookup failed"}</p>
          )}
          {playerSkills && combatSkillsSummary && (
            <p className="truncate text-[11px] tabular-nums text-muted-foreground" title={combatSkillsSummary}>
              {playerQuery.data?.name ?? activeRsn}: {combatSkillsSummary}
            </p>
          )}
        </div>
      </div>

      {/* Search + sort + range */}
      <div className="mt-3 flex flex-col gap-2 sm:mt-4 sm:flex-row sm:items-center">
        <div className="relative min-w-0 flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => patchSearch({ q: e.target.value })}
            placeholder="Search items…"
            className="h-10 pl-9"
            aria-label="Search items"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <Select value={sort} onValueChange={(v) => patchSearch({ sort: v as SortKey })}>
            <SelectTrigger className="h-10 w-[9.5rem] text-xs" aria-label="Sort">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="losers">Biggest drops</SelectItem>
              <SelectItem value="gainers">Biggest gains</SelectItem>
              <SelectItem value="cheap">Cheapest</SelectItem>
              <SelectItem value="expensive">Most expensive</SelectItem>
              <SelectItem value="value">Best value</SelectItem>
            </SelectContent>
          </Select>
          <Select value={range} onValueChange={(v) => patchSearch({ range: v as RangeKey })}>
            <SelectTrigger className="h-10 w-[5.5rem] text-xs" aria-label="Price range">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {RANGE_OPTIONS.map((o) => (
                <SelectItem key={o.key} value={o.key}>
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Gear subfilters */}
      {filter === "gear" && (
        <div className="mt-3 space-y-3">
          <div className="flex flex-wrap gap-1.5">
            <SubTab
              active={gearCombat === "all"}
              onClick={() => patchSearch({ combat: "all", set: "all" })}
              label="All combat"
            />
            {GEAR_COMBAT_FILTERS.map((f) => (
              <SubTab
                key={f.key}
                active={gearCombat === f.key}
                onClick={() =>
                  patchSearch({
                    combat: gearCombat === f.key ? "all" : f.key,
                    set: "all",
                  })
                }
                label={f.label}
                icon={ICONS[f.icon]}
              />
            ))}
          </div>

          <div className="flex flex-wrap items-start gap-3 rounded-lg border border-border/50 bg-secondary/15 p-2.5">
            <EquipmentPaperDoll
              active={gearSlot}
              onSelect={(slot) => patchSearch({ slot })}
            />

            <div className="flex min-w-0 flex-1 items-start gap-3">
              <div className="flex shrink-0 flex-col gap-1.5">
                <span className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                  Progression
                </span>
                <div className="flex flex-col gap-1">
                  <SubTab
                    active={gearTier === "all"}
                    onClick={() => patchSearch({ tier: "all", set: "all" })}
                    label="All stages"
                  />
                  {GEAR_TIER_FILTERS.map((t) => (
                    <SubTab
                      key={t.key}
                      active={gearTier === t.key}
                      onClick={() =>
                        patchSearch({
                          tier: gearTier === t.key ? "all" : t.key,
                          set: "all",
                        })
                      }
                      label={t.label}
                    />
                  ))}
                </div>
              </div>

              {availableSets.length > 0 && (
                <div className="flex min-w-0 flex-1 flex-col gap-1.5 border-l border-border/60 pl-3">
                  <span className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                    Wiki stage
                  </span>
                  <div className="flex max-h-[11.5rem] flex-col gap-1 overflow-y-auto overscroll-contain pr-0.5">
                    <SubTab
                      active={gearSet === "all"}
                      onClick={() => patchSearch({ set: "all" })}
                      label="All in stage"
                    />
                    {availableSets.map((s) => (
                      <SubTab
                        key={s.id}
                        active={gearSet === s.id}
                        onClick={() => patchSearch({ set: gearSet === s.id ? "all" : s.id })}
                        label={s.label}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {totalCost && (
            <div className="rounded-lg border border-border/50 bg-secondary/20 px-3 py-2 text-sm">
              <span className="text-muted-foreground">Displayed set cost · </span>
              <span className="font-bold tabular-nums gold-text">{formatGp(totalCost.sum)}</span>
              <span className="text-muted-foreground">
                {" "}({totalCost.count} items
                {totalCost.missing > 0 ? `, ${totalCost.missing} missing price` : ""})
              </span>
            </div>
          )}
        </div>
      )}

      {/* Skilling subfilters */}
      {filter === "skilling" && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          <SubTab
            active={skill === "all"}
            onClick={() => patchSearch({ skill: "all" })}
            label="All skills"
          />
          {SKILLING_FILTERS.map((f) => (
            <SubTab
              key={f.key}
              active={skill === f.key}
              onClick={() => patchSearch({ skill: skill === f.key ? "all" : f.key })}
              label={f.label}
            />
          ))}
        </div>
      )}

      {/* Supplies subfilters */}
      {filter === "supplies" && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          <SubTab
            active={supplyType === "all"}
            onClick={() => patchSearch({ supply: "all" })}
            label="All supplies"
          />
          {SUPPLIES_FILTERS.map((f) => (
            <SubTab
              key={f.key}
              active={supplyType === f.key}
              onClick={() => patchSearch({ supply: supplyType === f.key ? "all" : f.key })}
              label={f.label}
              iconUrl={f.icon}
            />
          ))}
        </div>
      )}

      {showCraftingMethods ? (
        <CraftingMethodsPanel
          rowsByName={rowsByName}
          trendsById={trends.data}
          moneyPerHour={moneyPerHour}
          onMoneyPerHourChange={(n) => patchSearch({ g: n })}
          playerSkills={playerSkills}
        />
      ) : snapshot.isLoading ? (
        <p className="mt-8 text-center text-sm text-muted-foreground">Loading prices…</p>
      ) : allRows.length === 0 ? (
        <p className="mt-8 text-center text-sm text-muted-foreground">No items match.</p>
      ) : (
        <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3 lg:grid-cols-4">
          {allRows.map((row) => {
            const reqs = itemReqs[row.id];
            const locked = playerSkills != null && !meetsRequirements(playerSkills, reqs);
            const lockReason = locked ? firstMissingRequirement(playerSkills, reqs) : null;
            return (
              <ItemCard
                key={row.id}
                row={row}
                trend={trends.data?.[row.id]}
                locked={locked}
                lockReason={lockReason}
              />
            );
          })}
        </div>
      )}
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
      type="button"
      onClick={onClick}
      className={`inline-flex h-9 items-center gap-1.5 rounded-full border px-3 text-xs font-semibold transition-colors ${
        active
          ? "border-primary/60 bg-primary/15 text-foreground"
          : "border-border/60 bg-secondary/30 text-muted-foreground hover:border-border hover:bg-secondary/50 hover:text-foreground"
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
  icon,
  iconUrl,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  iconUrl?: string;
}) {
  const Icon = icon;
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex h-8 items-center gap-1.5 rounded-md border px-2.5 text-[11px] font-medium transition-colors ${
        active
          ? "border-primary/50 bg-primary/12 text-foreground"
          : "border-transparent bg-transparent text-muted-foreground hover:bg-secondary/40 hover:text-foreground"
      }`}
    >
      {Icon && <Icon className="size-3.5" />}
      {iconUrl && (
        <WikiImage icon={iconUrl} alt="" width={16} height={16} className="size-4" />
      )}
      {label}
    </button>
  );
}

function EquipmentPaperDoll({
  active,
  onSelect,
}: {
  active: string;
  onSelect: (slot: string) => void;
}) {
  const slots = GEAR_SLOT_FILTERS;
  return (
    <div className="flex shrink-0 flex-col gap-1.5">
      <span className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">Slot</span>
      <div className="grid grid-cols-3 gap-1">
        {slots.map((s) => (
          <SlotButton
            key={s.key}
            active={active === s.key}
            onClick={() => onSelect(active === s.key ? "all" : s.key)}
            label={s.label}
            icon={s.icon}
          />
        ))}
      </div>
    </div>
  );
}

function SlotButton({
  active,
  onClick,
  label,
  icon,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  icon?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={label}
      aria-label={label}
      aria-pressed={active}
      className={`flex size-9 items-center justify-center rounded-md border transition-colors ${
        active
          ? "border-primary/60 bg-primary/15"
          : "border-border/40 bg-secondary/20 hover:border-border hover:bg-secondary/40"
      }`}
    >
      {icon ? (
        <WikiImage icon={icon} alt={label} width={20} height={20} className="size-5" />
      ) : (
        <span className="text-[9px] font-medium text-muted-foreground">{label.slice(0, 3)}</span>
      )}
    </button>
  );
}
