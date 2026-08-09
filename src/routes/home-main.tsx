import {
  Search,
  Shield,
  Pickaxe,
  Package,
  User,
  X,
  Loader2,
  Sword,
  Target,
  Sparkles,
} from "lucide-react";
import {
  GEAR_COMBAT_FILTERS,
  GEAR_TIER_FILTERS,
  SKILLING_FILTERS,
  SUPPLIES_FILTERS,
} from "@/lib/osrs-catalog";
import { formatCompact } from "@/lib/format";
import { ItemCard } from "@/components/ItemCard";
import { WikiImage } from "@/components/WikiImage";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { meetsRequirements, firstMissingRequirement, type PlayerSkills } from "@/lib/player-stats";
import type { PriceRow, RangeKey, Trend } from "@/lib/osrs.server";
import type { UseQueryResult } from "@tanstack/react-query";
import type { gearSetsForTier } from "@/lib/gear-sets";
import { EquipmentPaperDoll, Tab, SubTab, WikiIconTab } from "./home-ui";
import type { HomeSearch } from "./index";

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  Sword,
  Target,
  Sparkles,
  Package,
};

type Filter = "all" | "gear" | "skilling" | "supplies";
type SortKey = "gainers" | "losers" | "expensive" | "cheap" | "value";

const RANGE_OPTIONS: { key: RangeKey; label: string }[] = [
  { key: "1d", label: "24h" },
  { key: "1w", label: "1w" },
  { key: "1m", label: "1m" },
  { key: "3m", label: "3m" },
  { key: "6m", label: "6m" },
  { key: "1y", label: "1y" },
];

type HomeMainProps = {
  filter: Filter;
  handleFilterChange: (next: Filter) => void;
  gearCombat: string;
  gearSlot: string;
  gearTier: string;
  gearSet: string;
  skill: string;
  supplyType: string;
  query: string;
  sort: SortKey;
  range: RangeKey;
  patchSearch: (patch: Partial<HomeSearch>) => void;
  rsnDraft: string;
  setRsnDraft: (v: string) => void;
  activeRsn: string | null;
  playerQuery: UseQueryResult<{ name?: string; skills?: PlayerSkills }, Error>;
  playerSkills: PlayerSkills | null;
  loadRsn: (rsn: string) => void;
  clearRsn: () => void;
  skillBarEntries: { key: string; icon: string; label: string; level: number }[];
  showGearSub: boolean;
  showSkillSub: boolean;
  showSupplySub: boolean;
  availableSets: ReturnType<typeof gearSetsForTier>;
  snapshot: UseQueryResult<PriceRow[], Error>;
  trends: UseQueryResult<Record<number, Trend>, Error>;
  allRows: PriceRow[];
  itemReqs: Record<number, Record<string, number>>;
  totalCost: number;
  gridKey: string;
};

export function HomeMain({
  filter,
  handleFilterChange,
  gearCombat,
  gearSlot,
  gearTier,
  gearSet,
  skill,
  supplyType,
  query,
  sort,
  range,
  patchSearch,
  rsnDraft,
  setRsnDraft,
  activeRsn,
  playerQuery,
  playerSkills,
  loadRsn,
  clearRsn,
  skillBarEntries,
  showGearSub,
  showSkillSub,
  showSupplySub,
  availableSets,
  snapshot,
  trends,
  allRows,
  itemReqs,
  totalCost,
  gridKey,
}: HomeMainProps) {
  return (
    <main className="mx-auto w-full max-w-7xl px-4 pb-24 pt-8 sm:px-6">
      <div className="sticky top-0 z-30 -mx-4 flex flex-col gap-3 border-b border-border/40 bg-background/95 px-4 py-3 backdrop-blur supports-[backdrop-filter]:bg-background/80 sm:-mx-6 sm:flex-row sm:items-start sm:px-6 pointer-events-auto isolate">
        <div className="flex flex-1 flex-wrap gap-2">
          <Tab active={filter === "all"} onClick={() => handleFilterChange("all")} label="All" />
          <Tab
            active={filter === "gear"}
            onClick={() => handleFilterChange("gear")}
            label="Gear"
            icon={<Shield className="size-3.5" />}
          />
          <Tab
            active={filter === "skilling"}
            onClick={() => handleFilterChange("skilling")}
            label="Skilling Items"
            icon={<Pickaxe className="size-3.5" />}
          />
          <Tab
            active={filter === "supplies"}
            onClick={() => handleFilterChange("supplies")}
            label="Supplies"
            icon={<Package className="size-3.5" />}
          />
        </div>

        <div className="flex w-full flex-col gap-1 sm:w-auto sm:min-w-[12rem]">
          <form
            className="flex items-center gap-1.5"
            onSubmit={(e) => {
              e.preventDefault();
              loadRsn(rsnDraft);
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
                  onClick={clearRsn}
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
            <p className="text-[11px] text-destructive">
              {(playerQuery.error as Error)?.message ?? "Lookup failed"}
            </p>
          )}
          {playerSkills && skillBarEntries.length > 0 && (
            <div className="flex min-w-0 flex-col gap-0.5">
              <p className="truncate text-[10px] font-medium text-muted-foreground">
                {playerQuery.data?.name ?? activeRsn}
              </p>
              <div
                className="flex flex-wrap items-center gap-x-1.5 gap-y-0.5"
                title={skillBarEntries.map((s) => `${s.label} ${s.level}`).join(" · ")}
              >
                {skillBarEntries.map((s) => (
                  <span
                    key={s.key}
                    className="inline-flex items-center gap-0.5 tabular-nums text-[11px] text-muted-foreground"
                    title={`${s.label} ${s.level}`}
                  >
                    <WikiImage
                      icon={s.icon}
                      alt=""
                      width={14}
                      height={14}
                      lazy={false}
                      className="size-3.5 shrink-0"
                      draggable={false}
                    />
                    <span className="font-semibold text-foreground/90">{s.level}</span>
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex w-full flex-col gap-2 sm:w-auto sm:min-w-0 sm:flex-1 sm:max-w-md">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => patchSearch({ q: e.target.value })}
              placeholder="Search items…"
              className="pl-9"
            />
          </div>
          <div className="flex items-center gap-2">
            <Select value={sort} onValueChange={(v) => patchSearch({ sort: v as SortKey })}>
              <SelectTrigger className="h-9 w-[8.5rem] shrink-0 text-xs" aria-label="Sort items">
                <SelectValue placeholder="Sort by…" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="gainers">Gainers</SelectItem>
                <SelectItem value="losers">Losers</SelectItem>
                <SelectItem value="expensive">Expensive</SelectItem>
                <SelectItem value="cheap">Cheap</SelectItem>
                <SelectItem value="value">Best value</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex min-w-0 flex-1 flex-wrap gap-1">
              {RANGE_OPTIONS.map((r) => (
                <button
                  key={r.key}
                  type="button"
                  onClick={() => patchSearch({ range: r.key })}
                  className={`rounded-md px-1.5 py-1 text-[10px] font-semibold tabular-nums transition-colors sm:px-2 sm:text-xs ${
                    range === r.key
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary/60 text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {showGearSub && (
        <div className="mt-4 flex flex-col gap-2.5">
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
            <EquipmentPaperDoll active={gearSlot} onSelect={(slot) => patchSearch({ slot })} />

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
                      label="All stages"
                    />
                    {availableSets.map((s) => (
                      <SubTab
                        key={s.key}
                        active={gearSet === s.key}
                        onClick={() => patchSearch({ set: gearSet === s.key ? "all" : s.key })}
                        label={s.label}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {showSkillSub && (
        <div className="mt-4 flex flex-wrap items-center gap-1.5">
          <SubTab active={skill === "all"} onClick={() => patchSearch({ skill: "all" })} label="All items" />
          {SKILLING_FILTERS.map((f) => (
            <WikiIconTab
              key={f.key}
              active={skill === f.key}
              onClick={() => patchSearch({ skill: skill === f.key ? "all" : f.key })}
              label={f.label}
              wikiIcon={f.wikiIcon}
            />
          ))}
        </div>
      )}

      {showSupplySub && (
        <div className="mt-4 flex flex-wrap items-center gap-1.5">
          <SubTab
            active={supplyType === "all"}
            onClick={() => patchSearch({ supply: "all" })}
            label="All"
          />
          {SUPPLIES_FILTERS.map((f) => (
            <WikiIconTab
              key={f.key}
              active={supplyType === f.key}
              onClick={() => patchSearch({ supply: supplyType === f.key ? "all" : f.key })}
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

      {!snapshot.isLoading && allRows.length > 0 && (
        <>
          {showGearSub && totalCost > 0 && (
            <div className="mt-4 rounded-lg border border-border/60 bg-secondary/30 px-3 py-2 text-sm">
              <span className="text-muted-foreground">Total cost of shown items: </span>
              <span className="font-semibold tabular-nums text-foreground">{formatCompact(totalCost)} gp</span>
              <span className="ml-1.5 text-xs text-muted-foreground">
                ({allRows.length} item{allRows.length === 1 ? "" : "s"})
              </span>
            </div>
          )}
          <div
            key={gridKey}
            className="mt-4 grid grid-cols-2 gap-2 sm:gap-3 lg:grid-cols-3 xl:grid-cols-4"
          >
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
        </>
      )}

      {!snapshot.isLoading && allRows.length === 0 && (
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
