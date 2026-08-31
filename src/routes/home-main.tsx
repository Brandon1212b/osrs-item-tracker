import { useState } from "react";
import { Search } from "lucide-react";
import {
  GEAR_COMBAT_FILTERS,
  GEAR_SLOT_FILTERS,
  GEAR_TIER_FILTERS,
  SKILLING_FILTERS,
  SUPPLIES_FILTERS,
} from "@/lib/osrs-catalog";
import { formatCompact } from "@/lib/format";
import { ItemCard } from "@/components/ItemCard";
import { HomeFiltersSheet } from "@/components/HomeFiltersSheet";
import { Input } from "@/components/ui/input";
import { meetsRequirements, firstMissingRequirement, type PlayerSkills } from "@/lib/player-stats";
import type { PriceRow, RangeKey, Trend } from "@/lib/osrs.server";
import type { UseQueryResult } from "@tanstack/react-query";
import type { gearSetsForTier } from "@/lib/gear-sets";
import { EquipmentPaperDoll, FilterPopover, SkillsPanel, SubTab, WikiIconTab } from "./home-ui";
import type { HomeSearch } from "./index";
import { WikiImage } from "@/components/WikiImage";

type Filter = "all" | "gear" | "skilling" | "supplies";
type SortKey = "gainers" | "losers" | "expensive" | "cheap" | "value";

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
  clearRsn: (rsn?: string) => void;
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
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [gearOpen, setGearOpen] = useState(false);
  const [skillOpen, setSkillOpen] = useState(false);
  const [supplyOpen, setSupplyOpen] = useState(false);

  const combatMeta = GEAR_COMBAT_FILTERS.find((f) => f.key === gearCombat);
  const slotMeta = GEAR_SLOT_FILTERS.find((f) => f.key === gearSlot);
  const tierMeta = GEAR_TIER_FILTERS.find((t) => t.key === gearTier);
  const setMeta = availableSets.find((s) => s.key === gearSet);
  const skillMeta = SKILLING_FILTERS.find((f) => f.key === skill);
  const supplyMeta = SUPPLIES_FILTERS.find((f) => f.key === supplyType);

  const gearLabelParts = [
    combatMeta?.label ?? "All combat",
    slotMeta?.label,
    setMeta?.label ?? tierMeta?.label,
  ].filter(Boolean);
  const gearLabel = gearLabelParts.join(" · ");
  const combatLevel = combatMeta ? playerSkills?.[combatMeta.skillKey] : undefined;
  const skillLevel = skill !== "all" ? playerSkills?.[skill] : undefined;

  return (
    <main className="mx-auto w-full max-w-7xl px-3 pb-6 pt-0 sm:px-4">
      <div className="sticky top-0 z-30 -mx-3 flex items-center gap-2 border-b border-border/40 bg-background/95 px-3 pb-3 pt-[max(0.75rem,env(safe-area-inset-top))] backdrop-blur supports-[backdrop-filter]:bg-background/80 sm:-mx-4 sm:px-4 pointer-events-auto isolate">
        <div className="relative min-w-0 flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => patchSearch({ q: e.target.value })}
            placeholder="Search items…"
            className="pl-9"
            aria-label="Search items"
          />
        </div>
        <HomeFiltersSheet
          open={filtersOpen}
          onOpenChange={setFiltersOpen}
          filter={filter}
          gearCombat={gearCombat}
          skill={skill}
          supplyType={supplyType}
          sort={sort}
          range={range}
          rsnDraft={rsnDraft}
          setRsnDraft={setRsnDraft}
          activeRsn={activeRsn}
          playerQuery={playerQuery}
          loadRsn={loadRsn}
          clearRsn={clearRsn}
          onFilterChange={handleFilterChange}
          onCombatChange={(next) => patchSearch({ filter: "gear", combat: next, set: "all" })}
          onSkillChange={(next) => patchSearch({ filter: "skilling", skill: next })}
          onSupplyChange={(next) => patchSearch({ filter: "supplies", supply: next })}
          onSortChange={(next) => patchSearch({ sort: next })}
          onRangeChange={(next) => patchSearch({ range: next })}
        />
      </div>

      {showGearSub && (
        <div className="mt-3">
          <FilterPopover
            open={gearOpen}
            onOpenChange={setGearOpen}
            icon={
              <WikiImage
                icon={combatMeta?.wikiIcon ?? slotMeta?.wikiIcon ?? "Attack_icon.png"}
                alt=""
                width={22}
                height={22}
                lazy={false}
                className="size-[22px] shrink-0"
              />
            }
            label={`${gearLabel}${combatLevel != null ? ` · ${combatLevel}` : ""}`}
            ariaLabel="Gear filters"
          >
            <div className="flex flex-col gap-3">
              <div className="flex flex-wrap gap-1.5">
                <SubTab
                  active={gearCombat === "all"}
                  onClick={() => patchSearch({ combat: "all", set: "all" })}
                  label="All combat"
                />
                {GEAR_COMBAT_FILTERS.map((f) => (
                  <WikiIconTab
                    key={f.key}
                    active={gearCombat === f.key}
                    onClick={() =>
                      patchSearch({
                        combat: gearCombat === f.key ? "all" : f.key,
                        set: "all",
                      })
                    }
                    label={f.label}
                    wikiIcon={f.wikiIcon}
                    level={playerSkills?.[f.skillKey]}
                  />
                ))}
              </div>

              <div className="flex flex-wrap items-start gap-3">
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
          </FilterPopover>
        </div>
      )}

      {showSkillSub && (
        <div className="mt-3">
          <FilterPopover
            open={skillOpen}
            onOpenChange={setSkillOpen}
            icon={
              skillMeta ? (
                <WikiImage
                  icon={skillMeta.wikiIcon}
                  alt=""
                  width={22}
                  height={22}
                  lazy={false}
                  className="size-[22px] shrink-0"
                />
              ) : undefined
            }
            label={
              skillMeta
                ? `${skillMeta.label}${skillLevel != null ? ` · ${skillLevel}` : ""}`
                : "All items"
            }
            ariaLabel="Skill filter"
          >
            <div className="flex flex-col items-center gap-2">
              <SubTab
                active={skill === "all"}
                onClick={() => patchSearch({ skill: "all" })}
                label="All items"
              />
              <SkillsPanel
                active={skill}
                onSelect={(key) => {
                  patchSearch({ skill: key });
                  setSkillOpen(false);
                }}
                levels={playerSkills}
              />
            </div>
          </FilterPopover>
        </div>
      )}

      {showSupplySub && (
        <div className="mt-3">
          <FilterPopover
            open={supplyOpen}
            onOpenChange={setSupplyOpen}
            icon={
              <WikiImage
                icon={supplyMeta?.wikiIcon ?? "Shark.png"}
                alt=""
                width={22}
                height={22}
                lazy={false}
                className="size-[22px] shrink-0"
              />
            }
            label={supplyMeta?.label ?? "All supplies"}
            ariaLabel="Supplies filter"
          >
            <div className="flex flex-wrap items-center gap-1.5">
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
          </FilterPopover>
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
          {showGearSub && totalCost > 0 && (
            <div className="mt-4 rounded-lg border border-border/60 bg-secondary/30 px-3 py-2 text-sm">
              <span className="text-muted-foreground">Total cost of shown items: </span>
              <span className="font-semibold tabular-nums text-foreground">{formatCompact(totalCost)} gp</span>
              <span className="ml-1.5 text-xs text-muted-foreground">
                ({allRows.length} item{allRows.length === 1 ? "" : "s"})
              </span>
            </div>
          )}
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
